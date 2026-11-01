# Performance before / after (same machine, same data)

Generated 2026-11-01T00:42:54.208Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 136 | 1491 | 1.2 | 0.0 | 3 | 341 | 9.0 |
| phase-4-photos | 3 | 100 | 1479 | 1.3 | 0.0 | 3 | 324 | 9.0 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 10.0 · 2186 · 441 | 9.0 · 1491 · 341 | 8.5 · 1410 · 319 |
| phase-4-photos | 9.0 · 1415 · 479 | 9.0 · 1479 · 321 | 10.5 · 1512 · 324 |
