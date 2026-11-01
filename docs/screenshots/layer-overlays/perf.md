# Performance before / after (same machine, same data)

Generated 2026-11-01T00:11:23.597Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads per site, run alternately (site A, site B, A, B, ...); per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Step -> every layer drawn (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|---|
| main | 3 | 96 | 1650 | 1.6 | 0.0 | 4 | 13 | 550 | 7.0 |
| layer-overlays | 3 | 96 | 1644 | 1.7 | 0.0 | 5 | 12 | 568 | 7.5 |
| layer-overlays + isobars + rain | 3 | 104 | 1819 | 1.7 | 0.0 | 7 | 22 | 1006 | 2.5 |

Every run (in the order they ran), frames/s during the pan · first field drawn (ms) · worst frame gap (ms):

| Site | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| main | 7.0 · 2375 · 459 | 6.5 · 1627 · 602 | 8.0 · 1650 · 550 |
| layer-overlays | 7.5 · 1644 · 522 | 7.0 · 1643 · 568 | 8.0 · 1648 · 582 |
| layer-overlays + isobars + rain | 2.5 · 1752 · 684 | 2.0 · 1819 · 1115 | 2.5 · 1887 · 1006 |
