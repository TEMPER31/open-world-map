# Performance before / after (same machine, same data)

Generated 2026-10-31T20:20:44.901Z by `scripts/data/perf.mjs`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads; per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
| main | 3 | 100 | 1831 | 1.6 | 0.0 | 4 | 586 | 9.0 |
| phase-5-events | 3 | 88 | 2088 | 1.7 | 0.0 | 5 | 607 | 6.5 |
