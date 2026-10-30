# Accuracy check (after)

Generated 2026-10-30T21:56:56.106Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-30T18:00:00.000Z, timeline +0 h = 2026-10-30T21:00:00.000Z (f003); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding): 52 / 5 / 3
- Page vs the stored grid before encoding (encoding only): 40 / 0 / 0
- Open-Meteo gfs_global: 45 / 12 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 39 / 18 / 3
- Open-Meteo cams_global at the cities: 4 / 6 / 0
- NWS gridpoints (sanity check): 22 / 2 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 0 / 3 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 18.7 | GFS 0.25° raw 19.1 | -0.3 | ±0.7 | ok |
| Dayton OH | +0 h | wind km/h | 10.9 | GFS 0.25° raw 10.2 | 0.7 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 51 | GFS 0.25° raw 46 | 5 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 27 | GFS 0.25° raw 6 | 21 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.7 | GFS 0.25° raw 1025.6 | 0.1 | ±0.5 | ok |
| Dayton OH | +0 h | temp °C | 18.7 | stored grid 18.7 | 0.0 | ±0.15 | ok |
| Dayton OH | +0 h | wind km/h | 10.9 | stored grid 11.0 | -0.1 | ±1 | ok |
| Dayton OH | +0 h | cloud % | 27 | stored grid 27 | 0 | ±1 | ok |
| Dayton OH | +0 h | pressure hPa | 1025.67 | stored grid 1025.68 | -0.01 | ±0.1 | ok |
| Dayton OH | +0 h | temp °C | 18.7 | gfs_global 19.8 | -1.1 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 10.9 | gfs_global 10.7 | 0.2 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 51 | gfs_global 45 | 6 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 27 | gfs_global 11 | 16 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.7 | gfs_global 1025.5 | 0.2 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 18.7 | gfs_seamless 20.5 | -1.8 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 10.9 | gfs_seamless 8.4 | 2.5 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 51 | gfs_seamless 52 | 1 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 27 | gfs_seamless 8 | 19 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.7 | gfs_seamless 1024.9 | 0.8 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 3.4 | cams_global 5.1 | -1.7 | ±3 | ok |
| Dayton OH | +0 h | temp °C | 18.7 | NWS 20.0 | -1.3 | ±3 | ok |
| Dayton OH | +0 h | wind km/h | 10.9 | NWS 11.1 | -0.2 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 27 | NWS 6 | 21 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 16.9 | GFS 0.25° raw 16.8 | 0.1 | ±0.7 | ok |
| Dayton OH | +24 h | wind km/h | 16.3 | GFS 0.25° raw 14.9 | 1.3 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 115 | GFS 0.25° raw 115 | 0 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.3 | GFS 0.25° raw 1027.3 | -0.1 | ±0.5 | ok |
| Dayton OH | +24 h | temp °C | 16.9 | stored grid 16.8 | 0.1 | ±0.15 | ok |
| Dayton OH | +24 h | wind km/h | 16.3 | stored grid 16.2 | 0.1 | ±1 | ok |
| Dayton OH | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.29 | stored grid 1027.28 | 0.01 | ±0.1 | ok |
| Dayton OH | +24 h | temp °C | 16.9 | gfs_global 18.4 | -1.5 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 16.3 | gfs_global 13.6 | 2.7 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 115 | gfs_global 107 | 8 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.3 | gfs_global 1026.7 | 0.6 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 16.9 | gfs_seamless 19.8 | -2.9 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 16.3 | gfs_seamless 12.7 | 3.6 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind from ° | 115 | gfs_seamless 106 | 9 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.3 | gfs_seamless 1027.7 | -0.4 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 4.5 | cams_global 3.4 | 1.1 | ±3 | ok |
| Dayton OH | +24 h | temp °C | 16.9 | NWS 18.9 | -2.0 | ±3 | ok |
| Dayton OH | +24 h | wind km/h | 16.3 | NWS 13.0 | 3.3 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 100 | NWS 91 | 9 | ±30 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 28.2 | GFS 0.25° raw 28.5 | -0.3 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 16.6 | GFS 0.25° raw 16.8 | -0.2 | ±3 | ok |
| Miami | +0 h | wind from ° | 88 | GFS 0.25° raw 89 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.17 | GFS 0.25° raw 0.06 | 0.11 | ±0.3 | ok |
| Miami | +0 h | cloud % | 14 | GFS 0.25° raw 10 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.9 | GFS 0.25° raw 1012.9 | -0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 28.2 | stored grid 28.2 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 16.6 | stored grid 16.3 | 0.3 | ±1 | ok |
| Miami | +0 h | cloud % | 14 | stored grid 14 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1012.89 | stored grid 1012.91 | -0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.2 | gfs_global 28.8 | -0.6 | ±1 | ok |
| Miami | +0 h | wind km/h | 16.6 | gfs_global 15.2 | 1.4 | ±3 | ok |
| Miami | +0 h | wind from ° | 88 | gfs_global 83 | 5 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.17 | gfs_global 0.10 | 0.07 | ±0.3 | ok |
| Miami | +0 h | cloud % | 14 | gfs_global 23 | -9 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.9 | gfs_global 1012.9 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 28.2 | gfs_seamless 27.7 | 0.5 | ±1 | ok |
| Miami | +0 h | wind km/h | 16.6 | gfs_seamless 12.5 | 4.1 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 88 | gfs_seamless 89 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.17 | gfs_seamless 0.00 | 0.17 | ±0.3 | ok |
| Miami | +0 h | cloud % | 14 | gfs_seamless 9 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.9 | gfs_seamless 1014.2 | -1.3 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 7.6 | cams_global 6.6 | 1.0 | ±3 | ok |
| Miami | +0 h | temp °C | 28.2 | NWS 28.3 | -0.1 | ±3 | ok |
| Miami | +0 h | wind km/h | 16.6 | NWS 18.5 | -1.9 | ±8 | ok |
| Miami | +0 h | cloud % | 14 | NWS 54 | -40 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.17 | NWS 0.13 | 0.04 | ±1 | ok |
| Miami | +24 h | temp °C | 27.5 | GFS 0.25° raw 27.7 | -0.2 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 23.4 | GFS 0.25° raw 24.6 | -1.2 | ±3 | ok |
| Miami | +24 h | wind from ° | 80 | GFS 0.25° raw 84 | 4 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.67 | GFS 0.25° raw 1.14 | -0.47 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | GFS 0.25° raw 1016.2 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 27.5 | stored grid 27.5 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 23.4 | stored grid 23.5 | -0.1 | ±1 | ok |
| Miami | +24 h | cloud % | 97 | stored grid 97 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.20 | stored grid 1016.18 | 0.02 | ±0.1 | ok |
| Miami | +24 h | temp °C | 27.5 | gfs_global 27.8 | -0.3 | ±1 | ok |
| Miami | +24 h | wind km/h | 23.4 | gfs_global 27.6 | -4.2 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 80 | gfs_global 75 | 5 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.67 | gfs_global 0.80 | -0.13 | ±0.3 | ok |
| Miami | +24 h | cloud % | 97 | gfs_global 100 | -3 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_global 1016.3 | -0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 27.5 | gfs_seamless 26.9 | 0.6 | ±1 | ok |
| Miami | +24 h | wind km/h | 23.4 | gfs_seamless 13.2 | 10.2 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 80 | gfs_seamless 71 | 9 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.67 | gfs_seamless 0.00 | 0.67 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 97 | gfs_seamless 100 | -3 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_seamless 1017.3 | -1.1 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 8.9 | cams_global 5.9 | 3.0 | ±3 | ok |
| Miami | +24 h | temp °C | 27.5 | NWS 27.8 | -0.2 | ±3 | ok |
| Miami | +24 h | wind km/h | 23.4 | NWS 27.8 | -4.4 | ±8 | ok |
| Miami | +24 h | cloud % | 97 | NWS 77 | 20 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.67 | NWS 0.64 | 0.04 | ±1 | ok |
| Denver | +0 h | temp °C | 18.6 | GFS 0.25° raw 18.8 | -0.2 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 9.1 | GFS 0.25° raw 9.3 | -0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 49 | GFS 0.25° raw 51 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | GFS 0.25° raw 67 | -7 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1011.2 | GFS 0.25° raw 1011.2 | -0.0 | ±0.5 | ok |
| Denver | +0 h | temp °C | 18.6 | stored grid 18.6 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 9.1 | stored grid 8.9 | 0.2 | ±1 | ok |
| Denver | +0 h | cloud % | 60 | stored grid 60 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1011.16 | stored grid 1011.18 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 18.6 | gfs_global 20.0 | -1.4 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 9.1 | gfs_global 9.0 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 49 | gfs_global 67 | 18 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | gfs_global 100 | -40 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.2 | gfs_global 1007.6 | 3.6 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 18.6 | gfs_seamless 18.0 | 0.6 | ±1 | ok |
| Denver | +0 h | wind km/h | 9.1 | gfs_seamless 10.7 | -1.6 | ±3 | ok |
| Denver | +0 h | wind from ° | 49 | gfs_seamless 38 | 11 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | gfs_seamless 0 | 60 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1011.2 | gfs_seamless 1009.8 | 1.4 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 7.3 | cams_global 13.6 | -6.3 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 18.6 | NWS 18.9 | -0.3 | ±3 | ok |
| Denver | +0 h | wind km/h | 9.1 | NWS 11.1 | -2.0 | ±8 | ok |
| Denver | +0 h | cloud % | 60 | NWS 21 | 39 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 17.1 | GFS 0.25° raw 17.4 | -0.4 | ±0.7 | ok |
| Denver | +24 h | wind km/h | 12.6 | GFS 0.25° raw 13.0 | -0.4 | ±3 | ok |
| Denver | +24 h | wind from ° | 17 | GFS 0.25° raw 18 | 1 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 27 | GFS 0.25° raw 6 | 21 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1010.2 | GFS 0.25° raw 1010.1 | 0.1 | ±0.5 | ok |
| Denver | +24 h | temp °C | 17.1 | stored grid 17.1 | 0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 12.6 | stored grid 12.8 | -0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 27 | stored grid 27 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1010.21 | stored grid 1010.19 | 0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 17.1 | gfs_global 18.0 | -0.9 | ±1 | ok |
| Denver | +24 h | wind km/h | 12.6 | gfs_global 13.7 | -1.1 | ±3 | ok |
| Denver | +24 h | wind from ° | 17 | gfs_global 2 | 15 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 27 | gfs_global 7 | 20 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1010.2 | gfs_global 1006.9 | 3.3 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 17.1 | gfs_seamless 15.2 | 1.9 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 12.6 | gfs_seamless 5.1 | 7.5 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 17 | gfs_seamless 3 | 14 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 27 | gfs_seamless 100 | -73 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1010.2 | gfs_seamless 1011.5 | -1.3 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 2.8 | cams_global 10.7 | -7.9 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 17.1 | NWS 16.7 | 0.4 | ±3 | ok |
| Denver | +24 h | wind km/h | 12.6 | NWS 9.3 | 3.3 | ±8 | ok |
| Denver | +24 h | cloud % | 27 | NWS 35 | -8 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.9 | GFS 0.25° raw 11.8 | 0.0 | ±0.7 | ok |
| London | +0 h | wind km/h | 11.9 | GFS 0.25° raw 11.1 | 0.8 | ±3 | ok |
| London | +0 h | wind from ° | 87 | GFS 0.25° raw 91 | 3 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 57 | GFS 0.25° raw 48 | 9 | ±15 | ok |
| London | +0 h | pressure hPa | 1030.2 | GFS 0.25° raw 1030.2 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.9 | stored grid 11.8 | 0.1 | ±0.15 | ok |
| London | +0 h | wind km/h | 11.9 | stored grid 11.8 | 0.0 | ±1 | ok |
| London | +0 h | cloud % | 57 | stored grid 57 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1030.19 | stored grid 1030.19 | 0.00 | ±0.1 | ok |
| London | +0 h | temp °C | 11.9 | gfs_global 11.8 | 0.1 | ±1 | ok |
| London | +0 h | wind km/h | 11.9 | gfs_global 9.7 | 2.2 | ±3 | ok |
| London | +0 h | wind from ° | 87 | gfs_global 92 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 57 | gfs_global 18 | 39 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.2 | gfs_global 1030.1 | 0.1 | ±1 | ok |
| London | +0 h | temp °C | 11.9 | gfs_seamless 11.8 | 0.1 | ±1 | ok |
| London | +0 h | wind km/h | 11.9 | gfs_seamless 9.7 | 2.2 | ±3 | ok |
| London | +0 h | wind from ° | 87 | gfs_seamless 92 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 57 | gfs_seamless 18 | 39 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.2 | gfs_seamless 1030.1 | 0.1 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.4 | cams_global 8.2 | 4.2 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.7 | GFS 0.25° raw 10.9 | -0.2 | ±0.7 | ok |
| London | +24 h | wind km/h | 5.4 | GFS 0.25° raw 4.8 | 0.6 | ±3 | ok |
| London | +24 h | wind from ° | 65 | GFS 0.25° raw 67 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 84 | GFS 0.25° raw 98 | -13 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | GFS 0.25° raw 1032.4 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.7 | stored grid 10.7 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 5.4 | stored grid 5.4 | 0.0 | ±1 | ok |
| London | +24 h | cloud % | 84 | stored grid 85 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.33 | stored grid 1032.35 | -0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_global 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_global 4.6 | 0.8 | ±3 | ok |
| London | +24 h | wind from ° | 65 | gfs_global 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 84 | gfs_global 83 | 1 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | gfs_global 1032.2 | 0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_seamless 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_seamless 4.6 | 0.8 | ±3 | ok |
| London | +24 h | wind from ° | 65 | gfs_seamless 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 84 | gfs_seamless 83 | 1 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.3 | gfs_seamless 1032.2 | 0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 18.3 | cams_global 22.6 | -4.3 | ±3 | **FAIL** |
| Delhi | +0 h | temp °C | 21.3 | GFS 0.25° raw 22.6 | -1.2 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.7 | GFS 0.25° raw 5.2 | -0.6 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | GFS 0.25° raw 310 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | GFS 0.25° raw 1017.0 | 0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.3 | stored grid 21.4 | -0.1 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 4.7 | stored grid 4.5 | 0.1 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.01 | stored grid 1017.03 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_global 23.6 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.7 | gfs_global 5.8 | -1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | gfs_global 353 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_global 1017.2 | -0.2 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_seamless 23.6 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 4.7 | gfs_seamless 5.8 | -1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | gfs_seamless 353 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.0 | gfs_seamless 1017.2 | -0.2 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 38.3 | cams_global 47.1 | -8.8 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.4 | GFS 0.25° raw 23.9 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.2 | GFS 0.25° raw 5.4 | 0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 208 | GFS 0.25° raw 206 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | GFS 0.25° raw 1 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.7 | GFS 0.25° raw 1015.6 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.4 | stored grid 22.4 | 0.1 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 6.2 | stored grid 6.5 | -0.3 | ±1 | ok |
| Delhi | +24 h | cloud % | 2 | stored grid 2 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.69 | stored grid 1015.71 | -0.02 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.4 | gfs_global 25.1 | -2.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.2 | gfs_global 4.3 | 1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 208 | gfs_global 204 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_global 6 | -4 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.7 | gfs_global 1015.4 | 0.3 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.4 | gfs_seamless 25.1 | -2.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.2 | gfs_seamless 4.3 | 1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 208 | gfs_seamless 204 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_seamless 6 | -4 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.7 | gfs_seamless 1015.4 | 0.3 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 61.3 | cams_global 67.8 | -6.5 | ±3 | **FAIL** |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | 18.73 | 19.09 | -0.36 | 11.0 | 10.2 | 0.8 | 27 | 6 |
| Dayton OH | +24 h | 16.79 | 16.79 | 0.01 | 16.2 | 14.9 | 1.3 | 100 | 100 |
| Miami | +0 h | 28.20 | 28.50 | -0.30 | 16.3 | 16.8 | -0.5 | 14 | 10 |
| Miami | +24 h | 27.53 | 27.73 | -0.20 | 23.5 | 24.6 | -1.1 | 97 | 99 |
| Denver | +0 h | 18.57 | 18.80 | -0.23 | 8.9 | 9.3 | -0.3 | 60 | 67 |
| Denver | +24 h | 17.06 | 17.44 | -0.38 | 12.8 | 13.0 | -0.2 | 27 | 6 |
| London | +0 h | 11.77 | 11.83 | -0.06 | 11.8 | 11.1 | 0.8 | 57 | 48 |
| London | +24 h | 10.71 | 10.88 | -0.16 | 5.4 | 4.8 | 0.6 | 85 | 98 |
| Delhi | +0 h | 21.40 | 22.57 | -1.17 | 4.5 | 5.2 | -0.7 | 0 | 0 |
| Delhi | +24 h | 22.36 | 23.91 | -1.55 | 6.5 | 5.4 | 1.1 | 2 | 1 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 16.40 | 16.38 | 0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1009.40 | 1009.37 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 5.00 | 4.59 | 0.41 | ±1 | ok |
| Chile coast | +0 h | temp | 17.40 | 17.34 | 0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1013.70 | 1013.66 | 0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 77.00 | 76.94 | 0.06 | ±1 | ok |
| Dayton | +0 h | temp | 18.40 | 18.32 | 0.08 | ±0.5 | ok |
| Dayton | +0 h | pres | 1025.70 | 1025.72 | -0.02 | ±0.5 | ok |
| Dayton | +0 h | cloud | 22.00 | 22.06 | -0.06 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 15.40 | 15.30 | 0.10 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1018.80 | 1018.83 | -0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 21.00 | 21.23 | -0.23 | ±1 | ok |
| Chile coast | +24 h | temp | 16.80 | 16.70 | 0.10 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.60 | 1014.56 | 0.04 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 63.00 | 62.74 | 0.26 | ±1 | ok |
| Dayton | +24 h | temp | 16.40 | 16.30 | 0.10 | ±0.5 | ok |
| Dayton | +24 h | pres | 1027.50 | 1027.47 | 0.03 | ±0.5 | ok |
| Dayton | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 43.30 | 47.00 | -3.70 | ±0.2 | **FAIL** |
| node 52N 0E (London) | +0 h | 12.50 | 5.30 | 7.20 | ±0.2 | **FAIL** |
| node 40N 116E (Beijing) | +0 h | 40.30 | 34.30 | 6.00 | ±0.2 | **FAIL** |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":141,"2024 24-h mean":9,"2012 hourly":179,"2012 24-h mean":47}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Dayton OH | 5.1 | 5.7 | 33 | 28 | 31 | 21 | 23 |
| Miami | 6.6 | 6.5 | 36 | 37 | 36 | 28 | 27 |
| Denver | 13.6 | 16.9 | 65 | 59 | 65 | 54 | 61 |
| London | 8.2 | 10.4 | 53 | 46 | 53 | 34 | 43 |
| Delhi | 47.1 | 32.7 | 93 | 130 | 95 | 130 | 94 |
| node 28N 76E (Delhi) | 47.0 | 20.9 | 70 | 129 | 73 | 129 | 70 |
| node 52N 0E (London) | 5.3 | 8.1 | 46 | 29 | 44 | 22 | 33 |
| node 40N 116E (Beijing) | 34.3 | 38.1 | 107 | 98 | 107 | 98 | 107 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 19 °Cat 2 m·39.7°N 84.1°W | 11 km/hfrom NE·39.7°N 84.1°W | Drypast hour · area avg·39.7°N 84.1°W | 27 %area average·39.7°N 84.1°W | 1026 hPasea level·39.7°N 84.1°W | 3.4 µg/m³Good · AQI 38 (24 h)·39.7°N 84.1°W |
| Miami | 28 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom E·25.7°N 80.1°W | 0.2 mm/hpast hour · area avg·25.7°N 80.1°W | 14 %area average·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 7.6 µg/m³Good · AQI 41 (24 h)·25.7°N 80.1°W |
| Denver | 19 °Cat 2 m·39.7°N 104.9°W | 9 km/hfrom NE·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 60 %area average·39.7°N 104.9°W | 1011 hPasea level·39.7°N 104.9°W | 7.3 µg/m³Good · AQI 50 (24 h)·39.7°N 104.9°W |
| London | 12 °Cat 2 m·51.5°N 0.1°W | 12 km/hfrom E·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 57 %area average·51.5°N 0.1°W | 1030 hPasea level·51.5°N 0.1°W | 12 µg/m³Moderate · AQI 51 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 5 km/hfrom WNW·28.6°N 77.2°E | Drypast hour · area avg·28.6°N 77.2°E | 0 %area average·28.6°N 77.2°E | 1017 hPasea level·28.6°N 77.2°E | 38 µg/m³Sensitive groups · AQI 82 (24 h)·28.6°N 77.2°E |
