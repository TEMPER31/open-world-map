# Accuracy check (after)

Generated 2026-10-30T00:12:33.076Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-29T18:00:00.000Z, timeline +0 h = 2026-10-30T00:00:00.000Z (f006); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (pipeline fidelity): 47 / 10 / 3
- Open-Meteo gfs_global: 43 / 14 / 3
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 20 / 3
- Open-Meteo cams_global at the cities: 4 / 6 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| US test city | +0 h | temp °C | 17.5 | GFS 0.25° raw 18.0 | -0.5 | ±0.7 | ok |
| US test city | +0 h | wind km/h | 11.1 | GFS 0.25° raw 10.9 | 0.2 | ±3 | ok |
| US test city | +0 h | wind from ° | 226 | GFS 0.25° raw 225 | 1 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 13 | GFS 0.25° raw 15 | -1 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1020.1 | GFS 0.25° raw 1020.1 | 0.0 | ±0.5 | ok |
| US test city | +0 h | temp °C | 17.5 | gfs_global 20.0 | -2.5 | ±1 | **FAIL** |
| US test city | +0 h | wind km/h | 11.1 | gfs_global 9.9 | 1.2 | ±3 | ok |
| US test city | +0 h | wind from ° | 226 | gfs_global 224 | 2 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 13 | gfs_global 70 | -57 | ±15 | **FAIL** |
| US test city | +0 h | pressure hPa | 1020.1 | gfs_global 1020.0 | 0.1 | ±1 | ok |
| US test city | +0 h | temp °C | 17.5 | gfs_seamless 18.2 | -0.7 | ±1 | ok |
| US test city | +0 h | wind km/h | 11.1 | gfs_seamless 8.3 | 2.8 | ±3 | ok |
| US test city | +0 h | wind from ° | 226 | gfs_seamless 223 | 3 | ±20 | ok |
| US test city | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +0 h | cloud % | 13 | gfs_seamless 0 | 13 | ±15 | ok |
| US test city | +0 h | pressure hPa | 1020.1 | gfs_seamless 1019.3 | 0.8 | ±1 | ok |
| US test city | +0 h | PM2.5 µg/m³ | 13.4 | cams_global 13.7 | -0.3 | ±3 | ok |
| US test city | +0 h | temp °C | 17.5 | NWS 20.6 | -3.1 | ±3 | **FAIL** |
| US test city | +0 h | wind km/h | 11.1 | NWS 11.1 | 0.0 | ±8 | ok |
| US test city | +0 h | cloud % | 13 | NWS 20 | -7 | ±30 | ok |
| US test city | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| US test city | +24 h | temp °C | 12.9 | GFS 0.25° raw 13.7 | -0.8 | ±0.7 | **FAIL** |
| US test city | +24 h | wind km/h | 12.1 | GFS 0.25° raw 11.3 | 0.9 | ±3 | ok |
| US test city | +24 h | wind from ° | 58 | GFS 0.25° raw 57 | 1 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 83 | GFS 0.25° raw 57 | 26 | ±15 | **FAIL** |
| US test city | +24 h | pressure hPa | 1027.5 | GFS 0.25° raw 1027.3 | 0.1 | ±0.5 | ok |
| US test city | +24 h | temp °C | 12.9 | gfs_global 15.4 | -2.5 | ±1 | **FAIL** |
| US test city | +24 h | wind km/h | 12.1 | gfs_global 10.0 | 2.1 | ±3 | ok |
| US test city | +24 h | wind from ° | 58 | gfs_global 60 | 2 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 83 | gfs_global 100 | -17 | ±15 | **FAIL** |
| US test city | +24 h | pressure hPa | 1027.5 | gfs_global 1027.2 | 0.3 | ±1 | ok |
| US test city | +24 h | temp °C | 12.9 | gfs_seamless 13.9 | -1.0 | ±1 | **FAIL** |
| US test city | +24 h | wind km/h | 12.1 | gfs_seamless 7.7 | 4.4 | ±3 | **FAIL** |
| US test city | +24 h | wind from ° | 58 | gfs_seamless 61 | 3 | ±20 | ok |
| US test city | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| US test city | +24 h | cloud % | 83 | gfs_seamless 100 | -17 | ±15 | **FAIL** |
| US test city | +24 h | pressure hPa | 1027.5 | gfs_seamless 1027.5 | -0.0 | ±1 | ok |
| US test city | +24 h | PM2.5 µg/m³ | 7.1 | cams_global 7.8 | -0.7 | ±3 | ok |
| US test city | +24 h | temp °C | 12.9 | NWS 13.9 | -1.0 | ±3 | ok |
| US test city | +24 h | wind km/h | 12.1 | NWS 7.4 | 4.7 | ±8 | ok |
| US test city | +24 h | cloud % | 83 | NWS 27 | 56 | ±30 | **FAIL** |
| US test city | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 26.9 | GFS 0.25° raw 27.5 | -0.6 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 17.5 | GFS 0.25° raw 21.9 | -4.5 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 30 | GFS 0.25° raw 37 | 7 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.02 | GFS 0.25° raw 0.00 | 0.02 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | GFS 0.25° raw 1 | 6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.4 | GFS 0.25° raw 1013.4 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.9 | gfs_global 27.3 | -0.4 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.5 | gfs_global 24.9 | -7.4 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 30 | gfs_global 34 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.02 | gfs_global 0.00 | 0.02 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_global 0 | 7 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.4 | gfs_global 1013.4 | 0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.9 | gfs_seamless 24.8 | 2.1 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 17.5 | gfs_seamless 9.4 | 8.1 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 30 | gfs_seamless 6 | 24 | ±20 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.02 | gfs_seamless 0.00 | 0.02 | ±0.3 | ok |
| Miami | +0 h | cloud % | 7 | gfs_seamless 13 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1013.4 | gfs_seamless 1014.0 | -0.6 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 6.6 | cams_global 7.1 | -0.5 | ±3 | ok |
| Miami | +0 h | temp °C | 26.9 | NWS 27.2 | -0.4 | ±3 | ok |
| Miami | +0 h | wind km/h | 17.5 | NWS 14.8 | 2.7 | ±8 | ok |
| Miami | +0 h | cloud % | 7 | NWS 26 | -19 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.02 | NWS 0.00 | 0.02 | ±1 | ok |
| Miami | +24 h | temp °C | 26.5 | GFS 0.25° raw 26.8 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 19.4 | GFS 0.25° raw 23.2 | -3.8 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 70 | GFS 0.25° raw 71 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.37 | GFS 0.25° raw 0.43 | -0.05 | ±0.3 | ok |
| Miami | +24 h | cloud % | 26 | GFS 0.25° raw 21 | 5 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.3 | GFS 0.25° raw 1015.3 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.5 | gfs_global 27.0 | -0.5 | ±1 | ok |
| Miami | +24 h | wind km/h | 19.4 | gfs_global 24.3 | -4.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 70 | gfs_global 69 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.37 | gfs_global 0.30 | 0.07 | ±0.3 | ok |
| Miami | +24 h | cloud % | 26 | gfs_global 25 | 1 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1015.3 | gfs_global 1015.2 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.5 | gfs_seamless 24.6 | 1.9 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 19.4 | gfs_seamless 6.3 | 13.1 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 70 | gfs_seamless 24 | 46 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.37 | gfs_seamless 0.00 | 0.37 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 26 | gfs_seamless 100 | -74 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1015.3 | gfs_seamless 1015.6 | -0.3 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 8.8 | cams_global 3.9 | 4.9 | ±3 | **FAIL** |
| Miami | +24 h | temp °C | 26.5 | NWS 27.8 | -1.3 | ±3 | ok |
| Miami | +24 h | wind km/h | 19.4 | NWS 18.5 | 0.9 | ±8 | ok |
| Miami | +24 h | cloud % | 26 | NWS 40 | -14 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.37 | NWS 0.04 | 0.33 | ±1 | ok |
| Denver | +0 h | temp °C | 13.1 | GFS 0.25° raw 16.6 | -3.6 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 11.1 | GFS 0.25° raw 10.8 | 0.2 | ±3 | ok |
| Denver | +0 h | wind from ° | 57 | GFS 0.25° raw 52 | 4 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 33 | GFS 0.25° raw 8 | 25 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1013.8 | GFS 0.25° raw 1013.2 | 0.6 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 13.1 | gfs_global 17.1 | -4.0 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 11.1 | gfs_global 11.4 | -0.3 | ±3 | ok |
| Denver | +0 h | wind from ° | 57 | gfs_global 55 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 33 | gfs_global 6 | 27 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1013.8 | gfs_global 1011.7 | 2.1 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 13.1 | gfs_seamless 15.1 | -2.0 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 11.1 | gfs_seamless 10.0 | 1.1 | ±3 | ok |
| Denver | +0 h | wind from ° | 57 | gfs_seamless 10 | 47 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 33 | gfs_seamless 0 | 33 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1013.8 | gfs_seamless 1011.5 | 2.3 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 2.6 | cams_global 8.7 | -6.1 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 13.1 | NWS 15.6 | -2.5 | ±3 | ok |
| Denver | +0 h | wind km/h | 11.1 | NWS 11.1 | -0.0 | ±8 | ok |
| Denver | +0 h | cloud % | 33 | NWS 12 | 21 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 14.2 | GFS 0.25° raw 17.4 | -3.2 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 9.8 | GFS 0.25° raw 9.8 | -0.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 23 | GFS 0.25° raw 25 | 2 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1010.6 | GFS 0.25° raw 1010.1 | 0.4 | ±0.5 | ok |
| Denver | +24 h | temp °C | 14.2 | gfs_global 17.9 | -3.7 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.8 | gfs_global 10.0 | -0.2 | ±3 | ok |
| Denver | +24 h | wind from ° | 23 | gfs_global 26 | 3 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1010.6 | gfs_global 1008.4 | 2.2 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 14.2 | gfs_seamless 15.5 | -1.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.8 | gfs_seamless 9.3 | 0.5 | ±3 | ok |
| Denver | +24 h | wind from ° | 23 | gfs_seamless 342 | 41 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1010.6 | gfs_seamless 1010.7 | -0.1 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 3.0 | cams_global 10.6 | -7.6 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 14.2 | NWS 16.1 | -1.9 | ±3 | ok |
| Denver | +24 h | wind km/h | 9.8 | NWS 9.3 | 0.6 | ±8 | ok |
| Denver | +24 h | cloud % | 99 | NWS 27 | 72 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.1 | GFS 0.25° raw 11.2 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 7.5 | GFS 0.25° raw 5.7 | 1.9 | ±3 | ok |
| London | +0 h | wind from ° | 105 | GFS 0.25° raw 108 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 9 | GFS 0.25° raw 11 | -1 | ±15 | ok |
| London | +0 h | pressure hPa | 1029.1 | GFS 0.25° raw 1029.1 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 11.1 | gfs_global 11.3 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 7.5 | gfs_global 5.7 | 1.8 | ±3 | ok |
| London | +0 h | wind from ° | 105 | gfs_global 108 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 9 | gfs_global 14 | -5 | ±15 | ok |
| London | +0 h | pressure hPa | 1029.1 | gfs_global 1029.1 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 11.1 | gfs_seamless 11.3 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 7.5 | gfs_seamless 5.7 | 1.8 | ±3 | ok |
| London | +0 h | wind from ° | 105 | gfs_seamless 108 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 9 | gfs_seamless 14 | -5 | ±15 | ok |
| London | +0 h | pressure hPa | 1029.1 | gfs_seamless 1029.1 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 8.4 | cams_global 12.8 | -4.4 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.7 | GFS 0.25° raw 10.8 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 8.2 | GFS 0.25° raw 5.8 | 2.4 | ±3 | ok |
| London | +24 h | wind from ° | 76 | GFS 0.25° raw 65 | 11 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 50 | GFS 0.25° raw 54 | -4 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.4 | GFS 0.25° raw 1030.4 | -0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.7 | gfs_global 10.9 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.2 | gfs_global 5.6 | 2.6 | ±3 | ok |
| London | +24 h | wind from ° | 76 | gfs_global 63 | 13 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 50 | gfs_global 74 | -24 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.4 | gfs_global 1030.2 | 0.2 | ±1 | ok |
| London | +24 h | temp °C | 10.7 | gfs_seamless 10.9 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.2 | gfs_seamless 5.6 | 2.6 | ±3 | ok |
| London | +24 h | wind from ° | 76 | gfs_seamless 63 | 13 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 50 | gfs_seamless 74 | -24 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.4 | gfs_seamless 1030.2 | 0.2 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 12.9 | cams_global 15.3 | -2.4 | ±3 | ok |
| Delhi | +0 h | temp °C | 21.1 | GFS 0.25° raw 21.9 | -0.8 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | GFS 0.25° raw 6.8 | -0.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 93 | GFS 0.25° raw 90 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.20 | GFS 0.25° raw 0.11 | 0.08 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.2 | GFS 0.25° raw 1016.2 | -0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.1 | gfs_global 22.6 | -1.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_global 7.6 | -1.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 93 | gfs_global 87 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.20 | gfs_global 0.00 | 0.20 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.2 | gfs_global 1016.1 | 0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.1 | gfs_seamless 22.6 | -1.5 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.6 | gfs_seamless 7.6 | -1.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 93 | gfs_seamless 87 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.20 | gfs_seamless 0.00 | 0.20 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1016.2 | gfs_seamless 1016.1 | 0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 23.8 | cams_global 20.7 | 3.1 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 19.9 | GFS 0.25° raw 20.7 | -0.8 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.1 | GFS 0.25° raw 2.4 | -0.3 | ±3 | ok |
| Delhi | +24 h | wind from ° | 138 | GFS 0.25° raw 104 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.8 | GFS 0.25° raw 1017.7 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 19.9 | gfs_global 21.5 | -1.6 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.1 | gfs_global 2.9 | -0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 138 | gfs_global 97 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.8 | gfs_global 1018.4 | -0.6 | ±1 | ok |
| Delhi | +24 h | temp °C | 19.9 | gfs_seamless 21.5 | -1.6 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 2.1 | gfs_seamless 2.9 | -0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 138 | gfs_seamless 97 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.8 | gfs_seamless 1018.4 | -0.6 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 50.9 | cams_global 41.2 | 9.7 | ±3 | **FAIL** |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 17.80 | 17.82 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1017.90 | 1017.85 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +0 h | temp | 12.20 | 12.20 | 0.00 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.50 | 1015.52 | -0.02 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 6.00 | 6.06 | -0.06 | ±1 | ok |
| US test city | +0 h | temp | 17.60 | 17.70 | -0.09 | ±0.5 | ok |
| US test city | +0 h | pres | 1019.90 | 1019.92 | -0.02 | ±0.5 | ok |
| US test city | +0 h | cloud | 10.00 | 10.22 | -0.22 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 19.00 | 19.08 | -0.08 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1011.90 | 1011.94 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Chile coast | +24 h | temp | 13.20 | 13.24 | -0.04 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1013.90 | 1013.89 | 0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 94.00 | 93.97 | 0.03 | ±1 | ok |
| US test city | +24 h | temp | 12.40 | 12.37 | 0.03 | ±0.5 | ok |
| US test city | +24 h | pres | 1027.70 | 1027.74 | -0.04 | ±0.5 | ok |
| US test city | +24 h | cloud | 69.00 | 68.69 | 0.31 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 15.40 | 15.40 | -0.00 | ±0.2 | ok |
| node 52N 0E (London) | +0 h | 9.40 | 9.40 | -0.00 | ±0.2 | ok |
| node 40N 116E (Beijing) | +0 h | 66.40 | 66.40 | 0.00 | ±0.2 | ok |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":102,"2024 24-h mean":24,"2012 hourly":137,"2012 24-h mean":62}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| US test city | 13.7 | 9.2 | 54 | 60 | 51 | 54 | 38 |
| Miami | 7.1 | 5.0 | 36 | 39 | 28 | 30 | 21 |
| Denver | 8.7 | 11.5 | 54 | 48 | 55 | 36 | 48 |
| London | 12.8 | 17.3 | 66 | 58 | 66 | 52 | 62 |
| Delhi | 20.7 | 28.7 | 93 | 73 | 88 | 69 | 86 |
| node 28N 76E (Delhi) | 15.4 | 35.6 | 106 | 63 | 101 | 58 | 101 |
| node 52N 0E (London) | 9.4 | 10.7 | 53 | 52 | 54 | 39 | 45 |
| node 40N 116E (Beijing) | 66.4 | 53.3 | 144 | 159 | 145 | 157 | 145 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| US test city | 18 °Cat 2 m·US test city | 11 km/hfrom SW·US test city | Drypast hour·US test city | 13 %cloud cover·US test city | 1020 hPasea level·US test city | 13 µg/m³Moderate · AQI 51 (24 h)·US test city |
| Miami | 27 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom NNE·25.7°N 80.1°W | Drypast hour·25.7°N 80.1°W | 7 %cloud cover·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 6.6 µg/m³Good · AQI 38 (24 h)·25.7°N 80.1°W |
| Denver | 13 °Cat 2 m·39.7°N 104.9°W | 11 km/hfrom ENE·39.7°N 104.9°W | Drypast hour·39.7°N 104.9°W | 33 %cloud cover·39.7°N 104.9°W | 1014 hPasea level·39.7°N 104.9°W | 2.6 µg/m³Good · AQI 33 (24 h)·39.7°N 104.9°W |
| London | 11 °Cat 2 m·51.5°N 0.1°W | 8 km/hfrom ESE·51.5°N 0.1°W | Drypast hour·51.5°N 0.1°W | 9 %cloud cover·51.5°N 0.1°W | 1029 hPasea level·51.5°N 0.1°W | 8.4 µg/m³Good · AQI 50 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 7 km/hfrom E·28.6°N 77.2°E | 0.2 mm/hpast hour·28.6°N 77.2°E | 99 %cloud cover·28.6°N 77.2°E | 1016 hPasea level·28.6°N 77.2°E | 24 µg/m³Moderate · AQI 105 (24 h)·28.6°N 77.2°E |
