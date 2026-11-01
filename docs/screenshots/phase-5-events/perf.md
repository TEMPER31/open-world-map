# Performance before / after (same machine, same data)

Generated 2026-10-31T21:41:31.212Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 72 | 1698 | 1.0 | 0.0 | 3 | 265 | 12.5 |
| phase-5-events | 3 | 68 | 1580 | 1.0 | 0.0 | 2 | 217 | 12.0 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 12.5 · 1562 · 265 | 12.5 · 1749 · 212 | 14.5 · 1698 · 280 |
| phase-5-events | 12.0 · 1641 · 225 | 12.0 · 1580 · 208 | 12.5 · 1439 · 217 |
