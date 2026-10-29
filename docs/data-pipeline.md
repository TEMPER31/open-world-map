# Data pipeline (Phase 2)

`scripts/data/build_data.py` builds everything the map shows. It runs in GitHub Actions
(`.github/workflows/pages.yml`) and its output is **deploy output only**. It goes into
`site/data/live/` in the Pages artifact and is never committed. The only data committed
is a small daily summary in `data/archive/`.

Dependencies: the Python standard library plus **one** external tool, the
[wgrib2](https://github.com/NOAA-EMC/wgrib2) GRIB2 decoder. `scripts/data/build_wgrib2.sh`
builds it from tag `v3.8.0`, verifies commit `986287cc4f77ed3f5f97056fd0f90d099964dba7`
and caches the build. This relaxes the stdlib-only rule for the data job only.

## Schedule and GFS publish delay

GFS runs at 00, 06, 12 and 18 UTC. I measured when files appear using the `Last-Modified`
times on the AWS Open Data mirror (`noaa-gfs-bdp-pds`) for 15 cycles, 26 to 29 Oct 2026:

| File | Earliest | Latest | Typical |
|---|---|---|---|
| f000 `.idx` | cycle + 3 h 32 m | cycle + 3 h 49 m | + 3 h 33 m |
| f048 `.idx` | cycle + 3 h 45 m | cycle + 4 h 01 m | + 3 h 46 m |

The cron runs at **cycle + 4 h 17 m** (`17 4,10,16,22 * * *`). Each run also logs the
publish times of the cycle it used, as a run annotation and in `manifest.json` → `history[].publish`.
The job takes the newest cycle whose **f048** index exists, so an early or delayed run never
picks a half-published cycle. The first Actions run (18Z 29 Oct, NOMADS) recorded f000 at
**+3 h 34 m** and f048 at **+3 h 46 m** on NOMADS, the same as on the AWS mirror.

## Sources and fetching

1. **GFS: NOMADS grib filter** (primary). `cgi-bin/filter_gfs_0p25.pl` (falls back to
   `filter_gfs_0p25_1hr.pl`). One request per forecast hour, about 1 s apart, asking only for
   `UGRD`/`VGRD` at 10 m, `TMP` at 2 m, `PRATE` at the surface, `TCDC` for the entire
   atmosphere and `PRMSL` at mean sea level.
2. **GFS: AWS mirror** (fallback). It reads each hour's `.idx` and downloads only those messages
   with HTTP range requests. Measured locally: 49 hours = 297 requests, **259 MB**, **~150 s**
   including decoding and encoding.
3. **Air quality: Open-Meteo Air Quality API** (`domains=cams_global`; `pm2_5`, `pm10`,
   `us_aqi`). The grid is 5°: lat 85° N to 85° S, lon 180° W to 175° E, so **2,520 locations**.
   They go in batches of 100 per request (26 requests), throttled to ≤ 500 locations per
   minute. It refreshes when the deployed AQ is ≥ 11 h old (CAMS updates every 12 h), i.e.
   about **twice a day → ~5,040 location-calls/day**, under the 10,000/day free limit. Each run
   reports the locations and requests it actually sent, the number of 429s, and the share of
   grid points with non-null `pm2_5` (the global-coverage check).

Only instantaneous GRIB messages are used (`anl` or `N hour fcst`). The 0–N hour averages and
accumulations are skipped, so each frame is a snapshot at its valid time.

### First Actions run (PR #3, 29 Oct 2026, GFS 18Z via NOMADS)

| Measure | Value |
|---|---|
| Total job time (build data) | **509 s** (GFS 135 s; air quality 373 s, mostly the ≤ 500/min throttle) |
| Downloaded | 362 MB in 81 HTTP requests (49 NOMADS filter requests, 26 Open-Meteo AQ, 3 spot-check, rest HEAD/manifest) |
| Open-Meteo | **2,520 AQ locations** in 26 requests + 3 forecast locations, **0 rate-limited** |
| PM2.5 coverage | non-null at **100 %** of the 2,520 grid points for every hour |
| Output | 26.6 MB per cycle |

## Output (`site/data/live/`)

| File | Grid | Encoding |
|---|---|---|
| `gfs/wind/fNNN.png` | 0.75° (480 × 241) | RGB: **R = U, G = V** (m/s, linear between the frame's min/max) |
| `gfs/temp/fNNN.png` | 0.5° (720 × 361) | grey, linear between the frame's min/max (°C) |
| `gfs/pres/fNNN.png` | 0.5° | grey, linear between the frame's min/max (hPa) |
| `gfs/cloud/fNNN.png` | 0.5° | grey, 0–100 % |
| `gfs/rain/fNNN.png` | 0.5° | grey, log: 0 = below 0.01 mm/h, b → 10^((b−1)·0.02 − 2) mm/h |
| `gfs/series.png` | 3°, every 3 h | RGB atlas: R = temperature, G = wind km/h (place-panel chart) |
| `aq/YYYYMMDDHH.png` | 5° (72 × 35) | RGB: R = PM2.5, G = PM10, B = US AQI; 0 = no data |
| `manifest.json` | | run, scale/offset per file, credits, licences, stale flags, history |

Every PNG carries an `owm-meta` tEXt chunk (JSON) with `generated_utc`, `run_utc`,
`valid_utc`, `source`, `license` and its encoding, plus the standard `Source` and `Copyright`
keywords. The same values are in `manifest.json`.

Grids are **decimated, not interpolated**: 0.5° keeps every second GFS 0.25° point and 0.75°
every third (wgrib2 `-lola`; this build has no smoothing or interpolation library).

### Measured sizes (18Z 29 Oct 2026 Actions run, per forecast hour; KB = 1,024 bytes)

| Field | Grid | Mean | Max |
|---|---|---|---|
| wind (U+V) | 0.75° | 139 KB | 148 KB |
| temperature | 0.5° | 89 KB | 93 KB |
| precipitation | 0.5° | 97 KB | 102 KB |
| clouds | 0.5° | 129 KB | 134 KB |
| pressure | 0.5° | 65 KB | 68 KB |
| air quality | 5° | ≤ 5 KB | |
| series (place chart, loaded on click) | 3°, 3-hourly | 190 KB | |

All fields are under the ~150 KB budget. Wind started at 0.5° as specified and measured
**265–306 KB** per hour there (8-bit U and V carry a lot of fine detail), so it moved to 0.75°.
earth.nullschool uses 1° GFS for wind. One full cycle is about **26 MB**. The page loads one
field plus wind for the current hour (≈ 230 KB) and prefetches the next hour.

PNG filters were chosen by measurement on real frames: Sub for wind, temperature and pressure,
None for clouds and rain.

## Failure handling

* If NOMADS fails, it tries the AWS mirror. If both fail, it copies the previous deployment's GFS
  files from `$PAGES_URL/data/live/` and sets `gfs.stale = true`.
* If air quality fails, or isn't due for a refresh, it reuses the deployed AQ files. If those
  are more than 30 h old, it sets `aq.stale = true`.
* The site shows a banner when `gfs.stale` is set, when the data is more than 10 h old, or when
  air quality is stale. Without any manifest it falls back to clearly labelled sample data.

## Wind direction

GFS `UGRD`/`VGRD` are earth-relative components of where the air moves **towards**. Particles
use them directly (no 180° flip). The probe text converts them to the meteorological "from"
direction. Checks:
* At 50° N 30° W (12Z 29 Oct, f006) the raw GRIB value is U = +9.45 m/s.
* The probe there reads "from W".
* Synthetic uniform fields move particles east for +U, north for +V and west for −U
  (browser test).

## Spot check (f000 of 18Z 29 Oct vs ECMWF IFS 0.25° via Open-Meteo)

| City | GFS (this pipeline) | ECMWF IFS | Difference |
|---|---|---|---|
| London | 13.2 °C, 9.5 km/h from 114° | 12.7 °C, 6.3 km/h from 103° | +0.5 °C, +3.2 km/h, 11° |
| New York | 18.2 °C, 14.4 km/h from 225° | 19.4 °C, 11.5 km/h from 221° | −1.2 °C, +2.9 km/h, 4° |
| Tokyo | 15.1 °C, 5.2 km/h from 249° | 10.8 °C, 3.9 km/h from 292° | +4.3 °C, +1.3 km/h, 43° |

London and New York agree within about 1 °C and 3 km/h. For Tokyo I checked the raw GFS
0.25° value at the nearest grid point: **15.5 °C**. So the pipeline reproduces GFS faithfully,
and the 4.3 °C gap is a real GFS/ECMWF disagreement. It's 03:00 local time on the coast of
Tokyo Bay, where neighbouring GFS points range from 9 °C (inland) to 21 °C (over the sea).
Comparing against a second model shows the models differ, not which is right. A comparison
with station observations is a later improvement.

## Daily archive

After the 18Z cycle, the `archive` job commits `data/archive/YYYY-MM-DD.json`: that day's four
cycle summaries (run, source, sizes, timings, Open-Meteo calls, publish times, spot check).
