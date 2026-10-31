# Sources and licences register

Every external host or dataset the site touches is listed here, with its licence, the
credit we show, and anything still unverified. **Add a row before adding a source.**

Rules (all phases): no keys or tokens; a licence that clearly allows this use; the
required credit visible on the map whenever the source is on screen.

Status as of Phase 1 (foundation).

## In use

| Source | Used for | Host(s) | Licence / terms | Credit shown | Status |
|---|---|---|---|---|---|
| **OpenFreeMap** (OpenMapTiles schema, planet) | Dark and Light basemaps (vector tiles, label glyphs) | `tiles.openfreemap.org` | Free, no key, no registration, no usage limits (openfreemap.org). Data © OpenStreetMap contributors, **ODbL 1.0**. OpenMapTiles schema/design **CC BY 4.0**. | "OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors" | Host blocked in the build environment: styles were validated against the MapLibre style spec and rendered against mock tiles only. Confirm the live TileJSON (`/planet`) exposes the layers used (`water, park, landuse, waterway, building, transportation, transportation_name, boundary, place`) and that the `Noto Sans Regular` / `Noto Sans Bold` font stacks exist. |
| **OpenStreetMap** | Underlying basemap data | (via OpenFreeMap) | ODbL 1.0 | "© OpenStreetMap contributors" linked to osm.org/copyright | Always shown. |
| **Natural Earth** 1:110m land + countries (via `world-atlas@2.0.2`) | Coastlines, land tint and country borders over the weather field at low zoom | none: committed in `site/data/` (built by `scripts/build_coastlines.py`) | Public domain. world-atlas packaging ISC. | "Natural Earth" | Verified (built locally from the npm package). |
| **NASA GIBS**: `VIIRS_SNPP_CorrectedReflectance_TrueColor` | Satellite basemap, world to regional zoom | `gibs.earthdata.nasa.gov` | NASA imagery: no restrictions on use. GIBS asks for an acknowledgement. | "Imagery: NASA GIBS / ESDIS (VIIRS SNPP)" | **Unverified** (host blocked). See [Satellite zoom levels](#satellite-zoom-levels). |
| **EOX Sentinel-2 cloudless 2016** (`s2cloudless_3857`) | Satellite basemap, regional to city zoom, worldwide | `tiles.maps.eox.at` | **CC BY 4.0** for the 2016 mosaic. | "Sentinel-2 cloudless (s2maps.eu) by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017)" | **Unverified** (host blocked). See [EOX licence](#eox-licence--owner-decision-needed). |
| **USGS The National Map: Imagery Only** (mostly USDA NAIP) | Satellite basemap, street zoom up to level 16, contiguous US only | `basemap.nationalmap.gov` | US Government work: public domain. | "Imagery: USGS The National Map (USDA NAIP)" | Keyless and CORS-enabled (CI probe, 30 Oct 2026). Cached only to web tile level 16 (1:9,028), which is map zoom 15 on this site: requests for levels 17–19 return no tile, although the service lists levels up to 23. Alaska, Hawaii and Puerto Rico are not enabled (see below). |
| **USGS The National Map: NAIP Plus** (`USGSNAIPPlus` ImageServer: USDA NAIP plus state high-resolution orthoimagery) | Satellite basemap from map zoom 15 (where the cached layer runs out), contiguous US only (dynamic: one `exportImage` per 512 px tile) | `imagery.nationalmap.gov` | US Government work: public domain. Service copyright text: "USGS, USDA, The National Map: Orthoimagery". | "Imagery: USGS The National Map NAIP Plus (USDA NAIP, state orthoimagery)" | Keyless, CORS `*`, MapLibre draws it with `{bbox-epsg-3857}` (CI probe, 30 Oct 2026). WMS is not enabled. At Brantley AL the image is NAIP 0.6 m, 28 May 2023, and differs in season from the cached level-16 layer. See `docs/screenshots/satellite-zoom/report.md`. |
| **MapLibre GL JS 5.24.0** | Map renderer | `cdn.jsdelivr.net` (pinned, SRI) | BSD-3-Clause | "MapLibre" | SRI hash computed from the npm tarball. CI re-checks it against jsDelivr (`check_site.py --verify-sri`). |
| **IBM Plex Sans Condensed, IBM Plex Mono** | UI type | none: self-hosted in `site/fonts/` (from `@fontsource` 5.3.0) | SIL OFL 1.1 (licence files alongside) | (not required on the map) | Verified. Self-hosted so visitors' IPs are not sent to a font CDN. |
| **NOAA/NCEP GFS 0.25°** | Wind, temperature, precipitation, clouds, pressure (f000–f048 hourly) | `nomads.ncep.noaa.gov` (grib filter, primary), `noaa-gfs-bdp-pds.s3.amazonaws.com` (AWS Open Data mirror, fallback); fetched by the data job only, never by visitors | U.S. Government work: public domain / no restrictions. NOAA asks for attribution. | "Weather: NOAA/NCEP GFS" | **Terms wording unverified**: noaa.gov, NOMADS and registry.opendata.aws were unreachable from the build environment. The AWS mirror was used and tested; NOMADS is first exercised in the Actions run. Confirm the exact credit line NOAA requests. |
| **CAMS global** (Copernicus) **via Open-Meteo Air Quality API** | Air quality: PM2.5 (shown), PM10, US AQI; 4° grid, 3,870 locations per refresh, ~7,740 calls/day | `air-quality-api.open-meteo.com` (data job only) | Open-Meteo data CC BY 4.0; free tier for non-commercial use (< 10,000 calls/day, 5,000/hour, 600/minute per the brief). Copernicus data licence asks for a "Generated using Copernicus Atmosphere Monitoring Service information" statement. | "Air quality: CAMS via Open-Meteo.com (CC BY 4.0)" | **Unverified from the build environment** (host blocked): exact attribution wording, whether multi-location requests count one call per location (assumed: the job counts locations), and global `pm2_5` coverage. The Actions run reports measured counts and coverage. |
| **ECMWF IFS 0.25° via Open-Meteo Forecast API** | Spot check only (3 cities, once per run); not shown on the map | `api.open-meteo.com` (data job only) | CC BY 4.0 (Open-Meteo) | n/a (not displayed) | 3 calls per run. |
| **wgrib2 v3.8.0** (NOAA-EMC) | GRIB2 decoding in the data job | built from `github.com/NOAA-EMC/wgrib2`, pinned tag + commit | Public domain (U.S. Government work) | n/a | Verified: builds from the pinned commit and decodes GFS template 5.3. |
| **Sample weather** (fallback) | Shown only when no live data exists | none: generated in the browser | n/a | "Weather: generated sample data" | Labelled everywhere when active. |

## Events layer (Phase 5)

All four sources are fetched **by the visitor's browser**, only while a toggle that needs them is
on, at most once every 10 minutes per source, and kept in memory only (nothing stored, nothing
proxied). CORS, status and field names were checked from GitHub Actions by
`scripts/data/sources-probe.mjs` (the build environment cannot reach these hosts); the latest run's
report is committed as `docs/screenshots/<branch>/sources-probe.md`.

| Source | Used for | Endpoint | Licence / terms | Credit shown | CORS | Rate limit | Status |
|---|---|---|---|---|---|---|---|
| **USGS Earthquake Hazards Program**, GeoJSON summary feed | Earthquakes M2.5+, past 7 days | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson` | USGS: "Public Domain" (with exceptions for marked third-party material); USGS asks that "proper credit be given" (usgs.gov copyrights-and-credits page, read by the probe 31 Oct 2026). | "Earthquakes: USGS" | `Access-Control-Allow-Origin: *` | None published; feed docs say "Updated every minute", `cache-control: public, max-age=60`. | Verified 31 Oct 2026: HTTP 200, 338 features, fields `mag, place, time, updated, url, alert, tsunami, magType, title`; coordinates `[lon, lat, depth km]`. |
| **NASA EONET v3** | Wildfires, volcanoes, severe storms (open events with a report in the past 7 days) | `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7` | NASA data; EONET aggregates other agencies' reports (InciWeb, Smithsonian GVP, JTWC, …), each linked as the event's source. Disclaimer wording: see the probe report (`what-is-eonet#disclaimer`). | "Events: NASA EONET" | `Access-Control-Allow-Origin: *` | Response headers: `x-ratelimit-limit: 60` (window not stated). This page makes ≤ 1 request per 10 min. | Verified 31 Oct 2026: HTTP 200 (content-type says RSS, body is JSON), 15 events; fields `id, title, link, categories, sources, geometry[{date, coordinates, magnitudeValue, magnitudeUnit}]`. Other categories (sea ice, floods, dust…) are not shown. |
| **GDACS** (Global Disaster Alert and Coordination System; EC Joint Research Centre with UN OCHA) | Disaster alerts (green / orange / red): earthquakes, cyclones, floods, volcanoes, droughts, wildfires | `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=…&toDate=…&alertlevel=Green;Orange;Red&pageSize=100` | "GDACS specific Disclaimer and Terms of Use" (`/About/termofuse.aspx`, read 31 Oct 2026): GDACS is "a cooperation framework among United Nations (OCHA … and UNOSAT …) and the European Commission (JRC … and ECHO …)"; data "provided 'as is' without warranty"; "this information is purely indicative and should not be used for any decision making without alternate sources of information". The page states **no reuse licence**; the footer's Copyright link is the European Commission legal notice (not read). **Owner check:** reuse of the public API with credit appears intended but is not stated in a licence; the panel shows GDACS's own caveat. | "Alerts: GDACS (EC JRC, UN OCHA)" | `Access-Control-Allow-Origin: *` | Not published; the API returns at most 100 events per page (newest first), so a busy week can be cut at 100. | Verified 31 Oct 2026: HTTP 200 GeoJSON points. The `MAP` list needs an `eventtype` and was not used. |
| **NOAA National Hurricane Center** via the NWS tropical map service | Active storms (Atlantic, East and Central Pacific): forecast points, track and cone, moved along the track by the timeline | `https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/{6 + 26 i}/query?…&f=geojson` (Forecast Points, slots AT1–5, EP1–5, CP1–5) and `{8 + 26 i}` (Forecast Cone) | NWS: "in the public domain, unless specifically noted otherwise, and may be used without charge for any lawful purpose so long as you do not: 1) claim it is your own…" (weather.gov/disclaimer). | "Storm forecasts: NOAA NHC" | Echoes the requesting origin (`https://temper31.github.io`) | Not published. Up to 15 small queries (plus one cone per active storm) per refresh, ≤ every 10 min. | Verified 31 Oct 2026: layer list and fields (`stormname, stormtype, advisnum, advdate, tau, validtime "DD/HHMM", maxwind kt, gust kt, mslp, tcdir, tcspd`). No storm was active, so the track was tested with a saved sample. `CurrentStorms.json` has **no** CORS header and was not used. |

Not used (out of scope for Phase 5): **NASA FIRMS** active fires (needs a free MAP_KEY: a key in
the page would break the no-keys rule, so it would have to be fetched by the data job with the key
in an Actions secret, and the 6-hourly job would make it up to 6 h old); **JTWC** West Pacific /
Indian Ocean warnings (US DoD site: terms, CORS and a machine-readable format still to check;
EONET already relays JTWC storm positions as "severe storms").

## EOX licence: owner decision needed

EOX publishes Sentinel-2 cloudless under two different licences:

- **2016 mosaic** (`s2cloudless_3857`): **CC BY 4.0**. This is what the site uses now.
- **2018 and later mosaics** (e.g. `s2cloudless-2024_3857`): **CC BY-NC-SA 4.0**. These are free for
  non-commercial use only, and carry a **ShareAlike** clause.

Before switching to a newer mosaic, **the project owner must confirm** that CC BY-NC-SA 4.0
fits this project. That includes the NonCommercial term (the code is MIT, so forks could be
commercial) and the ShareAlike clause (what counts as adapted material when tiles are shown
under a weather overlay). This register records the question; it does not make a legal judgement.
The switch is one line in `site/js/config.js` (tile URL plus the year in the credit).

## Satellite zoom levels

The three satellite hosts were blocked by the build environment's network policy, so the
values below come from each provider's published documentation and are **not verified**
against live capabilities. MapLibre overzooms above a source's `maxzoom`, so a wrong value
shows blurrier tiles rather than blank ones.

| Source | Tile size | Source `maxzoom` (tile z) | Shown at map zoom | Cross-fade | To verify |
|---|---|---|---|---|---|
| GIBS VIIRS true colour (`GoogleMapsCompatible_Level9`) | 256 | 9 | 0 to 7 | base layer (opaque) | `…/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml`: confirm the layer, the Level9 matrix set and a valid previous-day date. |
| EOX s2cloudless 2016 (`GoogleMapsCompatible`, id `g`) | 256 | 14 | 4.5 and up | fades in 5 to 6.5 | `https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml`: confirm the layer id `s2cloudless_3857`, the matrix set id `g` and the deepest level (expected around 14 to 15 for 10 m data). |
| USGS Imagery Only | 256 | 16 | 11 and up, inside the CONUS bounds | fades in 11.5 to 13 | `…/USGSImageryOnly/MapServer?f=json`: read `tileInfo.lods` for the deepest cached level and `fullExtent`. |

Map zoom uses 512 px units, so a 256 px source requests tile zoom = map zoom + 1. The test
harness confirmed the hand-off logic with stand-in tiles. GIBS was requested at tile z2 to z7
only, EOX at tile z7 to z14 (overzoomed at street level), and USGS only at map z ≥ 11 inside the
US. No satellite host was contacted before Satellite was selected, and none after switching away
(the sources and their tile caches are removed).

**USGS coverage outside CONUS.** The source is limited with `bounds: [-124.85, 24.4, -66.88, 49.39]`.
That box also covers slivers of Canada and Mexico, where the service may return coarser or
blank tiles; the EOX layer stays underneath, so the worst case is a visible seam. Alaska,
Hawaii and Puerto Rico are **not enabled**: NAIP coverage there is partial or absent, and the
service's behaviour there could not be checked. Enable each with its own bounds only after a
visual check.

## Deferred (not used)

| Provider | Why deferred |
|---|---|
| Esri World Imagery (`server.arcgisonline.com`) | Needs an ArcGIS account/key for most uses; terms unclear for this project. |
| MapTiler | Requires an API key. |
| Mapbox | Requires an access token. |
| Google Maps / Bing | Keys and restrictive terms. |
| CARTO basemaps | Terms limit free use; OpenFreeMap covers the need without a key. |
| OSM's own tile server (`tile.openstreetmap.org`) | Usage policy discourages heavy app traffic; OpenFreeMap is designed for it. |

`scripts/check_site.py` fails the build if any of these hosts appears in `site/`.

## Planned (later phases, not yet used)

Street-level photos (Mapillary, Phase 4). NASA FIRMS and JTWC: see the Events section. Each gets
a row above, with its licence checked, before it ships.
