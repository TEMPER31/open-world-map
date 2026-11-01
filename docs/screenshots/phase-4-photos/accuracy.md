# Accuracy check (phase-4-photos)

Generated 2026-11-01T03:19:02.397Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T18:00:00.000Z, timeline +0 h = 2026-11-01T03:00:00.000Z (f009); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 47 / 9 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 44 / 12 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 32 / 24 / 4
- Open-Meteo cams_global at the cities: 3 / 7 / 0
- NWS gridpoints (sanity check): 21 / 3 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 16.3 | GFS 0.25° raw 16.3 | 0.1 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 12.2 | GFS 0.25° raw 14.1 | -1.9 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 94 | GFS 0.25° raw 87 | 7 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.07 | GFS 0.25° raw 0.06 | 0.01 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | GFS 0.25° raw 1021.3 | 0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 16.3 | stored grid 16.3 | -0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 12.2 | stored grid 12.2 | -0.0 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.40 | stored grid 1021.37 | 0.03 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 16.3 | gfs_global 16.6 | -0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 12.2 | gfs_global 12.7 | -0.5 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 94 | gfs_global 82 | 12 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.07 | gfs_global 0.00 | 0.07 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | gfs_global 1021.4 | -0.0 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 16.3 | gfs_seamless 15.6 | 0.7 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 12.2 | gfs_seamless 7.3 | 4.9 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 94 | gfs_seamless 112 | 18 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.07 | gfs_seamless 0.70 | -0.63 | ±0.3 | **FAIL** |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.4 | gfs_seamless 1022.1 | -0.7 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 8.6 | cams_global 11.9 | -3.3 | ±3 | **FAIL** |
| Kansas City MO | +0 h | temp °C | 16.3 | NWS 16.1 | 0.2 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 12.2 | NWS 7.4 | 4.8 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 96 | 4 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.07 | NWS 0.08 | -0.01 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.6 | GFS 0.25° raw 17.7 | -0.1 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 16.6 | GFS 0.25° raw 16.3 | 0.3 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 141 | GFS 0.25° raw 143 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.0 | GFS 0.25° raw 1017.0 | -0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 17.6 | stored grid 17.6 | 0.1 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 16.6 | stored grid 16.2 | 0.3 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1016.98 | stored grid 1017.00 | -0.02 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 17.6 | gfs_global 18.2 | -0.6 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 16.6 | gfs_global 14.3 | 2.3 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 141 | gfs_global 146 | 5 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.0 | gfs_global 1017.2 | -0.2 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 17.6 | gfs_seamless 16.6 | 1.0 | ±1 | **FAIL** |
| Kansas City MO | +24 h | wind km/h | 16.6 | gfs_seamless 8.7 | 7.9 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 141 | gfs_seamless 137 | 4 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.0 | gfs_seamless 1017.9 | -0.9 | ±1 | ok |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.3 | cams_global 5.5 | -0.2 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 17.6 | NWS 17.8 | -0.1 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 16.6 | NWS 9.3 | 7.3 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 100 | NWS 84 | 16 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +111 h | temp °C | 9.8 | GFS 0.25° raw 9.8 | 0.1 | ±0.7 | ok |
| Kansas City MO | +111 h | wind km/h | 14.0 | GFS 0.25° raw 14.7 | -0.8 | ±3 | ok |
| Kansas City MO | +111 h | wind from ° | 339 | GFS 0.25° raw 336 | 3 | ±20 | ok |
| Kansas City MO | +111 h | precip mm/h | 1.18 | GFS 0.25° raw 0.80 | 0.38 | ±0.3 | **FAIL** |
| Kansas City MO | +111 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +111 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.8 | -0.0 | ±0.5 | ok |
| Kansas City MO | +111 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| Kansas City MO | +111 h | wind km/h | 14.0 | stored grid 14.1 | -0.1 | ±1 | ok |
| Kansas City MO | +111 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +111 h | pressure hPa | 1011.75 | stored grid 1011.76 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.8 | GFS 0.25° raw 27.0 | -0.2 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 28.7 | GFS 0.25° raw 31.9 | -3.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 85 | GFS 0.25° raw 87 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.60 | GFS 0.25° raw 1.84 | -1.23 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 92 | GFS 0.25° raw 100 | -8 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.2 | GFS 0.25° raw 1018.2 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.8 | stored grid 26.8 | -0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 28.7 | stored grid 28.7 | -0.0 | ±1 | ok |
| Miami | +0 h | cloud % | 92 | stored grid 92 | -0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1018.22 | stored grid 1018.22 | 0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.8 | gfs_global 27.0 | -0.2 | ±1 | ok |
| Miami | +0 h | wind km/h | 28.7 | gfs_global 32.9 | -4.2 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 85 | gfs_global 86 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.60 | gfs_global 2.90 | -2.30 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 92 | gfs_global 100 | -8 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.2 | gfs_global 1018.1 | 0.1 | ±1 | ok |
| Miami | +0 h | temp °C | 26.8 | gfs_seamless 25.7 | 1.1 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 28.7 | gfs_seamless 13.7 | 15.0 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 85 | gfs_seamless 87 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.60 | gfs_seamless 0.00 | 0.60 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 92 | gfs_seamless 100 | -8 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1018.2 | gfs_seamless 1017.7 | 0.5 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 9.1 | cams_global 5.0 | 4.1 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 26.8 | NWS 27.2 | -0.4 | ±3 | ok |
| Miami | +0 h | wind km/h | 28.7 | NWS 25.9 | 2.7 | ±8 | ok |
| Miami | +0 h | cloud % | 92 | NWS 69 | 23 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.60 | NWS 0.21 | 0.39 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | GFS 0.25° raw 26.4 | -0.6 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 27.9 | GFS 0.25° raw 30.3 | -2.4 | ±3 | ok |
| Miami | +24 h | wind from ° | 99 | GFS 0.25° raw 100 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.41 | GFS 0.25° raw 2.14 | 0.27 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.8 | GFS 0.25° raw 1016.7 | 0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 25.9 | stored grid 25.8 | 0.1 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 27.9 | stored grid 27.6 | 0.3 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.85 | stored grid 1016.85 | -0.01 | ±0.1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_global 26.5 | -0.6 | ±1 | ok |
| Miami | +24 h | wind km/h | 27.9 | gfs_global 30.0 | -2.1 | ±3 | ok |
| Miami | +24 h | wind from ° | 99 | gfs_global 100 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.41 | gfs_global 1.80 | 0.61 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.8 | gfs_global 1016.7 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 25.9 | gfs_seamless 24.1 | 1.8 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 27.9 | gfs_seamless 9.4 | 18.5 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 99 | gfs_seamless 60 | 39 | ±20 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.41 | gfs_seamless 0.00 | 2.41 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.8 | gfs_seamless 1018.8 | -2.0 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 6.4 | cams_global 5.4 | 1.0 | ±3 | ok |
| Miami | +24 h | temp °C | 25.9 | NWS 26.1 | -0.3 | ±3 | ok |
| Miami | +24 h | wind km/h | 27.9 | NWS 25.9 | 2.0 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 57 | 43 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.41 | NWS 0.68 | 1.74 | ±1 | **FAIL** |
| Miami | +111 h | temp °C | 28.0 | GFS 0.25° raw 28.9 | -0.9 | ±0.7 | **FAIL** |
| Miami | +111 h | wind km/h | 15.6 | GFS 0.25° raw 14.1 | 1.5 | ±3 | ok |
| Miami | +111 h | wind from ° | 312 | GFS 0.25° raw 310 | 3 | ±20 | ok |
| Miami | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +111 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +111 h | pressure hPa | 1008.2 | GFS 0.25° raw 1008.1 | 0.1 | ±0.5 | ok |
| Miami | +111 h | temp °C | 28.0 | stored grid 27.9 | 0.0 | ±0.15 | ok |
| Miami | +111 h | wind km/h | 15.6 | stored grid 15.5 | 0.1 | ±1 | ok |
| Miami | +111 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Miami | +111 h | pressure hPa | 1008.22 | stored grid 1008.24 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 9.0 | GFS 0.25° raw 13.2 | -4.2 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 3.1 | GFS 0.25° raw 2.4 | 0.7 | ±3 | ok |
| Denver | +0 h | wind from ° | 112 | GFS 0.25° raw 115 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 54 | GFS 0.25° raw 31 | 22 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.3 | GFS 0.25° raw 1014.3 | 0.9 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 9.0 | stored grid 9.1 | -0.1 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 3.1 | stored grid 2.6 | 0.5 | ±1 | ok |
| Denver | +0 h | cloud % | 54 | stored grid 54 | -0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1015.27 | stored grid 1015.30 | -0.03 | ±0.1 | ok |
| Denver | +0 h | temp °C | 9.0 | gfs_global 13.8 | -4.8 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.1 | gfs_global 2.9 | 0.2 | ±3 | ok |
| Denver | +0 h | wind from ° | 112 | gfs_global 90 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 54 | gfs_global 24 | 30 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.3 | gfs_global 1013.9 | 1.4 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 9.0 | gfs_seamless 10.6 | -1.6 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.1 | gfs_seamless 6.5 | -3.4 | ±3 | **FAIL** |
| Denver | +0 h | wind from ° | 112 | gfs_seamless 169 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 54 | gfs_seamless 9 | 45 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1015.3 | gfs_seamless 1013.3 | 2.0 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 0.8 | cams_global 27.8 | -27.0 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 9.0 | NWS 12.2 | -3.2 | ±3 | **FAIL** |
| Denver | +0 h | wind km/h | 3.1 | NWS 3.7 | -0.6 | ±8 | ok |
| Denver | +0 h | cloud % | 54 | NWS 53 | 1 | ±30 | ok |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 12.8 | GFS 0.25° raw 13.8 | -1.0 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 9.5 | GFS 0.25° raw 8.5 | 1.0 | ±3 | ok |
| Denver | +24 h | wind from ° | 28 | GFS 0.25° raw 26 | 3 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.06 | GFS 0.25° raw 0.00 | 0.06 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | GFS 0.25° raw 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.0 | GFS 0.25° raw 999.2 | -0.2 | ±0.5 | ok |
| Denver | +24 h | temp °C | 12.8 | stored grid 12.8 | 0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 9.5 | stored grid 9.4 | 0.1 | ±1 | ok |
| Denver | +24 h | cloud % | 99 | stored grid 99 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 999.02 | stored grid 999.06 | -0.04 | ±0.1 | ok |
| Denver | +24 h | temp °C | 12.8 | gfs_global 13.9 | -1.1 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.5 | gfs_global 8.9 | 0.6 | ±3 | ok |
| Denver | +24 h | wind from ° | 28 | gfs_global 32 | 4 | ±20 | ok |
| Denver | +24 h | precip mm/h | 0.06 | gfs_global 0.00 | 0.06 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | gfs_global 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.0 | gfs_global 997.5 | 1.5 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 12.8 | gfs_seamless 11.5 | 1.3 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 9.5 | gfs_seamless 3.1 | 6.4 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 28 | gfs_seamless 245 | 143 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.06 | gfs_seamless 0.00 | 0.06 | ±0.3 | ok |
| Denver | +24 h | cloud % | 99 | gfs_seamless 100 | -1 | ±15 | ok |
| Denver | +24 h | pressure hPa | 999.0 | gfs_seamless 997.8 | 1.2 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 1.8 | cams_global 6.5 | -4.7 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 12.8 | NWS 11.7 | 1.1 | ±3 | ok |
| Denver | +24 h | wind km/h | 9.5 | NWS 5.6 | 4.0 | ±8 | ok |
| Denver | +24 h | cloud % | 99 | NWS 85 | 14 | ±30 | ok |
| Denver | +24 h | precip mm/h | 0.06 | NWS 0.00 | 0.06 | ±1 | ok |
| Denver | +111 h | temp °C | 10.6 | GFS 0.25° raw 11.2 | -0.6 | ±0.7 | ok |
| Denver | +111 h | wind km/h | 2.8 | GFS 0.25° raw 2.7 | 0.1 | ±3 | ok |
| Denver | +111 h | wind from ° | 116 | GFS 0.25° raw 113 | — | ±20 | calm |
| Denver | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +111 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Denver | +111 h | pressure hPa | 1015.5 | GFS 0.25° raw 1015.7 | -0.2 | ±0.5 | ok |
| Denver | +111 h | temp °C | 10.6 | stored grid 10.5 | 0.1 | ±0.15 | ok |
| Denver | +111 h | wind km/h | 2.8 | stored grid 2.9 | -0.1 | ±1 | ok |
| Denver | +111 h | cloud % | 1 | stored grid 0 | 0 | ±1 | ok |
| Denver | +111 h | pressure hPa | 1015.50 | stored grid 1015.51 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.2 | GFS 0.25° raw 9.4 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 6.0 | GFS 0.25° raw 4.8 | 1.2 | ±3 | ok |
| London | +0 h | wind from ° | 21 | GFS 0.25° raw 25 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | GFS 0.25° raw 5 | 0 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | GFS 0.25° raw 1032.1 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.2 | stored grid 9.2 | 0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 6.0 | stored grid 6.0 | 0.0 | ±1 | ok |
| London | +0 h | cloud % | 5 | stored grid 5 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.10 | stored grid 1032.10 | 0.00 | ±0.1 | ok |
| London | +0 h | temp °C | 9.2 | gfs_global 9.5 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 6.0 | gfs_global 4.8 | 1.2 | ±3 | ok |
| London | +0 h | wind from ° | 21 | gfs_global 27 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | gfs_global 8 | -3 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | gfs_global 1032.1 | 0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.2 | gfs_seamless 9.5 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 6.0 | gfs_seamless 4.8 | 1.2 | ±3 | ok |
| London | +0 h | wind from ° | 21 | gfs_seamless 27 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 5 | gfs_seamless 8 | -3 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.1 | gfs_seamless 1032.1 | 0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 34.5 | cams_global 29.2 | 5.3 | ±3 | **FAIL** |
| London | +24 h | temp °C | 9.3 | GFS 0.25° raw 9.3 | 0.0 | ±0.7 | ok |
| London | +24 h | wind km/h | 19.3 | GFS 0.25° raw 15.5 | 3.8 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 16 | GFS 0.25° raw 21 | 5 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 21 | GFS 0.25° raw 4 | 16 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.4 | GFS 0.25° raw 1035.4 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 9.3 | stored grid 9.3 | 0.1 | ±0.15 | ok |
| London | +24 h | wind km/h | 19.3 | stored grid 19.5 | -0.1 | ±1 | ok |
| London | +24 h | cloud % | 21 | stored grid 21 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1035.42 | stored grid 1035.38 | 0.04 | ±0.1 | ok |
| London | +24 h | temp °C | 9.3 | gfs_global 9.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 19.3 | gfs_global 15.5 | 3.8 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 16 | gfs_global 22 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 21 | gfs_global 5 | 16 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.4 | gfs_global 1035.4 | 0.0 | ±1 | ok |
| London | +24 h | temp °C | 9.3 | gfs_seamless 9.5 | -0.2 | ±1 | ok |
| London | +24 h | wind km/h | 19.3 | gfs_seamless 15.5 | 3.8 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 16 | gfs_seamless 22 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 21 | gfs_seamless 5 | 16 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1035.4 | gfs_seamless 1035.4 | 0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 8.1 | cams_global 3.5 | 4.6 | ±3 | **FAIL** |
| London | +111 h | temp °C | 9.5 | GFS 0.25° raw 9.6 | -0.1 | ±0.7 | ok |
| London | +111 h | wind km/h | 15.2 | GFS 0.25° raw 12.9 | 2.3 | ±3 | ok |
| London | +111 h | wind from ° | 52 | GFS 0.25° raw 52 | 0 | ±20 | ok |
| London | +111 h | precip mm/h | 0.09 | GFS 0.25° raw 0.12 | -0.03 | ±0.3 | ok |
| London | +111 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| London | +111 h | pressure hPa | 1027.6 | GFS 0.25° raw 1027.6 | 0.0 | ±0.5 | ok |
| London | +111 h | temp °C | 9.5 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +111 h | wind km/h | 15.2 | stored grid 15.2 | -0.0 | ±1 | ok |
| London | +111 h | cloud % | 97 | stored grid 97 | -0 | ±1 | ok |
| London | +111 h | pressure hPa | 1027.64 | stored grid 1027.61 | 0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 23.7 | GFS 0.25° raw 24.4 | -0.7 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 7.6 | GFS 0.25° raw 7.5 | 0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 328 | GFS 0.25° raw 331 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | GFS 0.25° raw 1017.5 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 23.7 | stored grid 23.7 | -0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 7.6 | stored grid 7.5 | 0.2 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1017.59 | stored grid 1017.57 | 0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 23.7 | gfs_global 24.8 | -1.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.6 | gfs_global 7.6 | 0.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 328 | gfs_global 335 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | gfs_global 1017.4 | 0.2 | ±1 | ok |
| Delhi | +0 h | temp °C | 23.7 | gfs_seamless 24.8 | -1.1 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 7.6 | gfs_seamless 7.6 | 0.0 | ±3 | ok |
| Delhi | +0 h | wind from ° | 328 | gfs_seamless 335 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1017.6 | gfs_seamless 1017.4 | 0.2 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 60.3 | cams_global 60.3 | 0.0 | ±3 | ok |
| Delhi | +24 h | temp °C | 24.5 | GFS 0.25° raw 25.4 | -0.9 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.5 | GFS 0.25° raw 2.1 | 1.4 | ±3 | ok |
| Delhi | +24 h | wind from ° | 178 | GFS 0.25° raw 178 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.0 | GFS 0.25° raw 1016.9 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 24.5 | stored grid 24.4 | 0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 3.5 | stored grid 3.5 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1016.95 | stored grid 1016.97 | -0.02 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 24.5 | gfs_global 26.2 | -1.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.5 | gfs_global 1.5 | 2.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 178 | gfs_global 194 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.0 | gfs_global 1016.8 | 0.2 | ±1 | ok |
| Delhi | +24 h | temp °C | 24.5 | gfs_seamless 26.2 | -1.7 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 3.5 | gfs_seamless 1.5 | 2.0 | ±3 | ok |
| Delhi | +24 h | wind from ° | 178 | gfs_seamless 194 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1017.0 | gfs_seamless 1016.8 | 0.2 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 61.9 | cams_global 105.9 | -44.0 | ±3 | **FAIL** |
| Delhi | +111 h | temp °C | 25.7 | GFS 0.25° raw 27.3 | -1.6 | ±0.7 | **FAIL** |
| Delhi | +111 h | wind km/h | 7.0 | GFS 0.25° raw 7.0 | 0.0 | ±3 | ok |
| Delhi | +111 h | wind from ° | 301 | GFS 0.25° raw 312 | — | ±20 | calm |
| Delhi | +111 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +111 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +111 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +111 h | temp °C | 25.7 | stored grid 25.7 | 0.0 | ±0.15 | ok |
| Delhi | +111 h | wind km/h | 7.0 | stored grid 6.8 | 0.2 | ±1 | ok |
| Delhi | +111 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +111 h | pressure hPa | 1014.14 | stored grid 1014.13 | 0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 16.34 | 16.26 | 0.07 | 12.2 | 14.1 | -1.9 | 100 | 100 |
| Kansas City MO | +24 h | 17.59 | 17.74 | -0.15 | 16.2 | 16.3 | -0.1 | 100 | 100 |
| Kansas City MO | +111 h (f120) | 9.84 | 9.75 | 0.09 | 14.1 | 14.7 | -0.6 | 100 | 100 |
| Miami | +0 h | 26.82 | 27.00 | -0.18 | 28.7 | 31.9 | -3.2 | 92 | 100 |
| Miami | +24 h | 25.77 | 26.41 | -0.64 | 27.6 | 30.3 | -2.7 | 100 | 100 |
| Miami | +111 h (f120) | 27.93 | 28.90 | -0.97 | 15.5 | 14.1 | 1.4 | 0 | 0 |
| Denver | +0 h | 9.11 | 13.22 | -4.11 | 2.6 | 2.4 | 0.3 | 54 | 31 |
| Denver | +24 h | 12.79 | 13.85 | -1.06 | 9.4 | 8.5 | 0.9 | 99 | 100 |
| Denver | +111 h (f120) | 10.52 | 11.17 | -0.65 | 2.9 | 2.7 | 0.3 | 0 | 0 |
| London | +0 h | 9.20 | 9.36 | -0.16 | 6.0 | 4.8 | 1.2 | 5 | 5 |
| London | +24 h | 9.26 | 9.30 | -0.05 | 19.5 | 15.5 | 4.0 | 21 | 4 |
| London | +111 h (f120) | 9.56 | 9.60 | -0.04 | 15.2 | 12.9 | 2.4 | 97 | 99 |
| Delhi | +0 h | 23.74 | 24.38 | -0.64 | 7.5 | 7.5 | 0.0 | 0 | 0 |
| Delhi | +24 h | 24.44 | 25.37 | -0.93 | 3.5 | 2.1 | 1.4 | 0 | 0 |
| Delhi | +111 h (f120) | 25.72 | 27.34 | -1.62 | 6.8 | 7.0 | -0.2 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 18.80 | 18.75 | 0.05 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1018.40 | 1018.37 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 78.00 | 77.91 | 0.09 | ±1 | ok |
| Chile coast | +0 h | temp | 13.60 | 13.54 | 0.06 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1017.00 | 1016.96 | 0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 86.00 | 85.89 | 0.11 | ±1 | ok |
| Kansas City | +0 h | temp | 16.40 | 16.48 | -0.09 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.90 | 1020.91 | -0.01 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 20.20 | 20.22 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1011.20 | 1011.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +24 h | temp | 11.80 | 11.72 | 0.08 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1014.70 | 1014.72 | -0.02 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Kansas City | +24 h | temp | 18.00 | 18.02 | -0.02 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1016.50 | 1016.53 | -0.03 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +111 h | temp | 16.00 | 15.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +111 h | pres | 1005.20 | 1005.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +111 h | cloud | 1.00 | 0.77 | 0.23 | ±1 | ok |
| Chile coast | +111 h | temp | 18.40 | 18.44 | -0.04 | ±0.5 | ok |
| Chile coast | +111 h | pres | 1015.40 | 1015.38 | 0.02 | ±0.5 | ok |
| Chile coast | +111 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +111 h | temp | 9.80 | 9.74 | 0.06 | ±0.5 | ok |
| Kansas City | +111 h | pres | 1012.40 | 1012.40 | 0.00 | ±0.5 | ok |
| Kansas City | +111 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (10.1 h before this check), valid hour 2026-11-01T03:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 54.40 | 54.40 | 0.00 | ±0.2 | ok | 59.30 | -4.90 |
| node 52N 0E (London) | +0 h | 36.40 | 36.40 | 0.00 | ±0.2 | ok | 32.20 | 4.20 |
| node 40N 116E (Beijing) | +0 h | 17.60 | 17.60 | 0.00 | ±0.2 | ok | 21.50 | -3.90 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":230,"2024 24-h mean":15,"2012 hourly":242,"2012 24-h mean":34}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.9 | 12.5 | 57 | 56 | 57 | 50 | 52 |
| Miami | 5.0 | 5.8 | 35 | 28 | 32 | 21 | 24 |
| Denver | 27.8 | 18.0 | 67 | 86 | 68 | 84 | 63 |
| London | 29.2 | 16.0 | 62 | 88 | 64 | 87 | 59 |
| Delhi | 60.3 | 68.0 | 158 | 154 | 160 | 153 | 157 |
| node 28N 76E (Delhi) | 59.3 | 38.4 | 103 | 154 | 108 | 153 | 108 |
| node 52N 0E (London) | 32.2 | 13.4 | 57 | 94 | 59 | 93 | 54 |
| node 40N 116E (Beijing) | 21.5 | 66.9 | 159 | 74 | 159 | 71 | 157 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 16 °Cat 2 m39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC | 12 km/hfrom E39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC | Drypast hour · area avg39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC | 100 %area average39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC | 1021 hPasea level39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC | 8.6 µg/m³Good · AQI 49 (24 h)39.1°N 94.5°W · Sun 03:00 local · 03:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC | 29 km/hfrom E25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC | 0.6 mm/hpast hour · area avg25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC | 92 %area average25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC | 1018 hPasea level25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC | 9.1 µg/m³Moderate · AQI 44 (24 h)25.7°N 80.1°W · Sun 03:00 local · 03:00 UTC |
| Denver | 9 °Cat 2 m39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC | 3 km/hfrom ESE39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC | 54 %area average39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC | 1015 hPasea level39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC | 0.8 µg/m³Good · AQI 35 (24 h)39.7°N 104.9°W · Sun 03:00 local · 03:00 UTC |
| London | 9 °Cat 2 m51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC | 6 km/hfrom NNE51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC | 5 %area average51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC | 35 µg/m³Moderate · AQI 62 (24 h)51.5°N 0.1°W · Sun 03:00 local · 03:00 UTC |
| Delhi | 24 °Cat 2 m28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC | 8 km/hfrom NNW28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC | 0 %area average28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC | 1018 hPasea level28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC | 60 µg/m³Unhealthy · AQI 107 (24 h)28.6°N 77.2°E · Sun 03:00 local · 03:00 UTC |
