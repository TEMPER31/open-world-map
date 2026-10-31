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

### 7-day forecast (from the forecast-7day PR): f168 and the cron

The job now needs **f168**. I measured the same mirror for 16 cycles, 27 to 30 Oct 2026
(`Last-Modified` of the `.idx` files, minutes after the cycle):

| File | Earliest | Latest | Typical |
|---|---|---|---|
| f000 `.idx` | + 211 min (3 h 31 m) | + 229 min (3 h 49 m) | + 213 min |
| f048 `.idx` | + 225 min (3 h 45 m) | + 241 min (4 h 01 m) | + 227 min |
| f120 `.idx` | + 243 min (4 h 03 m) | + 261 min (4 h 21 m) | + 246 min |
| **f168 `.idx`** | **+ 256 min (4 h 16 m)** | **+ 273 min (4 h 33 m)** | **+ 258 min** |

The old schedule (cycle + 4 h 17 m = 257 min) would usually have found f168 missing and fallen
back to the previous cycle (6 h older data). The cron now runs at **cycle + 4 h 47 m**
(`47 4,10,16,22 * * *`), 14 min after the latest f168 measured. Each run also logs the publish
times of the cycle it used, as a run annotation and in `manifest.json` → `history[].publish`.
The job takes the newest cycle whose **f168** index exists, so an early or delayed run never
picks a half-published cycle.

Which forecast hours exist was checked against the real `.idx` files (12Z 30 Oct 2026, AWS):
the 0.25° files are **hourly to f120** (f118, f119, f120 exist; f121, f122 do not) and
**3-hourly after** (f123, f126, f129 … f165, f168, f171 exist; f124, f125, f166 do not). All six
variables the job uses are in every file. So a cycle is **137 frames**: f000–f120 (121) plus
f123–f168 (16).

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
* **Precipitation:** the mean rate over the time **since the previous frame**: the hour before
  the valid time to f120, then the **3 hours** before it (labelled "past 3 h" on the map). It
  comes from the running total, `(APCP(0→f) − APCP(0→previous frame)) / hours`, which equals
  GFS's own 3-hour window there (`APCP 120-123 hour acc` at f123, checked in the `.idx`). The
  running total's name changes past 4 days (`0-5 day acc` at f120, `0-7 day acc` at f168) and
  still matches the job's pattern. GFS's own `ave`/`acc` windows reset every 6 h
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
Re-measured in phase-2-fixes-2 (GFS 18Z 29 Oct, f006): adaptive per-row filters (None/Sub/Up/
Paeth, PNG's own heuristic) saved nothing (temperature 141 KB adaptive vs 140 KB Sub, wind 138 vs
137 KB), so
the fixed filters stay.

## 7-day forecast: sizes, run time and budgets (forecast-7day PR)

Measured in the PR's CI run (GFS **18Z 30 Oct 2026**, from **NOMADS**; air quality reused from
the CI cache), unless marked otherwise.

| Field | Grid | Mean / max KB per frame (137 frames) | Frames over 150 KB |
|---|---|---|---|
| wind (U+V) | 0.75° | 142.4 / **153.7** | 12 of 137 (all ≤ 153.7 KB) |
| temperature | 0.5° | 142.6 / 145.0 | 0 |
| pressure | 0.5° | 142.1 / 147.4 | 0 |
| precipitation | 0.5° | 104.0 / 113.2 | 0 |
| clouds | 0.5° | 129.7 / 132.9 | 0 |
| series (place chart, loaded on first click) | 3°, 3-hourly to 48 h then 6-hourly (37 steps) | **404.8 KB** (one file; 187.3 KB at 48 h) | — |
| manifest.json | — | 34.7 KB (17.6 KB at 48 h) | — |

| Measure | 48 h (before) | 7 days (this PR) |
|---|---|---|
| GFS frames | 49 | **137** (f000–f120 hourly + f123–f168 every 3 h) |
| Data-build step | 197 s GFS only (satellite-zoom PR run) / 10 min 34 s with an air-quality refresh (main, 30 Oct 16:54) | **9 min 01 s** GFS only (job 9 min 18 s); with a refresh ≈ 15–16 min (estimate: + ~6.5 min for 3,870 AQ locations) |
| HTTP requests per cycle (NOMADS) | 55 | **144 HTTP requests** in all (137 grib-filter requests, 1 s apart, + checks) |
| Downloaded per cycle | 0.39 GB | **1.11 GB** from NOMADS (the AWS fallback measured 790 MB locally) |
| Output per cycle (site/data/live) | 33 MB | **93.1 MB** (local build of the same run) |
| Pages artifact upload (data job) | 3 s | 4 s |
| Pages deploy | 16 s job, 7 s deploy step (33 MB, run 30 Oct 16:54) | measured on the first main run after merge |

**Air quality range** (Open-Meteo `cams_global`, `past_days=1&forecast_days=6`, probed every
run at 3 points): the API returns **168 hours** (7 days of data = 1 call per location under
Open-Meteo's > 7-day weighting) and **pm2_5 is non-null to about 4 d 18 h after the GFS run**
(18Z 30 Oct run: last non-null 12Z 4 Nov; 157 of 168 hours), the end of CAMS's 5-day forecast.
Hours that are mostly empty are not written; the manifest records `aq.end_utc` and the map
shows "Air quality forecast ends {date}" after it, with the legend dimmed and nothing drawn.
Calls per day stay at **~7,740** (2 refreshes × 3,870) + 3 spot-check + 3 range-probe
location-calls per run.

**Pages limits** (GitHub Docs: 1 GB site, 100 GB/month soft bandwidth, 10 min deploy): the site
is ~95 MB. Bandwidth per visitor, estimated from the file sizes: opening the map ≈ 1 MB (one
field + wind + the next 2 frames + manifest); a typical visit (scrub ~20 frames, one place
click) ≈ 7 MB; playing one field with wind through all ~131 frames ≈ 37 MB. So 100 GB/month is
roughly **14,000 typical visits or 2,700 full plays**. Today's traffic is far below that.

## Grid resolution: what it costs at a point (phase-2-fixes-2)

All numbers below were measured locally from the raw NOAA files on the AWS mirror (GFS run
**18Z 29 Oct 2026**, forecast hours **f006** and **f030**, which were "+0 h" and "+24 h" in the
PR #4 accuracy table), with the pinned wgrib2 and bilinear interpolation at the city
coordinates used by `scripts/data/accuracy.mjs`.

### Temperature: why cities read cold (root cause confirmed)

| City | f006: 0.25° | f006: 0.5° grid | diff | f030: 0.25° | f030: 0.5° grid | diff |
|---|---|---|---|---|---|---|
| Dayton OH | 18.02 | 17.48 | −0.54 | 13.68 | 12.86 | −0.83 |
| Miami | 27.50 | 26.87 | −0.62 | 26.82 | 26.44 | −0.38 |
| Denver | 16.64 | 13.08 | −3.56 | 17.42 | 14.20 | −3.22 |
| London | 11.22 | 11.12 | −0.10 | 10.81 | 10.73 | −0.09 |
| Delhi | 21.93 | 21.17 | −0.75 | 20.67 | 19.83 | −0.84 |

* The "0.5° grid" column, computed straight from NOAA's file, reproduces the page's numbers in
  the PR #4 table to 0.1 °C (page 17.5, 26.9, 13.1, 11.1, 21.1 at +0 h). Encoding, decoding
  and the browser's interpolation add nothing. The whole error is the 0.5° grid.
* It is **not a global bias**: over 20,000 random points (60° S to 70° N) the 0.5° grid minus
  the 0.25° value averages **+0.001 °C** (f006) and **−0.001 °C** (f030).
* It is one-sided at these cities because the 0.25° points next to each city are warmer than
  the 0.5° nodes around it. Dayton's nearest 0.25° points are 18.2 and 18.5 °C, but the 0.5°
  nodes are 16.9–18.0. Miami's point at 26.00° N 80.25° W (Fort Lauderdale) is 28.6 °C, but
  the 0.5° nodes inland are 25.9 and 26.6. Delhi's 0.25° points are 21.4–22.4 °C, but the
  0.5° nodes at 29° N are 19.1–19.6. Thinning the grid to every second point drops exactly
  those warm points. Why GFS has the cities as warm spots (urban land use in the land model,
  most likely, since every check was in the evening or night local time) is a **theory, not
  verified**.
* **Not fixed in this PR.** 0.25° temperature measured **427 KB/hour** (16-bit, 0.2 °C) or
  **266 KB/hour** (8-bit, ~0.35 °C steps), both over the ~150 KB budget. The handoff's 560 KB
  figure was an earlier estimate. A least-squares fit of the 0.5° nodes, so that
  interpolation best matches all 0.25° points, was tested. It brought Dayton to −0.34/−0.70
  and Miami to −0.35/−0.31. But it made London worse (−0.60) and moved node values by up
  to 7 °C, which breaks the exact-NOAA-at-nodes guarantee, so it was rejected.

### Wind: Miami (root cause confirmed: the 0.75° grid at the coast)

| City | f006: 0.25° | 0.5° | 0.75° (page grid) | 1° | f030: 0.25° | 0.5° | 0.75° | 1° |
|---|---|---|---|---|---|---|---|---|
| Miami | 21.9 | 18.9 | 16.7 | 23.0 | 23.2 | 22.9 | 19.5 | 27.1 |
| Dayton OH | 11.0 | 12.2 | 11.4 | 12.3 | 11.3 | 12.0 | 12.0 | 12.3 |
| Denver | 10.9 | 9.6 | 10.7 | 9.7 | 9.8 | 8.5 | 9.5 | 8.9 |
| London | 5.7 | 5.7 | 7.4 | 7.9 | 5.8 | 5.7 | 8.1 | 7.7 |
| Delhi | 6.8 | 7.1 | 5.2 | 7.0 | 2.4 | 2.3 | 2.3 | 3.7 |

(km/h). The 0.25° points around Miami are 20.5–27.7 km/h, with the highest offshore. The 0.75°
cell around the city reaches 25.50° N and 79.50° W, where it is 14.5–16.3 km/h, so the coastal
wind is diluted. 0.5° wind **measured 260 KB/hour** (8-bit U+V, Sub filter; 0.75° is 137 KB).
**Recommendation: keep 0.75°.** 0.5° is 1.7× the budget, and it only fixes Miami at f030
(22.9 vs 23.2): at f006 it is still 3 km/h low (18.9 vs 21.9). Particles look the same at
either resolution. Revisit with Phase 3's tiling or a regional high-resolution file.

### Cloud cover and rain: area average (labelled)

Cloud and rain are stored as an area average (a 3 × 3 tent over the 0.25° points, ~50 km)
because the decimated point aliased badly (Denver 47 % vs 8 %). The probe and the place panel
read that same stored value, so they **match the colour under the cursor**, and they are now
labelled "area average" (cloud) and "past hour · area avg" (rain). Showing a 0.25° point value
instead would need a second, unsmoothed 0.25° file per hour (about 4× the data) for a number
that disagrees with the map beneath it.

### Known limits (deferred; not built now)

* **Mountain temperature.** Denver reads 3.2–3.6 °C cold on the 0.5° grid (−3.56 at f006,
  −3.22 at f030 above). At f006 the 0.25° point next to the city (39.75° N 105.00° W, model
  terrain 1,633 m) is 17.0 °C; the four 0.5° nodes around it (1,543–1,869 m) are 12.2–14.0 °C,
  so thinning the grid drops the warm valley point. Fixing
  it needs 0.25° temperature (measured 427 KB/hour, over budget) or an elevation (lapse-rate)
  correction against a fine terrain model, which is a bigger project.
* **Air quality between grid points.** CAMS is sampled on a 4° grid and smoothed in the
  browser, so values between nodes can be **about 7–10 µg/m³ off** near hotspots (Delhi +9.7
  at +24 h, Denver −7.6 in the PR #4 table). At the nodes the page matches CAMS exactly. The
  long-term fix is the full CAMS grid from the **Copernicus Atmosphere Data Store**, with a
  free account key stored as a GitHub **Actions secret** and used only by the data job,
  never in the site or the repository.
* **Place-panel chart.** The 48-hour chart line comes from a 3° grid, every 3 h, 8-bit (one
  file, loaded on the first click), so it can differ from the panel's own numbers, which use
  the 0.5° grid. Found during this review; the fix belongs to Phase 3 (shared time state).

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
