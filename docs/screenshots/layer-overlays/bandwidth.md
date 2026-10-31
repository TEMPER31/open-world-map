# Bandwidth per frame and per 7-day play

Generated 2026-10-31T22:54:02.280Z by `scripts/data/bandwidth.mjs` from the files this PR build produced (GFS run 2026-10-31T12:00:00Z, 137 frames).
Sizes are the PNG files as stored (PNG is already compressed). The browser caches each file, so replaying the same run costs nothing more.

| Layer file | Mean per frame (KB) | Largest frame (KB) | All 137 frames (MB) |
|---|---|---|---|
| temp | 142.5 | 144.7 | 19.07 |
| wind | 144.8 | 153.8 | 19.38 |
| rain | 102.5 | 113.7 | 13.72 |
| cloud | 130.8 | 134.8 | 17.50 |
| pres | 142.3 | 147.7 | 19.04 |
| air quality (115 hourly files, not per frame) | 14.3 | | 1.61 |

| What is on screen | Per frame (KB) | Full 7-day play (MB) |
|---|---|---|
| Temperature + particles, 0 overlays | 287.4 | 38.45 |
| + 1 overlay (isobars) | 429.7 | 57.49 |
| + 1 overlay (rain) | 389.9 | 52.17 |
| + 1 overlay (clouds) | 418.2 | 55.95 |
| + 2 overlays (isobars + rain) | 532.2 | 71.21 |
| + 2 overlays (largest pair: pres + cloud) | 560.5 | 75.00 |
| Wind main field + clouds overlay (wind file serves both) | 275.7 | 36.88 |
