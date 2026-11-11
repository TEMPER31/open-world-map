# Repository security

These settings are for the owner to review on GitHub and in the Mapillary developer
dashboard. The audit's observations are from 5 November 2026. Check current settings in
the relevant dashboard. Checked from the repository on 10 November 2026: K4 holds (Pages deploys
from Actions succeed) and T1 is set (the timer's rounds wait). On 11 November 2026 GitHub reported
`main` as protected (I8, the ruleset below), and the owner reported K2 and K3 done and D5 not
needed. K1 (two-factor login) is still open. K1, K2, K3 and D5 can only be checked in the account
and dashboards.

| Audit | Setting and path | How to verify |
|---|---|---|
| K1 | Account Settings → Password and authentication → Two-factor authentication. Enable 2FA and store recovery codes privately. | The account settings show 2FA enabled. Verify a sign-in with the configured second factor. |
| K2 | Repository Settings → Code security. Enable Dependabot alerts, Dependabot security updates, Secret scanning and Push protection where available. | Reopen the settings and confirm all four controls show enabled. The Security tab should expose Dependabot and secret scanning alerts. |
| K3 | Repository Settings → Pages → Enforce HTTPS. Enable it. | Confirm the checkbox is enabled and that an HTTP visit to the published map redirects to HTTPS. |
| K4 | Repository Settings → Pages → Build and deployment → Source → GitHub Actions. | Confirm GitHub Actions is selected. In Actions, check a successful Pages deploy from `main` and verify the published site opens. |
| I8 | Repository Settings → Rules → Rulesets. Create and activate the branch ruleset below. | Confirm the active ruleset targets `main` and requires the two intended workflow checks. |
| T1 | Repository Settings → Environments → `refresh-timer`. Wait timer **60** minutes; deployment branches: `main` only. The backup timer (`.github/workflows/refresh.yml`) needs it. | Actions → Data refresh timer: the newest run shows **Waiting** for about an hour, then runs and starts the next round. Without the wait timer each round stops itself with an error. |
| D5 | Mapillary developer dashboard → project app → client token settings. Check whether an allowed website or origin restriction is available. | If supported, restrict the token to `https://temper31.github.io`. In the published map, enable Street photos and confirm a known dot opens a photo. Use a controlled origin outside the allowlist to verify that requests are rejected. If the dashboard lacks this restriction, record the result for Q5. |

## Ruleset Protect main

Open repository Settings → Rules → Rulesets → New ruleset → New branch ruleset.

1. Name it **Protect main**, set enforcement to **Active**, and target `main`.
2. Enable **Restrict deletions** and **Block force pushes**.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass** and select `check` and `data` from the Data and
   deploy workflow. Recent pull request runs must expose both jobs before they can be selected.
5. Reopen the active ruleset and confirm the branch target, required checks and all three
   protections. In a pull request to `main`, verify both checks appear as required.

The workflow never writes to the repository (the daily archive job was removed), so the
ruleset needs no exceptions: every change to `main` comes through a pull request.

## Action versions

The workflow pins each `uses:` reference in `.github/workflows/pages.yml` to a full
commit SHA. The adjacent version comments help identify releases when reviewing updates.
The Dependabot configuration opens a grouped weekly pull request for GitHub Actions
version updates when updates are available. Review the full-SHA pins and required checks
before merging.

## ArcGIS key (Esri satellite imagery)

The deploy job writes the `ARCGIS_API_KEY` Actions secret into the ignored `js/secrets.js`.
Builds and pull request tests get an empty key and use the keyless imagery.

1. Use an ArcGIS Location Platform account on the free tier: pay-as-you-go off and no payment
   method, so Esri stops serving (and the map falls back) instead of billing when the
   2,000,000 free basemap tiles of a month are used.
2. Create API key credentials with only the Basemaps privilege (`premium:user:basemaps`), set
   the allowed referrer to `https://temper31.github.io` (the page sends only its origin as the
   referrer) and generate a key. Keys last up to one year: note the expiry date.
3. Open repository Settings → Secrets and variables → Actions → Repository secrets and save the
   key as `ARCGIS_API_KEY`.
4. After the next successful `main` deploy, choose Satellite and zoom in: the credits should
   read "Powered by Esri". The deploy log shows only the key's length and character check.
5. To rotate, generate the second key on the same credentials, replace the secret, wait for a
   deploy, then invalidate the old key.

## Mapillary token rotation

1. In the Mapillary developer dashboard, create a replacement client token for the
   project app and apply the approved site restriction if supported.
2. Open repository Settings → Secrets and variables → Actions → Repository secrets.
   Replace the value of `MAPILLARY_CLIENT_TOKEN`. If the separate CI token needs rotation,
   update `MAPILLARY_CI_TOKEN` as well.
3. After the next successful `main` deploy, turn on Street photos and open a known photo.
   Confirm coverage, photo and credit are visible. With origin restriction supported,
   verify rejection from the controlled disallowed origin.
4. Revoke the superseded token in the Mapillary developer dashboard. If it was exposed
   or abused, revoke it immediately and expect the unavailable state until redeployment.
   Verify its revoked status in the dashboard and confirm the site still loads photos
   with the replacement.
