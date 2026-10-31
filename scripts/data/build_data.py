#!/usr/bin/env python3
"""Open World Map data pipeline (Phase 2).

Fetches the latest complete NOAA GFS 0.25 deg cycle (f000-f168: hourly to f120, then 3-hourly) and CAMS air
quality (via Open-Meteo), and writes compact PNG frames plus a manifest for the site.

Standard library only, plus ONE external tool: the wgrib2 binary (path in $WGRIB2),
built from a pinned release by scripts/data/build_wgrib2.sh.

    WGRIB2=/path/to/wgrib2 python3 scripts/data/build_data.py --out out/live \
        --previous https://temper31.github.io/open-world-map/data/live

If a source fails, the previous good files are copied from --previous and marked stale.
Every PNG carries generated_utc, run time, source and licence in a tEXt chunk; the same
metadata is in manifest.json.
"""
import argparse
import array
import datetime as dt
import email.utils
import http.client
import json
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import zlib
from pathlib import Path

UA = "open-world-map-data/2 (+https://github.com/TEMPER31/open-world-map)"
NOMADS = "https://nomads.ncep.noaa.gov"
AWS = "https://noaa-gfs-bdp-pds.s3.amazonaws.com"
OPEN_METEO_AQ = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPEN_METEO_FC = "https://api.open-meteo.com/v1/forecast"

# GFS 0.25 deg is hourly to f120, then 3-hourly (checked against the .idx files on the AWS
# mirror, 12Z 30 Oct 2026: f121, f122, f124, f166 do not exist). 121 + 16 = 137 frames.
HOURS = list(range(0, 121)) + list(range(123, 169, 3))   # f000..f120 hourly, f123..f168 3-hourly
NX, NY, DEG = 720, 361, 0.5         # scalar grid: lon -180..179.5, lat 90..-90
# Wind is stored at 0.75 deg: at 0.5 deg the 8-bit U+V PNG measured ~265-306 KB per hour,
# over the ~150 KB budget. (earth.nullschool draws wind from 1 deg GFS.)
WNX, WNY, WDEG = 480, 241, 0.75
SERIES_DEG = 3                      # place-panel chart grid (2 deg measured 402 KB at 17 steps)
SERIES_HOURS = list(range(0, 49, 3)) + list(range(54, 169, 6))   # 3-hourly to 48 h, then 6-hourly
AQ_DEG = 4                          # 90 x 43 = 3,870 locations; x2 refreshes = 7,740 calls/day
AQ_LATS = [84 - i * AQ_DEG for i in range(43)]        # 84 .. -84
AQ_LONS = [-180 + i * AQ_DEG for i in range(90)]      # -180 .. 176
AQ_FORMAT = "rg16-v2"               # bump when the AQ file format changes (forces a refetch)
AQ_BATCH = 100                      # locations per request
AQ_MAX_PER_MIN = 500                # stay under Open-Meteo's 600/minute
AQ_REFRESH_HOURS = 11               # CAMS updates every 12 h

GFS_CREDIT = "NOAA/NCEP Global Forecast System (GFS) 0.25°"
GFS_LICENSE = "Public domain (U.S. Government work); NOAA requests attribution"
AQ_CREDIT = "CAMS (Copernicus Atmosphere Monitoring Service) via Open-Meteo.com"
AQ_LICENSE = "CC BY 4.0"

INSTANT = r"(anl|[0-9]+ hour fcst)"
RUN_TOTAL = r"0-[0-9]+ (hour|day) acc fcst"   # APCP accumulated since the run started
# key, GRIB short name, level, conversion to display units, which time-range message to use
VARS = [
    ("u", "UGRD", "10 m above ground", lambda x: x, INSTANT),                 # m/s, towards east
    ("v", "VGRD", "10 m above ground", lambda x: x, INSTANT),                 # m/s, towards north
    ("temp", "TMP", "2 m above ground", lambda x: x - 273.15, INSTANT),       # K -> degC
    # Precipitation is the amount that fell in the hour before the valid time (mm = mean
    # mm/h), from the running APCP total: APCP(0-f) - APCP(0-(f-1)). GFS's own "ave"/"acc"
    # windows reset every 6 h (checked against the .idx files); the running total does not.
    # The instantaneous PRATE is used only at f000, which has no accumulation yet.
    ("apcp", "APCP", "surface", lambda x: x, RUN_TOTAL),                       # kg m-2 = mm
    ("prate", "PRATE", "surface", lambda x: x * 3600.0, INSTANT),             # kg m-2 s-1 -> mm/h
    ("cloud", "TCDC", "entire atmosphere", lambda x: x, INSTANT),             # %
    ("pres", "PRMSL", "mean sea level", lambda x: x / 100.0, INSTANT),        # Pa -> hPa
]
MATCH = "|".join(f":{g}:{lvl}:{tr}:" for _, g, lvl, _, tr in VARS)

STATS = {"http_requests": 0, "http_bytes": 0, "aq_locations": 0, "aq_requests": 0, "aq_429": 0,
         "spot_locations": 0, "aq_probe_locations": 0}
NOTICES = []


def now_utc():
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0)


def iso(t):
    return t.strftime("%Y-%m-%dT%H:%M:%SZ")


def notice(title, msg):
    NOTICES.append((title, msg))
    print(f"{title}: {msg}", flush=True)


# ---- HTTP -------------------------------------------------------------------------
def get(url, method="GET", headers=None, timeout=120, retries=4, ok404=False):
    """Returns (status, headers, body). Retries with backoff on network errors / 5xx / 429."""
    h = {"User-Agent": UA, **(headers or {})}
    for attempt in range(retries + 1):
        req = urllib.request.Request(url, method=method, headers=h)
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                body = r.read() if method != "HEAD" else b""
                STATS["http_requests"] += 1
                STATS["http_bytes"] += len(body)
                return r.status, r.headers, body
        except urllib.error.HTTPError as e:
            STATS["http_requests"] += 1
            if e.code == 404 and ok404:
                return 404, e.headers, b""
            if e.code == 429:
                STATS["aq_429"] += "open-meteo" in url
                wait = int(e.headers.get("Retry-After") or 60)
            elif e.code >= 500:
                wait = 2 ** (attempt + 1)
            else:
                raise
        except (urllib.error.URLError, http.client.HTTPException, TimeoutError, ConnectionError) as e:
            wait = 2 ** (attempt + 1)
            if attempt == retries:
                raise RuntimeError(f"{url}: {e}") from e
        if attempt == retries:
            raise RuntimeError(f"{url}: giving up after {retries + 1} attempts")
        time.sleep(wait)


def last_modified(headers):
    v = headers.get("Last-Modified") if headers else None
    return email.utils.parsedate_to_datetime(v) if v else None


# ---- PNG --------------------------------------------------------------------------
def png(width, height, channels, rows, meta, filt=1):
    """8-bit grey (1) or RGB (3) PNG. `rows` is a list of bytes objects (one per row).
    filt: 0 = None, 1 = Sub. Measured on real frames: Sub suits wind/temperature/pressure,
    None suits the patchier cloud and rain fields. zlib level 9."""
    raw = bytearray()
    for row in rows:
        raw.append(filt)
        raw += row if filt == 0 else bytes((row[i] - (row[i - channels] if i >= channels else 0)) & 255 for i in range(len(row)))

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    color = {1: 0, 3: 2}[channels]
    out = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, color, 0, 0, 0))
    text = json.dumps(meta, separators=(",", ":"), ensure_ascii=True).encode("latin-1")
    out += chunk(b"tEXt", b"owm-meta\x00" + text)
    out += chunk(b"tEXt", b"Source\x00" + meta["source"].encode("latin-1", "replace"))
    out += chunk(b"tEXt", b"Copyright\x00" + meta["license"].encode("latin-1", "replace"))
    out += chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    return out


def q_linear(vals, lo, hi, nodata=None):
    """Quantise to 0..255 linearly (or 1..255 with 0 = no data)."""
    span = (hi - lo) or 1.0
    if nodata is None:
        k = 255.0 / span
        return bytes(min(255, max(0, int((x - lo) * k + 0.5))) for x in vals)
    k = 254.0 / span
    return bytes(0 if x is None else min(255, max(1, 1 + int((x - lo) * k + 0.5))) for x in vals)


def rows16(vals, offset, step, nx, ny, nodata=False):
    """16-bit values in an RGB PNG: R = high byte, G = low byte, B = 0.
    value = offset + step * (R * 256 + G); with nodata=True, 65535 means no data."""
    top = 65534 if nodata else 65535
    q = [65535 if x is None else min(top, max(0, int(round((x - offset) / step)))) for x in vals]
    return [bytes(b for i in range(j * nx, (j + 1) * nx) for b in (q[i] >> 8, q[i] & 255, 0)) for j in range(ny)]


def q_log_rain(vals):
    """0 = below 0.01 mm/h; b in 1..255 means 10 ** ((b - 1) * 0.02 - 2) mm/h."""
    out = bytearray(len(vals))
    for i, x in enumerate(vals):
        if x >= 0.01:
            out[i] = min(255, 1 + int((math.log10(x) + 2) * 50 + 0.5))
    return bytes(out)


# ---- GFS --------------------------------------------------------------------------
def cycle_paths(run):
    d, c = run.strftime("%Y%m%d"), run.strftime("%H")
    return d, c, f"gfs.{d}/{c}/atmos", f"gfs.t{c}z.pgrb2.0p25"


def file_url(source, run, f):
    d, c, folder, stem = cycle_paths(run)
    base = f"{NOMADS}/pub/data/nccf/com/gfs/prod" if source == "nomads" else AWS
    return f"{base}/{folder}/{stem}.f{f:03d}"


def find_cycle(source):
    """Newest cycle whose last forecast hour (f168) index exists (so the whole 7-day window is published)."""
    t = now_utc()
    run = t.replace(minute=0, second=0, hour=t.hour - t.hour % 6)
    for _ in range(6):
        st, hdr, _ = get(file_url(source, run, HOURS[-1]) + ".idx", method="HEAD", ok404=True, retries=2)
        if st == 200:
            st0, hdr0, _ = get(file_url(source, run, 0) + ".idx", method="HEAD", ok404=True, retries=2)
            return run, {"f000": last_modified(hdr0), "f168": last_modified(hdr)}
        run -= dt.timedelta(hours=6)
    raise RuntimeError(f"{source}: no complete GFS cycle in the last 36 h")


NOMADS_FILTER_SCRIPT = None


def fetch_nomads(run, f):
    """NOMADS grib filter: server-side subset to the variables/levels we need."""
    global NOMADS_FILTER_SCRIPT
    d, c, folder, stem = cycle_paths(run)
    q = {"dir": f"/{folder}", "file": f"{stem}.f{f:03d}"}
    for _, g, lvl, _, _ in VARS:
        q[f"var_{g}"] = "on"
        q["lev_" + lvl.replace(" ", "_")] = "on"
    # the script that worked last goes first; the other is still tried (hourly vs 3-hourly files)
    scripts = sorted(["filter_gfs_0p25.pl", "filter_gfs_0p25_1hr.pl"], key=lambda x: x != NOMADS_FILTER_SCRIPT)
    last = None
    for s in scripts:
        url = f"{NOMADS}/cgi-bin/{s}?{urllib.parse.urlencode(q)}"
        try:
            st, _, body = get(url, ok404=True, timeout=180)
        except Exception as e:  # noqa: BLE001 - try the alternative script name
            last = e
            continue
        if st == 200 and body[:4] == b"GRIB":
            NOMADS_FILTER_SCRIPT = s
            time.sleep(1.0)  # be gentle with NOMADS
            return body
        last = RuntimeError(f"{s}: HTTP {st}, {len(body)} bytes")
    raise RuntimeError(f"NOMADS filter failed for f{f:03d}: {last}")


def fetch_aws(run, f):
    """AWS Open Data mirror: read the .idx and download only the messages we need."""
    url = file_url("aws", run, f)
    _, _, idx = get(url + ".idx")
    lines = idx.decode().splitlines()
    starts = [int(l.split(":")[1]) for l in lines]
    want = re.compile(MATCH)
    ranges = []
    for i, line in enumerate(lines):
        if want.search(":" + line.split(":", 3)[3] if line.count(":") >= 3 else ""):
            end = starts[i + 1] - 1 if i + 1 < len(lines) else ""
            ranges.append([starts[i], end])
    merged = []
    for a, b in sorted(ranges):
        if merged and merged[-1][1] != "" and a == merged[-1][1] + 1:
            merged[-1][1] = b
        else:
            merged.append([a, b])
    out = b""
    for a, b in merged:
        _, _, body = get(url, headers={"Range": f"bytes={a}-{b}"})
        out += body
    return out


# Grid-alignment test nodes: on the 0.5 deg grid, with strong gradients nearby, so a shifted
# or flipped grid would show up as large errors. Raw GFS values here go into the run report.
ALIGN_POINTS = [("Tokyo Bay", 35.5, 139.5), ("Chile coast", -33.5, -71.5), ("Springfield", 40.0, -89.5)]
# Accuracy-check cities: raw GFS 0.25 deg values, bilinear from the four surrounding native
# grid points, are recorded every hour so the page can be compared with NOAA's own numbers.
CITY_POINTS = [("Springfield IL", 39.80, -89.64), ("Miami", 25.76, -80.19), ("Denver", 39.74, -104.99),
               ("London", 51.51, -0.13), ("Delhi", 28.61, 77.21)]


def city_corners():
    """[(lat, lon)] of the 4 native 0.25 deg nodes around each city, plus bilinear weights."""
    pts, wts = [], []
    for _, la, lo in CITY_POINTS:
        la0, lo0 = math.floor(la / 0.25) * 0.25, math.floor(lo / 0.25) * 0.25
        fy, fx = (la - la0) / 0.25, (lo - lo0) / 0.25
        pts += [(la0, lo0), (la0, lo0 + 0.25), (la0 + 0.25, lo0), (la0 + 0.25, lo0 + 0.25)]
        wts.append(((1 - fx) * (1 - fy), fx * (1 - fy), (1 - fx) * fy, fx * fy))
    return pts, wts


CORNERS, CORNER_W = city_corners()


def city_values(vals):
    """Bilinear city values from the 4 corner values per city (in CORNERS order)."""
    return {name: sum(w * vals[4 * c + k] for k, w in enumerate(CORNER_W[c])) for c, (name, _, _) in enumerate(CITY_POINTS)}


def decode(wgrib2, src, tmp, keys, nx, ny, deg, raw_points=None):
    """Decode instantaneous messages for `keys` onto a nx x ny grid (rows N->S).
    wgrib2 -lola samples the nearest grid point; at multiples of 0.25 deg these are exact
    GFS points (decimation, no interpolation). If raw_points is a dict, it is filled with
    wgrib2's own value at each ALIGN_POINTS node: {name: {key: value}}."""
    dst = tmp / "out.bin"
    match = "|".join(f":{g}:{lvl}:{tr}:" for key, g, lvl, _, tr in VARS if key in keys)
    probes = [(la, lo) for _, la, lo in ALIGN_POINTS] + CORNERS if raw_points is not None else []
    lon_args = [a for la, lo in probes for a in ("-lon", str(lo), str(la))]
    inv = subprocess.run(
        [wgrib2, str(src), "-match", match, "-no_header", "-s", *lon_args,
         "-lola", f"180:{nx}:{deg}", f"-90:{ny}:{deg}", str(dst), "bin"],
        capture_output=True, text=True, check=True).stdout.splitlines()
    data = array.array("f")
    data.frombytes(dst.read_bytes())
    if sys.byteorder != "little":
        data.byteswap()
    n = nx * ny
    out = {}
    for k, line in enumerate(inv):
        for key, g, lvl, conv, _ in VARS:
            if key in keys and f":{g}:{lvl}:" in line and key not in out:
                rec = data[k * n:(k + 1) * n]
                out[key] = [conv(x) for j in range(ny) for x in rec[(ny - 1 - j) * nx:(ny - j) * nx]]  # S->N to N->S
                if raw_points is not None:
                    vals = [conv(float(v)) for v in re.findall(r"val=([-0-9.eE+]+)", line)]
                    for (name, _, _), val in zip(ALIGN_POINTS, vals):
                        raw_points.setdefault(name, {})[key] = round(val, 3)
                    for name, val in city_values(vals[len(ALIGN_POINTS):]).items():
                        raw_points.setdefault("__city__", {}).setdefault(name, {})[key] = round(val, 3)
    missing = [k for k in keys if k not in out]
    if missing:
        raise RuntimeError(f"decode: missing {missing} (inventory: {inv})")
    return out


FULL_NX, FULL_NY = 1440, 721        # native GFS 0.25 deg grid: lon 0..359.75, lat 90..-90


def decode_smooth(wgrib2, src, tmp, keys, raw_points=None):
    """Decode `keys` at full 0.25 deg resolution and reduce to the 0.5 deg grid with a 3x3 tent
    filter ([1,2,1] x [1,2,1] / 16) centred on each 0.5 deg node. Used for patchy fields (cloud
    cover, precipitation), where taking every second point aliases badly: at Denver, 18Z
    29 Oct f004 cloud cover was 8 % at 0.25 deg but 47 % at the decimated 0.5 deg node."""
    dst = tmp / "full.bin"
    match = "|".join(f":{g}:{lvl}:{tr}:" for key, g, lvl, _, tr in VARS if key in keys)
    lon_args = [a for _, la, lo in ALIGN_POINTS for a in ("-lon", str(lo), str(la))] if raw_points is not None else []
    # default row order is south -> north (wgrib2's -lon needs it); rows are flipped below
    inv = subprocess.run([wgrib2, str(src), "-match", match, "-s", *lon_args,
                          "-no_header", "-bin", str(dst)], capture_output=True, text=True, check=True).stdout.splitlines()
    data = array.array("f")
    data.frombytes(dst.read_bytes())
    if sys.byteorder != "little":
        data.byteswap()
    n, half, out = FULL_NX * FULL_NY, FULL_NX // 2, {}
    for k, line in enumerate(inv):
        for key, g, lvl, conv, _ in VARS:
            if key not in keys or f":{g}:{lvl}:" not in line or key in out:
                continue
            rec = data[k * n:(k + 1) * n]
            hrows = {}

            def hrow(J):  # J counts from the north; horizontal tent at every second column from lon -180
                J = min(FULL_NY - 1, max(0, J))
                if J not in hrows:
                    S = FULL_NY - 1 - J
                    row = rec[S * FULL_NX:(S + 1) * FULL_NX]
                    row = row[half:] + row[:half]
                    hrows[J] = [(row[c - 1] + 2 * row[c] + row[c + 1 - FULL_NX]) * 0.25 for c in range(0, FULL_NX, 2)]
                return hrows[J]
            grid = []
            for j in range(NY):
                a, b, c = hrow(2 * j - 1), hrow(2 * j), hrow(2 * j + 1)
                grid.extend(conv((x + 2 * y + z) * 0.25) for x, y, z in zip(a, b, c))
                hrows.pop(2 * j - 1, None)
            out[key] = grid
            if raw_points is not None:
                vals = re.findall(r"lon=([-0-9.]+),lat=([-0-9.]+),val=([-0-9.eE+]+)", line)
                for (name, _, _), (_, _, val) in zip(ALIGN_POINTS, vals):
                    raw_points.setdefault(name, {})[key + "_raw"] = round(conv(float(val)), 3)
                # raw 0.25 deg values at the city corners (rows stored south -> north)
                cv = [conv(rec[int(round((la + 90) / 0.25)) * FULL_NX + int(round((lo % 360) / 0.25)) % FULL_NX]) for la, lo in CORNERS]
                for name, val in city_values(cv).items():
                    raw_points.setdefault("__city__", {}).setdefault(name, {})[key] = round(val, 4)
    missing = [k for k in keys if k not in out]
    if missing:
        raise RuntimeError(f"decode_smooth: missing {missing} (inventory: {inv})")
    return out


def node_value(grid, lat, lon):
    return grid[int(round((90 - lat) / DEG)) * NX + int(round((lon + 180) / DEG)) % NX]


def build_gfs(args, out, generated, report):
    wgrib2 = os.environ.get("WGRIB2", "wgrib2")
    errors = []
    for source in (["aws", "nomads"] if args.prefer_aws else ["nomads", "aws"]):
        try:
            t0 = time.time()
            run, pub = find_cycle(source)
            notice("GFS cycle", f"{source}: run {iso(run)}; f000 published {iso(pub['f000']) if pub['f000'] else '?'}, "
                   f"f168 {iso(pub['f168']) if pub['f168'] else '?'}"
                   + (f" (+{(pub['f168'] - run).total_seconds() / 60:.0f} min after cycle)" if pub["f168"] else ""))
            report["gfs_publish"] = {"source": source, "run": iso(run),
                                     **{k: iso(v) if v else None for k, v in pub.items()}}
            gdir = out / "gfs"
            for k in ("wind", "temp", "rain", "cloud", "pres"):
                (gdir / k).mkdir(parents=True, exist_ok=True)
            frames, sizes, spot = [], {k: [] for k in ("wind", "temp", "rain", "cloud", "pres")}, {}
            series = []
            align = []   # raw GFS values at ALIGN_POINTS, every hour (for the alignment test)
            prev_total, prev_f = None, 0   # running APCP total at the previous frame (0.5 deg, smoothed)
            prev_city_total, city_raw = {}, []
            with tempfile.TemporaryDirectory() as td:
                for f in HOURS:
                    grib = fetch_nomads(run, f) if source == "nomads" else fetch_aws(run, f)
                    src = Path(td) / "in.grb2"
                    src.write_bytes(grib)
                    raw = {}
                    fld = decode(wgrib2, src, Path(td), ("temp", "pres"), NX, NY, DEG, raw)
                    fld.update(decode_smooth(wgrib2, src, Path(td), ("cloud", "apcp" if f else "prate"), raw))
                    if f == 0:
                        fld["rain"] = fld.pop("prate")
                    else:
                        total = fld.pop("apcp")
                        prev = prev_total or [0.0] * len(total)
                        # mean rate since the previous frame: 1 h to f120, then 3 h (mm/h)
                        span = f - prev_f
                        fld["rain"] = [max(0.0, a - b) / span for a, b in zip(total, prev)]
                        prev_total = total
                    rain_hours = f - prev_f if f else 0
                    prev_f = f
                    # alignment reference for the smoothed fields = the pipeline's own node value
                    for name, la, lo in ALIGN_POINTS:
                        raw.setdefault(name, {})["cloud"] = round(node_value(fld["cloud"], la, lo), 3)
                        raw[name]["rain"] = round(node_value(fld["rain"], la, lo), 3)
                        raw[name].pop("apcp_raw", None)
                    align.append({"f": f, "points": raw})
                    fld.update(decode(wgrib2, src, Path(td), ("u", "v"), WNX, WNY, WDEG, raw))
                    city = raw.pop("__city__", {})
                    for name, c in city.items():
                        if "apcp" in c:
                            total_c = c.pop("apcp")
                            c["rain"] = round(max(0.0, total_c - prev_city_total.get(name, 0.0)) / max(1, rain_hours), 4)
                            prev_city_total[name] = total_c
                        elif "prate" in c:
                            c["rain"] = c.pop("prate")
                        if "u" in c:
                            c["wind_kmh"] = round(math.hypot(c["u"], c["v"]) * 3.6, 2)
                            c["wind_from_deg"] = round((math.degrees(math.atan2(-c["u"], -c["v"])) + 360) % 360, 1)
                    for name, c in city.items():
                        c["grid"] = grid_city(fld, name)
                    city_raw.append({"f": f, "cities": city})
                    valid = run + dt.timedelta(hours=f)
                    fr = write_gfs_frame(gdir, f, fld, run, valid, generated, sizes, rain_hours)
                    frames.append(fr)
                    if f in SERIES_HOURS:
                        series.append(series_rows(fld))
                    if f in (0, 24, 120):
                        spot[f] = {name: sample_point(fld, lat, lon) for name, lat, lon in SPOT_CITIES}
            series_meta = write_series(gdir, series, run, generated)
            report["series_kb"] = round((gdir / "series.png").stat().st_size / 1024, 1)
            report["gfs_seconds"] = round(time.time() - t0, 1)
            report["gfs_sizes"] = {k: {"min": min(v), "max": max(v), "mean": round(sum(v) / len(v))} for k, v in sizes.items()}
            report["gfs_spot"] = spot
            report["align_points"] = {"nodes": [{"name": n, "lat": la, "lon": lo} for n, la, lo in ALIGN_POINTS], "hours": align}
            report["city_raw"] = {"cities": [{"name": n, "lat": la, "lon": lo} for n, la, lo in CITY_POINTS], "hours": city_raw}
            return {"run": iso(run), "source": source, "filter": NOMADS_FILTER_SCRIPT if source == "nomads" else None,
                    "credit": GFS_CREDIT, "license": GFS_LICENSE, "stale": False, "frames": frames, "series": series_meta,
                    "grid": {"nx": NX, "ny": NY, "deg": DEG, "lon0": -180, "lat0": 90,
                             "note": "0.5°: every second GFS 0.25° point (no interpolation)"},
                    "wind_grid": {"nx": WNX, "ny": WNY, "deg": WDEG, "lon0": -180, "lat0": 90,
                                  "note": "0.75°: every third GFS 0.25° point (no interpolation)"}}
        except Exception as e:  # noqa: BLE001 - fall through to the next source
            errors.append(f"{source}: {e}")
            notice("GFS source failed", f"{source}: {e}")
    raise RuntimeError("; ".join(errors))


def write_gfs_frame(gdir, f, fld, run, valid, generated, sizes, rain_hours=1):
    base = {"generated_utc": iso(generated), "run_utc": iso(run), "valid_utc": iso(valid),
            "source": GFS_CREDIT, "license": GFS_LICENSE}
    name = f"f{f:03d}.png"
    meta = {}
    # wind: R = U, G = V (m/s, the direction the air moves towards), B unused
    u, v = fld["u"], fld["v"]
    umin, umax = math.floor(min(u)), math.ceil(max(u))
    vmin, vmax = math.floor(min(v)), math.ceil(max(v))
    qu, qv = q_linear(u, umin, umax), q_linear(v, vmin, vmax)
    rows = [bytes(b for i in range(j * WNX, (j + 1) * WNX) for b in (qu[i], qv[i], 0)) for j in range(WNY)]
    m = {**base, "field": "wind", "units": "m/s", "encoding": "uv8", "u": [umin, umax], "v": [vmin, vmax]}
    put(gdir / "wind" / name, png(WNX, WNY, 3, rows, m, 1), sizes["wind"])
    meta["wind"] = {"u": [umin, umax], "v": [vmin, vmax]}
    # Temperature and pressure: 16-bit (R = high, G = low byte). Steps chosen by measured PNG
    # size on real frames to stay within ~150 KB/hour: 0.2 degC (142 KB; 0.1 degC was 184 KB)
    # and 0.1 hPa (142 KB). 8-bit over the global range was ~0.43 degC / ~0.4 hPa per step.
    for key, units, step in (("temp", "°C", 0.2), ("pres", "hPa", 0.1)):
        vals = fld[key]
        lo = math.floor(min(vals))
        m = {**base, "field": key, "units": units, "encoding": "rg16", "offset": lo, "step": step}
        put(gdir / key / name, png(NX, NY, 3, rows16(vals, lo, step, NX, NY), m, 1), sizes[key])
        meta[key] = {"offset": lo, "step": step}
    # Cloud cover in whole percent (byte = %). Area-averaged values compressed to ~157 KB/hour
    # at 0.39 % steps; whole percent measured 125 KB and is ample precision for cloud cover.
    qb = bytes(min(100, max(0, int(round(x)))) for x in fld["cloud"])
    m = {**base, "field": "cloud", "units": "%", "encoding": "linear8", "range": [0.0, 255.0]}
    put(gdir / "cloud" / name, png(NX, NY, 1, [qb[j * NX:(j + 1) * NX] for j in range(NY)], m, 0), sizes["cloud"])
    meta["cloud"] = {"range": [0.0, 255.0]}
    qb = q_log_rain(fld["rain"])
    m = {**base, "field": "rain", "units": "mm/h", "encoding": "log8", "log10_offset": -2, "log10_scale": 0.02,
         "rain_hours": rain_hours,
         "note": "mean rate (mm/h) over the rain_hours before valid_utc: 1 h to f120, 3 h after (f000: instantaneous rate)"}
    put(gdir / "rain" / name, png(NX, NY, 1, [qb[j * NX:(j + 1) * NX] for j in range(NY)], m, 0), sizes["rain"])
    return {"f": f, "valid_utc": iso(valid), "rain_hours": rain_hours, **meta}


def series_rows(fld):
    """Temperature (degC) and wind speed (km/h) on the coarse series grid, rows N->S."""
    sn, sm = 360 // SERIES_DEG, 180 // SERIES_DEG + 1
    st, ss = [], []
    for j in range(sm):
        lat = 90 - j * SERIES_DEG
        jt = int(round((90 - lat) / DEG))
        jw = min(WNY - 1, int(round((90 - lat) / WDEG)))
        for i in range(sn):
            lon = -180 + i * SERIES_DEG
            st.append(fld["temp"][jt * NX + int(round((lon + 180) / DEG)) % NX])
            k = jw * WNX + int(round((lon + 180) / WDEG)) % WNX
            ss.append(math.hypot(fld["u"][k], fld["v"][k]) * 3.6)
    return st, ss


def write_series(gdir, series, run, generated):
    """One RGB atlas: R = temperature, G = wind speed; one block of rows per step."""
    sn, sm = 360 // SERIES_DEG, 180 // SERIES_DEG + 1
    tl = math.floor(min(min(t) for t, _ in series))
    th = math.ceil(max(max(t) for t, _ in series))
    wh = math.ceil(max(max(w) for _, w in series))
    rows = []
    for t, w in series:
        qt, qw = q_linear(t, tl, th), q_linear(w, 0, wh)
        rows += [bytes(b for i in range(j * sn, (j + 1) * sn) for b in (qt[i], qw[i], 0)) for j in range(sm)]
    hours = SERIES_HOURS
    meta = {"generated_utc": iso(generated), "run_utc": iso(run), "source": GFS_CREDIT, "license": GFS_LICENSE,
            "field": "series", "encoding": "rgb8 R=temp G=wind_kmh", "temp": [tl, th], "wind_kmh": [0, wh],
            "hours": hours, "grid": {"nx": sn, "ny": sm, "deg": SERIES_DEG, "lon0": -180, "lat0": 90}}
    (gdir / "series.png").write_bytes(png(sn, sm * len(series), 3, rows, meta, 1))
    return {k: meta[k] for k in ("temp", "wind_kmh", "hours", "grid")}


def put(path, data, sizes):
    path.write_bytes(data)
    sizes.append(len(data))


def grid_city(fld, name):
    """Bilinear value at a CITY_POINTS city from the grids as stored (before PNG encoding), the
    way the page samples them (wind speed per node, then interpolated). Splits the page-vs-NOAA
    difference into grid resolution (this vs raw 0.25 deg) and encoding (page vs this)."""
    _, lat, lon = next(c for c in CITY_POINTS if c[0] == name)

    def s(a, nx, deg):
        x, y = (lon + 180) / deg, (90 - lat) / deg
        i0, j0 = int(x), int(y)
        fx, fy = x - i0, y - j0
        g = lambda i, j: a[j * nx + i % nx]
        return (g(i0, j0) * (1 - fx) + g(i0 + 1, j0) * fx) * (1 - fy) + (g(i0, j0 + 1) * (1 - fx) + g(i0 + 1, j0 + 1) * fx) * fy
    speed = [math.hypot(a, b) * 3.6 for a, b in zip(fld["u"], fld["v"])]
    return {"temp": round(s(fld["temp"], NX, DEG), 3), "pres": round(s(fld["pres"], NX, DEG), 3),
            "cloud": round(s(fld["cloud"], NX, DEG), 2), "rain": round(s(fld["rain"], NX, DEG), 4),
            "wind_kmh": round(s(speed, WNX, WDEG), 2)}


SPOT_CITIES = [("London", 51.51, -0.13), ("New York", 40.71, -74.01), ("Tokyo", 35.68, 139.69)]


def sample_point(fld, lat, lon):
    """Bilinear sample at a point (for the spot check)."""
    def s(a, nx, deg):
        x, y = (lon + 180) / deg, (90 - lat) / deg
        i0, j0 = int(x), int(y)
        fx, fy = x - i0, y - j0
        g = lambda i, j: a[j * nx + i % nx]
        return (g(i0, j0) * (1 - fx) + g(i0 + 1, j0) * fx) * (1 - fy) + (g(i0, j0 + 1) * (1 - fx) + g(i0 + 1, j0 + 1) * fx) * fy
    u, v = s(fld["u"], WNX, WDEG), s(fld["v"], WNX, WDEG)
    return {"temp_c": round(s(fld["temp"], NX, DEG), 1), "wind_kmh": round(math.hypot(u, v) * 3.6, 1),
            "wind_from_deg": round((math.degrees(math.atan2(-u, -v)) + 360) % 360)}


# ---- Air quality (CAMS via Open-Meteo) ----------------------------------------------
def build_aq(args, out, generated, report, gfs_run):
    points = [(la, lo) for la in AQ_LATS for lo in AQ_LONS]
    start = gfs_run - dt.timedelta(hours=0)
    t0 = time.time()
    series = {}   # valid hour (unix) -> list per point of (pm25, pm10, us_aqi)
    sent_this_minute, minute_start = 0, time.time()
    for b in range(0, len(points), AQ_BATCH):
        batch = points[b:b + AQ_BATCH]
        if sent_this_minute + len(batch) > AQ_MAX_PER_MIN:
            time.sleep(max(0, 61 - (time.time() - minute_start)))
            sent_this_minute, minute_start = 0, time.time()
        q = {"latitude": ",".join(f"{la:g}" for la, _ in batch), "longitude": ",".join(f"{lo:g}" for _, lo in batch),
             "hourly": "pm2_5,pm10,us_aqi", "domains": "cams_global", "timezone": "GMT", "timeformat": "unixtime",
             "past_days": 1, "forecast_days": 6}   # 7 days of data = 1 call per location
        _, _, body = get(f"{OPEN_METEO_AQ}?{urllib.parse.urlencode(q)}", timeout=120)
        STATS["aq_requests"] += 1
        STATS["aq_locations"] += len(batch)
        sent_this_minute += len(batch)
        res = json.loads(body)
        res = res if isinstance(res, list) else [res]
        if len(res) != len(batch):
            raise RuntimeError(f"Open-Meteo returned {len(res)} locations for {len(batch)}")
        for k, r in enumerate(res):
            h = r["hourly"]
            for i, t in enumerate(h["time"]):
                series.setdefault(t, [None] * len(points))[b + k] = (h["pm2_5"][i], h["pm10"][i], h["us_aqi"][i])
    window = [int((gfs_run + dt.timedelta(hours=f)).timestamp()) for f in HOURS]
    adir = out / "aq"
    adir.mkdir(parents=True, exist_ok=True)
    files, sizes, nonnull = [], [], []
    base = {"generated_utc": iso(generated), "source": AQ_CREDIT, "license": AQ_LICENSE}
    for t in sorted(series):
        if t < window[0] - 6 * 3600 or t > window[-1] + 12 * 3600:
            continue
        vals = series[t]
        pm25 = [v[0] if v else None for v in vals]
        pm10 = [v[1] if v else None for v in vals]
        aqi = [v[2] if v else None for v in vals]
        share = sum(x is not None for x in pm25) / len(pm25)
        # CAMS global forecasts 5 days; past its end Open-Meteo returns nulls. Hours that are
        # mostly empty are not written, and the page shows where the forecast ends.
        if share < 0.5:
            continue
        nonnull.append(share)
        # Exact fixed-step 16-bit values (no per-hour max scaling: one hotspot used to make each
        # 8-bit step several ug/m3 wide). Three stacked blocks: PM2.5, PM10, US AQI.
        nx, ny = len(AQ_LONS), len(AQ_LATS)
        rows = rows16(pm25, 0, 0.1, nx, ny, True) + rows16(pm10, 0, 0.1, nx, ny, True) + rows16(aqi, 0, 1, nx, ny, True)
        valid = dt.datetime.fromtimestamp(t, dt.timezone.utc)
        name = valid.strftime("%Y%m%d%H") + ".png"
        m = {**base, "valid_utc": iso(valid), "field": "aq", "encoding": AQ_FORMAT,
             "blocks": ["pm2_5", "pm10", "us_aqi"], "step": [0.1, 0.1, 1], "nodata": 65535,
             "units": "µg/m³ (pm), index (us_aqi)"}
        put(adir / name, png(nx, ny * 3, 3, rows, m, 1), sizes)
        files.append({"valid_utc": iso(valid), "file": name})
    cover = round(min(nonnull) * 100, 1) if nonnull else 0
    report["aq_seconds"] = round(time.time() - t0, 1)
    report["aq_sizes"] = {"files": len(sizes), "max": max(sizes) if sizes else 0}
    report["aq_pm25_coverage_pct_min"] = cover
    notice("Air quality", f"{STATS['aq_locations']} locations in {STATS['aq_requests']} requests "
           f"({STATS['aq_429']} rate-limited) in {report['aq_seconds']} s; pm2_5 non-null in at least {cover}% "
           f"of {len(points)} grid points for every hour")
    return {"generated_utc": iso(generated), "credit": AQ_CREDIT, "license": AQ_LICENSE, "stale": False,
            "format": AQ_FORMAT, "encoding": {"blocks": ["pm2_5", "pm10", "us_aqi"], "step": [0.1, 0.1, 1], "nodata": 65535},
            "grid": {"nx": len(AQ_LONS), "ny": len(AQ_LATS), "deg": AQ_DEG, "lon0": AQ_LONS[0], "lat0": AQ_LATS[0]},
            "files": files, "end_utc": files[-1]["valid_utc"] if files else None, "calls": STATS["aq_locations"]}


def aq_range_probe(report):
    """How far the CAMS forecast reaches through Open-Meteo with the job's own parameters, at three
    points (one request, 3 location-calls). Recorded every run, also when the grid is reused."""
    pts = [("Delhi", 28, 76), ("London", 52, 0), ("Beijing", 40, 116)]
    q = {"latitude": ",".join(str(p[1]) for p in pts), "longitude": ",".join(str(p[2]) for p in pts),
         "hourly": "pm2_5,pm10,us_aqi", "domains": "cams_global", "timezone": "GMT", "timeformat": "unixtime",
         "past_days": 1, "forecast_days": 6}
    try:
        _, _, body = get(f"{OPEN_METEO_AQ}?{urllib.parse.urlencode(q)}", retries=2)
        STATS["aq_probe_locations"] = len(pts)
        res = json.loads(body)
        out = {}
        for (name, _, _), r in zip(pts, res if isinstance(res, list) else [res]):
            h = r["hourly"]
            valid = [t for t, v in zip(h["time"], h["pm2_5"]) if v is not None]
            out[name] = {"hours_returned": len(h["time"]), "first": iso(dt.datetime.fromtimestamp(h["time"][0], dt.timezone.utc)),
                         "last": iso(dt.datetime.fromtimestamp(h["time"][-1], dt.timezone.utc)),
                         "last_non_null": iso(dt.datetime.fromtimestamp(valid[-1], dt.timezone.utc)) if valid else None,
                         "non_null": len(valid)}
        report["aq_range"] = out
        notice("Air-quality range (Open-Meteo cams_global, past_days=1, forecast_days=6)",
               " ; ".join(f"{k}: {v['hours_returned']} h returned {v['first']}..{v['last']}, pm2_5 to {v['last_non_null']}" for k, v in out.items()))
    except Exception as e:  # noqa: BLE001 - informational only
        notice("Air-quality range", f"unavailable ({e})")


def spot_check(report):
    """Compare decoded GFS at three cities with ECMWF IFS via Open-Meteo (an independent model)."""
    spot = report.get("gfs_spot", {}).get(0)
    run = report.get("gfs_publish", {}).get("run")
    if not spot or not run:
        return
    lines = []
    for name, lat, lon in SPOT_CITIES:
        q = {"latitude": lat, "longitude": lon, "hourly": "temperature_2m,wind_speed_10m,wind_direction_10m",
             "models": "ecmwf_ifs025", "timezone": "GMT", "timeformat": "unixtime", "past_days": 1, "forecast_days": 2,
             "wind_speed_unit": "kmh"}
        try:
            _, _, body = get(f"{OPEN_METEO_FC}?{urllib.parse.urlencode(q)}", retries=2)
            STATS["spot_locations"] += 1
            h = json.loads(body)["hourly"]
            t = int(dt.datetime.strptime(run, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc).timestamp())
            i = h["time"].index(t)
            ours = spot[name]
            ref = {"temp_c": h["temperature_2m"][i], "wind_kmh": h["wind_speed_10m"][i], "wind_from_deg": h["wind_direction_10m"][i]}
            report.setdefault("spot_check", {})[name] = {"gfs": ours, "ecmwf_ifs025": ref}
            lines.append(f"{name}: GFS {ours['temp_c']}°C {ours['wind_kmh']} km/h from {ours['wind_from_deg']}° | "
                         f"ECMWF {ref['temp_c']}°C {ref['wind_kmh']} km/h from {ref['wind_from_deg']}°")
        except Exception as e:  # noqa: BLE001 - informational only
            lines.append(f"{name}: comparison unavailable ({e})")
    notice("Spot check at run time (f000)", " ; ".join(lines))


# ---- previous good data -----------------------------------------------------------------
def load_previous(prev_url, out, part):
    """Copy the previous deployment's files for `part` ('gfs' or 'aq'). Returns its manifest entry."""
    if not prev_url:
        return None
    try:
        _, _, body = get(prev_url.rstrip("/") + "/manifest.json", retries=1)
        man = json.loads(body)
        entry = man.get(part)
        if not entry:
            return None
        names = ([f"gfs/{k}/f{fr['f']:03d}.png" for fr in entry["frames"] for k in ("wind", "temp", "rain", "cloud", "pres")]
                 + ["gfs/series.png"] if part == "gfs" else [f"aq/{x['file']}" for x in entry["files"]])
        for n in names:
            _, _, data = get(prev_url.rstrip("/") + "/" + n, retries=2)
            (out / n).parent.mkdir(parents=True, exist_ok=True)
            (out / n).write_bytes(data)
        return entry, man.get("history", [])
    except Exception as e:  # noqa: BLE001
        notice("Previous data unavailable", f"{part}: {e}")
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--previous", default="", help="URL of the currently deployed data/live folder")
    ap.add_argument("--prefer-aws", action="store_true", help="try the AWS mirror before NOMADS")
    ap.add_argument("--force-aq", action="store_true")
    ap.add_argument("--skip-aq", action="store_true")
    ap.add_argument("--aq-cache", type=Path, help="directory that keeps the last air-quality build between runs")
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()
    out = args.out
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    generated = now_utc()
    report = {"generated_utc": iso(generated)}
    t_start = time.time()

    prev_manifest = {}
    if args.previous:
        try:
            prev_manifest = json.loads(get(args.previous.rstrip("/") + "/manifest.json", retries=1, ok404=True)[2] or b"{}")
        except Exception as e:  # noqa: BLE001
            notice("Previous manifest unavailable", str(e))

    # GFS
    try:
        gfs = build_gfs(args, out, generated, report)
    except Exception as e:  # noqa: BLE001
        prev = load_previous(args.previous, out, "gfs")
        if not prev:
            raise SystemExit(f"GFS failed and no previous data to fall back on: {e}")
        gfs = {**prev[0], "stale": True, "error": str(e)[:500]}
        notice("GFS stale", f"kept previous run {gfs['run']}: {e}")

    # Air quality: refresh about every 12 h (CAMS cadence), otherwise reuse earlier files: first
    # a local cache (CI keeps one between pull-request runs), then the deployed site. Files in
    # an older format are never reused.
    def age_h(entry):
        return (generated - dt.datetime.strptime(entry["generated_utc"], "%Y-%m-%dT%H:%M:%SZ")
                .replace(tzinfo=dt.timezone.utc)).total_seconds() / 3600
    cached = None
    if args.aq_cache and (args.aq_cache / "aq.json").exists():
        cached = json.loads((args.aq_cache / "aq.json").read_text())
    prev_aq = prev_manifest.get("aq")
    candidates = [c for c in (cached, prev_aq) if c and c.get("format") == AQ_FORMAT]
    best = min(candidates, key=age_h) if candidates else None
    aq_age = age_h(best) if best else None
    aq = None
    gfs_run = dt.datetime.strptime(gfs["run"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc)
    if not args.skip_aq and (args.force_aq or aq_age is None or aq_age >= AQ_REFRESH_HOURS):
        try:
            aq = build_aq(args, out, generated, report, gfs_run)
            if args.aq_cache:
                shutil.rmtree(args.aq_cache, ignore_errors=True)
                shutil.copytree(out / "aq", args.aq_cache / "aq")
                (args.aq_cache / "aq.json").write_text(json.dumps(aq))
        except Exception as e:  # noqa: BLE001
            notice("Air quality failed", str(e)[:300])
    if aq is None and best is cached and cached:
        shutil.copytree(args.aq_cache / "aq", out / "aq", dirs_exist_ok=True)
        aq = {**cached, "stale": aq_age > 30}
        notice("Air quality reused", f"cached files from {aq['generated_utc']} ({aq_age:.1f} h old)")
    elif aq is None and best is prev_aq and prev_aq:
        prev = load_previous(args.previous, out, "aq")
        if prev:
            aq = {**prev[0], "stale": aq_age > 30}
            notice("Air quality reused", f"deployed files from {aq['generated_utc']} ({aq_age:.1f} h old)")
    spot_check(report)
    aq_range_probe(report)

    # Manifest + rolling history (the daily archive is cut from it)
    sizes = report.get("gfs_sizes", {})
    entry = {"generated_utc": iso(generated), "gfs_run": gfs["run"], "gfs_source": gfs["source"], "gfs_stale": gfs["stale"],
             "aq_generated_utc": aq["generated_utc"] if aq else None, "aq_calls": STATS["aq_locations"],
             "seconds": round(time.time() - t_start, 1), "bytes_downloaded": STATS["http_bytes"],
             "http_requests": STATS["http_requests"], "file_kb_mean": {k: round(v["mean"] / 1024, 1) for k, v in sizes.items()},
             "publish": report.get("gfs_publish"), "spot_check": report.get("spot_check")}
    history = ([h for h in prev_manifest.get("history", []) if h.get("gfs_run") != gfs["run"]] + [entry])[-16:]
    manifest = {"schema": 1, "generated_utc": iso(generated), "gfs": gfs, "aq": aq, "history": history}
    (out / "manifest.json").write_text(json.dumps(manifest, separators=(",", ":")))

    report.update({"seconds_total": entry["seconds"], "stats": STATS, "manifest_kb": round((out / "manifest.json").stat().st_size / 1024, 1)})
    total = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    notice("Run", f"{len(gfs.get('frames', []))} GFS frames (f{gfs['frames'][0]['f']:03d}-f{gfs['frames'][-1]['f']:03d}); {entry['seconds']} s total; downloaded {STATS['http_bytes'] / 1e6:.1f} MB in {STATS['http_requests']} requests; "
           f"output {total / 1e6:.1f} MB")
    if sizes:
        notice("File sizes per hour (KB, mean / max)", ", ".join(f"{k} {v['mean'] / 1024:.0f}/{v['max'] / 1024:.0f}" for k, v in sizes.items()))
    if args.report:
        args.report.write_text(json.dumps(report, indent=1, default=str))
    if os.environ.get("GITHUB_ACTIONS"):
        for title, msg in NOTICES[:14]:
            print(f"::notice title={title}::{msg}")


if __name__ == "__main__":
    main()
