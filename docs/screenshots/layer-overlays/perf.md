# Performance before / after (same machine, same data)

Generated 2026-10-31T22:53:57.225Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Step -> every layer drawn (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|---|
| main | 3 | 72 | 1453 | 1.3 | 0.0 | 3 | 13 | 456 | 9.5 |
| layer-overlays | 3 | 76 | 1425 | 1.5 | 0.0 | 4 | 12 | 454 | 10.0 |
| layer-overlays + isobars + rain | 3 | 104 | 1631 | 1.3 | 0.0 | 7 | 17 | 775 | 5.0 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 9.0 · 1973 · 456 | 10.0 · 1420 · 458 | 9.5 · 1453 · 339 |
| layer-overlays | 10.0 · 1531 · 464 | 10.0 · 1412 · 454 | 11.0 · 1425 · 446 |
| layer-overlays + isobars + rain | 4.0 · 1631 · 848 | 5.0 · 1534 · 775 | 5.0 · 1683 · 773 |
