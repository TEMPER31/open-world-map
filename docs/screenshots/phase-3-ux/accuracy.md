# Accuracy check (phase-3-ux)

Generated 2026-10-31T09:03:22.786Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T00:00:00.000Z, timeline +0 h = 2026-10-31T09:00:00.000Z (f009); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 51 / 5 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 47 / 9 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 19 / 4
- Open-Meteo cams_global at the cities: 3 / 7 / 0
- NWS gridpoints (sanity check): 22 / 2 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 22 / 5 / 3
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 0 / 0 / 3

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.2 | GFS 0.25° raw 17.2 | 0.0 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 7.4 | GFS 0.25° raw 4.4 | 2.9 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 177 | GFS 0.25° raw 253 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.62 | GFS 0.25° raw 0.42 | 0.21 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.8 | GFS 0.25° raw 1021.7 | 0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | stored grid 17.1 | 0.1 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 7.4 | stored grid 7.4 | -0.0 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.75 | stored grid 1021.75 | -0.00 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | gfs_global 17.7 | -0.5 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 7.4 | gfs_global 2.0 | 5.4 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 177 | gfs_global 225 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.62 | gfs_global 0.20 | 0.42 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.8 | gfs_global 1021.9 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | gfs_seamless 16.9 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 7.4 | gfs_seamless 1.5 | 5.9 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 177 | gfs_seamless 47 | — | ±20 | calm |
| Kansas City MO | +0 h | precip mm/h | 0.62 | gfs_seamless 0.00 | 0.62 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.8 | gfs_seamless 1022.3 | -0.5 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.9 | cams_global 10.9 | -1.0 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | NWS 16.7 | 0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 7.4 | NWS 3.7 | 3.6 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 95 | 5 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.62 | NWS 0.08 | 0.54 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.7 | GFS 0.25° raw 13.6 | 0.1 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 6.5 | GFS 0.25° raw 6.9 | -0.4 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 139 | GFS 0.25° raw 140 | — | ±20 | calm |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 57 | GFS 0.25° raw 56 | 1 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | GFS 0.25° raw 1021.7 | -0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 13.7 | stored grid 13.7 | 0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 6.5 | stored grid 6.6 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 57 | stored grid 57 | -0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.68 | stored grid 1021.70 | -0.01 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 13.7 | gfs_global 14.2 | -0.5 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 6.5 | gfs_global 5.6 | 0.9 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 139 | gfs_global 140 | — | ±20 | calm |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 57 | gfs_global 29 | 28 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | gfs_global 1022.0 | -0.3 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.7 | gfs_seamless 16.0 | -2.3 | ±1 | **FAIL** |
| Kansas City MO | +24 h | wind km/h | 6.5 | gfs_seamless 2.9 | 3.6 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 139 | gfs_seamless 92 | — | ±20 | calm |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 57 | gfs_seamless 100 | -43 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.7 | gfs_seamless 1022.7 | -1.0 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 13.5 | cams_global 9.5 | 4.0 | ±3 | **FAIL** |
| Kansas City MO | +24 h | temp °C | 13.7 | NWS 15.6 | -1.8 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 6.5 | NWS 5.6 | 0.9 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 57 | NWS 74 | -17 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.08 | -0.08 | ±1 | ok |
| Kansas City MO | +111 h | temp °C | 12.7 | GFS 0.25° raw 12.8 | -0.1 | ±0.7 | ok |
| Kansas City MO | +111 h | wind km/h | 6.2 | GFS 0.25° raw 6.0 | 0.1 | ±3 | ok |
| Kansas City MO | +111 h | wind from ° | 25 | GFS 0.25° raw 21 | — | ±20 | calm |
| Kansas City MO | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +111 h | cloud % | 7 | GFS 0.25° raw 5 | 2 | ±15 | ok |
| Kansas City MO | +111 h | pressure hPa | 1014.4 | GFS 0.25° raw 1014.4 | 0.0 | ±0.5 | ok |
| Kansas City MO | +111 h | temp °C | 12.7 | stored grid 12.7 | -0.0 | ±0.15 | ok |
| Kansas City MO | +111 h | wind km/h | 6.2 | stored grid 5.9 | 0.3 | ±1 | ok |
| Kansas City MO | +111 h | cloud % | 7 | stored grid 7 | 0 | ±1 | ok |
| Kansas City MO | +111 h | pressure hPa | 1014.40 | stored grid 1014.38 | 0.03 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.3 | GFS 0.25° raw 26.8 | -0.5 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 19.7 | GFS 0.25° raw 20.8 | -1.1 | ±3 | ok |
| Miami | +0 h | wind from ° | 85 | GFS 0.25° raw 91 | 6 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.23 | GFS 0.25° raw 0.18 | 0.05 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | GFS 0.25° raw 1 | 6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.1 | GFS 0.25° raw 1015.0 | 0.1 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.3 | stored grid 26.2 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 19.7 | stored grid 19.7 | -0.1 | ±1 | ok |
| Miami | +0 h | cloud % | 7 | stored grid 7 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1015.07 | stored grid 1015.06 | 0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.3 | gfs_global 26.9 | -0.6 | ±1 | ok |
| Miami | +0 h | wind km/h | 19.7 | gfs_global 21.6 | -1.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 85 | gfs_global 92 | 7 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.23 | gfs_global 0.10 | 0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_global 8 | -1 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.1 | gfs_global 1015.0 | 0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 26.3 | gfs_seamless 24.8 | 1.5 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 19.7 | gfs_seamless 10.4 | 9.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 85 | gfs_seamless 101 | 16 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.23 | gfs_seamless 0.00 | 0.23 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_seamless 3 | 4 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.1 | gfs_seamless 1015.3 | -0.2 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 9.0 | cams_global 3.9 | 5.1 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 26.3 | NWS 26.1 | 0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 19.7 | NWS 22.2 | -2.6 | ±8 | ok |
| Miami | +0 h | cloud % | 7 | NWS 36 | -29 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.23 | NWS 1.27 | -1.04 | ±1 | **FAIL** |
| Miami | +24 h | temp °C | 26.1 | GFS 0.25° raw 26.4 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 26.9 | GFS 0.25° raw 29.8 | -2.9 | ±3 | ok |
| Miami | +24 h | wind from ° | 89 | GFS 0.25° raw 89 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.37 | GFS 0.25° raw 0.36 | 0.00 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.2 | GFS 0.25° raw 1017.2 | 0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.1 | stored grid 26.1 | 0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 26.9 | stored grid 27.1 | -0.2 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1017.16 | stored grid 1017.16 | -0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.1 | gfs_global 26.4 | -0.3 | ±1 | ok |
| Miami | +24 h | wind km/h | 26.9 | gfs_global 30.2 | -3.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 89 | gfs_global 91 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.37 | gfs_global 0.50 | -0.13 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.2 | gfs_global 1017.1 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.1 | gfs_seamless 24.4 | 1.7 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 26.9 | gfs_seamless 18.6 | 8.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 89 | gfs_seamless 86 | 3 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.37 | gfs_seamless 0.00 | 0.37 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 85 | 15 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.2 | gfs_seamless 1018.4 | -1.2 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 8.6 | cams_global 8.5 | 0.1 | ±3 | ok |
| Miami | +24 h | temp °C | 26.1 | NWS 26.1 | -0.0 | ±3 | ok |
| Miami | +24 h | wind km/h | 26.9 | NWS 29.6 | -2.7 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 72 | 28 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.37 | NWS 0.21 | 0.15 | ±1 | ok |
| Miami | +111 h | temp °C | 24.8 | GFS 0.25° raw 25.1 | -0.3 | ±0.7 | ok |
| Miami | +111 h | wind km/h | 23.4 | GFS 0.25° raw 28.4 | -5.0 | ±3 | **FAIL** |
| Miami | +111 h | wind from ° | 70 | GFS 0.25° raw 65 | 5 | ±20 | ok |
| Miami | +111 h | precip mm/h | 1.75 | GFS 0.25° raw 2.59 | -0.84 | ±0.3 | **FAIL** |
| Miami | +111 h | cloud % | 88 | GFS 0.25° raw 100 | -12 | ±15 | ok |
| Miami | +111 h | pressure hPa | 1011.9 | GFS 0.25° raw 1011.8 | 0.1 | ±0.5 | ok |
| Miami | +111 h | temp °C | 24.8 | stored grid 24.8 | 0.0 | ±0.15 | ok |
| Miami | +111 h | wind km/h | 23.4 | stored grid 23.5 | -0.1 | ±1 | ok |
| Miami | +111 h | cloud % | 88 | stored grid 88 | -0 | ±1 | ok |
| Miami | +111 h | pressure hPa | 1011.88 | stored grid 1011.86 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.3 | GFS 0.25° raw 11.6 | -3.3 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 8.1 | GFS 0.25° raw 7.0 | 1.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 344 | GFS 0.25° raw 343 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.1 | GFS 0.25° raw 1012.3 | 0.9 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 8.3 | stored grid 8.3 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 8.1 | stored grid 8.2 | -0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1013.14 | stored grid 1013.12 | 0.03 | ±0.1 | ok |
| Denver | +0 h | temp °C | 8.3 | gfs_global 11.9 | -3.6 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 8.1 | gfs_global 9.3 | -1.2 | ±3 | ok |
| Denver | +0 h | wind from ° | 344 | gfs_global 347 | 3 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.1 | gfs_global 1011.9 | 1.2 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 8.3 | gfs_seamless 7.7 | 0.6 | ±1 | ok |
| Denver | +0 h | wind km/h | 8.1 | gfs_seamless 1.9 | 6.2 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 344 | gfs_seamless 334 | 10 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.1 | gfs_seamless 1009.7 | 3.4 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 1.2 | cams_global 19.5 | -18.3 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 8.3 | NWS 7.2 | 1.1 | ±3 | ok |
| Denver | +0 h | wind km/h | 8.1 | NWS 1.9 | 6.2 | ±8 | ok |
| Denver | +0 h | cloud % | 100 | NWS 52 | 48 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 8.6 | GFS 0.25° raw 12.2 | -3.7 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 0.8 | GFS 0.25° raw 1.2 | -0.4 | ±3 | ok |
| Denver | +24 h | wind from ° | 239 | GFS 0.25° raw 243 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | GFS 0.25° raw 100 | -4 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1014.1 | GFS 0.25° raw 1013.1 | 1.0 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 8.6 | stored grid 8.6 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 0.8 | stored grid 1.0 | -0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 96 | stored grid 96 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1014.10 | stored grid 1014.10 | -0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 8.6 | gfs_global 12.8 | -4.2 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 0.8 | gfs_global 1.6 | -0.8 | ±3 | ok |
| Denver | +24 h | wind from ° | 239 | gfs_global 333 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | gfs_global 100 | -4 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1014.1 | gfs_global 1012.8 | 1.3 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 8.6 | gfs_seamless 6.7 | 1.9 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 0.8 | gfs_seamless 5.4 | -4.6 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 239 | gfs_seamless 212 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | gfs_seamless 45 | 51 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1014.1 | gfs_seamless 1015.2 | -1.1 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 5.5 | cams_global 19.7 | -14.2 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 8.6 | NWS 7.2 | 1.4 | ±3 | ok |
| Denver | +24 h | wind km/h | 0.8 | NWS 3.7 | -2.9 | ±8 | ok |
| Denver | +24 h | cloud % | 96 | NWS 72 | 24 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +111 h | temp °C | 13.4 | GFS 0.25° raw 16.1 | -2.8 | ±0.7 | **FAIL** |
| Denver | +111 h | wind km/h | 8.0 | GFS 0.25° raw 7.6 | 0.4 | ±3 | ok |
| Denver | +111 h | wind from ° | 6 | GFS 0.25° raw 9 | — | ±20 | calm |
| Denver | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +111 h | cloud % | 2 | GFS 0.25° raw 0 | 2 | ±15 | ok |
| Denver | +111 h | pressure hPa | 1007.3 | GFS 0.25° raw 1006.7 | 0.5 | ±0.5 | **FAIL** |
| Denver | +111 h | temp °C | 13.4 | stored grid 13.3 | 0.0 | ±0.15 | ok |
| Denver | +111 h | wind km/h | 8.0 | stored grid 7.7 | 0.3 | ±1 | ok |
| Denver | +111 h | cloud % | 2 | stored grid 2 | 0 | ±1 | ok |
| Denver | +111 h | pressure hPa | 1007.25 | stored grid 1007.28 | -0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 11.3 | GFS 0.25° raw 11.3 | 0.0 | ±0.7 | ok |
| London | +0 h | wind km/h | 9.8 | GFS 0.25° raw 8.2 | 1.6 | ±3 | ok |
| London | +0 h | wind from ° | 91 | GFS 0.25° raw 95 | 4 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 62 | GFS 0.25° raw 79 | -17 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1031.6 | GFS 0.25° raw 1031.6 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.3 | stored grid 11.3 | 0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 9.8 | stored grid 10.2 | -0.4 | ±1 | ok |
| London | +0 h | cloud % | 62 | stored grid 62 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1031.61 | stored grid 1031.61 | 0.00 | ±0.1 | ok |
| London | +0 h | temp °C | 11.3 | gfs_global 11.4 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 9.8 | gfs_global 8.3 | 1.5 | ±3 | ok |
| London | +0 h | wind from ° | 91 | gfs_global 95 | 4 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 62 | gfs_global 64 | -2 | ±15 | ok |
| London | +0 h | pressure hPa | 1031.6 | gfs_global 1031.6 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 11.3 | gfs_seamless 11.4 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 9.8 | gfs_seamless 8.3 | 1.5 | ±3 | ok |
| London | +0 h | wind from ° | 91 | gfs_seamless 95 | 4 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 62 | gfs_seamless 64 | -2 | ±15 | ok |
| London | +0 h | pressure hPa | 1031.6 | gfs_seamless 1031.6 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.7 | cams_global 18.5 | -5.8 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.3 | GFS 0.25° raw 10.4 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 9.2 | GFS 0.25° raw 6.4 | 2.9 | ±3 | ok |
| London | +24 h | wind from ° | 1 | GFS 0.25° raw 6 | 5 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | GFS 0.25° raw 5 | 0 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | GFS 0.25° raw 1033.0 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.3 | stored grid 10.3 | -0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 9.2 | stored grid 9.1 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 5 | stored grid 5 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.96 | stored grid 1032.98 | -0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.3 | gfs_global 10.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 9.2 | gfs_global 6.2 | 3.0 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 1 | gfs_global 7 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_global 6 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | gfs_global 1033.0 | -0.0 | ±1 | ok |
| London | +24 h | temp °C | 10.3 | gfs_seamless 10.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 9.2 | gfs_seamless 6.2 | 3.0 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 1 | gfs_seamless 7 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_seamless 6 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1033.0 | gfs_seamless 1033.0 | -0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 34.5 | cams_global 36.4 | -1.9 | ±3 | ok |
| London | +111 h | temp °C | 8.1 | GFS 0.25° raw 8.1 | -0.0 | ±0.7 | ok |
| London | +111 h | wind km/h | 15.3 | GFS 0.25° raw 13.3 | 2.0 | ±3 | ok |
| London | +111 h | wind from ° | 46 | GFS 0.25° raw 60 | 14 | ±20 | ok |
| London | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +111 h | cloud % | 19 | GFS 0.25° raw 9 | 10 | ±15 | ok |
| London | +111 h | pressure hPa | 1031.8 | GFS 0.25° raw 1031.7 | 0.0 | ±0.5 | ok |
| London | +111 h | temp °C | 8.1 | stored grid 8.1 | 0.0 | ±0.15 | ok |
| London | +111 h | wind km/h | 15.3 | stored grid 15.4 | -0.1 | ±1 | ok |
| London | +111 h | cloud % | 19 | stored grid 19 | -0 | ±1 | ok |
| London | +111 h | pressure hPa | 1031.75 | stored grid 1031.74 | 0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 29.5 | GFS 0.25° raw 29.6 | -0.1 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 9.2 | GFS 0.25° raw 8.5 | 0.7 | ±3 | ok |
| Delhi | +0 h | wind from ° | 333 | GFS 0.25° raw 330 | 3 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 8 | GFS 0.25° raw 0 | 7 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.6 | -0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 29.5 | stored grid 29.4 | 0.1 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 9.2 | stored grid 9.1 | 0.2 | ±1 | ok |
| Delhi | +0 h | cloud % | 8 | stored grid 7 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1015.64 | stored grid 1015.66 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 29.5 | gfs_global 29.7 | -0.2 | ±1 | ok |
| Delhi | +0 h | wind km/h | 9.2 | gfs_global 8.1 | 1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 333 | gfs_global 328 | 5 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 8 | gfs_global 6 | 2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.6 | gfs_global 1015.3 | 0.3 | ±1 | ok |
| Delhi | +0 h | temp °C | 29.5 | gfs_seamless 29.7 | -0.2 | ±1 | ok |
| Delhi | +0 h | wind km/h | 9.2 | gfs_seamless 8.1 | 1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 333 | gfs_seamless 328 | 5 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 8 | gfs_seamless 6 | 2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.6 | gfs_seamless 1015.3 | 0.3 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 11.7 | cams_global 31.3 | -19.6 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 31.1 | GFS 0.25° raw 31.3 | -0.2 | ±0.7 | ok |
| Delhi | +24 h | wind km/h | 7.6 | GFS 0.25° raw 7.4 | 0.3 | ±3 | ok |
| Delhi | +24 h | wind from ° | 333 | GFS 0.25° raw 335 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1012.7 | GFS 0.25° raw 1012.7 | -0.0 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 31.1 | stored grid 31.1 | 0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 7.6 | stored grid 7.7 | -0.0 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1012.70 | stored grid 1012.71 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 31.1 | gfs_global 31.5 | -0.4 | ±1 | ok |
| Delhi | +24 h | wind km/h | 7.6 | gfs_global 7.1 | 0.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 333 | gfs_global 336 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1012.7 | gfs_global 1012.2 | 0.5 | ±1 | ok |
| Delhi | +24 h | temp °C | 31.1 | gfs_seamless 31.5 | -0.4 | ±1 | ok |
| Delhi | +24 h | wind km/h | 7.6 | gfs_seamless 7.1 | 0.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 333 | gfs_seamless 336 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1012.7 | gfs_seamless 1012.2 | 0.5 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 26.2 | cams_global 56.3 | -30.1 | ±3 | **FAIL** |
| Delhi | +111 h | temp °C | 23.2 | GFS 0.25° raw 24.6 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +111 h | wind km/h | 2.1 | GFS 0.25° raw 1.6 | 0.5 | ±3 | ok |
| Delhi | +111 h | wind from ° | 95 | GFS 0.25° raw 87 | — | ±20 | calm |
| Delhi | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +111 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +111 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +111 h | temp °C | 23.2 | stored grid 23.2 | 0.0 | ±0.15 | ok |
| Delhi | +111 h | wind km/h | 2.1 | stored grid 1.9 | 0.2 | ±1 | ok |
| Delhi | +111 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +111 h | pressure hPa | 1014.06 | stored grid 1014.07 | -0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.15 | 17.17 | -0.02 | 7.4 | 4.4 | 2.9 | 100 | 100 |
| Kansas City MO | +24 h | 13.69 | 13.62 | 0.07 | 6.6 | 6.9 | -0.3 | 57 | 56 |
| Kansas City MO | +111 h (f120) | 12.74 | 12.82 | -0.08 | 5.9 | 6.0 | -0.2 | 7 | 5 |
| Miami | +0 h | 26.23 | 26.77 | -0.53 | 19.7 | 20.8 | -1.0 | 7 | 1 |
| Miami | +24 h | 26.07 | 26.38 | -0.31 | 27.1 | 29.8 | -2.7 | 100 | 100 |
| Miami | +111 h (f120) | 24.77 | 25.11 | -0.34 | 23.5 | 28.4 | -4.9 | 88 | 100 |
| Denver | +0 h | 8.27 | 11.56 | -3.29 | 8.2 | 7.0 | 1.2 | 100 | 100 |
| Denver | +24 h | 8.64 | 12.25 | -3.61 | 1.0 | 1.2 | -0.1 | 96 | 100 |
| Denver | +111 h (f120) | 13.33 | 16.12 | -2.79 | 7.7 | 7.6 | 0.1 | 2 | 0 |
| London | +0 h | 11.33 | 11.33 | 0.00 | 10.2 | 8.2 | 2.0 | 62 | 79 |
| London | +24 h | 10.34 | 10.42 | -0.08 | 9.1 | 6.4 | 2.7 | 5 | 5 |
| London | +111 h (f120) | 8.07 | 8.10 | -0.03 | 15.4 | 13.3 | 2.1 | 19 | 9 |
| Delhi | +0 h | 29.39 | 29.57 | -0.19 | 9.1 | 8.5 | 0.6 | 7 | 0 |
| Delhi | +24 h | 31.10 | 31.28 | -0.18 | 7.7 | 7.4 | 0.3 | 0 | 0 |
| Delhi | +111 h (f120) | 23.16 | 24.64 | -1.49 | 1.9 | 1.6 | 0.3 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 20.40 | 20.38 | 0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1013.20 | 1013.16 | 0.04 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 2.00 | 2.35 | -0.35 | ±1 | ok |
| Chile coast | +0 h | temp | 13.80 | 13.85 | -0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1013.00 | 1012.96 | 0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 96.00 | 95.99 | 0.01 | ±1 | ok |
| Kansas City | +0 h | temp | 17.00 | 16.92 | 0.08 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1021.50 | 1021.46 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 17.20 | 17.29 | -0.09 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1018.20 | 1018.15 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 80.00 | 79.56 | 0.44 | ±1 | ok |
| Chile coast | +24 h | temp | 12.80 | 12.76 | 0.04 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1016.20 | 1016.19 | 0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 94.00 | 94.41 | -0.41 | ±1 | ok |
| Kansas City | +24 h | temp | 12.80 | 12.78 | 0.02 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1021.40 | 1021.45 | -0.05 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 36.00 | 35.60 | 0.40 | ±1 | ok |
| Tokyo Bay | +111 h | temp | 13.20 | 13.24 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +111 h | pres | 1022.30 | 1022.32 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +111 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +111 h | temp | 10.80 | 10.80 | -0.00 | ±0.5 | ok |
| Chile coast | +111 h | pres | 1018.40 | 1018.42 | -0.02 | ±0.5 | ok |
| Chile coast | +111 h | cloud | 2.00 | 1.61 | 0.39 | ±1 | ok |
| Kansas City | +111 h | temp | 12.60 | 12.60 | -0.00 | ±0.5 | ok |
| Kansas City | +111 h | pres | 1014.30 | 1014.34 | -0.04 | ±0.5 | ok |
| Kansas City | +111 h | cloud | 19.00 | 18.53 | 0.47 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T05:23:18Z (3.7 h before this check), valid hour 2026-10-31T09:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 8.40 | — | — | ±0.2 | not recorded by this build | 8.40 | -0.00 |
| node 52N 0E (London) | +0 h | 12.90 | — | — | ±0.2 | not recorded by this build | 12.90 | -0.00 |
| node 40N 116E (Beijing) | +0 h | 34.70 | — | — | ±0.2 | not recorded by this build | 34.70 | 0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":129,"2024 24-h mean":10,"2012 hourly":144,"2012 24-h mean":46}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 10.9 | 15.1 | 61 | 54 | 62 | 45 | 57 |
| Miami | 3.9 | 5.5 | 36 | 22 | 31 | 16 | 23 |
| Denver | 19.5 | 18.2 | 67 | 70 | 68 | 67 | 64 |
| London | 18.5 | 9.7 | 51 | 69 | 52 | 64 | 40 |
| Delhi | 31.3 | 42.5 | 116 | 92 | 118 | 91 | 118 |
| node 28N 76E (Delhi) | 8.4 | 28.5 | 87 | 47 | 87 | 35 | 85 |
| node 52N 0E (London) | 12.9 | 7.8 | 43 | 58 | 43 | 53 | 33 |
| node 40N 116E (Beijing) | 34.7 | 30.8 | 91 | 99 | 91 | 99 | 90 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 17 °Cat 2 m39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC | 7 km/hfrom S39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC | 0.6 mm/hpast hour · area avg39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC | 100 %area average39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC | 1022 hPasea level39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC | 9.9 µg/m³Moderate · AQI 57 (24 h)39.1°N 94.5°W · Sat 09:00 local · 09:00 UTC |
| Miami | 26 °Cat 2 m25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC | 20 km/hfrom E25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC | 0.2 mm/hpast hour · area avg25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC | 7 %area average25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC | 1015 hPasea level25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC | 9.0 µg/m³Good · AQI 47 (24 h)25.7°N 80.1°W · Sat 09:00 local · 09:00 UTC |
| Denver | 8 °Cat 2 m39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC | 8 km/hfrom NNW39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC | 100 %area average39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC | 1013 hPasea level39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC | 1.2 µg/m³Good · AQI 47 (24 h)39.7°N 104.9°W · Sat 09:00 local · 09:00 UTC |
| London | 11 °Cat 2 m51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC | 10 km/hfrom E51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC | 62 %area average51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC | 13 µg/m³Moderate · AQI 42 (24 h)51.5°N 0.1°W · Sat 09:00 local · 09:00 UTC |
| Delhi | 29 °Cat 2 m28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC | 9 km/hfrom NNW28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC | 8 %area average28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC | 12 µg/m³Moderate · AQI 90 (24 h)28.6°N 77.2°E · Sat 09:00 local · 09:00 UTC |
