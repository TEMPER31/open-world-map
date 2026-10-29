#!/usr/bin/env python3
"""Open World Map data pipeline (Phase 2).

Fetches the latest complete NOAA GFS 0.25 deg cycle (f000-f048, hourly) and CAMS air
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

HOURS = list(range(0, 49))          # f000..f048
NX, NY, DEG = 720, 361, 0.5         # scalar grid: lon -180..179.5, lat 90..-90
# Wind is stored at 0.75 deg: at 0.5 deg the 8-bit U+V PNG measured ~265-306 KB per hour,
# over the ~150 KB budget. (earth.nullschool draws wind from 1 deg GFS.)
WNX, WNY, WDEG = 480, 241, 0.75
SERIES_DEG, SERIES_STEP = 3, 3     # place-panel chart: 3 deg, every 3 h (2 deg measured 402 KB)
AQ_DEG = 5
AQ_LATS = [85 - i * AQ_DEG for i in range(35)]        # 85 .. -85
AQ_LONS = [-180 + i * AQ_DEG for i in range(72)]      # -180 .. 175
AQ_BATCH = 100                      # locations per request
AQ_MAX_PER_MIN = 500                # stay under Open-Meteo's 600/minute
AQ_REFRESH_HOURS = 11               # CAMS updates every 12 h

GFS_CREDIT = "NOAA/NCEP Global Forecast System (GFS) 0.25°"
GFS_LICENSE = "Public domain (U.S. Government work); NOAA requests attribution"
AQ_CREDIT = "CAMS (Copernicus Atmosphere Monitoring Service) via Open-Meteo.com"
AQ_LICENSE = "CC BY 4.0"

INSTANT = r"(anl|[0-9]+ hour fcst)"
# key, GRIB short name, level, conversion to display units
VARS = [
    ("u", "UGRD", "10 m above ground", lambda x: x),                 # m/s, towards east
    ("v", "VGRD", "10 m above ground", lambda x: x),                 # m/s, towards north
    ("temp", "TMP", "2 m above ground", lambda x: x - 273.15),       # K -> degC
    ("rain", "PRATE", "surface", lambda x: x * 3600.0),              # kg m-2 s-1 -> mm/h
    ("cloud", "TCDC", "entire atmosphere", lambda x: x),             # %
    ("pres", "PRMSL", "mean sea level", lambda x: x / 100.0),        # Pa -> hPa
]
MATCH = "|".join(f":{g}:{lvl}:{INSTANT}:" for _, g, lvl, _ in VARS)

STATS = {"http_requests": 0, "http_bytes": 0, "aq_locations": 0, "aq_requests": 0, "aq_429": 0,
         "spot_locations": 0}
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
    """Newest cycle whose f048 index exists (so the whole 48 h window is published)."""
    t = now_utc()
    run = t.replace(minute=0, second=0, hour=t.hour - t.hour % 6)
    for _ in range(6):
        st, hdr, _ = get(file_url(source, run, HOURS[-1]) + ".idx", method="HEAD", ok404=True, retries=2)
        if st == 200:
            st0, hdr0, _ = get(file_url(source, run, 0) + ".idx", method="HEAD", ok404=True, retries=2)
            return run, {"f000": last_modified(hdr0), "f048": last_modified(hdr)}
        run -= dt.timedelta(hours=6)
    raise RuntimeError(f"{source}: no complete GFS cycle in the last 36 h")


NOMADS_FILTER_SCRIPT = None


def fetch_nomads(run, f):
    """NOMADS grib filter: server-side subset to the variables/levels we need."""
    global NOMADS_FILTER_SCRIPT
    d, c, folder, stem = cycle_paths(run)
    q = {"dir": f"/{folder}", "file": f"{stem}.f{f:03d}"}
    for _, g, lvl, _ in VARS:
        q[f"var_{g}"] = "on"
        q["lev_" + lvl.replace(" ", "_")] = "on"
    scripts = [NOMADS_FILTER_SCRIPT] if NOMADS_FILTER_SCRIPT else ["filter_gfs_0p25.pl", "filter_gfs_0p25_1hr.pl"]
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


def decode(wgrib2, src, tmp, keys, nx, ny, deg):
    """Decode instantaneous messages for `keys` onto a nx x ny grid (rows N->S).
    wgrib2 -lola samples the nearest grid point; at multiples of 0.25 deg these are exact
    GFS points (decimation, no interpolation)."""
    dst = tmp / "out.bin"
    match = "|".join(f":{g}:{lvl}:{INSTANT}:" for key, g, lvl, _ in VARS if key in keys)
    inv = subprocess.run(
        [wgrib2, str(src), "-match", match, "-no_header",
         "-lola", f"180:{nx}:{deg}", f"-90:{ny}:{deg}", str(dst), "bin"],
        capture_output=True, text=True, check=True).stdout.splitlines()
    data = array.array("f")
    data.frombytes(dst.read_bytes())
    if sys.byteorder != "little":
        data.byteswap()
    n = nx * ny
    out = {}
    for k, line in enumerate(inv):
        for key, g, lvl, conv in VARS:
            if key in keys and f":{g}:{lvl}:" in line and key not in out:
                rec = data[k * n:(k + 1) * n]
                out[key] = [conv(x) for j in range(ny) for x in rec[(ny - 1 - j) * nx:(ny - j) * nx]]  # S->N to N->S
    missing = [k for k in keys if k not in out]
    if missing:
        raise RuntimeError(f"decode: missing {missing} (inventory: {inv})")
    return out


def build_gfs(args, out, generated, report):
    wgrib2 = os.environ.get("WGRIB2", "wgrib2")
    errors = []
    for source in (["aws", "nomads"] if args.prefer_aws else ["nomads", "aws"]):
        try:
            t0 = time.time()
            run, pub = find_cycle(source)
            notice("GFS cycle", f"{source}: run {iso(run)}; f000 published {iso(pub['f000']) if pub['f000'] else '?'}, "
                   f"f048 {iso(pub['f048']) if pub['f048'] else '?'}"
                   + (f" (+{(pub['f048'] - run).total_seconds() / 60:.0f} min after cycle)" if pub["f048"] else ""))
            report["gfs_publish"] = {"source": source, "run": iso(run),
                                     **{k: iso(v) if v else None for k, v in pub.items()}}
            gdir = out / "gfs"
            for k in ("wind", "temp", "rain", "cloud", "pres"):
                (gdir / k).mkdir(parents=True, exist_ok=True)
            frames, sizes, spot = [], {k: [] for k in ("wind", "temp", "rain", "cloud", "pres")}, {}
            series = []
            with tempfile.TemporaryDirectory() as td:
                for f in HOURS:
                    grib = fetch_nomads(run, f) if source == "nomads" else fetch_aws(run, f)
                    src = Path(td) / "in.grb2"
                    src.write_bytes(grib)
                    fld = decode(wgrib2, src, Path(td), ("temp", "rain", "cloud", "pres"), NX, NY, DEG)
                    fld.update(decode(wgrib2, src, Path(td), ("u", "v"), WNX, WNY, WDEG))
                    valid = run + dt.timedelta(hours=f)
                    fr = write_gfs_frame(gdir, f, fld, run, valid, generated, sizes)
                    frames.append(fr)
                    if f % SERIES_STEP == 0:
                        series.append(series_rows(fld))
                    if f in (0, 24):
                        spot[f] = {name: sample_point(fld, lat, lon) for name, lat, lon in SPOT_CITIES}
            series_meta = write_series(gdir, series, run, generated)
            report["series_kb"] = round((gdir / "series.png").stat().st_size / 1024, 1)
            report["gfs_seconds"] = round(time.time() - t0, 1)
            report["gfs_sizes"] = {k: {"min": min(v), "max": max(v), "mean": round(sum(v) / len(v))} for k, v in sizes.items()}
            report["gfs_spot"] = spot
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


def write_gfs_frame(gdir, f, fld, run, valid, generated, sizes):
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
    for key, units in (("temp", "°C"), ("pres", "hPa"), ("cloud", "%")):
        vals = fld[key]
        lo, hi = (0.0, 100.0) if key == "cloud" else (math.floor(min(vals)), math.ceil(max(vals)))
        qb = q_linear(vals, lo, hi)
        m = {**base, "field": key, "units": units, "encoding": "linear8", "range": [lo, hi]}
        put(gdir / key / name, png(NX, NY, 1, [qb[j * NX:(j + 1) * NX] for j in range(NY)], m, 0 if key == "cloud" else 1), sizes[key])
        meta[key] = {"range": [lo, hi]}
    qb = q_log_rain(fld["rain"])
    m = {**base, "field": "rain", "units": "mm/h", "encoding": "log8", "log10_offset": -2, "log10_scale": 0.02}
    put(gdir / "rain" / name, png(NX, NY, 1, [qb[j * NX:(j + 1) * NX] for j in range(NY)], m, 0), sizes["rain"])
    return {"f": f, "valid_utc": iso(valid), **meta}


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
    hours = list(range(0, HOURS[-1] + 1, SERIES_STEP))
    meta = {"generated_utc": iso(generated), "run_utc": iso(run), "source": GFS_CREDIT, "license": GFS_LICENSE,
            "field": "series", "encoding": "rgb8 R=temp G=wind_kmh", "temp": [tl, th], "wind_kmh": [0, wh],
            "hours": hours, "grid": {"nx": sn, "ny": sm, "deg": SERIES_DEG, "lon0": -180, "lat0": 90}}
    (gdir / "series.png").write_bytes(png(sn, sm * len(series), 3, rows, meta, 1))
    return {k: meta[k] for k in ("temp", "wind_kmh", "hours", "grid")}


def put(path, data, sizes):
    path.write_bytes(data)
    sizes.append(len(data))


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
             "past_days": 1, "forecast_days": 4}
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
        nonnull.append(sum(x is not None for x in pm25) / len(pm25))
        hi25 = max([x for x in pm25 if x is not None] or [1.0])
        hi10 = max([x for x in pm10 if x is not None] or [1.0])
        q25, q10, qa = q_linear(pm25, 0, hi25, 0), q_linear(pm10, 0, hi10, 0), q_linear(aqi, 0, 500, 0)
        rows = [bytes(c for i in range(j * 72, (j + 1) * 72) for c in (q25[i], q10[i], qa[i])) for j in range(35)]
        valid = dt.datetime.fromtimestamp(t, dt.timezone.utc)
        name = valid.strftime("%Y%m%d%H") + ".png"
        m = {**base, "valid_utc": iso(valid), "field": "aq", "encoding": "rgb8-nodata0",
             "pm2_5": [0, hi25], "pm10": [0, hi10], "us_aqi": [0, 500], "units": "µg/m³ (pm), index (us_aqi)"}
        put(adir / name, png(72, 35, 3, rows, m), sizes)
        files.append({"valid_utc": iso(valid), "file": name, "pm2_5": [0, round(hi25, 1)],
                      "pm10": [0, round(hi10, 1)], "us_aqi": [0, 500]})
    cover = round(min(nonnull) * 100, 1) if nonnull else 0
    report["aq_seconds"] = round(time.time() - t0, 1)
    report["aq_sizes"] = {"files": len(sizes), "max": max(sizes) if sizes else 0}
    report["aq_pm25_coverage_pct_min"] = cover
    notice("Air quality", f"{STATS['aq_locations']} locations in {STATS['aq_requests']} requests "
           f"({STATS['aq_429']} rate-limited) in {report['aq_seconds']} s; pm2_5 non-null in at least {cover}% "
           f"of {len(points)} grid points for every hour")
    return {"generated_utc": iso(generated), "credit": AQ_CREDIT, "license": AQ_LICENSE, "stale": False,
            "grid": {"nx": 72, "ny": 35, "deg": AQ_DEG, "lon0": -180, "lat0": 85}, "files": files,
            "calls": STATS["aq_locations"]}


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

    # Air quality: refresh about every 12 h (CAMS cadence), otherwise reuse the deployed files
    prev_aq = prev_manifest.get("aq")
    aq_age = None
    if prev_aq:
        aq_age = (generated - dt.datetime.strptime(prev_aq["generated_utc"], "%Y-%m-%dT%H:%M:%SZ")
                  .replace(tzinfo=dt.timezone.utc)).total_seconds() / 3600
    aq = None
    gfs_run = dt.datetime.strptime(gfs["run"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc)
    if not args.skip_aq and (args.force_aq or aq_age is None or aq_age >= AQ_REFRESH_HOURS):
        try:
            aq = build_aq(args, out, generated, report, gfs_run)
        except Exception as e:  # noqa: BLE001
            notice("Air quality failed", str(e)[:300])
    if aq is None:
        prev = load_previous(args.previous, out, "aq")
        if prev:
            age = aq_age if aq_age is not None else 0
            aq = {**prev[0], "stale": age > 30}
            notice("Air quality reused", f"previous files from {aq['generated_utc']} ({age:.1f} h old)")
    spot_check(report)

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
    notice("Run", f"{entry['seconds']} s total; downloaded {STATS['http_bytes'] / 1e6:.1f} MB in {STATS['http_requests']} requests; "
           f"output {total / 1e6:.1f} MB")
    if sizes:
        notice("File sizes per hour (KB, mean / max)", ", ".join(f"{k} {v['mean'] / 1024:.0f}/{v['max'] / 1024:.0f}" for k, v in sizes.items()))
    if args.report:
        args.report.write_text(json.dumps(report, indent=1, default=str))
    if os.environ.get("GITHUB_ACTIONS"):
        for title, msg in NOTICES[:10]:
            print(f"::notice title={title}::{msg}")


if __name__ == "__main__":
    main()
