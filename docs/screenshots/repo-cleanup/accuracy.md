# Accuracy check (repo-cleanup)

Generated 2026-10-31T06:51:30.578Z by `scripts/data/accuracy.mjs`. Site data: GFS run 2026-10-31T00:00:00.000Z, timeline +0 h = 2026-10-31T06:00:00.000Z (f006); live data: true.
Values are read through the page's own code (`getGrid` + `sample` + `reading()`), bilinear at the city's coordinates.
References: Open-Meteo `gfs_global` / `gfs_seamless` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo `cams_global`.

**Summary** (within tolerance / outside / not comparable):
- Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h: 52 / 4 / 4
- Page vs the stored grid before encoding (encoding only), +0 h and +24 h: 40 / 0 / 0
- Open-Meteo gfs_global: 48 / 8 / 4
- Open-Meteo gfs_seamless (uses HRRR over the US): 37 / 19 / 4
- Open-Meteo cams_global at the cities: 4 / 6 / 0
- NWS gridpoints (sanity check): 19 / 5 / 0
- f120 (+5 d): page vs raw NOAA GFS 0.25°: 22 / 5 / 3
- f120 (+5 d): page vs the stored grid (encoding only): 20 / 0 / 0
- Grid alignment at 0.5° nodes: 27 / 0 / 0
- Air quality at 4° grid nodes vs the values the job downloaded: 0 / 0 / 3

## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | temp °C | 17.2 | GFS 0.25° raw 17.1 | 0.1 | ±0.7 | ok |
| Kansas City MO | +0 h | wind km/h | 9.1 | GFS 0.25° raw 6.4 | 2.7 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 298 | GFS 0.25° raw 300 | 2 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.28 | GFS 0.25° raw 0.22 | 0.06 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.3 | GFS 0.25° raw 1021.4 | -0.1 | ±0.5 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | stored grid 17.2 | 0.1 | ±0.15 | ok |
| Kansas City MO | +0 h | wind km/h | 9.1 | stored grid 8.6 | 0.5 | ±1 | ok |
| Kansas City MO | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.33 | stored grid 1021.34 | -0.01 | ±0.1 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | gfs_global 17.8 | -0.6 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 9.1 | gfs_global 7.2 | 1.9 | ±3 | ok |
| Kansas City MO | +0 h | wind from ° | 298 | gfs_global 297 | 1 | ±20 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.28 | gfs_global 0.00 | 0.28 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.3 | gfs_global 1021.3 | 0.0 | ±1 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | gfs_seamless 16.9 | 0.3 | ±1 | ok |
| Kansas City MO | +0 h | wind km/h | 9.1 | gfs_seamless 5.8 | 3.3 | ±3 | **FAIL** |
| Kansas City MO | +0 h | wind from ° | 298 | gfs_seamless 70 | 132 | ±20 | **FAIL** |
| Kansas City MO | +0 h | precip mm/h | 0.28 | gfs_seamless 0.00 | 0.28 | ±0.3 | ok |
| Kansas City MO | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Kansas City MO | +0 h | pressure hPa | 1021.3 | gfs_seamless 1021.8 | -0.5 | ±1 | ok |
| Kansas City MO | +0 h | PM2.5 µg/m³ | 9.6 | cams_global 11.6 | -2.0 | ±3 | ok |
| Kansas City MO | +0 h | temp °C | 17.2 | NWS 17.2 | 0.0 | ±3 | ok |
| Kansas City MO | +0 h | wind km/h | 9.1 | NWS 3.7 | 5.4 | ±8 | ok |
| Kansas City MO | +0 h | cloud % | 100 | NWS 92 | 8 | ±30 | ok |
| Kansas City MO | +0 h | precip mm/h | 0.28 | NWS 0.08 | 0.20 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.9 | GFS 0.25° raw 14.2 | -0.3 | ±0.7 | ok |
| Kansas City MO | +24 h | wind km/h | 10.6 | GFS 0.25° raw 9.7 | 0.8 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 141 | GFS 0.25° raw 147 | 6 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 67 | GFS 0.25° raw 56 | 10 | ±15 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.5 | GFS 0.25° raw 1021.5 | 0.0 | ±0.5 | ok |
| Kansas City MO | +24 h | temp °C | 13.9 | stored grid 14.0 | -0.0 | ±0.15 | ok |
| Kansas City MO | +24 h | wind km/h | 10.6 | stored grid 10.2 | 0.3 | ±1 | ok |
| Kansas City MO | +24 h | cloud % | 67 | stored grid 67 | 0 | ±1 | ok |
| Kansas City MO | +24 h | pressure hPa | 1021.48 | stored grid 1021.47 | 0.01 | ±0.1 | ok |
| Kansas City MO | +24 h | temp °C | 13.9 | gfs_global 14.7 | -0.8 | ±1 | ok |
| Kansas City MO | +24 h | wind km/h | 10.6 | gfs_global 9.9 | 0.7 | ±3 | ok |
| Kansas City MO | +24 h | wind from ° | 141 | gfs_global 147 | 6 | ±20 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 67 | gfs_global 37 | 30 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.5 | gfs_global 1021.6 | -0.1 | ±1 | ok |
| Kansas City MO | +24 h | temp °C | 13.9 | gfs_seamless 15.5 | -1.6 | ±1 | **FAIL** |
| Kansas City MO | +24 h | wind km/h | 10.6 | gfs_seamless 13.8 | -3.2 | ±3 | **FAIL** |
| Kansas City MO | +24 h | wind from ° | 141 | gfs_seamless 83 | 58 | ±20 | **FAIL** |
| Kansas City MO | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +24 h | cloud % | 67 | gfs_seamless 100 | -33 | ±15 | **FAIL** |
| Kansas City MO | +24 h | pressure hPa | 1021.5 | gfs_seamless 1022.5 | -1.0 | ±1 | **FAIL** |
| Kansas City MO | +24 h | PM2.5 µg/m³ | 13.0 | cams_global 10.7 | 2.3 | ±3 | ok |
| Kansas City MO | +24 h | temp °C | 13.9 | NWS 16.1 | -2.2 | ±3 | ok |
| Kansas City MO | +24 h | wind km/h | 10.6 | NWS 7.4 | 3.2 | ±8 | ok |
| Kansas City MO | +24 h | cloud % | 67 | NWS 80 | -13 | ±30 | ok |
| Kansas City MO | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Kansas City MO | +114 h | temp °C | 12.7 | GFS 0.25° raw 12.8 | -0.1 | ±0.7 | ok |
| Kansas City MO | +114 h | wind km/h | 6.2 | GFS 0.25° raw 6.0 | 0.1 | ±3 | ok |
| Kansas City MO | +114 h | wind from ° | 25 | GFS 0.25° raw 21 | — | ±20 | calm |
| Kansas City MO | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Kansas City MO | +114 h | cloud % | 7 | GFS 0.25° raw 5 | 2 | ±15 | ok |
| Kansas City MO | +114 h | pressure hPa | 1014.4 | GFS 0.25° raw 1014.4 | 0.0 | ±0.5 | ok |
| Kansas City MO | +114 h | temp °C | 12.7 | stored grid 12.7 | -0.0 | ±0.15 | ok |
| Kansas City MO | +114 h | wind km/h | 6.2 | stored grid 5.9 | 0.3 | ±1 | ok |
| Kansas City MO | +114 h | cloud % | 7 | stored grid 7 | 0 | ±1 | ok |
| Kansas City MO | +114 h | pressure hPa | 1014.40 | stored grid 1014.38 | 0.03 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.4 | GFS 0.25° raw 27.0 | -0.5 | ±0.7 | ok |
| Miami | +0 h | wind km/h | 18.7 | GFS 0.25° raw 20.6 | -1.9 | ±3 | ok |
| Miami | +0 h | wind from ° | 84 | GFS 0.25° raw 87 | 4 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | GFS 0.25° raw 0.25 | -0.11 | ±0.3 | ok |
| Miami | +0 h | cloud % | 6 | GFS 0.25° raw 3 | 3 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.6 | 0.0 | ±0.5 | ok |
| Miami | +0 h | temp °C | 26.4 | stored grid 26.5 | -0.0 | ±0.15 | ok |
| Miami | +0 h | wind km/h | 18.7 | stored grid 18.9 | -0.2 | ±1 | ok |
| Miami | +0 h | cloud % | 6 | stored grid 6 | 0 | ±1 | ok |
| Miami | +0 h | pressure hPa | 1015.59 | stored grid 1015.60 | -0.01 | ±0.1 | ok |
| Miami | +0 h | temp °C | 26.4 | gfs_global 27.1 | -0.7 | ±1 | ok |
| Miami | +0 h | wind km/h | 18.7 | gfs_global 22.0 | -3.3 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 84 | gfs_global 86 | 2 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | gfs_global 0.40 | -0.26 | ±0.3 | ok |
| Miami | +0 h | cloud % | 6 | gfs_global 6 | -0 | ±15 | ok |
| Miami | +0 h | pressure hPa | 1015.6 | gfs_global 1015.6 | -0.0 | ±1 | ok |
| Miami | +0 h | temp °C | 26.4 | gfs_seamless 25.0 | 1.4 | ±1 | **FAIL** |
| Miami | +0 h | wind km/h | 18.7 | gfs_seamless 10.5 | 8.2 | ±3 | **FAIL** |
| Miami | +0 h | wind from ° | 84 | gfs_seamless 85 | 1 | ±20 | ok |
| Miami | +0 h | precip mm/h | 0.14 | gfs_seamless 0.00 | 0.14 | ±0.3 | ok |
| Miami | +0 h | cloud % | 6 | gfs_seamless 68 | -62 | ±15 | **FAIL** |
| Miami | +0 h | pressure hPa | 1015.6 | gfs_seamless 1016.1 | -0.5 | ±1 | ok |
| Miami | +0 h | PM2.5 µg/m³ | 10.2 | cams_global 3.7 | 6.5 | ±3 | **FAIL** |
| Miami | +0 h | temp °C | 26.4 | NWS 26.7 | -0.2 | ±3 | ok |
| Miami | +0 h | wind km/h | 18.7 | NWS 22.2 | -3.6 | ±8 | ok |
| Miami | +0 h | cloud % | 6 | NWS 59 | -53 | ±30 | **FAIL** |
| Miami | +0 h | precip mm/h | 0.14 | NWS 0.64 | -0.49 | ±1 | ok |
| Miami | +24 h | temp °C | 26.2 | GFS 0.25° raw 26.6 | -0.3 | ±0.7 | ok |
| Miami | +24 h | wind km/h | 27.0 | GFS 0.25° raw 29.1 | -2.1 | ±3 | ok |
| Miami | +24 h | wind from ° | 86 | GFS 0.25° raw 86 | 0 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.48 | GFS 0.25° raw 0.72 | -0.24 | ±0.3 | ok |
| Miami | +24 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.9 | GFS 0.25° raw 1017.9 | 0.0 | ±0.5 | ok |
| Miami | +24 h | temp °C | 26.2 | stored grid 26.3 | -0.0 | ±0.15 | ok |
| Miami | +24 h | wind km/h | 27.0 | stored grid 27.0 | -0.0 | ±1 | ok |
| Miami | +24 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Miami | +24 h | pressure hPa | 1017.88 | stored grid 1017.88 | 0.00 | ±0.1 | ok |
| Miami | +24 h | temp °C | 26.2 | gfs_global 26.6 | -0.4 | ±1 | ok |
| Miami | +24 h | wind km/h | 27.0 | gfs_global 29.9 | -2.9 | ±3 | ok |
| Miami | +24 h | wind from ° | 86 | gfs_global 87 | 1 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.48 | gfs_global 0.90 | -0.42 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.9 | gfs_global 1017.8 | 0.1 | ±1 | ok |
| Miami | +24 h | temp °C | 26.2 | gfs_seamless 24.1 | 2.1 | ±1 | **FAIL** |
| Miami | +24 h | wind km/h | 27.0 | gfs_seamless 19.3 | 7.7 | ±3 | **FAIL** |
| Miami | +24 h | wind from ° | 86 | gfs_seamless 74 | 12 | ±20 | ok |
| Miami | +24 h | precip mm/h | 0.48 | gfs_seamless 0.00 | 0.48 | ±0.3 | **FAIL** |
| Miami | +24 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Miami | +24 h | pressure hPa | 1017.9 | gfs_seamless 1019.0 | -1.1 | ±1 | **FAIL** |
| Miami | +24 h | PM2.5 µg/m³ | 8.9 | cams_global 7.7 | 1.2 | ±3 | ok |
| Miami | +24 h | temp °C | 26.2 | NWS 26.7 | -0.4 | ±3 | ok |
| Miami | +24 h | wind km/h | 27.0 | NWS 29.6 | -2.7 | ±8 | ok |
| Miami | +24 h | cloud % | 100 | NWS 69 | 31 | ±30 | **FAIL** |
| Miami | +24 h | precip mm/h | 0.48 | NWS 1.91 | -1.43 | ±1 | **FAIL** |
| Miami | +114 h | temp °C | 24.8 | GFS 0.25° raw 25.1 | -0.3 | ±0.7 | ok |
| Miami | +114 h | wind km/h | 23.4 | GFS 0.25° raw 28.4 | -5.0 | ±3 | **FAIL** |
| Miami | +114 h | wind from ° | 70 | GFS 0.25° raw 65 | 5 | ±20 | ok |
| Miami | +114 h | precip mm/h | 1.75 | GFS 0.25° raw 2.59 | -0.84 | ±0.3 | **FAIL** |
| Miami | +114 h | cloud % | 88 | GFS 0.25° raw 100 | -12 | ±15 | ok |
| Miami | +114 h | pressure hPa | 1011.9 | GFS 0.25° raw 1011.8 | 0.1 | ±0.5 | ok |
| Miami | +114 h | temp °C | 24.8 | stored grid 24.8 | 0.0 | ±0.15 | ok |
| Miami | +114 h | wind km/h | 23.4 | stored grid 23.5 | -0.1 | ±1 | ok |
| Miami | +114 h | cloud % | 88 | stored grid 88 | -0 | ±1 | ok |
| Miami | +114 h | pressure hPa | 1011.88 | stored grid 1011.86 | 0.02 | ±0.1 | ok |
| Denver | +0 h | temp °C | 9.4 | GFS 0.25° raw 12.7 | -3.2 | ±0.7 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | GFS 0.25° raw 1.7 | 1.5 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | GFS 0.25° raw 5 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | GFS 0.25° raw 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.8 | GFS 0.25° raw 1013.1 | 0.7 | ±0.5 | **FAIL** |
| Denver | +0 h | temp °C | 9.4 | stored grid 9.4 | -0.0 | ±0.15 | ok |
| Denver | +0 h | wind km/h | 3.2 | stored grid 3.4 | -0.2 | ±1 | ok |
| Denver | +0 h | cloud % | 100 | stored grid 100 | 0 | ±1 | ok |
| Denver | +0 h | pressure hPa | 1013.80 | stored grid 1013.82 | -0.01 | ±0.1 | ok |
| Denver | +0 h | temp °C | 9.4 | gfs_global 13.0 | -3.6 | ±1 | **FAIL** |
| Denver | +0 h | wind km/h | 3.2 | gfs_global 4.0 | -0.8 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | gfs_global 360 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_global 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.8 | gfs_global 1012.5 | 1.3 | ±1 | **FAIL** |
| Denver | +0 h | temp °C | 9.4 | gfs_seamless 8.6 | 0.8 | ±1 | ok |
| Denver | +0 h | wind km/h | 3.2 | gfs_seamless 1.8 | 1.4 | ±3 | ok |
| Denver | +0 h | wind from ° | 18 | gfs_seamless 32 | — | ±20 | calm |
| Denver | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +0 h | cloud % | 100 | gfs_seamless 100 | 0 | ±15 | ok |
| Denver | +0 h | pressure hPa | 1013.8 | gfs_seamless 1010.6 | 3.2 | ±1 | **FAIL** |
| Denver | +0 h | PM2.5 µg/m³ | 1.4 | cams_global 24.4 | -23.0 | ±3 | **FAIL** |
| Denver | +0 h | temp °C | 9.4 | NWS 8.9 | 0.5 | ±3 | ok |
| Denver | +0 h | wind km/h | 3.2 | NWS 3.7 | -0.5 | ±8 | ok |
| Denver | +0 h | cloud % | 100 | NWS 56 | 44 | ±30 | **FAIL** |
| Denver | +0 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +24 h | temp °C | 9.2 | GFS 0.25° raw 13.4 | -4.2 | ±0.7 | **FAIL** |
| Denver | +24 h | wind km/h | 4.5 | GFS 0.25° raw 4.2 | 0.3 | ±3 | ok |
| Denver | +24 h | wind from ° | 266 | GFS 0.25° raw 259 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | GFS 0.25° raw 100 | -4 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1015.2 | GFS 0.25° raw 1014.0 | 1.1 | ±0.5 | **FAIL** |
| Denver | +24 h | temp °C | 9.2 | stored grid 9.2 | -0.0 | ±0.15 | ok |
| Denver | +24 h | wind km/h | 4.5 | stored grid 4.1 | 0.4 | ±1 | ok |
| Denver | +24 h | cloud % | 96 | stored grid 96 | 0 | ±1 | ok |
| Denver | +24 h | pressure hPa | 1015.16 | stored grid 1015.15 | 0.01 | ±0.1 | ok |
| Denver | +24 h | temp °C | 9.2 | gfs_global 13.9 | -4.7 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 4.5 | gfs_global 4.0 | 0.5 | ±3 | ok |
| Denver | +24 h | wind from ° | 266 | gfs_global 280 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | gfs_global 100 | -4 | ±15 | ok |
| Denver | +24 h | pressure hPa | 1015.2 | gfs_global 1013.9 | 1.3 | ±1 | **FAIL** |
| Denver | +24 h | temp °C | 9.2 | gfs_seamless 7.4 | 1.8 | ±1 | **FAIL** |
| Denver | +24 h | wind km/h | 4.5 | gfs_seamless 4.7 | -0.2 | ±3 | ok |
| Denver | +24 h | wind from ° | 266 | gfs_seamless 265 | — | ±20 | calm |
| Denver | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Denver | +24 h | cloud % | 96 | gfs_seamless 6 | 90 | ±15 | **FAIL** |
| Denver | +24 h | pressure hPa | 1015.2 | gfs_seamless 1016.4 | -1.2 | ±1 | **FAIL** |
| Denver | +24 h | PM2.5 µg/m³ | 2.5 | cams_global 31.4 | -28.9 | ±3 | **FAIL** |
| Denver | +24 h | temp °C | 9.2 | NWS 9.4 | -0.3 | ±3 | ok |
| Denver | +24 h | wind km/h | 4.5 | NWS 5.6 | -1.1 | ±8 | ok |
| Denver | +24 h | cloud % | 96 | NWS 58 | 38 | ±30 | **FAIL** |
| Denver | +24 h | precip mm/h | 0.00 | NWS 0.00 | 0.00 | ±1 | ok |
| Denver | +114 h | temp °C | 13.4 | GFS 0.25° raw 16.1 | -2.8 | ±0.7 | **FAIL** |
| Denver | +114 h | wind km/h | 8.0 | GFS 0.25° raw 7.6 | 0.4 | ±3 | ok |
| Denver | +114 h | wind from ° | 6 | GFS 0.25° raw 9 | — | ±20 | calm |
| Denver | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Denver | +114 h | cloud % | 2 | GFS 0.25° raw 0 | 2 | ±15 | ok |
| Denver | +114 h | pressure hPa | 1007.3 | GFS 0.25° raw 1006.7 | 0.5 | ±0.5 | **FAIL** |
| Denver | +114 h | temp °C | 13.4 | stored grid 13.3 | 0.0 | ±0.15 | ok |
| Denver | +114 h | wind km/h | 8.0 | stored grid 7.7 | 0.3 | ±1 | ok |
| Denver | +114 h | cloud % | 2 | stored grid 2 | 0 | ±1 | ok |
| Denver | +114 h | pressure hPa | 1007.25 | stored grid 1007.28 | -0.03 | ±0.1 | ok |
| London | +0 h | temp °C | 9.5 | GFS 0.25° raw 9.7 | -0.1 | ±0.7 | ok |
| London | +0 h | wind km/h | 9.0 | GFS 0.25° raw 6.5 | 2.4 | ±3 | ok |
| London | +0 h | wind from ° | 83 | GFS 0.25° raw 83 | 0 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 63 | GFS 0.25° raw 73 | -10 | ±15 | ok |
| London | +0 h | pressure hPa | 1030.9 | GFS 0.25° raw 1030.9 | -0.0 | ±0.5 | ok |
| London | +0 h | temp °C | 9.5 | stored grid 9.6 | -0.1 | ±0.15 | ok |
| London | +0 h | wind km/h | 9.0 | stored grid 9.2 | -0.2 | ±1 | ok |
| London | +0 h | cloud % | 63 | stored grid 62 | 0 | ±1 | ok |
| London | +0 h | pressure hPa | 1030.88 | stored grid 1030.90 | -0.02 | ±0.1 | ok |
| London | +0 h | temp °C | 9.5 | gfs_global 9.7 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 9.0 | gfs_global 6.2 | 2.8 | ±3 | ok |
| London | +0 h | wind from ° | 83 | gfs_global 83 | 0 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 63 | gfs_global 89 | -26 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.9 | gfs_global 1030.9 | -0.0 | ±1 | ok |
| London | +0 h | temp °C | 9.5 | gfs_seamless 9.7 | -0.2 | ±1 | ok |
| London | +0 h | wind km/h | 9.0 | gfs_seamless 6.2 | 2.8 | ±3 | ok |
| London | +0 h | wind from ° | 83 | gfs_seamless 83 | 0 | ±20 | ok |
| London | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +0 h | cloud % | 63 | gfs_seamless 89 | -26 | ±15 | **FAIL** |
| London | +0 h | pressure hPa | 1030.9 | gfs_seamless 1030.9 | -0.0 | ±1 | ok |
| London | +0 h | PM2.5 µg/m³ | 12.4 | cams_global 12.6 | -0.2 | ±3 | ok |
| London | +24 h | temp °C | 8.8 | GFS 0.25° raw 9.0 | -0.2 | ±0.7 | ok |
| London | +24 h | wind km/h | 6.7 | GFS 0.25° raw 4.9 | 1.8 | ±3 | ok |
| London | +24 h | wind from ° | 4 | GFS 0.25° raw 17 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | GFS 0.25° raw 5 | 0 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.2 | GFS 0.25° raw 1032.2 | 0.0 | ±0.5 | ok |
| London | +24 h | temp °C | 8.8 | stored grid 8.8 | -0.0 | ±0.15 | ok |
| London | +24 h | wind km/h | 6.7 | stored grid 6.8 | -0.2 | ±1 | ok |
| London | +24 h | cloud % | 5 | stored grid 5 | 0 | ±1 | ok |
| London | +24 h | pressure hPa | 1032.20 | stored grid 1032.19 | 0.01 | ±0.1 | ok |
| London | +24 h | temp °C | 8.8 | gfs_global 9.1 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 6.7 | gfs_global 4.9 | 1.8 | ±3 | ok |
| London | +24 h | wind from ° | 4 | gfs_global 17 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_global 11 | -6 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.2 | gfs_global 1032.2 | 0.0 | ±1 | ok |
| London | +24 h | temp °C | 8.8 | gfs_seamless 9.1 | -0.3 | ±1 | ok |
| London | +24 h | wind km/h | 6.7 | gfs_seamless 4.9 | 1.8 | ±3 | ok |
| London | +24 h | wind from ° | 4 | gfs_seamless 17 | — | ±20 | calm |
| London | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| London | +24 h | cloud % | 5 | gfs_seamless 11 | -6 | ±15 | ok |
| London | +24 h | pressure hPa | 1032.2 | gfs_seamless 1032.2 | 0.0 | ±1 | ok |
| London | +24 h | PM2.5 µg/m³ | 34.6 | cams_global 29.6 | 5.0 | ±3 | **FAIL** |
| London | +114 h | temp °C | 8.1 | GFS 0.25° raw 8.1 | -0.0 | ±0.7 | ok |
| London | +114 h | wind km/h | 15.3 | GFS 0.25° raw 13.3 | 2.0 | ±3 | ok |
| London | +114 h | wind from ° | 46 | GFS 0.25° raw 60 | 14 | ±20 | ok |
| London | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| London | +114 h | cloud % | 19 | GFS 0.25° raw 9 | 10 | ±15 | ok |
| London | +114 h | pressure hPa | 1031.8 | GFS 0.25° raw 1031.7 | 0.0 | ±0.5 | ok |
| London | +114 h | temp °C | 8.1 | stored grid 8.1 | 0.0 | ±0.15 | ok |
| London | +114 h | wind km/h | 15.3 | stored grid 15.4 | -0.1 | ±1 | ok |
| London | +114 h | cloud % | 19 | stored grid 19 | -0 | ±1 | ok |
| London | +114 h | pressure hPa | 1031.75 | stored grid 1031.74 | 0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 27.0 | GFS 0.25° raw 27.2 | -0.1 | ±0.7 | ok |
| Delhi | +0 h | wind km/h | 7.5 | GFS 0.25° raw 7.2 | 0.3 | ±3 | ok |
| Delhi | +0 h | wind from ° | 320 | GFS 0.25° raw 316 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 1 | GFS 0.25° raw 2 | -1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1018.8 | GFS 0.25° raw 1018.8 | -0.0 | ±0.5 | ok |
| Delhi | +0 h | temp °C | 27.0 | stored grid 27.0 | 0.0 | ±0.15 | ok |
| Delhi | +0 h | wind km/h | 7.5 | stored grid 7.6 | -0.1 | ±1 | ok |
| Delhi | +0 h | cloud % | 1 | stored grid 1 | -0 | ±1 | ok |
| Delhi | +0 h | pressure hPa | 1018.77 | stored grid 1018.78 | -0.01 | ±0.1 | ok |
| Delhi | +0 h | temp °C | 27.0 | gfs_global 27.3 | -0.3 | ±1 | ok |
| Delhi | +0 h | wind km/h | 7.5 | gfs_global 7.1 | 0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 320 | gfs_global 315 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 1 | gfs_global 0 | 1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1018.8 | gfs_global 1018.5 | 0.3 | ±1 | ok |
| Delhi | +0 h | temp °C | 27.0 | gfs_seamless 27.3 | -0.3 | ±1 | ok |
| Delhi | +0 h | wind km/h | 7.5 | gfs_seamless 7.1 | 0.4 | ±3 | ok |
| Delhi | +0 h | wind from ° | 320 | gfs_seamless 315 | — | ±20 | calm |
| Delhi | +0 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +0 h | cloud % | 1 | gfs_seamless 0 | 1 | ±15 | ok |
| Delhi | +0 h | pressure hPa | 1018.8 | gfs_seamless 1018.5 | 0.3 | ±1 | ok |
| Delhi | +0 h | PM2.5 µg/m³ | 11.9 | cams_global 27.7 | -15.8 | ±3 | **FAIL** |
| Delhi | +24 h | temp °C | 29.1 | GFS 0.25° raw 29.2 | -0.2 | ±0.7 | ok |
| Delhi | +24 h | wind km/h | 9.3 | GFS 0.25° raw 8.5 | 0.8 | ±3 | ok |
| Delhi | +24 h | wind from ° | 329 | GFS 0.25° raw 329 | 0 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | GFS 0.25° raw 1015.6 | -0.0 | ±0.5 | ok |
| Delhi | +24 h | temp °C | 29.1 | stored grid 29.1 | -0.0 | ±0.15 | ok |
| Delhi | +24 h | wind km/h | 9.3 | stored grid 9.0 | 0.3 | ±1 | ok |
| Delhi | +24 h | cloud % | 0 | stored grid 0 | -0 | ±1 | ok |
| Delhi | +24 h | pressure hPa | 1015.55 | stored grid 1015.56 | -0.01 | ±0.1 | ok |
| Delhi | +24 h | temp °C | 29.1 | gfs_global 29.3 | -0.2 | ±1 | ok |
| Delhi | +24 h | wind km/h | 9.3 | gfs_global 8.2 | 1.1 | ±3 | ok |
| Delhi | +24 h | wind from ° | 329 | gfs_global 331 | 2 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_global 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_global 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_global 1015.2 | 0.4 | ±1 | ok |
| Delhi | +24 h | temp °C | 29.1 | gfs_seamless 29.3 | -0.2 | ±1 | ok |
| Delhi | +24 h | wind km/h | 9.3 | gfs_seamless 8.2 | 1.1 | ±3 | ok |
| Delhi | +24 h | wind from ° | 329 | gfs_seamless 331 | 2 | ±20 | ok |
| Delhi | +24 h | precip mm/h | 0.00 | gfs_seamless 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +24 h | cloud % | 0 | gfs_seamless 0 | 0 | ±15 | ok |
| Delhi | +24 h | pressure hPa | 1015.6 | gfs_seamless 1015.2 | 0.4 | ±1 | ok |
| Delhi | +24 h | PM2.5 µg/m³ | 35.2 | cams_global 51.9 | -16.7 | ±3 | **FAIL** |
| Delhi | +114 h | temp °C | 23.2 | GFS 0.25° raw 24.6 | -1.5 | ±0.7 | **FAIL** |
| Delhi | +114 h | wind km/h | 2.1 | GFS 0.25° raw 1.6 | 0.5 | ±3 | ok |
| Delhi | +114 h | wind from ° | 95 | GFS 0.25° raw 87 | — | ±20 | calm |
| Delhi | +114 h | precip mm/h | 0.00 | GFS 0.25° raw 0.00 | 0.00 | ±0.3 | ok |
| Delhi | +114 h | cloud % | 0 | GFS 0.25° raw 0 | 0 | ±15 | ok |
| Delhi | +114 h | pressure hPa | 1014.1 | GFS 0.25° raw 1014.0 | 0.1 | ±0.5 | ok |
| Delhi | +114 h | temp °C | 23.2 | stored grid 23.2 | 0.0 | ±0.15 | ok |
| Delhi | +114 h | wind km/h | 2.1 | stored grid 1.9 | 0.2 | ±1 | ok |
| Delhi | +114 h | cloud % | 0 | stored grid 0 | 0 | ±1 | ok |
| Delhi | +114 h | pressure hPa | 1014.06 | stored grid 1014.07 | -0.01 | ±0.1 | ok |

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See `docs/data-pipeline.md` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
| Kansas City MO | +0 h | 17.17 | 17.09 | 0.07 | 8.6 | 6.4 | 2.2 | 100 | 100 |
| Kansas City MO | +24 h | 13.95 | 14.23 | -0.28 | 10.2 | 9.7 | 0.5 | 67 | 56 |
| Kansas City MO | +114 h (f120) | 12.74 | 12.82 | -0.08 | 5.9 | 6.0 | -0.2 | 7 | 5 |
| Miami | +0 h | 26.49 | 26.99 | -0.50 | 18.9 | 20.6 | -1.7 | 6 | 3 |
| Miami | +24 h | 26.26 | 26.57 | -0.30 | 27.0 | 29.1 | -2.1 | 100 | 100 |
| Miami | +114 h (f120) | 24.77 | 25.11 | -0.34 | 23.5 | 28.4 | -4.9 | 88 | 100 |
| Denver | +0 h | 9.44 | 12.65 | -3.22 | 3.4 | 1.7 | 1.7 | 100 | 100 |
| Denver | +24 h | 9.18 | 13.38 | -4.20 | 4.1 | 4.2 | -0.1 | 96 | 100 |
| Denver | +114 h (f120) | 13.33 | 16.12 | -2.79 | 7.7 | 7.6 | 0.1 | 2 | 0 |
| London | +0 h | 9.58 | 9.67 | -0.09 | 9.2 | 6.5 | 2.6 | 62 | 73 |
| London | +24 h | 8.82 | 8.99 | -0.17 | 6.8 | 4.9 | 1.9 | 5 | 5 |
| London | +114 h (f120) | 8.07 | 8.10 | -0.03 | 15.4 | 13.3 | 2.1 | 19 | 9 |
| Delhi | +0 h | 26.96 | 27.16 | -0.19 | 7.6 | 7.2 | 0.4 | 1 | 2 |
| Delhi | +24 h | 29.11 | 29.25 | -0.14 | 9.0 | 8.5 | 0.5 | 0 | 0 |
| Delhi | +114 h (f120) | 23.16 | 24.64 | -1.49 | 1.9 | 1.6 | 0.3 | 0 | 0 |

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
| Tokyo Bay | +0 h | temp | 22.00 | 21.97 | 0.03 | ±0.5 | ok |
| Tokyo Bay | +0 h | pres | 1010.30 | 1010.29 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +0 h | cloud | 43.00 | 42.96 | 0.04 | ±1 | ok |
| Chile coast | +0 h | temp | 12.60 | 12.58 | 0.02 | ±0.5 | ok |
| Chile coast | +0 h | pres | 1013.00 | 1013.00 | 0.00 | ±0.5 | ok |
| Chile coast | +0 h | cloud | 100.00 | 99.99 | 0.01 | ±1 | ok |
| Kansas City | +0 h | temp | 17.40 | 17.36 | 0.04 | ±0.5 | ok |
| Kansas City | +0 h | pres | 1021.20 | 1021.17 | 0.03 | ±0.5 | ok |
| Kansas City | +0 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Tokyo Bay | +24 h | temp | 16.80 | 16.81 | -0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | pres | 1017.70 | 1017.69 | 0.01 | ±0.5 | ok |
| Tokyo Bay | +24 h | cloud | 88.00 | 88.13 | -0.13 | ±1 | ok |
| Chile coast | +24 h | temp | 11.60 | 11.62 | -0.02 | ±0.5 | ok |
| Chile coast | +24 h | pres | 1016.10 | 1016.09 | 0.01 | ±0.5 | ok |
| Chile coast | +24 h | cloud | 91.00 | 90.81 | 0.19 | ±1 | ok |
| Kansas City | +24 h | temp | 13.40 | 13.43 | -0.03 | ±0.5 | ok |
| Kansas City | +24 h | pres | 1021.50 | 1021.51 | -0.01 | ±0.5 | ok |
| Kansas City | +24 h | cloud | 37.00 | 37.33 | -0.33 | ±1 | ok |
| Tokyo Bay | +114 h | temp | 13.20 | 13.24 | -0.04 | ±0.5 | ok |
| Tokyo Bay | +114 h | pres | 1022.30 | 1022.32 | -0.02 | ±0.5 | ok |
| Tokyo Bay | +114 h | cloud | 100.00 | 100.00 | 0.00 | ±1 | ok |
| Chile coast | +114 h | temp | 10.80 | 10.80 | -0.00 | ±0.5 | ok |
| Chile coast | +114 h | pres | 1018.40 | 1018.42 | -0.02 | ±0.5 | ok |
| Chile coast | +114 h | cloud | 2.00 | 1.61 | 0.39 | ±1 | ok |
| Kansas City | +114 h | temp | 12.60 | 12.60 | -0.00 | ±0.5 | ok |
| Kansas City | +114 h | pres | 1014.30 | 1014.34 | -0.04 | ±0.5 | ok |
| Kansas City | +114 h | cloud | 19.00 | 18.53 | 0.47 | ±1 | ok |

## Air quality at 4° grid nodes

Pass/fail: page vs the pm2_5 the data job downloaded for that hour (`aq/nodes.json`). For information: page vs the CAMS forecast Open-Meteo serves at test time. These differ when the air-quality files were built from an earlier CAMS run; the files shown were built 2026-10-31T05:23:18Z (1.5 h before this check), valid hour 2026-10-31T06:00:00Z.

| Node | Time | Page PM2.5 | Downloaded | Diff | Tol | | CAMS now | Page − now |
|---|---|---|---|---|---|---|---|---|
| node 28N 76E (Delhi) | +0 h | 7.30 | — | — | ±0.2 | not recorded by this build | 7.30 | 0.00 |
| node 52N 0E (London) | +0 h | 12.80 | — | — | ±0.2 | not recorded by this build | 12.80 | 0.00 |
| node 40N 116E (Beijing) | +0 h | 19.70 | — | — | ±0.2 | not recorded by this build | 19.70 | 0.00 |

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: 2024 24-h mean** (total absolute difference {"2024 hourly":151,"2024 24-h mean":10,"2012 hourly":167,"2012 24-h mean":49}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
| Kansas City MO | 11.6 | 14.5 | 60 | 56 | 61 | 48 | 56 |
| Miami | 3.7 | 5.8 | 35 | 21 | 32 | 15 | 24 |
| Denver | 24.4 | 18.1 | 67 | 80 | 68 | 77 | 63 |
| London | 12.6 | 9.5 | 51 | 58 | 52 | 52 | 39 |
| Delhi | 27.7 | 40.8 | 112 | 86 | 114 | 84 | 114 |
| node 28N 76E (Delhi) | 7.3 | 29.4 | 89 | 41 | 89 | 30 | 87 |
| node 52N 0E (London) | 12.8 | 7.7 | 43 | 58 | 43 | 52 | 32 |
| node 40N 116E (Beijing) | 19.7 | 31.8 | 95 | 71 | 93 | 67 | 92 |

## Probe text at +0 h (what a user sees when hovering)

| City | temp | wind | rain | cloud | pres | aq |
|---|---|---|---|---|---|---|
| Kansas City MO | 17 °Cat 2 m·39.1°N 94.5°W | 9 km/hfrom WNW·39.1°N 94.5°W | 0.3 mm/hpast hour · area avg·39.1°N 94.5°W | 100 %area average·39.1°N 94.5°W | 1021 hPasea level·39.1°N 94.5°W | 9.6 µg/m³Moderate · AQI 56 (24 h)·39.1°N 94.5°W |
| Miami | 26 °Cat 2 m·25.7°N 80.1°W | 19 km/hfrom E·25.7°N 80.1°W | 0.1 mm/hpast hour · area avg·25.7°N 80.1°W | 6 %area average·25.7°N 80.1°W | 1016 hPasea level·25.7°N 80.1°W | 10 µg/m³Moderate · AQI 45 (24 h)·25.7°N 80.1°W |
| Denver | 9 °Cat 2 m·39.7°N 104.9°W | 3 km/hfrom NNE·39.7°N 104.9°W | Drypast hour · area avg·39.7°N 104.9°W | 100 %area average·39.7°N 104.9°W | 1014 hPasea level·39.7°N 104.9°W | 1.4 µg/m³Good · AQI 50 (24 h)·39.7°N 104.9°W |
| London | 10 °Cat 2 m·51.5°N 0.1°W | 9 km/hfrom E·51.5°N 0.1°W | Drypast hour · area avg·51.5°N 0.1°W | 63 %area average·51.5°N 0.1°W | 1031 hPasea level·51.5°N 0.1°W | 12 µg/m³Moderate · AQI 41 (24 h)·51.5°N 0.1°W |
| Delhi | 27 °Cat 2 m·28.6°N 77.2°E | 8 km/hfrom NW·28.6°N 77.2°E | Drypast hour · area avg·28.6°N 77.2°E | 1 %area average·28.6°N 77.2°E | 1019 hPasea level·28.6°N 77.2°E | 12 µg/m³Moderate · AQI 91 (24 h)·28.6°N 77.2°E |
