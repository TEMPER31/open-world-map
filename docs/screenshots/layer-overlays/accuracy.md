# Accuracy check (layer-overlays)

Generated 2026-11-01T00:09:04.746Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T18:00:00.000Z, timeline +0 h = 2026-11-01T00:00:00.000Z (f006); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 46 / 9 / 5
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 44 / 11 / 5
- Open-Meteo gfs_seamless (uses HRRR over the US): 36 / 20 / 4
- Open-Meteo cams_global at the cities: 7 / 3 / 0
- NWS gridpoints (sanity check): 18 / 6 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 25 / 3 / 2
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 3 / 0 / 0

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.5 | GFS 0.25° raw 17.6 | -0.0 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 10.5 | GFS 0.25° raw 10.9 | -0.4 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 52 | GFS 0.25° raw 54 | 2 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.05 | GFS 0.25° raw 0.00 | 0.05 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.0 | GFS 0.25° raw 1020.0 | 0.0 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.5 | stored grid 17.5 | 0.0 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 10.5 | stored grid 10.4 | 0.1 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.00 | stored grid 1019.98 | 0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.5 | gfs_global 17.9 | -0.4 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 10.5 | gfs_global 10.7 | -0.2 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 52 | gfs_global 48 | 4 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.05 | gfs_global 0.00 | 0.05 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.0 | gfs_global 1020.1 | -0.1 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.5 | gfs_seamless 16.1 | 1.4 | ±1 | **FAIL** |
| Kansas City MO | +0 h | wind km/h | 10.5 | gfs_seamless 10.4 | 0.1 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 52 | gfs_seamless 90 | 38 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.05 | gfs_seamless 0.00 | 0.05 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1020.0 | gfs_seamless 1020.9 | -0.9 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.2 | cams_global 10.7 | -1.5 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.5 | NWS 18.9 | -1.3 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 10.5 | NWS 9.3 | 1.2 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 94 | 6 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.05 | NWS 0.08 | -0.03 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 18.1 | GFS 0.25° raw 18.1 | 0.0 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 13.7 | GFS 0.25° raw 12.9 | 0.9 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 137 | GFS 0.25° raw 138 | 1 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.5 | GFS 0.25° raw 1017.5 | 0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 18.1 | stored grid 18.2 | -0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 13.7 | stored grid 13.6 | 0.1 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.50 | stored grid 1017.49 | 0.01 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 18.1 | gfs_global 18.8 | -0.7 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.7 | gfs_global 12.2 | 1.5 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 137 | gfs_global 137 | 0 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.5 | gfs_global 1017.8 | -0.3 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 18.1 | gfs_seamless 17.2 | 0.9 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 13.7 | gfs_seamless 8.1 | 5.6 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 137 | gfs_seamless 124 | 13 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1017.5 | gfs_seamless 1019.8 | -2.3 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 5.0 | cams_global 6.7 | -1.7 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 18.1 | NWS 19.4 | -1.3 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 13.7 | NWS 7.4 | 6.3 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 100 | NWS 68 | 32 | ±30 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +114 h | temp °C | 9.8 | GFS 0.25° raw 9.8 | 0.1 | ±0.7 | ok |
| Kansas City MO | +114 h | wind km/h | 14.0 | GFS 0.25° raw 14.7 | -0.8 | ±3 | ok |
| Kansas City MO | +114 h | wind from ° | 339 | GFS 0.25° raw 336 | 3 | ±20 | ok |
| Kansas City MO | +114 h | precip mm/h | 1.18 | GFS 0.25° raw 0.80 | 0.38 | ±0.3 | **FAIL** |
| Kansas City MO | +114 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +114 h | pressure hPa | 1011.7 | GFS 0.25° raw 1011.8 | -0.0 | ±0.5 | ok |
| Kansas City MO | +114 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| Kansas City MO | +114 h | wind km/h | 14.0 | stored grid 14.1 | -0.1 | ±1 | ok |
| Kansas City MO | +114 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +114 h | pressure hPa | 1011.75 | stored grid 1011.76 | -0.02 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | GFS 0.25° raw 27.4 | -0.4 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 23.8 | GFS 0.25° raw 27.2 | -3.5 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 75 | GFS 0.25° raw 78 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | GFS 0.25° raw 0.46 | -0.13 | ±0.3 | ok |
| Miami | +0 h | cloud % | 100 | GFS 0.25° raw 100 | -0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.5 | GFS 0.25° raw 1017.5 | -0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 27.0 | stored grid 27.0 | 0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 23.8 | stored grid 23.9 | -0.1 | ±1 | ok |
| Miami | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1017.49 | stored grid 1017.49 | -0.00 | ±0.1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_global 27.5 | -0.5 | ±1 | ok |
| Miami | +0 h | wind km/h | 23.8 | gfs_global 28.3 | -4.5 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 75 | gfs_global 78 | 3 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_global 0.60 | -0.27 | ±0.3 | ok |
| Miami | +0 h | cloud % | 100 | gfs_global 100 | -0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.5 | gfs_global 1017.5 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 27.0 | gfs_seamless 25.5 | 1.5 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 23.8 | gfs_seamless 11.9 | 11.9 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 75 | gfs_seamless 76 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.33 | gfs_seamless 0.00 | 0.33 | ±0.3 | **FAIL** |
| Miami | +0 h | cloud % | 100 | gfs_seamless 96 | 4 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1017.5 | gfs_seamless 1018.8 | -1.3 | ±1 | **FAIL** |
| Miami | +0 h | PM2.5 µg/m³ | 9.2 | cams_global 6.5 | 2.7 | ±3 | ok |
| Miami | +0 h | temp °C | 27.0 | NWS 27.2 | -0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 23.8 | NWS 22.2 | 1.5 | ±8 | ok |
| Miami | +0 h | cloud % | 100 | NWS 74 | 26 | ±30 | ok |
| Miami | +0 h | precip mm/h | 0.33 | NWS 0.21 | 0.12 | ±1 | ok |
| Miami | +24 h | temp °C | 25.8 | GFS 0.25° raw 26.2 | -0.5 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 31.0 | GFS 0.25° raw 30.4 | 0.6 | ±3 | ok |
| Miami | +24 h | wind from ° | 100 | GFS 0.25° raw 101 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.88 | GFS 0.25° raw 2.31 | 0.57 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | GFS 0.25° raw 1016.4 | -0.1 | ±0.5 | ok |
| Miami | +24 h | temp °C | 25.8 | stored grid 25.9 | -0.1 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 31.0 | stored grid 31.0 | 0.0 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1016.29 | stored grid 1016.30 | -0.01 | ±0.1 | ok |
| Miami | +24 h | temp °C | 25.8 | gfs_global 26.2 | -0.4 | ±1 | ok |
| Miami | +24 h | wind km/h | 31.0 | gfs_global 32.0 | -1.0 | ±3 | ok |
| Miami | +24 h | wind from ° | 100 | gfs_global 98 | 2 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.88 | gfs_global 2.30 | 0.58 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | gfs_global 1016.3 | -0.0 | ±1 | ok |
| Miami | +24 h | temp °C | 25.8 | gfs_seamless 23.6 | 2.2 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 31.0 | gfs_seamless 21.7 | 9.3 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 100 | gfs_seamless 88 | 12 | ±20 | ok |
| Miami | +24 h | precip mm/h | 2.88 | gfs_seamless 0.00 | 2.88 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1016.3 | gfs_seamless 1018.7 | -2.4 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 6.4 | cams_global 6.7 | -0.3 | ±3 | ok |
| Miami | +24 h | temp °C | 25.8 | NWS 26.1 | -0.4 | ±3 | ok |
| Miami | +24 h | wind km/h | 31.0 | NWS 25.9 | 5.1 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 44 | 56 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 2.88 | NWS 0.68 | 2.20 | ±1 | **FAIL** |
| Miami | +114 h | temp °C | 28.0 | GFS 0.25° raw 28.9 | -0.9 | ±0.7 | **FAIL** |
| Miami | +114 h | wind km/h | 15.6 | GFS 0.25° raw 14.1 | 1.5 | ±3 | ok |
| Miami | +114 h | wind from ° | 312 | GFS 0.25° raw 310 | 3 | ±20 | ok |
| Miami | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Miami | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Miami | +114 h | pressure hPa | 1008.2 | GFS 0.25° raw 1008.1 | 0.1 | ±0.5 | ok |
| Miami | +114 h | temp °C | 28.0 | stored grid 27.9 | 0.0 | ±0.15 | ok |
| Miami | +114 h | wind km/h | 15.6 | stored grid 15.5 | 0.1 | ±1 | ok |
| Miami | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Miami | +114 h | pressure hPa | 1008.22 | stored grid 1008.24 | -0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.5 | GFS 0.25° raw 14.6 | -4.2 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 5.5 | GFS 0.25° raw 5.5 | -0.0 | ±3 | ok |
| Denver | +0 h | wind from ° | 28 | GFS 0.25° raw 23 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 77 | GFS 0.25° raw 85 | -8 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.0 | GFS 0.25° raw 1012.6 | 0.4 | ±0.5 | ok |
| Denver | +0 h | temp °C | 10.5 | stored grid 10.4 | 0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 5.5 | stored grid 5.7 | -0.1 | ±1 | ok |
| Denver | +0 h | cloud % | 77 | stored grid 77 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1013.02 | stored grid 1012.97 | 0.05 | ±0.1 | ok |
| Denver | +0 h | temp °C | 10.5 | gfs_global 15.2 | -4.7 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 5.5 | gfs_global 5.8 | -0.3 | ±3 | ok |
| Denver | +0 h | wind from ° | 28 | gfs_global 22 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 77 | gfs_global 53 | 24 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1013.0 | gfs_global 1010.4 | 2.6 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 10.5 | gfs_seamless 12.9 | -2.4 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 5.5 | gfs_seamless 4.1 | 1.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 28 | gfs_seamless 11 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 77 | gfs_seamless 60 | 17 | ±15 | **FAIL** |
| Denver | +0 h | pressure hPa | 1013.0 | gfs_seamless 1012.1 | 0.9 | ±1 | ok |
| Denver | +0 h | PM2.5 µg/m³ | 0.7 | cams_global 12.9 | -12.2 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 10.5 | NWS 15.0 | -4.5 | ±3 | **FAIL** |
| Denver | +0 h | wind km/h | 5.5 | NWS 5.6 | -0.0 | ±8 | ok |
| Denver | +0 h | cloud % | 77 | NWS 38 | 39 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 13.6 | GFS 0.25° raw 15.4 | -1.8 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 4.9 | GFS 0.25° raw 3.4 | 1.5 | ±3 | ok |
| Denver | +24 h | wind from ° | 43 | GFS 0.25° raw 61 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1000.5 | GFS 0.25° raw 999.9 | 0.6 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 13.6 | stored grid 13.6 | 0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 4.9 | stored grid 5.0 | -0.1 | ±1 | ok |
| Denver | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1000.48 | stored grid 1000.49 | -0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 13.6 | gfs_global 15.4 | -1.8 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 4.9 | gfs_global 6.5 | -1.6 | ±3 | ok |
| Denver | +24 h | wind from ° | 43 | gfs_global 19 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1000.5 | gfs_global 997.2 | 3.3 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 13.6 | gfs_seamless 13.5 | 0.1 | ±1 | ok |
| Denver | +24 h | wind km/h | 4.9 | gfs_seamless 8.6 | -3.7 | ±3 | **FAIL** |
| Denver | +24 h | wind from ° | 43 | gfs_seamless 358 | 45 | ±20 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1000.5 | gfs_seamless 1001.4 | -0.9 | ±1 | ok |
| Denver | +24 h | PM2.5 µg/m³ | 0.9 | cams_global 2.7 | -1.8 | ±3 | ok |
| Denver | +24 h | temp °C | 13.6 | NWS 14.4 | -0.8 | ±3 | ok |
| Denver | +24 h | wind km/h | 4.9 | NWS 7.4 | -2.5 | ±8 | ok |
| Denver | +24 h | cloud % | 100 | NWS 69 | 31 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +114 h | temp °C | 10.6 | GFS 0.25° raw 11.2 | -0.6 | ±0.7 | ok |
| Denver | +114 h | wind km/h | 2.8 | GFS 0.25° raw 2.7 | 0.1 | ±3 | ok |
| Denver | +114 h | wind from ° | 116 | GFS 0.25° raw 113 | — | ±20 | calm |
| Denver | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +114 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Denver | +114 h | pressure hPa | 1015.5 | GFS 0.25° raw 1015.7 | -0.2 | ±0.5 | ok |
| Denver | +114 h | temp °C | 10.6 | stored grid 10.5 | 0.1 | ±0.15 | ok |
| Denver | +114 h | wind km/h | 2.8 | stored grid 2.9 | -0.1 | ±1 | ok |
| Denver | +114 h | cloud % | 1 | stored grid 0 | 0 | ±1 | ok |
| Denver | +114 h | pressure hPa | 1015.50 | stored grid 1015.51 | -0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.8 | GFS 0.25° raw 10.0 | -0.2 | ±0.7 | ok |
| London | +0 h | wind km/h | 4.2 | GFS 0.25° raw 3.5 | 0.8 | ±3 | ok |
| London | +0 h | wind from ° | 44 | GFS 0.25° raw 41 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 13 | GFS 0.25° raw 6 | 6 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.4 | GFS 0.25° raw 1032.4 | 0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.8 | stored grid 9.8 | -0.0 | ±0.15 | ok |
| London | +0 h | wind km/h | 4.2 | stored grid 4.5 | -0.3 | ±1 | ok |
| London | +0 h | cloud % | 13 | stored grid 12 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1032.43 | stored grid 1032.42 | 0.01 | ±0.1 | ok |
| London | +0 h | temp °C | 9.8 | gfs_global 10.1 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 4.2 | gfs_global 3.3 | 0.9 | ±3 | ok |
| London | +0 h | wind from ° | 44 | gfs_global 41 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 13 | gfs_global 18 | -5 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.4 | gfs_global 1032.2 | 0.2 | ±1 | ok |
| London | +0 h | temp °C | 9.8 | gfs_seamless 10.1 | -0.3 | ±1 | ok |
| London | +0 h | wind km/h | 4.2 | gfs_seamless 3.3 | 0.9 | ±3 | ok |
| London | +0 h | wind from ° | 44 | gfs_seamless 41 | — | ±20 | calm |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 13 | gfs_seamless 18 | -5 | ±15 | ok |
| London | +0 h | pressure hPa | 1032.4 | gfs_seamless 1032.2 | 0.2 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 27.5 | cams_global 30.0 | -2.5 | ±3 | ok |
| London | +24 h | temp °C | 10.1 | GFS 0.25° raw 10.2 | -0.1 | ±0.7 | ok |
| London | +24 h | wind km/h | 17.5 | GFS 0.25° raw 8.8 | 8.7 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 22 | GFS 0.25° raw 26 | 4 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 81 | GFS 0.25° raw 98 | -17 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.7 | GFS 0.25° raw 1034.6 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 10.1 | stored grid 10.1 | 0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 17.5 | stored grid 17.5 | 0.0 | ±1 | ok |
| London | +24 h | cloud % | 81 | stored grid 81 | -0 | ±1 | ok |
| London | +24 h | pressure hPa | 1034.67 | stored grid 1034.64 | 0.03 | ±0.1 | ok |
| London | +24 h | temp °C | 10.1 | gfs_global 10.2 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 17.5 | gfs_global 7.7 | 9.8 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 22 | gfs_global 28 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 81 | gfs_global 100 | -19 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.7 | gfs_global 1034.8 | -0.1 | ±1 | ok |
| London | +24 h | temp °C | 10.1 | gfs_seamless 10.2 | -0.1 | ±1 | ok |
| London | +24 h | wind km/h | 17.5 | gfs_seamless 7.7 | 9.8 | ±3 | **FAIL** |
| London | +24 h | wind from ° | 22 | gfs_seamless 28 | 6 | ±20 | ok |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 81 | gfs_seamless 100 | -19 | ±15 | **FAIL** |
| London | +24 h | pressure hPa | 1034.7 | gfs_seamless 1034.8 | -0.1 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 6.5 | cams_global 8.6 | -2.1 | ±3 | ok |
| London | +114 h | temp °C | 9.5 | GFS 0.25° raw 9.6 | -0.1 | ±0.7 | ok |
| London | +114 h | wind km/h | 15.2 | GFS 0.25° raw 12.9 | 2.3 | ±3 | ok |
| London | +114 h | wind from ° | 52 | GFS 0.25° raw 52 | 0 | ±20 | ok |
| London | +114 h | precip mm/h | 0.09 | GFS 0.25° raw 0.12 | -0.03 | ±0.3 | ok |
| London | +114 h | cloud % | 97 | GFS 0.25° raw 99 | -2 | ±15 | ok |
| London | +114 h | pressure hPa | 1027.6 | GFS 0.25° raw 1027.6 | 0.0 | ±0.5 | ok |
| London | +114 h | temp °C | 9.5 | stored grid 9.6 | -0.0 | ±0.15 | ok |
| London | +114 h | wind km/h | 15.2 | stored grid 15.2 | -0.0 | ±1 | ok |
| London | +114 h | cloud % | 97 | stored grid 97 | -0 | ±1 | ok |
| London | +114 h | pressure hPa | 1027.64 | stored grid 1027.61 | 0.03 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.9 | GFS 0.25° raw 23.2 | -1.3 | ±0.7 | **FAIL** |
| Delhi | +0 h | wind km/h | 5.3 | GFS 0.25° raw 5.5 | -0.2 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | GFS 0.25° raw 305 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.9 | GFS 0.25° raw 1015.8 | 0.1 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 21.9 | stored grid 21.8 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 5.3 | stored grid 5.3 | -0.1 | ±1 | ok |
| Delhi | +0 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1015.90 | stored grid 1015.92 | -0.02 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 21.9 | gfs_global 24.2 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 5.3 | gfs_global 4.8 | 0.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | gfs_global 318 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.9 | gfs_global 1015.8 | 0.1 | ±1 | ok |
| Delhi | +0 h | temp °C | 21.9 | gfs_seamless 24.2 | -2.3 | ±1 | **FAIL** |
| Delhi | +0 h | wind km/h | 5.3 | gfs_seamless 4.8 | 0.5 | ±3 | ok |
| Delhi | +0 h | wind from ° | 296 | gfs_seamless 318 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1015.9 | gfs_seamless 1015.8 | 0.1 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 62.6 | cams_global 56.5 | 6.1 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 22.5 | GFS 0.25° raw 23.9 | -1.4 | ±0.7 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.9 | GFS 0.25° raw 0.6 | 1.3 | ±3 | ok |
| Delhi | +24 h | wind from ° | 288 | GFS 0.25° raw 330 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | GFS 0.25° raw 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | GFS 0.25° raw 1015.0 | 0.1 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 22.5 | stored grid 22.6 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 1.9 | stored grid 2.1 | -0.1 | ±1 | ok |
| Delhi | +24 h | cloud % | 1 | stored grid 1 | 0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.04 | stored grid 1015.05 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 22.5 | gfs_global 25.0 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.9 | gfs_global 2.1 | -0.2 | ±3 | ok |
| Delhi | +24 h | wind from ° | 288 | gfs_global 329 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_global 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | gfs_global 1015.1 | -0.1 | ±1 | ok |
| Delhi | +24 h | temp °C | 22.5 | gfs_seamless 25.0 | -2.5 | ±1 | **FAIL** |
| Delhi | +24 h | wind km/h | 1.9 | gfs_seamless 2.1 | -0.2 | ±3 | ok |
| Delhi | +24 h | wind from ° | 288 | gfs_seamless 329 | — | ±20 | calm |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 1 | gfs_seamless 0 | 1 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.0 | gfs_seamless 1015.1 | -0.1 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 59.4 | cams_global 98.7 | -39.3 | ±3 | **FAIL** |
| Delhi | +114 h | temp °C | 25.7 | GFS 0.25° raw 27.3 | -1.6 | ±0.7 | **FAIL** |
| Delhi | +114 h | wind km/h | 7.0 | GFS 0.25° raw 7.0 | 0.0 | ±3 | ok |
| Delhi | +114 h | wind from ° | 301 | GFS 0.25° raw 312 | — | ±20 | calm |
| Delhi | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +114 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +114 h | temp °C | 25.7 | stored grid 25.7 | 0.0 | ±0.15 | ok |
| Delhi | +114 h | wind km/h | 7.0 | stored grid 6.8 | 0.2 | ±1 | ok |
| Delhi | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +114 h | pressure hPa | 1014.14 | stored grid 1014.13 | 0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.50 | 17.57 | -0.07 | 10.4 | 10.9 | -0.5 | 100 | 100 |
| Kansas City MO | +24 h | 18.15 | 18.11 | 0.05 | 13.6 | 12.9 | 0.8 | 100 | 100 |
| Kansas City MO | +114 h (f120) | 9.84 | 9.75 | 0.09 | 14.1 | 14.7 | -0.6 | 100 | 100 |
| Miami | +0 h | 27.04 | 27.43 | -0.39 | 23.9 | 27.2 | -3.3 | 100 | 100 |
| Miami | +24 h | 25.85 | 26.21 | -0.36 | 31.0 | 30.4 | 0.6 | 100 | 100 |
| Miami | +114 h (f120) | 27.93 | 28.90 | -0.97 | 15.5 | 14.1 | 1.4 | 0 | 0 |
| Denver | +0 h | 10.44 | 14.63 | -4.19 | 5.7 | 5.5 | 0.1 | 77 | 85 |
| Denver | +24 h | 13.62 | 15.41 | -1.79 | 5.0 | 3.4 | 1.6 | 100 | 100 |
| Denver | +114 h (f120) | 10.52 | 11.17 | -0.65 | 2.9 | 2.7 | 0.3 | 0 | 0 |
| London | +0 h | 9.82 | 9.96 | -0.14 | 4.5 | 3.5 | 1.0 | 12 | 6 |
| London | +24 h | 10.13 | 10.21 | -0.08 | 17.5 | 8.8 | 8.7 | 81 | 98 |
| London | +114 h (f120) | 9.56 | 9.60 | -0.04 | 15.2 | 12.9 | 2.4 | 97 | 99 |
| Delhi | +0 h | 21.84 | 23.16 | -1.32 | 5.3 | 5.5 | -0.1 | 0 | 0 |
| Delhi | +24 h | 22.56 | 23.87 | -1.31 | 2.1 | 0.6 | 1.4 | 1 | 0 |
| Delhi | +114 h (f120) | 25.72 | 27.34 | -1.62 | 6.8 | 7.0 | -0.2 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 17.40 | 17.48 | -0.08 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1019.70 | 1019.66 | 0.04 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 94.00 | 93.86 | 0.14 | ±1 | ok |
| Chile coast | +0 h | temp | 14.20 | 14.29 | -0.09 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1016.80 | 1016.84 | -0.04 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 53.00 | 52.52 | 0.48 | ±1 | ok |
| Kansas City | +0 h | temp | 17.40 | 17.45 | -0.05 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1020.00 | 1019.96 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 17.60 | 17.70 | -0.09 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1013.70 | 1013.71 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 70.00 | 70.44 | -0.44 | ±1 | ok |
| Chile coast | +24 h | temp | 12.00 | 11.99 | 0.01 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1015.20 | 1015.24 | -0.04 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 98.00 | 98.26 | -0.26 | ±1 | ok |
| Kansas City | +24 h | temp | 18.00 | 18.00 | 0.00 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1017.10 | 1017.11 | -0.01 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 100.00 | 99.84 | 0.16 | ±1 | ok |
| Tokyo Bay | +114 h | temp | 16.00 | 15.94 | 0.06 | ±0.5 | ok |
| Tokyo Bay | +114 h | pres | 1005.20 | 1005.21 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +114 h | cloud | 1.00 | 0.77 | 0.23 | ±1 | ok |
| Chile coast | +114 h | temp | 18.40 | 18.44 | -0.04 | ±0.5 | ok |
| Chile coast | +114 h | pres | 1015.40 | 1015.38 | 0.02 | ±0.5 | ok |
| Chile coast | +114 h | cloud | 0.00 | 0.00 | 0.00 | ±1 | ok |
| Kansas City | +114 h | temp | 9.80 | 9.74 | 0.06 | ±0.5 | ok |
| Kansas City | +114 h | pres | 1012.40 | 1012.40 | 0.00 | ±0.5 | ok |
| Kansas City | +114 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T17:15:17Z (6.9 h before this check), valid hour 2026-11-01T00:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 61.20 | 61.20 | 0.00 | ±0.2 | ok | 61.20 | 0.00 |
| node 52N 0E (London) | +0 h | 28.70 | 28.70 | 0.00 | ±0.2 | ok | 24.20 | 4.50 |
| node 40N 116E (Beijing) | +0 h | 56.50 | 56.50 | 0.00 | ±0.2 | ok | 64.70 | -8.20 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":136,"2024 24-h mean":11,"2012 hourly":153,"2012 24-h mean":34}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 10.7 | 13.2 | 58 | 54 | 58 | 45 | 53 |
| Miami | 6.5 | 5.9 | 35 | 36 | 33 | 27 | 25 |
| Denver | 12.9 | 17.6 | 66 | 58 | 67 | 53 | 62 |
| London | 30.0 | 13.7 | 57 | 90 | 60 | 89 | 54 |
| Delhi | 56.5 | 65.1 | 156 | 152 | 158 | 152 | 156 |
| node 28N 76E (Delhi) | 61.2 | 35.3 | 98 | 155 | 100 | 154 | 100 |
| node 52N 0E (London) | 24.2 | 11.0 | 53 | 79 | 54 | 76 | 45 |
| node 40N 116E (Beijing) | 64.7 | 68.4 | 160 | 157 | 160 | 156 | 158 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 18 °Cat 2 m39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC | 10 km/hfrom NE39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC | Drypast hour · area avg39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC | 100 %area average39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC | 1020 hPasea level39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC | 9.2 µg/m³Moderate · AQI 49 (24 h)39.1°N 94.5°W · Sun 00:00 local · 00:00 UTC |
| Miami | 27 °Cat 2 m25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC | 24 km/hfrom ENE25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC | 0.3 mm/hpast hour · area avg25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC | 100 %area average25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC | 1017 hPasea level25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC | 9.2 µg/m³Moderate · AQI 43 (24 h)25.7°N 80.1°W · Sun 00:00 local · 00:00 UTC |
| Denver | 10 °Cat 2 m39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC | 6 km/hfrom NNE39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC | Drypast hour · area avg39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC | 77 %area average39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC | 1013 hPasea level39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC | 0.7 µg/m³Good · AQI 37 (24 h)39.7°N 104.9°W · Sun 00:00 local · 00:00 UTC |
| London | 10 °Cat 2 m51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC | 4 km/hfrom NE51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC | Drypast hour · area avg51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC | 13 %area average51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC | 1032 hPasea level51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC | 28 µg/m³Moderate · AQI 58 (24 h)51.5°N 0.1°W · Sun 00:00 local · 00:00 UTC |
| Delhi | 22 °Cat 2 m28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC | 5 km/hfrom WNW28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC | Drypast hour · area avg28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC | 0 %area average28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC | 1016 hPasea level28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC | 63 µg/m³Unhealthy · AQI 101 (24 h)28.6°N 77.2°E · Sun 00:00 local · 00:00 UTC |
