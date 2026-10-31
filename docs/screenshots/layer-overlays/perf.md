# Performance before / after (same machine, same data)

Generated 2026-10-31T22:04:54.721Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Step -> every layer drawn (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|---|
| main | 3 | 80 | 1429 | 1.3 | 0.0 | 3 | 12 | 456 | 10.0 |
| layer-overlays | 3 | 72 | 1540 | 1.4 | 0.0 | 4 | 13 | 426 | 10.0 |
| layer-overlays + isobars + rain | 3 | 72 | 1512 | 1.3 | 0.0 | 7 | 14 | 543 | 4.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 9.5 · 1891 · 441 | 10.0 · 1408 · 472 | 10.5 · 1429 · 456 |
| layer-overlays | 12.0 · 1613 · 327 | 10.0 · 1448 · 447 | 8.5 · 1540 · 426 |
| layer-overlays + isobars + rain | 4.5 · 1583 · 536 | 4.5 · 1512 · 597 | 5.0 · 1487 · 543 |
