# Open World Map

**Live site: <https://temper31.github.io/open-world-map/>**

A free, open-source, non-commercial world map: weather fields with moving wind, street-level
photos and natural events, all on one shared 7-day timeline. It has no accounts, no ads and
no paywall.

**Watching places, not people.** The map is static and uses no analytics or tracking cookies.
Fonts are self-hosted, and preferences stay in your browser's local storage. The map uses
jsDelivr and OpenFreeMap on every visit. Satellite, events and street photos use additional
services while enabled; they start off on every visit and are not remembered. See the [privacy draft](docs/privacy-draft.md) for the request list.

> **Status: Phase 6 (launch preparation)**. Weather comes from the latest NOAA GFS 0.25° run
> (hourly to 5 days, then every 3 hours to 7 days) and air quality from CAMS via Open-Meteo, rebuilt after each new GFS run (usually four times a day) by
> GitHub Actions. See [`docs/data-pipeline.md`](docs/data-pipeline.md). If no data has been built yet,
> the map falls back to clearly labelled sample data.

## Map features

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
- **Events** show earthquakes, wildfires, volcanoes, storms and disaster alerts. A marker opens
  the event details and a source link.
- **Street photos** show Mapillary coverage and a photo viewer when a client token is configured.
- **Overlays** can add up to two fields over the main field.
- **Place search**: type a town or city (accents and case don't matter) or "lat, lon". The
  place list (GeoNames, `site/data/places.json`) loads from the site the first time the search box
  is focused and is searched in the browser; nothing typed is sent or stored. Picking a result
  flies there and opens the place panel at the hour on the timeline.
- **Downloads** of the processed data are not built yet: their buttons say "Coming soon".

## Pages

Besides the map (`index.html`), the site has five static pages in the same design, linked from
the footer (under the layers rail on desktop; at the end of the Data and Settings sheets on
phones):

- `about.html`: About, the project and its rules.
- `data.html`: Data, the sources, grids, update times and known limits; downloads are coming soon.
- `sources.html`: Sources & licences, the same rows as `docs/sources-register.md`.
- `privacy.html`: Privacy & disclaimer, every host the browser contacts and when (from
  `docs/privacy-draft.md`), and the forecast disclaimer.
- `404.html`: served by GitHub Pages for missing paths (absolute `/open-world-map/` links).

## Timeline and controls

- **One clock.** A single time value drives the field, wind particles, isobars, H/L labels,
  probe, place panel and chart. The timeline runs from Now (the frame closest to the current
  time, labelled with its forecast hour) to +7 days, hourly to +5 days and 3-hourly after.
  Play/pause, step buttons, Space and ←/→, speed 1×/2×/4×, local time next to UTC (either
  first). Play waits for each frame to be drawn instead of skipping. The **Now** button
  returns to the Now frame (as the Home key does on the timeline).
- **One units setting**: °C/°F, km/h · mph · m/s · knots, km/mi, with Metric and US presets
  (US by default for an en-US browser). Applies to the probe, place panel, chart, legends,
  scale bar and measure tool. Data stays metric; only what you read is converted.
- **Place panel** with every value, both clocks and a close button (Esc). A clicked point is named
  after the nearest town or city in the place list (within 100 km), with its distance. Its
  **Quick view** button swaps in a plain summary: now (temperature, sky, wind), the next 48 hours,
  the next 7 days, and sunrise and sunset worked out in the browser (NOAA solar formulas). The
  detailed view is what opens every time. On phones it is a
  bottom sheet (peek / half / full); the layers sheet opens to 40 % of the map.
- **Layers rail**: only the selected field is expanded, with its legend and options.
- **Distance tool** (ruler button): click points for great-circle legs and the total.

### Time API (for future layers)

```js
import { onTime, getValidTime } from './js/clock.js';
const off = onTime(({ t, valid }) => redraw(valid)); // now and on every change; off() stops
getValidTime(); // the valid time on the map, ms since epoch (UTC)
```

A layer calls `stamp(name, t)` when it has drawn hour `t` (or `null` when hidden); the player
waits until every visible layer has drawn the current hour, and the render tests check that all
of them agree. See `site/js/clock.js`.

## Phases

| Phase | Scope |
|---|---|
| 1 · Foundation | Layout, basemaps, sample-data field rendering, timeline, deploy workflow |
| 2 · Data pipeline | Scheduled GitHub Actions job (Python stdlib + pinned wgrib2) building hourly GFS + CAMS frames; GPU wind particles |
| 3 · Usability | Shared forecast clock, timeline controls, units, place and layers sheets, distance tool |
| 4 · Street photos | Coverage lines and clickable photo dots, with a photo viewer |
| 5 · Event layers | Earthquakes, wildfires, tropical cyclones and severe storms |
| **6 · Launch preparation** | Data pipeline fixes, source and privacy documentation, repository security, launch checks *(in progress)* |

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
  index.html          the map
  about.html, data.html, sources.html, privacy.html, 404.html   static pages
  css/app.css         design tokens (colours, type, spacing) + layout
  css/page.css        static pages (loaded after app.css)
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
  js/places.js        place list: search, lat/lon parser, nearest place
  js/search.js        search box and the place panel's name line
  js/quick.js         the place panel's quick view
  js/sun.js           sunrise and sunset (NOAA solar formulas)
  data/               field-scales.json, Natural Earth GeoJSON, places.json; data/live/ and data/archive/
                      (forecast history) are built in CI, never committed
  fonts/              IBM Plex (OFL)
docs/design/          the v3 design bundle (canonical mockup, README, scales)
docs/sources-register.md   every source, licence, credit and open question
scripts/              build_coastlines.py, build_places.py (one-off), check_site.py (CI)
scripts/data/         build_data.py, build_wgrib2.sh, archive_day.py (forecast history), screenshots.mjs
data/archive/         daily run summaries, 29 Oct to 4 Nov 2026: the seed for the forecast history (never added to)
docs/data-pipeline.md sources, formats, schedule, sizes, failure handling
.github/workflows/    check, build data, deploy to GitHub Pages (4x daily + on push)
```

## Deploying

`.github/workflows/pages.yml` runs the checks and builds the data on every pull request,
push and schedule (four times a day, after each GFS cycle). A push to `main` that only changes
docs or tests (the `paths-ignore` list in the workflow) skips it: nothing on the site changes. GitHub has not been firing that
schedule for this repository, so `.github/workflows/refresh.yml` is a backup timer: once an
hour it starts a data run if the site is behind the newest complete GFS run (one run per
cycle, see `docs/data-pipeline.md`). It needs a 60-minute wait timer on the `refresh-timer`
environment (**Settings → Environments → New environment** `refresh-timer` → **Wait timer**
60, deployment branches: `main` only); without one it stops on its first round. Start it
from **Actions → Data refresh timer → Run workflow**; a push to `main` also restarts it.
On `main`, `pages.yml` also deploys `site/` with the data to GitHub Pages. On pull requests it also takes screenshots, runs the accuracy
check and the rendering tests: all output (screenshots, probe images and text
reports) goes to the run's **ci-screenshots** and **render-tests-*** artifacts.
GitHub pauses scheduled workflows after 60 days without
repository activity; re-enable it from the Actions tab if that happens. To turn it on, set **Settings → Pages → Source:
GitHub Actions**. Publishing Pages from a private repository needs a paid GitHub plan;
on a free plan, the repository has to be public.

## Sources and credits

See [`docs/sources-register.md`](docs/sources-register.md). Every source in use is credited
in the credits strip on the map while it's on screen.

## Licence

Code: [MIT](LICENSE). Data and imagery keep their own licences (see the register).
