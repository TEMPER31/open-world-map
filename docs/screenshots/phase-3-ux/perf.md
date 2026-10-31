# Performance before / after (same machine, same data)

Generated 2026-10-31T18:34:45.658Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads; per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 92 | 1422 | 0.8 | 0.0 | 2 | 420 | 9.5 |
| phase-3-ux | 3 | 108 | 1481 | 1.3 | 0.0 | 3 | 448 | 10.0 |
