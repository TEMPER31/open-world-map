# Rendering and behaviour tests

Generated 2026-10-31T00:06:45.674Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Westerly (+U only): particles move east | pass | {"dx":0.0241,"dy":-0.0004} |
| Southerly (+V only): particles move north (screen up) | pass | {"dx":0.0002,"dy":-0.0297} |
| Easterly (-U only): particles move west | pass | {"dx":-0.0196,"dy":0.0003} |
| Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers) | pass | {"domMarkers":0,"hlFeatures":60,"isobarsInShader":true} |
| Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map) | pass | 7 of 7 pan frames rendered the H/L layer; DOM labels: 0 |
| No page errors (pressure) | pass |  |
| None: field hidden and legend says "No layer" | pass | {"visible":false,"legend":"No layermap only","isobars":false,"hl":0} |
| None + particles off: no data files fetched while stepping 4 hours | pass | 0 requests:  |
| Clicking the active layer again turns it off | pass |  |
| "None" is remembered across reloads | pass |  |
| No page errors (None) | pass |  |
| 7-day: frames run to f168, hourly to f120 then every 3 h | pass | first f6, last f168, 131 frames on the timeline (115 hourly + 16 three-hourly) |
| Step button and arrow keys move to the next available frame (f120 -> f123 -> f126 -> back to f120) | pass | {"button":117,"right":120,"left":114,"chip":"3 h step","t120":114} |
| Scrubbing in the 3-hourly part snaps to a frame | pass | t=147 (f153) |
| Play moves frame to frame across f120 (same speed per frame) | pass | 112, 113, 114, 117, 120, 123 |
| Rain legend says "past 3 h" after f120 and "past hour" before | pass | Precipitation · mm/hpast 3 h · GFS 0.5° / Precipitation · mm/hpast hour · GFS 0.5° |
| Air quality past its forecast end: legend dimmed with "Air quality forecast ends {date}", no stale data | pass | Air quality forecast ends Mon 2 Nov · 00:00 UTC (AQ files requested at that hour: 0) |
| Place-panel chart covers the whole run with day boundaries | pass | {"days":6,"end":"+6 d 18 h","points":35} |
| No page errors (7-day timeline) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
| pres | 0 | 409 | 6 |
| temp | 0 | 529 | 8 |
