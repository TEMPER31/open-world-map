# Phase 5: natural events: report

CI run for the final head: https://github.com/TEMPER31/open-world-map/actions/runs/41243027690 (reports committed in
this folder; screenshots in the run's `ci-screenshots` artifact, kept 30 days). GFS run 31 Oct 12Z.

**Summary.** The Events section (Earthquakes, Wildfires & volcanoes, Storms, Disaster alerts) works with live data from
all four sources. In this run there were 335 earthquakes, 4 wildfires/volcanoes, 4 severe storms and 66 GDACS alerts;
NHC had no active storm. **All 63 render checks pass**: the 46 from Phase 3 plus 17 new. The accuracy check is
unchanged where the code is involved: encoding-only 40/0 and grid alignment 27/0. Pan speed with events off is main
12.5 vs branch 12.0 frames/s (3 alternating runs each). Added JS is **19.6 KB**, over the ~15 KB guide, which the owner
accepted. Unresolved: GDACS states no reuse licence (owner check below), and the GDACS list is capped at 100 events.

## Sources (verified from GitHub Actions by `scripts/data/sources-probe.mjs`, 31 Oct 2026)

| Source | Verified URL | Licence / terms | Credit shown | CORS | Rate limit | How fetched |
|---|---|---|---|---|---|---|
| USGS earthquakes | `earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson` | USGS: Public Domain; asks for credit | "Earthquakes: USGS" | `*` | none published; "Updated every minute", max-age 60 | browser, while Earthquakes is on, ≤ every 10 min |
| NASA EONET v3 | `eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7` | NASA; each event links its reporting agency. EONET's disclaimer page renders by script, so the probe could not read its wording (**unverified**) | "Events: NASA EONET" | `*` | header `x-ratelimit-limit: 60` (window not stated) | browser, while Wildfires & volcanoes or Storms is on |
| GDACS | `gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate…&toDate…&alertlevel=Green;Orange;Red&pageSize=100` | Terms page: disclaimer, "provided 'as is'", "purely indicative and should not be used for any decision making without alternate sources". **No reuse licence stated** | "Alerts: GDACS (EC JRC, UN OCHA)" + the caveat in the panel | `*` | none published; max 100 per page | browser, while Disaster alerts is on |
| NOAA NHC (NWS map service) | `mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/{6+26i, 8+26i}/query?…&f=geojson` | NWS: public domain "may be used without charge for any lawful purpose" | "Storm forecasts: NOAA NHC" | echoes the origin | none published | browser, while Storms is on: 15 slot queries + 1 cone per storm |

Differences from the planning brief: GDACS `geteventlist/MAP` needs an `eventtype`, so `SEARCH` is used. NHC
`CurrentStorms.json` has **no CORS header**, so the NWS ArcGIS service (which allows the site's origin) is used instead,
and nothing had to move to the data job. Out of scope: **NASA FIRMS** needs a MAP_KEY, so it would have to be fetched
by the data job with the key in a secret, up to 6 h old. **JTWC**: terms, CORS and format not yet checked; EONET already
relays JTWC positions as severe storms.

## Done when

| Item | Result | How verified (numbers) | Unresolved |
|---|---|---|---|
| Sources table | Done (above; also `docs/sources-register.md`) | `sources-probe.md` in this folder: status, CORS header, fields, terms text | EONET disclaimer wording unread (page is script-rendered); GDACS reuse licence not stated |
| Real events of each type on the map, desktop + phone | Done | Live render check: rows eq 339 / fv 4 / st 4 / ga 66, 277 features drawn. Screenshots `p5-desktop-events-world`, `p5-phone-events-world` (eq 335 / fv 4 / st 4 / ga 66) | — |
| An event panel open | Done | Live check: M 6.5 Bonin Islands, "7 d ago", "Sat 24 Oct 21:09 local · Sun 02:09 UTC", magnitude, depth 492 km, USGS link. Screenshots `p5-desktop-event-panel`, `p5-phone-event-panel` | — |
| Storm track | Done with a saved sample (no active NHC storm on 31 Oct) | `p5-desktop-storm-track`, `p5-phone-storm-track` at +30 h; the "No active storms (NHC…)" state is shown live | A live storm track is unverified until a storm is active |
| Toggles on/off; off = 0 requests to that source | Pass | 0 requests while all are off and stepping; each toggle contacted only its own host; 0 requests after turning it off | — |
| Off costs nothing | Pass (new check) | 0 event sources/layers/icons while off; 4 sources, 7 layers, 6 icons when on; 0 again after off | — |
| Click opens the panel; Esc closes; measure tool blocks event clicks | Pass | 3 render checks; plus one panel at a time (storm, then place click replaces it) | — |
| Storm position follows the slider | Pass | At Now = first forecast point; +30 h = interpolated (−64.2, 20.1) exactly; +160 h (past the last point) = hidden | — |
| One-clock test includes event layers | Pass | 4/4 steps in sync; layers: timeline, events, storms, field, isobars, hl, wind, probe | — |
| Down / empty source states | Pass | Stand-ins: USGS and EONET down give "unavailable", GDACS empty gives "none", NHC none gives "none active" plus "No active storms"; 0 page errors | — |
| No page errors | Pass | 50 screenshot views, 0 errors; every render section reports 0 | — |
| Added JS ~15 KB | **19.6 KB** (accepted by the owner) | `events.js` 16.7 KB + main/state 2.9 KB net | Justification below |
| Phase 3 tests, accuracy, sizes, calls, MapLibre pinned, no keys, CI green | Pass | All 46 Phase 3 checks pass. Accuracy: encoding-only 40/0, grid alignment 27/0, AQ nodes 3/0 (same as Phase 3). Data job and file sizes unchanged (no data-job changes); Open-Meteo calls unchanged; SRI check passes; `check_site.py` passes | Raw-NOAA comparison 50/7/3 vs Phase 3's 53/4/3 is a different GFS run; the misses are the known 0.5°/0.75° grid limits (Denver, Delhi temperature; London, Miami wind; London cloud) |
| Docs | Done | `docs/sources-register.md` (Events section, FIRMS/JTWC notes), `docs/privacy-draft.md` (new) | — |
| Pan fps explained | Done | See below | — |

## Pan speed with events off (owner question)

The first CI run measured main 9.0 vs branch 6.5 frames/s, with all main loads first and then all branch loads. Two causes:

1. **Events was not free while off.** It created its icons, 4 GeoJSON sources and 7 layers at start-up and listened to
   the clock. Locally (same machine, sample data, 3 loads each) that delayed the first weather field by about 650 ms
   (main 939 / 845 ms vs branch 1,627 / 1,457 ms). The local pan rate was equal (11.5 / 11.0 frames/s both). Fixed: the icons,
   sources, layers and listeners are added when the first type is turned on and removed when the last is turned off.
   A new render check proves it.
2. **The measurement order was unfair.** All of main's loads ran before the branch's on a shared runner. `perf.mjs` now
   alternates (main, branch, main, …) and lists every run.

After the fix, same runner, alternating, 3 runs each (frames/s during the pan · first field drawn ms · worst gap ms):

| Site | Run 1 | Run 2 | Run 3 | Median pan fps | Median first field |
|---|---|---|---|---|---|
| main | 12.5 · 1562 · 265 | 12.5 · 1749 · 212 | 14.5 · 1698 · 280 | 12.5 | 1698 ms |
| phase-5-events | 12.0 · 1641 · 225 | 12.0 · 1580 · 208 | 12.5 · 1439 · 217 | 12.0 | 1580 ms |

The remaining 0.5 frames/s difference is within main's own run-to-run spread (12.5 to 14.5). CI uses software graphics,
so the owner should confirm on real hardware.

## Why 19.6 KB of JS (accepted)

Four sources with different formats each need a small parser (USGS GeoJSON, EONET's event list, GDACS GeoJSON, NHC
ArcGIS queries across 15 storm slots). The storm forecast needs its own code: the "DD/HHMM" valid time, the track, cone
and forecast points, the marker interpolated along the track on every timeline step, and the storm panel with wind and
pressure in the chosen units. The rest is the shared panel, the status and update-time states, and the six marker
icons drawn in code instead of image files. There is no build step, so nothing is minified. Keeping the cone and
forecast points was the owner's call.

## Screenshots (artifact `ci-screenshots`, run 41243027690)

`p5-desktop-events-world.png`, `p5-desktop-event-panel.png`, `p5-desktop-storm-track.png`, `p5-desktop-layers-events.png`,
`p5-phone-events-world.png`, `p5-phone-event-panel.png`, `p5-phone-storm-track.png`, `p5-phone-layers-events.png`
(plus the 42 Phase 2/3 views).

## Unresolved

- **GDACS licence:** the terms page is a disclaimer with no reuse licence. The site credits GDACS and repeats its
  "indicative only" caveat. Owner decision: keep it, or ask GDACS (contact page linked from its site).
- **GDACS 100 cap:** SEARCH returned exactly 100 events (its page maximum, newest first), and 66 fell in the 7-day
  window. A busier week could drop older alerts. A second page would add one request.
- **EONET disclaimer wording** not read (the page is rendered by script).
- **Live storm track** not seen: no active NHC storm during testing; checked only with the saved sample.
- NHC: up to 16 small queries per refresh while Storms is on (15 storm slots plus a cone per active storm).

## Live checks for the owner (after merge and deploy)

1. Turn on each Events type: the map shows markers and the row shows a count. The note lists "USGS updated … UTC" and the others.
2. Click a quake: the panel shows local + UTC time and depth. Switch km/mi in Settings: the depth follows.
3. Check the credits strip: each source appears only while its type is on.
4. Turn all types off and reload: in the browser's network panel, no requests go to usgs.gov, nasa.gov, gdacs.org or noaa.gov.
5. When NHC has an active storm: turn Storms on and drag the timeline; the storm moves along its track and disappears after the last forecast point.
6. Pan with events off, then on, on your own hardware.
