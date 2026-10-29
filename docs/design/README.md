# Handoff: Open World Map (direction 2a, "Chart Room · Dark")

## Overview
Open World Map is a free, open-source, live world map. It needs no account and carries no ads or paywall. It shows:
- Six weather and environment fields: wind, temperature, precipitation, air quality (PM2.5), clouds and pressure. Animated wind particles can be overlaid on any of them.
- Live natural events: earthquakes, wildfires, tropical cyclones and severe storms.
- Street-level photos: green coverage when zoomed out, clickable dots up close.
- Everything is driven by **one shared timeline** running from −24 h (observed) to **+7 days** (forecast). Beyond +5 days it is marked lower confidence.

Audiences: curious first-time visitors, who need instant readability on desktop and phone, and developers, researchers and hobbyists who download the open data.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes showing the intended look and behaviour, not production code to copy. Your task is to **recreate these designs in the target codebase** using its established patterns. If no codebase exists yet, pick the most suitable stack. A reasonable default is a Vite + React/TS (or Svelte) web app with **MapLibre GL** for the map, rendering the raster fields as WebGL textures with a fragment-shader colour ramp, plus a WebGL particle layer for wind. The single responsive web app serves both desktop and mobile.

In the mockups, every weather field, event, storm name, place reading and photo is **synthetic sample data** generated in JavaScript. Only the country geometry is real (Natural Earth 110m via `world-atlas@2.0.2`). The street-level map uses OpenStreetMap tiles, and the green photo dots there are hand-placed along approximate streets.

## Fidelity
**High fidelity.** Final colours, type, spacing, layout and component states. Recreate them pixel-accurately. The colour scales for each field are final and are supplied as data (`field-scales.json`).

## Files
- `Open World Map v3.html`: the full design reference. Open it in a browser (needs internet for fonts, d3, topojson, Leaflet and OSM tiles). Sections: Desktop D1–D3, Field reference (6 cards), Mobile M1–M8. It is interactive:
  - Field rows in the desktop Layers rail (D1, D2) and the tiles in the mobile Layers sheet (M2) switch that screen's map.
  - The "Dark mode" chip in a top bar, or Settings → Appearance (M8), switches every screen between dark and light.
  - The "–" button on the Layers rail minimises it.
  - The Wind particles toggle shows or hides the particles.
- `owm-scales.js` / `field-scales.json`: **source of truth** for field colour ramps, legend ticks, units, sources and render modes. Use these values verbatim.

## Layout system

### Desktop (designed at 1280 × 800; must scale to ≥1024 wide)
Map is full-bleed behind all chrome. Corners are square everywhere (radius 0; buttons, inputs and chips 2 px).

| Element | Position / size | Surface |
|---|---|---|
| Top bar | top 0, full width, h 48, 1 px bottom border | `--panel` (opaque) |
| Layers rail | left 0, top 48 → bottom 0, w 260, 1 px right border | `--panel` |
| Legend | left 292, bottom 108, w 320, padding 9/12/8 | glass |
| Event detail panel | right 16, top 64, bottom 108, w 348 | glass + lift shadow |
| Timeline | left 276, right 16, bottom 16, h 76 | glass + lift shadow |
| Photo viewer (D3) | right 16, top 64, bottom 16, w 430 | glass + lift shadow |
| Context bar (D3) | left 292, top 64 | glass |
| Search palette (D2) | centred, top 92, w 660, over a scrim | `--panel`, 1 px `--line2` border |

**Glass** means `background: var(--glass)`, `border: 1px solid var(--line2)` and `backdrop-filter: blur(14px)`. **Lift** (dark only) means `box-shadow: 0 18px 50px -12px rgba(0,0,0,.55)`. Use blur only on floating panes, never on the docked top bar or rail, because it is expensive over an animating map.

Responsive: at < 1024 px wide, switch to the mobile layout. Between 1024 and 1280, the detail panel may overlay the map edge, and the timeline keeps `left: 276px`. When the Layers rail is minimised it becomes a one-line bar (h 44, auto height), and the timeline stays where it is.

### Mobile (designed at 390 × 844, iPhone 14/15 class)
- **Status bar:** safe area of 50 px.
- **Bottom tab bar:** h 84 including the home indicator. Four tabs: Map, Events, Data, Settings. The active tab gets `--ink` text, weight 600, and a 22×2 accent bar above the label.
- **Map overlay:** a search pill (h 46, glass) plus a 46×46 "LYR" button at top 56, inset 12. Below it, a field chip at top 112 with the field name, unit, a mini ramp and the range.
- **Place sheet (M1):** a time scrubber pill (h 52) at top 396, then the sheet from top 458 to the tab bar. Sheet surface is `rgba(12,15,19,.84)` with blur 20 in dark, and `rgba(247,245,239,.9)` in light. The sheet is draggable (grabber 38×5), with snap points peek (≈ 180 px), half (as drawn) and full.
- **Hit targets:** at least 44 px everywhere. List rows are 46–62 px.

## Screens

### D1 · Live map (dashboard)
- **Top bar:**
  - Logo: a 20 px accent circle with a meridian and an equator drawn in `--accentInk`.
  - Brand "OPEN WORLD MAP": 15/700, uppercase.
  - Search trigger (flex 0 1 420, h 32) with the placeholder "Search places, events, datasets" and `⌘K`.
  - Right side: "LIVE" dot (#45d483 with a 3 px 20 % halo), time in mono 12 ("Wed 28 Oct · 14:00 UTC"), theme chip, divider, then the text links Data, API, GitHub and Settings (12.5, `--mute`).
- **Layers rail:**
  - Header "LAYERS" (13/700, uppercase) with a 26 px minimise button.
  - Section kickers in mono 10/600, letter-spacing .09em, uppercase, with a right-aligned `--mute` meta (the field source, e.g. "GFS 0.25°").
  - Field rows: 6 radio rows, h 30. The selected row is inverted (`--ink` background, `--bg` text) and its radio is filled with accent.
  - "Wind particles" toggle (26×15 square switch, accent when on).
  - Events: Earthquakes M2.5+ (37), Wildfires (4,812), Tropical cyclones (2), Severe storms (11). Each row has a swatch, a mono count and a toggle.
  - Imagery: Street photos (11.2M).
  - Footer of sources in mono 10.5.
- **Map content:**
  - The active field.
  - Coastlines: `rgba(255,255,255,.5)` 0.7 px in dark, `rgba(21,23,26,.6)` in light. Borders at .16 / .22, 0.5 px.
  - Land tint over the field: `rgba(4,6,9,.28)` in dark, `rgba(255,255,255,.2)` in light.
  - Light only: graticule at 10°, `rgba(21,23,26,.1)`.
  - Events:
    - Quakes: rings with radius 2 + (M − 3) × 2.4, a 1.5 px `--ink` stroke and a 3.5 px halo.
    - Fires: 1.4–2.6 px dots in `#ff5a1f`.
    - Cyclones: an accent disc of 8 px (selected, with a pulsing ring of 2 s ease-out, r 8 → 26) or 5.5 px.
    - Cyclone track: solid past line, dashed (4/4) forecast line, forecast nodes and a translucent forecast cone.
  - Map labels: mono 10/600, letter-spacing .06em.
- **Probe:** a cursor readout (glass, mono 11.5) showing the value, a descriptor and coordinates. Formats per field:
  - Wind: `85 km/h · from WSW`
  - Temperature: `14 °C · at 2 m`
  - Precipitation: `0.4 mm/h` (or `Dry`)
  - Air quality: `9 µg/m³ · Good`
  - Clouds: `62 % · cloud cover`
  - Pressure: `1013 hPa · sea level`
- **Legend:** `{label} · {unit}`, with `{level} · {source}` (or "US EPA bands") on the right. Below that, an 8 px ramp and ticks positioned by value. For air quality, show equal-width bands with the breakpoints and category names underneath.
- **Event detail panel** (opens when you click an event; × closes it):
  - Header: kicker "TROPICAL CYCLONE · WEST PACIFIC", title 26/700, a "CAT 3" badge (accent background, mono 10.5/600), then status and position.
  - 2×2 stat grid in mono 20/500: Sustained wind, Gusts, Central pressure, Motion.
  - Intensity sparkline over 48 h: solid before now, dashed after, with an accent "now" line.
  - Alert box: accent at 16 % fill and 45 % border. "Landfall forecast in ~31 h".
  - Forecast track table in mono 11.5.
  - Buttons: "Follow on timeline" (primary, accent) and "GeoJSON ↓".
  - Source line.
- **Timeline** (range −24 h → +168 h, 3 h steps = 64 steps):
  - Play button: a 36 px accent square. It shows a triangle when paused and two bars when playing.
  - Relative label ("Now", "+30 h", "+4 d"; past +120 h it adds " · low conf.") with the absolute timestamp in mono underneath.
  - Track: a 64-bar event histogram. Zones: OBS (−24 → 0), FORECAST (0 → +5 d, hatched 135° at 4/8 px), LOWER CONFIDENCE (+5 → +7 d, sparser 2/10 px hatch with a dotted divider). Day labels at midnight-aligned 24 h steps ("Tue 27", **Now**, "Thu 29" …), major ticks every 24 h and minor every 12 h.
  - Event pins on the track; accent pins mark the selected event's milestones (upgrade at −10 h, landfall at +31 h).
  - Playhead: 2 px accent line with a diamond head.
  - Right side: speed chip (1×), step chip (3 h), range chip (7 d), and a UTC/local chip.
  - **Behaviour:**
    - Play advances one 3 h step every 350 ms at 1× and loops from +7 d back to −24 h. Clicking anywhere on the track jumps there, snapped to 3 h.
    - The time is **global**: every map, timeline, probe and event panel updates together.
    - Storms move along their track and change category, which updates the map label (e.g. KALANI · CAT 4 → TD).
    - The "Landfall forecast in ~N h" alert counts down, then reads "Making landfall now" and "Made landfall N h ago".
    - The LIVE indicator dims whenever t ≠ 0.

### D2 · Search (⌘K)
- Scrim over the map: `rgba(4,6,8,.55)` in dark, `rgba(235,232,224,.62)` in light.
- Palette:
  - Input h 58 at 19 px with an accent caret.
  - Filter chips: All, Places, Events, Datasets, Coordinates.
  - Groups: Places, Live events nearby, Datasets.
  - Rows: a 34 px code box, title (13.5/500, with the matched substring in accent), mono meta, and a right-hand mini-reading (temperature, wind, PM2.5 category).
  - The selected row is inverted.
  - Footer hints: ↑↓, ↵ fly to, ⇧↵ open data, plus the coordinates tip.
- Accepts place names, event names, dataset names and raw coordinates.

### D3 · Street level
- Shown when the Street photos layer is on and zoom is 14 or more. Below zoom 14, photo coverage renders as green (#2fd27a) lines at 55 % opacity.
- Dots: radius 3.2, fill #2fd27a, 1 px stroke in `--bg`. The selected dot is 8 px and carries a 35 % green heading wedge.
- Context bar: Here now, Air quality, Photos in view, Captured filter.
- Zoom buttons (36 px).
- Photo viewer:
  - 4:3 photo with prev/next controls, a "12 / 148 in sequence" counter and the heading.
  - Thumbnail strip, with the selected thumbnail outlined green.
  - Street name kicker.
  - Metadata grid (110 px label column): Captured, Location, Camera, Contributor, License.
  - Buttons: Open full screen, Original ↓.
  - Line: "Faces and plates blurred · Report an issue".
- Basemap tiles are filtered:
  - Dark: `invert(1) hue-rotate(180deg) brightness(.78) contrast(1.05) saturate(.25)`.
  - Light: `grayscale(1) contrast(.92) brightness(1.04) sepia(.12)`.
  - In production, use a proper dark/light vector style instead.

### Field reference (6 cards)
One world map per field, with the legend and render notes. Use these as the visual acceptance test for each layer.

### M1 · Map + place sheet
- Tapping the map or a search result opens the place sheet.
- Content:
  - Name (22/700), coordinates and local time (mono 11).
  - Big temperature (mono 38/500) with the condition underneath.
  - 3-column stats: Wind with gusts, Air quality (PM2.5 and category), Rain over 24 h.
  - 8-day chart (−24 h → +7 d): temperature line plus wind bars, day ticks, a shaded lower-confidence region, and an accent Now marker.
  - "Nearby event" row.
- The field chip and the particles reflect the active field.

### M2 · Layers sheet
- Opened by the LYR button, which shows as inverted while open.
- Sheet from top 316, titled "MAP LAYERS", with a 36 px close button.
- Field tiles: a 3×2 grid with 8 px gaps. Each tile is 72 tall and holds the short name, a 5 px mini ramp and the unit. The selected tile has a 1.5 px accent border and a 12 % accent fill. Tapping a tile switches the map immediately.
- Overlays card:
  - Wind particles toggle.
  - Events chips: Quakes, Fires, Cyclones, Storms (multi-select).
  - Street photos toggle.

### M3 · Search
- Full-screen search (the keyboard is omitted in the mock).
- Input field and "Cancel" in accent.
- Filter chips (h 32).
- Result groups, rows ≥ 58 px: Places, Live events nearby, Datasets, Recent (stored on this device).

### M4 · Events (browse)
- Title "EVENTS" (28/700, uppercase) with the lead "Live worldwide · last 24 h · 4,862 events".
- Category chips with counts; "Sorted by severity" with a "Near me" toggle.
- Rows ≥ 62 px: icon, title (14.5/600), mono meta, and a right-aligned age. Upcoming landfall shows in accent.
- Icons:
  - Cyclone: accent disc with a 4 px 25 % halo.
  - Quake: 2 px ring.
  - Fire: 12 px #ff5a1f square.
  - Storm: 11 px #8a7cff diamond.
- Tapping a row opens M5.

### M5 · Event detail
- Regional map of the event (track, cone, "LANDFALL ~31 H" label).
- Back ("‹ Events") and Share buttons, both glass and 44 px.
- Sheet from top 300 containing the same content as the D1 panel: stats grid, alert, 2-row forecast table, and buttons at h 44.

### M6 · Street photo
- Full-width 330 px photo (360° pano, drag to look) with prev/next controls (44 px), counter and heading.
- "‹ Map" and "Full screen" buttons.
- Street name, metadata grid, a mini map (118 px, OSM, non-draggable) with the selected photo's heading wedge.
- Buttons: "Here now" conditions and "Original ↓".

### M7 · Open data
- Lead: "Every layer is free to download. No key, no account."
- Export card: Region (current bbox), Time range, Layers (multi-select chips), Format (NetCDF / GeoTIFF / CSV), and a full-width Download button showing the estimated size.
- Datasets list.
- API card with a code sample, `GET /v1/point?lat=…&lon=…&fields=wind,temp,pm25&hours=48`. The endpoint shape is a placeholder; define the real API.

### M8 · Settings
Settings are stored in localStorage only; there are no accounts.
- **Units:** Metric/Imperial; wind km/h · m/s · kn · mph; time Local/UTC.
- **Map:**
  - Appearance: Light / Dark / Auto, where Auto follows `prefers-color-scheme`.
  - Default field.
  - Particle density slider.
  - Reduce motion: disables particles and the pulse animation, and also honour `prefers-reduced-motion`.
- **About:** Sources and licenses; Source code (MIT · GitHub).

## Field rendering (see field-scales.json)

| Field | Mode | Notes |
|---|---|---|
| wind | continuous | Ramp over 0–150 km/h. Particles advect along u/v. |
| temp | continuous | Diverging at 0 °C (pale cyan #8fd0e0). Range −40 to 48. |
| rain | continuous-log | Interpolate in log space. **Transparent below 0.1 mm/h.** |
| aq | banded | Hard steps at the US EPA PM2.5 breakpoints **revised 6 May 2024**: 0 / 9.1 / 35.5 / 55.5 / 125.5 / 225.5 µg/m³ (previously 0 / 12.1 / 35.5 / 55.5 / 150.5 / 250.5). EPA defines them for 24-hour averages; the map shows hourly values. Show the category label in the probe and in sheets. |
| cloud | veil | RGBA ramp drawn over a neutral basemap (dark land #1c2229 on ocean #0c1015; light land #cfc8b9 on #e2ded3). No land tint on top. |
| pres | isobars | Muted fill, plus contours every 4 hPa (major every 20, 1.4 px at 75 % / 0.7 px at 45 %). H and L centre labels sit on a 44×30 plate in mono: L #9ec3ff / H #f1c48a in dark, L #2b4e9a / H #8a4a1e in light. |

- In light theme, use `stopsLight` where it is provided, and draw non-veil fields at 90 % alpha.
- **Particles** (dark): white at 75 %. Over the clouds field, use warm `rgba(255,215,150,.7)` so they stay visible. Light: ink at 55 %.
- Trail fade: about 0.9 alpha per frame. Lifetime 40–130 frames. Density is roughly one particle per 1,600 px². Run at 30 fps, and only animate maps that are on screen.

## Interactions and state
- `theme`: `'dark' | 'light' | 'auto'`, default dark, persisted.
- `field`: one of `wind | temp | rain | aq | cloud | pres`, default wind, persisted. Changing it updates the map, legend, mobile chip, probe format and Layers summary together.
- `overlays`: particles, quakes, fires, cyclones, storms, photos (booleans).
- `time`: ISO hour within [now − 24 h, now + 7 d], in 3 h steps by default (GFS goes to +16 d, but the UI caps at 7 d). Play advances at 1×/2×/4× and loops. The timeline drives every layer, including events (observed events are filtered to the window; forecast tracks are shown as-is).
- `playing`: boolean. Pause automatically when the tab is hidden and when the user scrubs. With reduced motion on, play steps without particle animation.
- `selection`: `{type: 'place' | 'event' | 'photo', id}`. It opens the detail panel on desktop and a sheet or route on mobile. It is deep-linkable, e.g. `/event/kalani`, `/@38.72,-9.14,6z`.
- `layersMinimized` (desktop).
- **Hover** (desktop): rows get a `--hover` background, and the map probe follows the cursor. **Tap** (mobile): tapping the map places the probe and opens the place sheet.
- **Loading:** show the previous frame dimmed while the next time step loads. If a layer fails, show the legend with an "unavailable" note instead of an empty map.

## Design tokens

Dark (default):

| Token | Value |
|---|---|
| bg | #07090c |
| panel | rgba(12,15,19,.94) |
| glass | rgba(13,16,21,.58) |
| ink | #ede8dd |
| mute | #a09d95 |
| faint | #85827b |
| line | rgba(237,232,221,.12) |
| line2 | rgba(237,232,221,.24) |
| hover | rgba(237,232,221,.06) |
| accent | #dcb672 |
| accentInk | #1c1508 |

Light:

| Token | Value |
|---|---|
| bg | #ebe8e0 |
| panel | #f7f5ef |
| glass | rgba(247,245,239,.7) |
| ink | #15171a |
| mute | #55585d |
| faint | #6f7276 |
| line | rgba(21,23,26,.14) |
| line2 | rgba(21,23,26,.3) |
| hover | rgba(21,23,26,.05) |
| accent | #d23f1c |
| accentInk | #fff |

Semantic colours (both themes): fire #ff5a1f, storm #8a7cff, photo #2fd27a, live #45d483.

**Type:** IBM Plex Sans Condensed (UI) and IBM Plex Mono (numbers, kickers, data, with `tnum`). Scale: 10 (kicker, mono 600, +.09em, uppercase) · 11 · 12.5 · 13 (body) · 14.5 (mobile list title) · 20 (stat, mono) · 22 (place name) · 26 (event title, 700) · 28 (mobile page title, 700, uppercase) · 38 (mobile temperature, mono 500).

**Spacing:** 4 · 6 · 8 · 10 · 12 · 14 · 16 · 18. Floating panes sit 16 px from the edges.

**Radius:** 0 for panels; 2 px for buttons, chips and inputs; 50 % for dots; 50 px for the device only.

**Shadows:** lift `0 18px 50px -12px rgba(0,0,0,.55)` (dark only). Search palette in light: `8px 8px 0 rgba(21,23,26,.12)`.

## Data sources (as shown in the UI)
- GFS 0.25° (NOAA): wind, temperature, precipitation, clouds and pressure.
- CAMS (Copernicus): PM2.5.
- USGS: earthquakes.
- NASA FIRMS (VIIRS): fires.
- GDACS / JTWC: cyclones.
- Street photos: open CC BY-SA imagery (Mapillary-style). Confirm the provider and its terms.
- OSM attribution must always be visible on street-level maps.

## Assets
There are no bitmap assets. Icons are CSS primitives (rings, squares, diamonds). The photo areas are striped placeholders, to be replaced by real imagery. Fonts come from Google Fonts. The logo is a CSS mark; replace it with an SVG of the same proportions.
