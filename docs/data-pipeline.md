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
   `us_aqi`). The grid is **4°**: lat 84° N to 84° S, lon 180° W to 176° E, so **3,870 locations**
   (it was 5° and 2,520 locations until the Phase 2 fixes). They go in batches of 100 per
   request (39 requests), throttled to ≤ 500 locations per minute. It refreshes when the newest
   AQ (deployed site, or the CI cache on pull requests) is ≥ 11 h old (CAMS updates every 12 h),
   i.e. about **twice a day → ~7,740 location-calls/day**, under the 10,000/day free limit. A 3°
   grid would need ~13,700/day. Each run reports the locations and requests it actually sent,
   the number of 429s, and the share of grid points with non-null `pm2_5`.

Messages used per field:
* **Wind, temperature, pressure, clouds:** the instantaneous messages (`anl` or `N hour fcst`).
  The "N-M hour ave" messages are skipped, so each frame is a snapshot at its valid time.
* **Precipitation:** the amount that fell **in the hour before the valid time**, from the
  running total: `APCP(0→f) − APCP(0→f−1)`. GFS's own `ave`/`acc` windows reset every 6 h
  (checked against the `.idx` files: `6-7 hour ave` at f007, `42-48 hour ave` at f048); the
  `0-N hour acc` running total does not. Only f000 (no accumulation yet) uses the instantaneous
  `PRATE`. This replaces the earlier instantaneous `PRATE`, which made showers spiky and
  scattered. It matches Open-Meteo's definition ("sum of the preceding hour").

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
| `gfs/temp/fNNN.png` | 0.5° (720 × 361) | **16-bit**: value = offset + 0.2 °C × (R·256 + G) |
| `gfs/pres/fNNN.png` | 0.5° | **16-bit**: value = offset + 0.1 hPa × (R·256 + G) |
| `gfs/cloud/fNNN.png` | 0.5°, area mean | grey, whole percent (byte = %) |
| `gfs/rain/fNNN.png` | 0.5°, area mean | grey, log: 0 = below 0.01 mm, b → 10^((b−1)·0.02 − 2) mm in the past hour |
| `gfs/series.png` | 3°, every 3 h | RGB atlas: R = temperature, G = wind km/h (place-panel chart) |
| `aq/YYYYMMDDHH.png` | 4° (90 × 43) | three stacked **16-bit** blocks (R·256 + G): PM2.5 and PM10 in 0.1 µg/m³, US AQI in 1; 65535 = no data |
| `manifest.json` | | run, scale/offset per file, credits, licences, stale flags, history |

Every PNG carries an `owm-meta` tEXt chunk (JSON) with `generated_utc`, `run_utc`,
`valid_utc`, `source`, `license` and its encoding, plus the standard `Source` and `Copyright`
keywords. The same values are in `manifest.json`.

How the 0.25° GFS grid becomes the display grid:
* **Temperature and pressure** (smooth fields) are **decimated**: every second 0.25° point,
  exact NOAA values at the nodes. The CI grid-alignment test checks the page against wgrib2's
  raw value at three steep-gradient nodes.
* **Wind** is decimated to 0.75° (every third point).
* **Cloud cover and precipitation** (patchy fields) are **area-averaged** with a 3 × 3 tent
  filter (`[1,2,1]⊗[1,2,1]/16`) centred on each 0.5° node. Decimation aliased badly here: at
  Denver (18Z 29 Oct, f004) cloud cover was 8 % at 0.25° but 47 % at the decimated 0.5° node.

Before the fixes, temperature and pressure were 8-bit, scaled between each frame's global
min and max (~0.43 °C / ~0.4 hPa per step). Air quality was 8-bit, scaled to each hour's
**global maximum**, so a single hotspot made every step several µg/m³ wide.

### Measured sizes per forecast hour (KB = 1,024 bytes)

| Field | Grid | Phase 2 (8-bit) | Phase 2 fixes |
|---|---|---|---|
| wind (U+V) | 0.75° | 139 / 148 KB | unchanged (8-bit; see below) |
| temperature | 0.5° | 89 / 93 KB | **141 / 144 KB** (16-bit, 0.2 °C) |
| precipitation | 0.5° | 97 / 102 KB | **105 / 113 KB** (hourly amount, area mean) |
| clouds | 0.5° | 129 / 134 KB | **~125 KB** (area mean, whole percent) |
| pressure | 0.5° | 65 / 68 KB | **141 / 144 KB** (16-bit, 0.1 hPa) |
| air quality | 5° → 4° | ≤ 5 KB | a few KB (16-bit, 4°) |
| series (place chart, loaded on click) | 3°, 3-hourly | 190 KB | unchanged |

(mean / max; the fixes column was measured locally on the 18Z 29 Oct run, and the CI run
report has the deployed numbers.) 16-bit steps were picked by measured size: temperature at
0.1 °C was 184 KB/hour and pressure at 0.05 hPa 185 KB/hour. **Wind stays 8-bit:** 10-bit was
180 KB/hour and 12-bit 228 KB/hour, and the 8-bit step (~0.3 m/s ≈ ±0.6 km/h) is well inside
the ±3 km/h tolerance. The real wind error, rounding twice (once in the PNG, again when the
browser rebuilt the particle texture with a new min/max), is fixed: the particle texture is
now the PNG's own bytes.

All fields are under the ~150 KB budget. Wind started at 0.5° as specified and measured
**265–306 KB** per hour there (8-bit U and V carry a lot of fine detail), so it moved to 0.75°.
earth.nullschool uses 1° GFS for wind. One full cycle is about **26 MB**. The page loads one
field plus wind for the current hour (≈ 230 KB) and prefetches the next hour.

PNG filters were chosen by measurement on real frames: Sub for wind, temperature and pressure,
None for clouds and rain.

## US air quality index

The map's PM2.5 colours, categories and AQI use the **US EPA breakpoints revised on 6 May 2024**
(Good 0–9.0, Moderate 9.1–35.4, Sensitive groups 35.5–55.4, Unhealthy 55.5–125.4, Very unhealthy
125.5–225.4, Hazardous 225.5+; EPA fact sheet:
https://www.epa.gov/system/files/documents/2024-02/pm-naaqs-air-quality-index-fact-sheet.pdf).
EPA defines the categories for **24-hour averages**. The map colours and the category name
use the **hourly** forecast PM2.5 (the legend says so). The **AQI number** shown in the probe
and place panel is Open-Meteo's `us_aqi`, labelled "(24 h)". The CI accuracy check compared it
with AQI values computed from Open-Meteo's own PM2.5 and found it matches the **2024 table
applied to 24-hour means** (total absolute difference 23, against 120 for 2024 hourly and 59
for the 2012 table on 24-hour means, over 8 points on 30 Oct 2026).

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
