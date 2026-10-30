# Rendering and behaviour tests

Generated 2026-10-30T22:38:17.762Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Westerly (+U only): particles move east | pass | {"dx":0.0228,"dy":-0.001} |
| Southerly (+V only): particles move north (screen up) | pass | {"dx":0.0001,"dy":-0.0269} |
| Easterly (-U only): particles move west | pass | {"dx":-0.0167,"dy":-0.0008} |
| Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers) | pass | {"domMarkers":0,"hlFeatures":65,"isobarsInShader":true} |
| Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map) | pass | 8 of 8 pan frames rendered the H/L layer; DOM labels: 0 |
| No page errors (pressure) | pass |  |
| None: field hidden and legend says "No layer" | pass | {"visible":false,"legend":"No layermap only","isobars":false,"hl":0} |
| None + particles off: no data files fetched while stepping 4 hours | pass | 0 requests:  |
| Clicking the active layer again turns it off | pass |  |
| "None" is remembered across reloads | pass |  |
| No page errors (None) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
| pres | 0 | 436 | 5.5 |
| temp | 0 | 567 | 8 |
