# Performance before / after (same machine, same data)

Generated 2026-11-01T00:48:09.254Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Step -> every layer drawn (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|---|
| main | 3 | 96 | 1728 | 1.6 | 0.0 | 4 | 13 | 583 | 7.5 |
| layer-overlays | 3 | 96 | 1695 | 1.7 | 0.0 | 4 | 12 | 582 | 7.0 |
| layer-overlays + isobars + rain | 3 | 96 | 1751 | 1.6 | 0.0 | 6 | 15 | 788 | 2.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 7.5 · 2635 · 583 | 9.0 · 1671 · 615 | 7.0 · 1728 · 562 |
| layer-overlays | 9.5 · 1695 · 582 | 7.0 · 1709 · 574 | 7.0 · 1625 · 673 |
| layer-overlays + isobars + rain | 2.5 · 1751 · 806 | 3.0 · 2018 · 713 | 2.0 · 1748 · 788 |
