# Accuracy check (7-day)

Generated 2026-10-31T00:05:14.407Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-30T18:00:00.000Z, timeline +0 h = 2026-10-31T00:00:00.000Z (f006); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 49 / 8 / 3
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 44 / 14 / 2
- Open-Meteo gfs_seamless (uses HRRR over the US): 39 / 19 / 2
- Open-Meteo cams_global at the cities: 6 / 4 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 24 / 4 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 0 / 3 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| US test city | +0 h | temp °C | 13.0 | GFS 0.25° raw 13.7 | -0.7 | ±0.7 | **FAIL** |
| US test city | +0 h | wind km/h | 11.8 | GFS 0.25° raw 10.9 | 0.9 | ±3 | ok |
| US test city | +0 h | wind from ° | 44 | GFS 0.25° raw 44 | 0 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 79 | GFS 0.25° raw 79 | 0 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1027.7 | GFS 0.25° raw 1027.6 | 0.1 | ±0.5 | ok |
| US test city | +0 h | temp °C | 13.0 | stored grid 13.0 | 0.0 | ±0.15 | ok |
| US test city | +0 h | wind km/h | 11.8 | stored grid 11.6 | 0.2 | ±1 | ok |
| US test city | +0 h | cloud % | 79 | stored grid 79 | 0 | ±1 | ok |
| US test city | +0 h | pressure hPa | 1027.67 | stored grid 1027.68 | -0.01 | ±0.1 | ok |
| US test city | +0 h | temp °C | 13.0 | gfs_global 15.6 | -2.6 | ±1 | **FAIL** |
| US test city | +0 h | wind km/h | 11.8 | gfs_global 9.4 | 2.4 | ±3 | ok |
| US test city | +0 h | wind from ° | 44 | gfs_global 47 | 3 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 79 | gfs_global 76 | 3 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1027.7 | gfs_global 1027.8 | -0.1 | ±1 | ok |
| US test city | +0 h | temp °C | 13.0 | gfs_seamless 14.1 | -1.1 | ±1 | **FAIL** |
| US test city | +0 h | wind km/h | 11.8 | gfs_seamless 7.6 | 4.2 | ±3 | **FAIL** |
| US test city | +0 h | wind from ° | 44 | gfs_seamless 40 | 4 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 79 | gfs_seamless 0 | 79 | ±15 | **FAIL** |
| US test city | +0 h | pressure hPa | 1027.7 | gfs_seamless 1026.9 | 0.8 | ±1 | ok |
| US test city | +0 h | PM2.5 µg/m³ | 6.1 | cams_global 8.1 | -2.0 | ±3 | ok |
| US test city | +0 h | temp °C | 13.0 | NWS 13.9 | -0.9 | ±3 | ok |
| US test city | +0 h | wind km/h | 11.8 | NWS 7.4 | 4.4 | ±8 | ok |
| US test city | +0 h | cloud % | 79 | NWS 34 | 45 | ±30 | **FAIL** |
| US test city | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| US test city | +24 h | temp °C | 14.1 | GFS 0.25° raw 14.8 | -0.8 | ±0.7 | **FAIL** |
| US test city | +24 h | wind km/h | 15.9 | GFS 0.25° raw 13.8 | 2.0 | ±3 | ok |
| US test city | +24 h | wind from ° | 115 | GFS 0.25° raw 113 | 2 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| US test city | +24 h | pressure hPa | 1028.5 | GFS 0.25° raw 1028.4 | 0.0 | ±0.5 | ok |
| US test city | +24 h | temp °C | 14.1 | stored grid 14.1 | -0.1 | ±0.15 | ok |
| US test city | +24 h | wind km/h | 15.9 | stored grid 15.8 | 0.1 | ±1 | ok |
| US test city | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| US test city | +24 h | pressure hPa | 1028.45 | stored grid 1028.43 | 0.03 | ±0.1 | ok |
| US test city | +24 h | temp °C | 14.1 | gfs_global 15.6 | -1.5 | ±1 | **FAIL** |
| US test city | +24 h | wind km/h | 15.9 | gfs_global 12.4 | 3.5 | ±3 | **FAIL** |
| US test city | +24 h | wind from ° | 115 | gfs_global 116 | 1 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| US test city | +24 h | pressure hPa | 1028.5 | gfs_global 1028.3 | 0.2 | ±1 | ok |
| US test city | +24 h | temp °C | 14.1 | gfs_seamless 14.8 | -0.7 | ±1 | ok |
| US test city | +24 h | wind km/h | 15.9 | gfs_seamless 7.5 | 8.4 | ±3 | **FAIL** |
| US test city | +24 h | wind from ° | 115 | gfs_seamless 63 | 52 | ±20 | **FAIL** |
| US test city | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| US test city | +24 h | pressure hPa | 1028.5 | gfs_seamless 1029.0 | -0.5 | ±1 | ok |
| US test city | +24 h | PM2.5 µg/m³ | 5.5 | cams_global 4.0 | 1.5 | ±3 | ok |
| US test city | +24 h | temp °C | 14.1 | NWS 16.7 | -2.6 | ±3 | ok |
| US test city | +24 h | wind km/h | 15.9 | NWS 13.0 | 2.9 | ±8 | ok |
| US test city | +24 h | cloud % | 100 | NWS 94 | 6 | ±30 | ok |
| US test city | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| US test city | +114 h | temp °C | 17.3 | GFS 0.25° raw 17.4 | -0.1 | ±0.7 | ok |
| US test city | +114 h | wind km/h | 26.1 | GFS 0.25° raw 24.6 | 1.5 | ±3 | ok |
| US test city | +114 h | wind from ° | 179 | GFS 0.25° raw 177 | 2 | ±20 | ok |
| US test city | +114 h | precip mm/h | 0.84 | GFS 0.25° raw 0.45 | 0.39 | ±0.3 | **FAIL** |
| US test city | +114 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| US test city | +114 h | pressure hPa | 1010.9 | GFS 0.25° raw 1010.9 | 0.0 | ±0.5 | ok |
| US test city | +114 h | temp °C | 17.3 | stored grid 17.3 | -0.0 | ±0.15 | ok |
| US test city | +114 h | wind km/h | 26.1 | stored grid 25.9 | 0.2 | ±1 | ok |
| US test city | +114 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| US test city | +114 h | pressure hPa | 1010.89 | stored grid 1010.88 | 0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.9 | GFS 0.25° raw 27.3 | -0.4 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 20.4 | GFS 0.25° raw 21.3 | -0.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 84 | GFS 0.25° raw 83 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | GFS 0.25° raw 0.09 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | GFS 0.25° raw 6 | 1 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1014.7 | GFS 0.25° raw 1014.7 | -0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.9 | stored grid 26.9 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 20.4 | stored grid 20.2 | 0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 8 | stored grid 8 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1014.69 | stored grid 1014.68 | 0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.9 | gfs_global 27.5 | -0.6 | ±1 | ok |
| Miami | +0 h | wind km/h | 20.4 | gfs_global 20.5 | -0.1 | ±3 | ok |
| Miami | +0 h | wind from ° | 84 | gfs_global 79 | 5 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | gfs_global 0.00 | 0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | gfs_global 11 | -3 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1014.7 | gfs_global 1014.7 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.9 | gfs_seamless 25.5 | 1.4 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 20.4 | gfs_seamless 10.9 | 9.5 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 84 | gfs_seamless 95 | 11 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | gfs_seamless 0.00 | 0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 8 | gfs_seamless 3 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1014.7 | gfs_seamless 1014.5 | 0.2 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 8.3 | cams_global 5.6 | 2.7 | ±3 | ok |
| Miami | +0 h | temp °C | 26.9 | NWS 27.2 | -0.3 | ±3 | ok |
| Miami | +0 h | wind km/h | 20.4 | NWS 18.5 | 1.9 | ±8 | ok |
| Miami | +0 h | cloud % | 8 | NWS 43 | -35 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.13 | NWS 0.25 | -0.12 | ±1 | ok |
| Miami | +24 h | temp °C | 26.6 | GFS 0.25° raw 26.9 | -0.4 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 26.3 | GFS 0.25° raw 28.9 | -2.6 | ±3 | ok |
| Miami | +24 h | wind from ° | 79 | GFS 0.25° raw 80 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.71 | GFS 0.25° raw 1.62 | -0.91 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 81 | GFS 0.25° raw 82 | -1 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.7 | GFS 0.25° raw 1017.7 | 0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.6 | stored grid 26.6 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 26.3 | stored grid 26.2 | 0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 81 | stored grid 81 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1017.71 | stored grid 1017.72 | -0.01 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.6 | gfs_global 27.1 | -0.5 | ±1 | ok |
| Miami | +24 h | wind km/h | 26.3 | gfs_global 30.7 | -4.4 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 79 | gfs_global 81 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.71 | gfs_global 2.50 | -1.79 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 81 | gfs_global 100 | -19 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1017.7 | gfs_global 1017.8 | -0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.6 | gfs_seamless 25.1 | 1.5 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 26.3 | gfs_seamless 10.5 | 15.8 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 79 | gfs_seamless 79 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.71 | gfs_seamless 0.00 | 0.71 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 81 | gfs_seamless 100 | -19 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1017.7 | gfs_seamless 1017.8 | -0.1 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 7.9 | cams_global 6.0 | 1.9 | ±3 | ok |
| Miami | +24 h | temp °C | 26.6 | NWS 26.7 | -0.1 | ±3 | ok |
| Miami | +24 h | wind km/h | 26.3 | NWS 27.8 | -1.5 | ±8 | ok |
| Miami | +24 h | cloud % | 81 | NWS 81 | 0 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.71 | NWS 0.93 | -0.22 | ±1 | ok |
| Miami | +114 h | temp °C | 26.7 | GFS 0.25° raw 27.2 | -0.5 | ±0.7 | ok |
| Miami | +114 h | wind km/h | 22.6 | GFS 0.25° raw 25.3 | -2.6 | ±3 | ok |
| Miami | +114 h | wind from ° | 89 | GFS 0.25° raw 97 | 7 | ±20 | ok |
| Miami | +114 h | precip mm/h | 0.23 | GFS 0.25° raw 0.10 | 0.14 | ±0.3 | ok |
| Miami | +114 h | cloud % | 97 | GFS 0.25° raw 87 | 10 | ±15 | ok |
| Miami | +114 h | pressure hPa | 1012.6 | GFS 0.25° raw 1012.6 | 0.0 | ±0.5 | ok |
| Miami | +114 h | temp °C | 26.7 | stored grid 26.7 | 0.0 | ±0.15 | ok |
| Miami | +114 h | wind km/h | 22.6 | stored grid 22.7 | -0.1 | ±1 | ok |
| Miami | +114 h | cloud % | 97 | stored grid 98 | -0 | ±1 | ok |
| Miami | +114 h | pressure hPa | 1012.62 | stored grid 1012.62 | 0.00 | ±0.1 | ok |
| Denver | +0 h | temp °C | 13.6 | GFS 0.25° raw 16.8 | -3.2 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 13.1 | GFS 0.25° raw 12.7 | 0.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 35 | GFS 0.25° raw 33 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | GFS 0.25° raw 100 | -0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.9 | GFS 0.25° raw 1011.5 | 0.5 | ±0.5 | ok |
| Denver | +0 h | temp °C | 13.6 | stored grid 13.6 | -0.1 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 13.1 | stored grid 12.8 | 0.2 | ±1 | ok |
| Denver | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1011.94 | stored grid 1011.95 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 13.6 | gfs_global 17.2 | -3.6 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 13.1 | gfs_global 12.7 | 0.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 35 | gfs_global 35 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_global 100 | -0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.9 | gfs_global 1009.3 | 2.6 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 13.6 | gfs_seamless 14.8 | -1.2 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 13.1 | gfs_seamless 10.0 | 3.1 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 35 | gfs_seamless 16 | 19 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_seamless 90 | 10 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.9 | gfs_seamless 1009.9 | 2.0 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 4.2 | cams_global 11.6 | -7.4 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 13.6 | NWS 16.1 | -2.5 | ±3 | ok |
| Denver | +0 h | wind km/h | 13.1 | NWS 9.3 | 3.8 | ±8 | ok |
| Denver | +0 h | cloud % | 100 | NWS 45 | 55 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 12.4 | GFS 0.25° raw 15.9 | -3.5 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 9.0 | GFS 0.25° raw 9.1 | -0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 52 | GFS 0.25° raw 53 | 1 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 43 | GFS 0.25° raw 63 | -20 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.4 | 0.3 | ±0.5 | ok |
| Denver | +24 h | temp °C | 12.4 | stored grid 12.5 | -0.1 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 9.0 | stored grid 9.2 | -0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 43 | stored grid 43 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1011.67 | stored grid 1011.71 | -0.04 | ±0.1 | ok |
| Denver | +24 h | temp °C | 12.4 | gfs_global 16.4 | -4.0 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.0 | gfs_global 9.4 | -0.4 | ±3 | ok |
| Denver | +24 h | wind from ° | 52 | gfs_global 58 | 6 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 43 | gfs_global 7 | 36 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1011.7 | gfs_global 1009.7 | 2.0 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 12.4 | gfs_seamless 12.7 | -0.3 | ±1 | ok |
| Denver | +24 h | wind km/h | 9.0 | gfs_seamless 6.1 | 2.9 | ±3 | ok |
| Denver | +24 h | wind from ° | 52 | gfs_seamless 57 | 5 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 43 | gfs_seamless 1 | 42 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1011.7 | gfs_seamless 1012.7 | -1.0 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 2.7 | cams_global 12.8 | -10.1 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 12.4 | NWS 15.0 | -2.6 | ±3 | ok |
| Denver | +24 h | wind km/h | 9.0 | NWS 5.6 | 3.5 | ±8 | ok |
| Denver | +24 h | cloud % | 43 | NWS 16 | 27 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +114 h | temp °C | 16.7 | GFS 0.25° raw 15.6 | 1.1 | ±0.7 | **FAIL** |
| Denver | +114 h | wind km/h | 5.4 | GFS 0.25° raw 5.0 | 0.4 | ±3 | ok |
| Denver | +114 h | wind from ° | 46 | GFS 0.25° raw 43 | — | ±20 | calm |
| Denver | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Denver | +114 h | pressure hPa | 1005.6 | GFS 0.25° raw 1006.4 | -0.8 | ±0.5 | **FAIL** |
| Denver | +114 h | temp °C | 16.7 | stored grid 16.7 | 0.0 | ±0.15 | ok |
| Denver | +114 h | wind km/h | 5.4 | stored grid 5.3 | 0.1 | ±1 | ok |
| Denver | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Denver | +114 h | pressure hPa | 1005.59 | stored grid 1005.58 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.9 | GFS 0.25° raw 10.9 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 8.8 | GFS 0.25° raw 6.1 | 2.6 | ±3 | ok |
| London | +0 h | wind from ° | 79 | GFS 0.25° raw 70 | 9 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 45 | GFS 0.25° raw 40 | 5 | ±15 | ok |
| London | +0 h | pressure hPa | 1030.5 | GFS 0.25° raw 1030.6 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 10.9 | stored grid 10.8 | 0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 8.8 | stored grid 8.6 | 0.2 | ±1 | ok |
| London | +0 h | cloud % | 45 | stored grid 45 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1030.54 | stored grid 1030.55 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.9 | gfs_global 11.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.8 | gfs_global 5.8 | 3.0 | ±3 | ok |
| London | +0 h | wind from ° | 79 | gfs_global 68 | 11 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 45 | gfs_global 17 | 28 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.5 | gfs_global 1030.5 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 10.9 | gfs_seamless 11.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.8 | gfs_seamless 5.8 | 3.0 | ±3 | ok |
| London | +0 h | wind from ° | 79 | gfs_seamless 68 | 11 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 45 | gfs_seamless 17 | 28 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.5 | gfs_seamless 1030.5 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.9 | cams_global 10.5 | 2.4 | ±3 | ok |
| London | +24 h | temp °C | 10.1 | GFS 0.25° raw 10.2 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 4.0 | GFS 0.25° raw 3.6 | 0.4 | ±3 | ok |
| London | +24 h | wind from ° | 32 | GFS 0.25° raw 47 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | GFS 0.25° raw 5 | 0 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | GFS 0.25° raw 1032.3 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.1 | stored grid 10.0 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 4.0 | stored grid 3.9 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 5 | stored grid 5 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.33 | stored grid 1032.35 | -0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.1 | gfs_global 10.3 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 4.0 | gfs_global 3.6 | 0.4 | ±3 | ok |
| London | +24 h | wind from ° | 32 | gfs_global 53 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_global 13 | -8 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | gfs_global 1032.3 | 0.0 | ±1 | ok |
| London | +24 h | temp °C | 10.1 | gfs_seamless 10.3 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 4.0 | gfs_seamless 3.6 | 0.4 | ±3 | ok |
| London | +24 h | wind from ° | 32 | gfs_seamless 53 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_seamless 13 | -8 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | gfs_seamless 1032.3 | 0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 25.2 | cams_global 27.6 | -2.4 | ±3 | ok |
| London | +114 h | temp °C | 9.7 | GFS 0.25° raw 9.8 | -0.1 | ±0.7 | ok |
| London | +114 h | wind km/h | 22.6 | GFS 0.25° raw 19.8 | 2.8 | ±3 | ok |
| London | +114 h | wind from ° | 58 | GFS 0.25° raw 56 | 3 | ±20 | ok |
| London | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +114 h | cloud % | 8 | GFS 0.25° raw 4 | 4 | ±15 | ok |
| London | +114 h | pressure hPa | 1032.2 | GFS 0.25° raw 1032.3 | -0.0 | ±0.5 | ok |
| London | +114 h | temp °C | 9.7 | stored grid 9.7 | -0.0 | ±0.15 | ok |
| London | +114 h | wind km/h | 22.6 | stored grid 22.4 | 0.2 | ±1 | ok |
| London | +114 h | cloud % | 8 | stored grid 8 | -0 | ±1 | ok |
| London | +114 h | pressure hPa | 1032.23 | stored grid 1032.27 | -0.04 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 20.9 | GFS 0.25° raw 22.0 | -1.1 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.7 | GFS 0.25° raw 7.7 | -1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | GFS 0.25° raw 322 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.1 | GFS 0.25° raw 1017.1 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 20.9 | stored grid 20.9 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 6.7 | stored grid 7.0 | -0.4 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.13 | stored grid 1017.16 | -0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 20.9 | gfs_global 22.7 | -1.8 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.7 | gfs_global 8.6 | -1.9 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | gfs_global 327 | 9 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.1 | gfs_global 1017.4 | -0.3 | ±1 | ok |
| Delhi | +0 h | temp °C | 20.9 | gfs_seamless 22.7 | -1.8 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.7 | gfs_seamless 8.6 | -1.9 | ±3 | ok |
| Delhi | +0 h | wind from ° | 318 | gfs_seamless 327 | 9 | ±20 | ok |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.1 | gfs_seamless 1017.4 | -0.3 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 35.6 | cams_global 42.3 | -6.7 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.0 | GFS 0.25° raw 23.5 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.9 | GFS 0.25° raw 4.4 | -0.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 245 | GFS 0.25° raw 246 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.4 | GFS 0.25° raw 1015.3 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.0 | stored grid 22.0 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 3.9 | stored grid 4.1 | -0.2 | ±1 | ok |
| Delhi | +24 h | cloud % | 1 | stored grid 1 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.38 | stored grid 1015.39 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.0 | gfs_global 24.4 | -2.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.9 | gfs_global 4.7 | -0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 245 | gfs_global 238 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_global 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.4 | gfs_global 1015.3 | 0.1 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.0 | gfs_seamless 24.4 | -2.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.9 | gfs_seamless 4.7 | -0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 245 | gfs_seamless 238 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_seamless 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.4 | gfs_seamless 1015.3 | 0.1 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 60.2 | cams_global 56.3 | 3.9 | ±3 | **FAIL** |
| Delhi | +114 h | temp °C | 25.1 | GFS 0.25° raw 26.8 | -1.7 | ±0.7 | **FAIL** |
| Delhi | +114 h | wind km/h | 5.5 | GFS 0.25° raw 5.0 | 0.6 | ±3 | ok |
| Delhi | +114 h | wind from ° | 173 | GFS 0.25° raw 173 | — | ±20 | calm |
| Delhi | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +114 h | pressure hPa | 1014.8 | GFS 0.25° raw 1014.7 | 0.0 | ±0.5 | ok |
| Delhi | +114 h | temp °C | 25.1 | stored grid 25.1 | 0.0 | ±0.15 | ok |
| Delhi | +114 h | wind km/h | 5.5 | stored grid 5.3 | 0.2 | ±1 | ok |
| Delhi | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +114 h | pressure hPa | 1014.78 | stored grid 1014.80 | -0.03 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| US test city | +0 h | 12.96 | 13.74 | -0.78 | 11.6 | 10.9 | 0.8 | 79 | 79 |
| US test city | +24 h | 14.11 | 14.81 | -0.69 | 15.8 | 13.8 | 2.0 | 100 | 100 |
| US test city | +114 h (f120) | 17.34 | 17.42 | -0.08 | 25.9 | 24.6 | 1.3 | 100 | 100 |
| Miami | +0 h | 26.89 | 27.32 | -0.43 | 20.2 | 21.3 | -1.1 | 8 | 6 |
| Miami | +24 h | 26.58 | 26.93 | -0.35 | 26.2 | 28.9 | -2.7 | 81 | 82 |
| Miami | +114 h (f120) | 26.68 | 27.21 | -0.53 | 22.7 | 25.3 | -2.5 | 98 | 87 |
| Denver | +0 h | 13.61 | 16.77 | -3.16 | 12.8 | 12.7 | 0.1 | 100 | 100 |
| Denver | +24 h | 12.52 | 15.92 | -3.40 | 9.2 | 9.1 | 0.1 | 43 | 63 |
| Denver | +114 h (f120) | 16.69 | 15.60 | 1.09 | 5.3 | 5.0 | 0.3 | 0 | 0 |
| London | +0 h | 10.85 | 10.91 | -0.06 | 8.6 | 6.1 | 2.5 | 45 | 40 |
| London | +24 h | 10.04 | 10.17 | -0.13 | 3.9 | 3.6 | 0.3 | 5 | 5 |
| London | +114 h (f120) | 9.73 | 9.77 | -0.04 | 22.4 | 19.8 | 2.6 | 8 | 4 |
| Delhi | +0 h | 20.90 | 22.04 | -1.14 | 7.0 | 7.7 | -0.7 | 0 | 0 |
| Delhi | +24 h | 22.00 | 23.52 | -1.52 | 4.1 | 4.4 | -0.3 | 1 | 0 |
| Delhi | +114 h (f120) | 25.06 | 26.77 | -1.71 | 5.3 | 5.0 | 0.4 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 18.80 | 18.87 | -0.07 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1010.80 | 1010.82 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 17.00 | 17.39 | -0.39 | ±1 | ok |
| Chile coast | +0 h | temp | 13.40 | 13.32 | 0.08 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1014.70 | 1014.66 | 0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 99.00 | 99.26 | -0.26 | ±1 | ok |
| US test city | +0 h | temp | 12.80 | 12.84 | -0.04 | ±0.5 | ok |
| US test city | +0 h | pres | 1027.90 | 1027.93 | -0.03 | ±0.5 | ok |
| US test city | +0 h | cloud | 69.00 | 68.81 | 0.19 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 16.80 | 16.71 | 0.09 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1020.70 | 1020.70 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 58.00 | 58.16 | -0.16 | ±1 | ok |
| Chile coast | +24 h | temp | 12.80 | 12.85 | -0.05 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1015.60 | 1015.65 | -0.05 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 40.00 | 39.51 | 0.49 | ±1 | ok |
| US test city | +24 h | temp | 14.00 | 14.04 | -0.04 | ±0.5 | ok |
| US test city | +24 h | pres | 1028.70 | 1028.70 | -0.00 | ±0.5 | ok |
| US test city | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +114 h | temp | 12.40 | 12.45 | -0.05 | ±0.5 | ok |
| Tokyo Bay | +114 h | pres | 1026.40 | 1026.40 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +114 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +114 h | temp | 18.40 | 18.35 | 0.05 | ±0.5 | ok |
| Chile coast | +114 h | pres | 1016.30 | 1016.29 | 0.01 | ±0.5 | ok |
| Chile coast | +114 h | cloud | 3.00 | 3.02 | -0.02 | ±1 | ok |
| US test city | +114 h | temp | 17.20 | 17.25 | -0.05 | ±0.5 | ok |
| US test city | +114 h | pres | 1011.00 | 1011.03 | -0.03 | ±0.5 | ok |
| US test city | +114 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 40.70 | 46.80 | -6.10 | ±0.2 | **FAIL** |
| node 52N 0E (London) | +0 h | 13.30 | 8.80 | 4.50 | ±0.2 | **FAIL** |
| node 40N 116E (Beijing) | +0 h | 76.60 | 77.50 | -0.90 | ±0.2 | **FAIL** |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":165,"2024 24-h mean":16,"2012 hourly":174,"2012 24-h mean":55}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| US test city | 8.1 | 5.4 | 33 | 45 | 29 | 34 | 22 |
| Miami | 5.6 | 6.3 | 36 | 31 | 35 | 23 | 26 |
| Denver | 11.6 | 17.3 | 66 | 56 | 66 | 48 | 62 |
| London | 10.5 | 10.0 | 52 | 54 | 52 | 44 | 41 |
| Delhi | 42.3 | 35.8 | 98 | 118 | 102 | 118 | 102 |
| node 28N 76E (Delhi) | 46.8 | 25.2 | 78 | 129 | 81 | 129 | 79 |
| node 52N 0E (London) | 8.8 | 7.8 | 44 | 49 | 43 | 37 | 33 |
| node 40N 116E (Beijing) | 77.5 | 38.9 | 106 | 166 | 109 | 162 | 109 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| US test city | 13 °Cat 2 m·US test city | 12 km/hfrom NE·US test city | Drypast hour · area avg·US test city | 79 %area average·US test city | 1028 hPasea level·US test city | 6.1 µg/m³Good · AQI 34 (24 h)·US test city |
| Miami | 27 °Cat 2 m·25.7°N 80.1°W | 20 km/hfrom E·25.7°N 80.1°W | 0.1 mm/hpast hour · area avg·25.7°N 80.1°W | 8 %area average·25.7°N 80.1°W | 1015 hPasea level·25.7°N 80.1°W | 8.3 µg/m³Good · AQI 41 (24 h)·25.7°N 80.1°W |
| Denver | 14 °Cat 2 m·39.7°N 104.9°W | 13 km/hfrom NE·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 100 %area average·39.7°N 104.9°W | 1012 hPasea level·39.7°N 104.9°W | 4.2 µg/m³Good · AQI 53 (24 h)·39.7°N 104.9°W |
| London | 11 °Cat 2 m·51.5°N 0.1°W | 9 km/hfrom E·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 45 %area average·51.5°N 0.1°W | 1031 hPasea level·51.5°N 0.1°W | 13 µg/m³Moderate · AQI 53 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 7 km/hfrom NW·28.6°N 77.2°E | Drypast hour · area avg·28.6°N 77.2°E | 0 %area average·28.6°N 77.2°E | 1017 hPasea level·28.6°N 77.2°E | 36 µg/m³Sensitive groups · AQI 84 (24 h)·28.6°N 77.2°E |
