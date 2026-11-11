"""Offline tests for GFS source selection and per-hour fallback."""

import datetime as dt
import math
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import DEFAULT, call, patch

from scripts.data import build_data


RUN = dt.datetime(2026, 11, 4, 18, tzinfo=dt.timezone.utc)
OLDER = RUN - dt.timedelta(hours=6)
HOURS = [0, 1, 2]


class BuildGfsTests(unittest.TestCase):
    def setUp(self):
        self.out = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.report = {}
        self.mocks = self.enterContext(patch.multiple(
            build_data,
            HOURS=HOURS,
            ALIGN_POINTS=[],
            SPOT_CITIES=[],
            SERIES_HOURS=[],
            find_cycle=DEFAULT,
            fetch_nomads=DEFAULT,
            fetch_aws=DEFAULT,
            decode=DEFAULT,
            decode_smooth=DEFAULT,
            write_gfs_frame=DEFAULT,
            write_series=DEFAULT,
            notice=DEFAULT,
        ))
        self.find_cycle = self.mocks["find_cycle"]
        self.nomads = self.mocks["fetch_nomads"]
        self.aws = self.mocks["fetch_aws"]
        self.find_cycle.return_value = (RUN, {"f000": None, "f168": None})
        self.nomads.return_value = b"GRIB nomads"
        self.aws.return_value = b"GRIB aws"
        self.mocks["decode"].return_value = {}
        self.mocks["decode_smooth"].side_effect = lambda _wgrib2, _src, _tmp, keys, _raw: {
            key: [0.0] for key in keys
        }
        self.mocks["write_gfs_frame"].side_effect = self.write_frame
        self.mocks["write_series"].side_effect = self.write_series

    @staticmethod
    def write_frame(gdir, hour, fields, run, valid, generated, sizes, rain_hours):
        for size in sizes.values():
            size.append(1)
        return {"f": hour, "rain_hours": rain_hours}

    @staticmethod
    def write_series(gdir, series, run, generated):
        (gdir / "series.png").write_bytes(b"fixture")
        return {"file": "series.png"}

    def build(self, *, prefer_aws=False, gfs_cache=None):
        return build_data.build_gfs(SimpleNamespace(prefer_aws=prefer_aws, gfs_cache=gfs_cache), self.out, RUN, self.report)

    def test_all_nomads(self):
        gfs = self.build()
        self.find_cycle.assert_called_once_with("nomads")
        self.assertEqual(self.nomads.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.aws.assert_not_called()
        self.assertEqual(gfs["source"], "nomads")
        self.assertEqual([frame["f"] for frame in gfs["frames"]], HOURS)

    def test_one_nomads_failure_uses_aws_for_same_hour_and_cycle(self):
        self.nomads.side_effect = [b"GRIB", RuntimeError("missing"), b"GRIB"]
        gfs = self.build()
        self.find_cycle.assert_called_once_with("nomads")
        self.aws.assert_called_once_with(RUN, 1)
        self.assertEqual(self.nomads.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.assertEqual(gfs["run"], build_data.iso(RUN))

    def test_both_missing_one_hour_restarts_from_f000_on_other_cycle(self):
        pub = {"f000": None, "f168": None}
        self.find_cycle.side_effect = [(RUN, pub), (OLDER, pub)]
        self.nomads.side_effect = [b"GRIB", RuntimeError("missing")]
        self.aws.side_effect = [RuntimeError("also missing"), b"GRIB", b"GRIB", b"GRIB"]
        gfs = self.build()
        self.assertEqual(self.find_cycle.call_args_list, [call("nomads"), call("aws")])
        self.assertEqual(self.nomads.call_args_list, [call(RUN, 0), call(RUN, 1)])
        self.assertEqual(self.aws.call_args_list, [call(RUN, 1)] + [call(OLDER, hour) for hour in HOURS])
        self.assertEqual(gfs["source"], "aws")
        self.assertEqual(gfs["run"], build_data.iso(OLDER))
        self.assertEqual(gfs["nomads_hours"], [])
        self.assertEqual(gfs["aws_hours"], HOURS)

    def test_prefer_aws_falls_back_to_nomads_then_resumes_aws(self):
        self.aws.side_effect = [b"GRIB", RuntimeError("missing"), b"GRIB"]
        gfs = self.build(prefer_aws=True)
        self.find_cycle.assert_called_once_with("aws")
        self.nomads.assert_called_once_with(RUN, 1)
        self.assertEqual(self.aws.call_args_list, [call(RUN, hour) for hour in HOURS])
        self.assertEqual(gfs["source"], "aws")
        self.assertEqual(gfs["aws_hours"], [0, 2])
        self.assertEqual(gfs["nomads_hours"], [1])

    def test_per_hour_source_records_match_manifest_report_and_log(self):
        self.nomads.side_effect = [RuntimeError("missing"), b"GRIB", RuntimeError("missing")]
        gfs = self.build()
        expected = {"nomads_hours": [1], "aws_hours": [0, 2]}
        self.assertEqual({key: gfs[key] for key in expected}, expected)
        self.assertEqual(self.report["gfs_hour_sources"], expected)
        self.mocks["notice"].assert_any_call(
            "GFS hour sources", f"{build_data.iso(RUN)}: cycle from nomads; NOMADS 1, AWS 2 of 3 hours"
        )

    def test_both_whole_run_attempts_raise_for_stale_handling(self):
        self.nomads.side_effect = RuntimeError("NOMADS missing")
        self.aws.side_effect = RuntimeError("AWS missing")
        with self.assertRaisesRegex(RuntimeError, "NOMADS missing.*AWS missing"):
            self.build()
        self.assertEqual(self.find_cycle.call_args_list, [call("nomads"), call("aws")])
        self.assertNotIn("gfs_hour_sources", self.report)


class GfsCacheTests(BuildGfsTests):
    """--gfs-cache: the same cycle built by the same code is copied, anything else is built afresh."""

    @staticmethod
    def write_frame(gdir, hour, fields, run, valid, generated, sizes, rain_hours):
        for kind, size in sizes.items():
            (gdir / kind / f"f{hour:03d}.png").write_bytes(f"{kind} {hour}".encode())
            size.append(1)
        return {"f": hour, "rain_hours": rain_hours}

    def setUp(self):
        super().setUp()
        self.mocks["write_gfs_frame"].side_effect = self.write_frame
        self.cache = Path(self.enterContext(tempfile.TemporaryDirectory())) / "gfs-cache"

    def rebuild(self):
        """A second build into a fresh output folder, with fresh download counters."""
        self.out = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.report = {}
        self.nomads.reset_mock()
        self.aws.reset_mock()
        return self.build(gfs_cache=self.cache)

    def test_first_build_downloads_and_fills_the_cache(self):
        first = self.build(gfs_cache=self.cache)
        self.assertEqual(self.nomads.call_count, len(HOURS))
        self.assertTrue(self.report["gfs_cache_saved"])
        self.assertNotIn("gfs_reused", self.report)
        self.assertTrue((self.cache / "gfs" / "wind" / "f000.png").is_file())
        self.assertEqual(first["run"], build_data.iso(RUN))

    def test_same_cycle_is_copied_without_downloading(self):
        first = self.build(gfs_cache=self.cache)
        first_report = dict(self.report)
        again = self.rebuild()
        self.nomads.assert_not_called()
        self.aws.assert_not_called()
        self.assertEqual(again, first)
        self.assertEqual((self.out / "gfs" / "temp" / "f002.png").read_bytes(), b"temp 2")
        self.assertTrue((self.out / "gfs" / "series.png").is_file())
        for key in ("gfs_sizes", "gfs_spot", "align_points", "city_raw", "gfs_hour_sources", "series_kb"):
            self.assertEqual(self.report[key], first_report[key])
        self.assertEqual(self.report["gfs_reused"], {"built_utc": build_data.iso(RUN)})
        self.assertNotIn("gfs_cache_saved", self.report)
        self.assertEqual(self.report["gfs_publish"]["run"], build_data.iso(RUN))

    def test_new_cycle_misses_and_replaces_the_cache(self):
        self.build(gfs_cache=self.cache)
        newer = RUN + dt.timedelta(hours=6)
        self.find_cycle.return_value = (newer, {"f000": None, "f168": None})
        again = self.rebuild()
        self.assertEqual(self.nomads.call_args_list, [call(newer, hour) for hour in HOURS])
        self.assertEqual(again["run"], build_data.iso(newer))
        self.assertTrue(self.report["gfs_cache_saved"])

    def test_changed_build_code_misses(self):
        self.build(gfs_cache=self.cache)
        with patch.object(build_data, "gfs_fingerprint", return_value="other code"):
            self.rebuild()
        self.assertEqual(self.nomads.call_count, len(HOURS))

    def test_incomplete_or_unreadable_cache_misses(self):
        self.build(gfs_cache=self.cache)
        (self.cache / "gfs" / "rain" / "f001.png").unlink()
        self.rebuild()
        self.assertEqual(self.nomads.call_count, len(HOURS))
        (self.cache / "gfs.json").write_text("not json")
        self.rebuild()
        self.assertEqual(self.nomads.call_count, len(HOURS))

    def test_without_a_cache_folder_nothing_is_kept(self):
        self.build()
        self.assertNotIn("gfs_cache_saved", self.report)
        self.assertFalse(self.cache.exists())


class CityPointTests(unittest.TestCase):
    def test_city_names_are_unique(self):
        names = [n for n, _, _ in build_data.CITY_POINTS]
        self.assertEqual(len(names), len(set(names)))

    def test_grid_city_bilinear_and_wind_speed_per_node(self):
        """Wind speed is worked out at each of the four nodes, then interpolated, as the page does."""
        nx, ny, wnx, wny = build_data.NX, build_data.NY, build_data.WNX, build_data.WNY
        fld = {k: [float(i % 97) for i in range(nx * ny)] for k in ("temp", "pres", "cloud", "rain")}
        fld["u"] = [float((i * 7) % 23 - 11) for i in range(wnx * wny)]
        fld["v"] = [float((i * 5) % 19 - 9) for i in range(wnx * wny)]
        name, lat, lon = build_data.CITY_POINTS[0]
        x, y = (lon + 180) / build_data.WDEG, (90 - lat) / build_data.WDEG
        i0, j0, fx, fy = int(x), int(y), x - int(x), y - int(y)
        sp = lambda i, j: math.hypot(fld["u"][j * wnx + i], fld["v"][j * wnx + i]) * 3.6
        want = (sp(i0, j0) * (1 - fx) + sp(i0 + 1, j0) * fx) * (1 - fy) + (sp(i0, j0 + 1) * (1 - fx) + sp(i0 + 1, j0 + 1) * fx) * fy
        self.assertAlmostEqual(build_data.grid_city(fld, name)["wind_kmh"], round(want, 2), places=6)



class GetTests(unittest.TestCase):
    def _429(self, after):
        import email.message, urllib.error
        h = email.message.Message(); h["Retry-After"] = str(after)
        return urllib.error.HTTPError("https://example.test/x", 429, "Too Many Requests", h, None)

    def test_long_retry_after_gives_up_without_waiting_when_capped(self):
        with patch.object(build_data.urllib.request, "urlopen", side_effect=self._429(1652)), \
                patch.object(build_data.time, "sleep") as sleep:
            with self.assertRaisesRegex(RuntimeError, "1652 s"):
                build_data.get("https://example.test/x", retries=2, max_wait=30)
        sleep.assert_not_called()

    def test_short_retry_after_still_waits_and_retries(self):
        class R:
            status, headers = 200, {}
            def read(self): return b"ok"
            def __enter__(self): return self
            def __exit__(self, *a): return False
        with patch.object(build_data.urllib.request, "urlopen", side_effect=[self._429(5), R()]), \
                patch.object(build_data.time, "sleep") as sleep:
            self.assertEqual(build_data.get("https://example.test/x", retries=2, max_wait=30)[2], b"ok")
        sleep.assert_called_once_with(5)

if __name__ == "__main__":
    unittest.main()
