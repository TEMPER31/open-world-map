# Repository security

These settings are for the owner to review on GitHub and in the Mapillary developer
dashboard. The audit's observations are from 5 November 2026. Check current settings in
the relevant dashboard.

| Audit | Setting and path | How to verify |
|---|---|---|
| K1 | Account Settings → Password and authentication → Two-factor authentication. Enable 2FA and store recovery codes privately. | The account settings show 2FA enabled. Verify a sign-in with the configured second factor. |
| K2 | Repository Settings → Code security. Enable Dependabot alerts, Dependabot security updates, Secret scanning and Push protection where available. | Reopen the settings and confirm all four controls show enabled. The Security tab should expose Dependabot and secret scanning alerts. |
| K3 | Repository Settings → Pages → Enforce HTTPS. Enable it. | Confirm the checkbox is enabled and that an HTTP visit to the published map redirects to HTTPS. |
| K4 | Repository Settings → Pages → Build and deployment → Source → GitHub Actions. | Confirm GitHub Actions is selected. In Actions, check a successful Pages deploy from `main` and verify the published site opens. |
| I8 | Repository Settings → Rules → Rulesets. Create and activate the branch ruleset below. | Confirm the active ruleset targets `main` and requires the two intended workflow checks. |
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
