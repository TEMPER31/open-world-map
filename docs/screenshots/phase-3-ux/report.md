# Phase 3 report: usability (`phase-3-ux`)

PR: TEMPER31/open-world-map#10. CI run with real GFS + CAMS data:
https://github.com/TEMPER31/open-world-map/actions/runs/41181444121 (first run; numbers below
come from it unless marked "local"). Local runs used a synthetic 7-day dataset in the real file
format (the build container cannot reach NOAA, Open-Meteo, the tile server or the CDN).

## Inventory: what existed before this PR

| # | Item | Before | This PR |
|---|---|---|---|
| 1 | One clock for every layer | **Partly done.** One `state.t` already drove the field, particles, isobars, H/L and panel. No layer reported which hour it had drawn, there was no API for later layers, and the hover probe kept showing the old hour until the mouse moved. | Clock module + API, every layer reports its drawn hour, probe follows the hour, player waits for the frame |
| 2 | Timeline controls | **Partly done.** Play/pause, step buttons, arrow keys on the focused track, frame snapping across f120 -> f123, prefetch of 2 frames, hidden layers not fetched. Speed chip was a static label; local time only as a suffix; "Now" was the frame at or before the current hour. | Space and Left/Right anywhere, 1x/2x/4x, local next to UTC with an order setting, Now = closest frame + forecast hour, 44 px phone targets, full-width phone scrubber |
| 3 | One units setting | **Partly done.** °C/°F only (legend, panel, chart, probe). | km/h, mph, m/s, kn; km/mi; Metric/US/Custom presets; scale bar and measure tool; unit tests |
| 4 | Info pop-up and place panel | **Partly done.** Desktop panel with every value, close button, Esc, "~50 km" note, cloud "area average". Phone panel was a fixed sheet. | Restyled header (place name "coming soon", both clocks), probe card with time; phone sheet peek/half/full with drag handle |
| 5 | Layers panel | **Partly done.** Rail with radio rows, "None", click-again-to-turn-off, phone tiles. Legend was a separate floating card. | Selected field expands with legend + options; phone sheet half = 40 % of the map with a drag handle; wind colours adjusted |
| 6 | Distance measure tool | **New** | Built |
| 7 | Less clutter | **Partly done.** Zoom buttons, scale bar and credits were already custom dark elements (MapLibre's own controls are not used). | Particles thinner and more transparent; scale bar follows units |
| 8 | Performance | **Partly done.** Render tests had a per-step profile on the branch only. | Before/after script: main vs this branch, same runner, same data |

## Summary

All eight items are built. In CI with real data, **45 of 46 render checks passed** on the first
run. The one failure was the test, not the page (explained under item 1); with the fix, the local
run passes 46 of 46 (CI re-run pending at the time of writing; see "CI re-run" below). The
accuracy check matches the previous runs: encoding-only 40/0/0 and 20/0/0, grid alignment 27/0/0,
and the raw-GFS misses are the documented known limits. **Air-quality grid nodes: not yet
checked** (0/0/3 "not recorded"): the deployed air-quality files are from 05:23Z, built before the
cache kept `nodes.json`; the next real download is the 16:47Z scheduled run (see below). Added JS
is 21.4 KB. Data files, Open-Meteo calls, MapLibre pin and the no-keys/no-build rules are unchanged.

## 1. One clock for every layer

**What changed.** `site/js/clock.js` exposes `onTime(fn)`, `getValidTime()`, `getT()`,
`setTime(t)` and `stamp(layer, t)` / `layerTimes()`. The field, isobars, H/L labels, wind
particles, probe, place panel, chart and timeline each stamp the hour they have drawn (`null` when
hidden, `-1` while loading). The probe now refreshes when the hour, field or units change. The
player only advances when every visible layer has drawn the current hour (or after 1.5 s), so it
holds instead of skipping. The README documents the API for Phase 5. The chart's playhead dot now
shows the panel's own temperature (the known "chart vs panel" limit, partly fixed; the line is still
the 3° series).

**Verified.**

| Check | Result |
|---|---|
| Layers stamped while stepping 8 times, including f119 -> f120 -> f123 -> f126 (pressure, particles on, panel open, pointer on the map) | local: 8/8 steps in sync; layers timeline, field, isobars, hl, wind, panel, chart, probe; slowest 160 ms |
| Same, CI first run | 8/8 steps in sync but **probe missing from the list** -> test FAIL (see below) |
| Panel, chart and probe DOM show the timeline hour | CI pass (`panel 118 = chart 118 = probe 118 = t 118`) |
| `onTime()` fires with `{t, valid}`; `getValidTime()` agrees | CI pass |
| All 42 screenshot views (real data): distinct valid times reported by the visible layers | 1 in every view |

The CI failure: the test clicked the on-screen step button, which takes the pointer off the map
and hides the probe; the sync check then passed at once (0 ms) before the probe came back, so the
probe was never in the list. The page did the right thing. The test now steps with the arrow key
while the pointer stays on the map, which is also the stronger test (the probe must follow the hour
without a mouse move).

**Unresolved.** None known.

## 2. Timeline controls

**What changed.** Space plays/pauses and Left/Right step anywhere on the page (not in form fields;
Space on a focused button presses that button). On the map, Left/Right move in time and Up/Down
still pan. Speed chip cycles 1x/2x/4x (also in Settings). The time label shows local time next to
UTC ("Sat 03:00 local · 08:00 UTC"), with a "Local · UTC" chip and a Settings choice for which
comes first. "Now" is the frame closest to the current time (it was the frame at or before the
current hour) and the label says "forecast hour N". Phone: 44 px buttons and a full-width 44 px
track on its own row.

**Verified** (CI).

| Check | Result |
|---|---|
| Play button and Space toggle | pass |
| Arrow keys and step button move one frame | pass (2, 1, 2) |
| f120 -> f123 -> f126 and back with the button and arrows | pass |
| Play crosses f120 one frame per tick | pass |
| 4x vs 1x | pass: 22 vs 5 frames in 2 s (local: same) |
| Local next to UTC in US Central, order switch | pass: "Sat 03:00 local · 08:00 UTC" / "Sat 08:00 UTC · 03:00 local" |
| "Now" closest frame + forecast hour | pass: the Now frame is 2 min from the clock; label "forecast hour 8" |
| Prefetch next 2 frames; nothing for hidden layers | pass (temp f+1, f+2 fetched; no wind/rain/cloud/pres) |
| None + particles off: no data fetched while stepping | pass (0 requests) |
| Phone: buttons and track >= 44 px, nothing over the map centre | pass (track 332 x 44 px; centre clear) |

The check allows up to 30 min (half an hourly step).

**Unresolved.** Real-phone drag feel is unverified (CI emulates touch).

## 3. One units setting

**What changed.** `site/js/units.js` (no DOM). Settings: Units (Metric / US / Custom),
Temperature, Wind, Distance. First visit: US for an `en-US` browser, Metric otherwise (it used to
pick °F for a few more locales). Saved in localStorage. Applies to the probe, place panel, chart
header and axis, legend ticks (colours unchanged), scale bar (km/m or mi/ft) and the measure tool.
Data stays metric. Precipitation stays mm/h and pressure hPa: the brief lists temperature, speed and
distance only.

**Verified.**

| Check | Result |
|---|---|
| Unit tests (CI check job) | 31 / 31 pass (°C/°F, km/h -> mph/m/s/kn, km -> mi, formatting, scale bar, presets, locale default, great circle) |
| US units everywhere (CI) | pass: probe "34 mph", panel "mph" and "°F", chart "temp °F · wind mph", legend ticks "0 12 25 37 50 62 93+", scale "200 mi", measure "… mi" |
| Remembered after reload | pass (F, mph, mi, preset US) |
| Knots + °F shows "Custom" | pass |

**Unresolved.** None.

## 4. Info pop-up and place panel

**What changed.** Panel header: kicker, coordinates, "Place name: coming soon", forecast-hour tag
and both clocks; close button labelled "Close (Esc)". Every value keeps its units and descriptors
("area average", "past hour · area avg"), and the "~50 km grid" note stays. Probe: dark card with
value, descriptor, coordinates and the time. Phone: bottom sheet with a drag handle and three
snaps (peek 150 px, half = 40 % of the map, full); tapping the header in peek opens half; the map
pans so the chosen place stays above the sheet.

**Verified.** Esc closes the panel (CI pass). Phone sheet (CI): peek 150 px -> half 314 px -> full
720 px by tapping the handle; dragging down from full snaps to peek. Screenshots below.

**Unresolved.** On the desktop the click pop-up is the existing right-hand panel (restyled), not a
pop-up anchored at the point. Say if you want an anchored one.

## 5. Layers panel

**What changed.** Desktop rail: only the selected field opens, showing its legend, unit buttons
(temperature, wind) and a one-line note; the others stay one line. The legend is one element moved
to where it is read: inside the rail, floating over the map when the rail is minimised, in the
layers sheet on phones. Phone layers sheet has a drag handle; half-open is 40 % of the map.

**Wind colours.** Checked on the actual scale: each stop and the values between them converted to
CIELAB (D65), comparing calm with the fastest winds: on the dark theme, calm (0 km/h, L* 20.3) and 150 km/h (L* 27.2) were nearly the same
darkness (ΔE 32.2, mostly hue), so a storm core read like calm air. Changed the two top dark-theme
stops in **both** `field-scales.json` copies and `docs/design/owm-scales.js`:

| Stop | Before | After |
|---|---|---|
| 105 km/h | `#9c3a7e` | `#b44c90` |
| 150 km/h | `#5e2a6e` | `#f0c4ee` |
| ΔE calm vs 150 km/h | 32.2 | 66.4 |
| L* difference calm vs 150 km/h | 6.9 | 63.8 |

The light theme was already clear (ΔE 68.2) and is unchanged. The two mockup HTML files in
`docs/design/` still show the old colours (kept as the design reference).

**Verified.** CI: only the selected field is expanded with the legend inside; None collapses all;
clicking the active row turns it off; "None" remembered after reload. Phone layers sheet 314 of
784 px = 40.1 %.

**Unresolved.** None.

## 6. Distance measure tool

**What changed.** Ruler button (desktop zoom group, phone "MSR"). Click/tap adds points; each leg
and the total are great-circle distances, drawn as curved lines with leg labels in a MapLibre
GeoJSON layer (no DOM markers). Panel: total, legs, km/mi buttons (they set the page-wide unit),
Undo, Clear, Done, Esc. While on, clicks never open the place panel and the probe is hidden.

**Verified.**

| Check | Result |
|---|---|
| London -> New York by clicking the map (CI) | 5,569 km (−0.02 %), within 0.5 % |
| km/mi toggle | 3,460 mi (−0.03 % vs 3,461) and the page-wide unit becomes mi |
| Place panel not opened while measuring; drawn as GeoJSON; DOM markers | not opened; 11 GeoJSON features; 0 DOM markers |
| Undo, Esc exits | pass |
| Haversine (unit test) | 5,570.2 km; path vertex matches Clairaut's relation to 0.01° |

**Unresolved.** None.

## 7. Less clutter

**What changed.** Particles: 1 px (1.5 px on 2x screens, was 2 px) and more transparent (dark
0.75 -> 0.58, over clouds 0.7 -> 0.55, light 0.55 -> 0.42); density still follows the setting.
Map labels and roads stay above the field and particles (layer order unchanged). Zoom buttons,
scale bar and credits are the existing dark custom elements; the scale bar now follows units.

**Verified.** Screenshots `p3-desktop-light` / `p3-phone-light` (light basemap) and the default
views. Pan frame rate is in item 8.

**Unresolved.** How the thinner particles look on a real high-density screen is for the owner to
judge.

## 8. Performance

Same runner, same data, medians of 3 loads and 10 hour steps (`perf.md`; software WebGL):

| Site | FCP (ms) | First field drawn (ms) | Main-thread work per step (ms) | Long tasks per step (ms) | Step -> field on screen (ms) | Worst frame gap stepping (ms) | Pan frames/s |
|---|---|---|---|---|---|---|---|
| main | 88 | 1,824 | 1.1 | 0 | 3 | 583 | 8.5 |
| phase-3-ux | 100 | 1,685 | 1.8 | 0 | 4 | 588 | 7.0 |

The main-thread work per step grew by 0.7 ms (more labels update per step) and stays far below a
frame. First field and frame gaps are within noise. Pan frames per second is 18 % lower in this run
(8.5 vs 7.0); with software WebGL a single run is noisy (the branch-only profile in the same run
measured 5.5-7.0), so this is **unresolved, not established**: the owner's real-laptop check below
decides it. No new libraries. Added JavaScript: **21.4 KB** unminified (budget ~25 KB); CSS +5.3
KB, HTML +2.1 KB.

| File | main (bytes) | branch | added |
|---|---|---|---|
| main.js | 29,330 | 36,327 | 6,997 |
| timeline.js | 6,848 | 9,958 | 3,110 |
| measure.js | — | 3,974 | 3,974 |
| units.js | — | 3,582 | 3,582 |
| sheet.js | — | 1,734 | 1,734 |
| clock.js | — | 1,434 | 1,434 |
| state.js, data.js, scales.js, wind-gl.js | | | 546 |
| **Total site/js** | 111,324 | 132,701 | **21,377** |

## 7-day features (still working)

| Check | Result (CI, real data) |
|---|---|
| Frames f008 -> f168, 113 hourly + 16 three-hourly | pass |
| +0 h (`p3-*-t0`) | "Now · Sat 03:00 local · 08:00 UTC", forecast hour 8 |
| +5 d (`p3-*-5d-aq`) | "Air quality forecast ends Wed 4 Nov · 12:00 UTC", legend dimmed, no AQ files fetched |
| +7 d (`p3-*-7d-rain`) | "past 3 h", forecast hour 168 |
| Step and play across f120 -> f123 | pass (one frame per press / per tick) |

## Accuracy (no regressions)

| Check | phase-2-fixes-2 (after) | repo-cleanup | **phase-3-ux** |
|---|---|---|---|
| Page vs stored grid (encoding only), +0/+24 h | 40 / 0 / 0 | 40 / 0 / 0 | **40 / 0 / 0** |
| f120 encoding only | — | 20 / 0 / 0 | **20 / 0 / 0** |
| Grid alignment at 0.5° nodes | 18 / 0 / 0 | 27 / 0 / 0 | **27 / 0 / 0** |
| Page vs raw NOAA GFS 0.25°, +0/+24 h | 47 / 9 / 4 | 52 / 4 / 4 | **52 / 5 / 3** |
| f120 page vs raw GFS | — | 22 / 5 / 3 | **22 / 5 / 3** |

The raw-GFS misses are the known limits (Denver temperature −2.8 to −3.8 °C and pressure +0.5 to
+0.9 hPa; Miami coastal wind −5.0 km/h and rain at +112 h; Delhi +112 h −1.5 °C) plus London
+24 h wind +3.1 km/h vs ±3, the same 0.75° wind-grid effect as Miami. This PR does not touch the
data job, decoders or sampling (no diff in `build_data.py`, `data-core.js`, `frame-worker.js`),
and the encoding-only rows are identical.

## Air quality at grid nodes

| Node | Page | Downloaded | Diff | Result |
|---|---|---|---|---|
| 28N 76E (Delhi) | 7.80 | — | — | not recorded by this build |
| 52N 0E (London) | 15.10 | — | — | not recorded by this build |
| 40N 116E (Beijing) | 22.60 | — | — | not recorded by this build |

**Cause of the earlier 0/3 and of "not recorded".** In the forecast-7day run the site served
air-quality files built hours earlier while the check compared them with a newer CAMS run (the
brief's hypothesis). Since PR #8 the build saves what it downloaded in `aq/nodes.json`, but the
files deployed now (built 05:23Z) come from the cache made before that, so there is nothing to
compare against yet. For information, page vs the CAMS forecast served at test time is **0.00 at
all three nodes** in this run, so the page reproduces CAMS exactly at the nodes. The next real
download is the scheduled 16:47Z run (cache 11 h old); this PR's check is re-run after it.
**Pending.**

## Other constraints

- Data file sizes and Open-Meteo calls: unchanged (data job not modified).
- MapLibre 5.24.0 with SRI (hash re-checked against the npm package locally; CI `--verify-sri`
  passes). No keys. No build step. `check_site.py` passes.
- CI: green on run 41181444121 (check, data 10 min 43 s, verify; deploy and archive are skipped on
  pull requests). Render tests and accuracy are report steps, so their results are read from the
  reports, not the job status.

## Screenshots (artifact `ci-screenshots`)

Desktop 1280 x 800 and phone 390 x 844 (2x), US Central time zone:

| View | Desktop | Phone |
|---|---|---|
| Default (wind, particles) | `p3-desktop-default.png` | `p3-phone-default.png` |
| US units (panel open) | `p3-desktop-us-units.png` | `p3-phone-us-units.png` |
| Pop-up (pressure, all values) | `p3-desktop-popup.png` | `p3-phone-popup.png` |
| Place sheet peek | `p3-desktop-place-peek.png` | `p3-phone-place-peek.png` |
| Place sheet full | `p3-desktop-place-full.png` | `p3-phone-place-full.png` |
| Layers (rail / sheet) | `p3-desktop-layers.png` | `p3-phone-layers.png` |
| Measure tool | `p3-desktop-measure.png` (London -> New York -> Rio) | `p3-phone-measure.png` |
| Light basemap | `p3-desktop-light.png` | `p3-phone-light.png` |
| +0 h | `p3-desktop-t0.png` | `p3-phone-t0.png` |
| +5 d, air quality ended | `p3-desktop-5d-aq.png` | `p3-phone-5d-aq.png` |
| +7 d, rain "past 3 h" | `p3-desktop-7d-rain.png` | `p3-phone-7d-rain.png` |

The earlier views (`wind-atlantic.png` ... `phone-4d.png`) are still produced. On the desktop the
place panel has no snaps; `place-peek` / `place-full` there show the same panel.

## Unresolved

1. Air-quality grid-node check: pending the 16:47Z download (above).
2. Pan frames per second 8.5 -> 7.0 in one software-WebGL run: not established either way.
3. Real-laptop fps and real-phone touch feel: not measurable in CI.
4. Desktop click pop-up is the side panel, not an anchored pop-up (ask if wanted).

## For the owner to check

On the live site after merge (laptop):
1. Press Space: it plays; Space again pauses. Left/Right step one frame. The speed chip goes
   1x -> 2x -> 4x and play gets faster.
2. The time under "Now" shows your local time and UTC; "Local · UTC" swaps them.
3. Settings -> Units -> US: hover the map (mph or °F), click a place (panel and chart in °F/mph),
   the scale bar is in mi. Reload: still US.
4. Click the ruler (under + and −), click London then New York: about 5,570 km / 3,461 mi. Esc exits.
5. Pan with wind particles on for 10 seconds. Does it feel smooth? (fps is unverified.)

On a real phone:
6. Tap the map: a short sheet appears; drag its handle up to half and full, and back down.
7. LYR opens the layers sheet over less than half the map.
8. Drag the time scrubber with a thumb: easy to grab? Buttons easy to hit?
9. MSR, tap two places: distance shown; tapping does not open the place sheet.
