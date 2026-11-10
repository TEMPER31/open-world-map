#!/usr/bin/env python3
"""Build the place index the map searches in the browser: every town and city in a GeoNames
cities file, with its first-level region (state, province) from the admin1 names file.

Standard library only. Run once; the output is committed under site/data/.

    curl -sLO https://download.geonames.org/export/dump/cities5000.zip
    curl -sLO https://download.geonames.org/export/dump/admin1CodesASCII.txt
    python3 scripts/build_places.py cities5000.zip admin1CodesASCII.txt site/data

The cities file can be the .zip as downloaded or the .txt inside it. Output: places.json,
{"regions": [[country, admin1 code, region name], ...], "places": [[name, region index,
latitude, longitude, population], ...]}, places sorted by population (largest first).
Each place's country is its region's. GeoNames data is CC BY 4.0.
"""
import io
import json
import sys
import zipfile
from pathlib import Path

PRECISION = 2  # ~1 km


def read_lines(path):
    path = Path(path)
    if path.suffix == ".zip":
        with zipfile.ZipFile(path) as z:
            name = next(n for n in z.namelist() if n.endswith(".txt"))
            return io.TextIOWrapper(z.open(name), encoding="utf-8").read().splitlines()
    return path.read_text(encoding="utf-8").splitlines()


def main(cities, admin1, out_dir):
    region_names = {}
    for line in read_lines(admin1):
        code, name = line.split("\t")[:2]
        region_names[code] = name

    rows = []
    for line in read_lines(cities):
        p = line.split("\t")
        # geonames columns: 1 name, 4 latitude, 5 longitude, 8 country code, 10 admin1 code, 14 population
        rows.append((p[1], p[8], p[10], float(p[4]), float(p[5]), int(p[14] or 0)))
    rows.sort(key=lambda r: (-r[5], r[0]))

    regions, index, places = [], {}, []
    for name, country, code, lat, lon, pop in rows:
        if (country, code) not in index:
            index[(country, code)] = len(regions)
            regions.append([country, code, region_names.get(f"{country}.{code}", "")])
        places.append([name, index[(country, code)], round(lat, PRECISION), round(lon, PRECISION), pop])

    out = Path(out_dir) / "places.json"
    out.write_text(json.dumps({"regions": regions, "places": places}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(out.name, out.stat().st_size, "bytes,", len(places), "places,", len(regions), "regions")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
