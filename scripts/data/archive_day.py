#!/usr/bin/env python3
"""Forecast history, published with the site at data/archive/ and never committed.

    python3 scripts/data/archive_day.py --manifest site/data/live/manifest.json \\
        --report run-report.json --out site/data/archive \\
        --previous "$PAGES_URL/data/archive" --cache .history-cache --seed data/archive

Every build carries the history forward: it reads what the deployed site already has (and the
copy kept in the Actions cache), adds this run, and writes the result into the site, so nothing
is written to the repository. Two kinds of monthly file, plus index.json:

  runs-YYYY-MM.json    one summary per GFS cycle: run, source, sizes, timings, spot check
  points-YYYY-MM.json  each cycle's forecast at the build's check cities every 6 h to 7 days
                       (raw GFS 0.25 deg values). A later cycle's f000 is the model's own
                       analysis for that hour, so the files hold forecasts and outcomes.

If published history exists but cannot be read, and there is no cached copy, the script stops
with an error: the deploy must never replace the history with less. Standard library only.
"""
import argparse
import json
import os
import shutil
import time
import urllib.error
import urllib.request
from pathlib import Path

UA = "open-world-map-data/2 (+https://github.com/TEMPER31/open-world-map)"
SCHEMA = 1
KINDS = ("runs", "points")
POINT_HOURS = list(range(0, 169, 6))
POINT_VARS = {"temp": 1, "wind_kmh": 1, "wind_from_deg": 0, "pres": 1, "rain": 2}   # decimals kept
POINT_UNITS = {"temp": "°C at 2 m", "wind_kmh": "km/h at 10 m", "wind_from_deg": "degrees, direction the wind comes from",
               "pres": "hPa at mean sea level",
               "rain": "mm/h: the rate at f000; after that the mean over the hour before (3 h after f120)"}


class Unreadable(Exception):
    """A file exists or may exist, but could not be read."""


def fetch(url, retries=3):
    """Bytes at url; None when it does not exist (404). Raises Unreadable on anything else."""
    err = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            err = e
        except Exception as e:  # noqa: BLE001 - network errors of any kind
            err = e
        if attempt + 1 < retries:
            time.sleep(2 ** attempt)
    raise Unreadable(f"{url}: {err}")


def key_of(kind, entry):
    return entry["gfs_run"] if kind == "runs" else entry["run"]


def add(hist, kind, entries):
    """Merge entries by cycle; a later build of the same cycle replaces the earlier one, except
    that a build which only kept an earlier forecast (gfs_stale) never replaces a real one."""
    rank = lambda e: (not e.get("gfs_stale", False), e.get("generated_utc") or "")
    for e in entries:
        k = key_of(kind, e)
        old = hist[kind].get(k)
        if old is None or rank(e) >= rank(old):
            hist[kind][k] = e


def rnd(x, d):
    return None if x is None else (round(x) if d == 0 else round(x, d))


def this_run_points(manifest, report):
    """The current cycle's city forecasts, or None (GFS kept from an earlier run, or no data)."""
    gfs = manifest.get("gfs") or {}
    city = report.get("city_raw")
    if not city or gfs.get("stale") or (report.get("gfs_publish") or {}).get("run") != gfs.get("run"):
        return None, None
    hours = {h["f"]: h["cities"] for h in city["hours"]}
    points = {c["name"]: {v: [rnd(hours.get(f, {}).get(c["name"], {}).get(v), d) for f in POINT_HOURS]
                          for v, d in POINT_VARS.items()} for c in city["cities"]}
    meta = [{"name": c["name"], "lat": c["lat"], "lon": c["lon"]} for c in city["cities"]]
    return {"run": gfs["run"], "generated_utc": manifest["generated_utc"], "points": points}, meta


def load_dir(hist, folder):
    """History from a folder in the published layout. Returns its index (or None)."""
    if not folder or not (folder / "index.json").exists():
        return None
    try:
        index = json.loads((folder / "index.json").read_text())
        for month, counts in index["months"].items():
            for kind in KINDS:
                if counts.get(kind):
                    add(hist, kind, json.loads((folder / f"{kind}-{month}.json").read_text())["entries"])
    except (OSError, ValueError, KeyError) as e:
        notice("Forecast history", f"cached copy unreadable, ignored ({e})")
        return None
    return index


def load_published(hist, previous, cached, get):
    """Add what the deployed site has and the cache lacks. Returns its index, {} when nothing has
    been published yet, or None when it could not be read (only allowed with a cached copy)."""
    try:
        body = get(f"{previous}/index.json")
    except Unreadable as e:
        if not cached:
            raise SystemExit(f"Forecast history: the published history could not be read and there is no cached "
                             f"copy, so this run stops before deploying rather than replace it with less ({e}).")
        notice("Forecast history", f"published copy unreadable, using the cached copy ({e})")
        return None
    if body is None:
        return {}
    index = json.loads(body)
    have = (cached or {}).get("months", {})
    for month, counts in index["months"].items():
        for kind in KINDS:
            if counts.get(kind, 0) > have.get(month, {}).get(kind, 0):
                try:
                    data = get(f"{previous}/{kind}-{month}.json")
                except Unreadable as e:
                    raise SystemExit(f"Forecast history: {kind}-{month}.json could not be read, so this run stops "
                                     f"before deploying rather than replace it with less ({e}).") from e
                if data is None:
                    raise SystemExit(f"Forecast history: {kind}-{month}.json is listed in the published index but missing.")
                add(hist, kind, json.loads(data)["entries"])
    return index


def write(hist, out, meta):
    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True)
    months = {}
    for kind in KINDS:
        by_month = {}
        for k, e in hist[kind].items():
            by_month.setdefault(k[:7], []).append(e)
        for month, entries in by_month.items():
            entries.sort(key=lambda e: key_of(kind, e))
            data = {"schema": SCHEMA, "kind": kind, "month": month, "entries": entries}
            (out / f"{kind}-{month}.json").write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False))
            months.setdefault(month, {})[kind] = len(entries)
    index = {**meta, "months": dict(sorted(months.items()))}
    (out / "index.json").write_text(json.dumps(index, indent=1, ensure_ascii=False) + "\n")
    return index


def build(manifest, report, out, previous=None, cache=None, seed=None, get=fetch):
    report = report or {}
    hist = {k: {} for k in KINDS}
    for f in sorted(seed.glob("*.json")) if seed and seed.is_dir() else []:
        add(hist, "runs", json.loads(f.read_text()).get("cycles", []))
    cached = load_dir(hist, cache)
    published = load_published(hist, previous.rstrip("/"), cached, get) if previous else {}
    add(hist, "runs", manifest.get("history", []))
    entry, cities = this_run_points(manifest, report)
    if entry:
        add(hist, "points", [entry])
    gfs = manifest.get("gfs") or {}
    old_meta = published or cached or {}
    meta = {"schema": SCHEMA, "updated_utc": manifest["generated_utc"],
            "about": "Past GFS runs, kept for a future accuracy page. Carried forward from the deployed site on "
                     "every build and never committed. Points: raw GFS 0.25° values, bilinear from the four "
                     "surrounding grid points; a later run's hour 0 is the model's analysis for that time.",
            "source": gfs.get("credit") or old_meta.get("source"), "license": gfs.get("license") or old_meta.get("license"),
            "points": cities or old_meta.get("points", []), "point_hours": POINT_HOURS, "point_units": POINT_UNITS}
    # never publish less than either copy held (a guard against bugs in the merge above)
    for name, src in (("published", published), ("cached", cached)):
        for month, counts in (src or {}).get("months", {}).items():
            for kind in KINDS:
                have = sum(1 for k in hist[kind] if k.startswith(month))
                if have < counts.get(kind, 0):
                    raise SystemExit(f"Forecast history: {kind}-{month} would shrink from {counts[kind]} ({name}) to {have}.")
    index = write(hist, out, meta)
    if cache:
        shutil.rmtree(cache, ignore_errors=True)
        shutil.copytree(out, cache)
    size = sum(p.stat().st_size for p in out.iterdir())
    notice("Forecast history", f"{len(hist['runs'])} runs, {len(hist['points'])} with city forecasts, "
           f"{len(index['months'])} months, {size / 1024:.0f} KB; " + ("this run's forecast included" if entry else "no new forecast (GFS kept from an earlier run)"))
    return index


def notice(title, msg):
    print(f"::notice title={title}::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"{title}: {msg}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--manifest", required=True, type=Path)
    ap.add_argument("--report", type=Path, help="run-report.json from build_data.py (city forecasts)")
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--previous", default="", help="URL of the deployed data/archive folder")
    ap.add_argument("--cache", type=Path, help="folder that keeps a copy between runs")
    ap.add_argument("--seed", type=Path, help="folder of daily summaries from before the history was published")
    args = ap.parse_args()
    report = json.loads(args.report.read_text()) if args.report and args.report.exists() else {}
    build(json.loads(args.manifest.read_text()), report, args.out, args.previous, args.cache, args.seed)


if __name__ == "__main__":
    main()
