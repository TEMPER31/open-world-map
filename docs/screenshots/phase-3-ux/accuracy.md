# Accuracy check (phase-3-ux)

Generated 2026-10-31T07:59:51.458Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T00:00:00.000Z, timeline +0 h = 2026-10-31T08:00:00.000Z (f008); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 52 / 5 / 3
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 47 / 10 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 39 / 18 / 3
- Open-Meteo cams_global at the cities: 3 / 7 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 22 / 5 / 3
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 0 / 0 / 3

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.1 | GFS 0.25° raw 17.3 | -0.1 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 4.2 | GFS 0.25° raw 4.6 | -0.4 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 286 | GFS 0.25° raw 266 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.33 | GFS 0.25° raw 0.25 | 0.08 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.7 | GFS 0.25° raw 1021.7 | 0.0 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.1 | stored grid 17.1 | 0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 4.2 | stored grid 4.1 | 0.1 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.75 | stored grid 1021.75 | -0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.1 | gfs_global 17.8 | -0.7 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 4.2 | gfs_global 5.0 | -0.8 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 286 | gfs_global 300 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.33 | gfs_global 0.00 | 0.33 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.7 | gfs_global 1022.0 | -0.3 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.1 | gfs_seamless 16.8 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 4.2 | gfs_seamless 2.2 | 2.0 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 286 | gfs_seamless 101 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.33 | gfs_seamless 0.00 | 0.33 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.7 | gfs_seamless 1020.9 | 0.8 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.2 | cams_global 11.3 | -2.1 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.1 | NWS 16.7 | 0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 4.2 | NWS 3.7 | 0.5 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 92 | 8 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.33 | NWS 0.08 | 0.24 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.8 | GFS 0.25° raw 13.6 | 0.2 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 8.3 | GFS 0.25° raw 8.8 | -0.5 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 135 | GFS 0.25° raw 131 | 4 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 53 | GFS 0.25° raw 39 | 14 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | GFS 0.25° raw 1021.7 | -0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 13.8 | stored grid 13.7 | 0.1 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 8.3 | stored grid 8.6 | -0.3 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 53 | stored grid 53 | -0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.66 | stored grid 1021.68 | -0.02 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 13.8 | gfs_global 14.3 | -0.5 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 8.3 | gfs_global 7.9 | 0.4 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 135 | gfs_global 129 | 6 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 53 | gfs_global 13 | 40 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | gfs_global 1021.9 | -0.2 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.8 | gfs_seamless 14.7 | -0.9 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 8.3 | gfs_seamless 5.8 | 2.5 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 135 | gfs_seamless 92 | 43 | ±20 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.40 | -0.40 | ±0.3 | **FAIL** |
| Kansas City MO | +24 h | cloud % | 53 | gfs_seamless 100 | -47 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | gfs_seamless 1022.8 | -1.1 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 13.3 | cams_global 9.9 | 3.4 | ±3 | **FAIL** |
| Kansas City MO | +24 h | temp °C | 13.8 | NWS 15.6 | -1.8 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 8.3 | NWS 5.6 | 2.8 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 53 | NWS 74 | -21 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.08 | -0.08 | ±1 | ok |
| Kansas City MO | +112 h | temp °C | 12.7 | GFS 0.25° raw 12.8 | -0.1 | ±0.7 | ok |
| Kansas City MO | +112 h | wind km/h | 6.2 | GFS 0.25° raw 6.0 | 0.1 | ±3 | ok |
| Kansas City MO | +112 h | wind from ° | 25 | GFS 0.25° raw 21 | — | ±20 | calm |
| Kansas City MO | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +112 h | cloud % | 7 | GFS 0.25° raw 5 | 2 | ±15 | ok |
| Kansas City MO | +112 h | pressure hPa | 1014.4 | GFS 0.25° raw 1014.4 | 0.0 | ±0.5 | ok |
| Kansas City MO | +112 h | temp °C | 12.7 | stored grid 12.7 | -0.0 | ±0.15 | ok |
| Kansas City MO | +112 h | wind km/h | 6.2 | stored grid 5.9 | 0.3 | ±1 | ok |
| Kansas City MO | +112 h | cloud % | 7 | stored grid 7 | 0 | ±1 | ok |
| Kansas City MO | +112 h | pressure hPa | 1014.40 | stored grid 1014.38 | 0.03 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.3 | GFS 0.25° raw 26.9 | -0.6 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 19.6 | GFS 0.25° raw 21.3 | -1.7 | ±3 | ok |
| Miami | +0 h | wind from ° | 86 | GFS 0.25° raw 88 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | GFS 0.25° raw 0.16 | -0.02 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | GFS 0.25° raw 4 | 4 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.1 | GFS 0.25° raw 1015.1 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.3 | stored grid 26.3 | -0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 19.6 | stored grid 19.6 | -0.0 | ±1 | ok |
| Miami | +0 h | cloud % | 8 | stored grid 8 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1015.09 | stored grid 1015.10 | -0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.3 | gfs_global 27.0 | -0.7 | ±1 | ok |
| Miami | +0 h | wind km/h | 19.6 | gfs_global 22.0 | -2.4 | ±3 | ok |
| Miami | +0 h | wind from ° | 86 | gfs_global 87 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | gfs_global 0.10 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | gfs_global 15 | -7 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.1 | gfs_global 1015.1 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.3 | gfs_seamless 25.1 | 1.2 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 19.6 | gfs_seamless 9.7 | 9.9 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 86 | gfs_seamless 99 | 13 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | gfs_seamless 0.00 | 0.14 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | gfs_seamless 95 | -87 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1015.1 | gfs_seamless 1014.3 | 0.8 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 9.5 | cams_global 3.9 | 5.6 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 26.3 | NWS 26.1 | 0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 19.6 | NWS 22.2 | -2.7 | ±8 | ok |
| Miami | +0 h | cloud % | 8 | NWS 24 | -16 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.14 | NWS 1.27 | -1.13 | ±1 | **FAIL** |
| Miami | +24 h | temp °C | 26.1 | GFS 0.25° raw 26.4 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 26.4 | GFS 0.25° raw 28.7 | -2.4 | ±3 | ok |
| Miami | +24 h | wind from ° | 87 | GFS 0.25° raw 88 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.58 | GFS 0.25° raw 0.79 | -0.21 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.5 | GFS 0.25° raw 1017.5 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.1 | stored grid 26.1 | 0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 26.4 | stored grid 26.4 | -0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1017.46 | stored grid 1017.46 | 0.01 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.1 | gfs_global 26.4 | -0.3 | ±1 | ok |
| Miami | +24 h | wind km/h | 26.4 | gfs_global 29.2 | -2.8 | ±3 | ok |
| Miami | +24 h | wind from ° | 87 | gfs_global 89 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.58 | gfs_global 0.90 | -0.32 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.5 | gfs_global 1017.4 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.1 | gfs_seamless 24.2 | 1.9 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 26.4 | gfs_seamless 20.3 | 6.1 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 87 | gfs_seamless 88 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.58 | gfs_seamless 0.00 | 0.58 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.5 | gfs_seamless 1018.4 | -0.9 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 8.7 | cams_global 8.4 | 0.3 | ±3 | ok |
| Miami | +24 h | temp °C | 26.1 | NWS 26.1 | -0.0 | ±3 | ok |
| Miami | +24 h | wind km/h | 26.4 | NWS 31.5 | -5.1 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 63 | 37 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.58 | NWS 0.21 | 0.37 | ±1 | ok |
| Miami | +112 h | temp °C | 24.8 | GFS 0.25° raw 25.1 | -0.3 | ±0.7 | ok |
| Miami | +112 h | wind km/h | 23.4 | GFS 0.25° raw 28.4 | -5.0 | ±3 | **FAIL** |
| Miami | +112 h | wind from ° | 70 | GFS 0.25° raw 65 | 5 | ±20 | ok |
| Miami | +112 h | precip mm/h | 1.75 | GFS 0.25° raw 2.59 | -0.84 | ±0.3 | **FAIL** |
| Miami | +112 h | cloud % | 88 | GFS 0.25° raw 100 | -12 | ±15 | ok |
| Miami | +112 h | pressure hPa | 1011.9 | GFS 0.25° raw 1011.8 | 0.1 | ±0.5 | ok |
| Miami | +112 h | temp °C | 24.8 | stored grid 24.8 | 0.0 | ±0.15 | ok |
| Miami | +112 h | wind km/h | 23.4 | stored grid 23.5 | -0.1 | ±1 | ok |
| Miami | +112 h | cloud % | 88 | stored grid 88 | -0 | ±1 | ok |
| Miami | +112 h | pressure hPa | 1011.88 | stored grid 1011.86 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.2 | GFS 0.25° raw 11.9 | -3.7 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 5.9 | GFS 0.25° raw 4.4 | 1.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | GFS 0.25° raw 17 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.4 | GFS 0.25° raw 1012.6 | 0.8 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 8.2 | stored grid 8.3 | -0.1 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 5.9 | stored grid 5.8 | 0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1013.45 | stored grid 1013.44 | 0.01 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.2 | gfs_global 12.3 | -4.1 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 5.9 | gfs_global 6.7 | -0.8 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | gfs_global 16 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.4 | gfs_global 1012.2 | 1.2 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 8.2 | gfs_seamless 7.6 | 0.6 | ±1 | ok |
| Denver | +0 h | wind km/h | 5.9 | gfs_seamless 5.5 | 0.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | gfs_seamless 324 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.4 | gfs_seamless 1009.8 | 3.6 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 1.3 | cams_global 21.4 | -20.1 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 8.2 | NWS 7.8 | 0.4 | ±3 | ok |
| Denver | +0 h | wind km/h | 5.9 | NWS 1.9 | 4.0 | ±8 | ok |
| Denver | +0 h | cloud % | 100 | NWS 50 | 50 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 8.8 | GFS 0.25° raw 12.6 | -3.8 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 2.5 | GFS 0.25° raw 2.5 | -0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 271 | GFS 0.25° raw 271 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 95 | GFS 0.25° raw 100 | -5 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1014.4 | GFS 0.25° raw 1013.5 | 0.9 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 8.8 | stored grid 8.7 | 0.1 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 2.5 | stored grid 2.6 | -0.0 | ±1 | ok |
| Denver | +24 h | cloud % | 95 | stored grid 95 | -0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1014.39 | stored grid 1014.44 | -0.04 | ±0.1 | ok |
| Denver | +24 h | temp °C | 8.8 | gfs_global 13.2 | -4.4 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 2.5 | gfs_global 2.8 | -0.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 271 | gfs_global 310 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 95 | gfs_global 100 | -5 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1014.4 | gfs_global 1013.2 | 1.2 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 8.8 | gfs_seamless 6.3 | 2.5 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 2.5 | gfs_seamless 7.6 | -5.1 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 271 | gfs_seamless 156 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 95 | gfs_seamless 100 | -5 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1014.4 | gfs_seamless 1015.6 | -1.2 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 5.0 | cams_global 23.8 | -18.8 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 8.8 | NWS 7.8 | 1.0 | ±3 | ok |
| Denver | +24 h | wind km/h | 2.5 | NWS 3.7 | -1.2 | ±8 | ok |
| Denver | +24 h | cloud % | 95 | NWS 65 | 30 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +112 h | temp °C | 13.4 | GFS 0.25° raw 16.1 | -2.8 | ±0.7 | **FAIL** |
| Denver | +112 h | wind km/h | 8.0 | GFS 0.25° raw 7.6 | 0.4 | ±3 | ok |
| Denver | +112 h | wind from ° | 6 | GFS 0.25° raw 9 | — | ±20 | calm |
| Denver | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +112 h | cloud % | 2 | GFS 0.25° raw 0 | 2 | ±15 | ok |
| Denver | +112 h | pressure hPa | 1007.3 | GFS 0.25° raw 1006.7 | 0.5 | ±0.5 | **FAIL** |
| Denver | +112 h | temp °C | 13.4 | stored grid 13.3 | 0.0 | ±0.15 | ok |
| Denver | +112 h | wind km/h | 8.0 | stored grid 7.7 | 0.3 | ±1 | ok |
| Denver | +112 h | cloud % | 2 | stored grid 2 | 0 | ±1 | ok |
| Denver | +112 h | pressure hPa | 1007.25 | stored grid 1007.28 | -0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 9.9 | GFS 0.25° raw 10.0 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 8.6 | GFS 0.25° raw 6.0 | 2.6 | ±3 | ok |
| London | +0 h | wind from ° | 84 | GFS 0.25° raw 84 | 0 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 43 | GFS 0.25° raw 56 | -13 | ±15 | ok |
| London | +0 h | pressure hPa | 1031.4 | GFS 0.25° raw 1031.4 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.9 | stored grid 9.9 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 8.6 | stored grid 8.5 | 0.1 | ±1 | ok |
| London | +0 h | cloud % | 43 | stored grid 43 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1031.41 | stored grid 1031.42 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.9 | gfs_global 10.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.6 | gfs_global 5.8 | 2.8 | ±3 | ok |
| London | +0 h | wind from ° | 84 | gfs_global 83 | 1 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 43 | gfs_global 72 | -29 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1031.4 | gfs_global 1031.4 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.9 | gfs_seamless 10.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.6 | gfs_seamless 5.8 | 2.8 | ±3 | ok |
| London | +0 h | wind from ° | 84 | gfs_seamless 83 | 1 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 43 | gfs_seamless 72 | -29 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1031.4 | gfs_seamless 1031.4 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 14.7 | cams_global 19.8 | -5.1 | ±3 | **FAIL** |
| London | +24 h | temp °C | 9.2 | GFS 0.25° raw 9.2 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 8.4 | GFS 0.25° raw 5.3 | 3.1 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 356 | GFS 0.25° raw 354 | 2 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | GFS 0.25° raw 7 | 3 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | GFS 0.25° raw 1032.9 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 9.2 | stored grid 9.1 | 0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 8.4 | stored grid 8.3 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 10 | stored grid 10 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.96 | stored grid 1032.95 | 0.00 | ±0.1 | ok |
| London | +24 h | temp °C | 9.2 | gfs_global 9.4 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.4 | gfs_global 5.1 | 3.3 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 356 | gfs_global 356 | 0 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | gfs_global 5 | 5 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | gfs_global 1033.0 | -0.0 | ±1 | ok |
| London | +24 h | temp °C | 9.2 | gfs_seamless 9.4 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.4 | gfs_seamless 5.1 | 3.3 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 356 | gfs_seamless 356 | 0 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | gfs_seamless 5 | 5 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | gfs_seamless 1033.0 | -0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 34.7 | cams_global 35.6 | -0.9 | ±3 | ok |
| London | +112 h | temp °C | 8.1 | GFS 0.25° raw 8.1 | -0.0 | ±0.7 | ok |
| London | +112 h | wind km/h | 15.3 | GFS 0.25° raw 13.3 | 2.0 | ±3 | ok |
| London | +112 h | wind from ° | 46 | GFS 0.25° raw 60 | 14 | ±20 | ok |
| London | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +112 h | cloud % | 19 | GFS 0.25° raw 9 | 10 | ±15 | ok |
| London | +112 h | pressure hPa | 1031.8 | GFS 0.25° raw 1031.7 | 0.0 | ±0.5 | ok |
| London | +112 h | temp °C | 8.1 | stored grid 8.1 | 0.0 | ±0.15 | ok |
| London | +112 h | wind km/h | 15.3 | stored grid 15.4 | -0.1 | ±1 | ok |
| London | +112 h | cloud % | 19 | stored grid 19 | -0 | ±1 | ok |
| London | +112 h | pressure hPa | 1031.75 | stored grid 1031.74 | 0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 28.8 | GFS 0.25° raw 29.0 | -0.2 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 9.2 | GFS 0.25° raw 9.0 | 0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 326 | GFS 0.25° raw 326 | 1 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 6 | GFS 0.25° raw 5 | 1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.4 | GFS 0.25° raw 1016.4 | -0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 28.8 | stored grid 28.9 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 9.2 | stored grid 9.5 | -0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 6 | stored grid 6 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1016.40 | stored grid 1016.40 | 0.00 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 28.8 | gfs_global 29.1 | -0.3 | ±1 | ok |
| Delhi | +0 h | wind km/h | 9.2 | gfs_global 8.8 | 0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 326 | gfs_global 325 | 1 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 6 | gfs_global 79 | -73 | ±15 | **FAIL** |
| Delhi | +0 h | pressure hPa | 1016.4 | gfs_global 1016.1 | 0.3 | ±1 | ok |
| Delhi | +0 h | temp °C | 28.8 | gfs_seamless 29.1 | -0.3 | ±1 | ok |
| Delhi | +0 h | wind km/h | 9.2 | gfs_seamless 8.8 | 0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 326 | gfs_seamless 325 | 1 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 6 | gfs_seamless 79 | -73 | ±15 | **FAIL** |
| Delhi | +0 h | pressure hPa | 1016.4 | gfs_seamless 1016.1 | 0.3 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 11.6 | cams_global 29.9 | -18.3 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 30.8 | GFS 0.25° raw 30.9 | -0.2 | ±0.7 | ok |
| Delhi | +24 h | wind km/h | 9.2 | GFS 0.25° raw 8.6 | 0.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 330 | GFS 0.25° raw 333 | 3 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1013.4 | GFS 0.25° raw 1013.4 | -0.0 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 30.8 | stored grid 30.8 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 9.2 | stored grid 9.0 | 0.2 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1013.37 | stored grid 1013.38 | -0.00 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 30.8 | gfs_global 31.0 | -0.2 | ±1 | ok |
| Delhi | +24 h | wind km/h | 9.2 | gfs_global 8.2 | 1.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 330 | gfs_global 331 | 1 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1013.4 | gfs_global 1012.9 | 0.5 | ±1 | ok |
| Delhi | +24 h | temp °C | 30.8 | gfs_seamless 31.0 | -0.2 | ±1 | ok |
| Delhi | +24 h | wind km/h | 9.2 | gfs_seamless 8.2 | 1.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 330 | gfs_seamless 331 | 1 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1013.4 | gfs_seamless 1012.9 | 0.5 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 29.4 | cams_global 53.2 | -23.8 | ±3 | **FAIL** |
| Delhi | +112 h | temp °C | 23.2 | GFS 0.25° raw 24.6 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +112 h | wind km/h | 2.1 | GFS 0.25° raw 1.6 | 0.5 | ±3 | ok |
| Delhi | +112 h | wind from ° | 95 | GFS 0.25° raw 87 | — | ±20 | calm |
| Delhi | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +112 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +112 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +112 h | temp °C | 23.2 | stored grid 23.2 | 0.0 | ±0.15 | ok |
| Delhi | +112 h | wind km/h | 2.1 | stored grid 1.9 | 0.2 | ±1 | ok |
| Delhi | +112 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +112 h | pressure hPa | 1014.06 | stored grid 1014.07 | -0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.11 | 17.25 | -0.14 | 4.1 | 4.6 | -0.5 | 100 | 100 |
| Kansas City MO | +24 h | 13.73 | 13.62 | 0.11 | 8.6 | 8.8 | -0.2 | 53 | 39 |
| Kansas City MO | +112 h (f120) | 12.74 | 12.82 | -0.08 | 5.9 | 6.0 | -0.2 | 7 | 5 |
| Miami | +0 h | 26.31 | 26.87 | -0.56 | 19.6 | 21.3 | -1.7 | 8 | 4 |
| Miami | +24 h | 26.07 | 26.42 | -0.35 | 26.4 | 28.7 | -2.3 | 100 | 100 |
| Miami | +112 h (f120) | 24.77 | 25.11 | -0.34 | 23.5 | 28.4 | -4.9 | 88 | 100 |
| Denver | +0 h | 8.29 | 11.92 | -3.63 | 5.8 | 4.4 | 1.4 | 100 | 100 |
| Denver | +24 h | 8.71 | 12.64 | -3.93 | 2.6 | 2.5 | 0.0 | 95 | 100 |
| Denver | +112 h (f120) | 13.33 | 16.12 | -2.79 | 7.7 | 7.6 | 0.1 | 2 | 0 |
| London | +0 h | 9.92 | 9.97 | -0.05 | 8.5 | 6.0 | 2.5 | 43 | 56 |
| London | +24 h | 9.09 | 9.24 | -0.15 | 8.3 | 5.3 | 3.1 | 10 | 7 |
| London | +112 h (f120) | 8.07 | 8.10 | -0.03 | 15.4 | 13.3 | 2.1 | 19 | 9 |
| Delhi | +0 h | 28.87 | 29.02 | -0.15 | 9.5 | 9.0 | 0.5 | 6 | 5 |
| Delhi | +24 h | 30.77 | 30.91 | -0.14 | 9.0 | 8.6 | 0.4 | 0 | 0 |
| Delhi | +112 h (f120) | 23.16 | 24.64 | -1.49 | 1.9 | 1.6 | 0.3 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 21.00 | 21.00 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1011.90 | 1011.89 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 8.00 | 8.26 | -0.26 | ±1 | ok |
| Chile coast | +0 h | temp | 13.60 | 13.69 | -0.09 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1012.90 | 1012.91 | -0.01 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 93.00 | 92.78 | 0.22 | ±1 | ok |
| Kansas City | +0 h | temp | 17.00 | 16.96 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1021.70 | 1021.69 | 0.01 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 17.00 | 17.09 | -0.09 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1018.30 | 1018.27 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 82.00 | 81.75 | 0.25 | ±1 | ok |
| Chile coast | +24 h | temp | 12.80 | 12.73 | 0.07 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1016.10 | 1016.09 | 0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 97.00 | 96.91 | 0.09 | ±1 | ok |
| Kansas City | +24 h | temp | 12.80 | 12.77 | 0.03 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1021.50 | 1021.45 | 0.05 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 17.00 | 17.32 | -0.32 | ±1 | ok |
| Tokyo Bay | +112 h | temp | 13.20 | 13.24 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +112 h | pres | 1022.30 | 1022.32 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +112 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +112 h | temp | 10.80 | 10.80 | -0.00 | ±0.5 | ok |
| Chile coast | +112 h | pres | 1018.40 | 1018.42 | -0.02 | ±0.5 | ok |
| Chile coast | +112 h | cloud | 2.00 | 1.61 | 0.39 | ±1 | ok |
| Kansas City | +112 h | temp | 12.60 | 12.60 | -0.00 | ±0.5 | ok |
| Kansas City | +112 h | pres | 1014.30 | 1014.34 | -0.04 | ±0.5 | ok |
| Kansas City | +112 h | cloud | 19.00 | 18.53 | 0.47 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T05:23:18Z (2.6 h before this check), valid hour 2026-10-31T08:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 7.80 | — | — | ±0.2 | not recorded by this build | 7.80 | 0.00 |
| node 52N 0E (London) | +0 h | 15.10 | — | — | ±0.2 | not recorded by this build | 15.10 | 0.00 |
| node 40N 116E (Beijing) | +0 h | 22.60 | — | — | ±0.2 | not recorded by this build | 22.60 | 0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":151,"2024 24-h mean":10,"2012 hourly":168,"2012 24-h mean":46}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.3 | 14.9 | 61 | 55 | 62 | 47 | 57 |
| Miami | 3.9 | 5.6 | 35 | 22 | 31 | 16 | 23 |
| Denver | 21.4 | 18.2 | 67 | 74 | 68 | 71 | 64 |
| London | 19.8 | 9.7 | 51 | 71 | 52 | 67 | 40 |
| Delhi | 29.9 | 41.9 | 115 | 90 | 117 | 88 | 117 |
| node 28N 76E (Delhi) | 7.8 | 28.8 | 88 | 43 | 88 | 33 | 86 |
| node 52N 0E (London) | 15.1 | 7.8 | 43 | 62 | 43 | 57 | 33 |
| node 40N 116E (Beijing) | 22.6 | 30.7 | 92 | 76 | 91 | 73 | 90 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 17 °Cat 2 m39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC | 4 km/hfrom WNW39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC | 0.3 mm/hpast hour · area avg39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC | 100 %area average39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC | 1022 hPasea level39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC | 9.2 µg/m³Moderate · AQI 57 (24 h)39.1°N 94.5°W · Sat 08:00 local · 08:00 UTC |
| Miami | 26 °Cat 2 m25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC | 20 km/hfrom E25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC | 0.1 mm/hpast hour · area avg25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC | 8 %area average25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC | 1015 hPasea level25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC | 9.5 µg/m³Moderate · AQI 47 (24 h)25.7°N 80.1°W · Sat 08:00 local · 08:00 UTC |
| Denver | 8 °Cat 2 m39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC | 6 km/hfrom NNE39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC | 100 %area average39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC | 1013 hPasea level39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC | 1.3 µg/m³Good · AQI 48 (24 h)39.7°N 104.9°W · Sat 08:00 local · 08:00 UTC |
| London | 10 °Cat 2 m51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC | 9 km/hfrom E51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC | 43 %area average51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC | 1031 hPasea level51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC | 15 µg/m³Moderate · AQI 42 (24 h)51.5°N 0.1°W · Sat 08:00 local · 08:00 UTC |
| Delhi | 29 °Cat 2 m28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC | 9 km/hfrom NW28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC | 6 %area average28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC | 12 µg/m³Moderate · AQI 90 (24 h)28.6°N 77.2°E · Sat 08:00 local · 08:00 UTC |
