# Satellite zoom: report

**Result.** In the contiguous US, satellite view now stays sharp past the old limit. From map
zoom 15 the site draws **USGS NAIP Plus**, a keyless USGS service, on top of the cached USGS
layer. It renders one image per 512 px tile through its `exportImage` endpoint. At Brantley,
AL the real detail goes to about **map zoom 17** (0.6 m NAIP imagery). Zoom 18 is a 2×
enlargement, but still far sharper than before. No Esri or keyed source was added.

Before/after at z16, z17 and z18 (left before, right after): `before-after.png`. The full
screenshots are in `before/` and `after/` (`satellite-brantley-z16/17/18.png`).

**Where the numbers come from:**

* CI probe: `scripts/data/satellite-probe.mjs`, run from GitHub Actions (US runners), 30 Oct
  2026.
* Final run: `after/probe/satellite-probe.md`. Earlier runs are in this branch's git history.

**A note on zoom levels.** All zooms here are the site's map zooms (MapLibre, the `#map=`
hash). MapLibre counts 512 px tiles, so map zoom *z* shows 256 px web tiles of level *z + 1*.
The cached USGS service ends at web level 16 (1:9,028), so it is sharp only up to **map
zoom 15**, and the site's z16 was already a 2× enlargement.

## 1. "Imagery Only Large" as a zoom 16+ layer

**Which service.**

* The USGS services directory has no service named `USGSImageOnlyLarge`:
  * `basemap.nationalmap.gov` lists USGSHydroCached, USGSImageryOnly, USGSImageryTopo,
    USGSShadedReliefOnly and USGSTopo.
  * `imagery.nationalmap.gov` lists USGSNAIPImagery and USGSNAIPPlus.
* USGS's catalogue entry "USGS Imagery Only Large-scale Base Map Service" ([ScienceBase][sb])
  describes NAIP plus high-resolution orthoimagery (HRO). That is **USGSNAIPPlus**: its own
  description reads "NAIP and high resolution orthoimagery (HRO)".
* I tested both NAIP ImageServers.

| Check | Result |
|---|---|
| Keyless | **Yes.** HTTP 200 without any token, for all four imagery services. |
| Lets websites use the images (CORS) | **Yes:** `Access-Control-Allow-Origin: *` on `exportImage` (required for WebGL). |
| Tiles in MapLibre | **Yes, via `exportImage?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=512,512&format=jpg&f=image`.** MapLibre 5.24.0 loaded every tile at z17 with no errors (all four services). |
| WMS | **Not available.** `WMSServer` returns HTTP 400 on all four services. |
| Real resolution at Brantley | **0.6 m.** The source image is `m_3108630_ne_16_060_20230528` (USDA NAIP, 28 May 2023, 0.6 m, from the service's own catalogue). The service reports a 0.3 m pixel size, but that is its output grid, not the photo. NAIP Plus can be sharper (down to 15 cm) where a state supplied HRO; none at Brantley. |
| Old cached layer | It lists levels up to 23, but every tile request above web level 16 returned nothing (0 of 24–30 per zoom). Its `export` at higher zooms only enlarges level 16. |

**Detail by zoom** (512×512 export at Brantley; mean difference between neighbouring pixels,
higher = sharper; it halves once requests are finer than the source):

| | z14 (4.07 m) | z15 (2.03 m) | z16 (1.02 m) | z17 (0.51 m) | z18 (0.25 m) | z19 (0.13 m) |
|---|---|---|---|---|---|---|
| Cached USGSImageryOnly | 12.63 | 12.00 | 6.51 | 3.89 | 2.90 | 2.54 |
| USGSNAIPPlus | 12.68 | 12.28 | 8.02 | 5.58 | 2.80 | 1.46 |

At z16 and z17, NAIP Plus shows 23–43 % more detail than the cached layer. From z18 both are
enlarged, but NAIP Plus is enlarged 2× while the cached layer is enlarged 8×. The screenshots
show the difference: houses, cars and roof colours at z18.

**Load time for one screen** (1280×800):

| | 512 px requests (the layer, 9–12 per screen) | 256 px requests (24–30 per screen) |
|---|---|---|
| First view, MapLibre, 6 CI runs, z17/z18 | **0.44–3.56 s** | 0.46–7.69 s |
| Repeat views (fresh browser, server already warm) | **0.41–0.53 s** | 0.47–0.59 s |
| Very first requests to this area, raw, 6 at a time (first probe run) | — | 4.2–18.5 s for a full screen; slowest single request 9.6 s |

Notes on these numbers:

* USGS renders each image on demand and caches it. An area nobody has viewed recently can take
  several seconds; repeat views are fast. Meanwhile the cached layer stays visible underneath,
  so the user sees the soft image first, then the sharp one.
* 512 px requests were within ±0.03 s of 256 px on warm views, and up to 12× faster on first
  views (0.53 vs 6.26 s in one run).
* All of this was measured from GitHub's US runners; phone and home-connection times are not
  measured.

**What changed on the site:**

* `site/js/config.js` has a new source, `sat-naip`:
  * USGSNAIPPlus `exportImage` with 512 px tiles.
  * Limited to the contiguous US (same bounds as the cached layer).
  * Fades in from map zoom 15 to 15.5.
  * Tiles go up to zoom 18.
* The credits strip shows "Imagery: USGS The National Map NAIP Plus (USDA NAIP, state
  orthoimagery)" whenever the layer is on screen.
* `docs/sources-register.md` has rows for both USGS services.

**Teal tiles: found and avoided.** In 4 of the 5 CI screenshot runs that used `format=jpgpng`,
one tile at z16 drew teal (no red).

* Tile logging traced it (commit 65397d0, `after/naip-tiles/satellite-brantley-z16-3.png`):
  * USGS answered `format=jpgpng` with a 262 KB RGBA PNG instead of a ~60 KB JPEG.
  * Inside that PNG, one side of a source-image seam had no red.
* The same tile requested again came back correct in every format. So it is intermittent and
  on USGS's side. The exact cause inside their PNG output is unverified.
* The layer now asks for `format=jpg`. In the final run, all 41 tiles across the four
  satellite views were JPEG and none were teal. In the probe, 27 of 27 `jpg` responses were
  normal (`jpg`, with or without `bandIds`).

**Trade-off of `format=jpg` (decision for you):**

* Where NAIP has no data, JPEG is filled **black**; `jpgpng` would be transparent. A tile
  20 km off Miami came back 100 % black.
* Near the shore NAIP includes the water: a half-sea tile off Miami Beach was fully covered, 0 %
  black.
* So black appears only when zoomed to 15+ over open water past NAIP's edge.
* Switching back to `jpgpng` brings back transparent sea and the occasional teal tile. It is
  one line in `config.js`.

## 2. Seams and date mismatches at Brantley (31.585, −86.255)

* **Within NAIP: no date seam.** A 5 × 5 grid of lookups over 4.8 km found two source images,
  `m_3108630_ne` (15 of 25 points) and `m_3108631_nw` (10 of 25), both **28 May 2023**, both
  0.6 m. Brantley sits close to the line between them. No visible seam in the 4.8 km export
  (`after/probe/USGSNAIPPlus-brantley-wide.jpg`).
* **Between the old and new layers: a clear mismatch.**
  * The cached layer, shown up to map zoom 15, is a different acquisition from NAIP 2023.
  * Its colours are drier and browner: the same z16 area averages RGB 137/136/114 cached vs
    142/152/115 NAIP, and the pond is darker. Some fields and clearings differ.
  * The cached layer's date can't be read from the service (point lookup returns NoData; its
    description only says "Data refreshed June, 2024").
  * Zooming from 15 to 15.5 therefore visibly changes season and some features. Compare
    `before/` and `after/` at z16, or the two `*-brantley-wide.jpg` files.
* **Teal tiles** (section 1): a defect in USGS's PNG output at a seam, now avoided with
  JPEG.

## 3. Esri World Imagery: what it would take (not added)

Esri's own sites were blocked from this session, so these come from search results that quote
Esri's pages. Re-check the pricing and terms pages before deciding.

| Item | What it takes |
|---|---|
| Account | A free **ArcGIS Location Platform** account ([pricing][lp]). It needs sign-up; whether a payment method is required to start was not confirmed. |
| Tile limits | **2,000,000 basemap tiles a month free**, then **$0.15 per 1,000 tiles** ([pricing][lp]). Vector, map and static basemap tiles share the pool. A 1280×800 screen is about 24–30 tiles at 256 px, so the free tier is roughly 67,000–83,000 screen loads a month. Whether usage past the limit is blocked or billed was not confirmed. |
| Key | An **API key credential** with the privilege `premium:user:staticbasemaptiles` (Static basemap tiles). It expires **after at most 1 year**; Esri recommends rotating with a second key ([API key docs][key]). It can be restricted to **HTTP referrers**, e.g. `https://temper31.github.io/*` ([key][key]). |
| Key at deploy | Stored as an Actions secret (e.g. `ESRI_API_KEY`) and written into the built site by the deploy job, never committed. **But a browser map has to send the key with every tile request, so anyone can read it.** The referrer restriction is the only protection, and referrer headers can be faked outside a browser. That breaks this project's "no keys in what we publish" rule in spirit. `scripts/check_site.py` also blocks `arcgisonline.com` today. |
| Attribution | **"Powered by Esri"** plus the data providers' names must be shown on the map, and can't be removed ([Esri attribution][attr], [support FAQ][faq]). |
| Owner chores | Yearly key rotation, watching the monthly tile count, and accepting Esri's terms. Whether it may be used alongside other basemaps, and caching rules: not confirmed. |

**Recommendation:** keep the keyless USGS layer. Esri would add sharper imagery outside NAIP
areas, but at the cost of a public key, a quota and a vendor account.

## Checks

* **Render tests:** 11 pass / 0 fail (`after/render-tests.md`).
* **Satellite views:** 0 page errors and 0 failed tile requests in all four.
* **Site checks:** pass. No keys, MapLibre 5.24.0 still pinned with SRI, no build step.
* **Scope:** only satellite and probe changes; no Phase 3 work in this branch.
* The weather screenshots in `before/` and `after/` come from the standard CI job and are
  unrelated to this change.

## Not resolved

* Black fill past NAIP's edge offshore (see the trade-off above).
* Season/date jump between the cached layer (≤ 15) and NAIP (≥ 15.5).
* First views of an area can take several seconds (USGS renders on demand).
* Alaska, Hawaii and Puerto Rico are still not enabled.
* Phone and real-network load times are not measured.
* The root cause of USGS's teal PNGs is unverified.

[sb]: https://sciencebase.gov/catalog/item/581d0520e4b08da350d52402
[lp]: https://location.arcgis.com/pricing/
[key]: https://developers.arcgis.com/documentation/security-and-authentication/api-key-authentication/tutorials/create-an-api-key/
[attr]: https://developers.arcgis.com/documentation/esri-and-data-attribution/
[faq]: https://support.esri.com/en-us/knowledge-base/faq-is-it-possible-to-hide-or-remove-the-powered-by-esr-000027488
