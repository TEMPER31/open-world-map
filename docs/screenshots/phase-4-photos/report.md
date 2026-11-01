# Phase 4: street photos (Mapillary): report

CI runs: https://github.com/TEMPER31/open-world-map/actions/runs/41265349880 (first run with the corrected token) and
the final run https://github.com/TEMPER31/open-world-map/actions/runs/41269179108. Reports are committed in this folder; screenshots are in the `ci-screenshots`
artifact (30 days).

**Summary.** The Street photos toggle shows Mapillary coverage: dots at world zoom, lines at city zoom, image dots at
street zoom. Clicking a dot opens the photo in the shared panel with its date, "CC BY-SA 4.0 — Mapillary / {creator}"
and "Open on Mapillary". With the token CI now has, a real photo loads at **Times Square**: 1024 px, captured
9 Aug 2014, "CC BY-SA 4.0 — Mapillary / joieee". **Brantley, AL: Mapillary has no imagery there.** The Graph API returned 0 images in 9 search boxes covering about 15 km around the town (31.585 N, 86.255 W), with no errors, and no coverage dots appear at street zoom or z14. The two live checks that require a Brantley photo therefore fail on missing data, not on code. The no-token state, the
"unavailable right now" state (tile limit, token rejected) and the panel rule all pass with stand-in responses. Added
JS is **9.0 KB** (guide ~15 KB). Pan speed with the layer off is unchanged: branch 8.5 vs main 7.5 frames/s.

## Verified (Mapillary docs and terms, read from CI by `sources-probe.mjs`)

- Coverage tiles: `tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=…`. Layers: `overview` z0–5,
  `sequence` z6–14, `image` z14.
- Graph API: `graph.mapillary.com/{id}?fields=id,thumb_1024_url,captured_at,creator,geometry`. The token goes in an
  `Authorization: OAuth` header; CORS is `*`.
- Licence: the Terms say content from other users is under **CC BY-SA**. The help-centre attribution article
  answered HTTP 403 to the probe, so the exact wording Mapillary asks for is **unverified**.
- Rate limits: Graph API 60,000 entity requests/min; **tiles 50,000/day per app**.
- Restricting a client token to a domain is not mentioned in the docs (**unverified**).
- Image search boxes may cover at most 0.01 square degrees (learned from the API's own error message).

## Done when

| Item | Result | How verified | Unresolved |
|---|---|---|---|
| With a token: coverage at world zoom, lines at city zoom, dots at street zoom | Pass | Live: 16,929 / 36,251 / 17,454 rendered features (world / New York / Times Square) | — |
| Click → photo with credit and link, Times Square | **Pass** | Live: image 1024 px, "CC BY-SA 4.0 — Mapillary / joieee", 9 Aug 2014, link `mapillary.com/app/?pKey=583651899278955` | — |
| Brantley, AL | **Fails on missing data** | Live: 0 dots at z16 and z14; Graph API image search, 9 boxes of 0.098°, about 15 km each way: 0 images, 0 errors | Owner: accept "no coverage at Brantley", or name another test place |
| Without a token: clean "unavailable", no errors, 0 requests | Pass | Render check: 0 Mapillary requests, 0 page errors | — |
| Tile limit / token rejected → "Street photos: unavailable right now" | Pass | 4 stand-in cases: HTTP 429, 403, a refusal without CORS headers, Graph code 190. Layer removed, 0 further requests, 0 errors | — |
| Off = 0 Mapillary requests | Pass | 0 before turning it on; source removed and 0 requests after turning it off, while panning and zooming | — |
| Esc closes; panel rule with events and the measure tool | Pass | Photo, then event, replace each other; measure on means clicks only add points | — |
| Loading, error and "no photo here" states | Pass | Stand-in Graph answers | — |
| No token in any committed file; injection documented | Pass | `check_site.py` passes; `secrets.js` is gitignored; full audit of logs and reports found 0 token occurrences; `docs/sources-register.md` documents the injection | — |
| Screenshots desktop + phone | Done | `p4-{desktop,phone}-coverage-world`, `-lines-city`, `-dots-times-square`, `-photo-times-square`, `-photo-brantley` | Brantley: see above |
| Added JS ≤ ~15 KB | **9.0 KB** | `photos.js` 7.5 KB + main/state | — |
| Panning as smooth as Phase 3 with the layer on | Off: unchanged (8.5 vs 7.5 frames/s). **On: not measured in CI** | perf runs with the layer off | Owner check on real hardware |
| Phase 3 + 5 tests, accuracy, MapLibre pinned, CI green | Pass | All Phase 3 and Phase 5 checks pass; accuracy encoding-only 40/0; SRI check passes | — |

## How the token works (documented in `docs/sources-register.md`)

- The data job writes an empty `site/js/secrets.js`. Only the deploy job (on `main`) fills it from
  `MAPILLARY_CLIENT_TOKEN`; PR test jobs use `MAPILLARY_CI_TOKEN`. The token is never committed.
- The token is public by necessity: it ships in the page.
- Each job logs only the secret's shape (length, `MLY|` prefix, number of parts), never the value.
- If the token is abused: revoke it in the Mapillary dashboard and save a new one; the next deploy publishes it.

## Owner actions and live checks after merge

1. Keep `MAPILLARY_CLIENT_TOKEN` as a **repository** secret (done). The deploy publishes it on merge.
2. On the live site, turn on Street photos, zoom into a city and click a dot: photo, credit and "Open on Mapillary" link appear.
3. Watch the daily tile budget (50,000/day). If it runs out, the layer says "unavailable right now" until the next day.
4. Check panning with the layer on, on your own hardware.
