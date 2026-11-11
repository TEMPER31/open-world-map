# Performance

Where the time goes on the site and in the workflows, how to measure it, and what was changed.
Seven pathways are named here (P1 to P7) so that measurements and notes can refer to them.

## Pathways

| Label | Pathway | Starts | Ends | Main files |
|---|---|---|---|---|
| **P1 Page load** | opening the map | navigation | first weather field on screen | `site/index.html`, `site/js/main.js` (`boot`), `site/js/data.js` (`initData`) |
| **P2 Frame** | drawing one frame | a repaint request | the frame on screen | `site/js/wind-gl.js` (`loop`, `prerender`, `render`), `site/js/field-gl.js` (`render`), `site/js/overlays.js` |
| **P3 Hour step** | changing the hour | `state.t` changes | every visible layer shows the new hour | `site/js/state.js`, `site/js/main.js` (`updateField`, `updateWind`, `updateHL`), `site/js/frame-worker.js`, `site/js/data-core.js` |
| **P4 Data request** | one data file | `fetch` in the worker | decoded grid or texture | `site/js/data-core.js` (`decodePNG`, `grid`, `fieldTexture`), files under `data/live/` on GitHub Pages |
| **P5 Push to checks** | a push to a pull request | the push | the last check job ends | `.github/workflows/pages.yml` (jobs `check`, `data`, `verify-tests`, `verify-shots`, `verify-checks`) |
| **P6 Push to deploy** | a push to `main` | the push | the Pages deploy ends | `.github/workflows/pages.yml` (jobs `check`, `data`, `deploy`) |
| **P7 Data refresh** | a new GFS cycle | the cycle is complete at NOAA | the site shows it | `.github/workflows/refresh.yml`, `scripts/data/refresh_due.py`, `scripts/data/build_data.py` |

There is no server and no API of its own: the site is static files. What the page calls its
"data" is the set of PNG and JSON files under `data/live/`, built by the data job and served by
GitHub Pages. "API speed" is therefore P4 (how fast Pages serves a file) and, for the build,
the speed of NOAA NOMADS and Open-Meteo, which the data job calls (P6, P7).

### How the systems connect

```
index.html ── maplibre-gl.js (jsDelivr, deferred) ──┐
           └─ js/main.js (boot) ────────────────────┤
                ├─ data.js initData ── manifest.json, field-scales.json
                │     └─ frame-worker.js ── data-core.js ── data/live/gfs/<field>/fNNN.png
                ├─ state.js  (one store; every part subscribes to the keys it uses)
                ├─ clock.js  (state.t is the one time value; layers stamp the hour they drew)
                ├─ field-gl.js   main field, isobars    ┐ MapLibre custom layers:
                ├─ overlays.js   up to 2 more fields    ├ drawn inside the map's own frame
                ├─ wind-gl.js    particles (30 updates/s)┘
                └─ timeline.js, quick.js, search.js, events.js, photos.js (panels and layers)
```

Per-frame work (P2) is all in the three custom layers. While particles are on, `wind-gl.js`
asks the map to repaint about 30 times a second, and every repaint redraws the whole map:
basemap, field, overlays, particle trails.

## How to measure

Everything below runs on a laptop with Node, Python 3 and Playwright 1.63.0
(`npm install --no-save --no-package-lock playwright@1.63.0` and
`npx playwright install chromium`). Headless Chromium draws WebGL in software there and in CI,
so frame rates are far below a real GPU: compare columns with each other, never with a phone
or laptop.

Real data for local runs, without the 10-minute build: copy the deployed files.

```bash
python3 - <<'EOF'
import json, pathlib, urllib.request
base, out = "https://temper31.github.io/open-world-map/data/live/", pathlib.Path("site/data/live")
get = lambda n: urllib.request.urlopen(base + n).read()
m = json.loads(get("manifest.json"))
names = ["manifest.json", "gfs/series.png", "aq/nodes.json"] + [f"aq/{x['file']}" for x in m["aq"]["files"]]
names += [f"gfs/{k}/f{fr['f']:03d}.png" for fr in m["gfs"]["frames"] for k in ("wind", "temp", "rain", "cloud", "pres")]
for n in names:
    p = out / n; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(get(n))
EOF
```

```bash
python3 -m http.server 8123 --bind 127.0.0.1 --directory site
```

**P1, P2, P3 (page):** `scripts/data/perf.mjs` loads each site several times in turn and
reports medians: first contentful paint, first weather field drawn, main-thread time per hour
step, step to field on screen, worst frame gap, frames per second during a pan.

```bash
PERF_RUNS=5 node scripts/data/perf.mjs perf.md "main=http://127.0.0.1:8124/" "branch=http://127.0.0.1:8123/"
```

Serve a checkout of `main` on 8124 with the same `data/live` folder to compare. Pull requests
run this for you (job `verify-checks`, report `perf.md` in the `ci-reports` artifact).

For P1 on a slower connection, the page sets two marks, `owm:data-ready` and
`owm:first-field`; read them with `performance.getEntriesByName(...)` in DevTools with network
throttling on, or from Playwright with CDP `Network.emulateNetworkConditions`.

**P2 on real hardware** (not measurable in CI): DevTools → Performance, record 5 seconds idle
with particles on and 5 seconds of panning; read the frame rate and the GPU track. Do this on
the slowest phone and laptop at hand. This is the measurement still missing (see below).

**P4 (data requests):**

```bash
for p in data/live/manifest.json data/live/gfs/temp/f010.png data/places.json; do
  curl -sS -o /dev/null --compressed -w "$p  first byte %{time_starttransfer}s  total %{time_total}s  %{size_download} B\n" "https://temper31.github.io/open-world-map/$p"
done
```

**P5, P6, P7 (workflows):** Actions → a run → each job lists its steps with times. The data
build prints one line with its own total, download size and request count
(`Run: 137 GFS frames ...`), and whether the GFS frames were built or copied from the build
cache (`GFS reused: ...`). With the GitHub CLI:

```bash
gh run list --workflow pages.yml --limit 20 --json databaseId,event,conclusion,createdAt,updatedAt
```

```bash
gh run view <run id> --json jobs --jq '.jobs[] | [.name, .startedAt, .completedAt] | @tsv'
```

Push to check completion (P5) is `updatedAt − createdAt` of the pull-request run; push to
deploy (P6) is the same for the push run on `main`.

## Measurements and changes, 11 November 2026

Measured on a 4-core Linux machine, headless Chromium with software WebGL, the deployed data
of GFS 18Z 10 Nov, 1280 × 800. Workflow times are from the Actions history of 7 to 11 November.

### P1 Page load: the first field no longer waits for the basemap

**Found.** The forecast data was ready about 0.3 to 0.8 s after navigation, but the weather
layers were only added after MapLibre's `load` event, which fires when every basemap tile of
the first view has arrived. The first frame's files were not even requested until then.

**Changed** (`site/js/main.js`, `boot`). The weather layers are added at `style.load`. Wind
particles and the prefetch of the next two frames still wait for `load`, so they take neither
bandwidth nor frames from the basemap while it loads.

| Median of 5 loads, two rounds | Before | After | Change |
|---|---|---|---|
| First field drawn, local server | 1,825 ms | 585 ms | **−68 %** |
| First field drawn, 40 ms latency and 10 Mbit/s | 6,565 ms | 1,590 ms | **−76 %** |
| Basemap fully loaded, 40 ms latency and 10 Mbit/s | 6,560 ms | 6,345 ms | −3 % (within noise) |
| Basemap fully loaded, local server | 2,100 ms | 2,600 ms | +24 % (see tradeoff) |
| First contentful paint | 160–275 ms | 160–260 ms | unchanged |

**Tradeoff.** With no network delay and software rendering, drawing the field while tiles
arrive costs CPU that the tiles also want, so the basemap finishes about 0.5 s later there. On
the throttled connection, where the wait is the network, it does not. A real GPU draws the
field in well under a millisecond, so I expect no cost there, but that is not measured.

### P2 Frame: measured, nothing changed

| Layers on (pan, software WebGL) | Frames per second |
|---|---|
| Basemap only | 21–24 |
| + temperature field | 20–22 |
| + particles (no field) | 10–12 |
| + field + particles | 8–10 |
| + field + particles + 2 overlays | 5–7 |

The basemap alone takes about 42 ms a frame in software, so everything here is fill rate, and
the numbers say little about a GPU. Two changes to `wind-gl.js` were tried (skip the trail
pass while the trails are empty; ask for the next frame from `render` on slow devices) and
measured with `perf.mjs`, 6 loads each: pan rate 10.0 before and 10.0 after. No evidence, so
they were not kept. What the structure costs on any device: one full-screen pass per field or
overlay, two for the particle trails, and the whole basemap again, 30 times a second while
particles are on.

### P3 Hour step: already fast

1.3–1.4 ms of main-thread work per step, no long tasks, the new field on screen 4–6 ms after
the step (the next two frames are prefetched and decoded in the worker). Nothing changed.

### P4 Data requests (GitHub Pages)

Median of 5, a new connection each time, from a cloud machine in the US:

| File | First byte | Total | Bytes sent |
|---|---|---|---|
| `/` (index.html) | 117 ms | 118 ms | 3.7 KB (gzip) |
| `js/main.js` | 111 ms | 112 ms | 14.7 KB (gzip) |
| `data/live/manifest.json` | 114 ms | 115 ms | 4.7 KB (gzip) |
| `data/live/gfs/temp/f010.png` | 112 ms | 153 ms | 144 KB |
| `data/live/gfs/wind/f010.png` | 114 ms | 134 ms | 155 KB |
| `data/live/gfs/series.png` (first place click) | 141 ms | 172 ms | 430 KB |
| `data/places.json` (first search focus) | 123 ms | 180 ms | 1.2 MB (gzip of 2.7 MB) |

Pages sends `cache-control: max-age=600` for everything and compresses text. There is nothing
to tune on a server that isn't ours. No startup time exists to measure.

### P5 Push to checks, P6 Push to deploy: the data build was repeated for the same cycle

**Found.** "Slow pushes" is the data build. Every run, on a pull request or on `main`,
downloaded the whole GFS cycle again (137 requests to NOMADS a second apart, 1.1 GB) and
re-encoded it, even when the cycle was the one the last run had built:

| Run | Total | `check` | `data` (of which the build step) | After the data job |
|---|---|---|---|---|
| Push to `main`, 11 Nov 03:43 (run 22) | **11 min 13 s** | 8 s | 10 min 28 s (10 min 12 s) | deploy 28 s |
| Pull request, 11 Nov 02:58 (run 21) | **31 min 57 s** | 18 s | 8 min 59 s (8 min 50 s) | `verify-shots` 22 min 34 s, 10 min 05 s of it the satellite probe |
| Pull request, 10 Nov 21:24 (run 13) | **28 min 15 s** | 30 s | 9 min 20 s (9 min 06 s) | `verify-shots` 12 min 45 s; render tests part 3, 18 min 19 s |

Inside `verify-shots`, the accuracy check (1 min 45 s), the perf comparison (2 min 08 s) and
the source probe waited behind 8 minutes of screenshots in the same job.

**Changed.**

1. **GFS build cache** (`scripts/data/build_data.py --gfs-cache`, and the `data` job). The
   finished frames are kept in the Actions cache, keyed by the cycle and by a hash of
   `build_data.py` and `build_wgrib2.sh`. A run on the same cycle with the same build code
   copies them; a new cycle or a change to either script builds as before. The script checks
   the cycle and the code fingerprint itself before it reuses anything, and the air-quality
   refresh, spot check, manifest, forecast history and every check still run each time.
   Caches saved by pull requests are not readable from `main`, so a deploy only ever reuses
   frames that `main` built.
2. **`verify-checks` job.** Accuracy, perf, bandwidth and the source probe run in their own
   job beside the screenshots instead of after them. Their reports are in the new
   **`ci-reports`** artifact; **`ci-screenshots`** keeps the screenshots, `views.json` and the
   satellite probe output. No check was removed or skipped.

**After.** The workflow itself can only be timed once this branch runs in Actions; the build
step is measured locally and the rest is added up from the step times above.

| | Before | After | Change |
|---|---|---|---|
| GFS part of the build, same cycle (measured locally) | 522.3 s | 0.5 s | **−99.9 %** |
| Whole build step, same cycle (measured locally) | 524.4 s | 32.1 s | **−94 %** |
| P6 push to deploy, cycle already built on `main` | 11 min 13 s | about 2 min (estimate) | about −80 % |
| P6 push to deploy, new cycle | 11 min 13 s | unchanged | 0 |
| P5 push to checks, cycle already built, no satellite change | about 22 min (run 21 less the probe) | about 10 min (estimate) | about −55 % |
| P5 push to checks, first run on a new cycle | about 22 min | about 18 min (estimate) | about −18 % |

The local measurement is GFS 00Z 11 Nov from the AWS mirror with `--prefer-aws --skip-aq
--gfs-cache`, run twice: the first run downloaded 801.9 MB in 965 requests and filled the
cache (92 MB); the second downloaded nothing, and its 137 frames and `series.png` were
byte-identical to the first run's. The 32 s that remain are the spot check and the
air-quality range probe against Open-Meteo, which run every time. In Actions the build goes
through NOMADS (612 s in run 22), so the saving there is a little larger.

**Limits of the estimate.** Render tests part 3 (street photos) has taken between 2 min 21 s
and 18 min 19 s; when it is slow it decides the total, and nothing here changes that. A pull
request that touches the satellite code still runs the 30–45 minute probe.

### P7 Data refresh: unchanged

One data run per GFS cycle, started by the hourly timer when the site is behind. Every such
run is a new cycle, so it builds in full (about 10 minutes) and saves the cache for the pushes
that follow.

## Remaining bottlenecks

1. **P2 on real devices is unmeasured.** The 30-a-second full-map repaint for particles is the
   largest standing cost. It needs a recording on a slow phone before anything is changed.
2. **P1 is now bounded by `maplibre-gl.js`** (277 KB compressed from jsDelivr): `main.js` and
   the manifest request wait for it. The module files load in three rounds (main, its imports,
   theirs); preloading them would save about two round trips.
3. **P7 the data build** spends about 137 s of its 10 minutes pausing between NOMADS requests
   (deliberate) and the rest downloading 1.1 GB; the AWS mirror measured about 790 MB.
4. **P5 render tests part 3** varies by a factor of eight with Mapillary's response times.
