# Accuracy check (phase-5-events)

Generated 2026-10-31T20:15:30.284Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T12:00:00.000Z, timeline +0 h = 2026-10-31T20:00:00.000Z (f008); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 49 / 8 / 3
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 45 / 12 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 36 / 21 / 3
- Open-Meteo cams_global at the cities: 5 / 5 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 18.7 | GFS 0.25° raw 18.8 | -0.2 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 13.6 | GFS 0.25° raw 10.8 | 2.8 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 115 | GFS 0.25° raw 110 | 5 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | GFS 0.25° raw 0.57 | -0.12 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.3 | GFS 0.25° raw 1020.2 | 0.0 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 18.7 | stored grid 18.6 | 0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 13.6 | stored grid 13.7 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.25 | stored grid 1020.25 | 0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 18.7 | gfs_global 18.6 | 0.1 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 13.6 | gfs_global 12.0 | 1.6 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 115 | gfs_global 106 | 9 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | gfs_global 0.90 | -0.45 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.3 | gfs_global 1020.0 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 18.7 | gfs_seamless 18.4 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 13.6 | gfs_seamless 13.8 | -0.2 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 115 | gfs_seamless 101 | 14 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | gfs_seamless 0.00 | 0.45 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.3 | gfs_seamless 1020.9 | -0.6 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.1 | cams_global 9.6 | -0.5 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 18.7 | NWS 20.0 | -1.3 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 13.6 | NWS 11.1 | 2.5 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 90 | 10 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | NWS 0.04 | 0.40 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 19.0 | GFS 0.25° raw 19.0 | 0.0 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 13.3 | GFS 0.25° raw 12.9 | 0.4 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 158 | GFS 0.25° raw 155 | 3 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.01 | GFS 0.25° raw 0.01 | -0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 95 | GFS 0.25° raw 92 | 3 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1019.0 | GFS 0.25° raw 1019.0 | -0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 19.0 | stored grid 19.0 | 0.1 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 13.3 | stored grid 13.2 | 0.1 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 95 | stored grid 95 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1019.00 | stored grid 1019.01 | -0.00 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 19.0 | gfs_global 19.1 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.3 | gfs_global 10.8 | 2.5 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 158 | gfs_global 154 | 4 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.01 | gfs_global 0.00 | 0.01 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 95 | gfs_global 100 | -5 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1019.0 | gfs_global 1019.0 | 0.0 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 19.0 | gfs_seamless 18.6 | 0.4 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.3 | gfs_seamless 5.4 | 7.9 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 158 | gfs_seamless 178 | 20 | ±20 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.01 | gfs_seamless 0.00 | 0.01 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 95 | gfs_seamless 100 | -5 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1019.0 | gfs_seamless 1021.5 | -2.5 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 4.6 | cams_global 5.9 | -1.3 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 19.0 | NWS 21.1 | -2.1 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 13.3 | NWS 9.3 | 4.0 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 95 | NWS 37 | 58 | ±30 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.01 | NWS 0.00 | 0.01 | ±1 | ok |
| Kansas City MO | +112 h | temp °C | 9.1 | GFS 0.25° raw 9.3 | -0.1 | ±0.7 | ok |
| Kansas City MO | +112 h | wind km/h | 9.4 | GFS 0.25° raw 9.3 | 0.0 | ±3 | ok |
| Kansas City MO | +112 h | wind from ° | 70 | GFS 0.25° raw 72 | 1 | ±20 | ok |
| Kansas City MO | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +112 h | cloud % | 3 | GFS 0.25° raw 1 | 2 | ±15 | ok |
| Kansas City MO | +112 h | pressure hPa | 1014.9 | GFS 0.25° raw 1014.9 | 0.0 | ±0.5 | ok |
| Kansas City MO | +112 h | temp °C | 9.1 | stored grid 9.1 | 0.0 | ±0.15 | ok |
| Kansas City MO | +112 h | wind km/h | 9.4 | stored grid 9.4 | -0.0 | ±1 | ok |
| Kansas City MO | +112 h | cloud % | 3 | stored grid 3 | 0 | ±1 | ok |
| Kansas City MO | +112 h | pressure hPa | 1014.93 | stored grid 1014.93 | -0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.2 | GFS 0.25° raw 28.2 | 0.0 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 22.6 | GFS 0.25° raw 24.1 | -1.4 | ±3 | ok |
| Miami | +0 h | wind from ° | 81 | GFS 0.25° raw 86 | 5 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.39 | GFS 0.25° raw 0.27 | 0.12 | ±0.3 | ok |
| Miami | +0 h | cloud % | 42 | GFS 0.25° raw 43 | -1 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.0 | GFS 0.25° raw 1016.1 | -0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 28.2 | stored grid 28.1 | 0.1 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 22.6 | stored grid 22.9 | -0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 42 | stored grid 42 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1016.01 | stored grid 1016.00 | 0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.2 | gfs_global 28.3 | -0.1 | ±1 | ok |
| Miami | +0 h | wind km/h | 22.6 | gfs_global 23.5 | -0.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 81 | gfs_global 85 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.39 | gfs_global 0.30 | 0.09 | ±0.3 | ok |
| Miami | +0 h | cloud % | 42 | gfs_global 32 | 10 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.0 | gfs_global 1016.1 | -0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 28.2 | gfs_seamless 28.1 | 0.1 | ±1 | ok |
| Miami | +0 h | wind km/h | 22.6 | gfs_seamless 16.9 | 5.7 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 81 | gfs_seamless 77 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.39 | gfs_seamless 0.00 | 0.39 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 42 | gfs_seamless 53 | -11 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.0 | gfs_seamless 1016.6 | -0.6 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 7.0 | cams_global 5.9 | 1.1 | ±3 | ok |
| Miami | +0 h | temp °C | 28.2 | NWS 28.3 | -0.1 | ±3 | ok |
| Miami | +0 h | wind km/h | 22.6 | NWS 25.9 | -3.3 | ±8 | ok |
| Miami | +0 h | cloud % | 42 | NWS 60 | -18 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.39 | NWS 0.13 | 0.27 | ±1 | ok |
| Miami | +24 h | temp °C | 27.5 | GFS 0.25° raw 27.7 | -0.2 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 29.4 | GFS 0.25° raw 33.7 | -4.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 97 | GFS 0.25° raw 98 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.35 | GFS 0.25° raw 0.00 | 0.35 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.6 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 27.5 | stored grid 27.5 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 29.4 | stored grid 29.5 | -0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1015.62 | stored grid 1015.65 | -0.03 | ±0.1 | ok |
| Miami | +24 h | temp °C | 27.5 | gfs_global 27.8 | -0.3 | ±1 | ok |
| Miami | +24 h | wind km/h | 29.4 | gfs_global 34.8 | -5.4 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 97 | gfs_global 97 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.35 | gfs_global 0.00 | 0.35 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.6 | gfs_global 1015.6 | 0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 27.5 | gfs_seamless 23.8 | 3.7 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 29.4 | gfs_seamless 21.5 | 7.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 97 | gfs_seamless 83 | 14 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.35 | gfs_seamless 0.00 | 0.35 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.6 | gfs_seamless 1018.4 | -2.8 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 6.3 | cams_global 8.9 | -2.6 | ±3 | ok |
| Miami | +24 h | temp °C | 27.5 | NWS 26.7 | 0.8 | ±3 | ok |
| Miami | +24 h | wind km/h | 29.4 | NWS 29.6 | -0.2 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 82 | 18 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.35 | NWS 1.61 | -1.26 | ±1 | **FAIL** |
| Miami | +112 h | temp °C | 24.7 | GFS 0.25° raw 25.4 | -0.6 | ±0.7 | ok |
| Miami | +112 h | wind km/h | 7.4 | GFS 0.25° raw 7.1 | 0.3 | ±3 | ok |
| Miami | +112 h | wind from ° | 300 | GFS 0.25° raw 302 | — | ±20 | calm |
| Miami | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +112 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +112 h | pressure hPa | 1010.4 | GFS 0.25° raw 1010.4 | 0.0 | ±0.5 | ok |
| Miami | +112 h | temp °C | 24.7 | stored grid 24.7 | -0.0 | ±0.15 | ok |
| Miami | +112 h | wind km/h | 7.4 | stored grid 7.4 | 0.0 | ±1 | ok |
| Miami | +112 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Miami | +112 h | pressure hPa | 1010.39 | stored grid 1010.41 | -0.01 | ±0.1 | ok |
| Denver | +0 h | temp °C | 16.8 | GFS 0.25° raw 16.7 | 0.0 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 12.1 | GFS 0.25° raw 12.4 | -0.3 | ±3 | ok |
| Denver | +0 h | wind from ° | 12 | GFS 0.25° raw 11 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 22 | GFS 0.25° raw 10 | 12 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.3 | GFS 0.25° raw 1011.3 | -0.0 | ±0.5 | ok |
| Denver | +0 h | temp °C | 16.8 | stored grid 16.7 | 0.1 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 12.1 | stored grid 12.2 | -0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 22 | stored grid 22 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1011.26 | stored grid 1011.24 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 16.8 | gfs_global 17.0 | -0.2 | ±1 | ok |
| Denver | +0 h | wind km/h | 12.1 | gfs_global 12.1 | -0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 12 | gfs_global 12 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 22 | gfs_global 60 | -38 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.3 | gfs_global 1008.5 | 2.8 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 16.8 | gfs_seamless 14.9 | 1.9 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 12.1 | gfs_seamless 2.6 | 9.5 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 12 | gfs_seamless 322 | 50 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 22 | gfs_seamless 15 | 7 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.3 | gfs_seamless 1010.9 | 0.4 | ±1 | ok |
| Denver | +0 h | PM2.5 µg/m³ | 1.7 | cams_global 11.4 | -9.7 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 16.8 | NWS 15.6 | 1.2 | ±3 | ok |
| Denver | +0 h | wind km/h | 12.1 | NWS 9.3 | 2.8 | ±8 | ok |
| Denver | +0 h | cloud % | 22 | NWS 32 | -10 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 15.8 | GFS 0.25° raw 17.6 | -1.8 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 17.4 | GFS 0.25° raw 17.5 | -0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 158 | GFS 0.25° raw 161 | 3 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1002.8 | GFS 0.25° raw 1001.7 | 1.2 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 15.8 | stored grid 15.8 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 17.4 | stored grid 17.3 | 0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1002.85 | stored grid 1002.83 | 0.02 | ±0.1 | ok |
| Denver | +24 h | temp °C | 15.8 | gfs_global 18.0 | -2.2 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 17.4 | gfs_global 16.6 | 0.8 | ±3 | ok |
| Denver | +24 h | wind from ° | 158 | gfs_global 156 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1002.8 | gfs_global 1000.1 | 2.7 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 15.8 | gfs_seamless 18.6 | -2.8 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 17.4 | gfs_seamless 12.4 | 5.0 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 158 | gfs_seamless 165 | 7 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1002.8 | gfs_seamless 1007.3 | -4.5 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.3 | cams_global 4.2 | -2.9 | ±3 | ok |
| Denver | +24 h | temp °C | 15.8 | NWS 16.1 | -0.3 | ±3 | ok |
| Denver | +24 h | wind km/h | 17.4 | NWS 11.1 | 6.3 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 66 | 34 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +112 h | temp °C | 5.0 | GFS 0.25° raw 6.2 | -1.2 | ±0.7 | **FAIL** |
| Denver | +112 h | wind km/h | 9.3 | GFS 0.25° raw 9.0 | 0.3 | ±3 | ok |
| Denver | +112 h | wind from ° | 44 | GFS 0.25° raw 45 | 1 | ±20 | ok |
| Denver | +112 h | precip mm/h | 0.02 | GFS 0.25° raw 0.00 | 0.02 | ±0.3 | ok |
| Denver | +112 h | cloud % | 71 | GFS 0.25° raw 83 | -12 | ±15 | ok |
| Denver | +112 h | pressure hPa | 1018.8 | GFS 0.25° raw 1018.7 | 0.1 | ±0.5 | ok |
| Denver | +112 h | temp °C | 5.0 | stored grid 5.0 | -0.0 | ±0.15 | ok |
| Denver | +112 h | wind km/h | 9.3 | stored grid 9.3 | 0.0 | ±1 | ok |
| Denver | +112 h | cloud % | 71 | stored grid 71 | 0 | ±1 | ok |
| Denver | +112 h | pressure hPa | 1018.80 | stored grid 1018.80 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.9 | GFS 0.25° raw 11.0 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 7.5 | GFS 0.25° raw 5.3 | 2.2 | ±3 | ok |
| London | +0 h | wind from ° | 84 | GFS 0.25° raw 75 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 69 | GFS 0.25° raw 79 | -10 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | GFS 0.25° raw 1032.1 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 10.9 | stored grid 10.8 | 0.1 | ±0.15 | ok |
| London | +0 h | wind km/h | 7.5 | stored grid 7.3 | 0.2 | ±1 | ok |
| London | +0 h | cloud % | 69 | stored grid 69 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.11 | stored grid 1032.09 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.9 | gfs_global 11.1 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 7.5 | gfs_global 4.9 | 2.6 | ±3 | ok |
| London | +0 h | wind from ° | 84 | gfs_global 73 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 69 | gfs_global 72 | -3 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | gfs_global 1032.1 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 10.9 | gfs_seamless 11.1 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 7.5 | gfs_seamless 4.9 | 2.6 | ±3 | ok |
| London | +0 h | wind from ° | 84 | gfs_seamless 73 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 69 | gfs_seamless 72 | -3 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | gfs_seamless 1032.1 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 17.6 | cams_global 23.5 | -5.9 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.7 | GFS 0.25° raw 11.0 | -0.2 | ±0.7 | ok |
| London | +24 h | wind km/h | 13.9 | GFS 0.25° raw 10.2 | 3.7 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 5 | GFS 0.25° raw 11 | 7 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | GFS 0.25° raw 97 | -22 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.0 | GFS 0.25° raw 1034.0 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.7 | stored grid 10.8 | -0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 13.9 | stored grid 13.9 | -0.0 | ±1 | ok |
| London | +24 h | cloud % | 75 | stored grid 75 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1033.99 | stored grid 1033.99 | 0.00 | ±0.1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_global 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 13.9 | gfs_global 10.0 | 3.9 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 5 | gfs_global 15 | 10 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_global 32 | 43 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.0 | gfs_global 1034.0 | -0.0 | ±1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_seamless 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 13.9 | gfs_seamless 10.0 | 3.9 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 5 | gfs_seamless 15 | 10 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_seamless 32 | 43 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.0 | gfs_seamless 1034.0 | -0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 22.8 | cams_global 28.1 | -5.3 | ±3 | **FAIL** |
| London | +112 h | temp °C | 10.7 | GFS 0.25° raw 10.7 | -0.0 | ±0.7 | ok |
| London | +112 h | wind km/h | 20.4 | GFS 0.25° raw 15.8 | 4.6 | ±3 | **FAIL** |
| London | +112 h | wind from ° | 78 | GFS 0.25° raw 75 | 3 | ±20 | ok |
| London | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +112 h | cloud % | 87 | GFS 0.25° raw 100 | -13 | ±15 | ok |
| London | +112 h | pressure hPa | 1030.1 | GFS 0.25° raw 1030.1 | 0.0 | ±0.5 | ok |
| London | +112 h | temp °C | 10.7 | stored grid 10.7 | -0.0 | ±0.15 | ok |
| London | +112 h | wind km/h | 20.4 | stored grid 20.4 | -0.0 | ±1 | ok |
| London | +112 h | cloud % | 87 | stored grid 87 | 0 | ±1 | ok |
| London | +112 h | pressure hPa | 1030.14 | stored grid 1030.12 | 0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.8 | GFS 0.25° raw 24.1 | -1.3 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | GFS 0.25° raw 3.5 | 2.7 | ±3 | ok |
| Delhi | +0 h | wind from ° | 207 | GFS 0.25° raw 208 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | GFS 0.25° raw 1016.2 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 22.8 | stored grid 22.8 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 6.2 | stored grid 5.9 | 0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1016.27 | stored grid 1016.28 | -0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.8 | gfs_global 25.3 | -2.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | gfs_global 2.5 | 3.7 | ±3 | **FAIL** |
| Delhi | +0 h | wind from ° | 207 | gfs_global 180 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | gfs_global 1016.2 | 0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 22.8 | gfs_seamless 25.3 | -2.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.2 | gfs_seamless 2.5 | 3.7 | ±3 | **FAIL** |
| Delhi | +0 h | wind from ° | 207 | gfs_seamless 180 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.3 | gfs_seamless 1016.2 | 0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 63.5 | cams_global 85.4 | -21.9 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 23.7 | GFS 0.25° raw 25.1 | -1.4 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 5.2 | GFS 0.25° raw 5.4 | -0.2 | ±3 | ok |
| Delhi | +24 h | wind from ° | 194 | GFS 0.25° raw 194 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.8 | GFS 0.25° raw 1014.6 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 23.7 | stored grid 23.6 | 0.1 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 5.2 | stored grid 5.3 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1014.76 | stored grid 1014.76 | 0.00 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 23.7 | gfs_global 26.0 | -2.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 5.2 | gfs_global 5.2 | 0.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 194 | gfs_global 192 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.8 | gfs_global 1014.5 | 0.3 | ±1 | ok |
| Delhi | +24 h | temp °C | 23.7 | gfs_seamless 26.0 | -2.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 5.2 | gfs_seamless 5.2 | 0.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 194 | gfs_seamless 192 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.8 | gfs_seamless 1014.5 | 0.3 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 59.5 | cams_global 101.0 | -41.5 | ±3 | **FAIL** |
| Delhi | +112 h | temp °C | 29.9 | GFS 0.25° raw 31.3 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +112 h | wind km/h | 7.1 | GFS 0.25° raw 6.6 | 0.5 | ±3 | ok |
| Delhi | +112 h | wind from ° | 312 | GFS 0.25° raw 316 | — | ±20 | calm |
| Delhi | +112 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +112 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +112 h | pressure hPa | 1013.0 | GFS 0.25° raw 1013.0 | 0.0 | ±0.5 | ok |
| Delhi | +112 h | temp °C | 29.9 | stored grid 29.8 | 0.0 | ±0.15 | ok |
| Delhi | +112 h | wind km/h | 7.1 | stored grid 7.2 | -0.0 | ±1 | ok |
| Delhi | +112 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +112 h | pressure hPa | 1013.01 | stored grid 1013.01 | 0.00 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 18.61 | 18.81 | -0.19 | 13.7 | 10.8 | 2.9 | 100 | 100 |
| Kansas City MO | +24 h | 18.99 | 19.04 | -0.05 | 13.2 | 12.9 | 0.2 | 95 | 92 |
| Kansas City MO | +112 h (f120) | 9.12 | 9.27 | -0.15 | 9.4 | 9.3 | 0.1 | 3 | 1 |
| Miami | +0 h | 28.14 | 28.19 | -0.05 | 22.9 | 24.1 | -1.2 | 42 | 43 |
| Miami | +24 h | 27.49 | 27.66 | -0.16 | 29.5 | 33.7 | -4.2 | 100 | 100 |
| Miami | +112 h (f120) | 24.73 | 25.36 | -0.63 | 7.4 | 7.1 | 0.3 | 0 | 0 |
| Denver | +0 h | 16.70 | 16.71 | -0.01 | 12.2 | 12.4 | -0.2 | 22 | 10 |
| Denver | +24 h | 15.84 | 17.61 | -1.77 | 17.3 | 17.5 | -0.2 | 100 | 100 |
| Denver | +112 h (f120) | 5.00 | 6.21 | -1.21 | 9.3 | 9.0 | 0.3 | 71 | 83 |
| London | +0 h | 10.85 | 10.96 | -0.11 | 7.3 | 5.3 | 2.1 | 69 | 79 |
| London | +24 h | 10.75 | 10.96 | -0.21 | 13.9 | 10.2 | 3.7 | 75 | 97 |
| London | +112 h (f120) | 10.72 | 10.71 | 0.01 | 20.4 | 15.8 | 4.6 | 87 | 100 |
| Delhi | +0 h | 22.77 | 24.05 | -1.28 | 5.9 | 3.5 | 2.4 | 0 | 0 |
| Delhi | +24 h | 23.62 | 25.09 | -1.46 | 5.3 | 5.4 | -0.1 | 0 | 0 |
| Delhi | +112 h (f120) | 29.81 | 31.34 | -1.53 | 7.2 | 6.6 | 0.5 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 15.60 | 15.54 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1017.60 | 1017.55 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 1.00 | 0.63 | 0.38 | ±1 | ok |
| Chile coast | +0 h | temp | 16.80 | 16.84 | -0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1014.80 | 1014.77 | 0.03 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 94.00 | 93.71 | 0.29 | ±1 | ok |
| Kansas City | +0 h | temp | 17.00 | 17.05 | -0.05 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.50 | 1020.46 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 15.80 | 15.83 | -0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1013.30 | 1013.27 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 49.00 | 48.63 | 0.38 | ±1 | ok |
| Chile coast | +24 h | temp | 18.20 | 18.23 | -0.03 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.80 | 1014.77 | 0.03 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 41.00 | 40.55 | 0.45 | ±1 | ok |
| Kansas City | +24 h | temp | 19.20 | 19.23 | -0.03 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1018.80 | 1018.79 | 0.01 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 95.00 | 95.13 | -0.13 | ±1 | ok |
| Tokyo Bay | +112 h | temp | 15.60 | 15.59 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +112 h | pres | 1008.90 | 1008.92 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +112 h | cloud | 14.00 | 14.24 | -0.24 | ±1 | ok |
| Chile coast | +112 h | temp | 14.80 | 14.72 | 0.08 | ±0.5 | ok |
| Chile coast | +112 h | pres | 1016.60 | 1016.55 | 0.05 | ±0.5 | ok |
| Chile coast | +112 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +112 h | temp | 9.20 | 9.20 | -0.00 | ±0.5 | ok |
| Kansas City | +112 h | pres | 1014.70 | 1014.73 | -0.03 | ±0.5 | ok |
| Kansas City | +112 h | cloud | 3.00 | 3.35 | -0.35 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (3.0 h before this check), valid hour 2026-10-31T20:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 63.60 | 63.60 | -0.00 | ±0.2 | ok | 63.60 | -0.00 |
| node 52N 0E (London) | +0 h | 17.60 | 17.60 | 0.00 | ±0.2 | ok | 17.60 | 0.00 |
| node 40N 116E (Beijing) | +0 h | 93.10 | 93.10 | -0.00 | ±0.2 | ok | 93.10 | -0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":160,"2024 24-h mean":14,"2012 hourly":165,"2012 24-h mean":30}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 9.6 | 15.1 | 62 | 52 | 62 | 40 | 57 |
| Miami | 5.9 | 5.5 | 33 | 33 | 30 | 25 | 23 |
| Denver | 11.4 | 18.2 | 68 | 55 | 68 | 48 | 64 |
| London | 23.5 | 13.8 | 58 | 78 | 60 | 75 | 55 |
| Delhi | 85.4 | 61.5 | 153 | 172 | 155 | 166 | 154 |
| node 28N 76E (Delhi) | 63.6 | 32.1 | 92 | 157 | 94 | 155 | 93 |
| node 52N 0E (London) | 17.6 | 11.4 | 53 | 67 | 55 | 63 | 47 |
| node 40N 116E (Beijing) | 93.1 | 69.4 | 158 | 177 | 161 | 170 | 158 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 19 °Cat 2 m39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC | 14 km/hfrom ESE39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC | 0.4 mm/hpast hour · area avg39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC | 100 %area average39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC | 1020 hPasea level39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC | 9.1 µg/m³Moderate · AQI 46 (24 h)39.1°N 94.5°W · Sat 20:00 local · 20:00 UTC |
| Miami | 28 °Cat 2 m25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC | 23 km/hfrom E25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC | 0.4 mm/hpast hour · area avg25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC | 42 %area average25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC | 1016 hPasea level25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC | 7.0 µg/m³Good · AQI 44 (24 h)25.7°N 80.1°W · Sat 20:00 local · 20:00 UTC |
| Denver | 17 °Cat 2 m39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC | 12 km/hfrom NNE39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC | 22 %area average39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC | 1011 hPasea level39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC | 1.7 µg/m³Good · AQI 30 (24 h)39.7°N 104.9°W · Sat 20:00 local · 20:00 UTC |
| London | 11 °Cat 2 m51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC | 7 km/hfrom E51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC | 69 %area average51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC | 18 µg/m³Moderate · AQI 53 (24 h)51.5°N 0.1°W · Sat 20:00 local · 20:00 UTC |
| Delhi | 23 °Cat 2 m28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC | 6 km/hfrom SSW28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC | 0 %area average28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC | 64 µg/m³Unhealthy · AQI 94 (24 h)28.6°N 77.2°E · Sat 20:00 local · 20:00 UTC |
