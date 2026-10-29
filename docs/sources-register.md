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
| **USGS The National Map: Imagery Only** (mostly USDA NAIP) | Satellite basemap, street zoom, contiguous US only | `basemap.nationalmap.gov` | US Government work: public domain. | "Imagery: USGS The National Map (USDA NAIP)" | **Unverified** (host blocked). Alaska, Hawaii and Puerto Rico are not enabled (see below). |
| **MapLibre GL JS 5.24.0** | Map renderer | `cdn.jsdelivr.net` (pinned, SRI) | BSD-3-Clause | "MapLibre" | SRI hash computed from the npm tarball. CI re-checks it against jsDelivr (`check_site.py --verify-sri`). |
| **IBM Plex Sans Condensed, IBM Plex Mono** | UI type | none: self-hosted in `site/fonts/` (from `@fontsource` 5.3.0) | SIL OFL 1.1 (licence files alongside) | (not required on the map) | Verified. Self-hosted so visitors' IPs are not sent to a font CDN. |
| **Weather fields** | All six fields, wind particles | none: generated in the browser | n/a | "**Weather: generated sample data**" | Sample data only in Phase 1. Real sources (GFS, CAMS) arrive in Phase 2. |

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

GFS 0.25° (NOAA), CAMS PM2.5 (Copernicus), USGS earthquakes, NASA FIRMS fires, GDACS/JTWC
cyclones, street-level photos (provider and terms to be confirmed). Each gets a row above,
with its licence checked, before it ships.
