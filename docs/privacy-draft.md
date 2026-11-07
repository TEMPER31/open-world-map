# Privacy draft

Open World Map runs without accounts, analytics, tracking cookies or ads. Your browser keeps
map preferences in local storage, including units, basemap, and which layers are on. A saved
choice can enable a layer when you return. Event results and photo metadata are cached in
memory while the map is open.

Servers you contact receive your IP address and the request details, which can include your
browser's user agent. The page uses `strict-origin-when-cross-origin`. An HTTPS third-party
request can carry the site's origin as a referrer, while a same-origin request can carry the
page URL. The browser omits URL fragments, including the map hash, from referrers. The
Mapillary thumbnail image explicitly omits the referrer.

## Requests made by the map

| Service | When | Request details |
|---|---|---|
| GitHub Pages | Every visit to the published site. The map requests forecast files and other assets as needed. | Page URL and paths for scripts, worker modules, styles, fonts, map data and weather files. GitHub's logging applies. |
| jsDelivr | Every visit | MapLibre GL JS 5.24.0 JavaScript and CSS with pinned integrity hashes. The URLs are independent of the map view. |
| OpenFreeMap | Every visit, including on Satellite | Preconnect at page load, followed by a TileJSON request, vector tiles and glyphs. Tile coordinates indicate the area and zoom on screen. Glyph requests include a font stack and character range. |
| NASA GIBS | Satellite at world and regional zoom (configured below 7) | Tile coordinates and the previous UTC date. |
| EOX | Satellite from configured map zoom 4.5 | Tile coordinates for the 2016 Sentinel-2 mosaic. |
| USGS Imagery Only | Satellite from configured map zoom 11 within the contiguous-US source bounds | Tile coordinates. |
| USGS NAIP Plus | Satellite from configured map zoom 15 within the same bounds | A Web Mercator tile bounding box, projection, dimensions and image format. |
| USGS Earthquake Hazards Program | Earthquakes on | Fixed M2.5+ seven-day GeoJSON feed. |
| NASA EONET | Wildfires & volcanoes or Storms on | Fixed query for open events over seven days. |
| GDACS | Disaster alerts on | Date range from seven days ago through tomorrow UTC, alert levels and a page size of 100. |
| NOAA NHC | Storms on | Forecast-point queries for 15 storm slots and a cone query for each active storm. |
| Mapillary coverage | Street photos on, with a configured client token | Vector tile coordinates and the site's public client token in the query string. The client module comes from the site's own origin. |
| Mapillary Graph API | A photo dot or a sequence with a representative image is selected | Image ID, requested metadata fields and the site's public client token in an Authorization header. |
| Thumbnail host returned by Mapillary | The photo panel displays a returned thumbnail | The image URL returned by the Graph API. The app sets `referrerpolicy="no-referrer"` on the image and sends no Graph Authorization header to that host. |

Event feed queries are independent of the map position and are refreshed at most once per
10 minutes per source while a relevant toggle is on. Satellite, event and street-photo
requests depend on layer state. jsDelivr and OpenFreeMap are contacted on a normal visit
before the visitor selects an optional layer. Q7 remains an owner decision.

## Links visitors can open

GitHub links, provider credits, “Open source page” and “Open on Mapillary” navigate to the
destination when clicked. The destination receives the navigation URL, which can identify
the selected event or photo, along with normal request metadata. Event feed responses can
supply the destination URL. These links are separate from resources the map loads.

The scheduled data job retrieves NOAA GFS from NOMADS and the AWS mirror, uses the
Open-Meteo Air Quality and Forecast APIs, and can reuse files from the deployed site.
Visitors receive the resulting forecast files from GitHub Pages.

## Host list (verified 5 Nov 2026)

Static verification covers the URLs configured in the checkout. The three dynamic rows
identify where remote responses supply URLs. The audit identifies OpenFreeMap as the vector
tile host and a Meta CDN as the Mapillary thumbnail host. The exact runtime destinations
depend on the response, so this table does not claim a verified CDN wildcard or a fixed
set of event link hosts. Click-only destinations do not require resource allowlists.

| host | contacted when | source file:line |
|---|---|---|
| `temper31.github.io` | Published site origin on every visit and for same-origin assets, data, the worker and the optional photo client module | `site/index.html:10`, `site/index.html:17`, `site/js/data.js:9`, `site/js/data.js:29`, `site/js/data-core.js:44`, `site/js/photos.js:18` |
| `cdn.jsdelivr.net` | Every visit, MapLibre JS and CSS | `site/index.html:14`, `site/index.html:16` |
| `tiles.openfreemap.org` | Every visit, preconnect, TileJSON and glyphs in all basemaps. The audit also identifies this as the vector tile host. | `site/index.html:11`, `site/js/config.js:17`, `site/js/config.js:18`, `site/js/basemaps.js:77` |
| `gibs.earthdata.nasa.gov` | Satellite below configured map zoom 7 | `site/js/config.js:32` |
| `tiles.maps.eox.at` | Satellite from configured map zoom 4.5 | `site/js/config.js:42` |
| `basemap.nationalmap.gov` | Satellite from configured map zoom 11, within contiguous-US bounds | `site/js/config.js:52` |
| `imagery.nationalmap.gov` | Satellite from configured map zoom 15, within contiguous-US bounds | `site/js/config.js:68` |
| `earthquake.usgs.gov` | Earthquakes on, or USGS earthquake credit clicked | `site/js/events.js:26`, `site/js/events.js:36` |
| `eonet.gsfc.nasa.gov` | Wildfires & volcanoes or Storms on, or EONET credit clicked | `site/js/events.js:27`, `site/js/events.js:42` |
| `www.gdacs.org` | Disaster alerts on, or GDACS credit or fallback report link clicked | `site/js/events.js:28`, `site/js/events.js:53`, `site/js/events.js:58` |
| `mapservices.weather.noaa.gov` | Storms on | `site/js/events.js:14`, `site/js/events.js:63` |
| `tiles.mapillary.com` | Street photos on with a configured client token | `site/js/photos.js:9`, `site/js/photos.js:48` |
| `graph.mapillary.com` | A Mapillary dot or sequence selects an image whose metadata is needed | `site/js/photos.js:10`, `site/js/photos.js:65`, `site/js/photos.js:77` |
| `dynamic:openfreemap.tilejson.tiles` | Vector tile URLs supplied by the OpenFreeMap TileJSON in any basemap | `site/js/config.js:17`, `site/js/basemaps.js:77` |
| `dynamic:mapillary.thumb_1024_url` | A Mapillary thumbnail is shown | `site/js/photos.js:77`, `site/js/photos.js:91` |
| `github.com` | GitHub, Sources and licences, or Source code link clicked | `site/index.html:34`, `site/index.html:100`, `site/index.html:113` |
| `earthdata.nasa.gov` | GIBS imagery credit clicked | `site/js/config.js:35` |
| `s2maps.eu` | EOX imagery credit clicked | `site/js/config.js:45` |
| `www.usgs.gov` | USGS imagery credit clicked | `site/js/config.js:56`, `site/js/config.js:72` |
| `openfreemap.org` | OpenFreeMap credit clicked | `site/js/config.js:77` |
| `openmaptiles.org` | OpenMapTiles credit clicked | `site/js/config.js:77` |
| `www.openstreetmap.org` | OpenStreetMap credit clicked | `site/js/config.js:77` |
| `www.naturalearthdata.com` | Natural Earth credit clicked | `site/js/config.js:78` |
| `www.nco.ncep.noaa.gov` | NOAA GFS credit clicked | `site/js/config.js:80` |
| `atmosphere.copernicus.eu` | CAMS credit clicked | `site/js/config.js:81` |
| `open-meteo.com` | Open-Meteo credit clicked | `site/js/config.js:81` |
| `maplibre.org` | MapLibre credit clicked | `site/js/config.js:82` |
| `www.nhc.noaa.gov` | NOAA NHC credit or storm source link clicked | `site/js/events.js:29`, `site/js/events.js:70` |
| `www.mapillary.com` | Mapillary credit, thumbnail link or “Open on Mapillary” clicked | `site/js/photos.js:11`, `site/js/photos.js:89`, `site/js/photos.js:98` |
| `creativecommons.org` | Mapillary CC BY-SA 4.0 link clicked | `site/js/photos.js:11` |
| `dynamic:event.source_url` | “Open source page” clicked for a report URL provided by an event feed | `site/js/events.js:38`, `site/js/events.js:48`, `site/js/events.js:58`, `site/js/events.js:229` |
