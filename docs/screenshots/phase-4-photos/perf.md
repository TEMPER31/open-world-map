# Performance before / after (same machine, same data)

Generated 2026-11-01T02:49:19.658Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 112 | 1401 | 1.3 | 0.0 | 3 | 299 | 10.5 |
| phase-4-photos | 3 | 80 | 1344 | 1.3 | 0.0 | 3 | 325 | 11.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 10.5 · 1809 · 248 | 12.0 · 1401 · 299 | 10.0 · 1330 · 341 |
| phase-4-photos | 11.0 · 1344 · 336 | 11.5 · 1343 · 245 | 11.5 · 1418 · 325 |
