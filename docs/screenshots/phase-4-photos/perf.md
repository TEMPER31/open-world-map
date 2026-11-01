# Performance before / after (same machine, same data)

Generated 2026-11-01T02:21:53.092Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 104 | 1756 | 1.7 | 0.0 | 4 | 588 | 7.5 |
| phase-4-photos | 3 | 116 | 1752 | 1.6 | 0.0 | 4 | 604 | 6.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 7.5 · 2388 · 571 | 9.0 · 1756 · 594 | 7.5 · 1725 · 588 |
| phase-4-photos | 6.5 · 1752 · 593 | 6.0 · 1679 · 604 | 9.0 · 1791 · 621 |
