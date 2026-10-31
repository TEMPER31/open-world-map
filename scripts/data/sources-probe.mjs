// Checks the third-party sources used by the Events and Street photos layers, from CI (the
// build environment cannot reach them). For each data endpoint: HTTP status, whether it allows
// cross-origin requests from the site's origin (Access-Control-Allow-Origin), caching headers,
// size and the field names actually returned. For each terms/docs page: the sentences about
// licences, attribution, rate limits and CORS, so the sources register quotes the current text.
//   node scripts/data/sources-probe.mjs <out.md>
// Node 20+ (global fetch). No dependencies. Never sends a token.
import { writeFileSync } from 'node:fs';

const [, , out = 'sources-probe.md'] = process.argv;
const ORIGIN = 'https://temper31.github.io';
const day = d => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
const lines = [];
const log = s => { lines.push(s); console.log(s); };

const ENDPOINTS = [
  ['USGS M2.5+ past 7 days', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'],
  ['USGS significant past 7 days', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'],
  ['EONET v3 open events, 7 days', 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7'],
  ['EONET v3 categories', 'https://eonet.gsfc.nasa.gov/api/v3/categories'],
  ['GDACS event list MAP', 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP'],
  ['GDACS event list SEARCH', `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=${day(7)}&toDate=${day(-1)}&alertlevel=Green;Orange;Red`],
  ['GDACS swagger', 'https://www.gdacs.org/gdacsapi/swagger/v1/swagger.json'],
  ['NHC CurrentStorms.json', 'https://www.nhc.noaa.gov/CurrentStorms.json'],
  ['NHC JSON sample', 'https://www.nhc.noaa.gov/productexamples/NHC_JSON_Sample.json'],
  ['NHC ArcGIS MapServer', 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer?f=json'],
  ['Mapillary tiles (no token)', 'https://tiles.mapillary.com/maps/vtp/mly1_public/2/2/1/1'],
  ['Mapillary Graph API (no token)', 'https://graph.mapillary.com/images?limit=1&bbox=-73.99,40.75,-73.98,40.76']
];
const PAGES = [
  ['USGS GeoJSON feed docs', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php'],
  ['USGS summary feed docs', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/'],
  ['USGS copyrights and credits', 'https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits'],
  ['EONET v3 docs', 'https://eonet.gsfc.nasa.gov/docs/v3'],
  ['EONET home', 'https://eonet.gsfc.nasa.gov/'],
  ['GDACS terms of use', 'https://www.gdacs.org/About/termsofuse.aspx'],
  ['GDACS feed reference', 'https://www.gdacs.org/feed_reference.aspx'],
  ['GDACS home', 'https://www.gdacs.org/'],
  ['NHC GIS', 'https://www.nhc.noaa.gov/gis/'],
  ['NHC JSON notice', 'https://www.nhc.noaa.gov/aboutnhcgis.shtml'],
  ['NWS disclaimer', 'https://www.weather.gov/disclaimer'],
  ['Mapillary API docs', 'https://www.mapillary.com/developer/api-documentation'],
  ['Mapillary terms', 'https://www.mapillary.com/terms'],
  ['Mapillary licence help', 'https://help.mapillary.com/hc/en-us/articles/115001770409'],
  ['Mapillary attribution help', 'https://help.mapillary.com/hc/en-us/search?query=attribution']
];
const KEYS = /licen[cs]|copyright|attribut|public domain|credit|cite|citation|terms|commercial|rate.?limit|requests per|cors|cross-origin|access-control|cc[ -]by|creative commons|update[sd]? every|thumb_|captured_at|creator|access_token|client token|mly1_public|overview|sequence|zoom/i;

async function get(url, method = 'GET', headers = {}) {
  const t0 = Date.now();
  const r = await fetch(url, { method, redirect: 'follow', headers: { Origin: ORIGIN, 'User-Agent': 'open-world-map-ci-probe (github.com/TEMPER31/open-world-map)', ...headers }, signal: AbortSignal.timeout(30000) });
  const body = method === 'GET' ? await r.text() : '';
  return { r, body, ms: Date.now() - t0 };
}
const H = (r, k) => r.headers.get(k) ?? '—';
const short = (v, n = 220) => { const s = typeof v === 'string' ? v : JSON.stringify(v); return s.length > n ? s.slice(0, n) + '…' : s; };

function summarise(name, j) {
  const o = [];
  if (j?.type === 'FeatureCollection') {
    const f = j.features || [];
    o.push(`features: ${f.length}; metadata: ${short(j.metadata)}`);
    if (f[0]) {
      o.push(`property keys: ${Object.keys(f[0].properties || {}).join(', ')}`);
      o.push(`first feature: ${short({ geometry: f[0].geometry?.type, coords: f[0].geometry?.coordinates?.length > 3 ? '(long)' : f[0].geometry?.coordinates, properties: f[0].properties }, 1400)}`);
      const geo = {}; for (const x of f) { const k = `${x.geometry?.type}${x.properties?.Class ? ' ' + x.properties.Class : ''}${x.properties?.eventtype ? ' ' + x.properties.eventtype : ''}`; geo[k] = (geo[k] || 0) + 1; }
      o.push(`geometry/class counts: ${short(geo, 600)}`);
    }
  } else if (Array.isArray(j?.events)) {
    o.push(`events: ${j.events.length}; keys: ${Object.keys(j.events[0] || {}).join(', ')}`);
    const c = {}; for (const e of j.events) for (const k of e.categories || []) c[k.id] = (c[k.id] || 0) + 1;
    o.push(`category counts: ${JSON.stringify(c)}`);
    if (j.events[0]) o.push(`first event: ${short(j.events[0], 1400)}`);
  } else if (Array.isArray(j?.categories)) {
    o.push(`categories: ${j.categories.map(c => `${c.id} (${c.title})`).join(', ')}`);
  } else if (j?.activeStorms) {
    o.push(`activeStorms: ${j.activeStorms.length}`);
    for (const s of j.activeStorms) o.push(`storm: ${short(s, 2500)}`);
  } else if (j?.layers) {
    o.push(`layers: ${j.layers.map(l => `${l.id} ${l.name}`).join(' | ')}`.slice(0, 6000));
  } else if (j?.paths) {
    o.push(`paths: ${Object.keys(j.paths).join(' | ')}`);
    const p = Object.entries(j.paths).find(([k]) => /geteventlist/i.test(k));
    if (p) o.push(`event list params: ${short(p[1], 2500)}`);
  } else o.push(`json: ${short(j, 2500)}`);
  return o;
}

log(`# Sources probe\n\nGenerated ${new Date().toISOString()} by \`scripts/data/sources-probe.mjs\` from GitHub Actions, with \`Origin: ${ORIGIN}\`.\n`);
log('## Data endpoints\n');
for (const [name, url] of ENDPOINTS) {
  log(`### ${name}\n\n\`${url}\`\n`);
  try {
    const { r, body, ms } = await get(url);
    log(`- HTTP ${r.status} in ${ms} ms · ${body.length.toLocaleString('en-US')} bytes · content-type ${H(r, 'content-type')}`);
    log(`- Access-Control-Allow-Origin: **${H(r, 'access-control-allow-origin')}** · cache-control: ${H(r, 'cache-control')} · last-modified: ${H(r, 'last-modified')}`);
    const rl = [...r.headers].filter(([k]) => /rate|limit|retry/i.test(k)).map(([k, v]) => `${k}: ${v}`);
    if (rl.length) log(`- rate headers: ${rl.join('; ')}`);
    try { for (const s of summarise(name, JSON.parse(body))) log(`- ${s}`); } catch { log(`- body: ${short(body.replace(/\s+/g, ' '), 400)}`); }
    // preflight (needed only for non-simple requests; recorded for the Graph API)
    if (/graph\.mapillary/.test(url)) {
      const p = await get(url, 'OPTIONS', { 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization' });
      log(`- OPTIONS preflight: HTTP ${p.r.status} · allow-origin ${H(p.r, 'access-control-allow-origin')} · allow-headers ${H(p.r, 'access-control-allow-headers')}`);
    }
  } catch (e) { log(`- **failed**: ${String(e).slice(0, 200)}`); }
  log('');
}

log('## Terms and documentation (matching sentences)\n');
for (const [name, url] of PAGES) {
  log(`### ${name}\n\n\`${url}\`\n`);
  try {
    const { r, body } = await get(url);
    const text = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ');
    log(`- HTTP ${r.status} · ${text.length.toLocaleString('en-US')} chars of text · final URL ${r.url}`);
    const hits = [...new Set(text.split(/(?<=[.!?])\s+/).filter(s => KEYS.test(s) && s.length > 20).map(s => s.trim().slice(0, 400)))];
    for (const s of hits.slice(0, 40)) log(`  - ${s}`);
    if (!hits.length) log('  - (no matching sentences; page may be rendered by JavaScript)');
  } catch (e) { log(`- **failed**: ${String(e).slice(0, 200)}`); }
  log('');
}
writeFileSync(out, lines.join('\n') + '\n');
