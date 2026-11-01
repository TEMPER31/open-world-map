# Bandwidth per frame and per 7-day play

Generated 2026-11-01T00:48:14.313Z by `scripts/data/bandwidth.mjs` from the files this PR build produced (GFS run 2026-10-31T18:00:00Z, 137 frames).
Sizes are the PNG files as stored (PNG is already compressed). The browser caches each file, so replaying the same run costs nothing more.

| Layer file | Mean per frame (KB) | Largest frame (KB) | All 137 frames (MB) |
|---|---|---|---|
| temp | 142.6 | 144.8 | 19.07 |
| wind | 146.8 | 153.2 | 19.65 |
| rain | 102.0 | 112.2 | 13.65 |
| cloud | 131.0 | 134.9 | 17.52 |
| pres | 142.4 | 146.8 | 19.05 |
| air quality (115 hourly files, not per frame) | 14.3 | | 1.61 |

| What is on screen | Per frame (KB) | Full 7-day play (MB) |
|---|---|---|
| Temperature + particles, 0 overlays | 289.4 | 38.72 |
| + 1 overlay (isobars) | 431.8 | 57.77 |
| + 1 overlay (rain) | 391.4 | 52.37 |
| + 1 overlay (clouds) | 420.4 | 56.24 |
| + 2 overlays (isobars + rain) | 533.8 | 71.42 |
| + 2 overlays (largest pair: pres + cloud) | 562.8 | 75.29 |
| Wind main field + clouds overlay (wind file serves both) | 277.8 | 37.17 |
