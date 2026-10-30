# Accuracy check (after)

Generated 2026-10-30T00:01:28.247Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-29T18:00:00.000Z, timeline +0 h = 2026-10-29T23:00:00.000Z (f005); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (pipeline fidelity): 51 / 7 / 2
- Open-Meteo gfs_global: 44 / 13 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 21 / 2
- Open-Meteo cams_global at the cities: 4 / 6 / 0
- NWS gridpoints (sanity check): 20 / 4 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 18.4 | GFS 0.25° raw 18.6 | -0.2 | ±0.7 | ok |
| Dayton OH | +0 h | wind km/h | 11.2 | GFS 0.25° raw 11.0 | 0.2 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 237 | GFS 0.25° raw 246 | 9 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 38 | GFS 0.25° raw 45 | -8 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1019.8 | GFS 0.25° raw 1019.8 | -0.0 | ±0.5 | ok |
| Dayton OH | +0 h | temp °C | 18.4 | gfs_global 20.7 | -2.3 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 11.2 | gfs_global 9.7 | 1.5 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 237 | gfs_global 248 | 11 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 38 | gfs_global 38 | -0 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1019.8 | gfs_global 1019.7 | 0.1 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 18.4 | gfs_seamless 20.1 | -1.7 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 11.2 | gfs_seamless 7.8 | 3.4 | ±3 | **FAIL** |
| Dayton OH | +0 h | wind from ° | 237 | gfs_seamless 245 | 8 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 38 | gfs_seamless 0 | 38 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1019.8 | gfs_seamless 1019.2 | 0.6 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 12.9 | cams_global 13.0 | -0.1 | ±3 | ok |
| Dayton OH | +0 h | temp °C | 18.4 | NWS 22.8 | -4.4 | ±3 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 11.2 | NWS 14.8 | -3.6 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 38 | NWS 10 | 28 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 13.7 | GFS 0.25° raw 14.5 | -0.7 | ±0.7 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | GFS 0.25° raw 10.9 | 1.0 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 48 | GFS 0.25° raw 46 | 2 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 89 | GFS 0.25° raw 99 | -10 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.6 | GFS 0.25° raw 1026.5 | 0.1 | ±0.5 | ok |
| Dayton OH | +24 h | temp °C | 13.7 | gfs_global 16.3 | -2.6 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | gfs_global 9.7 | 2.2 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 48 | gfs_global 48 | 0 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 89 | gfs_global 67 | 22 | ±15 | **FAIL** |
| Dayton OH | +24 h | pressure hPa | 1026.6 | gfs_global 1026.4 | 0.2 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 13.7 | gfs_seamless 15.8 | -2.1 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | gfs_seamless 8.2 | 3.7 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind from ° | 48 | gfs_seamless 50 | 2 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 89 | gfs_seamless 100 | -11 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.6 | gfs_seamless 1026.9 | -0.3 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 6.5 | cams_global 7.1 | -0.6 | ±3 | ok |
| Dayton OH | +24 h | temp °C | 13.7 | NWS 17.8 | -4.1 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | NWS 9.3 | 2.7 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 89 | NWS 19 | 70 | ±30 | **FAIL** |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 27.2 | GFS 0.25° raw 27.7 | -0.5 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 17.4 | GFS 0.25° raw 21.3 | -3.9 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 36 | GFS 0.25° raw 44 | 8 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.04 | GFS 0.25° raw 0.00 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 5 | GFS 0.25° raw 1 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.8 | GFS 0.25° raw 1012.8 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.2 | gfs_global 27.4 | -0.2 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.4 | gfs_global 24.2 | -6.8 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 36 | gfs_global 41 | 5 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.04 | gfs_global 0.00 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 5 | gfs_global 0 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.8 | gfs_global 1012.8 | 0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.2 | gfs_seamless 25.4 | 1.8 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 17.4 | gfs_seamless 8.6 | 8.8 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 36 | gfs_seamless 25 | 11 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.04 | gfs_seamless 0.00 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 5 | gfs_seamless 2 | 3 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.8 | gfs_seamless 1014.0 | -1.2 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 6.2 | cams_global 7.1 | -0.9 | ±3 | ok |
| Miami | +0 h | temp °C | 27.2 | NWS 27.8 | -0.6 | ±3 | ok |
| Miami | +0 h | wind km/h | 17.4 | NWS 14.8 | 2.5 | ±8 | ok |
| Miami | +0 h | cloud % | 5 | NWS 14 | -9 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.04 | NWS 0.00 | 0.04 | ±1 | ok |
| Miami | +24 h | temp °C | 26.6 | GFS 0.25° raw 26.9 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 18.9 | GFS 0.25° raw 22.2 | -3.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 71 | GFS 0.25° raw 68 | 4 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.39 | GFS 0.25° raw 0.31 | 0.08 | ±0.3 | ok |
| Miami | +24 h | cloud % | 32 | GFS 0.25° raw 19 | 13 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1014.8 | GFS 0.25° raw 1014.8 | -0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.6 | gfs_global 27.0 | -0.4 | ±1 | ok |
| Miami | +24 h | wind km/h | 18.9 | gfs_global 22.5 | -3.6 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 71 | gfs_global 70 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.39 | gfs_global 0.20 | 0.19 | ±0.3 | ok |
| Miami | +24 h | cloud % | 32 | gfs_global 93 | -61 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1014.8 | gfs_global 1014.6 | 0.2 | ±1 | ok |
| Miami | +24 h | temp °C | 26.6 | gfs_seamless 25.0 | 1.6 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 18.9 | gfs_seamless 8.2 | 10.7 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 71 | gfs_seamless 34 | 37 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.39 | gfs_seamless 0.00 | 0.39 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 32 | gfs_seamless 100 | -68 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1014.8 | gfs_seamless 1015.3 | -0.5 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 8.8 | cams_global 4.1 | 4.7 | ±3 | **FAIL** |
| Miami | +24 h | temp °C | 26.6 | NWS 27.8 | -1.1 | ±3 | ok |
| Miami | +24 h | wind km/h | 18.9 | NWS 20.4 | -1.5 | ±8 | ok |
| Miami | +24 h | cloud % | 32 | NWS 40 | -8 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.39 | NWS 0.08 | 0.31 | ±1 | ok |
| Denver | +0 h | temp °C | 17.4 | GFS 0.25° raw 18.8 | -1.4 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 9.5 | GFS 0.25° raw 10.0 | -0.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 59 | GFS 0.25° raw 58 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 19 | GFS 0.25° raw 5 | 14 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1012.7 | GFS 0.25° raw 1012.2 | 0.5 | ±0.5 | ok |
| Denver | +0 h | temp °C | 17.4 | gfs_global 19.1 | -1.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 9.5 | gfs_global 10.0 | -0.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 59 | gfs_global 60 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 19 | gfs_global 14 | 5 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1012.7 | gfs_global 1009.9 | 2.8 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 17.4 | gfs_seamless 18.8 | -1.4 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 9.5 | gfs_seamless 12.2 | -2.7 | ±3 | ok |
| Denver | +0 h | wind from ° | 59 | gfs_seamless 61 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 19 | gfs_seamless 0 | 19 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1012.7 | gfs_seamless 1011.5 | 1.2 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 3.0 | cams_global 7.1 | -4.1 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 17.4 | NWS 17.2 | 0.1 | ±3 | ok |
| Denver | +0 h | wind km/h | 9.5 | NWS 11.1 | -1.6 | ±8 | ok |
| Denver | +0 h | cloud % | 19 | NWS 9 | 10 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 18.3 | GFS 0.25° raw 19.4 | -1.1 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 7.8 | GFS 0.25° raw 8.2 | -0.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 40 | GFS 0.25° raw 42 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | -0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1009.7 | GFS 0.25° raw 1009.5 | 0.2 | ±0.5 | ok |
| Denver | +24 h | temp °C | 18.3 | gfs_global 19.7 | -1.4 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 7.8 | gfs_global 7.9 | -0.1 | ±3 | ok |
| Denver | +24 h | wind from ° | 40 | gfs_global 39 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 93 | 7 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1009.7 | gfs_global 1006.9 | 2.8 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 18.3 | gfs_seamless 18.6 | -0.3 | ±1 | ok |
| Denver | +24 h | wind km/h | 7.8 | gfs_seamless 13.3 | -5.5 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 40 | gfs_seamless 8 | 32 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 93 | 7 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1009.7 | gfs_seamless 1010.3 | -0.6 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 3.4 | cams_global 7.5 | -4.1 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 18.3 | NWS 17.8 | 0.5 | ±3 | ok |
| Denver | +24 h | wind km/h | 7.8 | NWS 9.3 | -1.4 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 31 | 69 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.3 | GFS 0.25° raw 11.5 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 8.9 | GFS 0.25° raw 6.3 | 2.7 | ±3 | ok |
| London | +0 h | wind from ° | 104 | GFS 0.25° raw 110 | 6 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 29 | GFS 0.25° raw 13 | 17 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1029.2 | GFS 0.25° raw 1029.2 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.3 | gfs_global 11.6 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 8.9 | gfs_global 6.2 | 2.7 | ±3 | ok |
| London | +0 h | wind from ° | 104 | gfs_global 111 | 7 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 29 | gfs_global 17 | 12 | ±15 | ok |
| London | +0 h | pressure hPa | 1029.2 | gfs_global 1029.1 | 0.1 | ±1 | ok |
| London | +0 h | temp °C | 11.3 | gfs_seamless 11.6 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 8.9 | gfs_seamless 6.2 | 2.7 | ±3 | ok |
| London | +0 h | wind from ° | 104 | gfs_seamless 111 | 7 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 29 | gfs_seamless 17 | 12 | ±15 | ok |
| London | +0 h | pressure hPa | 1029.2 | gfs_seamless 1029.1 | 0.1 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 8.4 | cams_global 13.4 | -5.0 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.9 | GFS 0.25° raw 11.0 | -0.2 | ±0.7 | ok |
| London | +24 h | wind km/h | 8.0 | GFS 0.25° raw 5.4 | 2.6 | ±3 | ok |
| London | +24 h | wind from ° | 76 | GFS 0.25° raw 63 | 13 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 65 | GFS 0.25° raw 67 | -1 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.4 | GFS 0.25° raw 1030.4 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.9 | gfs_global 11.1 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.0 | gfs_global 5.3 | 2.7 | ±3 | ok |
| London | +24 h | wind from ° | 76 | gfs_global 62 | 14 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 65 | gfs_global 100 | -35 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.4 | gfs_global 1030.3 | 0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.9 | gfs_seamless 11.1 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.0 | gfs_seamless 5.3 | 2.7 | ±3 | ok |
| London | +24 h | wind from ° | 76 | gfs_seamless 62 | 14 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 65 | gfs_seamless 100 | -35 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.4 | gfs_seamless 1030.3 | 0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 12.6 | cams_global 15.3 | -2.7 | ±3 | ok |
| Delhi | +0 h | temp °C | 21.3 | GFS 0.25° raw 22.0 | -0.7 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 6.4 | GFS 0.25° raw 6.2 | 0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 67 | GFS 0.25° raw 66 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.23 | GFS 0.25° raw 0.08 | 0.15 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 98 | GFS 0.25° raw 96 | 2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.0 | GFS 0.25° raw 1015.9 | 0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_global 22.5 | -1.2 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.4 | gfs_global 6.8 | -0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 67 | gfs_global 65 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.23 | gfs_global 0.10 | 0.13 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 98 | gfs_global 100 | -2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.0 | gfs_global 1015.5 | 0.5 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_seamless 22.5 | -1.2 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.4 | gfs_seamless 6.8 | -0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 67 | gfs_seamless 65 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.23 | gfs_seamless 0.10 | 0.13 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 98 | gfs_seamless 100 | -2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.0 | gfs_seamless 1015.5 | 0.5 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 25.8 | cams_global 19.0 | 6.8 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 19.9 | GFS 0.25° raw 20.7 | -0.8 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | GFS 0.25° raw 3.4 | -0.2 | ±3 | ok |
| Delhi | +24 h | wind from ° | 93 | GFS 0.25° raw 88 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.3 | GFS 0.25° raw 1017.3 | 0.0 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 19.9 | gfs_global 21.5 | -1.6 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | gfs_global 4.0 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 93 | gfs_global 85 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.3 | gfs_global 1017.8 | -0.5 | ±1 | ok |
| Delhi | +24 h | temp °C | 19.9 | gfs_seamless 21.5 | -1.6 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.3 | gfs_seamless 4.0 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 93 | gfs_seamless 85 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.3 | gfs_seamless 1017.8 | -0.5 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 51.7 | cams_global 45.4 | 6.3 | ±3 | **FAIL** |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 16.20 | 16.20 | -0.00 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1018.40 | 1018.37 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 100.00 | 99.97 | 0.03 | ±1 | ok |
| Chile coast | +0 h | temp | 13.40 | 13.30 | 0.10 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.20 | 1015.24 | -0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 4.00 | 4.25 | -0.25 | ±1 | ok |
| Dayton | +0 h | temp | 18.00 | 17.98 | 0.02 | ±0.5 | ok |
| Dayton | +0 h | pres | 1019.70 | 1019.66 | 0.04 | ±0.5 | ok |
| Dayton | +0 h | cloud | 28.00 | 28.45 | -0.45 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 18.00 | 17.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1012.20 | 1012.19 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Chile coast | +24 h | temp | 14.60 | 14.58 | 0.02 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1013.60 | 1013.56 | 0.04 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 69.00 | 69.42 | -0.42 | ±1 | ok |
| Dayton | +24 h | temp | 13.40 | 13.33 | 0.07 | ±0.5 | ok |
| Dayton | +24 h | pres | 1026.90 | 1026.94 | -0.04 | ±0.5 | ok |
| Dayton | +24 h | cloud | 83.00 | 83.06 | -0.06 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 15.50 | 15.50 | 0.00 | ±0.2 | ok |
| node 52N 0E (London) | +0 h | 9.30 | 9.30 | 0.00 | ±0.2 | ok |
| node 40N 116E (Beijing) | +0 h | 55.20 | 55.20 | 0.00 | ±0.2 | ok |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":120,"2024 24-h mean":23,"2012 hourly":152,"2012 24-h mean":59}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Dayton OH | 13.0 | 9.0 | 49 | 58 | 50 | 53 | 38 |
| Miami | 7.1 | 4.9 | 36 | 39 | 27 | 30 | 20 |
| Denver | 7.1 | 11.3 | 54 | 39 | 55 | 30 | 47 |
| London | 13.4 | 17.3 | 66 | 59 | 66 | 54 | 62 |
| Delhi | 19.0 | 31.5 | 98 | 69 | 93 | 66 | 92 |
| node 28N 76E (Delhi) | 15.5 | 37.8 | 112 | 63 | 107 | 58 | 107 |
| node 52N 0E (London) | 9.3 | 10.6 | 53 | 51 | 54 | 39 | 44 |
| node 40N 116E (Beijing) | 55.2 | 53.3 | 144 | 150 | 145 | 150 | 145 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 18 °Cat 2 m·39.7°N 84.1°W | 11 km/hfrom WSW·39.7°N 84.1°W | Drypast hour·39.7°N 84.1°W | 38 %cloud cover·39.7°N 84.1°W | 1020 hPasea level·39.7°N 84.1°W | 13 µg/m³Moderate · AQI 58·39.7°N 84.1°W |
| Miami | 27 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom NE·25.7°N 80.1°W | Drypast hour·25.7°N 80.1°W | 5 %cloud cover·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 6.2 µg/m³Good · AQI 34·25.7°N 80.1°W |
| Denver | 17 °Cat 2 m·39.7°N 104.9°W | 10 km/hfrom ENE·39.7°N 104.9°W | Drypast hour·39.7°N 104.9°W | 19 %cloud cover·39.7°N 104.9°W | 1013 hPasea level·39.7°N 104.9°W | 3.0 µg/m³Good · AQI 17·39.7°N 104.9°W |
| London | 11 °Cat 2 m·51.5°N 0.1°W | 9 km/hfrom ESE·51.5°N 0.1°W | Drypast hour·51.5°N 0.1°W | 29 %cloud cover·51.5°N 0.1°W | 1029 hPasea level·51.5°N 0.1°W | 8.4 µg/m³Good · AQI 46·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 6 km/hfrom ENE·28.6°N 77.2°E | 0.2 mm/hpast hour·28.6°N 77.2°E | 98 %cloud cover·28.6°N 77.2°E | 1016 hPasea level·28.6°N 77.2°E | 26 µg/m³Moderate · AQI 82·28.6°N 77.2°E |
