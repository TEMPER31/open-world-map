# Open World Map

**Live site: <https://temper31.github.io/open-world-map/>**

A free, open-source, non-commercial world map: weather fields with moving wind, street-level
photos and natural events, all on one shared 48-hour timeline. It has no accounts, no ads and
no paywall.

**Watching places, not people.** The site is static: no server, no analytics, no cookies.
Fonts are self-hosted. Settings stay in your browser's local storage. The only
third-party requests are for the pinned map library (jsDelivr) and map tiles.

> **Status: Phase 2 (data pipeline).** Weather comes from the latest NOAA GFS 0.25° run
> (hourly, 48 h) and air quality from CAMS via Open-Meteo, rebuilt four times a day by GitHub
> Actions. See [`docs/data-pipeline.md`](docs/data-pipeline.md). If no data has been built yet,
> the map falls back to clearly labelled sample data.

## What's in Phase 1

- The v3 design (`docs/design/`), built as the real site. Desktop has a top bar, a layers
  rail, a legend card, a bottom timeline, a detail panel, zoom buttons, a scale bar and a
  credits strip. Below 1024 px it switches to a phone layout with a search pill, a field
  chip, a time scrubber, bottom sheets and a tab bar.
- MapLibre GL JS (flat Web Mercator) with three basemaps. The UI stays dark on all of them.
  - **Dark** and **Light**: OpenFreeMap vector tiles with custom palettes.
  - **Satellite**: a keyless raster stack. NASA GIBS covers world to regional zoom, EOX
    Sentinel-2 cloudless covers regional to city zoom worldwide, and USGS NAIP covers street
    zoom in the contiguous US. The layers cross-fade by zoom. Satellite tiles load only while
    Satellite is selected and are released when you switch away.
- Six fields from `field-scales.json` (wind, temperature, precipitation, PM2.5, clouds,
  pressure with isobars and H/L centres), each with its legend, plus a cursor probe and
  wind particles.
- A timeline from Now to +48 h in hourly frames. You can drag, click or use the arrow keys,
  and play loops it. Frames are generated in a Web Worker so scrubbing stays smooth.
- Click (or tap) anywhere for a place panel with every field's value and a 48-hour chart.
- Layers that aren't built yet (events, street photos, search, downloads) show as "coming soon".

## Phases

| Phase | Scope |
|---|---|
| 1 · Foundation | Layout, basemaps, sample-data field rendering, timeline, deploy workflow |
| **2 · Data pipeline** | Scheduled GitHub Actions job (Python stdlib + pinned wgrib2) building hourly GFS + CAMS frames; GPU wind particles *(this phase)* |
| 3 · Weather layers + shared time state | Real fields on the timeline; one time state driving every layer |
| 4 · Street photos | Coverage lines and clickable photo dots, with a photo viewer |
| 5 · Event layers | Earthquakes, wildfires, tropical cyclones and severe storms |
| 6 · Pages, security, launch | About/Data/Sources/Privacy pages, CSP, launch checks |

## Preview locally

No build step. Serve the `site/` folder with any static server:

```bash
python3 -m http.server 8000 --directory site
```

Then open <http://localhost:8000>. Opening `index.html` straight from disk won't work,
because ES modules and the worker need HTTP.

Checks (the same ones CI runs):

```bash
python3 scripts/check_site.py
```

To preview with real data, build it locally (about 3 minutes, ~260 MB download) into the
ignored `site/data/live/` folder:

```bash
scripts/data/build_wgrib2.sh .wgrib2
```

```bash
WGRIB2=.wgrib2/bin/wgrib2 python3 scripts/data/build_data.py --out site/data/live --prefer-aws
```

Add `--verify-sri` to download the pinned CDN files and compare their hashes; this needs
network access.

## Layout

```
site/                 the deployed site (only this folder is published)
  index.html
  css/app.css         design tokens (colours, type, spacing) + layout
  js/main.js          wiring: map, panels, probe, detail panel, credits
  js/state.js         shared state store (persisted prefs in localStorage)
  js/basemaps.js      Dark/Light vector style, Satellite raster stack
  js/config.js        tile hosts, zoom ranges, credits (no keys, ever)
  js/scales.js        legends + colour lookup tables from field-scales.json
  js/data.js          forecast data provider (live manifest, or sample fallback)
  js/data-core.js     PNG decode + dequantise, AQ by valid time, caches
  js/frame-worker.js  module worker running data-core off the main thread
  js/sample-data.js   SAMPLE weather generator (fallback only, labelled)
  js/grid.js          bilinear sampling, view extent, NaN fill, Catmull-Rom upsampling
  js/contours.js      H/L pressure centres
  js/field-gl.js      weather field on the GPU (value texture + colour LUT), isobars, H/L labels
  js/wind-gl.js       GPU wind particles (MapLibre custom layer, webgl-wind technique)
  js/timeline.js      timeline + mobile scrubber
  data/               field-scales.json, Natural Earth GeoJSON; data/live/ is built in CI
  fonts/              IBM Plex (OFL)
docs/design/          the v3 design bundle (canonical mockup, README, scales)
docs/sources-register.md   every source, licence, credit and open question
scripts/              build_coastlines.py (one-off), check_site.py (CI)
scripts/data/         build_data.py, build_wgrib2.sh, archive_day.py, screenshots.mjs
data/archive/         one small JSON summary per day (hourly files are never committed)
docs/data-pipeline.md sources, formats, schedule, sizes, failure handling
.github/workflows/    check, build data, deploy to GitHub Pages (4x daily + on push)
```

## Deploying

`.github/workflows/pages.yml` runs the checks and builds the data on every pull request,
push and schedule (four times a day, after each GFS cycle). On `main` it also deploys `site/`
with the data to GitHub Pages. On pull requests it also takes screenshots, runs the accuracy
check and the rendering tests: the screenshots and probe images go to the run's
**ci-screenshots** artifact (kept 30 days), and only the small text reports are committed to
`docs/screenshots/<branch>/` (`accuracy.md`, `render-tests.md`, and `views.json` /
`run-report.json` when under ~200 KB). GitHub pauses scheduled workflows after 60 days without
repository activity; re-enable it from the Actions tab if that happens. To turn it on, set **Settings → Pages → Source:
GitHub Actions**. Publishing Pages from a private repository needs a paid GitHub plan;
on a free plan, the repository has to be public.

## Sources and credits

See [`docs/sources-register.md`](docs/sources-register.md). Every source in use is credited
in the credits strip on the map while it's on screen.

## Licence

Code: [MIT](LICENSE). Data and imagery keep their own licences (see the register).
