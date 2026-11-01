# Accuracy check (phase-4-photos)

Generated 2026-11-01T02:20:21.608Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T18:00:00.000Z, timeline +0 h = 2026-11-01T02:00:00.000Z (f008); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 46 / 10 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 43 / 13 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 35 / 21 / 4
- Open-Meteo cams_global at the cities: 3 / 7 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 16.7 | GFS 0.25° raw 16.7 | -0.0 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 11.8 | GFS 0.25° raw 12.3 | -0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 69 | GFS 0.25° raw 73 | 4 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.14 | GFS 0.25° raw 0.21 | -0.07 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.2 | GFS 0.25° raw 1021.2 | -0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 16.7 | stored grid 16.6 | 0.1 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 11.8 | stored grid 11.7 | 0.1 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.17 | stored grid 1021.17 | -0.00 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 16.7 | gfs_global 16.9 | -0.2 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 11.8 | gfs_global 11.9 | -0.1 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 69 | gfs_global 65 | 4 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.14 | gfs_global 0.30 | -0.16 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.2 | gfs_global 1021.3 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 16.7 | gfs_seamless 15.6 | 1.1 | ±1 | **FAIL** |
| Kansas City MO | +0 h | wind km/h | 11.8 | gfs_seamless 9.0 | 2.8 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 69 | gfs_seamless 115 | 46 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.14 | gfs_seamless 0.00 | 0.14 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.2 | gfs_seamless 1021.6 | -0.4 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 8.9 | cams_global 11.8 | -2.9 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 16.7 | NWS 17.2 | -0.6 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 11.8 | NWS 9.3 | 2.5 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 89 | 11 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.14 | NWS 0.08 | 0.06 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | GFS 0.25° raw 17.9 | -0.1 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 14.8 | GFS 0.25° raw 15.5 | -0.7 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 140 | GFS 0.25° raw 139 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.3 | GFS 0.25° raw 1017.2 | 0.1 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | stored grid 17.8 | 0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 14.8 | stored grid 15.1 | -0.3 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.26 | stored grid 1017.24 | 0.02 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | gfs_global 18.3 | -0.5 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 14.8 | gfs_global 13.8 | 1.0 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 140 | gfs_global 139 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.3 | gfs_global 1017.5 | -0.2 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | gfs_seamless 16.1 | 1.7 | ±1 | **FAIL** |
| Kansas City MO | +24 h | wind km/h | 14.8 | gfs_seamless 7.1 | 7.7 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 140 | gfs_seamless 137 | 3 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.3 | gfs_seamless 1018.1 | -0.8 | ±1 | ok |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.4 | cams_global 6.0 | -0.6 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | NWS 17.2 | 0.6 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 14.8 | NWS 7.4 | 7.4 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 100 | NWS 77 | 23 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +112 h | temp °C | 9.8 | GFS 0.25° raw 9.8 | 0.1 | ±0.7 | ok |
| Kansas City MO | +112 h | wind km/h | 14.0 | GFS 0.25° raw 14.7 | -0.8 | ±3 | ok |
| Kansas City MO | +112 h | wind from ° | 339 | GFS 0.25° raw 336 | 3 | ±20 | ok |
| Kansas City MO | +112 h | precip mm/h | 1.18 | GFS 0.25° raw 0.80 | 0.38 | ±0.3 | **FAIL** |
| Kansas City MO | +112 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +112 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.8 | -0.0 | ±0.5 | ok |
| Kansas City MO | +112 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| Kansas City MO | +112 h | wind km/h | 14.0 | stored grid 14.1 | -0.1 | ±1 | ok |
| Kansas City MO | +112 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +112 h | pressure hPa | 1011.75 | stored grid 1011.76 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | GFS 0.25° raw 27.2 | -0.1 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 27.2 | GFS 0.25° raw 30.7 | -3.4 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 81 | GFS 0.25° raw 84 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.50 | GFS 0.25° raw 1.45 | -0.95 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 93 | GFS 0.25° raw 99 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.3 | GFS 0.25° raw 1018.4 | -0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.0 | stored grid 27.0 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 27.2 | stored grid 27.2 | 0.0 | ±1 | ok |
| Miami | +0 h | cloud % | 93 | stored grid 93 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1018.31 | stored grid 1018.32 | -0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_global 27.2 | -0.2 | ±1 | ok |
| Miami | +0 h | wind km/h | 27.2 | gfs_global 32.3 | -5.1 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 81 | gfs_global 83 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.50 | gfs_global 2.80 | -2.30 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 93 | gfs_global 100 | -7 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.3 | gfs_global 1018.4 | -0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_seamless 25.4 | 1.6 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 27.2 | gfs_seamless 15.2 | 12.0 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 81 | gfs_seamless 87 | 6 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.50 | gfs_seamless 0.00 | 0.50 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 93 | gfs_seamless 100 | -7 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.3 | gfs_seamless 1018.3 | 0.0 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 9.4 | cams_global 5.7 | 3.7 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 27.0 | NWS 27.2 | -0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 27.2 | NWS 25.9 | 1.3 | ±8 | ok |
| Miami | +0 h | cloud % | 93 | NWS 74 | 19 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.50 | NWS 0.21 | 0.29 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | GFS 0.25° raw 26.6 | -0.7 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 29.2 | GFS 0.25° raw 31.3 | -2.1 | ±3 | ok |
| Miami | +24 h | wind from ° | 94 | GFS 0.25° raw 100 | 6 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.72 | GFS 0.25° raw 2.26 | 0.45 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.1 | GFS 0.25° raw 1017.0 | 0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 25.9 | stored grid 25.9 | 0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 29.2 | stored grid 28.9 | 0.3 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1017.12 | stored grid 1017.12 | -0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_global 26.7 | -0.8 | ±1 | ok |
| Miami | +24 h | wind km/h | 29.2 | gfs_global 32.3 | -3.1 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 94 | gfs_global 101 | 7 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.72 | gfs_global 1.70 | 1.02 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.1 | gfs_global 1017.0 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_seamless 25.1 | 0.8 | ±1 | ok |
| Miami | +24 h | wind km/h | 29.2 | gfs_seamless 15.9 | 13.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 94 | gfs_seamless 94 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.72 | gfs_seamless 0.00 | 2.72 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.1 | gfs_seamless 1018.7 | -1.6 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 6.9 | cams_global 5.2 | 1.7 | ±3 | ok |
| Miami | +24 h | temp °C | 25.9 | NWS 26.1 | -0.2 | ±3 | ok |
| Miami | +24 h | wind km/h | 29.2 | NWS 27.8 | 1.4 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 61 | 39 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.72 | NWS 0.68 | 2.04 | ±1 | **FAIL** |
| Miami | +112 h | temp °C | 28.0 | GFS 0.25° raw 28.9 | -0.9 | ±0.7 | **FAIL** |
| Miami | +112 h | wind km/h | 15.6 | GFS 0.25° raw 14.1 | 1.5 | ±3 | ok |
| Miami | +112 h | wind from ° | 312 | GFS 0.25° raw 310 | 3 | ±20 | ok |
| Miami | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +112 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +112 h | pressure hPa | 1008.2 | GFS 0.25° raw 1008.1 | 0.1 | ±0.5 | ok |
| Miami | +112 h | temp °C | 28.0 | stored grid 27.9 | 0.0 | ±0.15 | ok |
| Miami | +112 h | wind km/h | 15.6 | stored grid 15.5 | 0.1 | ±1 | ok |
| Miami | +112 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Miami | +112 h | pressure hPa | 1008.22 | stored grid 1008.24 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.0 | GFS 0.25° raw 13.8 | -3.8 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 3.4 | GFS 0.25° raw 3.5 | -0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 103 | GFS 0.25° raw 103 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 40 | GFS 0.25° raw 10 | 30 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.1 | GFS 0.25° raw 1014.4 | 0.6 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 10.0 | stored grid 9.9 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 3.4 | stored grid 3.8 | -0.4 | ±1 | ok |
| Denver | +0 h | cloud % | 40 | stored grid 40 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1015.07 | stored grid 1015.07 | 0.00 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.0 | gfs_global 14.3 | -4.3 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.4 | gfs_global 4.3 | -0.9 | ±3 | ok |
| Denver | +0 h | wind from ° | 103 | gfs_global 90 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 40 | gfs_global 100 | -60 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.1 | gfs_global 1013.9 | 1.2 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 10.0 | gfs_seamless 11.7 | -1.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.4 | gfs_seamless 5.9 | -2.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 103 | gfs_seamless 133 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 40 | gfs_seamless 73 | -33 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.1 | gfs_seamless 1013.1 | 2.0 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 0.7 | cams_global 24.2 | -23.5 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 10.0 | NWS 13.3 | -3.4 | ±3 | **FAIL** |
| Denver | +0 h | wind km/h | 3.4 | NWS 3.7 | -0.3 | ±8 | ok |
| Denver | +0 h | cloud % | 40 | NWS 53 | -13 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 13.4 | GFS 0.25° raw 14.5 | -1.0 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 12.3 | GFS 0.25° raw 11.0 | 1.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 0 | GFS 0.25° raw 1 | 1 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.03 | GFS 0.25° raw 0.00 | 0.03 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.5 | GFS 0.25° raw 999.2 | 0.2 | ±0.5 | ok |
| Denver | +24 h | temp °C | 13.4 | stored grid 13.4 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 12.3 | stored grid 12.2 | 0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 999.47 | stored grid 999.45 | 0.02 | ±0.1 | ok |
| Denver | +24 h | temp °C | 13.4 | gfs_global 14.5 | -1.1 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 12.3 | gfs_global 12.6 | -0.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 0 | gfs_global 2 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.03 | gfs_global 0.00 | 0.03 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.5 | gfs_global 997.7 | 1.8 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 13.4 | gfs_seamless 11.4 | 2.0 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 12.3 | gfs_seamless 4.7 | 7.6 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 0 | gfs_seamless 153 | 153 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.03 | gfs_seamless 0.00 | 0.03 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.5 | gfs_seamless 998.3 | 1.2 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.5 | cams_global 5.0 | -3.5 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 13.4 | NWS 12.8 | 0.6 | ±3 | ok |
| Denver | +24 h | wind km/h | 12.3 | NWS 5.6 | 6.8 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 82 | 18 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.03 | NWS 0.00 | 0.03 | ±1 | ok |
| Denver | +112 h | temp °C | 10.6 | GFS 0.25° raw 11.2 | -0.6 | ±0.7 | ok |
| Denver | +112 h | wind km/h | 2.8 | GFS 0.25° raw 2.7 | 0.1 | ±3 | ok |
| Denver | +112 h | wind from ° | 116 | GFS 0.25° raw 113 | — | ±20 | calm |
| Denver | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +112 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Denver | +112 h | pressure hPa | 1015.5 | GFS 0.25° raw 1015.7 | -0.2 | ±0.5 | ok |
| Denver | +112 h | temp °C | 10.6 | stored grid 10.5 | 0.1 | ±0.15 | ok |
| Denver | +112 h | wind km/h | 2.8 | stored grid 2.9 | -0.1 | ±1 | ok |
| Denver | +112 h | cloud % | 1 | stored grid 0 | 0 | ±1 | ok |
| Denver | +112 h | pressure hPa | 1015.50 | stored grid 1015.51 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.4 | GFS 0.25° raw 9.6 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 5.3 | GFS 0.25° raw 3.9 | 1.4 | ±3 | ok |
| London | +0 h | wind from ° | 25 | GFS 0.25° raw 27 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 8 | GFS 0.25° raw 5 | 3 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.2 | GFS 0.25° raw 1032.2 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.4 | stored grid 9.4 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 5.3 | stored grid 5.1 | 0.2 | ±1 | ok |
| London | +0 h | cloud % | 8 | stored grid 8 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.23 | stored grid 1032.26 | -0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 9.4 | gfs_global 9.7 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 5.3 | gfs_global 3.9 | 1.4 | ±3 | ok |
| London | +0 h | wind from ° | 25 | gfs_global 34 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 8 | gfs_global 64 | -56 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.2 | gfs_global 1032.2 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.4 | gfs_seamless 9.7 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 5.3 | gfs_seamless 3.9 | 1.4 | ±3 | ok |
| London | +0 h | wind from ° | 25 | gfs_seamless 34 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 8 | gfs_seamless 64 | -56 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.2 | gfs_seamless 1032.2 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 33.2 | cams_global 29.1 | 4.1 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.0 | GFS 0.25° raw 10.0 | 0.0 | ±0.7 | ok |
| London | +24 h | wind km/h | 17.3 | GFS 0.25° raw 16.2 | 1.1 | ±3 | ok |
| London | +24 h | wind from ° | 16 | GFS 0.25° raw 19 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 43 | GFS 0.25° raw 13 | 31 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.3 | GFS 0.25° raw 1035.3 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.0 | stored grid 10.0 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 17.3 | stored grid 17.5 | -0.2 | ±1 | ok |
| London | +24 h | cloud % | 43 | stored grid 44 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1035.32 | stored grid 1035.30 | 0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.0 | gfs_global 10.2 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 17.3 | gfs_global 16.1 | 1.2 | ±3 | ok |
| London | +24 h | wind from ° | 16 | gfs_global 20 | 4 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 43 | gfs_global 83 | -40 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.3 | gfs_global 1035.4 | -0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.0 | gfs_seamless 10.2 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 17.3 | gfs_seamless 16.1 | 1.2 | ±3 | ok |
| London | +24 h | wind from ° | 16 | gfs_seamless 20 | 4 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 43 | gfs_seamless 83 | -40 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.3 | gfs_seamless 1035.4 | -0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 7.7 | cams_global 4.0 | 3.7 | ±3 | **FAIL** |
| London | +112 h | temp °C | 9.5 | GFS 0.25° raw 9.6 | -0.1 | ±0.7 | ok |
| London | +112 h | wind km/h | 15.2 | GFS 0.25° raw 12.9 | 2.3 | ±3 | ok |
| London | +112 h | wind from ° | 52 | GFS 0.25° raw 52 | 0 | ±20 | ok |
| London | +112 h | precip mm/h | 0.09 | GFS 0.25° raw 0.12 | -0.03 | ±0.3 | ok |
| London | +112 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| London | +112 h | pressure hPa | 1027.6 | GFS 0.25° raw 1027.6 | 0.0 | ±0.5 | ok |
| London | +112 h | temp °C | 9.5 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +112 h | wind km/h | 15.2 | stored grid 15.2 | -0.0 | ±1 | ok |
| London | +112 h | cloud % | 97 | stored grid 97 | -0 | ±1 | ok |
| London | +112 h | pressure hPa | 1027.64 | stored grid 1027.61 | 0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.2 | GFS 0.25° raw 23.2 | -1.0 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.3 | GFS 0.25° raw 7.1 | 0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | GFS 0.25° raw 320 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | GFS 0.25° raw 1016.9 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 22.2 | stored grid 22.2 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 7.3 | stored grid 7.0 | 0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.00 | stored grid 1016.99 | 0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.2 | gfs_global 24.0 | -1.8 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.3 | gfs_global 7.2 | 0.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | gfs_global 323 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_global 1016.9 | 0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 22.2 | gfs_seamless 24.0 | -1.8 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.3 | gfs_seamless 7.2 | 0.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | gfs_seamless 323 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_seamless 1016.9 | 0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 66.3 | cams_global 62.4 | 3.9 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.9 | GFS 0.25° raw 24.1 | -1.2 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.2 | GFS 0.25° raw 1.7 | 1.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 182 | GFS 0.25° raw 168 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1016.3 | GFS 0.25° raw 1016.2 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.9 | stored grid 22.9 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 3.2 | stored grid 2.9 | 0.3 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1016.26 | stored grid 1016.27 | -0.00 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.9 | gfs_global 25.2 | -2.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.2 | gfs_global 0.7 | 2.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 182 | gfs_global 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1016.3 | gfs_global 1016.1 | 0.2 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.9 | gfs_seamless 25.2 | -2.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.2 | gfs_seamless 0.7 | 2.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 182 | gfs_seamless 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1016.3 | gfs_seamless 1016.1 | 0.2 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 64.7 | cams_global 113.9 | -49.2 | ±3 | **FAIL** |
| Delhi | +112 h | temp °C | 25.7 | GFS 0.25° raw 27.3 | -1.6 | ±0.7 | **FAIL** |
| Delhi | +112 h | wind km/h | 7.0 | GFS 0.25° raw 7.0 | 0.0 | ±3 | ok |
| Delhi | +112 h | wind from ° | 301 | GFS 0.25° raw 312 | — | ±20 | calm |
| Delhi | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +112 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +112 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +112 h | temp °C | 25.7 | stored grid 25.7 | 0.0 | ±0.15 | ok |
| Delhi | +112 h | wind km/h | 7.0 | stored grid 6.8 | 0.2 | ±1 | ok |
| Delhi | +112 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +112 h | pressure hPa | 1014.14 | stored grid 1014.13 | 0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 16.60 | 16.69 | -0.09 | 11.7 | 12.3 | -0.6 | 100 | 100 |
| Kansas City MO | +24 h | 17.81 | 17.89 | -0.08 | 15.1 | 15.5 | -0.4 | 100 | 100 |
| Kansas City MO | +112 h (f120) | 9.84 | 9.75 | 0.09 | 14.1 | 14.7 | -0.6 | 100 | 100 |
| Miami | +0 h | 26.99 | 27.17 | -0.18 | 27.2 | 30.7 | -3.4 | 93 | 99 |
| Miami | +24 h | 25.92 | 26.60 | -0.68 | 28.9 | 31.3 | -2.3 | 100 | 100 |
| Miami | +112 h (f120) | 27.93 | 28.90 | -0.97 | 15.5 | 14.1 | 1.4 | 0 | 0 |
| Denver | +0 h | 9.92 | 13.75 | -3.83 | 3.8 | 3.5 | 0.3 | 40 | 10 |
| Denver | +24 h | 13.43 | 14.47 | -1.04 | 12.2 | 11.0 | 1.2 | 100 | 100 |
| Denver | +112 h (f120) | 10.52 | 11.17 | -0.65 | 2.9 | 2.7 | 0.3 | 0 | 0 |
| London | +0 h | 9.41 | 9.57 | -0.16 | 5.1 | 3.9 | 1.1 | 8 | 5 |
| London | +24 h | 9.98 | 9.98 | -0.00 | 17.5 | 16.2 | 1.3 | 44 | 13 |
| London | +112 h (f120) | 9.56 | 9.60 | -0.04 | 15.2 | 12.9 | 2.4 | 97 | 99 |
| Delhi | +0 h | 22.21 | 23.25 | -1.03 | 7.0 | 7.1 | -0.1 | 0 | 0 |
| Delhi | +24 h | 22.87 | 24.09 | -1.21 | 2.9 | 1.7 | 1.2 | 0 | 0 |
| Delhi | +112 h (f120) | 25.72 | 27.34 | -1.62 | 6.8 | 7.0 | -0.2 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 18.60 | 18.59 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1019.40 | 1019.38 | 0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 100.00 | 99.91 | 0.09 | ±1 | ok |
| Chile coast | +0 h | temp | 12.60 | 12.59 | 0.01 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1017.30 | 1017.31 | -0.01 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 71.00 | 70.92 | 0.08 | ±1 | ok |
| Kansas City | +0 h | temp | 16.80 | 16.78 | 0.02 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.80 | 1020.85 | -0.05 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 20.00 | 20.05 | -0.05 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1012.50 | 1012.52 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 98.00 | 97.64 | 0.36 | ±1 | ok |
| Chile coast | +24 h | temp | 11.60 | 11.65 | -0.05 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1015.30 | 1015.34 | -0.04 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Kansas City | +24 h | temp | 18.20 | 18.25 | -0.05 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1016.50 | 1016.48 | 0.02 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +112 h | temp | 16.00 | 15.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +112 h | pres | 1005.20 | 1005.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +112 h | cloud | 1.00 | 0.77 | 0.23 | ±1 | ok |
| Chile coast | +112 h | temp | 18.40 | 18.44 | -0.04 | ±0.5 | ok |
| Chile coast | +112 h | pres | 1015.40 | 1015.38 | 0.02 | ±0.5 | ok |
| Chile coast | +112 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +112 h | temp | 9.80 | 9.74 | 0.06 | ±0.5 | ok |
| Kansas City | +112 h | pres | 1012.40 | 1012.40 | 0.00 | ±0.5 | ok |
| Kansas City | +112 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (9.1 h before this check), valid hour 2026-11-01T02:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 62.90 | 62.90 | 0.00 | ±0.2 | ok | 64.70 | -1.80 |
| node 52N 0E (London) | +0 h | 35.00 | 35.00 | 0.00 | ±0.2 | ok | 30.50 | 4.50 |
| node 40N 116E (Beijing) | +0 h | 22.10 | 22.10 | 0.00 | ±0.2 | ok | 27.40 | -5.30 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":213,"2024 24-h mean":13,"2012 hourly":225,"2012 24-h mean":30}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.8 | 12.6 | 57 | 56 | 58 | 49 | 52 |
| Miami | 5.7 | 5.8 | 35 | 32 | 32 | 24 | 24 |
| Denver | 24.2 | 17.8 | 66 | 79 | 67 | 76 | 63 |
| London | 29.1 | 15.2 | 60 | 88 | 62 | 87 | 58 |
| Delhi | 62.4 | 67.0 | 158 | 156 | 159 | 155 | 157 |
| node 28N 76E (Delhi) | 64.7 | 36.9 | 101 | 157 | 104 | 156 | 104 |
| node 52N 0E (London) | 30.5 | 12.5 | 55 | 91 | 57 | 90 | 52 |
| node 40N 116E (Beijing) | 27.4 | 67.6 | 159 | 85 | 159 | 83 | 157 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 17 °Cat 2 m39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC | 12 km/hfrom ENE39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC | 0.1 mm/hpast hour · area avg39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC | 100 %area average39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC | 1021 hPasea level39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC | 8.9 µg/m³Good · AQI 50 (24 h)39.1°N 94.5°W · Sun 02:00 local · 02:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC | 27 km/hfrom E25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC | 0.5 mm/hpast hour · area avg25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC | 93 %area average25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC | 1018 hPasea level25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC | 9.4 µg/m³Moderate · AQI 44 (24 h)25.7°N 80.1°W · Sun 02:00 local · 02:00 UTC |
| Denver | 10 °Cat 2 m39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC | 3 km/hfrom ESE39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC | 40 %area average39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC | 1015 hPasea level39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC | 0.7 µg/m³Good · AQI 37 (24 h)39.7°N 104.9°W · Sun 02:00 local · 02:00 UTC |
| London | 9 °Cat 2 m51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC | 5 km/hfrom NNE51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC | 8 %area average51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC | 33 µg/m³Moderate · AQI 60 (24 h)51.5°N 0.1°W · Sun 02:00 local · 02:00 UTC |
| Delhi | 22 °Cat 2 m28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC | 7 km/hfrom NW28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC | 0 %area average28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC | 1017 hPasea level28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC | 66 µg/m³Unhealthy · AQI 105 (24 h)28.6°N 77.2°E · Sun 02:00 local · 02:00 UTC |
