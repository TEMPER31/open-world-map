# Accuracy check (phase-3-ux)

Generated 2026-10-31T18:30:55.234Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T12:00:00.000Z, timeline +0 h = 2026-10-31T18:00:00.000Z (f006); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 53 / 4 / 3
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 50 / 7 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 36 / 21 / 3
- Open-Meteo cams_global at the cities: 3 / 7 / 0
- NWS gridpoints (sanity check): 20 / 4 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 20.1 | GFS 0.25° raw 20.2 | -0.1 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 17.8 | GFS 0.25° raw 18.6 | -0.8 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 101 | GFS 0.25° raw 104 | 3 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.19 | GFS 0.25° raw 0.10 | 0.10 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.8 | GFS 0.25° raw 1020.7 | 0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 20.1 | stored grid 20.1 | -0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 17.8 | stored grid 17.7 | 0.2 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.75 | stored grid 1020.76 | -0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 20.1 | gfs_global 20.2 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 17.8 | gfs_global 15.5 | 2.3 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 101 | gfs_global 103 | 2 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.19 | gfs_global 0.00 | 0.19 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.8 | gfs_global 1021.1 | -0.3 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 20.1 | gfs_seamless 17.7 | 2.4 | ±1 | **FAIL** |
| Kansas City MO | +0 h | wind km/h | 17.8 | gfs_seamless 14.0 | 3.8 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 101 | gfs_seamless 93 | 8 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.19 | gfs_seamless 0.00 | 0.19 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.8 | gfs_seamless 1022.2 | -1.4 | ±1 | **FAIL** |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 10.0 | cams_global 9.4 | 0.6 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 20.1 | NWS 18.9 | 1.2 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 17.8 | NWS 9.3 | 8.6 | ±8 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | NWS 88 | 12 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.19 | NWS 0.04 | 0.15 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | GFS 0.25° raw 17.5 | 0.3 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 13.1 | GFS 0.25° raw 13.5 | -0.4 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 136 | GFS 0.25° raw 136 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 97 | GFS 0.25° raw 100 | -3 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1020.7 | GFS 0.25° raw 1020.8 | -0.1 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | stored grid 17.8 | 0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 13.1 | stored grid 13.2 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 97 | stored grid 97 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1020.68 | stored grid 1020.72 | -0.04 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | gfs_global 17.6 | 0.2 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.1 | gfs_global 12.0 | 1.1 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 136 | gfs_global 134 | 2 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 97 | gfs_global 100 | -3 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1020.7 | gfs_global 1020.7 | -0.0 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.8 | gfs_seamless 18.8 | -1.0 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.1 | gfs_seamless 6.6 | 6.5 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 136 | gfs_seamless 141 | 5 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 97 | gfs_seamless 100 | -3 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1020.7 | gfs_seamless 1021.9 | -1.2 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.2 | cams_global 8.3 | -3.1 | ±3 | **FAIL** |
| Kansas City MO | +24 h | temp °C | 17.8 | NWS 20.0 | -2.2 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 13.1 | NWS 7.4 | 5.7 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 97 | NWS 57 | 40 | ±30 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +114 h | temp °C | 9.1 | GFS 0.25° raw 9.3 | -0.1 | ±0.7 | ok |
| Kansas City MO | +114 h | wind km/h | 9.4 | GFS 0.25° raw 9.3 | 0.0 | ±3 | ok |
| Kansas City MO | +114 h | wind from ° | 70 | GFS 0.25° raw 72 | 1 | ±20 | ok |
| Kansas City MO | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +114 h | cloud % | 3 | GFS 0.25° raw 1 | 2 | ±15 | ok |
| Kansas City MO | +114 h | pressure hPa | 1014.9 | GFS 0.25° raw 1014.9 | 0.0 | ±0.5 | ok |
| Kansas City MO | +114 h | temp °C | 9.1 | stored grid 9.1 | 0.0 | ±0.15 | ok |
| Kansas City MO | +114 h | wind km/h | 9.4 | stored grid 9.4 | -0.0 | ±1 | ok |
| Kansas City MO | +114 h | cloud % | 3 | stored grid 3 | 0 | ±1 | ok |
| Kansas City MO | +114 h | pressure hPa | 1014.93 | stored grid 1014.93 | -0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.4 | GFS 0.25° raw 28.4 | -0.0 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 23.6 | GFS 0.25° raw 25.3 | -1.7 | ±3 | ok |
| Miami | +0 h | wind from ° | 84 | GFS 0.25° raw 85 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | GFS 0.25° raw 0.50 | -0.17 | ±0.3 | ok |
| Miami | +0 h | cloud % | 34 | GFS 0.25° raw 15 | 19 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1016.6 | GFS 0.25° raw 1016.7 | -0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 28.4 | stored grid 28.4 | -0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 23.6 | stored grid 23.6 | 0.0 | ±1 | ok |
| Miami | +0 h | cloud % | 34 | stored grid 34 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1016.62 | stored grid 1016.62 | 0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.4 | gfs_global 28.6 | -0.2 | ±1 | ok |
| Miami | +0 h | wind km/h | 23.6 | gfs_global 25.5 | -1.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 84 | gfs_global 81 | 3 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_global 0.20 | 0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 34 | gfs_global 20 | 14 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.6 | gfs_global 1017.1 | -0.5 | ±1 | ok |
| Miami | +0 h | temp °C | 28.4 | gfs_seamless 27.9 | 0.5 | ±1 | ok |
| Miami | +0 h | wind km/h | 23.6 | gfs_seamless 19.8 | 3.8 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 84 | gfs_seamless 71 | 13 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_seamless 0.00 | 0.33 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 34 | gfs_seamless 25 | 9 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.6 | gfs_seamless 1016.6 | 0.0 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 6.5 | cams_global 5.4 | 1.1 | ±3 | ok |
| Miami | +0 h | temp °C | 28.4 | NWS 27.8 | 0.6 | ±3 | ok |
| Miami | +0 h | wind km/h | 23.6 | NWS 25.9 | -2.3 | ±8 | ok |
| Miami | +0 h | cloud % | 34 | NWS 43 | -9 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.33 | NWS 0.13 | 0.20 | ±1 | ok |
| Miami | +24 h | temp °C | 27.4 | GFS 0.25° raw 27.8 | -0.4 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 27.2 | GFS 0.25° raw 29.3 | -2.1 | ±3 | ok |
| Miami | +24 h | wind from ° | 95 | GFS 0.25° raw 96 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.57 | GFS 0.25° raw 0.18 | 0.39 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.9 | GFS 0.25° raw 1017.0 | -0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 27.4 | stored grid 27.5 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 27.2 | stored grid 27.4 | -0.2 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.89 | stored grid 1016.92 | -0.03 | ±0.1 | ok |
| Miami | +24 h | temp °C | 27.4 | gfs_global 28.1 | -0.7 | ±1 | ok |
| Miami | +24 h | wind km/h | 27.2 | gfs_global 29.7 | -2.5 | ±3 | ok |
| Miami | +24 h | wind from ° | 95 | gfs_global 96 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.57 | gfs_global 0.10 | 0.47 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.9 | gfs_global 1017.4 | -0.5 | ±1 | ok |
| Miami | +24 h | temp °C | 27.4 | gfs_seamless 25.8 | 1.6 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 27.2 | gfs_seamless 22.7 | 4.5 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 95 | gfs_seamless 80 | 15 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.57 | gfs_seamless 0.00 | 0.57 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.9 | gfs_seamless 1019.4 | -2.5 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 7.7 | cams_global 7.9 | -0.2 | ±3 | ok |
| Miami | +24 h | temp °C | 27.4 | NWS 26.7 | 0.7 | ±3 | ok |
| Miami | +24 h | wind km/h | 27.2 | NWS 27.8 | -0.6 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 90 | 10 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.57 | NWS 1.61 | -1.04 | ±1 | **FAIL** |
| Miami | +114 h | temp °C | 24.7 | GFS 0.25° raw 25.4 | -0.6 | ±0.7 | ok |
| Miami | +114 h | wind km/h | 7.4 | GFS 0.25° raw 7.1 | 0.3 | ±3 | ok |
| Miami | +114 h | wind from ° | 300 | GFS 0.25° raw 302 | — | ±20 | calm |
| Miami | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +114 h | pressure hPa | 1010.4 | GFS 0.25° raw 1010.4 | 0.0 | ±0.5 | ok |
| Miami | +114 h | temp °C | 24.7 | stored grid 24.7 | -0.0 | ±0.15 | ok |
| Miami | +114 h | wind km/h | 7.4 | stored grid 7.4 | 0.0 | ±1 | ok |
| Miami | +114 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Miami | +114 h | pressure hPa | 1010.39 | stored grid 1010.41 | -0.01 | ±0.1 | ok |
| Denver | +0 h | temp °C | 14.7 | GFS 0.25° raw 14.4 | 0.2 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 10.1 | GFS 0.25° raw 10.1 | -0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 15 | GFS 0.25° raw 15 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 6 | GFS 0.25° raw 5 | 1 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1012.0 | GFS 0.25° raw 1012.3 | -0.3 | ±0.5 | ok |
| Denver | +0 h | temp °C | 14.7 | stored grid 14.7 | -0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 10.1 | stored grid 10.1 | 0.0 | ±1 | ok |
| Denver | +0 h | cloud % | 6 | stored grid 6 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1012.04 | stored grid 1012.07 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 14.7 | gfs_global 14.5 | 0.2 | ±1 | ok |
| Denver | +0 h | wind km/h | 10.1 | gfs_global 10.0 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 15 | gfs_global 15 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 6 | gfs_global 66 | -60 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1012.0 | gfs_global 1009.5 | 2.5 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 14.7 | gfs_seamless 10.4 | 4.3 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 10.1 | gfs_seamless 4.8 | 5.3 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 15 | gfs_seamless 342 | 33 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 6 | gfs_seamless 100 | -94 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1012.0 | gfs_seamless 1010.3 | 1.7 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 1.1 | cams_global 13.7 | -12.6 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 14.7 | NWS 13.3 | 1.3 | ±3 | ok |
| Denver | +0 h | wind km/h | 10.1 | NWS 7.4 | 2.7 | ±8 | ok |
| Denver | +0 h | cloud % | 6 | NWS 71 | -65 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 15.4 | GFS 0.25° raw 15.7 | -0.2 | ±0.7 | ok |
| Denver | +24 h | wind km/h | 6.1 | GFS 0.25° raw 7.0 | -0.9 | ±3 | ok |
| Denver | +24 h | wind from ° | 169 | GFS 0.25° raw 171 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1006.1 | GFS 0.25° raw 1006.0 | 0.1 | ±0.5 | ok |
| Denver | +24 h | temp °C | 15.4 | stored grid 15.4 | 0.1 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 6.1 | stored grid 6.6 | -0.4 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1006.07 | stored grid 1006.07 | -0.00 | ±0.1 | ok |
| Denver | +24 h | temp °C | 15.4 | gfs_global 15.7 | -0.3 | ±1 | ok |
| Denver | +24 h | wind km/h | 6.1 | gfs_global 5.9 | 0.2 | ±3 | ok |
| Denver | +24 h | wind from ° | 169 | gfs_global 166 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1006.1 | gfs_global 1004.2 | 1.9 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 15.4 | gfs_seamless 13.4 | 2.0 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 6.1 | gfs_seamless 4.1 | 2.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 169 | gfs_seamless 220 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1006.1 | gfs_seamless 1011.0 | -4.9 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.4 | cams_global 9.3 | -7.9 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 15.4 | NWS 13.9 | 1.6 | ±3 | ok |
| Denver | +24 h | wind km/h | 6.1 | NWS 3.7 | 2.4 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 95 | 5 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +114 h | temp °C | 5.0 | GFS 0.25° raw 6.2 | -1.2 | ±0.7 | **FAIL** |
| Denver | +114 h | wind km/h | 9.3 | GFS 0.25° raw 9.0 | 0.3 | ±3 | ok |
| Denver | +114 h | wind from ° | 44 | GFS 0.25° raw 45 | 1 | ±20 | ok |
| Denver | +114 h | precip mm/h | 0.02 | GFS 0.25° raw 0.00 | 0.02 | ±0.3 | ok |
| Denver | +114 h | cloud % | 71 | GFS 0.25° raw 83 | -12 | ±15 | ok |
| Denver | +114 h | pressure hPa | 1018.8 | GFS 0.25° raw 1018.7 | 0.1 | ±0.5 | ok |
| Denver | +114 h | temp °C | 5.0 | stored grid 5.0 | -0.0 | ±0.15 | ok |
| Denver | +114 h | wind km/h | 9.3 | stored grid 9.3 | 0.0 | ±1 | ok |
| Denver | +114 h | cloud % | 71 | stored grid 71 | 0 | ±1 | ok |
| Denver | +114 h | pressure hPa | 1018.80 | stored grid 1018.80 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 11.6 | GFS 0.25° raw 11.6 | -0.0 | ±0.7 | ok |
| London | +0 h | wind km/h | 9.0 | GFS 0.25° raw 7.6 | 1.4 | ±3 | ok |
| London | +0 h | wind from ° | 89 | GFS 0.25° raw 84 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 72 | GFS 0.25° raw 69 | 3 | ±15 | ok |
| London | +0 h | pressure hPa | 1031.7 | GFS 0.25° raw 1031.7 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.6 | stored grid 11.6 | 0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 9.0 | stored grid 8.8 | 0.1 | ±1 | ok |
| London | +0 h | cloud % | 72 | stored grid 72 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1031.65 | stored grid 1031.65 | 0.00 | ±0.1 | ok |
| London | +0 h | temp °C | 11.6 | gfs_global 11.8 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 9.0 | gfs_global 7.3 | 1.7 | ±3 | ok |
| London | +0 h | wind from ° | 89 | gfs_global 81 | 8 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 72 | gfs_global 88 | -16 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1031.7 | gfs_global 1031.7 | -0.0 | ±1 | ok |
| London | +0 h | temp °C | 11.6 | gfs_seamless 11.8 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 9.0 | gfs_seamless 7.3 | 1.7 | ±3 | ok |
| London | +0 h | wind from ° | 89 | gfs_seamless 81 | 8 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 72 | gfs_seamless 88 | -16 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1031.7 | gfs_seamless 1031.7 | -0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 15.9 | cams_global 21.9 | -6.0 | ±3 | **FAIL** |
| London | +24 h | temp °C | 11.2 | GFS 0.25° raw 11.3 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 11.6 | GFS 0.25° raw 11.2 | 0.4 | ±3 | ok |
| London | +24 h | wind from ° | 12 | GFS 0.25° raw 17 | 5 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | GFS 0.25° raw 1 | 9 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.4 | GFS 0.25° raw 1033.4 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 11.2 | stored grid 11.1 | 0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 11.6 | stored grid 11.6 | 0.0 | ±1 | ok |
| London | +24 h | cloud % | 10 | stored grid 10 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1033.38 | stored grid 1033.39 | -0.01 | ±0.1 | ok |
| London | +24 h | temp °C | 11.2 | gfs_global 11.5 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 11.6 | gfs_global 11.4 | 0.2 | ±3 | ok |
| London | +24 h | wind from ° | 12 | gfs_global 18 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | gfs_global 0 | 10 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.4 | gfs_global 1033.8 | -0.4 | ±1 | ok |
| London | +24 h | temp °C | 11.2 | gfs_seamless 11.5 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 11.6 | gfs_seamless 11.4 | 0.2 | ±3 | ok |
| London | +24 h | wind from ° | 12 | gfs_seamless 18 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 10 | gfs_seamless 0 | 10 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.4 | gfs_seamless 1033.8 | -0.4 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 25.3 | cams_global 29.9 | -4.6 | ±3 | **FAIL** |
| London | +114 h | temp °C | 10.7 | GFS 0.25° raw 10.7 | -0.0 | ±0.7 | ok |
| London | +114 h | wind km/h | 20.4 | GFS 0.25° raw 15.8 | 4.6 | ±3 | **FAIL** |
| London | +114 h | wind from ° | 78 | GFS 0.25° raw 75 | 3 | ±20 | ok |
| London | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +114 h | cloud % | 87 | GFS 0.25° raw 100 | -13 | ±15 | ok |
| London | +114 h | pressure hPa | 1030.1 | GFS 0.25° raw 1030.1 | 0.0 | ±0.5 | ok |
| London | +114 h | temp °C | 10.7 | stored grid 10.7 | -0.0 | ±0.15 | ok |
| London | +114 h | wind km/h | 20.4 | stored grid 20.4 | -0.0 | ±1 | ok |
| London | +114 h | cloud % | 87 | stored grid 87 | 0 | ±1 | ok |
| London | +114 h | pressure hPa | 1030.14 | stored grid 1030.12 | 0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 23.7 | GFS 0.25° raw 24.8 | -1.1 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 3.9 | GFS 0.25° raw 1.8 | 2.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 176 | GFS 0.25° raw 165 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | GFS 0.25° raw 1016.9 | 0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 23.7 | stored grid 23.7 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 3.9 | stored grid 4.0 | -0.1 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1016.96 | stored grid 1016.98 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 23.7 | gfs_global 25.8 | -2.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 3.9 | gfs_global 1.8 | 2.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 176 | gfs_global 79 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_global 1016.3 | 0.7 | ±1 | ok |
| Delhi | +0 h | temp °C | 23.7 | gfs_seamless 25.8 | -2.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 3.9 | gfs_seamless 1.8 | 2.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 176 | gfs_seamless 79 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_seamless 1016.3 | 0.7 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 58.9 | cams_global 101.5 | -42.6 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 24.5 | GFS 0.25° raw 25.7 | -1.2 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.9 | GFS 0.25° raw 6.5 | 0.4 | ±3 | ok |
| Delhi | +24 h | wind from ° | 179 | GFS 0.25° raw 178 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | GFS 0.25° raw 1015.0 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 24.5 | stored grid 24.5 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 6.9 | stored grid 6.7 | 0.3 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.04 | stored grid 1015.04 | -0.00 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 24.5 | gfs_global 26.6 | -2.1 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.9 | gfs_global 7.6 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 179 | gfs_global 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | gfs_global 1014.5 | 0.5 | ±1 | ok |
| Delhi | +24 h | temp °C | 24.5 | gfs_seamless 26.6 | -2.1 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.9 | gfs_seamless 7.6 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 179 | gfs_seamless 180 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | gfs_seamless 1014.5 | 0.5 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 57.6 | cams_global 99.7 | -42.1 | ±3 | **FAIL** |
| Delhi | +114 h | temp °C | 29.9 | GFS 0.25° raw 31.3 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +114 h | wind km/h | 7.1 | GFS 0.25° raw 6.6 | 0.5 | ±3 | ok |
| Delhi | +114 h | wind from ° | 312 | GFS 0.25° raw 316 | — | ±20 | calm |
| Delhi | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +114 h | pressure hPa | 1013.0 | GFS 0.25° raw 1013.0 | 0.0 | ±0.5 | ok |
| Delhi | +114 h | temp °C | 29.9 | stored grid 29.8 | 0.0 | ±0.15 | ok |
| Delhi | +114 h | wind km/h | 7.1 | stored grid 7.2 | -0.0 | ±1 | ok |
| Delhi | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +114 h | pressure hPa | 1013.01 | stored grid 1013.01 | 0.00 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 20.15 | 20.25 | -0.10 | 17.7 | 18.6 | -0.9 | 100 | 100 |
| Kansas City MO | +24 h | 17.78 | 17.52 | 0.26 | 13.2 | 13.5 | -0.3 | 97 | 100 |
| Kansas City MO | +114 h (f120) | 9.12 | 9.27 | -0.15 | 9.4 | 9.3 | 0.1 | 3 | 1 |
| Miami | +0 h | 28.42 | 28.43 | -0.01 | 23.6 | 25.3 | -1.7 | 34 | 15 |
| Miami | +24 h | 27.45 | 27.76 | -0.30 | 27.4 | 29.3 | -1.9 | 100 | 100 |
| Miami | +114 h (f120) | 24.73 | 25.36 | -0.63 | 7.4 | 7.1 | 0.3 | 0 | 0 |
| Denver | +0 h | 14.72 | 14.43 | 0.29 | 10.1 | 10.1 | -0.0 | 6 | 5 |
| Denver | +24 h | 15.39 | 15.68 | -0.29 | 6.6 | 7.0 | -0.5 | 100 | 100 |
| Denver | +114 h (f120) | 5.00 | 6.21 | -1.21 | 9.3 | 9.0 | 0.3 | 71 | 83 |
| London | +0 h | 11.56 | 11.62 | -0.06 | 8.8 | 7.6 | 1.3 | 72 | 69 |
| London | +24 h | 11.11 | 11.30 | -0.19 | 11.6 | 11.2 | 0.4 | 10 | 1 |
| London | +114 h (f120) | 10.72 | 10.71 | 0.01 | 20.4 | 15.8 | 4.6 | 87 | 100 |
| Delhi | +0 h | 23.71 | 24.84 | -1.13 | 4.0 | 1.8 | 2.2 | 0 | 0 |
| Delhi | +24 h | 24.52 | 25.71 | -1.20 | 6.7 | 6.5 | 0.1 | 0 | 0 |
| Delhi | +114 h (f120) | 29.81 | 31.34 | -1.53 | 7.2 | 6.6 | 0.5 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 16.00 | 15.95 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1016.50 | 1016.54 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 1.00 | 0.86 | 0.14 | ±1 | ok |
| Chile coast | +0 h | temp | 17.40 | 17.35 | 0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.00 | 1014.99 | 0.01 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 99.00 | 99.47 | -0.47 | ±1 | ok |
| Kansas City | +0 h | temp | 20.40 | 20.35 | 0.05 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.60 | 1020.63 | -0.03 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 16.20 | 16.25 | -0.05 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1013.90 | 1013.89 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 76.00 | 76.21 | -0.21 | ±1 | ok |
| Chile coast | +24 h | temp | 19.00 | 18.95 | 0.05 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1015.20 | 1015.18 | 0.02 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 16.00 | 15.83 | 0.17 | ±1 | ok |
| Kansas City | +24 h | temp | 19.00 | 18.95 | 0.05 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1020.40 | 1020.41 | -0.01 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 95.00 | 94.83 | 0.17 | ±1 | ok |
| Tokyo Bay | +114 h | temp | 15.60 | 15.59 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +114 h | pres | 1008.90 | 1008.92 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +114 h | cloud | 14.00 | 14.24 | -0.24 | ±1 | ok |
| Chile coast | +114 h | temp | 14.80 | 14.72 | 0.08 | ±0.5 | ok |
| Chile coast | +114 h | pres | 1016.60 | 1016.55 | 0.05 | ±0.5 | ok |
| Chile coast | +114 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +114 h | temp | 9.20 | 9.20 | -0.00 | ±0.5 | ok |
| Kansas City | +114 h | pres | 1014.70 | 1014.73 | -0.03 | ±0.5 | ok |
| Kansas City | +114 h | cloud | 3.00 | 3.35 | -0.35 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (1.3 h before this check), valid hour 2026-10-31T18:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 57.40 | 57.40 | 0.00 | ±0.2 | ok | 57.40 | 0.00 |
| node 52N 0E (London) | +0 h | 16.00 | 16.00 | 0.00 | ±0.2 | ok | 16.00 | 0.00 |
| node 40N 116E (Beijing) | +0 h | 109.00 | 109.00 | 0.00 | ±0.2 | ok | 109.00 | 0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":183,"2024 24-h mean":12,"2012 hourly":183,"2012 24-h mean":33}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 9.4 | 15.8 | 64 | 52 | 63 | 39 | 59 |
| Miami | 5.4 | 5.5 | 32 | 30 | 31 | 23 | 23 |
| Denver | 13.7 | 18.5 | 68 | 60 | 69 | 54 | 64 |
| London | 21.9 | 12.5 | 56 | 75 | 57 | 72 | 52 |
| Delhi | 101.5 | 58.7 | 151 | 183 | 153 | 175 | 153 |
| node 28N 76E (Delhi) | 57.4 | 30.8 | 90 | 152 | 91 | 152 | 90 |
| node 52N 0E (London) | 16.0 | 10.2 | 51 | 64 | 53 | 59 | 43 |
| node 40N 116E (Beijing) | 109.0 | 63.7 | 154 | 189 | 157 | 179 | 155 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 20 °Cat 2 m39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC | 18 km/hfrom E39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC | 0.2 mm/hpast hour · area avg39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC | 100 %area average39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC | 1021 hPasea level39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC | 10.0 µg/m³Moderate · AQI 44 (24 h)39.1°N 94.5°W · Sat 18:00 local · 18:00 UTC |
| Miami | 28 °Cat 2 m25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC | 24 km/hfrom E25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC | 0.3 mm/hpast hour · area avg25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC | 34 %area average25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC | 1017 hPasea level25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC | 6.5 µg/m³Good · AQI 43 (24 h)25.7°N 80.1°W · Sat 18:00 local · 18:00 UTC |
| Denver | 15 °Cat 2 m39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC | 10 km/hfrom NNE39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC | 6 %area average39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC | 1012 hPasea level39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC | 1.1 µg/m³Good · AQI 28 (24 h)39.7°N 104.9°W · Sat 18:00 local · 18:00 UTC |
| London | 12 °Cat 2 m51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC | 9 km/hfrom E51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC | 72 %area average51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC | 16 µg/m³Moderate · AQI 51 (24 h)51.5°N 0.1°W · Sat 18:00 local · 18:00 UTC |
| Delhi | 24 °Cat 2 m28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC | 4 km/hfrom S28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC | 0 %area average28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC | 1017 hPasea level28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC | 59 µg/m³Unhealthy · AQI 92 (24 h)28.6°N 77.2°E · Sat 18:00 local · 18:00 UTC |
