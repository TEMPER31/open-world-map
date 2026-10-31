# Accuracy check (before)

Generated 2026-10-30T01:34:29.594Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-29T18:00:00.000Z, timeline +0 h = 2026-10-30T01:00:00.000Z (f007); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (pipeline fidelity): 47 / 9 / 4
- Open-Meteo gfs_global: 43 / 13 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 39 / 17 / 4
- Open-Meteo cams_global at the cities: 5 / 5 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| US test city | +0 h | temp °C | 16.8 | GFS 0.25° raw 17.4 | -0.5 | ±0.7 | ok |
| US test city | +0 h | wind km/h | 12.4 | GFS 0.25° raw 12.5 | -0.1 | ±3 | ok |
| US test city | +0 h | wind from ° | 223 | GFS 0.25° raw 222 | 1 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 6 | GFS 0.25° raw 5 | 1 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1020.4 | GFS 0.25° raw 1020.4 | 0.0 | ±0.5 | ok |
| US test city | +0 h | temp °C | 16.8 | gfs_global 19.5 | -2.7 | ±1 | **FAIL** |
| US test city | +0 h | wind km/h | 12.4 | gfs_global 11.5 | 0.9 | ±3 | ok |
| US test city | +0 h | wind from ° | 223 | gfs_global 221 | 2 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 6 | gfs_global 6 | 0 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1020.4 | gfs_global 1020.5 | -0.1 | ±1 | ok |
| US test city | +0 h | temp °C | 16.8 | gfs_seamless 17.3 | -0.5 | ±1 | ok |
| US test city | +0 h | wind km/h | 12.4 | gfs_seamless 10.1 | 2.3 | ±3 | ok |
| US test city | +0 h | wind from ° | 223 | gfs_seamless 205 | 18 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 6 | gfs_seamless 0 | 6 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1020.4 | gfs_seamless 1019.2 | 1.2 | ±1 | **FAIL** |
| US test city | +0 h | PM2.5 µg/m³ | 13.8 | cams_global 14.1 | -0.3 | ±3 | ok |
| US test city | +0 h | temp °C | 16.8 | NWS 18.3 | -1.5 | ±3 | ok |
| US test city | +0 h | wind km/h | 12.4 | NWS 9.3 | 3.2 | ±8 | ok |
| US test city | +0 h | cloud % | 6 | NWS 22 | -16 | ±30 | ok |
| US test city | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| US test city | +24 h | temp °C | 12.2 | GFS 0.25° raw 12.8 | -0.6 | ±0.7 | ok |
| US test city | +24 h | wind km/h | 12.2 | GFS 0.25° raw 11.2 | 1.0 | ±3 | ok |
| US test city | +24 h | wind from ° | 55 | GFS 0.25° raw 52 | 3 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| US test city | +24 h | pressure hPa | 1027.9 | GFS 0.25° raw 1027.9 | 0.1 | ±0.5 | ok |
| US test city | +24 h | temp °C | 12.2 | gfs_global 14.5 | -2.3 | ±1 | **FAIL** |
| US test city | +24 h | wind km/h | 12.2 | gfs_global 10.0 | 2.2 | ±3 | ok |
| US test city | +24 h | wind from ° | 55 | gfs_global 52 | 3 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 99 | gfs_global 76 | 23 | ±15 | **FAIL** |
| US test city | +24 h | pressure hPa | 1027.9 | gfs_global 1028.0 | -0.1 | ±1 | ok |
| US test city | +24 h | temp °C | 12.2 | gfs_seamless 13.0 | -0.8 | ±1 | ok |
| US test city | +24 h | wind km/h | 12.2 | gfs_seamless 8.2 | 4.0 | ±3 | **FAIL** |
| US test city | +24 h | wind from ° | 55 | gfs_seamless 60 | 5 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| US test city | +24 h | pressure hPa | 1027.9 | gfs_seamless 1027.8 | 0.1 | ±1 | ok |
| US test city | +24 h | PM2.5 µg/m³ | 6.8 | cams_global 7.6 | -0.8 | ±3 | ok |
| US test city | +24 h | temp °C | 12.2 | NWS 12.8 | -0.6 | ±3 | ok |
| US test city | +24 h | wind km/h | 12.2 | NWS 7.4 | 4.7 | ±8 | ok |
| US test city | +24 h | cloud % | 99 | NWS 40 | 59 | ±30 | **FAIL** |
| US test city | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 26.8 | GFS 0.25° raw 27.5 | -0.7 | ±0.7 | **FAIL** |
| Miami | +0 h | wind km/h | 18.6 | GFS 0.25° raw 21.8 | -3.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 29 | GFS 0.25° raw 35 | 6 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.01 | GFS 0.25° raw 0.00 | 0.01 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | GFS 0.25° raw 2 | 5 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.7 | GFS 0.25° raw 1013.6 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.8 | gfs_global 27.4 | -0.6 | ±1 | ok |
| Miami | +0 h | wind km/h | 18.6 | gfs_global 23.9 | -5.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 29 | gfs_global 31 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.01 | gfs_global 0.00 | 0.01 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_global 0 | 7 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.7 | gfs_global 1013.7 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.8 | gfs_seamless 25.0 | 1.8 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 18.6 | gfs_seamless 9.4 | 9.2 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 29 | gfs_seamless 17 | 12 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.01 | gfs_seamless 0.00 | 0.01 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_seamless 50 | -43 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1013.7 | gfs_seamless 1014.4 | -0.7 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 6.7 | cams_global 6.8 | -0.1 | ±3 | ok |
| Miami | +0 h | temp °C | 26.8 | NWS 27.2 | -0.5 | ±3 | ok |
| Miami | +0 h | wind km/h | 18.6 | NWS 14.8 | 3.8 | ±8 | ok |
| Miami | +0 h | cloud % | 7 | NWS 21 | -14 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.01 | NWS 0.00 | 0.01 | ±1 | ok |
| Miami | +24 h | temp °C | 26.5 | GFS 0.25° raw 26.8 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 20.1 | GFS 0.25° raw 24.9 | -4.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 72 | GFS 0.25° raw 72 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.47 | GFS 0.25° raw 0.82 | -0.35 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 30 | GFS 0.25° raw 35 | -5 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.8 | GFS 0.25° raw 1015.9 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.5 | gfs_global 26.8 | -0.3 | ±1 | ok |
| Miami | +24 h | wind km/h | 20.1 | gfs_global 26.4 | -6.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 72 | gfs_global 70 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.47 | gfs_global 0.70 | -0.23 | ±0.3 | ok |
| Miami | +24 h | cloud % | 30 | gfs_global 37 | -7 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.8 | gfs_global 1015.8 | 0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 26.5 | gfs_seamless 24.5 | 2.0 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 20.1 | gfs_seamless 6.9 | 13.2 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 72 | gfs_seamless 62 | 10 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.47 | gfs_seamless 1.10 | -0.63 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 30 | gfs_seamless 100 | -70 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1015.8 | gfs_seamless 1016.1 | -0.3 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 9.0 | cams_global 4.1 | 4.9 | ±3 | **FAIL** |
| Miami | +24 h | temp °C | 26.5 | NWS 27.2 | -0.8 | ±3 | ok |
| Miami | +24 h | wind km/h | 20.1 | NWS 20.4 | -0.3 | ±8 | ok |
| Miami | +24 h | cloud % | 30 | NWS 46 | -16 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.47 | NWS 0.04 | 0.43 | ±1 | ok |
| Denver | +0 h | temp °C | 11.5 | GFS 0.25° raw 15.1 | -3.7 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 9.2 | GFS 0.25° raw 9.2 | 0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 33 | GFS 0.25° raw 34 | 0 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | GFS 0.25° raw 100 | -0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1014.8 | GFS 0.25° raw 1014.3 | 0.5 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 11.5 | gfs_global 15.5 | -4.0 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 9.2 | gfs_global 9.1 | 0.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 33 | gfs_global 34 | 1 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_global 12 | 88 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1014.8 | gfs_global 1013.4 | 1.4 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 11.5 | gfs_seamless 12.2 | -0.7 | ±1 | ok |
| Denver | +0 h | wind km/h | 9.2 | gfs_seamless 8.3 | 0.9 | ±3 | ok |
| Denver | +0 h | wind from ° | 33 | gfs_seamless 0 | 33 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_seamless 0 | 100 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1014.8 | gfs_seamless 1012.4 | 2.4 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 2.6 | cams_global 10.7 | -8.1 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 11.5 | NWS 14.4 | -3.0 | ±3 | ok |
| Denver | +0 h | wind km/h | 9.2 | NWS 9.3 | -0.1 | ±8 | ok |
| Denver | +0 h | cloud % | 100 | NWS 24 | 76 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 12.2 | GFS 0.25° raw 15.9 | -3.7 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 8.4 | GFS 0.25° raw 8.0 | 0.4 | ±3 | ok |
| Denver | +24 h | wind from ° | 43 | GFS 0.25° raw 46 | 3 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | GFS 0.25° raw 75 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.4 | 0.3 | ±0.5 | ok |
| Denver | +24 h | temp °C | 12.2 | gfs_global 16.4 | -4.2 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 8.4 | gfs_global 8.2 | 0.2 | ±3 | ok |
| Denver | +24 h | wind from ° | 43 | gfs_global 49 | 6 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | gfs_global 100 | -26 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1011.7 | gfs_global 1009.9 | 1.8 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 12.2 | gfs_seamless 14.1 | -1.9 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 8.4 | gfs_seamless 8.4 | 0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 43 | gfs_seamless 345 | 58 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 74 | gfs_seamless 100 | -26 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1011.7 | gfs_seamless 1011.8 | -0.1 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 2.9 | cams_global 14.7 | -11.8 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 12.2 | NWS 15.0 | -2.8 | ±3 | ok |
| Denver | +24 h | wind km/h | 8.4 | NWS 7.4 | 1.0 | ±8 | ok |
| Denver | +24 h | cloud % | 74 | NWS 23 | 51 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 10.9 | GFS 0.25° raw 11.0 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 7.4 | GFS 0.25° raw 5.6 | 1.8 | ±3 | ok |
| London | +0 h | wind from ° | 107 | GFS 0.25° raw 106 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 14 | GFS 0.25° raw 6 | 8 | ±15 | ok |
| London | +0 h | pressure hPa | 1028.9 | GFS 0.25° raw 1028.9 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 10.9 | gfs_global 11.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 7.4 | gfs_global 5.7 | 1.7 | ±3 | ok |
| London | +0 h | wind from ° | 107 | gfs_global 108 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 14 | gfs_global 8 | 6 | ±15 | ok |
| London | +0 h | pressure hPa | 1028.9 | gfs_global 1028.9 | -0.0 | ±1 | ok |
| London | +0 h | temp °C | 10.9 | gfs_seamless 11.0 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 7.4 | gfs_seamless 5.7 | 1.7 | ±3 | ok |
| London | +0 h | wind from ° | 107 | gfs_seamless 108 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 14 | gfs_seamless 8 | 6 | ±15 | ok |
| London | +0 h | pressure hPa | 1028.9 | gfs_seamless 1028.9 | -0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 9.0 | cams_global 12.8 | -3.8 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.5 | GFS 0.25° raw 10.6 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 7.9 | GFS 0.25° raw 6.0 | 1.9 | ±3 | ok |
| London | +24 h | wind from ° | 79 | GFS 0.25° raw 74 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | GFS 0.25° raw 75 | -0 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | GFS 0.25° raw 1030.5 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.5 | gfs_global 10.7 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 7.9 | gfs_global 5.7 | 2.2 | ±3 | ok |
| London | +24 h | wind from ° | 79 | gfs_global 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_global 69 | 6 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | gfs_global 1030.5 | -0.0 | ±1 | ok |
| London | +24 h | temp °C | 10.5 | gfs_seamless 10.7 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 7.9 | gfs_seamless 5.7 | 2.2 | ±3 | ok |
| London | +24 h | wind from ° | 79 | gfs_seamless 72 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 75 | gfs_seamless 69 | 6 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | gfs_seamless 1030.5 | -0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 13.3 | cams_global 15.4 | -2.1 | ±3 | ok |
| Delhi | +0 h | temp °C | 21.0 | GFS 0.25° raw 21.8 | -0.8 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | GFS 0.25° raw 6.5 | 0.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | GFS 0.25° raw 107 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.21 | GFS 0.25° raw 0.12 | 0.09 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 96 | GFS 0.25° raw 100 | -4 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.8 | GFS 0.25° raw 1016.7 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.0 | gfs_global 22.9 | -1.9 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_global 7.6 | -1.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | gfs_global 109 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.21 | gfs_global 0.00 | 0.21 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 96 | gfs_global 100 | -4 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.8 | gfs_global 1016.8 | -0.0 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.0 | gfs_seamless 22.9 | -1.9 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_seamless 7.6 | -1.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | gfs_seamless 109 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.21 | gfs_seamless 0.00 | 0.21 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 96 | gfs_seamless 100 | -4 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.8 | gfs_seamless 1016.8 | -0.0 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 24.2 | cams_global 25.3 | -1.1 | ±3 | ok |
| Delhi | +24 h | temp °C | 19.7 | GFS 0.25° raw 20.7 | -0.9 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 0.9 | GFS 0.25° raw 0.9 | 0.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 145 | GFS 0.25° raw 86 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1018.6 | GFS 0.25° raw 1018.5 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 19.7 | gfs_global 21.5 | -1.8 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 0.9 | gfs_global 1.6 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 145 | gfs_global 63 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1018.6 | gfs_global 1018.6 | -0.0 | ±1 | ok |
| Delhi | +24 h | temp °C | 19.7 | gfs_seamless 21.5 | -1.8 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 0.9 | gfs_seamless 1.6 | -0.7 | ±3 | ok |
| Delhi | +24 h | wind from ° | 145 | gfs_seamless 63 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1018.6 | gfs_seamless 1018.6 | -0.0 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 51.4 | cams_global 41.2 | 10.2 | ±3 | **FAIL** |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 18.20 | 18.26 | -0.06 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1017.30 | 1017.31 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 93.00 | 93.17 | -0.17 | ±1 | ok |
| Chile coast | +0 h | temp | 12.00 | 11.99 | 0.01 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.40 | 1015.40 | 0.00 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 8.00 | 8.03 | -0.03 | ±1 | ok |
| US test city | +0 h | temp | 17.00 | 16.93 | 0.07 | ±0.5 | ok |
| US test city | +0 h | pres | 1020.10 | 1020.08 | 0.02 | ±0.5 | ok |
| US test city | +0 h | cloud | 4.00 | 3.72 | 0.28 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 20.20 | 20.16 | 0.04 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1011.70 | 1011.71 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 0.00 | 0.24 | -0.24 | ±1 | ok |
| Chile coast | +24 h | temp | 13.20 | 13.15 | 0.04 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1013.80 | 1013.82 | -0.02 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| US test city | +24 h | temp | 11.60 | 11.63 | -0.02 | ±0.5 | ok |
| US test city | +24 h | pres | 1028.30 | 1028.35 | -0.05 | ±0.5 | ok |
| US test city | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 16.80 | 16.80 | -0.00 | ±0.2 | ok |
| node 52N 0E (London) | +0 h | 10.10 | 10.10 | 0.00 | ±0.2 | ok |
| node 40N 116E (Beijing) | +0 h | 58.00 | 58.00 | 0.00 | ±0.2 | ok |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":65,"2024 24-h mean":22,"2012 hourly":97,"2012 24-h mean":61}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| US test city | 14.1 | 9.4 | 56 | 60 | 52 | 55 | 39 |
| Miami | 6.8 | 5.1 | 35 | 38 | 28 | 28 | 21 |
| Denver | 10.7 | 11.7 | 55 | 54 | 56 | 45 | 49 |
| London | 12.8 | 17.3 | 66 | 58 | 66 | 52 | 62 |
| Delhi | 25.3 | 25.8 | 87 | 81 | 82 | 79 | 80 |
| node 28N 76E (Delhi) | 16.8 | 33.2 | 100 | 65 | 96 | 61 | 95 |
| node 52N 0E (London) | 10.1 | 10.8 | 53 | 53 | 54 | 42 | 45 |
| node 40N 116E (Beijing) | 58.0 | 53.4 | 145 | 153 | 145 | 152 | 145 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| US test city | 17 °Cat 2 m·US test city | 12 km/hfrom SW·US test city | Drypast hour·US test city | 6 %cloud cover·US test city | 1020 hPasea level·US test city | 14 µg/m³Moderate · AQI 51 (24 h)·US test city |
| Miami | 27 °Cat 2 m·25.7°N 80.1°W | 19 km/hfrom NNE·25.7°N 80.1°W | Drypast hour·25.7°N 80.1°W | 7 %cloud cover·25.7°N 80.1°W | 1014 hPasea level·25.7°N 80.1°W | 6.7 µg/m³Good · AQI 39 (24 h)·25.7°N 80.1°W |
| Denver | 11 °Cat 2 m·39.7°N 104.9°W | 9 km/hfrom NNE·39.7°N 104.9°W | Drypast hour·39.7°N 104.9°W | 100 %cloud cover·39.7°N 104.9°W | 1015 hPasea level·39.7°N 104.9°W | 2.6 µg/m³Good · AQI 36 (24 h)·39.7°N 104.9°W |
| London | 11 °Cat 2 m·51.5°N 0.1°W | 7 km/hfrom ESE·51.5°N 0.1°W | Drypast hour·51.5°N 0.1°W | 14 %cloud cover·51.5°N 0.1°W | 1029 hPasea level·51.5°N 0.1°W | 9.0 µg/m³Good · AQI 50 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 7 km/hfrom ESE·28.6°N 77.2°E | 0.2 mm/hpast hour·28.6°N 77.2°E | 96 %cloud cover·28.6°N 77.2°E | 1017 hPasea level·28.6°N 77.2°E | 24 µg/m³Moderate · AQI 101 (24 h)·28.6°N 77.2°E |
