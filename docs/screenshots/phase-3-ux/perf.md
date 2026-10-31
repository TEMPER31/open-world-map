# Performance before / after (same machine, same data)

Generated 2026-10-31T08:04:07.528Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads; per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 88 | 1824 | 1.1 | 0.0 | 3 | 583 | 8.5 |
| phase-3-ux | 3 | 100 | 1685 | 1.8 | 0.0 | 4 | 588 | 7.0 |
