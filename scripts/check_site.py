#!/usr/bin/env python3
"""Pre-deploy checks for the static site. Standard library only.

    python3 scripts/check_site.py            # offline checks
    python3 scripts/check_site.py --verify-sri  # also download CDN files and compare hashes

Checks:
  1. No tokens, keys or credentials in any tracked text file.
  2. Every external <script>/<link> in site/*.html pins an exact version and carries
     integrity= and crossorigin= attributes (and, with --verify-sri, the hash matches).
  3. No keyed or unclear-terms map providers are referenced from site/.
  4. Every local src/href in site/*.html exists (404.html uses /open-world-map/ paths), and every
     JSON / GeoJSON file parses.
  5. No hourly data files are committed (site/data/live/ is deploy output only).
  6. Nothing under docs/screenshots/ (CI output is a workflow artifact only).
  7. The Mapillary logo setting in site/js/config.js matches whether the owner's official
     site/img/mapillary-logo.svg exists (the logo is never drawn or fetched from elsewhere).
  8. Content Security Policy: every site/*.html has a CSP meta tag without 'unsafe-eval'; for each
     directive, its hosts are exactly the hosts the page requests (script and stylesheet tags; for
     the map also every request URL in site/js/, link-only URLs excluded, plus response-supplied
     hosts listed in DYNAMIC); every requested host is listed in site/privacy.html and
     docs/sources-register.md. GitHub Pages cannot set frame-ancestors from a meta tag.
  9. site/sources.html repeats docs/sources-register.md's tables cell for cell; site/privacy.html
     has one row per host in docs/privacy-draft.md's host list; the map's footer links every page.
  10. Share card and icons: index.html has the Open Graph and Twitter tags; share.png is a 1200 x 630
     PNG under 300 KB; icon-32.png, icon-192.png and apple-touch-icon.png (180) exist at their sizes
     and every page links them, with a title and a meta description.
"""
import base64
import hashlib
import html as htmllib
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"

SECRET_PATTERNS = [
    (r"AKIA[0-9A-Z]{16}", "AWS access key"),
    (r"gh[pousr]_[A-Za-z0-9]{36,}", "GitHub token"),
    (r"github_pat_[A-Za-z0-9_]{40,}", "GitHub fine-grained token"),
    (r"sk-[A-Za-z0-9_-]{20,}", "secret key (sk-)"),
    (r"xox[abposr]-[A-Za-z0-9-]{10,}", "Slack token"),
    (r"AIza[0-9A-Za-z_-]{35}", "Google API key"),
    (r"pk\.eyJ[A-Za-z0-9._-]{20,}", "Mapbox token"),
    (r"MLY\|[0-9]+\|[0-9a-f]{20,}", "Mapillary client token"),
    (r"-----BEGIN [A-Z ]*PRIVATE KEY-----", "private key"),
    (r"(?i)[?&](api[_-]?key|access[_-]?token|key|token)=[A-Za-z0-9._-]{12,}", "key/token in a URL"),
    (r"(?i)\b(api[_-]?key|access[_-]?token|client[_-]?secret)\b\s*[:=]\s*['\"][^'\"]{8,}['\"]", "hard-coded credential"),
]

# Keyed or unclear-terms providers deferred by policy (docs/sources-register.md). Esri imagery is
# used only through the authenticated ArcGIS Location Platform hosts, never the legacy
# arcgisonline.com services.
FORBIDDEN_HOSTS = ["arcgisonline.com", "server.arcgisonline", "maptiler.com", "api.mapbox.com",
                   "tiles.mapbox.com", "googleapis.com/maps", "tile.thunderforest.com", "stadiamaps.com"]

TEXT_EXT = {".html", ".js", ".mjs", ".css", ".json", ".geojson", ".md", ".yml", ".yaml", ".py", ".txt", ".svg"}
SKIP_SECRET_SCAN = set()


def tracked_files():
    try:
        out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        return [ROOT / p for p in out.splitlines()]
    except (OSError, subprocess.CalledProcessError):
        return [p for p in ROOT.rglob("*") if p.is_file() and ".git" not in p.parts]


def check_secrets(errors):
    for p in tracked_files():
        rel = p.relative_to(ROOT).as_posix()
        if p.suffix not in TEXT_EXT or rel in SKIP_SECRET_SCAN or rel == "scripts/check_site.py" or not p.exists():
            continue
        text = p.read_text(errors="ignore")
        for pat, what in SECRET_PATTERNS:
            for m in re.finditer(pat, text):
                line = text.count("\n", 0, m.start()) + 1
                errors.append(f"{rel}:{line}: possible {what}: {m.group(0)[:24]}...")


TAG_RE = re.compile(r"<(script|link)\b[^>]*>", re.I)
# 404.html is served by GitHub Pages for any missing path, so it uses absolute project paths.
PROJECT_PREFIX = "/open-world-map/"


def local_target(html, url):
    """The file a same-site URL in an HTML page points to, or None if the path is not allowed."""
    path = url.split("?")[0].split("#")[0]
    if path.startswith(PROJECT_PREFIX):
        return SITE / path[len(PROJECT_PREFIX):]
    if path.startswith("/"):
        return None  # a root path outside the project site breaks on GitHub Pages
    return html.parent / path
ATTR_RE = re.compile(r'([a-zA-Z-]+)\s*=\s*"([^"]*)"')


def check_html(errors, verify_sri):
    for html in SITE.rglob("*.html"):
        text = html.read_text()
        rel = html.relative_to(ROOT).as_posix()
        for tag in TAG_RE.finditer(text):
            attrs = dict((k.lower(), v) for k, v in ATTR_RE.findall(tag.group(0)))
            url = attrs.get("src") or attrs.get("href")
            if not url or url.startswith(("#", "data:", "mailto:")):
                continue
            if tag.group(1).lower() == "link" and attrs.get("rel") not in ("stylesheet", "preload", "icon", "apple-touch-icon", "modulepreload"):
                continue
            if url.startswith(("http://", "https://", "//")):
                if not re.search(r"@\d+\.\d+\.\d+/", url):
                    errors.append(f"{rel}: external resource not pinned to an exact version: {url}")
                if "integrity" not in attrs or "crossorigin" not in attrs:
                    errors.append(f"{rel}: external resource without integrity/crossorigin: {url}")
                elif verify_sri:
                    algo, _, want = attrs["integrity"].partition("-")
                    try:
                        with urllib.request.urlopen(url, timeout=30) as r:
                            got = base64.b64encode(hashlib.new(algo, r.read()).digest()).decode()
                        if got != want:
                            errors.append(f"{rel}: SRI mismatch for {url}")
                        else:
                            print(f"SRI ok: {url}")
                    except OSError as e:
                        errors.append(f"{rel}: could not fetch {url} to verify SRI: {e}")
            else:
                target = local_target(html, url)
                if target is None or not target.exists():
                    errors.append(f"{rel}: missing local file {url}")
        for m in re.finditer(r'<a\b[^>]*href="([^"#:]+)"', text):
            target = local_target(html, m.group(1))
            if target is None or not target.exists():
                errors.append(f"{rel}: broken local link {m.group(1)}")


def check_hosts_and_json(errors):
    for p in SITE.rglob("*"):
        if not p.is_file() or p.suffix not in TEXT_EXT or "live" in p.relative_to(SITE).parts:
            continue
        rel = p.relative_to(ROOT).as_posix()
        text = p.read_text(errors="ignore")
        for host in FORBIDDEN_HOSTS:
            if host in text:
                errors.append(f"{rel}: references deferred/keyed provider {host}")
        if p.suffix in (".json", ".geojson"):
            try:
                json.loads(text)
            except ValueError as e:
                errors.append(f"{rel}: invalid JSON: {e}")


def check_no_live_data(errors):
    for p in tracked_files():
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith("site/data/live/"):
            errors.append(f"{rel}: hourly data must not be committed (deploy output only)")
        elif rel.startswith("site/data/archive/"):
            errors.append(f"{rel}: forecast history is carried forward on the site, never committed")
        elif rel.startswith("docs/screenshots/"):
            errors.append(f"{rel}: CI output belongs in the workflow artifact, not the repository")


LOGO_FILE = SITE / "img" / "mapillary-logo.svg"
LOGO_RE = re.compile(r"^export const MAPILLARY_LOGO = (null|'img/mapillary-logo\.svg');$", re.M)


def check_mapillary_logo(errors):
    """The Mapillary logo is shown only from the owner's official file: the config setting and the file agree."""
    m = LOGO_RE.search((SITE / "js" / "config.js").read_text())
    if not m:
        errors.append("site/js/config.js: MAPILLARY_LOGO must be null or 'img/mapillary-logo.svg'")
    elif (m.group(1) != "null") != LOGO_FILE.exists():
        errors.append("site/js/config.js: MAPILLARY_LOGO is " + m.group(1) + " but site/img/mapillary-logo.svg "
                      + ("exists: set it to 'img/mapillary-logo.svg'" if LOGO_FILE.exists() else "is missing"))


# ---- Content Security Policy, privacy page, register, footer ---------------------------------
CSP_RE = re.compile(r'<meta http-equiv="Content-Security-Policy" content="([^"]+)">', re.I)
URL_RE = re.compile(r"https?://([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)")
# A URL in the map code is a click-only link (no CSP entry) when it follows one of these;
# anything else is a request. A new kind of link written another way fails safe (as a request).
LINK_BEFORE = re.compile(r"""(href="|link: ['`]|page = `|HOME = '|http\([^,()]*,\s*`)$""")
# Hosts that server responses supply at run time, so no literal in the code names them.
DYNAMIC = {"img-src": {"*.fbcdn.net": "Mapillary Graph API thumb_1024_url (unverified)"}}
HOST_DIRECTIVES = ("script-src", "style-src", "connect-src", "img-src")


def csp_of(text):
    m = CSP_RE.search(text)
    if not m:
        return None
    pol = {}
    for part in htmllib.unescape(m.group(1)).split(";"):
        words = part.split()
        if words:
            pol[words[0]] = words[1:]
    return pol


def csp_hosts(sources):
    """Host sources in a directive (keywords such as 'self' and schemes such as data: excluded)."""
    return {re.sub(r"^https?://", "", s).rstrip("/") for s in sources if not s.startswith("'") and not s.endswith(":")}


def requested_hosts(html_path):
    """{directive: hosts} the page requests: its own script / stylesheet tags and, for the map,
    every request URL in site/js/ plus the response-supplied hosts in DYNAMIC."""
    want = {d: set() for d in HOST_DIRECTIVES}
    text = html_path.read_text()
    for tag in TAG_RE.finditer(text):
        attrs = dict((k.lower(), v) for k, v in ATTR_RE.findall(tag.group(0)))
        url = attrs.get("src") or attrs.get("href") or ""
        host = URL_RE.match(url)
        if not host:
            continue
        if tag.group(1).lower() == "script":
            want["script-src"].add(host.group(1))
        elif attrs.get("rel") == "stylesheet":
            want["style-src"].add(host.group(1))
        elif attrs.get("rel") == "preconnect":
            want["connect-src"].add(host.group(1))
    if html_path.name == "index.html":
        for js in sorted((SITE / "js").glob("*.js")):
            for line in js.read_text().splitlines():
                if line.lstrip().startswith("//"):
                    continue
                for m in URL_RE.finditer(line):
                    if not LINK_BEFORE.search(line[:m.start()]):
                        want["connect-src"].add(m.group(1))
        for d, hosts in DYNAMIC.items():
            want[d] |= set(hosts)
    return want


def check_csp(errors):
    """(1) every page has a CSP meta without 'unsafe-eval'; (2) its hosts are exactly the hosts the
    page requests, directive by directive; (3) every requested host is in privacy.html and the register."""
    privacy = (SITE / "privacy.html").read_text() if (SITE / "privacy.html").exists() else ""
    register = (ROOT / "docs" / "sources-register.md").read_text()
    for page in sorted(SITE.glob("*.html")):
        rel = page.relative_to(ROOT).as_posix()
        pol = csp_of(page.read_text())
        if pol is None:
            errors.append(f"{rel}: no Content-Security-Policy meta tag")
            continue
        if any("'unsafe-eval'" in v for v in pol.values()):
            errors.append(f"{rel}: CSP allows 'unsafe-eval'")
        if "'unsafe-inline'" in pol.get("script-src", []):
            errors.append(f"{rel}: CSP allows inline scripts")
        for d in ("default-src", "object-src", "base-uri", "form-action"):
            if d not in pol:
                errors.append(f"{rel}: CSP has no {d}")
        want = requested_hosts(page)
        for d in pol:
            have = csp_hosts(pol[d])
            need = want.get(d, set())
            for h in sorted(need - have):
                errors.append(f"{rel}: CSP {d} is missing {h}, which the code requests")
            for h in sorted(have - need):
                errors.append(f"{rel}: CSP {d} lists {h}, which nothing on this page requests")
        for d, need in want.items():
            if need and d not in pol:
                errors.append(f"{rel}: CSP has no {d} for {', '.join(sorted(need))}")
        for h in sorted(set().union(*want.values())):
            if f"<code>{h}</code>" not in privacy:
                errors.append(f"{rel}: requested host {h} is not listed in site/privacy.html")
            if f"`{h}`" not in register:
                errors.append(f"{rel}: requested host {h} is not listed in docs/sources-register.md")


def table_cells_md(text):
    return [[re.sub(r"\s+", " ", c.replace("`", "")).strip() for c in line.strip().strip("|").split("|")]
            for line in text.splitlines() if line.startswith("|") and not set(line) <= set("|-: ")]


def html_text(fragment):
    return re.sub(r"\s+", " ", htmllib.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


def check_docs_match_pages(errors):
    """The Sources page repeats the register's tables cell for cell; the Privacy page has one row
    per host in the privacy draft's host list; the map's footer links every page."""
    reg = table_cells_md((ROOT / "docs" / "sources-register.md").read_text())
    src = (SITE / "sources.html").read_text()
    rows = [[html_text(c) for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", tr, re.S)]
            for tbl in re.findall(r"<table data-register>(.*?)</table>", src, re.S) for tr in re.findall(r"<tr>(.*?)</tr>", tbl, re.S)]
    if reg != rows:
        bad = next((i for i, (a, b) in enumerate(zip(reg, rows)) if a != b), min(len(reg), len(rows)))
        errors.append(f"site/sources.html: tables differ from docs/sources-register.md (register {len(reg)} rows, page {len(rows)}; first difference at row {bad + 1})")
    draft = (ROOT / "docs" / "privacy-draft.md").read_text().split("## Host list", 1)
    hosts = re.findall(r"^\| `([^`]+)` \|", draft[1], re.M) if len(draft) == 2 else []
    rows = re.findall(r'<tr data-host="([^"]+)">', (SITE / "privacy.html").read_text())
    for h in sorted(set(hosts) - set(rows)):
        errors.append(f"site/privacy.html: no row for {h} (docs/privacy-draft.md host list)")
    for h in sorted(set(rows) - set(hosts)):
        errors.append(f"site/privacy.html: row for {h}, which is not in docs/privacy-draft.md's host list")
    nav = re.search(r'<nav class="sitefoot[^"]*"[^>]*>(.*?)</nav>', (SITE / "index.html").read_text(), re.S)
    linked = set(re.findall(r'href="([^"]+)"', nav.group(1))) if nav else set()
    for page in sorted(SITE.glob("*.html")):
        if page.name not in ("index.html", "404.html") and page.name not in linked:
            errors.append(f"site/index.html: the map's footer does not link {page.name}")


# ---- share card and icons ------------------------------------------------------------------
SHARE_URL = "https://temper31.github.io/open-world-map/share.png"
SHARE_TAGS = {"og:title": None, "og:description": None, "og:type": "website", "og:url": "https://temper31.github.io/open-world-map/",
              "og:image": SHARE_URL, "og:image:width": "1200", "og:image:height": "630", "og:image:alt": None,
              "twitter:card": "summary_large_image"}
IMAGES = {"share.png": (1200, 630, 300 * 1024), "icon-32.png": (32, 32, None), "icon-192.png": (192, 192, None),
          "apple-touch-icon.png": (180, 180, None), "favicon.svg": None}


def png_size(path):
    head = path.read_bytes()[:24]
    return (int.from_bytes(head[16:20], "big"), int.from_bytes(head[20:24], "big")) if head[:8] == b"\x89PNG\r\n\x1a\n" else None


def check_share_and_icons(errors):
    """(5) index.html has the Open Graph / Twitter share tags; the share image and icons exist at
    their sizes (share.png 1200 x 630, under 300 KB); every page has a title and a description."""
    index = (SITE / "index.html").read_text()
    for prop, want in SHARE_TAGS.items():
        m = re.search(rf'<meta (?:property|name)="{re.escape(prop)}" content="([^"]+)">', index)
        if not m:
            errors.append(f"site/index.html: missing share tag {prop}")
        elif want and m.group(1) != want:
            errors.append(f"site/index.html: {prop} is {m.group(1)!r}, expected {want!r}")
    for name, spec in IMAGES.items():
        p = SITE / name
        if not p.exists():
            errors.append(f"site/{name}: missing")
        elif spec:
            w, h, limit = spec
            if png_size(p) != (w, h):
                errors.append(f"site/{name}: expected a {w} x {h} PNG, found {png_size(p)}")
            if limit and p.stat().st_size >= limit:
                errors.append(f"site/{name}: {p.stat().st_size} bytes, must be under {limit}")
    for page in sorted(SITE.glob("*.html")):
        text = page.read_text()
        if not re.search(r"<title>[^<]{10,}</title>", text) or not re.search(r'<meta name="description" content="[^"]{40,}">', text):
            errors.append(f"site/{page.name}: needs a <title> and a meta description")
        for icon in ("favicon.svg", "icon-32.png", "icon-192.png", "apple-touch-icon.png"):
            if icon not in text:
                errors.append(f"site/{page.name}: does not link {icon}")


def main():
    verify = "--verify-sri" in sys.argv
    errors = []
    check_secrets(errors)
    check_html(errors, verify)
    check_hosts_and_json(errors)
    check_no_live_data(errors)
    check_mapillary_logo(errors)
    check_csp(errors)
    check_docs_match_pages(errors)
    check_share_and_icons(errors)
    for e in errors:
        print("ERROR", e)
    print(f"{len(errors)} problem(s) found." if errors else "All checks passed.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
