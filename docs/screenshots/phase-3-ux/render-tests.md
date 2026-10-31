# Rendering and behaviour tests

Generated 2026-10-31T18:33:19.581Z by `scripts/data/render-tests.mjs` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
| Westerly (+U only): particles move east | pass | {"dx":0.0236,"dy":-0.0003} |
| Southerly (+V only): particles move north (screen up) | pass | {"dx":0.0003,"dy":-0.028} |
| Easterly (-U only): particles move west | pass | {"dx":-0.0198,"dy":-0.0001} |
| Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers) | pass | {"domMarkers":0,"hlFeatures":60,"isobarsInShader":true} |
| Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map) | pass | 9 of 9 pan frames rendered the H/L layer; DOM labels: 0 |
| No page errors (pressure) | pass |  |
| None: field hidden and legend says "No layer" | pass | {"visible":false,"legend":"No layermap only","isobars":false,"hl":0} |
| None + particles off: no data files fetched while stepping 4 hours | pass | 0 requests:  |
| Clicking the active layer again turns it off | pass |  |
| "None" is remembered across reloads | pass |  |
| No page errors (None) | pass |  |
| 7-day: frames run to f168, hourly to f120 then every 3 h | pass | first f7, last f168, 130 frames on the timeline (114 hourly + 16 three-hourly) |
| Step button and arrow keys move to the next available frame (f120 -> f123 -> f126 -> back to f120) | pass | {"button":116,"right":119,"left":113,"chip":"3 h step","t120":113} |
| Scrubbing in the 3-hourly part snaps to a frame | pass | t=146 (f153) |
| Play moves frame to frame across f120 (same speed per frame) | pass | 111, 112, 113, 116, 119, 122, 125, 128 |
| Rain legend says "past 3 h" after f120 and "past hour" before | pass | Precipitation · mm/hpast 3 h · GFS 0.5° / Precipitation · mm/hpast hour · GFS 0.5° |
| Air quality past its forecast end: legend dimmed with "Air quality forecast ends {date}", no stale data | pass | Air quality forecast ends Thu 5 Nov · 00:00 UTC (AQ files requested at that hour: 0) |
| Place-panel chart covers the whole run with day boundaries | pass | {"days":7,"end":"+6 d 17 h","points":34} |
| No page errors (7-day timeline) | pass |  |
| One clock: after each step every layer reports the same valid time (8 steps, across f120 -> f123) | pass | 8/8 steps in sync; layers: timeline, wind, field, isobars, hl, panel, chart, probe; slowest sync 314 ms; t: 1, 2, 3, 4, 112, 113, 116, 119 |
| Place panel, chart playhead and probe show the timeline hour (DOM) | pass | {"panel":"119","chart":"119","probe":"119","t":"119"} |
| Time API for future layers: onTime() fires with {t, valid}; getValidTime() agrees | pass | {"got":{"t":5,"valid":1793491200000},"valid":1793491200000} |
| Esc closes the place pop-up | pass |  |
| No page errors (one clock) | pass |  |
| Play/pause button and Space toggle playing | pass | {"playBtn":true,"pauseBtn":false,"space":true,"space2":false} |
| Arrow keys and step buttons move one frame | pass | {"right":2,"left":1,"stepBtn":2} |
| Speed 4x plays about 4x as many frames as 1x; the chip cycles 1x -> 2x | pass | 1×: 5 frames in 2 s, 4×: 22; chip 2 2× |
| Local time is shown next to UTC (US Central), and the order can be switched | pass | "Sat 14:00 local · 19:00 UTC" / UTC first: "Sat 19:00 UTC · 14:00 local" (expected local hour 14) |
| "Now" is the frame closest to the current time and says which forecast hour it is | pass | Now is 27 min from the clock; label "forecast hour 7" |
| Prefetch: the next 2 frames of the visible field are fetched; no wind (particles off) or other fields | pass | gfs/temp/f018: fetched, gfs/temp/f019: fetched; other files: none |
| No page errors (timeline controls) | pass |  |
| US units everywhere: probe, place panel, chart, legend ticks, scale bar, measure tool | pass | {"probe":"11 mphfrom SE45.6°N 27.3°W · Sat 14:00 local · 19:00 UTC","panel":"Wind speed 11mph from ESE / Temperature 59°F at 2 m","chart":"Forecast— temp °F · ▮ wind mph","legend":"Wind speed · mph10 m · GFS 0.75°0122537506293+","scale":"200 mi","raw":["—","","loading"],"ticks":"0 12 25 37 50 62 93+","measure":"243 mi"} |
| Units are remembered after reload | pass | {"t":"F","s":"mph","d":"mi","preset":"us"} |
| Custom mix (knots with °F) shows the "Custom" preset | pass |  |
| No page errors (units) | pass |  |
| Measure: London -> New York within 0.5 % of 5,570 km, drawn as a GeoJSON layer, place panel not opened | pass | 5,569 km (5568.9 km, -0.02 %); place panel open: false; features: 11; DOM markers: 0 |
| Measure km/mi toggle updates the page-wide unit (3,461 mi ± 0.5 %) | pass | 3,460 mi |
| Undo removes the last point; Esc exits the measure tool | pass | after undo: —; after Esc: {"on":false,"hidden":true,"features":2} |
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
| pres | 0 | 490 | 7.5 |
| temp | 0 | 325 | 8.5 |
