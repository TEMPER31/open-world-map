# Accuracy check (layer-overlays)

Generated 2026-10-31T21:42:12.637Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T12:00:00.000Z, timeline +0 h = 2026-10-31T22:00:00.000Z (f010); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 50 / 7 / 3
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 46 / 11 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 36 / 21 / 3
- Open-Meteo cams_global at the cities: 6 / 4 / 0
- NWS gridpoints (sanity check): 22 / 2 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.8 | GFS 0.25° raw 18.0 | -0.2 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 10.0 | GFS 0.25° raw 9.6 | 0.3 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 101 | GFS 0.25° raw 109 | 8 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | GFS 0.25° raw 0.56 | -0.11 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.4 | GFS 0.25° raw 1020.4 | 0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.8 | stored grid 17.8 | 0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 10.0 | stored grid 9.7 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.43 | stored grid 1020.42 | 0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.8 | gfs_global 18.1 | -0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 10.0 | gfs_global 11.3 | -1.3 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 101 | gfs_global 121 | 20 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.45 | gfs_global 0.60 | -0.15 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.4 | gfs_global 1020.3 | 0.1 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.8 | gfs_seamless 17.4 | 0.4 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 10.0 | gfs_seamless 11.2 | -1.2 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 101 | gfs_seamless 94 | 7 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | gfs_seamless 0.00 | 0.45 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.4 | gfs_seamless 1020.8 | -0.4 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.3 | cams_global 10.2 | -0.9 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.8 | NWS 20.0 | -2.2 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 10.0 | NWS 9.3 | 0.7 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 92 | 8 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.45 | NWS 0.04 | 0.41 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 19.1 | GFS 0.25° raw 19.0 | 0.1 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 12.4 | GFS 0.25° raw 12.6 | -0.2 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 161 | GFS 0.25° raw 159 | 2 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1018.3 | GFS 0.25° raw 1018.3 | 0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 19.1 | stored grid 19.1 | 0.1 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 12.4 | stored grid 12.5 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 99 | stored grid 99 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1018.29 | stored grid 1018.29 | 0.00 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 19.1 | gfs_global 19.2 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 12.4 | gfs_global 10.9 | 1.5 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 161 | gfs_global 163 | 2 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1018.3 | gfs_global 1018.3 | -0.0 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 19.1 | gfs_seamless 18.2 | 0.9 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 12.4 | gfs_seamless 8.9 | 3.5 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 161 | gfs_seamless 135 | 26 | ±20 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1018.3 | gfs_seamless 1019.7 | -1.4 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 4.4 | cams_global 5.5 | -1.1 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 19.1 | NWS 21.1 | -2.0 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 12.4 | NWS 7.4 | 5.0 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 99 | NWS 42 | 57 | ±30 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +110 h | temp °C | 9.1 | GFS 0.25° raw 9.3 | -0.1 | ±0.7 | ok |
| Kansas City MO | +110 h | wind km/h | 9.4 | GFS 0.25° raw 9.3 | 0.0 | ±3 | ok |
| Kansas City MO | +110 h | wind from ° | 70 | GFS 0.25° raw 72 | 1 | ±20 | ok |
| Kansas City MO | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +110 h | cloud % | 3 | GFS 0.25° raw 1 | 2 | ±15 | ok |
| Kansas City MO | +110 h | pressure hPa | 1014.9 | GFS 0.25° raw 1014.9 | 0.0 | ±0.5 | ok |
| Kansas City MO | +110 h | temp °C | 9.1 | stored grid 9.1 | 0.0 | ±0.15 | ok |
| Kansas City MO | +110 h | wind km/h | 9.4 | stored grid 9.4 | -0.0 | ±1 | ok |
| Kansas City MO | +110 h | cloud % | 3 | stored grid 3 | 0 | ±1 | ok |
| Kansas City MO | +110 h | pressure hPa | 1014.93 | stored grid 1014.93 | -0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.3 | GFS 0.25° raw 27.6 | -0.3 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 21.2 | GFS 0.25° raw 23.0 | -1.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 77 | GFS 0.25° raw 80 | 3 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.56 | GFS 0.25° raw 0.84 | -0.28 | ±0.3 | ok |
| Miami | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.6 | GFS 0.25° raw 1016.7 | -0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.3 | stored grid 27.4 | -0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 21.2 | stored grid 21.3 | -0.1 | ±1 | ok |
| Miami | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1016.55 | stored grid 1016.59 | -0.04 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.3 | gfs_global 27.8 | -0.5 | ±1 | ok |
| Miami | +0 h | wind km/h | 21.2 | gfs_global 23.6 | -2.4 | ±3 | ok |
| Miami | +0 h | wind from ° | 77 | gfs_global 78 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.56 | gfs_global 0.70 | -0.14 | ±0.3 | ok |
| Miami | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.6 | gfs_global 1016.6 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.3 | gfs_seamless 26.2 | 1.1 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 21.2 | gfs_seamless 12.5 | 8.7 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 77 | gfs_seamless 62 | 15 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.56 | gfs_seamless 0.00 | 0.56 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1016.6 | gfs_seamless 1016.6 | -0.0 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 8.4 | cams_global 5.4 | 3.0 | ±3 | ok |
| Miami | +0 h | temp °C | 27.3 | NWS 27.8 | -0.4 | ±3 | ok |
| Miami | +0 h | wind km/h | 21.2 | NWS 24.1 | -2.9 | ±8 | ok |
| Miami | +0 h | cloud % | 100 | NWS 68 | 32 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.56 | NWS 0.13 | 0.43 | ±1 | ok |
| Miami | +24 h | temp °C | 26.8 | GFS 0.25° raw 26.9 | -0.1 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 29.1 | GFS 0.25° raw 32.8 | -3.7 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 101 | GFS 0.25° raw 104 | 3 | ±20 | ok |
| Miami | +24 h | precip mm/h | 1.10 | GFS 0.25° raw 1.62 | -0.52 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.7 | GFS 0.25° raw 1015.8 | -0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.8 | stored grid 26.8 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 29.1 | stored grid 29.2 | -0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1015.73 | stored grid 1015.74 | -0.01 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.8 | gfs_global 26.9 | -0.1 | ±1 | ok |
| Miami | +24 h | wind km/h | 29.1 | gfs_global 33.8 | -4.7 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 101 | gfs_global 104 | 3 | ±20 | ok |
| Miami | +24 h | precip mm/h | 1.10 | gfs_global 2.50 | -1.40 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.7 | gfs_global 1015.7 | 0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 26.8 | gfs_seamless 23.2 | 3.6 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 29.1 | gfs_seamless 33.2 | -4.1 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 101 | gfs_seamless 106 | 5 | ±20 | ok |
| Miami | +24 h | precip mm/h | 1.10 | gfs_seamless 0.70 | 0.40 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.7 | gfs_seamless 1018.3 | -2.6 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 5.6 | cams_global 7.9 | -2.3 | ±3 | ok |
| Miami | +24 h | temp °C | 26.8 | NWS 26.7 | 0.1 | ±3 | ok |
| Miami | +24 h | wind km/h | 29.1 | NWS 27.8 | 1.3 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 76 | 24 | ±30 | ok |
| Miami | +24 h | precip mm/h | 1.10 | NWS 1.61 | -0.51 | ±1 | ok |
| Miami | +110 h | temp °C | 24.7 | GFS 0.25° raw 25.4 | -0.6 | ±0.7 | ok |
| Miami | +110 h | wind km/h | 7.4 | GFS 0.25° raw 7.1 | 0.3 | ±3 | ok |
| Miami | +110 h | wind from ° | 300 | GFS 0.25° raw 302 | — | ±20 | calm |
| Miami | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +110 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +110 h | pressure hPa | 1010.4 | GFS 0.25° raw 1010.4 | 0.0 | ±0.5 | ok |
| Miami | +110 h | temp °C | 24.7 | stored grid 24.7 | -0.0 | ±0.15 | ok |
| Miami | +110 h | wind km/h | 7.4 | stored grid 7.4 | 0.0 | ±1 | ok |
| Miami | +110 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Miami | +110 h | pressure hPa | 1010.39 | stored grid 1010.41 | -0.01 | ±0.1 | ok |
| Denver | +0 h | temp °C | 16.9 | GFS 0.25° raw 17.5 | -0.6 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 10.4 | GFS 0.25° raw 10.3 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 20 | GFS 0.25° raw 19 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 55 | GFS 0.25° raw 17 | 38 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.3 | GFS 0.25° raw 1011.0 | 0.2 | ±0.5 | ok |
| Denver | +0 h | temp °C | 16.9 | stored grid 16.8 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 10.4 | stored grid 10.3 | 0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 55 | stored grid 55 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1011.27 | stored grid 1011.25 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 16.9 | gfs_global 17.8 | -0.9 | ±1 | ok |
| Denver | +0 h | wind km/h | 10.4 | gfs_global 10.4 | -0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 20 | gfs_global 20 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 55 | gfs_global 100 | -45 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.3 | gfs_global 1008.4 | 2.9 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 16.9 | gfs_seamless 15.1 | 1.8 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 10.4 | gfs_seamless 7.5 | 2.9 | ±3 | ok |
| Denver | +0 h | wind from ° | 20 | gfs_seamless 12 | 8 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 55 | gfs_seamless 7 | 48 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.3 | gfs_seamless 1011.0 | 0.3 | ±1 | ok |
| Denver | +0 h | PM2.5 µg/m³ | 1.0 | cams_global 8.9 | -7.9 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 16.9 | NWS 16.1 | 0.7 | ±3 | ok |
| Denver | +0 h | wind km/h | 10.4 | NWS 7.4 | 3.0 | ±8 | ok |
| Denver | +0 h | cloud % | 55 | NWS 45 | 10 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 18.8 | GFS 0.25° raw 19.2 | -0.4 | ±0.7 | ok |
| Denver | +24 h | wind km/h | 10.9 | GFS 0.25° raw 11.8 | -0.9 | ±3 | ok |
| Denver | +24 h | wind from ° | 192 | GFS 0.25° raw 191 | 1 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | GFS 0.25° raw 77 | -3 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.6 | GFS 0.25° raw 999.5 | 0.1 | ±0.5 | ok |
| Denver | +24 h | temp °C | 18.8 | stored grid 18.8 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 10.9 | stored grid 11.3 | -0.4 | ±1 | ok |
| Denver | +24 h | cloud % | 74 | stored grid 74 | -0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 999.57 | stored grid 999.58 | -0.00 | ±0.1 | ok |
| Denver | +24 h | temp °C | 18.8 | gfs_global 19.3 | -0.5 | ±1 | ok |
| Denver | +24 h | wind km/h | 10.9 | gfs_global 10.9 | 0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 192 | gfs_global 197 | 5 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | gfs_global 100 | -26 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 999.6 | gfs_global 997.8 | 1.8 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 18.8 | gfs_seamless 16.7 | 2.1 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 10.9 | gfs_seamless 10.1 | 0.8 | ±3 | ok |
| Denver | +24 h | wind from ° | 192 | gfs_seamless 353 | 161 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | gfs_seamless 100 | -26 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 999.6 | gfs_seamless 1002.4 | -2.8 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 0.9 | cams_global 2.3 | -1.4 | ±3 | ok |
| Denver | +24 h | temp °C | 18.8 | NWS 16.1 | 2.6 | ±3 | ok |
| Denver | +24 h | wind km/h | 10.9 | NWS 11.1 | -0.2 | ±8 | ok |
| Denver | +24 h | cloud % | 74 | NWS 61 | 13 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +110 h | temp °C | 5.0 | GFS 0.25° raw 6.2 | -1.2 | ±0.7 | **FAIL** |
| Denver | +110 h | wind km/h | 9.3 | GFS 0.25° raw 9.0 | 0.3 | ±3 | ok |
| Denver | +110 h | wind from ° | 44 | GFS 0.25° raw 45 | 1 | ±20 | ok |
| Denver | +110 h | precip mm/h | 0.02 | GFS 0.25° raw 0.00 | 0.02 | ±0.3 | ok |
| Denver | +110 h | cloud % | 71 | GFS 0.25° raw 83 | -12 | ±15 | ok |
| Denver | +110 h | pressure hPa | 1018.8 | GFS 0.25° raw 1018.7 | 0.1 | ±0.5 | ok |
| Denver | +110 h | temp °C | 5.0 | stored grid 5.0 | -0.0 | ±0.15 | ok |
| Denver | +110 h | wind km/h | 9.3 | stored grid 9.3 | 0.0 | ±1 | ok |
| Denver | +110 h | cloud % | 71 | stored grid 71 | 0 | ±1 | ok |
| Denver | +110 h | pressure hPa | 1018.80 | stored grid 1018.80 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.3 | GFS 0.25° raw 10.4 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 5.1 | GFS 0.25° raw 4.0 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 66 | GFS 0.25° raw 76 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 70 | GFS 0.25° raw 85 | -15 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.4 | GFS 0.25° raw 1032.4 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 10.3 | stored grid 10.3 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 5.1 | stored grid 5.1 | 0.0 | ±1 | ok |
| London | +0 h | cloud % | 70 | stored grid 70 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.43 | stored grid 1032.42 | 0.02 | ±0.1 | ok |
| London | +0 h | temp °C | 10.3 | gfs_global 10.5 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 5.1 | gfs_global 4.0 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 66 | gfs_global 80 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 70 | gfs_global 88 | -18 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.4 | gfs_global 1032.4 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 10.3 | gfs_seamless 10.5 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 5.1 | gfs_seamless 4.0 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 66 | gfs_seamless 80 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 70 | gfs_seamless 88 | -18 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1032.4 | gfs_seamless 1032.4 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 21.3 | cams_global 26.7 | -5.4 | ±3 | **FAIL** |
| London | +24 h | temp °C | 11.7 | GFS 0.25° raw 11.7 | 0.0 | ±0.7 | ok |
| London | +24 h | wind km/h | 20.0 | GFS 0.25° raw 16.8 | 3.2 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | GFS 0.25° raw 21 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.01 | GFS 0.25° raw 0.00 | 0.01 | ±0.3 | ok |
| London | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1034.3 | GFS 0.25° raw 1034.3 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 11.7 | stored grid 11.6 | 0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 20.0 | stored grid 19.8 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 99 | stored grid 99 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1034.32 | stored grid 1034.31 | 0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 11.7 | gfs_global 11.8 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 20.0 | gfs_global 16.5 | 3.5 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | gfs_global 20 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.01 | gfs_global 0.00 | 0.01 | ±0.3 | ok |
| London | +24 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1034.3 | gfs_global 1034.4 | -0.1 | ±1 | ok |
| London | +24 h | temp °C | 11.7 | gfs_seamless 11.8 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 20.0 | gfs_seamless 16.5 | 3.5 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 17 | gfs_seamless 20 | 3 | ±20 | ok |
| London | +24 h | precip mm/h | 0.01 | gfs_seamless 0.00 | 0.01 | ±0.3 | ok |
| London | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1034.3 | gfs_seamless 1034.4 | -0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 12.5 | cams_global 23.6 | -11.1 | ±3 | **FAIL** |
| London | +110 h | temp °C | 10.7 | GFS 0.25° raw 10.7 | -0.0 | ±0.7 | ok |
| London | +110 h | wind km/h | 20.4 | GFS 0.25° raw 15.8 | 4.6 | ±3 | **FAIL** |
| London | +110 h | wind from ° | 78 | GFS 0.25° raw 75 | 3 | ±20 | ok |
| London | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +110 h | cloud % | 87 | GFS 0.25° raw 100 | -13 | ±15 | ok |
| London | +110 h | pressure hPa | 1030.1 | GFS 0.25° raw 1030.1 | 0.0 | ±0.5 | ok |
| London | +110 h | temp °C | 10.7 | stored grid 10.7 | -0.0 | ±0.15 | ok |
| London | +110 h | wind km/h | 20.4 | stored grid 20.4 | -0.0 | ±1 | ok |
| London | +110 h | cloud % | 87 | stored grid 87 | 0 | ±1 | ok |
| London | +110 h | pressure hPa | 1030.14 | stored grid 1030.12 | 0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.3 | GFS 0.25° raw 23.6 | -1.2 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.9 | GFS 0.25° raw 3.3 | 1.6 | ±3 | ok |
| Delhi | +0 h | wind from ° | 251 | GFS 0.25° raw 275 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.7 | GFS 0.25° raw 1015.7 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 22.3 | stored grid 22.3 | 0.1 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 4.9 | stored grid 4.7 | 0.2 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1015.72 | stored grid 1015.75 | -0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 22.3 | gfs_global 24.8 | -2.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.9 | gfs_global 2.6 | 2.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 251 | gfs_global 286 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.7 | gfs_global 1015.6 | 0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 22.3 | gfs_seamless 24.8 | -2.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.9 | gfs_seamless 2.6 | 2.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 251 | gfs_seamless 286 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.7 | gfs_seamless 1015.6 | 0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 63.7 | cams_global 66.6 | -2.9 | ±3 | ok |
| Delhi | +24 h | temp °C | 23.0 | GFS 0.25° raw 24.4 | -1.4 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | GFS 0.25° raw 1.2 | 2.1 | ±3 | ok |
| Delhi | +24 h | wind from ° | 220 | GFS 0.25° raw 261 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.4 | GFS 0.25° raw 1014.4 | 0.0 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 23.0 | stored grid 22.9 | 0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 3.3 | stored grid 3.4 | -0.0 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1014.40 | stored grid 1014.43 | -0.03 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 23.0 | gfs_global 25.5 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | gfs_global 1.8 | 1.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 220 | gfs_global 281 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.4 | gfs_global 1014.2 | 0.2 | ±1 | ok |
| Delhi | +24 h | temp °C | 23.0 | gfs_seamless 25.5 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | gfs_seamless 1.8 | 1.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 220 | gfs_seamless 281 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1014.4 | gfs_seamless 1014.2 | 0.2 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 58.4 | cams_global 99.7 | -41.3 | ±3 | **FAIL** |
| Delhi | +110 h | temp °C | 29.9 | GFS 0.25° raw 31.3 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +110 h | wind km/h | 7.1 | GFS 0.25° raw 6.6 | 0.5 | ±3 | ok |
| Delhi | +110 h | wind from ° | 312 | GFS 0.25° raw 316 | — | ±20 | calm |
| Delhi | +110 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +110 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +110 h | pressure hPa | 1013.0 | GFS 0.25° raw 1013.0 | 0.0 | ±0.5 | ok |
| Delhi | +110 h | temp °C | 29.9 | stored grid 29.8 | 0.0 | ±0.15 | ok |
| Delhi | +110 h | wind km/h | 7.1 | stored grid 7.2 | -0.0 | ±1 | ok |
| Delhi | +110 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +110 h | pressure hPa | 1013.01 | stored grid 1013.01 | 0.00 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.76 | 18.00 | -0.24 | 9.7 | 9.6 | 0.0 | 100 | 100 |
| Kansas City MO | +24 h | 19.06 | 19.02 | 0.04 | 12.5 | 12.6 | -0.1 | 99 | 100 |
| Kansas City MO | +110 h (f120) | 9.12 | 9.27 | -0.15 | 9.4 | 9.3 | 0.1 | 3 | 1 |
| Miami | +0 h | 27.36 | 27.64 | -0.28 | 21.3 | 23.0 | -1.8 | 100 | 100 |
| Miami | +24 h | 26.79 | 26.89 | -0.11 | 29.2 | 32.8 | -3.6 | 100 | 100 |
| Miami | +110 h (f120) | 24.73 | 25.36 | -0.63 | 7.4 | 7.1 | 0.3 | 0 | 0 |
| Denver | +0 h | 16.85 | 17.50 | -0.65 | 10.3 | 10.3 | -0.0 | 55 | 17 |
| Denver | +24 h | 18.77 | 19.16 | -0.39 | 11.3 | 11.8 | -0.5 | 74 | 77 |
| Denver | +110 h (f120) | 5.00 | 6.21 | -1.21 | 9.3 | 9.0 | 0.3 | 71 | 83 |
| London | +0 h | 10.29 | 10.42 | -0.13 | 5.1 | 4.0 | 1.1 | 70 | 85 |
| London | +24 h | 11.64 | 11.68 | -0.04 | 19.8 | 16.8 | 3.0 | 99 | 100 |
| London | +110 h (f120) | 10.72 | 10.71 | 0.01 | 20.4 | 15.8 | 4.6 | 87 | 100 |
| Delhi | +0 h | 22.28 | 23.55 | -1.27 | 4.7 | 3.3 | 1.4 | 0 | 0 |
| Delhi | +24 h | 22.95 | 24.41 | -1.46 | 3.4 | 1.2 | 2.2 | 0 | 0 |
| Delhi | +110 h (f120) | 29.81 | 31.34 | -1.53 | 7.2 | 6.6 | 0.5 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 15.80 | 15.80 | -0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1019.00 | 1018.96 | 0.04 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 53.00 | 52.92 | 0.08 | ±1 | ok |
| Chile coast | +0 h | temp | 16.00 | 15.92 | 0.08 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.50 | 1015.47 | 0.03 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 85.00 | 84.75 | 0.25 | ±1 | ok |
| Kansas City | +0 h | temp | 17.20 | 17.15 | 0.05 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.40 | 1020.42 | -0.02 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 15.80 | 15.71 | 0.09 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1013.70 | 1013.68 | 0.02 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 62.00 | 62.47 | -0.47 | ±1 | ok |
| Chile coast | +24 h | temp | 16.20 | 16.11 | 0.09 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.80 | 1014.82 | -0.02 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 2.00 | 1.57 | 0.43 | ±1 | ok |
| Kansas City | +24 h | temp | 19.60 | 19.51 | 0.09 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1017.80 | 1017.83 | -0.03 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +110 h | temp | 15.60 | 15.59 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +110 h | pres | 1008.90 | 1008.92 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +110 h | cloud | 14.00 | 14.24 | -0.24 | ±1 | ok |
| Chile coast | +110 h | temp | 14.80 | 14.72 | 0.08 | ±0.5 | ok |
| Chile coast | +110 h | pres | 1016.60 | 1016.55 | 0.05 | ±0.5 | ok |
| Chile coast | +110 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +110 h | temp | 9.20 | 9.20 | -0.00 | ±0.5 | ok |
| Kansas City | +110 h | pres | 1014.70 | 1014.73 | -0.03 | ±0.5 | ok |
| Kansas City | +110 h | cloud | 3.00 | 3.35 | -0.35 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (4.4 h before this check), valid hour 2026-10-31T22:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 63.80 | 63.80 | -0.00 | ±0.2 | ok | 63.80 | -0.00 |
| node 52N 0E (London) | +0 h | 21.70 | 21.70 | 0.00 | ±0.2 | ok | 21.70 | 0.00 |
| node 40N 116E (Beijing) | +0 h | 71.00 | 71.00 | 0.00 | ±0.2 | ok | 71.00 | 0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":140,"2024 24-h mean":13,"2012 hourly":161,"2012 24-h mean":29}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 10.2 | 14.7 | 61 | 53 | 61 | 43 | 56 |
| Miami | 5.4 | 5.4 | 35 | 30 | 30 | 23 | 23 |
| Denver | 8.9 | 17.9 | 67 | 49 | 67 | 37 | 63 |
| London | 26.7 | 15.2 | 60 | 84 | 62 | 82 | 58 |
| Delhi | 66.6 | 63.6 | 155 | 159 | 157 | 157 | 155 |
| node 28N 76E (Delhi) | 63.8 | 33.5 | 95 | 157 | 96 | 155 | 96 |
| node 52N 0E (London) | 21.7 | 12.6 | 56 | 74 | 57 | 71 | 52 |
| node 40N 116E (Beijing) | 71.0 | 72.6 | 161 | 162 | 163 | 159 | 160 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 18 °Cat 2 m39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC | 10 km/hfrom E39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC | 0.5 mm/hpast hour · area avg39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC | 100 %area average39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC | 1020 hPasea level39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC | 9.3 µg/m³Moderate · AQI 48 (24 h)39.1°N 94.5°W · Sat 22:00 local · 22:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC | 21 km/hfrom ENE25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC | 0.6 mm/hpast hour · area avg25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC | 100 %area average25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC | 1017 hPasea level25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC | 8.4 µg/m³Good · AQI 43 (24 h)25.7°N 80.1°W · Sat 22:00 local · 22:00 UTC |
| Denver | 17 °Cat 2 m39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC | 10 km/hfrom NNE39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC | 55 %area average39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC | 1011 hPasea level39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC | 1.0 µg/m³Good · AQI 34 (24 h)39.7°N 104.9°W · Sat 22:00 local · 22:00 UTC |
| London | 10 °Cat 2 m51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC | 5 km/hfrom ENE51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC | 70 %area average51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC | 21 µg/m³Moderate · AQI 56 (24 h)51.5°N 0.1°W · Sat 22:00 local · 22:00 UTC |
| Delhi | 22 °Cat 2 m28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC | 5 km/hfrom WSW28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC | 0 %area average28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC | 64 µg/m³Unhealthy · AQI 98 (24 h)28.6°N 77.2°E · Sat 22:00 local · 22:00 UTC |
