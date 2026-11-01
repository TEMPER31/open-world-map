# Performance before / after (same machine, same data)

Generated 2026-11-01T03:20:33.989Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 88 | 1644 | 1.5 | 0.0 | 4 | 548 | 7.5 |
| phase-4-photos | 3 | 80 | 1687 | 1.5 | 0.0 | 3 | 549 | 8.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 7.5 · 2579 · 555 | 8.0 · 1644 · 548 | 7.5 · 1631 · 408 |
| phase-4-photos | 9.0 · 1698 · 554 | 8.5 · 1687 · 549 | 8.0 · 1635 · 538 |
