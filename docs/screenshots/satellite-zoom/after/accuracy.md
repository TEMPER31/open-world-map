# Accuracy check (after)

Generated 2026-10-30T22:11:52.643Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-30T18:00:00.000Z, timeline +0 h = 2026-10-30T22:00:00.000Z (f004); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding): 52 / 5 / 3
- Page vs the stored grid before encoding (encoding only): 40 / 0 / 0
- Open-Meteo gfs_global: 39 / 19 / 2
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 21 / 2
- Open-Meteo cams_global at the cities: 5 / 5 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 0 / 3 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 16.2 | GFS 0.25° raw 16.9 | -0.7 | ±0.7 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 9.2 | GFS 0.25° raw 9.2 | 0.1 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 43 | GFS 0.25° raw 38 | 5 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 36 | GFS 0.25° raw 24 | 12 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1026.1 | GFS 0.25° raw 1026.0 | 0.1 | ±0.5 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | stored grid 16.2 | -0.1 | ±0.15 | ok |
| Dayton OH | +0 h | wind km/h | 9.2 | stored grid 9.6 | -0.3 | ±1 | ok |
| Dayton OH | +0 h | cloud % | 36 | stored grid 36 | -0 | ±1 | ok |
| Dayton OH | +0 h | pressure hPa | 1026.08 | stored grid 1026.06 | 0.02 | ±0.1 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | gfs_global 18.4 | -2.2 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 9.2 | gfs_global 9.4 | -0.2 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 43 | gfs_global 40 | 3 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 36 | gfs_global 11 | 25 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1026.1 | gfs_global 1026.0 | 0.1 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | gfs_seamless 19.2 | -3.0 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 9.2 | gfs_seamless 6.7 | 2.5 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 43 | gfs_seamless 62 | 19 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 36 | gfs_seamless 0 | 36 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1026.1 | gfs_seamless 1025.7 | 0.4 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 3.8 | cams_global 5.5 | -1.7 | ±3 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | NWS 19.4 | -3.3 | ±3 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 9.2 | NWS 9.3 | -0.0 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 36 | NWS 7 | 29 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 15.3 | GFS 0.25° raw 15.8 | -0.5 | ±0.7 | ok |
| Dayton OH | +24 h | wind km/h | 14.8 | GFS 0.25° raw 13.6 | 1.2 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 109 | GFS 0.25° raw 111 | 2 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.4 | GFS 0.25° raw 1027.4 | 0.0 | ±0.5 | ok |
| Dayton OH | +24 h | temp °C | 15.3 | stored grid 15.3 | -0.0 | ±0.15 | ok |
| Dayton OH | +24 h | wind km/h | 14.8 | stored grid 14.8 | -0.0 | ±1 | ok |
| Dayton OH | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.43 | stored grid 1027.45 | -0.02 | ±0.1 | ok |
| Dayton OH | +24 h | temp °C | 15.3 | gfs_global 17.2 | -1.9 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 14.8 | gfs_global 11.8 | 3.0 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind from ° | 109 | gfs_global 110 | 1 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.4 | gfs_global 1027.0 | 0.4 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 15.3 | gfs_seamless 18.0 | -2.7 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 14.8 | gfs_seamless 10.1 | 4.7 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind from ° | 109 | gfs_seamless 96 | 13 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1027.4 | gfs_seamless 1027.5 | -0.1 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 5.0 | cams_global 3.7 | 1.3 | ±3 | ok |
| Dayton OH | +24 h | temp °C | 15.3 | NWS 19.4 | -4.2 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 14.8 | NWS 14.8 | -0.0 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 100 | NWS 91 | 9 | ±30 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 27.7 | GFS 0.25° raw 28.0 | -0.3 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 16.4 | GFS 0.25° raw 19.0 | -2.6 | ±3 | ok |
| Miami | +0 h | wind from ° | 90 | GFS 0.25° raw 98 | 8 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.15 | GFS 0.25° raw 0.08 | 0.07 | ±0.3 | ok |
| Miami | +0 h | cloud % | 10 | GFS 0.25° raw 12 | -2 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.3 | GFS 0.25° raw 1013.3 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.7 | stored grid 27.7 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 16.4 | stored grid 16.6 | -0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 10 | stored grid 10 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1013.28 | stored grid 1013.29 | -0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.7 | gfs_global 28.4 | -0.7 | ±1 | ok |
| Miami | +0 h | wind km/h | 16.4 | gfs_global 18.9 | -2.5 | ±3 | ok |
| Miami | +0 h | wind from ° | 90 | gfs_global 108 | 18 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.15 | gfs_global 0.10 | 0.05 | ±0.3 | ok |
| Miami | +0 h | cloud % | 10 | gfs_global 28 | -18 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1013.3 | gfs_global 1013.3 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.7 | gfs_seamless 26.6 | 1.1 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 16.4 | gfs_seamless 12.0 | 4.4 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 90 | gfs_seamless 80 | 10 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.15 | gfs_seamless 0.00 | 0.15 | ±0.3 | ok |
| Miami | +0 h | cloud % | 10 | gfs_seamless 1 | 9 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.3 | gfs_seamless 1014.3 | -1.0 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 7.8 | cams_global 6.2 | 1.6 | ±3 | ok |
| Miami | +0 h | temp °C | 27.7 | NWS 28.3 | -0.6 | ±3 | ok |
| Miami | +0 h | wind km/h | 16.4 | NWS 18.5 | -2.1 | ±8 | ok |
| Miami | +0 h | cloud % | 10 | NWS 49 | -39 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.15 | NWS 0.13 | 0.02 | ±1 | ok |
| Miami | +24 h | temp °C | 27.1 | GFS 0.25° raw 27.3 | -0.2 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 23.0 | GFS 0.25° raw 25.0 | -2.0 | ±3 | ok |
| Miami | +24 h | wind from ° | 77 | GFS 0.25° raw 82 | 5 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.78 | GFS 0.25° raw 1.08 | -0.30 | ±0.3 | ok |
| Miami | +24 h | cloud % | 96 | GFS 0.25° raw 100 | -4 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.6 | GFS 0.25° raw 1016.7 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 27.1 | stored grid 27.1 | -0.1 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 23.0 | stored grid 23.2 | -0.2 | ±1 | ok |
| Miami | +24 h | cloud % | 96 | stored grid 96 | -0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.64 | stored grid 1016.64 | -0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 27.1 | gfs_global 27.6 | -0.5 | ±1 | ok |
| Miami | +24 h | wind km/h | 23.0 | gfs_global 28.9 | -5.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 77 | gfs_global 76 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.78 | gfs_global 0.70 | 0.08 | ±0.3 | ok |
| Miami | +24 h | cloud % | 96 | gfs_global 100 | -4 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.6 | gfs_global 1016.6 | 0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 27.1 | gfs_seamless 25.5 | 1.6 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 23.0 | gfs_seamless 7.1 | 15.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 77 | gfs_seamless 56 | 21 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.78 | gfs_seamless 0.00 | 0.78 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 96 | gfs_seamless 100 | -4 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.6 | gfs_seamless 1017.2 | -0.6 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 9.2 | cams_global 6.3 | 2.9 | ±3 | ok |
| Miami | +24 h | temp °C | 27.1 | NWS 27.8 | -0.7 | ±3 | ok |
| Miami | +24 h | wind km/h | 23.0 | NWS 27.8 | -4.8 | ±8 | ok |
| Miami | +24 h | cloud % | 96 | NWS 71 | 25 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.78 | NWS 0.64 | 0.14 | ±1 | ok |
| Denver | +0 h | temp °C | 18.9 | GFS 0.25° raw 19.2 | -0.3 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 10.7 | GFS 0.25° raw 10.7 | 0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 45 | GFS 0.25° raw 46 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 31 | GFS 0.25° raw 11 | 19 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1010.9 | GFS 0.25° raw 1010.9 | 0.0 | ±0.5 | ok |
| Denver | +0 h | temp °C | 18.9 | stored grid 18.9 | -0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 10.7 | stored grid 10.5 | 0.2 | ±1 | ok |
| Denver | +0 h | cloud % | 31 | stored grid 31 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1010.90 | stored grid 1010.86 | 0.04 | ±0.1 | ok |
| Denver | +0 h | temp °C | 18.9 | gfs_global 20.2 | -1.3 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 10.7 | gfs_global 10.8 | -0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 45 | gfs_global 60 | 15 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 31 | gfs_global 56 | -25 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1010.9 | gfs_global 1007.5 | 3.4 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 18.9 | gfs_seamless 18.3 | 0.6 | ±1 | ok |
| Denver | +0 h | wind km/h | 10.7 | gfs_seamless 12.2 | -1.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 45 | gfs_seamless 43 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 31 | gfs_seamless 0 | 31 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1010.9 | gfs_seamless 1009.3 | 1.6 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 5.8 | cams_global 12.7 | -6.9 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 18.9 | NWS 18.3 | 0.5 | ±3 | ok |
| Denver | +0 h | wind km/h | 10.7 | NWS 9.3 | 1.5 | ±8 | ok |
| Denver | +0 h | cloud % | 31 | NWS 29 | 2 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 16.8 | GFS 0.25° raw 17.5 | -0.8 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 11.1 | GFS 0.25° raw 11.5 | -0.4 | ±3 | ok |
| Denver | +24 h | wind from ° | 30 | GFS 0.25° raw 28 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 18 | GFS 0.25° raw 3 | 15 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1010.3 | GFS 0.25° raw 1010.1 | 0.2 | ±0.5 | ok |
| Denver | +24 h | temp °C | 16.8 | stored grid 16.8 | 0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 11.1 | stored grid 11.3 | -0.2 | ±1 | ok |
| Denver | +24 h | cloud % | 18 | stored grid 18 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1010.31 | stored grid 1010.30 | 0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 16.8 | gfs_global 18.1 | -1.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 11.1 | gfs_global 14.9 | -3.8 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 30 | gfs_global 7 | 23 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 18 | gfs_global 63 | -45 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1010.3 | gfs_global 1007.4 | 2.9 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 16.8 | gfs_seamless 15.8 | 1.0 | ±1 | ok |
| Denver | +24 h | wind km/h | 11.1 | gfs_seamless 5.8 | 5.3 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 30 | gfs_seamless 17 | 13 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 18 | gfs_seamless 44 | -26 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1010.3 | gfs_seamless 1011.8 | -1.5 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 2.7 | cams_global 10.4 | -7.7 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 16.8 | NWS 16.7 | 0.1 | ±3 | ok |
| Denver | +24 h | wind km/h | 11.1 | NWS 7.4 | 3.7 | ±8 | ok |
| Denver | +24 h | cloud % | 18 | NWS 28 | -10 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.6 | GFS 0.25° raw 11.7 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 9.6 | GFS 0.25° raw 9.4 | 0.2 | ±3 | ok |
| London | +0 h | wind from ° | 86 | GFS 0.25° raw 91 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 77 | GFS 0.25° raw 88 | -12 | ±15 | ok |
| London | +0 h | pressure hPa | 1030.4 | GFS 0.25° raw 1030.4 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.6 | stored grid 11.6 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 9.6 | stored grid 9.8 | -0.2 | ±1 | ok |
| London | +0 h | cloud % | 77 | stored grid 77 | -0 | ±1 | ok |
| London | +0 h | pressure hPa | 1030.41 | stored grid 1030.38 | 0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 11.6 | gfs_global 11.6 | -0.0 | ±1 | ok |
| London | +0 h | wind km/h | 9.6 | gfs_global 8.3 | 1.3 | ±3 | ok |
| London | +0 h | wind from ° | 86 | gfs_global 90 | 4 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 77 | gfs_global 52 | 25 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.4 | gfs_global 1030.4 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 11.6 | gfs_seamless 11.6 | -0.0 | ±1 | ok |
| London | +0 h | wind km/h | 9.6 | gfs_seamless 8.3 | 1.3 | ±3 | ok |
| London | +0 h | wind from ° | 86 | gfs_seamless 90 | 4 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 77 | gfs_seamless 52 | 25 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.4 | gfs_seamless 1030.4 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.6 | cams_global 9.3 | 3.3 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.5 | GFS 0.25° raw 10.6 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 5.4 | GFS 0.25° raw 5.0 | 0.5 | ±3 | ok |
| London | +24 h | wind from ° | 67 | GFS 0.25° raw 71 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 70 | GFS 0.25° raw 83 | -13 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.4 | GFS 0.25° raw 1032.4 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.5 | stored grid 10.5 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 5.4 | stored grid 5.2 | 0.3 | ±1 | ok |
| London | +24 h | cloud % | 70 | stored grid 70 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.41 | stored grid 1032.43 | -0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.5 | gfs_global 10.8 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_global 4.7 | 0.7 | ±3 | ok |
| London | +24 h | wind from ° | 67 | gfs_global 67 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 70 | gfs_global 86 | -16 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1032.4 | gfs_global 1032.3 | 0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.5 | gfs_seamless 10.8 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_seamless 4.7 | 0.7 | ±3 | ok |
| London | +24 h | wind from ° | 67 | gfs_seamless 67 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 70 | gfs_seamless 86 | -16 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1032.4 | gfs_seamless 1032.3 | 0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 20.1 | cams_global 24.3 | -4.2 | ±3 | **FAIL** |
| Delhi | +0 h | temp °C | 21.2 | GFS 0.25° raw 22.4 | -1.2 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | GFS 0.25° raw 7.0 | -0.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 316 | GFS 0.25° raw 323 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.7 | GFS 0.25° raw 1016.6 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.2 | stored grid 21.2 | -0.1 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 6.6 | stored grid 6.3 | 0.3 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1016.66 | stored grid 1016.67 | -0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.2 | gfs_global 23.2 | -2.0 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_global 8.0 | -1.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 316 | gfs_global 352 | 36 | ±20 | **FAIL** |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.7 | gfs_global 1016.8 | -0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.2 | gfs_seamless 23.2 | -2.0 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_seamless 8.0 | -1.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 316 | gfs_seamless 352 | 36 | ±20 | **FAIL** |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.7 | gfs_seamless 1016.8 | -0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 37.4 | cams_global 44.0 | -6.6 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.2 | GFS 0.25° raw 23.7 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 4.3 | GFS 0.25° raw 4.1 | 0.2 | ±3 | ok |
| Delhi | +24 h | wind from ° | 212 | GFS 0.25° raw 218 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | GFS 0.25° raw 3 | -1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.3 | GFS 0.25° raw 1015.3 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.2 | stored grid 22.2 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 4.3 | stored grid 4.7 | -0.4 | ±1 | ok |
| Delhi | +24 h | cloud % | 2 | stored grid 2 | -0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.34 | stored grid 1015.35 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.2 | gfs_global 24.9 | -2.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 4.3 | gfs_global 3.4 | 0.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 212 | gfs_global 212 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_global 5 | -3 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.3 | gfs_global 1015.2 | 0.1 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.2 | gfs_seamless 24.9 | -2.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 4.3 | gfs_seamless 3.4 | 0.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 212 | gfs_seamless 212 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_seamless 5 | -3 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.3 | gfs_seamless 1015.2 | 0.1 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 61.0 | cams_global 63.3 | -2.3 | ±3 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | 16.25 | 16.92 | -0.67 | 9.6 | 9.2 | 0.4 | 36 | 24 |
| Dayton OH | +24 h | 15.32 | 15.81 | -0.48 | 14.8 | 13.6 | 1.2 | 100 | 100 |
| Miami | +0 h | 27.70 | 27.97 | -0.27 | 16.6 | 19.0 | -2.5 | 10 | 12 |
| Miami | +24 h | 27.14 | 27.28 | -0.13 | 23.2 | 25.0 | -1.8 | 96 | 100 |
| Denver | +0 h | 18.89 | 19.20 | -0.31 | 10.5 | 10.7 | -0.2 | 31 | 11 |
| Denver | +24 h | 16.75 | 17.51 | -0.76 | 11.3 | 11.5 | -0.2 | 18 | 3 |
| London | +0 h | 11.61 | 11.65 | -0.05 | 9.8 | 9.4 | 0.3 | 77 | 88 |
| London | +24 h | 10.49 | 10.62 | -0.13 | 5.2 | 5.0 | 0.2 | 70 | 83 |
| Delhi | +0 h | 21.23 | 22.42 | -1.19 | 6.3 | 7.0 | -0.8 | 0 | 0 |
| Delhi | +24 h | 22.22 | 23.74 | -1.52 | 4.7 | 4.1 | 0.6 | 2 | 3 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 16.80 | 16.80 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1010.20 | 1010.22 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 6.00 | 6.29 | -0.29 | ±1 | ok |
| Chile coast | +0 h | temp | 16.00 | 16.05 | -0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1013.80 | 1013.80 | -0.00 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 75.00 | 75.12 | -0.12 | ±1 | ok |
| Dayton | +0 h | temp | 15.80 | 15.85 | -0.05 | ±0.5 | ok |
| Dayton | +0 h | pres | 1026.30 | 1026.25 | 0.05 | ±0.5 | ok |
| Dayton | +0 h | cloud | 30.00 | 29.68 | 0.32 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 15.60 | 15.55 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1019.70 | 1019.70 | 0.00 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 72.00 | 71.63 | 0.38 | ±1 | ok |
| Chile coast | +24 h | temp | 16.00 | 15.95 | 0.05 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.80 | 1014.78 | 0.02 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 44.00 | 44.44 | -0.44 | ±1 | ok |
| Dayton | +24 h | temp | 15.00 | 15.05 | -0.05 | ±0.5 | ok |
| Dayton | +24 h | pres | 1027.70 | 1027.74 | -0.04 | ±0.5 | ok |
| Dayton | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 42.60 | 47.30 | -4.70 | ±0.2 | **FAIL** |
| node 52N 0E (London) | +0 h | 12.80 | 6.60 | 6.20 | ±0.2 | **FAIL** |
| node 40N 116E (Beijing) | +0 h | 46.20 | 41.10 | 5.10 | ±0.2 | **FAIL** |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":113,"2024 24-h mean":9,"2012 hourly":156,"2012 24-h mean":45}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Dayton OH | 5.5 | 5.4 | 32 | 31 | 30 | 23 | 23 |
| Miami | 6.2 | 6.5 | 36 | 34 | 36 | 26 | 27 |
| Denver | 12.7 | 17.1 | 65 | 58 | 66 | 52 | 61 |
| London | 9.3 | 10.2 | 53 | 51 | 53 | 39 | 43 |
| Delhi | 44.0 | 33.7 | 95 | 122 | 97 | 122 | 96 |
| node 28N 76E (Delhi) | 47.3 | 22.2 | 72 | 130 | 75 | 130 | 72 |
| node 52N 0E (London) | 6.6 | 8.0 | 45 | 37 | 44 | 28 | 33 |
| node 40N 116E (Beijing) | 41.1 | 38.0 | 107 | 115 | 107 | 115 | 107 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 16 °Cat 2 m·39.7°N 84.1°W | 9 km/hfrom NE·39.7°N 84.1°W | Drypast hour · area avg·39.7°N 84.1°W | 36 %area average·39.7°N 84.1°W | 1026 hPasea level·39.7°N 84.1°W | 3.8 µg/m³Good · AQI 36 (24 h)·39.7°N 84.1°W |
| Miami | 28 °Cat 2 m·25.7°N 80.1°W | 16 km/hfrom E·25.7°N 80.1°W | 0.1 mm/hpast hour · area avg·25.7°N 80.1°W | 10 %area average·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 7.8 µg/m³Good · AQI 41 (24 h)·25.7°N 80.1°W |
| Denver | 19 °Cat 2 m·39.7°N 104.9°W | 11 km/hfrom NE·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 31 %area average·39.7°N 104.9°W | 1011 hPasea level·39.7°N 104.9°W | 5.8 µg/m³Good · AQI 51 (24 h)·39.7°N 104.9°W |
| London | 12 °Cat 2 m·51.5°N 0.1°W | 10 km/hfrom E·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 77 %area average·51.5°N 0.1°W | 1030 hPasea level·51.5°N 0.1°W | 13 µg/m³Moderate · AQI 51 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 7 km/hfrom NW·28.6°N 77.2°E | Drypast hour · area avg·28.6°N 77.2°E | 0 %area average·28.6°N 77.2°E | 1017 hPasea level·28.6°N 77.2°E | 37 µg/m³Sensitive groups · AQI 83 (24 h)·28.6°N 77.2°E |
