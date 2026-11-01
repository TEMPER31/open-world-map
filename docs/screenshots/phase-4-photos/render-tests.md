<!-- part 1 of 4 -->
# Rendering and behaviour tests

Generated 2026-11-01T03:10:20.864Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Westerly (+U only): particles move east | pass | {"dx":0.0172,"dy":0.0008} |
| Southerly (+V only): particles move north (screen up) | pass | {"dx":0.0015,"dy":-0.0283} |
| Easterly (-U only): particles move west | pass | {"dx":-0.0211,"dy":-0.0014} |
| Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers) | pass | {"domMarkers":0,"hlFeatures":59,"isobarsInShader":true} |
| Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map) | pass | 8 of 8 pan frames rendered the H/L layer; DOM labels: 0 |
| No page errors (pressure) | pass |  |
| None: field hidden and legend says "No layer" | pass | {"visible":false,"legend":"No layermap only","isobars":false,"hl":0} |
| None + particles off: no data files fetched while stepping 4 hours | pass | 0 requests:  |
| Clicking the active layer again turns it off | pass |  |
| "None" is remembered across reloads | pass |  |
| No page errors (None) | pass |  |
| 7-day: frames run to f168, hourly to f120 then every 3 h | pass | first f9, last f168, 128 frames on the timeline (112 hourly + 16 three-hourly) |
| Step button and arrow keys move to the next available frame (f120 -> f123 -> f126 -> back to f120) | pass | {"button":114,"right":117,"left":111,"chip":"3 h step","t120":111} |
| Scrubbing in the 3-hourly part snaps to a frame | pass | t=144 (f153) |
| Play moves frame to frame across f120 (same speed per frame) | pass | 109, 110, 111, 114, 117, 120, 123, 126 |
| Rain legend says "past 3 h" after f120 and "past hour" before | pass | Precipitation · mm/hpast 3 h · GFS 0.5° / Precipitation · mm/hpast hour · GFS 0.5° |
| Air quality past its forecast end: legend dimmed with "Air quality forecast ends {date}", no stale data | pass | Air quality forecast ends Thu 5 Nov · 00:00 UTC (AQ files requested at that hour: 0) |
| Place-panel chart covers the whole run with day boundaries | pass | {"days":6,"end":"+6 d 15 h","points":34} |
| No page errors (7-day timeline) | pass |  |
| One clock: after each step every layer reports the same valid time (8 steps, across f120 -> f123) | pass | 8/8 steps in sync; layers: timeline, field, isobars, hl, wind, panel, chart, probe; slowest sync 414 ms; t: 1, 2, 3, 4, 110, 111, 114, 117 |
| Place panel, chart playhead and probe show the timeline hour (DOM) | pass | {"panel":"117","chart":"117","probe":"117","t":"117"} |
| Time API for future layers: onTime() fires with {t, valid}; getValidTime() agrees | pass | {"got":{"t":5,"valid":1793520000000},"valid":1793520000000} |
| Esc closes the place pop-up | pass |  |
| No page errors (one clock) | pass |  |
| Play/pause button and Space toggle playing | pass | {"playBtn":true,"pauseBtn":false,"space":true,"space2":false} |
| Arrow keys and step buttons move one frame | pass | {"right":2,"left":1,"stepBtn":2} |
| Speed 4x plays about 4x as many frames as 1x; the chip cycles 1x -> 2x | pass | 1×: 5 frames in 2 s, 4×: 22; chip 2 2× |
| Local time is shown next to UTC (US Central), and the order can be switched | pass | "Sat 22:00 local · Sun 03:00 UTC" / UTC first: "Sun 03:00 UTC · Sat 22:00 local" (expected local hour 22) |
| "Now" is the frame closest to the current time and says which forecast hour it is | pass | Now is 10 min from the clock; label "forecast hour 9" |
| Prefetch: the next 2 frames of the visible field are fetched; no wind (particles off) or other fields | pass | gfs/temp/f020: fetched, gfs/temp/f021: fetched; other files: none |
| No page errors (timeline controls) | pass |  |
| US units everywhere: probe, place panel, chart, legend ticks, scale bar, measure tool | pass | {"probe":"19 mphfrom SE45.6°N 27.3°W · Sat 22:00 local · Sun 03:00 UTC","panel":"Wind speed 24mph from SE / Temperature 60°F at 2 m","chart":"Forecast— temp °F · ▮ wind mph","legend":"Wind speed · mph10 m · GFS 0.75°0122537506293+","scale":"200 mi","raw":["—","","loading"],"ticks":"0 12 25 37 50 62 93+","measure":"243 mi"} |
| Units are remembered after reload | pass | {"t":"F","s":"mph","d":"mi","preset":"us"} |
| Custom mix (knots with °F) shows the "Custom" preset | pass |  |
| No page errors (units) | pass |  |
| Measure: London -> New York within 0.5 % of 5,570 km, drawn as a GeoJSON layer, place panel not opened | pass | 5,569 km (5568.9 km, -0.02 %); place panel open: false; features: 11; DOM markers: 0 |
| Measure km/mi toggle updates the page-wide unit (3,461 mi ± 0.5 %) | pass | 3,460 mi |
| Undo removes the last point; Esc exits the measure tool | pass | after undo: —; after Esc: {"on":false,"hidden":true,"features":11} |
| No page errors (measure) | pass |  |
| Layers rail: only the selected field is expanded, with its legend; None collapses all; clicking the active row turns it off | pass | {"open1":["temp+legend"],"none":{"open":0,"legend":"No layermap only"},"toggled":"none"} |
| No page errors (layers) | pass |  |
| Phone: buttons and scrubber are at least 44 px; nothing covers the map centre | pass | [{"el":"m-search","w":258,"h":46},{"el":"m-btn","w":46,"h":46},{"el":"m-btn","w":46,"h":46},{"el":"step","w":44,"h":44},{"el":"play","w":44,"h":44},{"el":"step","w":44,"h":44},{"el":"track","w":332,"h":44}]; over the centre: none |
| Phone layers sheet: half-open covers at most ~40 % of the map, with a drag handle | pass | 314 of 784 px (40.1 %) |
| Phone place sheet: peek, half and full (tap the handle to step) | pass | {"peek":{"top":634,"h":150,"w":390,"bottom":784,"snap":"peek"},"half":{"top":470,"h":314,"w":390,"bottom":784,"snap":"half"},"full":{"top":64,"h":720,"w":390,"bottom":784,"snap":"full"}} |
| Phone place sheet: dragging the handle down snaps to peek | pass | peek |
| No page errors (phone) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
| pres | 0 | 465 | 5 |
| temp | 0 | 574 | 6.5 |

<!-- part 2 of 4 -->
# Rendering and behaviour tests

Generated 2026-11-01T03:08:56.467Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Events off (default): 0 requests to USGS, NASA, GDACS or NOAA while stepping the timeline | pass | 0 requests |
| Events off cost nothing: no event sources, layers or icons on the map; added when a type is turned on, removed when the last is turned off | pass | {"offStyle":{"sources":0,"layers":0,"images":0},"onStyle":{"sources":4,"layers":7,"images":6},"offAgain":{"sources":0,"layers":0,"images":0}} |
| Each event toggle contacts only its own source, and 0 requests after it is turned off | pass | {"eq":{"hosts":["earthquake.usgs.gov"],"onlyOwn":true,"afterOff":0},"fv":{"hosts":["eonet.gsfc.nasa.gov"],"onlyOwn":true,"afterOff":0},"ga":{"hosts":["www.gdacs.org"],"onlyOwn":true,"afterOff":0},"st":{"hosts":["mapservices.weather.noaa.gov"],"onlyOwn":true,"afterOff":0}} |
| Event toggles and the 24 h / 7 d choice are remembered across reloads | pass |  |
| No page errors (events privacy) | pass |  |
| Live events: earthquakes, wildfires & volcanoes and disaster alerts load from their sources and are drawn | pass | {"rows":{"eq":"335","fv":"4","st":"4","ga":"66"},"note":"Events from the past 7 days; storm forecasts follow the timeline. No active storms (NHC: Atlantic, East and Central Pacific). USGS updated 03:07 UTC · EONET checked 03:08 UTC · GDACS updated 02:36 UTC · NHC checked 03:08 UTC.","drawn":271,"credits":"Weather: NOAA/NCEP GFS · Air quality: CAMS via Open-Meteo.com (CC BY 4.0) · Earthquakes: USGS · Events: NASA EONET · Alerts: GDACS (EC JRC, UN OCHA) · Storm forecasts: NOAA NHC · OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors · Natural Earth · MapLibre","errors":{"usgs":null,"eonet":null,"gdacs":null,"nhc":null}} |
| Live storms: NHC answered (a storm count or "none active"), credits list every source in use | pass | 4; Weather: NOAA/NCEP GFS · Air quality: CAMS via Open-Meteo.com (CC BY 4.0) · Earthquakes: USGS · Events: NASA EONET · Alerts: GDACS (EC JRC, UN OCHA) · Storm forecasts: NOAA NHC · OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors · Natural Earth · MapLibre |
| Click a live earthquake: the event panel opens (title, time local + UTC, magnitude, depth, source link) | pass | {"sel":{"type":"event","id":"us:us7000ttxz","lon":-98.0489,"lat":-36.4058},"title":"M 6.4 earthquake","text":"× EVENT · EARTHQUAKES M 6.4 earthquake southeast of Easter Island 3 d ago Thu 29 Oct 02:49 local · 07:49 UTC Magnitude 6.4 mww Depth 10 km below the surface PAGER alert green USGS impact estimate Open source page ↗ Centre map here Earthquakes: USGS · updated Sat 31 Oct 22:07 local · Sun 03:07 UTC","link":"https://earthquake.usgs.gov/earthquakes/eventpage/us7000ttxz","pin":0} |
| Event panel depth follows the distance unit (km -> mi) | pass |  |
| Esc closes the event panel | pass |  |
| No page errors (live events) | pass |  |
| Storm position follows the slider: at the forecast point for Now, interpolated at +30 h, hidden past the last forecast point | pass | {"0":{"at":[-60.72,18.36],"stamp":"2026-11-01T03:00:00.000Z"},"30":{"at":[-64.32,20.16],"stamp":"2026-11-02T09:00:00.000Z"},"159":{"at":null,"stamp":"2026-11-07T18:00:00.000Z"},"lastPoint":"2026-11-05T21:00:00.000Z","want30":[-64.32,20.16]} |
| Click a storm: storm panel opens; then a place click replaces it (one panel, last click wins) | pass | {"a":{"sel":{"type":"event","id":"nhc:AT1","lon":-60,"lat":18},"title":"Tropical Storm Testa"},"b":{"sel":"place","panel":"Place · GFS forecast"}} |
| Measure tool on: clicking an event adds a point and opens no panel | pass | {"sel":null,"pts":"1 point · 0 legs","hidden":true} |
| One clock includes the event layers (events, storms) with field, isobars, H/L, wind, timeline | pass | 4/4 in sync; layers: timeline, events, storms, field, isobars, hl, wind, probe |
| No page errors (event samples) | pass |  |
| A source that is down or empty shows a clear state ("unavailable", "none", "No active storms") and no page errors | pass | {"rows":{"eq":"unavailable","fv":"unavailable","st":"none active","ga":"none"},"note":"Events from the past 7 days; storm forecasts follow the timeline. Earthquakes: unavailable. Wildfires & volcanoes: unavailable. No active storms (NHC: Atlantic, East and Central Pacific). USGS unavailable · EONET unavailable · GDACS checked 03:08 UTC · NHC checked 03:08 UTC."} |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|


<!-- part 3 of 4 -->
# Rendering and behaviour tests

Generated 2026-11-01T03:25:12.247Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Street photos without a token: "unavailable" state, no Mapillary requests, no page errors | pass | {"v":"unavailable","note":"Street photos: unavailable (no Mapillary access token is configured for this site).","layer":false,"credits":"Weather: NOAA/NCEP GFS · Air quality: CAMS via Open-Meteo.com (CC BY 4.0) · OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors · Natural Earth · MapL; Mapillary requests: 0 |
| Photo layer: toggle on draws coverage (stand-in tiles); off before = 0 Mapillary requests | pass | {"off0":0,"tiles":2,"drawn":2} |
| Click a photo dot: photo, capture date, credit "CC BY-SA 4.0 — Mapillary / {creator}" and "Open on Mapillary" link | pass | {"sel":{"type":"photo","id":"498763468214164","lon":-73.98550093173981,"lat":40.75800147696779},"credit":"CC BY-SA 4.0 — Mapillary / test_mapper","link":"https://www.mapillary.com/app/?pKey=498763468214164","img":4,"title":"26 Oct 2026, 02:33"} |
| Esc closes the photo | pass |  |
| Panel rule: photo then event replace each other (last click wins); measure tool on: clicks only add points | pass | {"a":"photo","b":"event","c":{"sel":null,"pts":"1 point · 0 legs"}} |
| Photo layer off: source removed, 0 Mapillary requests while panning and zooming | pass | 0 requests |
| No page errors (street photos) | pass |  |
| Photo panel state when the Graph API fails: "Photo unavailable" | pass | Photo unavailable (test: Graph API down).; errors: none |
| Photo panel state when the Graph API has no thumbnail: "No photo here." | pass | No photo here.; errors: none |
| Street photos when Mapillary refuses (tile limit reached (HTTP 429)): "Street photos: unavailable right now", layer removed, no more requests, no page errors | pass | {"v":"unavailable","note":"Street photos: unavailable right now. Mapillary is not accepting requests from this site at the moment (its daily limit may be reached); turn the layer off and on to try again later.","source":false,"panel":null,"credits":false}; requests after: 0; errors: none |
| Street photos when Mapillary refuses (token rejected by the tiles (HTTP 403)): "Street photos: unavailable right now", layer removed, no more requests, no page errors | pass | {"v":"unavailable","note":"Street photos: unavailable right now. Mapillary is not accepting requests from this site at the moment (its daily limit may be reached); turn the layer off and on to try again later.","source":false,"panel":null,"credits":false}; requests after: 0; errors: none |
| Street photos when Mapillary refuses (tile refusal without CORS headers (request fails, no status)): "Street photos: unavailable right now", layer removed, no more requests, no page errors | pass | {"v":"unavailable","note":"Street photos: unavailable right now. Mapillary is not accepting requests from this site at the moment (its daily limit may be reached); turn the layer off and on to try again later.","source":false,"panel":null,"credits":false}; requests after: 0; errors: none |
| Street photos when Mapillary refuses (token rejected by the Graph API (code 190)): "Street photos: unavailable right now", layer removed, no more requests, no page errors | pass | {"v":"unavailable","note":"Street photos: unavailable right now. Mapillary is not accepting requests from this site at the moment (its daily limit may be reached); turn the layer off and on to try again later.","source":false,"panel":"Street photos: unavailable right now.","credits":false}; requests after: 0; errors: none |
| Live Mapillary diagnostics: Graph API with the token as query parameter and as header (information) | pass | {"list":{"status":500,"ok":false,"err":"1: Please reduce the amount of data you're asking for, then retry your request","id":null},"tileIdQuery":{"status":200,"ok":true,"err":null,"id":"583651899278955"},"tileIdHeader":{"status":200,"ok":true,"err":null,"id":"583651899278955"},"tileId":"583651899278955"} |
| Live Mapillary: coverage at world zoom, lines at city zoom, dots at street zoom | **FAIL** | {"world":16929,"city":36251,"dots":{"Times Square":17454,"Brantley AL":0}} |
| Live Mapillary: click a dot at Times Square and at Brantley AL -> photo with "CC BY-SA 4.0 — Mapillary / {creator}" | **FAIL** | {"Times Square":{"dots":17454,"near":null,"at":[-73.9855,40.758],"sel":"583651899278955","open":true,"img":1024,"credit":"CC BY-SA 4.0 — Mapillary / joieee","msg":null},"Brantley AL":{"dots":0,"near":{"status":500,"found":0,"nearest":null,"err":"Bounding box area is too large. Maximum allowed area is 0.010 square degrees, but got 0.040 square degrees."},"at":[-86.255,31.585],"sel":null,"open":false,"img":0,"credit":null,"msg":null}} |
| No page errors (live Mapillary) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|


<!-- part 4 of 4 -->
# Rendering and behaviour tests

Generated 2026-11-01T03:07:47.427Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|


## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|


