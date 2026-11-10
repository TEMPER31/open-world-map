#!/usr/bin/env python3
"""Decide whether the refresh timer should start a data run now.

    gh run list --workflow pages.yml --branch main --limit 20 --json createdAt,status > runs.json
    python3 scripts/data/refresh_due.py --manifest-url "$PAGES_URL/data/live/manifest.json" --runs runs.json

GitHub has not been firing the schedule in pages.yml for this repository, so
.github/workflows/refresh.yml checks once an hour. A data run is due when:

  - no "Data and deploy" run on main is queued or running,
  - the site's GFS run is older than the newest cycle that should be complete (f168 lands
    4 h 16 m to 4 h 33 m after the cycle, docs/data-pipeline.md; this allows 4 h 45 m), and
  - no data run started in the last 2 hours, so a failing source is retried every 2 hours
    rather than every hour.

That is one run per GFS cycle, four a day, the same as the schedule. Prints the reason and
writes due=true|false to $GITHUB_OUTPUT when it is set. Standard library only.
"""
import argparse
import datetime as dt
import json
import os
import urllib.request

READY_AFTER = dt.timedelta(hours=4, minutes=45)
RETRY_AFTER = dt.timedelta(hours=2)
BUSY = {"queued", "in_progress", "waiting", "pending", "requested"}
UA = "open-world-map-data/2 (+https://github.com/TEMPER31/open-world-map)"


def parse(s):
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(dt.timezone.utc)


def iso(t):
    return t.strftime("%Y-%m-%d %H:%MZ")


def newest_ready_cycle(now):
    t = now - READY_AFTER
    return t.replace(hour=t.hour - t.hour % 6, minute=0, second=0, microsecond=0)


def decide(now, site_run, runs):
    """(due, reason). site_run is the GFS run the site shows, or None if it could not be read."""
    if any(r.get("status") in BUSY for r in runs):
        return False, "a data run is already queued or running"
    want = newest_ready_cycle(now)
    if site_run is not None and site_run >= want:
        return False, f"the site already has the {iso(site_run)} run (newest complete: {iso(want)})"
    starts = [parse(r["createdAt"]) for r in runs if r.get("createdAt")]
    if starts and now - max(starts) < RETRY_AFTER:
        return False, f"a data run started {int((now - max(starts)).total_seconds() // 60)} min ago; the next try waits for 2 h"
    have = f"the {iso(site_run)} run" if site_run else "data it could not read"
    return True, f"the site has {have}; the {iso(want)} run should be complete"


def site_run(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
            return parse(json.loads(r.read())["gfs"]["run"])
    except Exception as e:  # noqa: BLE001 - an unreadable site means its data can't be shown to be current
        print(f"Site manifest unreadable: {e}")
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--manifest-url", required=True)
    ap.add_argument("--runs", required=True, help="JSON from gh run list (createdAt, status)")
    args = ap.parse_args()
    with open(args.runs) as f:
        runs = json.load(f)
    due, reason = decide(dt.datetime.now(dt.timezone.utc), site_run(args.manifest_url), runs)
    print(("Starting a data run: " if due else "No data run: ") + reason)
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as f:
            f.write(f"due={'true' if due else 'false'}\n")


if __name__ == "__main__":
    main()
