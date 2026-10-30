# Accuracy check (after)

Generated 2026-10-30T02:14:57.368Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-29T18:00:00.000Z, timeline +0 h = 2026-10-30T02:00:00.000Z (f008); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding): 47 / 9 / 4
- Page vs the stored grid before encoding (encoding only): 40 / 0 / 0
- Open-Meteo gfs_global: 43 / 13 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 40 / 17 / 3
- Open-Meteo cams_global at the cities: 4 / 6 / 0
- NWS gridpoints (sanity check): 20 / 4 / 0
- Grid alignment at 0.5° nodes: 18 / 0 / 0
- Air quality at 4° grid nodes vs CAMS: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 16.2 | GFS 0.25° raw 16.8 | -0.6 | ±0.7 | ok |
| Dayton OH | +0 h | wind km/h | 12.9 | GFS 0.25° raw 12.8 | 0.1 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 230 | GFS 0.25° raw 225 | 5 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 2 | GFS 0.25° raw 1 | 1 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1020.8 | GFS 0.25° raw 1020.5 | 0.2 | ±0.5 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | stored grid 16.2 | 0.0 | ±0.15 | ok |
| Dayton OH | +0 h | wind km/h | 12.9 | stored grid 13.0 | -0.1 | ±1 | ok |
| Dayton OH | +0 h | cloud % | 2 | stored grid 2 | 0 | ±1 | ok |
| Dayton OH | +0 h | pressure hPa | 1020.75 | stored grid 1020.74 | 0.02 | ±0.1 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | gfs_global 19.0 | -2.8 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 12.9 | gfs_global 12.5 | 0.4 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 230 | gfs_global 224 | 6 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 2 | gfs_global 6 | -4 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1020.8 | gfs_global 1020.6 | 0.2 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | gfs_seamless 17.0 | -0.8 | ±1 | ok |
| Dayton OH | +0 h | wind km/h | 12.9 | gfs_seamless 9.5 | 3.4 | ±3 | **FAIL** |
| Dayton OH | +0 h | wind from ° | 230 | gfs_seamless 218 | 12 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 2 | gfs_seamless 1 | 1 | ±15 | ok |
| Dayton OH | +0 h | pressure hPa | 1020.8 | gfs_seamless 1020.4 | 0.4 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 14.0 | cams_global 14.3 | -0.3 | ±3 | ok |
| Dayton OH | +0 h | temp °C | 16.2 | NWS 17.2 | -1.0 | ±3 | ok |
| Dayton OH | +0 h | wind km/h | 12.9 | NWS 9.3 | 3.6 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 2 | NWS 20 | -18 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 11.9 | GFS 0.25° raw 12.6 | -0.7 | ±0.7 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | GFS 0.25° raw 11.5 | 0.4 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 65 | GFS 0.25° raw 63 | 2 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1028.1 | GFS 0.25° raw 1028.1 | 0.1 | ±0.5 | ok |
| Dayton OH | +24 h | temp °C | 11.9 | stored grid 11.9 | 0.0 | ±0.15 | ok |
| Dayton OH | +24 h | wind km/h | 11.9 | stored grid 12.0 | -0.2 | ±1 | ok |
| Dayton OH | +24 h | cloud % | 99 | stored grid 99 | -0 | ±1 | ok |
| Dayton OH | +24 h | pressure hPa | 1028.14 | stored grid 1028.14 | 0.01 | ±0.1 | ok |
| Dayton OH | +24 h | temp °C | 11.9 | gfs_global 14.1 | -2.2 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 11.9 | gfs_global 10.3 | 1.6 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 65 | gfs_global 65 | 0 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1028.1 | gfs_global 1028.2 | -0.1 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 11.9 | gfs_seamless 11.1 | 0.8 | ±1 | ok |
| Dayton OH | +24 h | wind km/h | 11.9 | gfs_seamless 7.9 | 4.0 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind from ° | 65 | gfs_seamless 33 | 32 | ±20 | **FAIL** |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Dayton OH | +24 h | pressure hPa | 1028.1 | gfs_seamless 1028.3 | -0.2 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 6.4 | cams_global 7.1 | -0.7 | ±3 | ok |
| Dayton OH | +24 h | temp °C | 11.9 | NWS 11.7 | 0.2 | ±3 | ok |
| Dayton OH | +24 h | wind km/h | 11.9 | NWS 7.4 | 4.4 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 99 | NWS 55 | 44 | ±30 | **FAIL** |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 26.7 | GFS 0.25° raw 27.5 | -0.9 | ±0.7 | **FAIL** |
| Miami | +0 h | wind km/h | 16.8 | GFS 0.25° raw 19.7 | -2.8 | ±3 | ok |
| Miami | +0 h | wind from ° | 26 | GFS 0.25° raw 27 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.03 | GFS 0.25° raw 0.00 | 0.03 | ±0.3 | ok |
| Miami | +0 h | cloud % | 9 | GFS 0.25° raw 6 | 3 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1014.0 | GFS 0.25° raw 1014.0 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.7 | stored grid 26.6 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 16.8 | stored grid 16.7 | 0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 9 | stored grid 9 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1014.01 | stored grid 1014.02 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.7 | gfs_global 27.5 | -0.8 | ±1 | ok |
| Miami | +0 h | wind km/h | 16.8 | gfs_global 20.8 | -4.0 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 26 | gfs_global 23 | 3 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.03 | gfs_global 0.00 | 0.03 | ±0.3 | ok |
| Miami | +0 h | cloud % | 9 | gfs_global 15 | -6 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1014.0 | gfs_global 1014.0 | 0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.7 | gfs_seamless 25.0 | 1.7 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 16.8 | gfs_seamless 10.1 | 6.7 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 26 | gfs_seamless 336 | 50 | ±20 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.03 | gfs_seamless 0.00 | 0.03 | ±0.3 | ok |
| Miami | +0 h | cloud % | 9 | gfs_seamless 96 | -87 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1014.0 | gfs_seamless 1014.8 | -0.8 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 7.2 | cams_global 6.4 | 0.8 | ±3 | ok |
| Miami | +0 h | temp °C | 26.7 | NWS 27.2 | -0.6 | ±3 | ok |
| Miami | +0 h | wind km/h | 16.8 | NWS 13.0 | 3.9 | ±8 | ok |
| Miami | +0 h | cloud % | 9 | NWS 27 | -18 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.03 | NWS 0.00 | 0.03 | ±1 | ok |
| Miami | +24 h | temp °C | 26.4 | GFS 0.25° raw 26.7 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 21.3 | GFS 0.25° raw 26.2 | -4.9 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 75 | GFS 0.25° raw 75 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.55 | GFS 0.25° raw 1.20 | -0.65 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 18 | GFS 0.25° raw 18 | -0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.2 | GFS 0.25° raw 1016.3 | -0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.4 | stored grid 26.4 | -0.1 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 21.3 | stored grid 21.5 | -0.2 | ±1 | ok |
| Miami | +24 h | cloud % | 18 | stored grid 18 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.23 | stored grid 1016.23 | 0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.4 | gfs_global 26.8 | -0.4 | ±1 | ok |
| Miami | +24 h | wind km/h | 21.3 | gfs_global 26.5 | -5.2 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 75 | gfs_global 75 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.55 | gfs_global 1.00 | -0.45 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 18 | gfs_global 50 | -32 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_global 1016.3 | -0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.4 | gfs_seamless 24.4 | 2.0 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 21.3 | gfs_seamless 7.9 | 13.4 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 75 | gfs_seamless 77 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.55 | gfs_seamless 0.00 | 0.55 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 18 | gfs_seamless 100 | -82 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1016.2 | gfs_seamless 1016.6 | -0.4 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 9.4 | cams_global 4.4 | 5.0 | ±3 | **FAIL** |
| Miami | +24 h | temp °C | 26.4 | NWS 27.2 | -0.8 | ±3 | ok |
| Miami | +24 h | wind km/h | 21.3 | NWS 20.4 | 0.9 | ±8 | ok |
| Miami | +24 h | cloud % | 18 | NWS 48 | -30 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.55 | NWS 0.04 | 0.50 | ±1 | ok |
| Denver | +0 h | temp °C | 11.0 | GFS 0.25° raw 14.3 | -3.3 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 7.6 | GFS 0.25° raw 7.2 | 0.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 356 | GFS 0.25° raw 357 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 92 | GFS 0.25° raw 100 | -7 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.1 | 0.5 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 11.0 | stored grid 11.0 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 7.6 | stored grid 8.0 | -0.4 | ±1 | ok |
| Denver | +0 h | cloud % | 92 | stored grid 92 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1015.60 | stored grid 1015.63 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 11.0 | gfs_global 14.7 | -3.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 7.6 | gfs_global 7.9 | -0.3 | ±3 | ok |
| Denver | +0 h | wind from ° | 356 | gfs_global 357 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 92 | gfs_global 100 | -8 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1015.6 | gfs_global 1014.3 | 1.3 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 11.0 | gfs_seamless 10.9 | 0.1 | ±1 | ok |
| Denver | +0 h | wind km/h | 7.6 | gfs_seamless 8.0 | -0.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 356 | gfs_seamless 350 | 6 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 92 | gfs_seamless 6 | 86 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.6 | gfs_seamless 1012.7 | 2.9 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 2.8 | cams_global 12.1 | -9.3 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 11.0 | NWS 12.2 | -1.2 | ±3 | ok |
| Denver | +0 h | wind km/h | 7.6 | NWS 7.4 | 0.2 | ±8 | ok |
| Denver | +0 h | cloud % | 92 | NWS 30 | 62 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 11.1 | GFS 0.25° raw 15.0 | -3.9 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 6.1 | GFS 0.25° raw 5.5 | 0.5 | ±3 | ok |
| Denver | +24 h | wind from ° | 34 | GFS 0.25° raw 36 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 76 | GFS 0.25° raw 91 | -15 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1012.6 | GFS 0.25° raw 1012.4 | 0.3 | ±0.5 | ok |
| Denver | +24 h | temp °C | 11.1 | stored grid 11.1 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 6.1 | stored grid 6.4 | -0.3 | ±1 | ok |
| Denver | +24 h | cloud % | 76 | stored grid 76 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1012.61 | stored grid 1012.57 | 0.05 | ±0.1 | ok |
| Denver | +24 h | temp °C | 11.1 | gfs_global 15.4 | -4.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 6.1 | gfs_global 6.4 | -0.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 34 | gfs_global 38 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 76 | gfs_global 81 | -5 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1012.6 | gfs_global 1011.0 | 1.6 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 11.1 | gfs_seamless 11.4 | -0.3 | ±1 | ok |
| Denver | +24 h | wind km/h | 6.1 | gfs_seamless 7.2 | -1.1 | ±3 | ok |
| Denver | +24 h | wind from ° | 34 | gfs_seamless 262 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 76 | gfs_seamless 92 | -16 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1012.6 | gfs_seamless 1011.9 | 0.7 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 3.0 | cams_global 18.0 | -15.0 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 11.1 | NWS 12.8 | -1.7 | ±3 | ok |
| Denver | +24 h | wind km/h | 6.1 | NWS 5.6 | 0.5 | ±8 | ok |
| Denver | +24 h | cloud % | 76 | NWS 25 | 51 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 10.7 | GFS 0.25° raw 10.7 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 8.2 | GFS 0.25° raw 6.1 | 2.1 | ±3 | ok |
| London | +0 h | wind from ° | 108 | GFS 0.25° raw 108 | 0 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 32 | GFS 0.25° raw 31 | 1 | ±15 | ok |
| London | +0 h | pressure hPa | 1028.9 | GFS 0.25° raw 1028.8 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 10.7 | stored grid 10.6 | 0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 8.2 | stored grid 7.9 | 0.2 | ±1 | ok |
| London | +0 h | cloud % | 32 | stored grid 32 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1028.85 | stored grid 1028.85 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 10.7 | gfs_global 10.8 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.2 | gfs_global 6.0 | 2.2 | ±3 | ok |
| London | +0 h | wind from ° | 108 | gfs_global 107 | 1 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 32 | gfs_global 8 | 24 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1028.9 | gfs_global 1028.8 | 0.1 | ±1 | ok |
| London | +0 h | temp °C | 10.7 | gfs_seamless 10.8 | -0.1 | ±1 | ok |
| London | +0 h | wind km/h | 8.2 | gfs_seamless 6.0 | 2.2 | ±3 | ok |
| London | +0 h | wind from ° | 108 | gfs_seamless 107 | 1 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 32 | gfs_seamless 8 | 24 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1028.9 | gfs_seamless 1028.8 | 0.1 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 9.8 | cams_global 12.9 | -3.1 | ±3 | **FAIL** |
| London | +24 h | temp °C | 10.3 | GFS 0.25° raw 10.4 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 8.0 | GFS 0.25° raw 5.9 | 2.1 | ±3 | ok |
| London | +24 h | wind from ° | 78 | GFS 0.25° raw 74 | 4 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 86 | GFS 0.25° raw 82 | 4 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | GFS 0.25° raw 1030.5 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.3 | stored grid 10.3 | -0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 8.0 | stored grid 7.9 | 0.1 | ±1 | ok |
| London | +24 h | cloud % | 86 | stored grid 86 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1030.51 | stored grid 1030.49 | 0.02 | ±0.1 | ok |
| London | +24 h | temp °C | 10.3 | gfs_global 10.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.0 | gfs_global 5.7 | 2.3 | ±3 | ok |
| London | +24 h | wind from ° | 78 | gfs_global 72 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 86 | gfs_global 82 | 4 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | gfs_global 1030.5 | 0.0 | ±1 | ok |
| London | +24 h | temp °C | 10.3 | gfs_seamless 10.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 8.0 | gfs_seamless 5.7 | 2.3 | ±3 | ok |
| London | +24 h | wind from ° | 78 | gfs_seamless 72 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 86 | gfs_seamless 82 | 4 | ±15 | ok |
| London | +24 h | pressure hPa | 1030.5 | gfs_seamless 1030.5 | 0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 14.0 | cams_global 15.4 | -1.4 | ±3 | ok |
| Delhi | +0 h | temp °C | 21.3 | GFS 0.25° raw 21.6 | -0.2 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 7.7 | GFS 0.25° raw 5.6 | 2.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | GFS 0.25° raw 103 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.15 | GFS 0.25° raw 0.14 | 0.01 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 97 | GFS 0.25° raw 100 | -2 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | GFS 0.25° raw 1017.6 | -0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.3 | stored grid 21.3 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 7.7 | stored grid 7.6 | 0.1 | ±1 | ok |
| Delhi | +0 h | cloud % | 97 | stored grid 98 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.62 | stored grid 1017.64 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_global 22.4 | -1.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.7 | gfs_global 6.6 | 1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | gfs_global 112 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.15 | gfs_global 0.20 | -0.05 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 97 | gfs_global 100 | -3 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | gfs_global 1017.6 | 0.0 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.3 | gfs_seamless 22.4 | -1.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.7 | gfs_seamless 6.6 | 1.1 | ±3 | ok |
| Delhi | +0 h | wind from ° | 108 | gfs_seamless 112 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.15 | gfs_seamless 0.20 | -0.05 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 97 | gfs_seamless 100 | -3 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | gfs_seamless 1017.6 | 0.0 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 25.3 | cams_global 30.6 | -5.3 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 20.4 | GFS 0.25° raw 21.2 | -0.7 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.5 | GFS 0.25° raw 1.1 | 0.4 | ±3 | ok |
| Delhi | +24 h | wind from ° | 122 | GFS 0.25° raw 81 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1019.3 | GFS 0.25° raw 1019.3 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 20.4 | stored grid 20.4 | 0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 1.5 | stored grid 1.6 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1019.33 | stored grid 1019.32 | 0.02 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 20.4 | gfs_global 21.8 | -1.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.5 | gfs_global 1.5 | 0.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 122 | gfs_global 76 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1019.3 | gfs_global 1019.4 | -0.1 | ±1 | ok |
| Delhi | +24 h | temp °C | 20.4 | gfs_seamless 21.8 | -1.4 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.5 | gfs_seamless 1.5 | 0.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 122 | gfs_seamless 76 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1019.3 | gfs_seamless 1019.4 | -0.1 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 53.0 | cams_global 43.7 | 9.3 | ±3 | **FAIL** |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | 16.21 | 16.80 | -0.59 | 13.0 | 12.8 | 0.2 | 2 | 1 |
| Dayton OH | +24 h | 11.91 | 12.62 | -0.71 | 12.0 | 11.5 | 0.5 | 99 | 100 |
| Miami | +0 h | 26.61 | 27.54 | -0.93 | 16.7 | 19.7 | -3.0 | 9 | 6 |
| Miami | +24 h | 26.45 | 26.67 | -0.22 | 21.5 | 26.2 | -4.7 | 18 | 18 |
| Denver | +0 h | 10.96 | 14.33 | -3.37 | 8.0 | 7.2 | 0.8 | 92 | 100 |
| Denver | +24 h | 11.10 | 14.95 | -3.86 | 6.4 | 5.5 | 0.9 | 76 | 91 |
| London | +0 h | 10.64 | 10.74 | -0.10 | 7.9 | 6.1 | 1.8 | 32 | 31 |
| London | +24 h | 10.32 | 10.41 | -0.09 | 7.9 | 5.9 | 2.0 | 86 | 82 |
| Delhi | +0 h | 21.33 | 21.58 | -0.25 | 7.6 | 5.6 | 2.0 | 98 | 100 |
| Delhi | +24 h | 20.43 | 21.15 | -0.73 | 1.6 | 1.1 | 0.5 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 20.80 | 20.81 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1015.40 | 1015.39 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 99.00 | 99.41 | -0.41 | ±1 | ok |
| Chile coast | +0 h | temp | 11.80 | 11.80 | -0.00 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.00 | 1015.02 | -0.02 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 8.00 | 7.78 | 0.22 | ±1 | ok |
| Dayton | +0 h | temp | 16.20 | 16.17 | 0.03 | ±0.5 | ok |
| Dayton | +0 h | pres | 1020.50 | 1020.46 | 0.04 | ±0.5 | ok |
| Dayton | +0 h | cloud | 1.00 | 0.64 | 0.36 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 21.40 | 21.44 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1011.50 | 1011.46 | 0.04 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 1.00 | 0.58 | 0.42 | ±1 | ok |
| Chile coast | +24 h | temp | 13.40 | 13.34 | 0.06 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1013.60 | 1013.60 | -0.00 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Dayton | +24 h | temp | 11.80 | 11.75 | 0.05 | ±0.5 | ok |
| Dayton | +24 h | pres | 1028.40 | 1028.43 | -0.03 | ±0.5 | ok |
| Dayton | +24 h | cloud | 98.00 | 98.24 | -0.24 | ±1 | ok |

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 18.20 | 18.20 | 0.00 | ±0.2 | ok |
| node 52N 0E (London) | +0 h | 11.00 | 11.00 | 0.00 | ±0.2 | ok |
| node 40N 116E (Beijing) | +0 h | 45.20 | 45.20 | 0.00 | ±0.2 | ok |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":78,"2024 24-h mean":17,"2012 hourly":93,"2012 24-h mean":56}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Dayton OH | 14.3 | 9.7 | 54 | 61 | 52 | 56 | 40 |
| Miami | 6.4 | 5.2 | 34 | 36 | 29 | 27 | 22 |
| Denver | 12.1 | 11.9 | 55 | 57 | 56 | 51 | 49 |
| London | 12.9 | 17.3 | 66 | 58 | 66 | 53 | 62 |
| Delhi | 30.6 | 24.1 | 82 | 91 | 79 | 90 | 76 |
| node 28N 76E (Delhi) | 18.2 | 30.8 | 96 | 68 | 91 | 64 | 90 |
| node 52N 0E (London) | 11.0 | 10.9 | 53 | 55 | 54 | 46 | 45 |
| node 40N 116E (Beijing) | 45.2 | 53.4 | 145 | 125 | 145 | 125 | 145 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 16 °Cat 2 m·39.7°N 84.1°W | 13 km/hfrom SW·39.7°N 84.1°W | Drypast hour · area avg·39.7°N 84.1°W | 2 %area average·39.7°N 84.1°W | 1021 hPasea level·39.7°N 84.1°W | 14 µg/m³Moderate · AQI 52 (24 h)·39.7°N 84.1°W |
| Miami | 27 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom NNE·25.7°N 80.1°W | Drypast hour · area avg·25.7°N 80.1°W | 9 %area average·25.7°N 80.1°W | 1014 hPasea level·25.7°N 80.1°W | 7.2 µg/m³Good · AQI 39 (24 h)·25.7°N 80.1°W |
| Denver | 11 °Cat 2 m·39.7°N 104.9°W | 8 km/hfrom N·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 92 %area average·39.7°N 104.9°W | 1016 hPasea level·39.7°N 104.9°W | 2.8 µg/m³Good · AQI 38 (24 h)·39.7°N 104.9°W |
| London | 11 °Cat 2 m·51.5°N 0.1°W | 8 km/hfrom ESE·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 32 %area average·51.5°N 0.1°W | 1029 hPasea level·51.5°N 0.1°W | 9.8 µg/m³Moderate · AQI 50 (24 h)·51.5°N 0.1°W |
| Delhi | 21 °Cat 2 m·28.6°N 77.2°E | 8 km/hfrom ESE·28.6°N 77.2°E | 0.1 mm/hpast hour · area avg·28.6°N 77.2°E | 97 %area average·28.6°N 77.2°E | 1018 hPasea level·28.6°N 77.2°E | 25 µg/m³Moderate · AQI 98 (24 h)·28.6°N 77.2°E |
