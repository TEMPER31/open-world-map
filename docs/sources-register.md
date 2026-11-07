# Sources and licences register

Status as of Phase 6 (launch preparation). This register records the services, datasets
and bundled assets used by the map and its data job. The [privacy draft](privacy-draft.md)
lists browser hosts, including click-only credit and source links. Add a row before adding
a source.

## Map and basemaps

| Source | Host or delivery | Licence or terms | Credit as displayed | When it loads |
|---|---|---|---|---|
| GitHub Pages | `temper31.github.io` | GitHub Pages hosting terms apply. The project code is MIT. Data retain their source terms. | — | Every published visit. Same-origin assets and forecast files load as needed. |
| MapLibre GL JS 5.24.0 | `cdn.jsdelivr.net` | BSD-3-Clause | MapLibre | JS and CSS on every visit, pinned with SRI. |
| OpenFreeMap | `tiles.openfreemap.org` | Keyless public service. Its tiles use OpenMapTiles and OpenStreetMap data under the terms below. | OpenFreeMap | Preconnect, TileJSON, vector tiles and glyphs on a normal visit with any basemap. |
| OpenMapTiles | Via OpenFreeMap | OpenMapTiles schema and design, CC BY 4.0 | © OpenMapTiles | As part of the vector basemap. |
| OpenStreetMap | Via OpenFreeMap | ODbL 1.0 | Data © OpenStreetMap contributors | As part of the vector basemap. |
| Natural Earth 1:110m | Same-origin GeoJSON in `site/data/`, converted from `world-atlas@2.0.2` | Public domain. The world-atlas packaging is ISC. | Natural Earth | Land, coastlines and borders are registered in the map style on every visit. |
| IBM Plex Sans Condensed and IBM Plex Mono | Same-origin fonts in `site/fonts/` | SIL OFL 1.1. Licence files ship beside the fonts. | — | UI fonts on every visit. |
| NASA GIBS VIIRS true colour | `gibs.earthdata.nasa.gov` | NASA imagery has no restrictions on use. GIBS requests acknowledgement. | Imagery: NASA GIBS / ESDIS (VIIRS SNPP) | Satellite at world and regional zoom, below configured map zoom 7. |
| EOX Sentinel-2 cloudless 2016 | `tiles.maps.eox.at` | CC BY 4.0 for the 2016 mosaic | Sentinel-2 cloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017) | Satellite from configured map zoom 4.5 worldwide. |
| USGS The National Map Imagery Only | `basemap.nationalmap.gov` | U.S. Government work, public domain | Imagery: USGS The National Map (USDA NAIP) | Satellite from map zoom 11 within the contiguous-US source bounds. |
| USGS The National Map NAIP Plus | `imagery.nationalmap.gov` | U.S. Government work, public domain. Service credit is “USGS, USDA, The National Map: Orthoimagery.” | Imagery: USGS The National Map NAIP Plus (USDA NAIP, state orthoimagery) | Satellite from map zoom 15 within the same bounds. One image export per 512 px tile. |

The three OpenFreeMap credit fragments appear together as “OpenFreeMap · © OpenMapTiles ·
Data © OpenStreetMap contributors”. The style requests Noto Sans glyphs through OpenFreeMap.
The licence of the served glyph bundle was not independently verified.

The owner has selected the EOX 2016 mosaic. Newer EOX mosaics use CC BY-NC-SA 4.0.
The USGS source bounds are `[-124.85, 24.4, -66.88, 49.39]` and can include slivers of
Canada and Mexico. Alaska, Hawaii and Puerto Rico are outside those bounds. Imagery Only
has cached tiles through tile zoom 16. The map can overzoom those tiles, with NAIP Plus
fading in at street zoom. The browser keeps EOX beneath the USGS layers.

## Forecasts and processing

| Source | Host or delivery | Licence or terms | Credit as displayed | When it loads |
|---|---|---|---|---|
| NOAA/NCEP GFS 0.25° | `nomads.ncep.noaa.gov` and `noaa-gfs-bdp-pds.s3.amazonaws.com` in the data job | U.S. Government work, public domain. NOAA requests attribution. Exact terms wording was not independently rechecked. | Weather: NOAA/NCEP GFS | The job downloads 137 frames, hourly f000–f120 and three-hourly f123–f168. Same-cycle fallback is per hour. The browser reads processed wind, temperature, rain, cloud and pressure frames from the site origin as needed. |
| CAMS global via Open-Meteo Air Quality API | `air-quality-api.open-meteo.com` in the data job | Open-Meteo data CC BY 4.0, free tier for non-commercial use. Copernicus requests a “Generated using Copernicus Atmosphere Monitoring Service information” acknowledgement. Exact attribution terms were not independently rechecked. | Air quality: CAMS via Open-Meteo.com (CC BY 4.0) | The job refreshes the 4° grid of 3,870 locations when due (typically about 7,740 location-calls per day) and probes forecast range at three points per run. The browser reads processed PM2.5, PM10 and U.S. AQI frames from the site origin as needed. |
| ECMWF IFS 0.25° via Open-Meteo Forecast API | `api.open-meteo.com` in the data job | CC BY 4.0 (Open-Meteo) | — | Three-city comparison in the data job. The comparison is absent from the map. |
| wgrib2 v3.8.0 (NOAA-EMC) | `github.com/NOAA-EMC/wgrib2` at build time | Public domain (U.S. Government work) | — | GRIB2 decoding in the job. Built from a pinned tag and commit when the cached tool is unavailable. |
| Generated sample weather | Generated in the browser | Project code under MIT | Weather: generated sample data | Fallback when the site cannot load a live manifest. |

The credits strip shows GFS and CAMS when the live manifest loads, or the sample credit
when the map is using generated data. The [data pipeline notes](data-pipeline.md) cover
the display grids, timing, file formats and fallback behaviour.

## Events

Each feed loads while a matching event toggle is on, at most once per 10 minutes per
source. The browser keeps the results in memory. Opening a source link is a separate action.

| Source | Host | Licence or terms | Credit as displayed | When it loads |
|---|---|---|---|---|
| USGS Earthquake Hazards Program | `earthquake.usgs.gov` | Public domain except marked third-party material. USGS requests credit. | Earthquakes: USGS | Earthquakes on. M2.5+ GeoJSON for the past seven days. |
| NASA EONET v3 | `eonet.gsfc.nasa.gov` | NASA data. EONET aggregates reports from other agencies and links to their source material. | Events: NASA EONET | Wildfires & volcanoes or Storms on. Open events with reports in the past seven days. The map selects wildfires, volcanoes and severe storms. |
| GDACS (Global Disaster Alert and Coordination System) | `www.gdacs.org` | No published reuse licence. Kept with credit by owner decision. GDACS describes its alerts as indicative and advises checking alternate sources. | Alerts: GDACS (EC JRC, UN OCHA) | Disaster alerts on. Up to 100 alerts for earthquakes, cyclones, floods, volcanoes, droughts and wildfires. |
| NOAA National Hurricane Center via NWS tropical map service | `mapservices.weather.noaa.gov` | NWS public domain unless specifically marked otherwise. Credit NOAA NHC. | Storm forecasts: NOAA NHC | Storms on. Forecast points for up to 15 Atlantic, East Pacific and Central Pacific storm slots, plus a cone query per active storm. |

## Street photos

| Source | Host | Licence or terms | Credit as displayed | When it loads |
|---|---|---|---|---|
| Mapillary | `tiles.mapillary.com`, `graph.mapillary.com` and the thumbnail host returned in `thumb_1024_url` (expected `*.fbcdn.net`, unverified) | User content is CC BY-SA 4.0 unless otherwise stated. Mapillary's terms require a visible Mapillary logo linked to its homepage for API or vector tile integrations. | Street photos: © Mapillary contributors, CC BY-SA 4.0, with “© Mapillary” linked to the Mapillary homepage. The photo panel adds “CC BY-SA 4.0 — Mapillary / {creator}” with “Mapillary” linked to the homepage, and an “Open on Mapillary” link. The Mapillary logo, linked to the homepage, is added to both once the official logo file is in the site. | Coverage tiles while Street photos is on with a configured client token. A dot or sequence selection fetches photo metadata from Graph when needed. The thumbnail loads when the panel displays it. |

The deploy job injects the public client token from the Actions secret
`MAPILLARY_CLIENT_TOKEN`. The data job's copy is empty. Pull request browser tests can use
the separate `MAPILLARY_CI_TOKEN` secret. The generated client module is ignored by Git.
A missing token, rejection or rate limit can show the unavailable state. The audit notes
the published 50,000-tile daily budget per app and leaves domain restriction to the owner
to verify (D5).

## Pending front-end changes

- I7: The Mapillary credit is linked text today. The linked logo appears once the owner adds the
  official file `site/img/mapillary-logo.svg` and sets `MAPILLARY_LOGO` in `site/js/config.js`
  (`scripts/check_site.py` fails while the two disagree).

## Deferred sources

Esri World Imagery, MapTiler, Mapbox, Google Maps, Bing, CARTO, the OpenStreetMap tile
service, NASA FIRMS and a direct JTWC feed are outside this build.
