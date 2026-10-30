# Phase 2 fixes 2: report

**Where the numbers come from.** Every number here is labeled with its source:

* **CI before**: `before/accuracy.md`, GFS run **18Z 29 Oct 2026**, "+0 h" = **f007**
  (01Z 30 Oct), "+24 h" = **f031**.
* **CI after**: `after/accuracy.md`, the same run, one hour later because CI ran an hour
  later: "+0 h" = **f008** (02Z 30 Oct), "+24 h" = **f032**.
  * The pipeline's encoding did not change. Numbers differ between before and after only
    because the hours differ.
* **Local**: measured in the Claude Code session from NOAA's own files on the AWS mirror (same
  run, hours **f006** and **f030**) with the pinned wgrib2.
* **PR #4**: `docs/screenshots/phase-2-fixes/after/accuracy.md`, run 18Z 29 Oct, f006 / f030.

## Summary

| # | Item | Root cause | Status |
|---|---|---|---|
| 1 | Temperature reads cold at cities | **Confirmed:** the 0.5° grid drops the warmer 0.25° points next to these cities. The encoding adds nothing. | Explained, not fixed (0.25° is over budget) |
| 2 | Miami wind 3–5 km/h low | **Confirmed:** the 0.75° wind grid at the coast | Explained. 0.5° costs 260 KB/hour. Recommend keeping 0.75° |
| 3 | Cloud probe vs point | The value is an area average by design | Labeled "area average" in the probe and place panel |
| 4 | PR #4 report errors | — | Corrected below |
| 5 | Place panel note | — | Added |
| 6 | Known limits | — | Documented in `docs/data-pipeline.md` |
| + | °C/°F switch | — | Added: Settings, plus the unit in the temperature legend |
| + | Speed | — | First field paint 3.4 → 2.4 s on simulated 4G. Panel's first value 0.97 → 0.27 s |

The CI "page vs raw NOAA 0.25°" results are **47 ok / 9 outside / 4 n/a**, both before and
after. The 9 outside in CI after (f008 / f032):

* **Temperature:** Dayton +24 h (−0.7, i.e. −0.71), Miami +0 h (−0.9), Delhi +24 h (−0.7,
  i.e. −0.73), and Denver +0 h (−3.3) and +24 h (−3.9).
* **Wind:** Miami +24 h (−4.9). Miami +0 h is −2.8, just inside ±3.
* **Rain:** Miami +24 h (0.55 vs 1.20 mm/h).
* **Pressure:** Denver +0 h (+0.5 against a ±0.5 limit).
* **Cloud:** Denver +24 h (area average 76 % vs 0.25° point 91 %).

The new **"page vs stored grid" (encoding only)** check is **40 ok / 0 outside**. So all 9
differences come from grid resolution, not from the PNG files or the browser code.

## 1. Temperature reads cold

* **Root cause (confirmed).**
  * The stored 0.5° grid, interpolated at the city, is colder than NOAA's 0.25° value there.
    The page reproduces that grid exactly.
  * Stored grid minus 0.25° (+0 h / +24 h):

    | City | CI after (f008 / f032) | CI before (f007 / f031) |
    |---|---|---|
    | Dayton OH | −0.59 / −0.71 | −0.5 / −0.6 |
    | Miami | −0.93 / −0.22 | −0.7 / −0.3 |
    | Delhi | −0.25 / −0.73 | −0.8 / −0.9 |
    | London | −0.10 / −0.09 | −0.1 / −0.1 |
    | Denver | −3.37 / −3.86 | −3.7 / −3.7 |

    The before table has no stored-grid rows, so its column is page minus 0.25°.
  * Page minus stored grid is within ±0.15 °C at every city, both hours (CI after).
  * It is **not a global bias**. Over 20,000 random points, 0.5° minus 0.25° averages
    +0.001 °C (local, f006) and −0.001 °C (local, f030).
  * It is one-sided at these cities because the 0.25° points next to each city are warmer
    than the surrounding 0.5° nodes (local, f006).
    * Dayton: 18.2 and 18.5 °C, against nodes of 16.9–18.0.
    * Miami: 28.6 °C at 26.00° N 80.25° W, against inland nodes of 25.9 and 26.6.
    * Delhi: 21.4–22.4 °C, against nodes at 29° N of 19.1–19.6.
  * *Theory, not verified:* GFS has these cities as warm spots because of urban land use in
    its land model. Every check so far was in the evening or at night, local time.
* **Fix.** None. Two options were measured locally (f006) and rejected:
  * **0.25° temperature:** 427 KB/hour at 16-bit / 0.2 °C, or 266 KB/hour at 8-bit. Both are
    over the ~150 KB budget. The handoff's "560 KB" was an older estimate; 427 KB is measured.
  * **Least-squares fitted 0.5° nodes:** Dayton improved to −0.34 / −0.70 and Miami to
    −0.35 / −0.31. But London got worse (−0.60), and node values moved by up to 7 °C, which
    breaks "exact NOAA value at every node".
* **Verified.**
  * CI encoding-only rows: 10 of 10 temperature rows within ±0.15 °C.
  * CI resolution table.
  * Grid alignment at nodes: 18 ok / 0 outside.
* **Unresolved.** Dayton, Miami and Delhi can read 0.2–0.9 °C cold, and Denver 3.3–3.9 °C.
  This is documented in `docs/data-pipeline.md` → "Grid resolution".

## 2. Miami wind

* **Root cause (confirmed): the 0.75° grid at the coast.**
  * Wind speed at Miami by grid spacing:

    | Hour | 0.25° | 0.5° | 0.75° | 1° |
    |---|---|---|---|---|
    | Local f006 | 21.9 | 18.9 | 16.7 | 23.0 |
    | Local f030 | 23.2 | 22.9 | 19.5 | 27.1 |

  * The 0.75° cell around Miami reaches 79.50° W and 25.50° N, where the wind is
    14.5–16.3 km/h, against 20.5–27.7 at the 0.25° points next to the city.
  * CI after (f008 / f032): the stored 0.75° grid is −3.0 / −4.7 km/h against 0.25°. Page
    minus stored grid is within ±1 km/h at all 10 city rows (8-bit encoding).
* **Cost of 0.5° wind (measured locally, f006):** **260 KB/hour**, against 137 KB at 0.75°
  (8-bit U+V, Sub filter).
* **Recommendation: keep 0.75°.**
  * 0.5° is 1.7× the budget.
  * It fixes only one of the two hours: f030 22.9 vs 23.2, but f006 is still −3.0
    (18.9 vs 21.9).
  * The particles look the same at either spacing.
* **Unresolved.** Coastal wind can read 3–5 km/h low. Revisit with tiled or regional files.

## 3. Cloud probe vs point value

**Choice: label it "area average"** in the probe and the place panel. Rain reads "past hour ·
area avg" because it is smoothed the same way.

Why not show the point value:

* The probe would then disagree with the colour under the cursor, which is the area average.
* It would need a second, unsmoothed 0.25° file every hour (about 4× the data).
* Decimating the 0.5° grid to single points is what produced Denver's 47 % vs 8 % in PR #4.

**Verified (CI after):**

* Probe text at Dayton: "2 %area average", "Drypast hour · area avg" (accuracy table →
  Probe text).
* `views.json` → `place-panel`: "Clouds 2% area average".
* Encoding-only cloud rows: 10 of 10 within ±1 %.

## 4. Corrections to the PR #4 report

All from the PR #4 table, run 18Z 29 Oct, +0 h = f006, +24 h = f030.

* **Delhi air quality +24 h** was **+9.7 µg/m³** (page 50.9 vs CAMS 41.2), not +6.3.
* **Dayton temperature +0 h** was **17.5 °C on the page vs 18.0 °C raw NOAA**, not 20.7. The
  only 20.7 in that table is Delhi's raw NOAA temperature at +24 h, which is probably where
  the mix-up came from.
* **Hours.** Every PR #4 number was from run 18Z 29 Oct at f006 or f030. This PR's CI tables
  use the same run: before is f007 / f031 and after is f008 / f032, because each CI run
  happened an hour later.

## 5. Place panel note

The panel now says: "Model values on a ~50 km grid; mountains and coasts can differ from local
conditions." It replaced the old "model values on a 0.5° grid, not local observations".

**Verified:** CI `after/place-panel.png` and `views.json` → `place-panel.detail`.

## 6. Known limits (documented, not built)

These are in `docs/data-pipeline.md` → "Known limits":

* **Mountain temperature.** Denver: CI after −3.3 / −3.9 (f008 / f032); local −3.56 / −3.22 (f006 / f030). The fix is
  0.25° (427 KB/hour measured) or an elevation correction.
* **Air quality between grid nodes.** About 7–10 µg/m³ near hotspots (PR #4: Delhi +9.7,
  Denver −7.6). The long-term fix is the full CAMS grid from the Copernicus Atmosphere Data
  Store, with a free key kept as an Actions secret for the data job only.
* **Also found: the place-panel chart.** It comes from a 3° grid, every 3 h, 8-bit, so its
  line can differ from the panel's own numbers. Suggested for Phase 3.

## °C / °F switch (owner request)

* **Where:** Settings → Temperature (°C / °F), or tap the unit in the temperature legend.
* **Default:** °F on a US-English browser (and a few other °F countries), otherwise °C. The
  choice is remembered on this device.
* **What changes:** the probe, place panel, chart, legend ticks
  (−40/−4/32/50/68/86/118 °F) and the mobile chip.
* **What doesn't:** data and colours stay in °C.
* **Verified:**
  * Temperature colours are pixel-identical in °C and °F: 0 of 131,120 sampled map pixels
    differ (CI `after/temperature.png` vs `after/temperature-f.png`).
  * They are also identical before vs after this PR, with the same data: 0 of 131,120.
    * Checked twice: CI `before/temperature.png` vs the first CI after run (both f007,
      commit 19d4da9), and locally (`main` vs this branch).
    * The committed `after/` was re-run at f008, so its picture is an hour later than
      `before/`.
  * The probe reads "8 °C" in `temperature` and "47 °F" in `temperature-f` (`views.json`).
    8 °C is a rounded 8.x °C; 47 °F rounds the same reading converted.

## Speed (owner request)

Changes:

* The map starts loading at the same time as the forecast data, instead of after it.
* The manifest and colour scales are fetched once; previously the page and its worker each
  fetched them.
* The worker's code loads while the manifest downloads.
* The probe and place panel ask the worker for a few numbers. Previously each hour step
  copied whole grids (about 1 MB each) to the page.
* The place panel fills in field by field, starting with the field on screen.

Measured locally, medians:

* Same machine and data, served from localhost, with 150 ms latency and 9 Mbit/s (Chrome
  network emulation). Basemap tiles were blocked in this environment, so they are not
  included.
* First temperature field drawn: **3.40 → 2.40 s** (6 page loads each).
* Place panel, first value: **0.97 → 0.27 s**. All six values: 0.98 → 0.98 s (download-bound).

| Same-machine software-WebGL profiling, 8 runs each | Old | New |
|---|---|---|
| Pan frames/s (mean) | 8.9 | 8.6 |
| Worst frame gap while stepping (mean) | 360 ms | 401 ms |
| Long tasks per hour step | 0 ms | 0 ms |

The ranges overlap (289–524 ms), so this is no measurable change. Real-GPU fps is still for the
owner to check. CI's profiling rows (before 11–12 fps, after 6–7 fps) came from different
runners, so they can't be compared; the table itself says to compare on one machine only.

## Budgets and checks

* **File sizes per hour (CI after, KB = 1,024 bytes, mean / max):**
  * wind 139 / 148
  * temperature 141 / 144
  * pressure 141 / 144
  * rain 105 / 113
  * clouds 126 / 130
  * Unchanged from PR #4.
* **Open-Meteo calls:**
  * This PR's CI runs: 0 air-quality locations (cached copy reused) and 3 spot-check
    locations each.
  * Steady state is unchanged: about 7,740 a day, under 10,000.
* **Render tests:** 11 pass / 0 fail (CI after).
* **Site checks:** no keys, MapLibre 5.24.0 pinned with SRI (hash re-verified against the npm
  package), no build step.

## Still for the owner

* Try °C/°F and the cloud labels on the PR preview or after merge.
* Real-device fps check, Phase 1 live checks, repo settings and the EOX imagery decision
  (from the handoff).
