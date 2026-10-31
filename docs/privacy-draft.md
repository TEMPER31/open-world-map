# Privacy page draft: third-party servers (for Phase 6)

Draft list for the Phase 6 Privacy page. The site has no accounts, analytics, cookies or ads.
Preferences (layer choices, units) are stored only in the visitor's browser (localStorage).

Every third-party server the page talks to, when, and what it receives. Like any web request,
each one receives the visitor's **IP address**, **browser user agent** and the page as
**referrer origin only** (`<meta name="referrer" content="strict-origin-when-cross-origin">`
sends `https://temper31.github.io/` cross-site, never the full URL or the `#map=` position).

## Always (the map itself)

| Server | When | What is sent |
|---|---|---|
| `temper31.github.io` (GitHub Pages) | Every visit | Page, scripts, weather files. GitHub's own logging applies. |
| `cdn.jsdelivr.net` | Every visit | MapLibre library download (pinned, integrity-checked). |
| `tiles.openfreemap.org` | Dark and Light basemaps | Map tile coordinates for the area on screen (reveals the viewed area). |

## Only while a layer is on (off = no requests; checked by the render tests)

| Server | Layer | When it is contacted | What is sent |
|---|---|---|---|
| `earthquake.usgs.gov` | Events · Earthquakes | When the toggle is turned on, then at most every 10 min while on | A fixed feed URL (the same for every visitor): no location, no identifiers. |
| `eonet.gsfc.nasa.gov` | Events · Wildfires & volcanoes, Storms | Same | A fixed query (`status=open&days=7`). |
| `www.gdacs.org` | Events · Disaster alerts | Same | A fixed query with today's date range. |
| `mapservices.weather.noaa.gov` | Events · Storms | Same | Fixed queries for the 15 storm slots, plus the cone of each active storm. |
| `tiles.mapillary.com` | Street photos | While the layer is on (removed when off) | Tile coordinates for the area on screen (reveals the viewed area) and the site's public client token. |
| `graph.mapillary.com` | Street photos | When a photo dot is clicked | The image id and the site's public client token. |
| Meta image CDN (host named in each photo's `thumb_1024_url`, e.g. `scontent-*.fbcdn.net` / `*.xx.fbcdn.net`, unverified) | Street photos | When a photo is shown | The image request; no referrer (`referrerpolicy="no-referrer"`). |
| `gibs.earthdata.nasa.gov`, `tiles.maps.eox.at`, `basemap.nationalmap.gov`, `imagery.nationalmap.gov` | Satellite basemap | While Satellite is selected | Tile coordinates for the area on screen. |

Event sources receive no map position: the same world-wide list is downloaded wherever the map is.
Clicking "Open source page" or "Open on Mapillary" opens the source's own site in a new tab, under that site's privacy policy.
