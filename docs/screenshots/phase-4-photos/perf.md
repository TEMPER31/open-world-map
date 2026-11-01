# Performance before / after (same machine, same data)

Generated 2026-11-01T01:50:59.508Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 140 | 1498 | 1.2 | 0.0 | 3 | 447 | 10.0 |
| phase-4-photos | 3 | 108 | 1521 | 1.3 | 0.0 | 3 | 448 | 10.0 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 10.0 · 2098 · 448 | 9.5 · 1471 · 324 | 11.0 · 1498 · 447 |
| phase-4-photos | 10.0 · 1494 · 448 | 9.5 · 1521 · 441 | 10.5 · 1636 · 448 |
