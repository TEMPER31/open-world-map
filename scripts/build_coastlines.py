#!/usr/bin/env python3
"""Convert Natural Earth 1:110m TopoJSON (world-atlas@2.0.2) to the small GeoJSON
files the map draws over the weather field: land polygons (land tint), coastlines
and internal country borders.

world-atlas is built for spherical rendering (d3-geo), so some rings cross the
antimeridian and Antarctica wraps the pole. For a flat Web Mercator map this
script cuts polygons at +/-180 degrees, closes polar rings through the pole, and
breaks lines where they jump across the antimeridian.

Standard library only. Run once; the outputs are committed under site/data/.

    curl -sLO https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json
    python3 scripts/build_coastlines.py countries-110m.json site/data

Natural Earth is public domain. world-atlas is ISC-licensed packaging of it.
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

PRECISION = 2  # ~1 km, far finer than 1:110m


def decode_arcs(topo):
    tf = topo.get("transform")
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for p in arc:
            if tf:
                x += p[0]
                y += p[1]
                pts.append([round(x * tf["scale"][0] + tf["translate"][0], PRECISION),
                            round(y * tf["scale"][1] + tf["translate"][1], PRECISION)])
            else:
                pts.append([round(p[0], PRECISION), round(p[1], PRECISION)])
        out.append(pts)
    return out


def arc_coords(arcs, i):
    return arcs[i] if i >= 0 else arcs[~i][::-1]


def ring(arcs, idx):
    pts = []
    for i in idx:
        a = arc_coords(arcs, i)
        pts.extend(a if not pts else a[1:])
    return pts


def geometry(arcs, g):
    t = g["type"]
    if t == "Polygon":
        return {"type": "Polygon", "coordinates": [ring(arcs, r) for r in g["arcs"]]}
    if t == "MultiPolygon":
        return {"type": "MultiPolygon",
                "coordinates": [[ring(arcs, r) for r in p] for p in g["arcs"]]}
    raise ValueError(t)


def unwrap(ring):
    out = [list(ring[0])]
    for x, y in ring[1:]:
        px = out[-1][0]
        while x - px > 180:
            x -= 360
        while x - px < -180:
            x += 360
        out.append([x, y])
    if abs(out[-1][0] - out[0][0]) > 180:  # encircles a pole: close through it
        pole = -90 if sum(p[1] for p in out) < 0 else 90
        out += [[out[-1][0], pole], [out[0][0], pole], list(out[0])]
    return out


def clip(ring, x0, keep_greater):
    """Sutherland-Hodgman clip of a ring against the vertical line x = x0."""
    inside = (lambda p: p[0] >= x0) if keep_greater else (lambda p: p[0] <= x0)
    out = []
    for i in range(len(ring)):
        a, b = ring[i - 1], ring[i]
        if inside(b):
            if not inside(a):
                out.append(cross(a, b, x0))
            out.append(b)
        elif inside(a):
            out.append(cross(a, b, x0))
    if out and out[0] != out[-1]:
        out.append(list(out[0]))
    return out


def cross(a, b, x0):
    t = (x0 - a[0]) / (b[0] - a[0])
    return [x0, round(a[1] + t * (b[1] - a[1]), PRECISION)]


def area(r):
    return abs(sum(r[i - 1][0] * r[i][1] - r[i][0] * r[i - 1][1] for i in range(len(r)))) / 2


def cut_polygon(rings):
    """Return the parts of a polygon (list of rings) that fall in [-180, 180]."""
    rings = [unwrap(r) for r in rings]
    parts = []
    for shift in (-360, 0, 360):
        moved = [[[x + shift, y] for x, y in r] for r in rings]
        clipped = [clip(clip(r, -180, True), 180, False) for r in moved]
        if len(clipped[0]) >= 4 and area(clipped[0]) > 1e-6:
            parts.append([clipped[0]] + [h for h in clipped[1:] if len(h) >= 4 and area(h) > 1e-6])
    return parts


def split_line(pts):
    """Break a line wherever it jumps across the antimeridian."""
    lines, cur = [], [pts[0]]
    for p in pts[1:]:
        if abs(p[0] - cur[-1][0]) > 180:
            if len(cur) > 1:
                lines.append(cur)
            cur = [p]
        else:
            cur.append(p)
    if len(cur) > 1:
        lines.append(cur)
    return lines


def polygon_arc_ids(g):
    rings = g["arcs"] if g["type"] == "Polygon" else [r for p in g["arcs"] for r in p]
    for r in rings:
        for i in r:
            yield i if i >= 0 else ~i


def main(src, out_dir):
    topo = json.loads(Path(src).read_text())
    arcs = decode_arcs(topo)
    out = Path(out_dir)

    polys, coast = [], []
    for g in topo["objects"]["land"]["geometries"]:
        geom = geometry(arcs, g)
        rings_list = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
        for rings in rings_list:
            polys += cut_polygon(rings)
            for r in rings:
                coast += split_line(r)
    land_fc = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {}, "geometry": {"type": "MultiPolygon", "coordinates": polys}}]}
    coast_fc = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {}, "geometry": {"type": "MultiLineString", "coordinates": coast}}]}

    # Internal borders: arcs shared by two different countries (topojson.mesh a !== b).
    users = defaultdict(set)
    for n, g in enumerate(topo["objects"]["countries"]["geometries"]):
        if g.get("arcs"):
            for i in polygon_arc_ids(g):
                users[i].add(n)
    lines = [part for i, u in sorted(users.items()) if len(u) > 1 for part in split_line(arcs[i])]
    borders_fc = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {},
         "geometry": {"type": "MultiLineString", "coordinates": lines}}]}

    for name, fc in (("ne-110m-land.geojson", land_fc), ("ne-110m-coast.geojson", coast_fc),
                     ("ne-110m-borders.geojson", borders_fc)):
        (out / name).write_text(json.dumps(fc, separators=(",", ":")))
        print(name, (out / name).stat().st_size, "bytes")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
