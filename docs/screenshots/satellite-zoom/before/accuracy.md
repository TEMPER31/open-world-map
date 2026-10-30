# Accuracy check (before)

Generated 2026-10-30T21:12:27.226Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-30T12:00:00.000Z, timeline +0 h = 2026-10-30T21:00:00.000Z (f009); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding): 54 / 3 / 3
- Page vs the stored grid before encoding (encoding only): 40 / 0 / 0
- Open-Meteo gfs_global: 45 / 12 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 20 / 3
- Open-Meteo cams_global at the cities: 5 / 5 / 0
- NWS gridpoints (sanity check): 22 / 2 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 18.6 | GFS 0.25° raw 18.9 | -0.4 | ±0.7 | ok |
| Dayton OH | +0 h | wind km/h | 11.5 | GFS 0.25° raw 11.2 | 0.3 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 47 | GFS 0.25° raw 43 | 4 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 32 | GFS 0.25° raw 11 | 21 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.6 | GFS 0.25° raw 1025.5 | 0.1 | ±0.5 | ok |
| Dayton OH | +0 h | temp °C | 18.6 | stored grid 18.6 | -0.0 | ±0.15 | ok |
| Dayton OH | +0 h | wind km/h | 11.5 | stored grid 11.8 | -0.3 | ±1 | ok |
| Dayton OH | +0 h | cloud % | 32 | stored grid 32 | 0 | ±1 | ok |
| Dayton OH | +0 h | pressure hPa | 1025.63 | stored grid 1025.64 | -0.01 | ±0.1 | ok |
| Dayton OH | +0 h | temp °C | 18.6 | gfs_global 19.8 | -1.2 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 11.5 | gfs_global 10.7 | 0.8 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 47 | gfs_global 45 | 2 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 32 | gfs_global 11 | 21 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.6 | gfs_global 1025.5 | 0.1 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 18.6 | gfs_seamless 20.7 | -2.1 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 11.5 | gfs_seamless 8.9 | 2.6 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 47 | gfs_seamless 52 | 5 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 32 | gfs_seamless 0 | 32 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1025.6 | gfs_seamless 1025.5 | 0.1 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 3.4 | cams_global 3.9 | -0.5 | ±3 | ok |
| Dayton OH | +0 h | temp °C | 18.6 | NWS 20.0 | -1.4 | ±3 | ok |
| Dayton OH | +0 h | wind km/h | 11.5 | NWS 11.1 | 0.4 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 32 | NWS 6 | 26 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 17.2 | GFS 0.25° raw 17.6 | -0.4 | ±0.7 | ok |
| Dayton OH | +24 h | wind km/h | 15.4 | GFS 0.25° raw 14.6 | 0.8 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 105 | GFS 0.25° raw 106 | 0 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.7 | GFS 0.25° raw 1026.7 | -0.0 | ±0.5 | ok |
| Dayton OH | +24 h | temp °C | 17.2 | stored grid 17.2 | -0.0 | ±0.15 | ok |
| Dayton OH | +24 h | wind km/h | 15.4 | stored grid 15.5 | -0.1 | ±1 | ok |
| Dayton OH | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.71 | stored grid 1026.71 | -0.01 | ±0.1 | ok |
| Dayton OH | +24 h | temp °C | 17.2 | gfs_global 18.4 | -1.2 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 15.4 | gfs_global 13.6 | 1.8 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 105 | gfs_global 107 | 2 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.7 | gfs_global 1026.7 | 0.0 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 17.2 | gfs_seamless 19.8 | -2.6 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 15.4 | gfs_seamless 12.7 | 2.7 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 105 | gfs_seamless 106 | 1 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1026.7 | gfs_seamless 1027.7 | -1.0 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 4.5 | cams_global 3.6 | 0.9 | ±3 | ok |
| Dayton OH | +24 h | temp °C | 17.2 | NWS 18.9 | -1.7 | ±3 | ok |
| Dayton OH | +24 h | wind km/h | 15.4 | NWS 13.0 | 2.4 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 100 | NWS 91 | 9 | ±30 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 28.4 | GFS 0.25° raw 28.6 | -0.2 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 17.0 | GFS 0.25° raw 15.9 | 1.1 | ±3 | ok |
| Miami | +0 h | wind from ° | 97 | GFS 0.25° raw 93 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | GFS 0.25° raw 0.09 | 0.04 | ±0.3 | ok |
| Miami | +0 h | cloud % | 19 | GFS 0.25° raw 8 | 11 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.0 | GFS 0.25° raw 1013.0 | -0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 28.4 | stored grid 28.3 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 17.0 | stored grid 16.8 | 0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 19 | stored grid 19 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1012.96 | stored grid 1012.96 | 0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 28.4 | gfs_global 28.8 | -0.4 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.0 | gfs_global 15.2 | 1.8 | ±3 | ok |
| Miami | +0 h | wind from ° | 97 | gfs_global 83 | 14 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | gfs_global 0.10 | 0.03 | ±0.3 | ok |
| Miami | +0 h | cloud % | 19 | gfs_global 23 | -4 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.0 | gfs_global 1012.9 | 0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 28.4 | gfs_seamless 27.4 | 1.0 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.0 | gfs_seamless 14.8 | 2.2 | ±3 | ok |
| Miami | +0 h | wind from ° | 97 | gfs_seamless 106 | 9 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.13 | gfs_seamless 0.00 | 0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 19 | gfs_seamless 29 | -10 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.0 | gfs_seamless 1014.1 | -1.1 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 7.6 | cams_global 5.1 | 2.5 | ±3 | ok |
| Miami | +0 h | temp °C | 28.4 | NWS 28.3 | 0.0 | ±3 | ok |
| Miami | +0 h | wind km/h | 17.0 | NWS 18.5 | -1.5 | ±8 | ok |
| Miami | +0 h | cloud % | 19 | NWS 54 | -35 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.13 | NWS 0.13 | 0.00 | ±1 | ok |
| Miami | +24 h | temp °C | 27.6 | GFS 0.25° raw 27.6 | -0.0 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 25.1 | GFS 0.25° raw 27.0 | -1.9 | ±3 | ok |
| Miami | +24 h | wind from ° | 75 | GFS 0.25° raw 77 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.54 | GFS 0.25° raw 0.76 | -0.22 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | -0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | GFS 0.25° raw 1016.3 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 27.6 | stored grid 27.6 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 25.1 | stored grid 25.2 | -0.2 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | -0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.27 | stored grid 1016.27 | 0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 27.6 | gfs_global 27.8 | -0.2 | ±1 | ok |
| Miami | +24 h | wind km/h | 25.1 | gfs_global 27.6 | -2.5 | ±3 | ok |
| Miami | +24 h | wind from ° | 75 | gfs_global 75 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.54 | gfs_global 0.80 | -0.26 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | -0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | gfs_global 1016.3 | -0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 27.6 | gfs_seamless 26.9 | 0.7 | ±1 | ok |
| Miami | +24 h | wind km/h | 25.1 | gfs_seamless 13.2 | 11.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 75 | gfs_seamless 71 | 4 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.54 | gfs_seamless 0.00 | 0.54 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | -0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | gfs_seamless 1017.3 | -1.0 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 8.9 | cams_global 4.8 | 4.1 | ±3 | **FAIL** |
| Miami | +24 h | temp °C | 27.6 | NWS 27.8 | -0.2 | ±3 | ok |
| Miami | +24 h | wind km/h | 25.1 | NWS 27.8 | -2.7 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 77 | 23 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.54 | NWS 0.64 | -0.10 | ±1 | ok |
| Denver | +0 h | temp °C | 19.6 | GFS 0.25° raw 19.7 | -0.1 | ±0.7 | ok |
| Denver | +0 h | wind km/h | 9.1 | GFS 0.25° raw 9.4 | -0.3 | ±3 | ok |
| Denver | +0 h | wind from ° | 66 | GFS 0.25° raw 64 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | GFS 0.25° raw 59 | 1 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1010.6 | GFS 0.25° raw 1010.5 | 0.1 | ±0.5 | ok |
| Denver | +0 h | temp °C | 19.6 | stored grid 19.6 | -0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 9.1 | stored grid 9.1 | 0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 60 | stored grid 61 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1010.62 | stored grid 1010.58 | 0.04 | ±0.1 | ok |
| Denver | +0 h | temp °C | 19.6 | gfs_global 20.0 | -0.4 | ±1 | ok |
| Denver | +0 h | wind km/h | 9.1 | gfs_global 9.0 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 66 | gfs_global 67 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | gfs_global 100 | -40 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1010.6 | gfs_global 1007.6 | 3.0 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 19.6 | gfs_seamless 18.0 | 1.6 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 9.1 | gfs_seamless 13.0 | -3.9 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 66 | gfs_seamless 44 | 22 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 60 | gfs_seamless 0 | 60 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1010.6 | gfs_seamless 1009.8 | 0.8 | ±1 | ok |
| Denver | +0 h | PM2.5 µg/m³ | 7.3 | cams_global 12.4 | -5.1 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 19.6 | NWS 18.9 | 0.8 | ±3 | ok |
| Denver | +0 h | wind km/h | 9.1 | NWS 11.1 | -2.0 | ±8 | ok |
| Denver | +0 h | cloud % | 60 | NWS 21 | 39 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 17.5 | GFS 0.25° raw 17.7 | -0.3 | ±0.7 | ok |
| Denver | +24 h | wind km/h | 13.1 | GFS 0.25° raw 13.7 | -0.6 | ±3 | ok |
| Denver | +24 h | wind from ° | 360 | GFS 0.25° raw 0 | 0 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 39 | GFS 0.25° raw 44 | -5 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1009.4 | GFS 0.25° raw 1009.5 | -0.0 | ±0.5 | ok |
| Denver | +24 h | temp °C | 17.5 | stored grid 17.5 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 13.1 | stored grid 13.4 | -0.3 | ±1 | ok |
| Denver | +24 h | cloud % | 39 | stored grid 39 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1009.44 | stored grid 1009.45 | -0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 17.5 | gfs_global 18.0 | -0.5 | ±1 | ok |
| Denver | +24 h | wind km/h | 13.1 | gfs_global 13.7 | -0.6 | ±3 | ok |
| Denver | +24 h | wind from ° | 360 | gfs_global 2 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 39 | gfs_global 7 | 32 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1009.4 | gfs_global 1006.9 | 2.5 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 17.5 | gfs_seamless 15.2 | 2.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 13.1 | gfs_seamless 5.1 | 8.0 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 360 | gfs_seamless 3 | 3 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 39 | gfs_seamless 100 | -61 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1009.4 | gfs_seamless 1011.5 | -2.1 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 2.8 | cams_global 8.7 | -5.9 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 17.5 | NWS 16.7 | 0.8 | ±3 | ok |
| Denver | +24 h | wind km/h | 13.1 | NWS 9.3 | 3.8 | ±8 | ok |
| Denver | +24 h | cloud % | 39 | NWS 35 | 4 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.7 | GFS 0.25° raw 11.7 | -0.0 | ±0.7 | ok |
| London | +0 h | wind km/h | 10.8 | GFS 0.25° raw 9.9 | 0.9 | ±3 | ok |
| London | +0 h | wind from ° | 87 | GFS 0.25° raw 92 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 54 | GFS 0.25° raw 45 | 8 | ±15 | ok |
| London | +0 h | pressure hPa | 1030.2 | GFS 0.25° raw 1030.1 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.7 | stored grid 11.6 | 0.1 | ±0.15 | ok |
| London | +0 h | wind km/h | 10.8 | stored grid 10.8 | -0.0 | ±1 | ok |
| London | +0 h | cloud % | 54 | stored grid 54 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1030.19 | stored grid 1030.15 | 0.04 | ±0.1 | ok |
| London | +0 h | temp °C | 11.7 | gfs_global 11.8 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 10.8 | gfs_global 9.7 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 87 | gfs_global 92 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 54 | gfs_global 18 | 36 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.2 | gfs_global 1030.1 | 0.1 | ±1 | ok |
| London | +0 h | temp °C | 11.7 | gfs_seamless 11.8 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 10.8 | gfs_seamless 9.7 | 1.1 | ±3 | ok |
| London | +0 h | wind from ° | 87 | gfs_seamless 92 | 5 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 54 | gfs_seamless 18 | 36 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.2 | gfs_seamless 1030.1 | 0.1 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.4 | cams_global 15.0 | -2.6 | ±3 | ok |
| London | +24 h | temp °C | 10.7 | GFS 0.25° raw 10.9 | -0.2 | ±0.7 | ok |
| London | +24 h | wind km/h | 5.4 | GFS 0.25° raw 4.7 | 0.7 | ±3 | ok |
| London | +24 h | wind from ° | 74 | GFS 0.25° raw 69 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 63 | GFS 0.25° raw 71 | -9 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.1 | GFS 0.25° raw 1032.1 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.7 | stored grid 10.8 | -0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 5.4 | stored grid 5.3 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 63 | stored grid 62 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.13 | stored grid 1032.14 | -0.01 | ±0.1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_global 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_global 4.6 | 0.8 | ±3 | ok |
| London | +24 h | wind from ° | 74 | gfs_global 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 63 | gfs_global 83 | -20 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1032.1 | gfs_global 1032.2 | -0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_seamless 11.1 | -0.4 | ±1 | ok |
| London | +24 h | wind km/h | 5.4 | gfs_seamless 4.6 | 0.8 | ±3 | ok |
| London | +24 h | wind from ° | 74 | gfs_seamless 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 63 | gfs_seamless 83 | -20 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1032.1 | gfs_seamless 1032.2 | -0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 18.3 | cams_global 20.4 | -2.1 | ±3 | ok |
| Delhi | +0 h | temp °C | 21.3 | GFS 0.25° raw 22.5 | -1.1 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 2.5 | GFS 0.25° raw 4.0 | -1.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 295 | GFS 0.25° raw 325 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.2 | GFS 0.25° raw 1017.1 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.3 | stored grid 21.4 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 2.5 | stored grid 3.0 | -0.5 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.20 | stored grid 1017.20 | 0.00 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_global 23.6 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 2.5 | gfs_global 5.8 | -3.3 | ±3 | **FAIL** |
| Delhi | +0 h | wind from ° | 295 | gfs_global 353 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.2 | gfs_global 1017.2 | 0.0 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_seamless 23.6 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 2.5 | gfs_seamless 5.8 | -3.3 | ±3 | **FAIL** |
| Delhi | +0 h | wind from ° | 295 | gfs_seamless 353 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.2 | gfs_seamless 1017.2 | 0.0 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 38.3 | cams_global 61.2 | -22.9 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.7 | GFS 0.25° raw 24.2 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.0 | GFS 0.25° raw 4.5 | 1.5 | ±3 | ok |
| Delhi | +24 h | wind from ° | 199 | GFS 0.25° raw 202 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | GFS 0.25° raw 2 | -0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.4 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.7 | stored grid 22.7 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 6.0 | stored grid 6.1 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 2 | stored grid 2 | -0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.56 | stored grid 1015.56 | 0.00 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.7 | gfs_global 25.1 | -2.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.0 | gfs_global 4.3 | 1.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 199 | gfs_global 204 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_global 6 | -4 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_global 1015.4 | 0.2 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.7 | gfs_seamless 25.1 | -2.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 6.0 | gfs_seamless 4.3 | 1.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 199 | gfs_seamless 204 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 2 | gfs_seamless 6 | -4 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_seamless 1015.4 | 0.2 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 61.3 | cams_global 108.0 | -46.7 | ±3 | **FAIL** |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | 18.60 | 18.95 | -0.35 | 11.8 | 11.2 | 0.7 | 32 | 11 |
| Dayton OH | +24 h | 17.23 | 17.64 | -0.40 | 15.5 | 14.6 | 0.9 | 100 | 100 |
| Miami | +0 h | 28.34 | 28.61 | -0.27 | 16.8 | 15.9 | 0.9 | 19 | 8 |
| Miami | +24 h | 27.63 | 27.62 | 0.01 | 25.2 | 27.0 | -1.8 | 100 | 100 |
| Denver | +0 h | 19.65 | 19.72 | -0.07 | 9.1 | 9.4 | -0.4 | 61 | 59 |
| Denver | +24 h | 17.50 | 17.74 | -0.24 | 13.4 | 13.7 | -0.3 | 39 | 44 |
| London | +0 h | 11.58 | 11.67 | -0.09 | 10.8 | 9.9 | 0.9 | 54 | 45 |
| London | +24 h | 10.78 | 10.94 | -0.16 | 5.3 | 4.7 | 0.6 | 62 | 71 |
| Delhi | +0 h | 21.36 | 22.47 | -1.11 | 3.0 | 4.0 | -1.0 | 0 | 0 |
| Delhi | +24 h | 22.71 | 24.16 | -1.45 | 6.1 | 4.5 | 1.6 | 2 | 2 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 16.20 | 16.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1009.70 | 1009.65 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 15.00 | 14.93 | 0.07 | ±1 | ok |
| Chile coast | +0 h | temp | 17.40 | 17.41 | -0.01 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1013.20 | 1013.19 | 0.01 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 56.00 | 55.65 | 0.35 | ±1 | ok |
| Dayton | +0 h | temp | 18.00 | 18.09 | -0.09 | ±0.5 | ok |
| Dayton | +0 h | pres | 1025.70 | 1025.74 | -0.04 | ±0.5 | ok |
| Dayton | +0 h | cloud | 28.00 | 28.09 | -0.09 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 15.40 | 15.47 | -0.07 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1018.60 | 1018.63 | -0.03 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 28.00 | 27.94 | 0.06 | ±1 | ok |
| Chile coast | +24 h | temp | 17.80 | 17.77 | 0.03 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.30 | 1014.31 | -0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 40.00 | 40.41 | -0.41 | ±1 | ok |
| Dayton | +24 h | temp | 16.60 | 16.67 | -0.07 | ±0.5 | ok |
| Dayton | +24 h | pres | 1027.00 | 1027.02 | -0.02 | ±0.5 | ok |
| Dayton | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 43.30 | 43.30 | -0.00 | ±0.2 | ok |
| node 52N 0E (London) | +0 h | 12.50 | 12.50 | 0.00 | ±0.2 | ok |
| node 40N 116E (Beijing) | +0 h | 40.30 | 40.30 | -0.00 | ±0.2 | ok |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":144,"2024 24-h mean":11,"2012 hourly":155,"2012 24-h mean":43}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Dayton OH | 3.9 | 6.1 | 36 | 22 | 34 | 16 | 25 |
| Miami | 5.1 | 6.2 | 35 | 28 | 34 | 21 | 25 |
| Denver | 12.4 | 16.9 | 65 | 57 | 66 | 52 | 61 |
| London | 15.0 | 13.2 | 58 | 62 | 58 | 57 | 53 |
| Delhi | 61.2 | 35.0 | 96 | 155 | 99 | 154 | 99 |
| node 28N 76E (Delhi) | 43.3 | 22.4 | 73 | 120 | 76 | 120 | 72 |
| node 52N 0E (London) | 12.5 | 10.6 | 53 | 57 | 54 | 52 | 44 |
| node 40N 116E (Beijing) | 40.3 | 40.9 | 114 | 113 | 114 | 113 | 114 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 19 °Cat 2 m·39.7°N 84.1°W | 11 km/hfrom NE·39.7°N 84.1°W | Drypast hour · area avg·39.7°N 84.1°W | 32 %area average·39.7°N 84.1°W | 1026 hPasea level·39.7°N 84.1°W | 3.4 µg/m³Good · AQI 38 (24 h)·39.7°N 84.1°W |
| Miami | 28 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom E·25.7°N 80.1°W | 0.1 mm/hpast hour · area avg·25.7°N 80.1°W | 19 %area average·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 7.6 µg/m³Good · AQI 41 (24 h)·25.7°N 80.1°W |
| Denver | 20 °Cat 2 m·39.7°N 104.9°W | 9 km/hfrom ENE·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 60 %area average·39.7°N 104.9°W | 1011 hPasea level·39.7°N 104.9°W | 7.3 µg/m³Good · AQI 50 (24 h)·39.7°N 104.9°W |
| London | 12 °Cat 2 m·51.5°N 0.1°W | 11 km/hfrom E·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 54 %area average·51.5°N 0.1°W | 1030 hPasea level·51.5°N 0.1°W | 12 µg/m³Moderate · AQI 51 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 3 km/hfrom WNW·28.6°N 77.2°E | Drypast hour · area avg·28.6°N 77.2°E | 0 %area average·28.6°N 77.2°E | 1017 hPasea level·28.6°N 77.2°E | 38 µg/m³Sensitive groups · AQI 82 (24 h)·28.6°N 77.2°E |
