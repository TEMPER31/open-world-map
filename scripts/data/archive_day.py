#!/usr/bin/env python3
"""Write the small daily summary committed to data/archive/ (hourly files are never committed).

    python3 scripts/data/archive_day.py site/data/live/manifest.json data/archive

Runs after the data job. Only acts when the run just processed is the day's 18Z cycle, so
each day gets one file with its four cycles' summaries (from the manifest's rolling history).
Prints the path written, or nothing. Standard library only.
"""
import json
import sys
from pathlib import Path


def main(manifest_path, out_dir):
    man = json.loads(Path(manifest_path).read_text())
    gfs = man["gfs"]
    if gfs.get("stale") or not gfs["run"].endswith("T18:00:00Z"):
        return
    day = gfs["run"][:10]
    runs = [h for h in man.get("history", []) if h.get("gfs_run", "").startswith(day)]
    summary = {"date": day, "generated_utc": man["generated_utc"], "source": gfs["credit"], "license": gfs["license"],
               "aq_source": (man.get("aq") or {}).get("credit"), "aq_license": (man.get("aq") or {}).get("license"),
               "cycles": sorted(runs, key=lambda h: h["gfs_run"])}
    out = Path(out_dir) / f"{day}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(summary, indent=1) + "\n")
    print(out)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
