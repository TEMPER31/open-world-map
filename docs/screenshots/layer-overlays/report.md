# Overlays (main field + up to 2 overlays): report

CI run: https://github.com/TEMPER31/open-world-map/actions/runs/41256459502. Reports are committed in this folder;
screenshots are in the run's `ci-screenshots` artifact (30 days). GFS run 31 Oct 18Z.

**Summary.** One main colored field plus up to 2 overlays: clouds (translucent veil), rain (only where it rains),
isobars + H/L (lines only). Wind particles keep their own switch. **88 of 90 render checks pass; all 10 overlay checks
pass.** The 2 failures are the live Mapillary photo checks, which this branch inherits from PR 2 and which wait on the
owner's Mapillary app check. Each overlay downloads one more file per frame: +102 to +142 KB per frame, +14 to +19 MB
for a full 7-day play. Pan speed with no overlays matches main (7.0 vs 7.5 frames/s). With 2 overlays it drops to 2.5
frames/s in CI's software graphics. Added JS is **6.2 KB** (guide ~10 KB). Weather files and Open-Meteo calls are
unchanged.

## How it works

- Each overlay is its own GPU field layer. It reuses the main field's shader and the same data files, so an overlay
  that is already the main field never downloads twice; the wind main field with the clouds overlay shares the wind
  file with the particles.
- Draw order: main field, then clouds, rain, isobars, then wind particles, then roads and labels. H/L labels are
  shared: shown when pressure is the main field or the isobars overlay is on.
- Rules: max 2 (a third choice is disabled, with "Up to 2 overlays: turn one off first"). An overlay can't be the main
  field: its row says "main field", and choosing it as the main field drops it from the overlays. Choices are saved
  across reloads.
- The layers rail and phone sheet have an "Overlays" section with checkboxes and compact legends. The floating legend
  lists "+ Isobars + H/L · Rain"; the phone chip shows "+2".
- The probe shows the main value plus one line per overlay. The place panel marks overlay values "· overlay".
- One clock: each overlay stamps `ov-<k>`. Prefetch covers the next 2 frames of active overlays only; overlays that
  are off fetch nothing.

## Done when

| Item | Result | How verified (numbers) | Unresolved |
|---|---|---|---|
| Overlays on/off | Pass | Render checks: toggles, saved across reloads | — |
| Max 2 | Pass | Third choice disabled, `aria-disabled`, note + toast | — |
| Same-as-main blocked | Pass | Row says "main field"; switching the main field to an overlay drops it | — |
| Off = 0 requests | Pass | 0 overlay files while none is on and stepping; 0 after turning them off | — |
| One clock includes overlays | Pass | 4/4 steps in sync, slowest 110 ms; layers: timeline, field, ov-rain, ov-pres, hl, probe | — |
| Prefetch 2 frames per active layer only | Pass | 4/4 next-frame files for 2 overlays; nothing for overlays that are off | — |
| Probe + place panel show every overlay | Pass | Probe "12 °C · Pressure 1028 hPa · Rain Dry"; panel "Pressure · overlay", "Precipitation · overlay" | — |
| Phone | Pass | Overlay rows 44 px; overlays draw over "None"; chip "No layer +2" | — |
| No page errors | Pass | Overlay sections 0; screenshots: 0 errors except the 2 PR 2 photo views (Mapillary HTTP 400) | Mapillary: PR 2 |
| Screenshots desktop + phone | Done | `ov-desktop-temp-isobars-rain`, `ov-desktop-wind-clouds`, `ov-desktop-layers`, `ov-phone-temp-isobars-rain`, `ov-phone-wind-clouds`, `ov-phone-layers` | — |
| Phase 3/4/5 tests and accuracy | Phase 3 and 5 pass; Phase 4 passes except the 2 live Mapillary checks | 88/90. Accuracy: encoding-only 40/0, grid alignment 27/0 (unchanged) | Live photos: PR 2 |
| Sizes and calls unchanged | Pass | No data-job changes; weather file sizes as before (temp 142.6, wind 146.8, pres 142.4 KB per frame; largest 153.2 KB) | — |
| Added JS ≤ ~10 KB | **6.2 KB** | `overlays.js` 4.4 KB + main/state/field-gl net | — |
| CI green | Workflow green; render tests run with continue-on-error, so the 2 live-photo failures show in the report | — | Live photos: PR 2 |

## Bandwidth (this run's files, GFS 31 Oct 18Z, 137 frames)

| What is on screen | Per frame (KB) | Full 7-day play (MB) |
|---|---|---|
| Temperature + particles, **0 overlays** | 289.4 | 38.72 |
| + **1 overlay**: isobars | 431.8 | 57.77 |
| + 1 overlay: rain | 391.4 | 52.37 |
| + 1 overlay: clouds | 420.4 | 56.24 |
| + **2 overlays**: isobars + rain | 533.8 | 71.42 |
| + 2 overlays: largest pair (isobars + clouds) | 562.8 | 75.29 |
| Wind main field + clouds overlay (wind file serves field and particles) | 277.8 | 37.17 |

Per file per frame: temperature 142.6, wind 146.8, rain 102.0, clouds 131.0, pressure 142.4 KB (largest 153.2 KB, wind).
The browser caches each file, so replaying the same run downloads nothing again. A 2-overlay 7-day play is about 75 MB
for one visitor, which is worth keeping in mind against Pages' soft 100 GB/month.

## Frame time and pan fps (CI, software graphics, same runner, alternating, 3 runs each)

| Site | Run 1 | Run 2 | Run 3 | Median pan fps | Step → every layer drawn |
|---|---|---|---|---|---|
| main | 7.5 | 9.0 | 7.0 | 7.5 | 13 ms |
| layer-overlays, 0 overlays | 9.5 | 7.0 | 7.0 | 7.0 | 12 ms |
| layer-overlays, isobars + rain | 2.5 | 3.0 | 2.0 | 2.5 | 15 ms |

Each step (one timeline frame) stays fast: 12–15 ms from the step to every layer drawn. Panning with 2 overlays is much
slower in CI because every overlay is another full-screen GPU pass, and CI emulates the GPU on the CPU (the isobar pass
samples the field 3 times per pixel). The earlier run measured 10 → 4.5 frames/s. **Needs a check on real hardware.** If
it is too slow there, the next step is drawing all overlays in one pass. With no overlays, the three overlay layers
return at once and cost nothing measurable (7.0 vs 7.5 frames/s, within main's own 7.0–9.0 spread).

## CI speed (owner request)

Verify had grown to 80+ minutes. The satellite probe alone took 47 minutes (Phase 2 diagnostics, unrelated to these
PRs). Now the satellite probe runs only when the satellite code changes, and the render tests run in 4 parallel parts
next to the screenshots/accuracy/perf job. A browser install that once hung for 30+ minutes now has a 3-minute limit
with 3 tries, and a cancelled run no longer commits partial reports. This run: **30 minutes** push to reports (data 10,
verify about 18). PR 2's run took 28.5 minutes.

## Unresolved

- Pan speed with 2 overlays on real hardware (owner check).
- Live Mapillary photo checks: PR 2, waiting on the Mapillary app's Read access / token type.

## Live checks for the owner (after merge and deploy)

1. Temperature + Isobars + Rain: lines and rain over the colors; legend "+ Isobars + H/L · Rain"; hover shows all three values.
2. Wind + Clouds: veil over the wind colors, particles on top.
3. Try a third overlay: it is disabled with the note. Pick Rain as the main field while the Rain overlay is on: the overlay turns off.
4. Play the 7 days with 2 overlays; check that panning stays smooth on your laptop and phone.
5. Reload: the overlays are remembered.
