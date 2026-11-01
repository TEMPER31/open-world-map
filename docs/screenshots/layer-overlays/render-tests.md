<!-- part 3 of 3 -->
# Rendering and behaviour tests

Generated 2026-11-01T00:13:02.140Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Overlays: 0 overlay files fetched while none is on | pass | 0 files |
| Overlays: max 2; a third is disabled with a note why | pass | {"ov":["pres","rain"],"disabled":"true","why":"Up to 2 overlays: turn one off first","toast":"Up to 2 overlays: turn one off first."} |
| Overlay same as the main field is blocked ("main field"), and choosing it as the main field drops it from the overlays | pass | {"same":{"ov":["rain"],"disabled":"true","label":"main field"},"drop":[]} |
| One clock includes the overlays (ov-pres, ov-rain, H/L) with the field, probe and timeline | pass | 4/4 in sync; slowest 101 ms; layers: timeline, field, ov-rain, ov-pres, hl, probe |
| Probe and place panel show the main field and every overlay | pass | {"probe":{"text":"12 °C / at 2 m / Pressure 1029 hPa / Rain Dry / 50.8°N 30.0°W · Sun 01:00 local · 07:00 UTC","ov":["pres","rain"]},"panel":["Wind speed 39km/h from SSE","Temperature 12°C at 2 m","Precipitation · overlay Dry past hour · area avg","Air quality 15µg/m³ Moderate · AQI 66 (24 h)","Clouds 100% area average","Pressure · overlay 1029hPa sea level"]} |
| Overlays prefetch their next 2 frames; turned off they fetch nothing | pass | prefetched 4/4; after off: 0 files |
| Overlays are remembered across reloads | pass |  |
| No page errors (overlays) | pass |  |
| Phone: overlays section in the layers sheet (44 px rows); overlays draw over "None"; chip shows "+2" | pass | {"chip":"No layer +2","rows":[44,44,44],"lt":["timeline","ov-cloud","ov-pres","hl"]} |
| No page errors (overlays, phone) | pass |  |
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
| Live Mapillary diagnostics: Graph API with the token as query parameter and as header (information) | pass | {"list":{"status":200,"ok":true,"err":null,"id":null},"tileIdQuery":{"status":400,"ok":false,"err":"100: Unsupported get request. Object with ID '583651899278955' does not exist, cannot be loaded due to missing permissions, or does not supp","id":null},"tileIdHeader":{"status":400,"ok":false,"err":"100: Unsupported get request. Object with ID '583651899278955' does not exist, cannot be loaded due to missing permissions, or does not supp","id":null},"tileId":"583651899278955"} |
| Live Mapillary: coverage at world zoom, lines at city zoom, dots at street zoom | **FAIL** | {"world":16929,"city":36251,"dots":{"Times Square":17454,"Brantley AL":0}} |
| Live Mapillary: click a dot at Times Square and at Brantley AL -> photo with "CC BY-SA 4.0 — Mapillary / {creator}" | **FAIL** | {"Times Square":{"dots":17454,"at":[-73.9855,40.758],"sel":"583651899278955","open":true,"img":0,"credit":"CC BY-SA 4.0 — Mapillary / …","msg":"Photo unavailable (Unsupported get request. Object with ID '583651899278955' does not exist, cannot be loaded due to missing permissions, or does not support this operation)."},"Brantley AL":{"dots":0,"at":[-86.255,31.585],"sel":null,"open":false,"img":0,"credit":"CC BY-SA 4.0 — Mapillary / …","msg":null}} |
| No page errors (live Mapillary) | pass |  |

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|


