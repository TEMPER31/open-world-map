# Accuracy check (phase-4-photos)

Generated 2026-11-01T00:41:28.413Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T18:00:00.000Z, timeline +0 h = 2026-11-01T01:00:00.000Z (f007); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 48 / 8 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 44 / 12 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 31 / 25 / 4
- Open-Meteo cams_global at the cities: 6 / 4 / 0
- NWS gridpoints (sanity check): 20 / 4 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.3 | GFS 0.25° raw 17.3 | 0.0 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 8.4 | GFS 0.25° raw 9.3 | -0.9 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 62 | GFS 0.25° raw 61 | 1 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.04 | GFS 0.25° raw 0.03 | 0.01 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.9 | GFS 0.25° raw 1020.9 | 0.0 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.3 | stored grid 17.2 | 0.1 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 8.4 | stored grid 8.2 | 0.2 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.86 | stored grid 1020.88 | -0.02 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.3 | gfs_global 17.8 | -0.5 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 8.4 | gfs_global 7.2 | 1.2 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 62 | gfs_global 53 | 9 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.04 | gfs_global 0.00 | 0.04 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.9 | gfs_global 1021.0 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.3 | gfs_seamless 15.7 | 1.6 | ±1 | **FAIL** |
| Kansas City MO | +0 h | wind km/h | 8.4 | gfs_seamless 11.2 | -2.8 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 62 | gfs_seamless 92 | 30 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.04 | gfs_seamless 0.00 | 0.04 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.9 | gfs_seamless 1021.5 | -0.6 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.0 | cams_global 11.4 | -2.4 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.3 | NWS 17.8 | -0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 8.4 | NWS 9.3 | -0.9 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 91 | 9 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.04 | NWS 0.08 | -0.04 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.9 | GFS 0.25° raw 18.0 | -0.0 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 14.4 | GFS 0.25° raw 14.2 | 0.2 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 139 | GFS 0.25° raw 140 | 0 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.6 | GFS 0.25° raw 1017.6 | 0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 17.9 | stored grid 17.9 | 0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 14.4 | stored grid 14.2 | 0.2 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.64 | stored grid 1017.63 | 0.00 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 17.9 | gfs_global 18.5 | -0.6 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 14.4 | gfs_global 13.3 | 1.1 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 139 | gfs_global 142 | 3 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.6 | gfs_global 1017.8 | -0.2 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.9 | gfs_seamless 16.8 | 1.1 | ±1 | **FAIL** |
| Kansas City MO | +24 h | wind km/h | 14.4 | gfs_seamless 9.3 | 5.1 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 139 | gfs_seamless 119 | 20 | ±20 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.6 | gfs_seamless 1019.6 | -2.0 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.3 | cams_global 6.5 | -1.2 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 17.9 | NWS 18.9 | -1.0 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 14.4 | NWS 7.4 | 7.0 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 100 | NWS 79 | 21 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +113 h | temp °C | 9.8 | GFS 0.25° raw 9.8 | 0.1 | ±0.7 | ok |
| Kansas City MO | +113 h | wind km/h | 14.0 | GFS 0.25° raw 14.7 | -0.8 | ±3 | ok |
| Kansas City MO | +113 h | wind from ° | 339 | GFS 0.25° raw 336 | 3 | ±20 | ok |
| Kansas City MO | +113 h | precip mm/h | 1.18 | GFS 0.25° raw 0.80 | 0.38 | ±0.3 | **FAIL** |
| Kansas City MO | +113 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +113 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.8 | -0.0 | ±0.5 | ok |
| Kansas City MO | +113 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| Kansas City MO | +113 h | wind km/h | 14.0 | stored grid 14.1 | -0.1 | ±1 | ok |
| Kansas City MO | +113 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +113 h | pressure hPa | 1011.75 | stored grid 1011.76 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | GFS 0.25° raw 27.3 | -0.3 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 25.5 | GFS 0.25° raw 28.3 | -2.8 | ±3 | ok |
| Miami | +0 h | wind from ° | 79 | GFS 0.25° raw 81 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | GFS 0.25° raw 0.63 | -0.30 | ±0.3 | ok |
| Miami | +0 h | cloud % | 94 | GFS 0.25° raw 100 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.0 | GFS 0.25° raw 1018.0 | -0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.0 | stored grid 27.0 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 25.5 | stored grid 25.4 | 0.0 | ±1 | ok |
| Miami | +0 h | cloud % | 94 | stored grid 94 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1017.97 | stored grid 1017.99 | -0.03 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_global 27.4 | -0.4 | ±1 | ok |
| Miami | +0 h | wind km/h | 25.5 | gfs_global 29.2 | -3.7 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 79 | gfs_global 81 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_global 1.00 | -0.67 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 94 | gfs_global 100 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.0 | gfs_global 1018.0 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_seamless 25.9 | 1.1 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 25.5 | gfs_seamless 19.2 | 6.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 79 | gfs_seamless 88 | 9 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_seamless 0.00 | 0.33 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 94 | gfs_seamless 100 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.0 | gfs_seamless 1019.1 | -1.1 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 9.3 | cams_global 6.3 | 3.0 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 27.0 | NWS 27.2 | -0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 25.5 | NWS 24.1 | 1.4 | ±8 | ok |
| Miami | +0 h | cloud % | 94 | NWS 69 | 25 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.33 | NWS 0.21 | 0.12 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | GFS 0.25° raw 26.2 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 30.1 | GFS 0.25° raw 32.0 | -1.9 | ±3 | ok |
| Miami | +24 h | wind from ° | 96 | GFS 0.25° raw 97 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.94 | GFS 0.25° raw 2.20 | 0.74 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.7 | GFS 0.25° raw 1016.7 | 0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 25.9 | stored grid 25.9 | 0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 30.1 | stored grid 30.2 | -0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.71 | stored grid 1016.71 | 0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_global 26.3 | -0.4 | ±1 | ok |
| Miami | +24 h | wind km/h | 30.1 | gfs_global 33.0 | -2.9 | ±3 | ok |
| Miami | +24 h | wind from ° | 96 | gfs_global 98 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.94 | gfs_global 2.20 | 0.74 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.7 | gfs_global 1016.6 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_seamless 23.6 | 2.3 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 30.1 | gfs_seamless 14.8 | 15.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 96 | gfs_seamless 40 | 56 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.94 | gfs_seamless 0.00 | 2.94 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 95 | 5 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.7 | gfs_seamless 1019.0 | -2.3 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 7.1 | cams_global 6.0 | 1.1 | ±3 | ok |
| Miami | +24 h | temp °C | 25.9 | NWS 26.1 | -0.2 | ±3 | ok |
| Miami | +24 h | wind km/h | 30.1 | NWS 25.9 | 4.2 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 58 | 42 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.94 | NWS 0.68 | 2.27 | ±1 | **FAIL** |
| Miami | +113 h | temp °C | 28.0 | GFS 0.25° raw 28.9 | -0.9 | ±0.7 | **FAIL** |
| Miami | +113 h | wind km/h | 15.6 | GFS 0.25° raw 14.1 | 1.5 | ±3 | ok |
| Miami | +113 h | wind from ° | 312 | GFS 0.25° raw 310 | 3 | ±20 | ok |
| Miami | +113 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +113 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +113 h | pressure hPa | 1008.2 | GFS 0.25° raw 1008.1 | 0.1 | ±0.5 | ok |
| Miami | +113 h | temp °C | 28.0 | stored grid 27.9 | 0.0 | ±0.15 | ok |
| Miami | +113 h | wind km/h | 15.6 | stored grid 15.5 | 0.1 | ±1 | ok |
| Miami | +113 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Miami | +113 h | pressure hPa | 1008.22 | stored grid 1008.24 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.1 | GFS 0.25° raw 14.2 | -4.1 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | GFS 0.25° raw 3.1 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 43 | GFS 0.25° raw 49 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 91 | GFS 0.25° raw 100 | -9 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1014.8 | GFS 0.25° raw 1014.2 | 0.6 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 10.1 | stored grid 10.1 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 3.2 | stored grid 3.5 | -0.3 | ±1 | ok |
| Denver | +0 h | cloud % | 91 | stored grid 92 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1014.83 | stored grid 1014.81 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.1 | gfs_global 14.8 | -4.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | gfs_global 4.1 | -0.9 | ±3 | ok |
| Denver | +0 h | wind from ° | 43 | gfs_global 45 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 91 | gfs_global 100 | -9 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1014.8 | gfs_global 1013.4 | 1.4 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 10.1 | gfs_seamless 13.2 | -3.1 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | gfs_seamless 5.6 | -2.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 43 | gfs_seamless 70 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 91 | gfs_seamless 100 | -9 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1014.8 | gfs_seamless 1013.0 | 1.8 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 0.8 | cams_global 18.5 | -17.7 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 10.1 | NWS 13.9 | -3.7 | ±3 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | NWS 3.7 | -0.5 | ±8 | ok |
| Denver | +0 h | cloud % | 91 | NWS 54 | 37 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 13.6 | GFS 0.25° raw 15.0 | -1.4 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 9.1 | GFS 0.25° raw 7.1 | 2.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 360 | GFS 0.25° raw 360 | 0 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.01 | GFS 0.25° raw 0.00 | 0.01 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.7 | GFS 0.25° raw 998.6 | 1.2 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 13.6 | stored grid 13.6 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 9.1 | stored grid 9.0 | 0.1 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 999.73 | stored grid 999.76 | -0.03 | ±0.1 | ok |
| Denver | +24 h | temp °C | 13.6 | gfs_global 14.9 | -1.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.1 | gfs_global 11.9 | -2.8 | ±3 | ok |
| Denver | +24 h | wind from ° | 360 | gfs_global 360 | 0 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.01 | gfs_global 0.00 | 0.01 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.7 | gfs_global 997.2 | 2.5 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 13.6 | gfs_seamless 12.0 | 1.6 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.1 | gfs_seamless 6.2 | 2.9 | ±3 | ok |
| Denver | +24 h | wind from ° | 360 | gfs_seamless 335 | 25 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.01 | gfs_seamless 0.00 | 0.01 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.7 | gfs_seamless 1001.9 | -2.2 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.1 | cams_global 4.0 | -2.9 | ±3 | ok |
| Denver | +24 h | temp °C | 13.6 | NWS 13.3 | 0.3 | ±3 | ok |
| Denver | +24 h | wind km/h | 9.1 | NWS 5.6 | 3.5 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 88 | 12 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.01 | NWS 0.00 | 0.01 | ±1 | ok |
| Denver | +113 h | temp °C | 10.6 | GFS 0.25° raw 11.2 | -0.6 | ±0.7 | ok |
| Denver | +113 h | wind km/h | 2.8 | GFS 0.25° raw 2.7 | 0.1 | ±3 | ok |
| Denver | +113 h | wind from ° | 116 | GFS 0.25° raw 113 | — | ±20 | calm |
| Denver | +113 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +113 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Denver | +113 h | pressure hPa | 1015.5 | GFS 0.25° raw 1015.7 | -0.2 | ±0.5 | ok |
| Denver | +113 h | temp °C | 10.6 | stored grid 10.5 | 0.1 | ±0.15 | ok |
| Denver | +113 h | wind km/h | 2.8 | stored grid 2.9 | -0.1 | ±1 | ok |
| Denver | +113 h | cloud % | 1 | stored grid 0 | 0 | ±1 | ok |
| Denver | +113 h | pressure hPa | 1015.50 | stored grid 1015.51 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.6 | GFS 0.25° raw 9.8 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 4.4 | GFS 0.25° raw 3.4 | 1.0 | ±3 | ok |
| London | +0 h | wind from ° | 33 | GFS 0.25° raw 45 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 40 | GFS 0.25° raw 57 | -17 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.3 | GFS 0.25° raw 1032.3 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.6 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 4.4 | stored grid 4.3 | 0.1 | ±1 | ok |
| London | +0 h | cloud % | 40 | stored grid 40 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.33 | stored grid 1032.30 | 0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 9.6 | gfs_global 9.9 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 4.4 | gfs_global 3.3 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 33 | gfs_global 49 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 40 | gfs_global 14 | 26 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.3 | gfs_global 1032.3 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.6 | gfs_seamless 9.9 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 4.4 | gfs_seamless 3.3 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 33 | gfs_seamless 49 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 40 | gfs_seamless 14 | 26 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.3 | gfs_seamless 1032.3 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 30.3 | cams_global 28.2 | 2.1 | ±3 | ok |
| London | +24 h | temp °C | 10.8 | GFS 0.25° raw 10.8 | -0.0 | ±0.7 | ok |
| London | +24 h | wind km/h | 17.9 | GFS 0.25° raw 15.4 | 2.5 | ±3 | ok |
| London | +24 h | wind from ° | 15 | GFS 0.25° raw 20 | 4 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | GFS 0.25° raw 74 | 1 | ±15 | ok |
| London | +24 h | pressure hPa | 1034.9 | GFS 0.25° raw 1035.0 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.8 | stored grid 10.7 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 17.9 | stored grid 17.8 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 75 | stored grid 75 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1034.92 | stored grid 1034.96 | -0.04 | ±0.1 | ok |
| London | +24 h | temp °C | 10.8 | gfs_global 10.9 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 17.9 | gfs_global 14.8 | 3.1 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 15 | gfs_global 18 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_global 100 | -25 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.9 | gfs_global 1035.0 | -0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.8 | gfs_seamless 10.9 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 17.9 | gfs_seamless 14.8 | 3.1 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 15 | gfs_seamless 18 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_seamless 100 | -25 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.9 | gfs_seamless 1035.0 | -0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 6.9 | cams_global 5.5 | 1.4 | ±3 | ok |
| London | +113 h | temp °C | 9.5 | GFS 0.25° raw 9.6 | -0.1 | ±0.7 | ok |
| London | +113 h | wind km/h | 15.2 | GFS 0.25° raw 12.9 | 2.3 | ±3 | ok |
| London | +113 h | wind from ° | 52 | GFS 0.25° raw 52 | 0 | ±20 | ok |
| London | +113 h | precip mm/h | 0.09 | GFS 0.25° raw 0.12 | -0.03 | ±0.3 | ok |
| London | +113 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| London | +113 h | pressure hPa | 1027.6 | GFS 0.25° raw 1027.6 | 0.0 | ±0.5 | ok |
| London | +113 h | temp °C | 9.5 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +113 h | wind km/h | 15.2 | stored grid 15.2 | -0.0 | ±1 | ok |
| London | +113 h | cloud % | 97 | stored grid 97 | -0 | ±1 | ok |
| London | +113 h | pressure hPa | 1027.64 | stored grid 1027.61 | 0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.7 | GFS 0.25° raw 23.0 | -1.3 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | GFS 0.25° raw 6.1 | 0.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 304 | GFS 0.25° raw 311 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | GFS 0.25° raw 1016.3 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.7 | stored grid 21.7 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 6.2 | stored grid 6.0 | 0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1016.31 | stored grid 1016.33 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.7 | gfs_global 23.9 | -2.2 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | gfs_global 5.9 | 0.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 304 | gfs_global 317 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | gfs_global 1016.3 | 0.0 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.7 | gfs_seamless 23.9 | -2.2 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | gfs_seamless 5.9 | 0.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 304 | gfs_seamless 317 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | gfs_seamless 1016.3 | 0.0 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 63.9 | cams_global 58.3 | 5.6 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.3 | GFS 0.25° raw 23.7 | -1.4 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.6 | GFS 0.25° raw 1.5 | 1.1 | ±3 | ok |
| Delhi | +24 h | wind from ° | 190 | GFS 0.25° raw 169 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.5 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.3 | stored grid 22.3 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 2.6 | stored grid 2.9 | -0.3 | ±1 | ok |
| Delhi | +24 h | cloud % | 1 | stored grid 1 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.63 | stored grid 1015.62 | 0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.3 | gfs_global 24.8 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.6 | gfs_global 0.7 | 1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 190 | gfs_global 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_global 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_global 1015.5 | 0.1 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.3 | gfs_seamless 24.8 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.6 | gfs_seamless 0.7 | 1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 190 | gfs_seamless 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_seamless 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_seamless 1015.5 | 0.1 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 62.0 | cams_global 104.3 | -42.3 | ±3 | **FAIL** |
| Delhi | +113 h | temp °C | 25.7 | GFS 0.25° raw 27.3 | -1.6 | ±0.7 | **FAIL** |
| Delhi | +113 h | wind km/h | 7.0 | GFS 0.25° raw 7.0 | 0.0 | ±3 | ok |
| Delhi | +113 h | wind from ° | 301 | GFS 0.25° raw 312 | — | ±20 | calm |
| Delhi | +113 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +113 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +113 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +113 h | temp °C | 25.7 | stored grid 25.7 | 0.0 | ±0.15 | ok |
| Delhi | +113 h | wind km/h | 7.0 | stored grid 6.8 | 0.2 | ±1 | ok |
| Delhi | +113 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +113 h | pressure hPa | 1014.14 | stored grid 1014.13 | 0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.22 | 17.25 | -0.04 | 8.2 | 9.3 | -1.1 | 100 | 100 |
| Kansas City MO | +24 h | 17.91 | 17.96 | -0.05 | 14.2 | 14.2 | -0.0 | 100 | 100 |
| Kansas City MO | +113 h (f120) | 9.84 | 9.75 | 0.09 | 14.1 | 14.7 | -0.6 | 100 | 100 |
| Miami | +0 h | 27.01 | 27.34 | -0.34 | 25.4 | 28.3 | -2.8 | 94 | 100 |
| Miami | +24 h | 25.92 | 26.23 | -0.31 | 30.2 | 32.0 | -1.8 | 100 | 100 |
| Miami | +113 h (f120) | 27.93 | 28.90 | -0.97 | 15.5 | 14.1 | 1.4 | 0 | 0 |
| Denver | +0 h | 10.12 | 14.21 | -4.10 | 3.5 | 3.1 | 0.4 | 92 | 100 |
| Denver | +24 h | 13.63 | 15.02 | -1.38 | 9.0 | 7.1 | 1.9 | 100 | 100 |
| Denver | +113 h (f120) | 10.52 | 11.17 | -0.65 | 2.9 | 2.7 | 0.3 | 0 | 0 |
| London | +0 h | 9.63 | 9.77 | -0.14 | 4.3 | 3.4 | 0.9 | 40 | 57 |
| London | +24 h | 10.70 | 10.77 | -0.07 | 17.8 | 15.4 | 2.4 | 75 | 74 |
| London | +113 h (f120) | 9.56 | 9.60 | -0.04 | 15.2 | 12.9 | 2.4 | 97 | 99 |
| Delhi | +0 h | 21.67 | 22.96 | -1.29 | 6.0 | 6.1 | -0.1 | 0 | 0 |
| Delhi | +24 h | 22.33 | 23.67 | -1.34 | 2.9 | 1.5 | 1.4 | 1 | 0 |
| Delhi | +113 h (f120) | 25.72 | 27.34 | -1.62 | 6.8 | 7.0 | -0.2 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 18.00 | 18.04 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1020.10 | 1020.10 | -0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 97.00 | 97.14 | -0.14 | ±1 | ok |
| Chile coast | +0 h | temp | 12.60 | 12.55 | 0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1017.30 | 1017.32 | -0.02 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 55.00 | 54.56 | 0.44 | ±1 | ok |
| Kansas City | +0 h | temp | 17.20 | 17.10 | 0.10 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.70 | 1020.72 | -0.02 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 19.00 | 18.95 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1013.30 | 1013.27 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 80.00 | 80.18 | -0.18 | ±1 | ok |
| Chile coast | +24 h | temp | 11.80 | 11.85 | -0.05 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1015.50 | 1015.51 | -0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Kansas City | +24 h | temp | 18.00 | 18.05 | -0.05 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1017.20 | 1017.19 | 0.01 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +113 h | temp | 16.00 | 15.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +113 h | pres | 1005.20 | 1005.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +113 h | cloud | 1.00 | 0.77 | 0.23 | ±1 | ok |
| Chile coast | +113 h | temp | 18.40 | 18.44 | -0.04 | ±0.5 | ok |
| Chile coast | +113 h | pres | 1015.40 | 1015.38 | 0.02 | ±0.5 | ok |
| Chile coast | +113 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +113 h | temp | 9.80 | 9.74 | 0.06 | ±0.5 | ok |
| Kansas City | +113 h | pres | 1012.40 | 1012.40 | 0.00 | ±0.5 | ok |
| Kansas City | +113 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (7.4 h before this check), valid hour 2026-11-01T01:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 61.50 | 61.50 | 0.00 | ±0.2 | ok | 62.20 | -0.70 |
| node 52N 0E (London) | +0 h | 31.80 | 31.80 | -0.00 | ±0.2 | ok | 26.00 | 5.80 |
| node 40N 116E (Beijing) | +0 h | 32.00 | 32.00 | 0.00 | ±0.2 | ok | 41.10 | -9.10 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":166,"2024 24-h mean":12,"2012 hourly":176,"2012 24-h mean":34}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.4 | 12.9 | 58 | 55 | 58 | 48 | 52 |
| Miami | 6.3 | 5.9 | 35 | 35 | 32 | 26 | 24 |
| Denver | 18.5 | 17.6 | 66 | 69 | 67 | 64 | 62 |
| London | 28.2 | 14.5 | 59 | 87 | 61 | 85 | 56 |
| Delhi | 58.3 | 66.1 | 157 | 153 | 158 | 152 | 156 |
| node 28N 76E (Delhi) | 62.2 | 36.0 | 100 | 156 | 102 | 154 | 102 |
| node 52N 0E (London) | 26.0 | 11.7 | 54 | 82 | 56 | 80 | 48 |
| node 40N 116E (Beijing) | 41.1 | 68.2 | 159 | 115 | 160 | 115 | 158 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 17 °Cat 2 m39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC | 8 km/hfrom ENE39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC | Drypast hour · area avg39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC | 100 %area average39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC | 1021 hPasea level39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC | 9.0 µg/m³Good · AQI 49 (24 h)39.1°N 94.5°W · Sun 01:00 local · 01:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC | 25 km/hfrom ENE25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC | 0.3 mm/hpast hour · area avg25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC | 94 %area average25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC | 1018 hPasea level25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC | 9.3 µg/m³Moderate · AQI 43 (24 h)25.7°N 80.1°W · Sun 01:00 local · 01:00 UTC |
| Denver | 10 °Cat 2 m39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC | 3 km/hfrom NE39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC | 91 %area average39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC | 1015 hPasea level39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC | 0.8 µg/m³Good · AQI 37 (24 h)39.7°N 104.9°W · Sun 01:00 local · 01:00 UTC |
| London | 10 °Cat 2 m51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC | 4 km/hfrom NNE51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC | 40 %area average51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC | 30 µg/m³Moderate · AQI 59 (24 h)51.5°N 0.1°W · Sun 01:00 local · 01:00 UTC |
| Delhi | 22 °Cat 2 m28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC | 6 km/hfrom NW28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC | 0 %area average28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC | 64 µg/m³Unhealthy · AQI 103 (24 h)28.6°N 77.2°E · Sun 01:00 local · 01:00 UTC |
