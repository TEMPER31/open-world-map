# Accuracy check (before)

Generated 2026-10-29T22:47:06.072Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-29T18:00:00.000Z, timeline +0 h = 2026-10-29T22:00:00.000Z (f004); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary: 132 within tolerance, 50 outside, 0 not comparable.**

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Dayton OH | +0 h | temp °C | 20.8 | gfs_global 22.6 | -1.8 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 13.0 | gfs_global 11.1 | 1.9 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 233 | gfs_global 245 | 12 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 33 | gfs_global 5 | 28 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1019.3 | gfs_global 1019.0 | 0.3 | ±1 | ok |
| Dayton OH | +0 h | temp °C | 20.8 | gfs_seamless 23.0 | -2.2 | ±1 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 13.0 | gfs_seamless 11.5 | 1.5 | ±3 | ok |
| Dayton OH | +0 h | wind from ° | 233 | gfs_seamless 235 | 2 | ±20 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +0 h | cloud % | 33 | gfs_seamless 1 | 32 | ±15 | **FAIL** |
| Dayton OH | +0 h | pressure hPa | 1019.3 | gfs_seamless 1018.8 | 0.5 | ±1 | ok |
| Dayton OH | +0 h | PM2.5 µg/m³ | 10.2 | cams_global 12.5 | -2.3 | ±3 | ok |
| Dayton OH | +0 h | US AQI | 48 | cams_global 47 | 1 | ±10 | ok |
| Dayton OH | +0 h | temp °C | 20.8 | NWS 24.4 | -3.6 | ±3 | **FAIL** |
| Dayton OH | +0 h | wind km/h | 13.0 | NWS 16.7 | -3.7 | ±8 | ok |
| Dayton OH | +0 h | cloud % | 33 | NWS 3 | 30 | ±30 | ok |
| Dayton OH | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 16.0 | gfs_global 18.0 | -2.0 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 10.2 | gfs_global 9.2 | 1.0 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 44 | gfs_global 45 | 1 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 83 | gfs_global 100 | -17 | ±15 | **FAIL** |
| Dayton OH | +24 h | pressure hPa | 1025.9 | gfs_global 1025.6 | 0.3 | ±1 | ok |
| Dayton OH | +24 h | temp °C | 16.0 | gfs_seamless 18.8 | -2.8 | ±1 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 10.2 | gfs_seamless 8.2 | 2.0 | ±3 | ok |
| Dayton OH | +24 h | wind from ° | 44 | gfs_seamless 50 | 6 | ±20 | ok |
| Dayton OH | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Dayton OH | +24 h | cloud % | 83 | gfs_seamless 100 | -17 | ±15 | **FAIL** |
| Dayton OH | +24 h | pressure hPa | 1025.9 | gfs_seamless 1026.5 | -0.6 | ±1 | ok |
| Dayton OH | +24 h | PM2.5 µg/m³ | 5.3 | cams_global 5.6 | -0.3 | ±3 | ok |
| Dayton OH | +24 h | US AQI | 47 | cams_global 50 | -3 | ±10 | ok |
| Dayton OH | +24 h | temp °C | 16.0 | NWS 19.4 | -3.5 | ±3 | **FAIL** |
| Dayton OH | +24 h | wind km/h | 10.2 | NWS 9.3 | 0.9 | ±8 | ok |
| Dayton OH | +24 h | cloud % | 83 | NWS 24 | 59 | ±30 | **FAIL** |
| Dayton OH | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Miami | +0 h | temp °C | 27.7 | gfs_global 27.9 | -0.2 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.5 | gfs_global 20.1 | -2.6 | ±3 | ok |
| Miami | +0 h | wind from ° | 40 | gfs_global 47 | 7 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.01 | gfs_global 0.00 | 0.01 | ±0.3 | ok |
| Miami | +0 h | cloud % | 11 | gfs_global 0 | 11 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1012.5 | gfs_global 1012.5 | 0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.7 | gfs_seamless 26.8 | 0.9 | ±1 | ok |
| Miami | +0 h | wind km/h | 17.5 | gfs_seamless 10.9 | 6.6 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 40 | gfs_seamless 16 | 24 | ±20 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.01 | gfs_seamless 0.00 | 0.01 | ±0.3 | ok |
| Miami | +0 h | cloud % | 11 | gfs_seamless 91 | -80 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1012.5 | gfs_seamless 1013.4 | -0.9 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 8.0 | cams_global 7.0 | 1.0 | ±3 | ok |
| Miami | +0 h | US AQI | 41 | cams_global 36 | 5 | ±10 | ok |
| Miami | +0 h | temp °C | 27.7 | NWS 28.3 | -0.7 | ±3 | ok |
| Miami | +0 h | wind km/h | 17.5 | NWS 14.8 | 2.7 | ±8 | ok |
| Miami | +0 h | cloud % | 11 | NWS 14 | -3 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.01 | NWS 0.00 | 0.01 | ±1 | ok |
| Miami | +24 h | temp °C | 27.1 | gfs_global 27.7 | -0.6 | ±1 | ok |
| Miami | +24 h | wind km/h | 19.3 | gfs_global 20.4 | -1.1 | ±3 | ok |
| Miami | +24 h | wind from ° | 77 | gfs_global 64 | 13 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.35 | gfs_global 0.30 | 0.05 | ±0.3 | ok |
| Miami | +24 h | cloud % | 50 | gfs_global 40 | 10 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1014.2 | gfs_global 1014.2 | 0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 27.1 | gfs_seamless 26.2 | 0.9 | ±1 | ok |
| Miami | +24 h | wind km/h | 19.3 | gfs_seamless 10.9 | 8.4 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 77 | gfs_seamless 38 | 39 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.35 | gfs_seamless 0.00 | 0.35 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 50 | gfs_seamless 32 | 18 | ±15 | **FAIL** |
| Miami | +24 h | pressure hPa | 1014.2 | gfs_seamless 1014.8 | -0.6 | ±1 | ok |
| Miami | +24 h | PM2.5 µg/m³ | 6.4 | cams_global 4.1 | 2.3 | ±3 | ok |
| Miami | +24 h | US AQI | 38 | cams_global 33 | 5 | ±10 | ok |
| Miami | +24 h | temp °C | 27.1 | NWS 28.3 | -1.2 | ±3 | ok |
| Miami | +24 h | wind km/h | 19.3 | NWS 20.4 | -1.1 | ±8 | ok |
| Miami | +24 h | cloud % | 50 | NWS 33 | 17 | ±30 | ok |
| Miami | +24 h | precip mm/h | 0.35 | NWS 0.08 | 0.26 | ±1 | ok |
| Denver | +0 h | temp °C | 18.6 | gfs_global 19.1 | -0.5 | ±1 | ok |
| Denver | +0 h | wind km/h | 6.4 | gfs_global 6.0 | 0.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 62 | gfs_global 33 | 29 | ±20 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 47 | gfs_global 100 | -53 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1012.7 | gfs_global 1009.9 | 2.8 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 18.6 | gfs_seamless 19.5 | -0.9 | ±1 | ok |
| Denver | +0 h | wind km/h | 6.4 | gfs_seamless 10.8 | -4.4 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 62 | gfs_seamless 60 | 2 | ±20 | ok |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 47 | gfs_seamless 0 | 47 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1012.7 | gfs_seamless 1011.3 | 1.4 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 6.3 | cams_global 8.2 | -1.9 | ±3 | ok |
| Denver | +0 h | US AQI | 56 | cams_global 54 | 2 | ±10 | ok |
| Denver | +0 h | temp °C | 18.6 | NWS 18.3 | 0.3 | ±3 | ok |
| Denver | +0 h | wind km/h | 6.4 | NWS 9.3 | -2.9 | ±8 | ok |
| Denver | +0 h | cloud % | 47 | NWS 12 | 35 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 19.3 | gfs_global 20.8 | -1.5 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 6.8 | gfs_global 8.1 | -1.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 88 | gfs_global 45 | 43 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 58 | gfs_global 100 | -42 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1009.8 | gfs_global 1006.6 | 3.2 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 19.3 | gfs_seamless 19.5 | -0.2 | ±1 | ok |
| Denver | +24 h | wind km/h | 6.8 | gfs_seamless 13.3 | -6.5 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 88 | gfs_seamless 14 | 74 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 58 | gfs_seamless 100 | -42 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1009.8 | gfs_seamless 1010.5 | -0.7 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 9.7 | cams_global 8.4 | 1.3 | ±3 | ok |
| Denver | +24 h | US AQI | 63 | cams_global 58 | 5 | ±10 | ok |
| Denver | +24 h | temp °C | 19.3 | NWS 18.3 | 1.0 | ±3 | ok |
| Denver | +24 h | wind km/h | 6.8 | NWS 11.1 | -4.3 | ±8 | ok |
| Denver | +24 h | cloud % | 58 | NWS 35 | 23 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| London | +0 h | temp °C | 11.8 | gfs_global 11.8 | 0.0 | ±1 | ok |
| London | +0 h | wind km/h | 10.2 | gfs_global 6.8 | 3.4 | ±3 | **FAIL** |
| London | +0 h | wind from ° | 100 | gfs_global 115 | 15 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 30 | gfs_global 10 | 20 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1029.4 | gfs_global 1029.2 | 0.2 | ±1 | ok |
| London | +0 h | temp °C | 11.8 | gfs_seamless 11.8 | 0.0 | ±1 | ok |
| London | +0 h | wind km/h | 10.2 | gfs_seamless 6.8 | 3.4 | ±3 | **FAIL** |
| London | +0 h | wind from ° | 100 | gfs_seamless 115 | 15 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 30 | gfs_seamless 10 | 20 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1029.4 | gfs_seamless 1029.2 | 0.2 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 8.4 | cams_global 14.0 | -5.6 | ±3 | **FAIL** |
| London | +0 h | US AQI | 52 | cams_global 66 | -14 | ±10 | **FAIL** |
| London | +24 h | temp °C | 11.1 | gfs_global 11.4 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 9.0 | gfs_global 6.5 | 2.5 | ±3 | ok |
| London | +24 h | wind from ° | 83 | gfs_global 84 | 1 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 93 | gfs_global 66 | 27 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.6 | gfs_global 1030.4 | 0.2 | ±1 | ok |
| London | +24 h | temp °C | 11.1 | gfs_seamless 11.4 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 9.0 | gfs_seamless 6.5 | 2.5 | ±3 | ok |
| London | +24 h | wind from ° | 83 | gfs_seamless 84 | 1 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 93 | gfs_seamless 66 | 27 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1030.6 | gfs_seamless 1030.4 | 0.2 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 13.1 | cams_global 15.2 | -2.1 | ±3 | ok |
| London | +24 h | US AQI | 43 | cams_global 59 | -16 | ±10 | **FAIL** |
| Delhi | +0 h | temp °C | 21.5 | gfs_global 23.4 | -1.9 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.9 | gfs_global 8.4 | -1.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 65 | gfs_global 110 | 45 | ±20 | **FAIL** |
| Delhi | +0 h | precip mm/h | 0.11 | gfs_global 0.20 | -0.09 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 89 | gfs_global 100 | -11 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.9 | gfs_global 1015.4 | 0.5 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.5 | gfs_seamless 23.4 | -1.9 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 6.9 | gfs_seamless 8.4 | -1.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 65 | gfs_seamless 110 | 45 | ±20 | **FAIL** |
| Delhi | +0 h | precip mm/h | 0.11 | gfs_seamless 0.20 | -0.09 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 89 | gfs_seamless 100 | -11 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.9 | gfs_seamless 1015.4 | 0.5 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 23.9 | cams_global 19.7 | 4.2 | ±3 | **FAIL** |
| Delhi | +0 h | US AQI | 97 | cams_global 104 | -7 | ±10 | ok |
| Delhi | +24 h | temp °C | 20.1 | gfs_global 21.0 | -0.9 | ±1 | ok |
| Delhi | +24 h | wind km/h | 3.7 | gfs_global 5.6 | -1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 113 | gfs_global 63 | 50 | ±20 | **FAIL** |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.2 | gfs_global 1017.9 | -0.7 | ±1 | ok |
| Delhi | +24 h | temp °C | 20.1 | gfs_seamless 21.0 | -0.9 | ±1 | ok |
| Delhi | +24 h | wind km/h | 3.7 | gfs_seamless 5.6 | -1.9 | ±3 | ok |
| Delhi | +24 h | wind from ° | 113 | gfs_seamless 63 | 50 | ±20 | **FAIL** |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.2 | gfs_seamless 1017.9 | -0.7 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 28.8 | cams_global 50.8 | -22.0 | ±3 | **FAIL** |
| Delhi | +24 h | US AQI | 65 | cams_global 117 | -52 | ±10 | **FAIL** |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 15.12 | 15.23 | -0.12 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1018.55 | 1018.73 | -0.18 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +0 h | temp | 15.82 | 15.77 | 0.05 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1015.41 | 1015.24 | 0.17 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 18.04 | 17.90 | 0.14 | ±1 | ok |
| Dayton | +0 h | temp | 20.41 | 20.24 | 0.17 | ±0.5 | ok |
| Dayton | +0 h | pres | 1018.94 | 1019.13 | -0.19 | ±0.5 | ok |
| Dayton | +0 h | cloud | 39.22 | 39.30 | -0.08 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 16.53 | 16.66 | -0.13 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1011.85 | 1011.66 | 0.19 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Chile coast | +24 h | temp | 16.88 | 16.71 | 0.18 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1012.66 | 1012.73 | -0.07 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 28.63 | 28.70 | -0.07 | ±1 | ok |
| Dayton | +24 h | temp | 15.47 | 15.53 | -0.06 | ±0.5 | ok |
| Dayton | +24 h | pres | 1026.12 | 1026.10 | 0.02 | ±0.5 | ok |
| Dayton | +24 h | cloud | 96.86 | 97.00 | -0.14 | ±1 | ok |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Dayton OH | 21 °Cat 2 m·39.7°N 84.1°W | 13 km/hfrom SW·39.7°N 84.1°W | Dryprecipitation·39.7°N 84.1°W | 33 %cloud cover·39.7°N 84.1°W | 1019 hPasea level·39.7°N 84.1°W | 10 µg/m³Good·39.7°N 84.1°W |
| Miami | 28 °Cat 2 m·25.7°N 80.1°W | 17 km/hfrom NE·25.7°N 80.1°W | Dryprecipitation·25.7°N 80.1°W | 11 %cloud cover·25.7°N 80.1°W | 1013 hPasea level·25.7°N 80.1°W | 8 µg/m³Good·25.7°N 80.1°W |
| Denver | 19 °Cat 2 m·39.7°N 104.9°W | 6 km/hfrom ENE·39.7°N 104.9°W | Dryprecipitation·39.7°N 104.9°W | 47 %cloud cover·39.7°N 104.9°W | 1013 hPasea level·39.7°N 104.9°W | 6 µg/m³Good·39.7°N 104.9°W |
| London | 12 °Cat 2 m·51.5°N 0.1°W | 10 km/hfrom E·51.5°N 0.1°W | Dryprecipitation·51.5°N 0.1°W | 30 %cloud cover·51.5°N 0.1°W | 1029 hPasea level·51.5°N 0.1°W | 8 µg/m³Good·51.5°N 0.1°W |
| Delhi | 22 °Cat 2 m·28.6°N 77.2°E | 7 km/hfrom ENE·28.6°N 77.2°E | 0.1 mm/hprecipitation·28.6°N 77.2°E | 89 %cloud cover·28.6°N 77.2°E | 1016 hPasea level·28.6°N 77.2°E | 24 µg/m³Moderate·28.6°N 77.2°E |
