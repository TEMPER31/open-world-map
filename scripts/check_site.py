#!/usr/bin/env python3
"""Pre-deploy checks for the static site. Standard library only.

    python3 scripts/check_site.py            # offline checks
    python3 scripts/check_site.py --verify-sri  # also download CDN files and compare hashes

Checks:
  1. No tokens, keys or credentials in any tracked text file.
  2. Every external <script>/<link> in site/*.html pins an exact version and carries
     integrity= and crossorigin= attributes (and, with --verify-sri, the hash matches).
  3. No keyed or unclear-terms map providers are referenced from site/.
  4. Every local src/href in site/*.html exists, and every JSON / GeoJSON file parses.
  5. No hourly data files are committed (site/data/live/ is deploy output only).
  6. No CI screenshots or probe output under docs/screenshots/ (they are a workflow
     artifact; only the small text reports are committed).
"""
import base64
import hashlib
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

# Keyed or unclear-terms providers deferred by policy (docs/sources-register.md).
FORBIDDEN_HOSTS = ["arcgisonline.com", "server.arcgisonline", "maptiler.com", "api.mapbox.com",
                   "tiles.mapbox.com", "googleapis.com/maps", "tile.thunderforest.com", "stadiamaps.com"]

TEXT_EXT = {".html", ".js", ".mjs", ".css", ".json", ".geojson", ".md", ".yml", ".yaml", ".py", ".txt", ".svg"}
SKIP_SECRET_SCAN = {"docs/design/Open World Map v3 (offline).html"}  # vendored design bundle (inlined libraries)


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
            if tag.group(1).lower() == "link" and attrs.get("rel") not in ("stylesheet", "preload", "icon", "modulepreload"):
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
            elif not (html.parent / url.split("?")[0].split("#")[0]).exists():
                errors.append(f"{rel}: missing local file {url}")
        for m in re.finditer(r'<a\b[^>]*href="([^"#:]+)"', text):
            if not (html.parent / m.group(1)).exists():
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
        elif rel.startswith("docs/screenshots/") and (rel.lower().endswith((".png", ".jpg", ".jpeg")) or "/probe/" in rel):
            errors.append(f"{rel}: CI images and probe output belong in the workflow artifact, not the repository")


def main():
    verify = "--verify-sri" in sys.argv
    errors = []
    check_secrets(errors)
    check_html(errors, verify)
    check_hosts_and_json(errors)
    check_no_live_data(errors)
    for e in errors:
        print("ERROR", e)
    print(f"{len(errors)} problem(s) found." if errors else "All checks passed.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
