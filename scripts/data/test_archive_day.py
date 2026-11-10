"""Offline tests for the forecast history carried forward on the deployed site."""

import io
import json
from pathlib import Path
import tempfile
import unittest
from contextlib import redirect_stdout

from scripts.data import archive_day as ad

CITIES = [{"name": "London", "lat": 51.51, "lon": -0.13}, {"name": "Delhi", "lat": 28.61, "lon": 77.21}]
SITE = "https://example.test/data/archive"


def run_entry(run, generated):
    return {"generated_utc": generated, "gfs_run": run, "gfs_source": "nomads", "gfs_stale": False, "seconds": 400}


def manifest(run, generated, history_runs=(), stale=False):
    hist = [run_entry(r, generated) for r in history_runs] + [run_entry(run, generated)]
    return {"generated_utc": generated, "gfs": {"run": run, "stale": stale, "credit": "GFS", "license": "PD"}, "history": hist}


def report(run):
    hours = [{"f": f, "cities": {c["name"]: {"temp": 10 + f / 10 + 0.04, "wind_kmh": 12.34, "wind_from_deg": 271.6,
                                             "pres": 1012.26, "rain": 0.123, "cloud": 50}
                                 for c in CITIES}} for f in range(0, 169)]
    return {"gfs_publish": {"run": run}, "city_raw": {"cities": CITIES, "hours": hours}}


class Web:
    """Stands in for the deployed site: a folder served as URLs, with failures on request."""

    def __init__(self, folder=None, down=()):
        self.folder, self.down, self.asked = folder, set(down), []

    def __call__(self, url):
        name = url.rsplit("/", 1)[1]
        self.asked.append(name)
        if name in self.down or "*" in self.down:
            raise ad.Unreadable(f"{url}: connection reset")
        p = self.folder / name if self.folder else None
        return p.read_bytes() if p and p.exists() else None


def entries(out, kind, month):
    return json.loads((out / f"{kind}-{month}.json").read_text())["entries"]


class HistoryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.enterContext(redirect_stdout(io.StringIO()))

    def build(self, run, generated, name, web, cache="cache", seed=None, **kw):
        out = self.tmp / name
        idx = ad.build(manifest(run, generated, **kw), report(run) if not kw.get("stale") else report("older"),
                       out, SITE, self.tmp / cache if cache else None, seed, get=web)
        return out, idx

    def test_first_build_starts_from_the_seed_and_this_run(self):
        seed = self.tmp / "seed"
        seed.mkdir()
        (seed / "2026-11-04.json").write_text(json.dumps({"date": "2026-11-04", "cycles": [
            run_entry("2026-11-04T00:00:00Z", "2026-11-04T05:00:00Z"), run_entry("2026-11-04T18:00:00Z", "2026-11-04T23:00:00Z")]}))
        out, idx = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "site", Web(), seed=seed)
        self.assertEqual(idx["months"], {"2026-11": {"runs": 3, "points": 1}})
        p = entries(out, "points", "2026-11")[0]["points"]["London"]
        self.assertEqual(len(p["temp"]), 29)                       # every 6 h, f000 to f168
        self.assertEqual(p["temp"][:2], [10.0, 10.6])              # rounded to 0.1 °C
        self.assertEqual((p["wind_from_deg"][0], p["pres"][0], p["rain"][0]), (272, 1012.3, 0.12))
        self.assertEqual([c["name"] for c in idx["points"]], ["London", "Delhi"])
        self.assertTrue((self.tmp / "cache" / "index.json").exists())

    def test_carries_the_published_history_forward(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        out, idx = self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", Web(site), cache=None)
        self.assertEqual(idx["months"]["2026-11"], {"runs": 2, "points": 2})
        self.assertEqual([e["run"] for e in entries(out, "points", "2026-11")], ["2026-11-10T18:00:00Z", "2026-11-11T00:00:00Z"])

    def test_reads_only_months_the_cache_lacks(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web())
        web = Web(site)
        self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", web)
        self.assertEqual(web.asked, ["index.json"])

    def test_cache_restores_history_the_site_lost(self):
        self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web())
        out, idx = self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", Web())   # site has nothing (404)
        self.assertEqual(idx["months"]["2026-11"]["points"], 2)

    def test_site_unreadable_uses_the_cached_copy(self):
        self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web())
        out, idx = self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", Web(down="*"))
        self.assertEqual(idx["months"]["2026-11"]["points"], 2)

    def test_site_unreadable_without_a_cache_stops_before_writing(self):
        with self.assertRaises(SystemExit) as e:
            self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(down="*"), cache=None)
        self.assertIn("stops before deploying", str(e.exception))
        self.assertFalse((self.tmp / "v1").exists())

    def test_unreadable_month_file_stops(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        with self.assertRaises(SystemExit):
            self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", Web(site, down={"points-2026-11.json"}), cache=None)

    def test_listed_month_missing_stops(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        (site / "runs-2026-11.json").unlink()
        with self.assertRaises(SystemExit):
            self.build("2026-11-11T00:00:00Z", "2026-11-11T05:00:00Z", "v2", Web(site), cache=None)

    def test_kept_forecast_adds_no_new_points(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        out, idx = self.build("2026-11-10T18:00:00Z", "2026-11-11T07:00:00Z", "v2", Web(site), cache=None, stale=True)
        self.assertEqual(idx["months"]["2026-11"], {"runs": 1, "points": 1})

    def test_kept_forecast_summary_never_replaces_the_real_one(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        m = manifest("2026-11-10T18:00:00Z", "2026-11-11T07:00:00Z", stale=True)
        m["history"][-1]["gfs_stale"] = True
        out = self.tmp / "v2"
        ad.build(m, {}, out, SITE, None, None, get=Web(site))
        self.assertEqual([(r["generated_utc"], r["gfs_stale"]) for r in entries(out, "runs", "2026-11")], [("2026-11-11T01:00:00Z", False)])

    def test_month_boundary_splits_files(self):
        site, _ = self.build("2026-10-31T18:00:00Z", "2026-11-01T01:00:00Z", "v1", Web(), cache=None)
        out, idx = self.build("2026-11-01T00:00:00Z", "2026-11-01T05:00:00Z", "v2", Web(site), cache=None)
        self.assertEqual(idx["months"], {"2026-10": {"runs": 1, "points": 1}, "2026-11": {"runs": 1, "points": 1}})

    def test_rebuilt_cycle_keeps_one_entry_the_latest(self):
        site, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T01:00:00Z", "v1", Web(), cache=None)
        out, _ = self.build("2026-11-10T18:00:00Z", "2026-11-11T02:30:00Z", "v2", Web(site), cache=None)
        runs = entries(out, "runs", "2026-11")
        self.assertEqual([(r["gfs_run"], r["generated_utc"]) for r in runs], [("2026-11-10T18:00:00Z", "2026-11-11T02:30:00Z")])


if __name__ == "__main__":
    unittest.main()
