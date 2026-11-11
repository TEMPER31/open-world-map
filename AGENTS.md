# Working on this repository

A short map for coding agents and anyone else changing this code. It lists only paths and
commands that were checked against the repository. **When an entry point, a folder, a command
or the way two systems connect changes, update this file in the same change**, and
`docs/performance.md` if a measured pathway moved.

## What this is

A static site (`site/`) published to GitHub Pages: a MapLibre map with weather fields, wind
particles, events and street photos on one timeline. No server, no database, no build step for
the site: plain HTML, CSS and ES modules. The only build is the **data job**, a Python script
that turns a NOAA GFS cycle into PNG frames at deploy time.

Rules checked in CI (`scripts/check_site.py`; settings in `docs/repo-security.md`):

- No keys or tokens in any file. `site/js/secrets.js` is written at deploy time and is ignored.
- No hourly data committed: `site/data/live/` and `site/data/archive/` are deploy output.
- CDN files are pinned by version with SRI hashes (`site/index.html`).

Owner's rules that no check enforces: no new library, library version or data source without
the owner's yes (`docs/sources-register.md` lists every source and its licence), and only the
owner merges into `main`.

## Map of the code

| Path | What it is |
|---|---|
| `site/index.html` | the map page: CSP, MapLibre from jsDelivr (deferred), `js/main.js` |
| `site/js/main.js` | entry point. `boot()` creates the map, loads data, wires every panel and layer |
| `site/js/state.js` | the one state store; parts subscribe with `on([keys], fn)` |
| `site/js/clock.js` | the one time value (`state.t`); layers `stamp()` the hour they drew |
| `site/js/data.js` | page side of the data: manifest, worker calls (`getFieldTexture`, `getPoint`, ...) |
| `site/js/frame-worker.js`, `site/js/data-core.js` | worker: fetch and decode PNG frames, build textures, cache |
| `site/js/field-gl.js` | main field and isobars (MapLibre custom layer, fragment shader) |
| `site/js/overlays.js` | up to two more `FieldGL` layers |
| `site/js/wind-gl.js` | wind particles (custom layer; its `loop` asks for ~30 repaints a second) |
| `site/js/timeline.js`, `quick.js`, `search.js`, `places.js`, `events.js`, `photos.js` | timeline, quick view, search, events and photo layers |
| `site/css/app.css`, `site/css/page.css` | design tokens and layout; the static pages |
| `scripts/data/build_data.py` | the data job: GFS (NOMADS, AWS fallback) and air quality to `site/data/live/` |
| `scripts/data/archive_day.py` | forecast history carried forward on the deployed site |
| `scripts/data/refresh_due.py` | decides whether the hourly timer starts a data run |
| `scripts/check_site.py` | repository checks run first in CI |
| `scripts/data/*.mjs` | browser tests and reports (Playwright): `render-tests`, `screenshots`, `accuracy`, `perf`, `bandwidth`, probes |
| `.github/workflows/pages.yml` | checks, data build, deploy; on pull requests also tests, screenshots, reports |
| `.github/workflows/refresh.yml` | hourly backup timer that starts `pages.yml` when a new GFS cycle is due |

**Where per-frame work happens:** `render()` and `prerender()` in `site/js/wind-gl.js`,
`render()` in `site/js/field-gl.js` (once per field or overlay). They run inside MapLibre's
frame; while particles are on, the whole map is redrawn about 30 times a second. Work per hour
step is in `updateField`, `updateWind` and `updateHL` in `site/js/main.js` and in the worker.

## Pathways (labels used in `docs/performance.md`)

| Label | Pathway | Where |
|---|---|---|
| P1 Page load | navigation to first weather field | `site/index.html`, `boot()` in `site/js/main.js`, `initData()` in `site/js/data.js` |
| P2 Frame | one repaint | `site/js/wind-gl.js`, `site/js/field-gl.js`, `site/js/overlays.js` |
| P3 Hour step | `state.t` change to every layer redrawn | `site/js/main.js`, `site/js/frame-worker.js`, `site/js/data-core.js` |
| P4 Data request | one file under `data/live/` from GitHub Pages | `decodePNG` in `site/js/data-core.js` |
| P5 Push to checks | pull-request push to last check job | `pages.yml`: `check`, `data`, `verify-tests`, `verify-shots`, `verify-checks` |
| P6 Push to deploy | push to `main` to Pages deploy | `pages.yml`: `check`, `data`, `deploy` |
| P7 Data refresh | new GFS cycle to site | `refresh.yml`, `scripts/data/refresh_due.py`, `scripts/data/build_data.py` |

There is no API server. "API" here means the static files of P4 and the outside services the
data job calls (NOAA NOMADS, the AWS GFS mirror, Open-Meteo).

## Commands

Preview (ES modules and the worker need HTTP):

```bash
python3 -m http.server 8123 --bind 127.0.0.1 --directory site
```

The checks CI runs first, all offline except `--verify-sri`:

```bash
python3 scripts/check_site.py
```

```bash
python3 -m unittest scripts/data/test_refresh_due.py scripts/data/test_build_data.py scripts/data/test_archive_day.py
```

```bash
node scripts/data/unit-tests.mjs
```

```bash
python3 -m py_compile scripts/*.py scripts/data/*.py
```

Browser tests need Playwright 1.63.0 with Chromium and a served site. Parts 1 to 4 can run
one at a time with `RT_PART`:

```bash
RT_PART=1 node scripts/data/render-tests.mjs http://127.0.0.1:8123/ render-tests-1.md
```

Performance, two or more sites compared on the same machine (see `docs/performance.md` for
getting real data locally without the full build):

```bash
PERF_RUNS=5 node scripts/data/perf.mjs perf.md "main=http://127.0.0.1:8124/" "branch=http://127.0.0.1:8123/"
```

Data build (about 10 minutes and 1.1 GB the first time; with `--gfs-cache` a second build of
the same GFS cycle copies the frames in seconds):

```bash
scripts/data/build_wgrib2.sh .wgrib2
```

```bash
WGRIB2=.wgrib2/bin/wgrib2 python3 scripts/data/build_data.py --out site/data/live --prefer-aws --gfs-cache .gfs-cache
```

## Workflows on a push

- **Pull request:** `pages.yml` runs `check` → `data` → `verify-tests` (4 parts),
  `verify-shots` and `verify-checks` side by side. Reports are artifacts
  (`render-tests-*`, `ci-screenshots`, `ci-reports`); nothing is committed.
- **Push to `main`:** `pages.yml` runs `check` → `data` → `deploy`, unless only files in its
  `paths-ignore` list changed. `refresh.yml` restarts the hourly timer.
- The `data` job reuses three Actions caches: the wgrib2 build, the last air-quality build and
  the GFS frames of the current cycle.

## Deeper notes

- `docs/performance.md`: pathways, how to measure each, measurements, remaining bottlenecks.
- `docs/data-pipeline.md`: sources, formats, schedule, sizes, failure handling, build cache.
- `docs/repo-security.md`: branch protection and repository settings.
- `docs/design/README.md`: the design the site follows.
- `README.md`: features, layout of the repository, deploying.
