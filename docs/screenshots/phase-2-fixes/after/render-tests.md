# Rendering and behaviour tests

Generated 2026-10-30T00:02:40.419Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Westerly (+U only): particles move east | pass | {"dx":0.0242,"dy":0.0004} |
| Southerly (+V only): particles move north (screen up) | pass | {"dx":0.0013,"dy":-0.028} |
| Easterly (-U only): particles move west | pass | {"dx":-0.0192,"dy":-0.0001} |
| Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers) | pass | {"domMarkers":0,"hlFeatures":50,"isobarsInShader":true} |
| Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map) | pass | 10 of 10 pan frames rendered the H/L layer; DOM labels: 0 |
| No page errors (pressure) | pass |  |
| None: field hidden and legend says "No layer" | pass | {"visible":false,"legend":"No layermap only","isobars":false,"hl":0} |
| None + particles off: no data files fetched while stepping 4 hours | pass | 0 requests:  |
| Clicking the active layer again turns it off | pass |  |
| "None" is remembered across reloads | pass |  |
| No page errors (None) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
| pres | 0 | 351 | 8 |
| temp | 0 | 297 | 8 |
