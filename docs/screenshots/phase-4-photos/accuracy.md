# Accuracy check (phase-4-photos)

Generated 2026-11-01T03:48:19.221Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T18:00:00.000Z, timeline +0 h = 2026-11-01T04:00:00.000Z (f010); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 49 / 7 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 47 / 9 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 41 / 16 / 3
- Open-Meteo cams_global at the cities: 2 / 8 / 0
- NWS gridpoints (sanity check): 22 / 2 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 16.2 | GFS 0.25° raw 16.2 | -0.0 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 11.4 | GFS 0.25° raw 13.7 | -2.3 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 117 | GFS 0.25° raw 110 | 6 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.02 | GFS 0.25° raw 0.00 | 0.02 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | GFS 0.25° raw 1021.3 | 0.0 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 16.2 | stored grid 16.2 | -0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 11.4 | stored grid 11.8 | -0.3 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 99 | stored grid 99 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.35 | stored grid 1021.38 | -0.02 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 16.2 | gfs_global 16.8 | -0.6 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 11.4 | gfs_global 11.3 | 0.1 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 117 | gfs_global 112 | 5 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.02 | gfs_global 0.00 | 0.02 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | gfs_global 1021.6 | -0.2 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 16.2 | gfs_seamless 15.6 | 0.6 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 11.4 | gfs_seamless 5.0 | 6.4 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 117 | gfs_seamless 92 | 25 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.02 | gfs_seamless 0.00 | 0.02 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | gfs_seamless 1021.6 | -0.2 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 8.3 | cams_global 11.7 | -3.4 | ±3 | **FAIL** |
| Kansas City MO | +0 h | temp °C | 16.2 | NWS 16.7 | -0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 11.4 | NWS 7.4 | 4.0 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 99 | NWS 95 | 4 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.02 | NWS 0.08 | -0.07 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.5 | GFS 0.25° raw 17.6 | -0.1 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 17.0 | GFS 0.25° raw 17.0 | -0.0 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 144 | GFS 0.25° raw 146 | 2 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1016.9 | GFS 0.25° raw 1017.0 | -0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 17.5 | stored grid 17.4 | 0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 17.0 | stored grid 16.7 | 0.2 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1016.94 | stored grid 1016.93 | 0.01 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 17.5 | gfs_global 17.9 | -0.4 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 17.0 | gfs_global 15.0 | 2.0 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 144 | gfs_global 145 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1016.9 | gfs_global 1017.2 | -0.3 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.5 | gfs_seamless 16.5 | 1.0 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 17.0 | gfs_seamless 10.7 | 6.3 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 144 | gfs_seamless 142 | 2 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1016.9 | gfs_seamless 1017.9 | -1.0 | ±1 | ok |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.0 | cams_global 4.8 | 0.2 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 17.5 | NWS 16.7 | 0.8 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 17.0 | NWS 11.1 | 5.9 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 100 | NWS 86 | 14 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +110 h | temp °C | 9.8 | GFS 0.25° raw 9.8 | 0.1 | ±0.7 | ok |
| Kansas City MO | +110 h | wind km/h | 14.0 | GFS 0.25° raw 14.7 | -0.8 | ±3 | ok |
| Kansas City MO | +110 h | wind from ° | 339 | GFS 0.25° raw 336 | 3 | ±20 | ok |
| Kansas City MO | +110 h | precip mm/h | 1.18 | GFS 0.25° raw 0.80 | 0.38 | ±0.3 | **FAIL** |
| Kansas City MO | +110 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +110 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.8 | -0.0 | ±0.5 | ok |
| Kansas City MO | +110 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| Kansas City MO | +110 h | wind km/h | 14.0 | stored grid 14.1 | -0.1 | ±1 | ok |
| Kansas City MO | +110 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +110 h | pressure hPa | 1011.75 | stored grid 1011.76 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.6 | GFS 0.25° raw 26.9 | -0.3 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 28.6 | GFS 0.25° raw 31.8 | -3.2 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 86 | GFS 0.25° raw 89 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.90 | GFS 0.25° raw 2.04 | -1.14 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 88 | GFS 0.25° raw 100 | -12 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.9 | GFS 0.25° raw 1017.8 | 0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.6 | stored grid 26.6 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 28.6 | stored grid 28.7 | -0.1 | ±1 | ok |
| Miami | +0 h | cloud % | 88 | stored grid 88 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1017.93 | stored grid 1017.92 | 0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.6 | gfs_global 27.1 | -0.5 | ±1 | ok |
| Miami | +0 h | wind km/h | 28.6 | gfs_global 32.0 | -3.4 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 86 | gfs_global 89 | 3 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.90 | gfs_global 1.60 | -0.70 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 88 | gfs_global 100 | -12 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.9 | gfs_global 1017.8 | 0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 26.6 | gfs_seamless 25.2 | 1.4 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 28.6 | gfs_seamless 15.9 | 12.7 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 86 | gfs_seamless 96 | 10 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.90 | gfs_seamless 0.00 | 0.90 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 88 | gfs_seamless 100 | -12 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.9 | gfs_seamless 1017.6 | 0.3 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 8.7 | cams_global 4.3 | 4.4 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 26.6 | NWS 27.2 | -0.6 | ±3 | ok |
| Miami | +0 h | wind km/h | 28.6 | NWS 27.8 | 0.8 | ±8 | ok |
| Miami | +0 h | cloud % | 88 | NWS 73 | 15 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.90 | NWS 0.21 | 0.69 | ±1 | ok |
| Miami | +24 h | temp °C | 25.7 | GFS 0.25° raw 26.2 | -0.6 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 28.9 | GFS 0.25° raw 30.9 | -2.0 | ±3 | ok |
| Miami | +24 h | wind from ° | 100 | GFS 0.25° raw 99 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.21 | GFS 0.25° raw 2.62 | -0.41 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | GFS 0.25° raw 1016.1 | 0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 25.7 | stored grid 25.7 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 28.9 | stored grid 28.8 | 0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.18 | stored grid 1016.18 | 0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 25.7 | gfs_global 26.2 | -0.5 | ±1 | ok |
| Miami | +24 h | wind km/h | 28.9 | gfs_global 30.4 | -1.5 | ±3 | ok |
| Miami | +24 h | wind from ° | 100 | gfs_global 95 | 5 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.21 | gfs_global 2.30 | -0.09 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_global 1016.1 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 25.7 | gfs_seamless 24.8 | 0.9 | ±1 | ok |
| Miami | +24 h | wind km/h | 28.9 | gfs_seamless 9.3 | 19.6 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 100 | gfs_seamless 87 | 13 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.21 | gfs_seamless 0.00 | 2.21 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_seamless 1019.4 | -3.2 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 6.3 | cams_global 5.5 | 0.8 | ±3 | ok |
| Miami | +24 h | temp °C | 25.7 | NWS 26.1 | -0.5 | ±3 | ok |
| Miami | +24 h | wind km/h | 28.9 | NWS 25.9 | 3.0 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 63 | 37 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.21 | NWS 0.68 | 1.53 | ±1 | **FAIL** |
| Miami | +110 h | temp °C | 28.0 | GFS 0.25° raw 28.9 | -0.9 | ±0.7 | **FAIL** |
| Miami | +110 h | wind km/h | 15.6 | GFS 0.25° raw 14.1 | 1.5 | ±3 | ok |
| Miami | +110 h | wind from ° | 312 | GFS 0.25° raw 310 | 3 | ±20 | ok |
| Miami | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +110 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +110 h | pressure hPa | 1008.2 | GFS 0.25° raw 1008.1 | 0.1 | ±0.5 | ok |
| Miami | +110 h | temp °C | 28.0 | stored grid 27.9 | 0.0 | ±0.15 | ok |
| Miami | +110 h | wind km/h | 15.6 | stored grid 15.5 | 0.1 | ±1 | ok |
| Miami | +110 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Miami | +110 h | pressure hPa | 1008.22 | stored grid 1008.24 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.8 | GFS 0.25° raw 12.8 | -4.1 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 4.3 | GFS 0.25° raw 4.5 | -0.2 | ±3 | ok |
| Denver | +0 h | wind from ° | 175 | GFS 0.25° raw 181 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 62 | GFS 0.25° raw 48 | 14 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1016.2 | GFS 0.25° raw 1015.3 | 0.9 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 8.8 | stored grid 8.7 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 4.3 | stored grid 4.3 | 0.0 | ±1 | ok |
| Denver | +0 h | cloud % | 62 | stored grid 62 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1016.23 | stored grid 1016.23 | -0.00 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.8 | gfs_global 13.5 | -4.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 4.3 | gfs_global 3.6 | 0.7 | ±3 | ok |
| Denver | +0 h | wind from ° | 175 | gfs_global 174 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 62 | gfs_global 11 | 51 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1016.2 | gfs_global 1015.0 | 1.2 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 8.8 | gfs_seamless 10.0 | -1.2 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 4.3 | gfs_seamless 7.2 | -2.9 | ±3 | ok |
| Denver | +0 h | wind from ° | 175 | gfs_seamless 158 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 62 | gfs_seamless 58 | 4 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1016.2 | gfs_seamless 1013.6 | 2.6 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 1.1 | cams_global 30.0 | -28.9 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 8.8 | NWS 11.7 | -2.9 | ±3 | ok |
| Denver | +0 h | wind km/h | 4.3 | NWS 3.7 | 0.6 | ±8 | ok |
| Denver | +0 h | cloud % | 62 | NWS 43 | 19 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 11.5 | GFS 0.25° raw 13.4 | -1.9 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 5.4 | GFS 0.25° raw 4.2 | 1.2 | ±3 | ok |
| Denver | +24 h | wind from ° | 42 | GFS 0.25° raw 47 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 998.8 | GFS 0.25° raw 998.8 | 0.0 | ±0.5 | ok |
| Denver | +24 h | temp °C | 11.5 | stored grid 11.6 | -0.1 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 5.4 | stored grid 5.3 | 0.1 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 998.78 | stored grid 998.80 | -0.02 | ±0.1 | ok |
| Denver | +24 h | temp °C | 11.5 | gfs_global 13.6 | -2.1 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 5.4 | gfs_global 5.4 | -0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 42 | gfs_global 53 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | -0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 998.8 | gfs_global 997.0 | 1.8 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 11.5 | gfs_seamless 12.3 | -0.8 | ±1 | ok |
| Denver | +24 h | wind km/h | 5.4 | gfs_seamless 8.7 | -3.3 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 42 | gfs_seamless 168 | 126 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | -0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 998.8 | gfs_seamless 996.9 | 1.9 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.9 | cams_global 7.7 | -5.8 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 11.5 | NWS 11.7 | -0.1 | ±3 | ok |
| Denver | +24 h | wind km/h | 5.4 | NWS 5.6 | -0.2 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 92 | 8 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +110 h | temp °C | 10.6 | GFS 0.25° raw 11.2 | -0.6 | ±0.7 | ok |
| Denver | +110 h | wind km/h | 2.8 | GFS 0.25° raw 2.7 | 0.1 | ±3 | ok |
| Denver | +110 h | wind from ° | 116 | GFS 0.25° raw 113 | — | ±20 | calm |
| Denver | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +110 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Denver | +110 h | pressure hPa | 1015.5 | GFS 0.25° raw 1015.7 | -0.2 | ±0.5 | ok |
| Denver | +110 h | temp °C | 10.6 | stored grid 10.5 | 0.1 | ±0.15 | ok |
| Denver | +110 h | wind km/h | 2.8 | stored grid 2.9 | -0.1 | ±1 | ok |
| Denver | +110 h | cloud % | 1 | stored grid 0 | 0 | ±1 | ok |
| Denver | +110 h | pressure hPa | 1015.50 | stored grid 1015.51 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.0 | GFS 0.25° raw 9.2 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 6.3 | GFS 0.25° raw 4.8 | 1.4 | ±3 | ok |
| London | +0 h | wind from ° | 30 | GFS 0.25° raw 43 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | GFS 0.25° raw 5 | -0 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.2 | GFS 0.25° raw 1032.2 | 0.1 | ±0.5 | ok |
| London | +0 h | temp °C | 9.0 | stored grid 9.0 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 6.3 | stored grid 6.0 | 0.2 | ±1 | ok |
| London | +0 h | cloud % | 5 | stored grid 5 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.23 | stored grid 1032.20 | 0.04 | ±0.1 | ok |
| London | +0 h | temp °C | 9.0 | gfs_global 9.3 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 6.3 | gfs_global 4.8 | 1.5 | ±3 | ok |
| London | +0 h | wind from ° | 30 | gfs_global 48 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | gfs_global 7 | -2 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.2 | gfs_global 1032.2 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.0 | gfs_seamless 9.3 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 6.3 | gfs_seamless 4.8 | 1.5 | ±3 | ok |
| London | +0 h | wind from ° | 30 | gfs_seamless 48 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | gfs_seamless 7 | -2 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.2 | gfs_seamless 1032.2 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 34.6 | cams_global 28.4 | 6.2 | ±3 | **FAIL** |
| London | +24 h | temp °C | 8.9 | GFS 0.25° raw 8.9 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 20.5 | GFS 0.25° raw 15.3 | 5.2 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | GFS 0.25° raw 20 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 4 | GFS 0.25° raw 3 | 1 | ±15 | ok |
| London | +24 h | pressure hPa | 1035.7 | GFS 0.25° raw 1035.7 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 8.9 | stored grid 8.8 | 0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 20.5 | stored grid 20.7 | -0.2 | ±1 | ok |
| London | +24 h | cloud % | 4 | stored grid 4 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1035.69 | stored grid 1035.67 | 0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 8.9 | gfs_global 9.1 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 20.5 | gfs_global 14.9 | 5.6 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | gfs_global 20 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 4 | gfs_global 0 | 4 | ±15 | ok |
| London | +24 h | pressure hPa | 1035.7 | gfs_global 1035.7 | -0.0 | ±1 | ok |
| London | +24 h | temp °C | 8.9 | gfs_seamless 9.1 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 20.5 | gfs_seamless 14.9 | 5.6 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | gfs_seamless 20 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 4 | gfs_seamless 0 | 4 | ±15 | ok |
| London | +24 h | pressure hPa | 1035.7 | gfs_seamless 1035.7 | -0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 8.2 | cams_global 3.6 | 4.6 | ±3 | **FAIL** |
| London | +110 h | temp °C | 9.5 | GFS 0.25° raw 9.6 | -0.1 | ±0.7 | ok |
| London | +110 h | wind km/h | 15.2 | GFS 0.25° raw 12.9 | 2.3 | ±3 | ok |
| London | +110 h | wind from ° | 52 | GFS 0.25° raw 52 | 0 | ±20 | ok |
| London | +110 h | precip mm/h | 0.09 | GFS 0.25° raw 0.12 | -0.03 | ±0.3 | ok |
| London | +110 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| London | +110 h | pressure hPa | 1027.6 | GFS 0.25° raw 1027.6 | 0.0 | ±0.5 | ok |
| London | +110 h | temp °C | 9.5 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +110 h | wind km/h | 15.2 | stored grid 15.2 | -0.0 | ±1 | ok |
| London | +110 h | cloud % | 97 | stored grid 97 | -0 | ±1 | ok |
| London | +110 h | pressure hPa | 1027.64 | stored grid 1027.61 | 0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 25.2 | GFS 0.25° raw 25.7 | -0.5 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 8.1 | GFS 0.25° raw 7.8 | 0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 339 | GFS 0.25° raw 339 | 0 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.8 | GFS 0.25° raw 1017.8 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 25.2 | stored grid 25.3 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 8.1 | stored grid 7.8 | 0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.82 | stored grid 1017.81 | 0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 25.2 | gfs_global 25.9 | -0.7 | ±1 | ok |
| Delhi | +0 h | wind km/h | 8.1 | gfs_global 7.6 | 0.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 339 | gfs_global 341 | 2 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.8 | gfs_global 1017.5 | 0.3 | ±1 | ok |
| Delhi | +0 h | temp °C | 25.2 | gfs_seamless 25.9 | -0.7 | ±1 | ok |
| Delhi | +0 h | wind km/h | 8.1 | gfs_seamless 7.6 | 0.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 339 | gfs_seamless 341 | 2 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.8 | gfs_seamless 1017.5 | 0.3 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 46.9 | cams_global 54.5 | -7.6 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 26.1 | GFS 0.25° raw 26.8 | -0.7 | ±0.7 | ok |
| Delhi | +24 h | wind km/h | 4.0 | GFS 0.25° raw 3.0 | 1.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 191 | GFS 0.25° raw 193 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.5 | GFS 0.25° raw 1017.5 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 26.1 | stored grid 26.1 | 0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 4.0 | stored grid 4.1 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1017.54 | stored grid 1017.55 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 26.1 | gfs_global 27.4 | -1.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 4.0 | gfs_global 2.7 | 1.3 | ±3 | ok |
| Delhi | +24 h | wind from ° | 191 | gfs_global 203 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.5 | gfs_global 1017.3 | 0.2 | ±1 | ok |
| Delhi | +24 h | temp °C | 26.1 | gfs_seamless 27.4 | -1.3 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 4.0 | gfs_seamless 2.7 | 1.3 | ±3 | ok |
| Delhi | +24 h | wind from ° | 191 | gfs_seamless 203 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.5 | gfs_seamless 1017.3 | 0.2 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 56.5 | cams_global 91.3 | -34.8 | ±3 | **FAIL** |
| Delhi | +110 h | temp °C | 25.7 | GFS 0.25° raw 27.3 | -1.6 | ±0.7 | **FAIL** |
| Delhi | +110 h | wind km/h | 7.0 | GFS 0.25° raw 7.0 | 0.0 | ±3 | ok |
| Delhi | +110 h | wind from ° | 301 | GFS 0.25° raw 312 | — | ±20 | calm |
| Delhi | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +110 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +110 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +110 h | temp °C | 25.7 | stored grid 25.7 | 0.0 | ±0.15 | ok |
| Delhi | +110 h | wind km/h | 7.0 | stored grid 6.8 | 0.2 | ±1 | ok |
| Delhi | +110 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +110 h | pressure hPa | 1014.14 | stored grid 1014.13 | 0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 16.23 | 16.23 | 0.00 | 11.8 | 13.7 | -2.0 | 99 | 100 |
| Kansas City MO | +24 h | 17.43 | 17.55 | -0.13 | 16.7 | 17.0 | -0.3 | 100 | 100 |
| Kansas City MO | +110 h (f120) | 9.84 | 9.75 | 0.09 | 14.1 | 14.7 | -0.6 | 100 | 100 |
| Miami | +0 h | 26.58 | 26.87 | -0.29 | 28.7 | 31.8 | -3.1 | 88 | 100 |
| Miami | +24 h | 25.69 | 26.23 | -0.54 | 28.8 | 30.9 | -2.2 | 100 | 100 |
| Miami | +110 h (f120) | 27.93 | 28.90 | -0.97 | 15.5 | 14.1 | 1.4 | 0 | 0 |
| Denver | +0 h | 8.72 | 12.84 | -4.12 | 4.3 | 4.5 | -0.3 | 62 | 48 |
| Denver | +24 h | 11.60 | 13.38 | -1.78 | 5.3 | 4.2 | 1.1 | 100 | 100 |
| Denver | +110 h (f120) | 10.52 | 11.17 | -0.65 | 2.9 | 2.7 | 0.3 | 0 | 0 |
| London | +0 h | 9.01 | 9.15 | -0.15 | 6.0 | 4.8 | 1.2 | 5 | 5 |
| London | +24 h | 8.79 | 8.93 | -0.14 | 20.7 | 15.3 | 5.4 | 4 | 3 |
| London | +110 h (f120) | 9.56 | 9.60 | -0.04 | 15.2 | 12.9 | 2.4 | 97 | 99 |
| Delhi | +0 h | 25.26 | 25.70 | -0.44 | 7.8 | 7.8 | -0.0 | 0 | 0 |
| Delhi | +24 h | 26.11 | 26.79 | -0.68 | 4.1 | 3.0 | 1.2 | 0 | 0 |
| Delhi | +110 h (f120) | 25.72 | 27.34 | -1.62 | 6.8 | 7.0 | -0.2 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 19.40 | 19.46 | -0.07 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1017.70 | 1017.70 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 96.00 | 95.59 | 0.41 | ±1 | ok |
| Chile coast | +0 h | temp | 14.00 | 13.94 | 0.06 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1016.70 | 1016.70 | 0.00 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 98.00 | 97.94 | 0.06 | ±1 | ok |
| Kansas City | +0 h | temp | 15.80 | 15.77 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1021.00 | 1021.01 | -0.01 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 18.40 | 18.38 | 0.02 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1010.60 | 1010.63 | -0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +24 h | temp | 11.60 | 11.57 | 0.03 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.20 | 1014.25 | -0.05 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Kansas City | +24 h | temp | 17.80 | 17.81 | -0.01 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1016.30 | 1016.33 | -0.03 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +110 h | temp | 16.00 | 15.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +110 h | pres | 1005.20 | 1005.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +110 h | cloud | 1.00 | 0.77 | 0.23 | ±1 | ok |
| Chile coast | +110 h | temp | 18.40 | 18.44 | -0.04 | ±0.5 | ok |
| Chile coast | +110 h | pres | 1015.40 | 1015.38 | 0.02 | ±0.5 | ok |
| Chile coast | +110 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +110 h | temp | 9.80 | 9.74 | 0.06 | ±0.5 | ok |
| Kansas City | +110 h | pres | 1012.40 | 1012.40 | 0.00 | ±0.5 | ok |
| Kansas City | +110 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (10.6 h before this check), valid hour 2026-11-01T04:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 38.10 | 38.10 | -0.00 | ±0.2 | ok | 46.90 | -8.80 |
| node 52N 0E (London) | +0 h | 36.40 | 36.40 | 0.00 | ±0.2 | ok | 32.20 | 4.20 |
| node 40N 116E (Beijing) | +0 h | 14.50 | 14.50 | 0.00 | ±0.2 | ok | 17.10 | -2.60 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":220,"2024 24-h mean":16,"2012 hourly":233,"2012 24-h mean":34}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.7 | 12.4 | 57 | 56 | 57 | 49 | 51 |
| Miami | 4.3 | 5.7 | 35 | 24 | 31 | 18 | 23 |
| Denver | 30.0 | 18.3 | 67 | 90 | 68 | 89 | 64 |
| London | 28.4 | 16.8 | 63 | 87 | 65 | 85 | 61 |
| Delhi | 54.5 | 69.0 | 159 | 148 | 160 | 148 | 158 |
| node 28N 76E (Delhi) | 46.9 | 39.9 | 107 | 129 | 112 | 129 | 112 |
| node 52N 0E (London) | 32.2 | 14.2 | 58 | 94 | 61 | 93 | 55 |
| node 40N 116E (Beijing) | 17.1 | 66.2 | 158 | 66 | 158 | 62 | 156 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 16 °Cat 2 m39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC | 11 km/hfrom ESE39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC | Drypast hour · area avg39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC | 99 %area average39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC | 1021 hPasea level39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC | 8.3 µg/m³Good · AQI 48 (24 h)39.1°N 94.5°W · Sun 04:00 local · 04:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC | 29 km/hfrom E25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC | 0.9 mm/hpast hour · area avg25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC | 88 %area average25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC | 1018 hPasea level25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC | 8.7 µg/m³Good · AQI 43 (24 h)25.7°N 80.1°W · Sun 04:00 local · 04:00 UTC |
| Denver | 9 °Cat 2 m39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC | 4 km/hfrom S39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC | 62 %area average39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC | 1016 hPasea level39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC | 1.1 µg/m³Good · AQI 33 (24 h)39.7°N 104.9°W · Sun 04:00 local · 04:00 UTC |
| London | 9 °Cat 2 m51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC | 6 km/hfrom NNE51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC | 5 %area average51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC | 35 µg/m³Moderate · AQI 64 (24 h)51.5°N 0.1°W · Sun 04:00 local · 04:00 UTC |
| Delhi | 25 °Cat 2 m28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC | 8 km/hfrom NNW28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC | 0 %area average28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC | 1018 hPasea level28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC | 47 µg/m³Sensitive groups · AQI 110 (24 h)28.6°N 77.2°E · Sun 04:00 local · 04:00 UTC |
