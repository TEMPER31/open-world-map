// Accuracy check: values read THROUGH THE PAGE'S OWN CODE (getGrid + reading(), and the
// probe text) compared with independent references:
//   - Open-Meteo `gfs_global` and `gfs_seamless` (same model family: should agree closely)
//   - NWS api.weather.gov gridpoints for the US cities (sanity check, different model blend)
//   - Open-Meteo Air Quality `cams_global` for PM2.5 / US AQI (same source)
// plus a grid-alignment test: page values at 0.5 deg grid nodes vs wgrib2's raw GFS value there.
//
//   node scripts/data/accuracy.mjs <site-url> <run-report.json> <out.md> [label]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [, , site = 'http://127.0.0.1:8123/', reportPath, out = 'accuracy.md', label = ''] = process.argv;
const UA = 'open-world-map-accuracy-check (+https://github.com/TEMPER31/open-world-map)';
const CITIES = [
  { name: 'Dayton OH', lat: 39.76, lon: -84.19, us: true },
  { name: 'Miami', lat: 25.76, lon: -80.19, us: true },
  { name: 'Denver', lat: 39.74, lon: -104.99, us: true },
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'Delhi', lat: 28.61, lon: 77.21 }
];
// Tolerances vs the same model (brief: ~1 degC, 3 km/h, 20 deg). Wind direction is only
// compared when both speeds are >= 8 km/h: below that it is not meaningful.
const TOL = { temp: 1, wind: 3, dir: 20, pres: 1, cloud: 15, rain: 0.3, pm25: 3, aqi: 10 };
const CALM_KMH = 8;
// Air-quality grid nodes (4 deg): the page must reproduce CAMS exactly here.
const AQ_NODES = [{ name: 'node 28N 76E (Delhi)', lat: 28, lon: 76 }, { name: 'node 52N 0E (London)', lat: 52, lon: 0 }, { name: 'node 40N 116E (Beijing)', lat: 40, lon: 116 }];
// US AQI breakpoints: 2024 EPA revision and the previous table, for identifying what
// Open-Meteo's us_aqi uses.
const AQI_TABLES = {
  2024: [[0, 9.0, 0, 50], [9.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 125.4, 151, 200], [125.5, 225.4, 201, 300], [225.5, 325.4, 301, 500]],
  2012: [[0, 12.0, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150], [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 500.4, 301, 500]]
};
const aqiFrom = (pm, table) => { const x = Math.floor(pm * 10 + 1e-6) / 10; for (const [cl, ch, il, ih] of AQI_TABLES[table]) if (x <= ch) return Math.round((ih - il) / (ch - cl) * (x - cl) + il); return 500; };

async function json(url, headers = {}) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/geo+json, application/json', ...headers } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.json();
}

// ---- 1. values through the page ----------------------------------------------------
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
if (process.env.OWM_ML_DIR) { // local testing only: serve MapLibre from disk when the CDN is unreachable
  const { readFileSync: rf } = await import('node:fs');
  await page.route('https://cdn.jsdelivr.net/npm/maplibre-gl@*/dist/*', r => {
    const f = new URL(r.request().url()).pathname.split('/').pop();
    r.fulfill({ body: rf(`${process.env.OWM_ML_DIR}/${f}`), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
  });
}
await page.addInitScript(() => localStorage.setItem('owm:prefs:v1', JSON.stringify({ field: 'temp', basemap: 'dark', particles: false, opacity: 1, density: 1, tempUnit: 'C' })));
await page.goto(site);
await page.waitForFunction(() => window.owmTest?.meta && window.owmMap?.loaded(), null, { timeout: 60000 });
const meta = await page.evaluate(() => ({ live: window.owmTest.meta.live, base: window.owmTest.meta.base, hours: window.owmTest.meta.hours, first: window.owmTest.meta.first, run: window.owmTest.meta.run, times: window.owmTest.meta.times }));
// +0 h and +24 h against every reference; f120 (end of the hourly part, ~5 days out) against
// raw NOAA only: pipeline fidelity, since the other references are other model runs/blends.
const T120 = meta.live && meta.times?.includes(120 - meta.first) ? 120 - meta.first : null;
const times = [0, Math.min(24, meta.hours), ...(T120 != null ? [T120] : [])];
const FIELDS = ['temp', 'wind', 'rain', 'cloud', 'pres', 'aq'];

const ours = {};
for (const t of times) {
  ours[t] = await page.evaluate(async ([t, cities, fields]) => {
    const T = window.owmTest, out = {};
    const grids = {};
    for (const k of fields) grids[k] = await T.getGrid(t, k).catch(e => ({ error: String(e) }));
    for (const c of cities) {
      const o = {};
      for (const k of fields) {
        const g = grids[k];
        if (g.error) { o[k] = { error: g.error }; continue; }
        const v = T.sample(g.grid, g.data, c.lon, c.lat);
        o[k] = { value: v, text: T.reading(g, k, c.lon, c.lat).join(' ') };
        if (k === 'wind') {
          const u = T.sample(g.grid, g.u, c.lon, c.lat), w = T.sample(g.grid, g.v, c.lon, c.lat);
          o[k].dirFrom = (Math.atan2(-u, -w) * 180 / Math.PI + 360) % 360;
        }
        if (k === 'aq' && g.aqi) o[k].aqi = T.sample(g.grid, g.aqi, c.lon, c.lat);
      }
      out[c.name] = o;
    }
    return out;
  }, [t, CITIES, FIELDS]);
}

const aqNodes = await page.evaluate(async ([t, nodes]) => {
  const T = window.owmTest, g = await T.getGrid(t, 'aq').catch(() => null);
  return g ? nodes.map(n => T.sample(g.grid, g.data, n.lon, n.lat)) : nodes.map(() => null);
}, [0, AQ_NODES]);

// Probe text (what a user sees) at each city for t = 0, one field at a time.
const probe = {};
for (const k of FIELDS) {
  await page.evaluate(k => window.owmTest.state.set({ field: k, t: 0 }), k);
  await page.waitForTimeout(800);
  for (const c of CITIES) {
    await page.evaluate(([lo, la]) => window.owmMap.jumpTo({ center: [lo, la], zoom: 5 }), [c.lon, c.lat]);
    await page.waitForTimeout(250);
    const box = await page.$('#map').then(e => e.boundingBox());
    const p = await page.evaluate(([lo, la]) => window.owmMap.project([lo, la]), [c.lon, c.lat]);
    await page.mouse.move(box.x + p.x, box.y + p.y);
    await page.waitForTimeout(150);
    (probe[c.name] ||= {})[k] = await page.$eval('#probe', e => e.hidden ? '(hidden)' : e.textContent);
  }
}

// Grid alignment: page value at the exact node vs raw GFS value at that node (same hour).
const report = reportPath ? JSON.parse(readFileSync(reportPath, 'utf8')) : {};
const align = [];
const ap = report.align_points;
if (ap) {
  for (const hour of ap.hours.filter(h => h.f === meta.first || h.f === meta.first + 24 || h.f === 120)) {
    const t = hour.f - meta.first;
    const vals = await page.evaluate(async ([t, nodes]) => {
      const T = window.owmTest, o = {};
      for (const k of ['temp', 'pres', 'cloud']) {
        const g = await T.getGrid(t, k);
        o[k] = nodes.map(n => T.sample(g.grid, g.data, n.lon, n.lat));
      }
      return o;
    }, [t, ap.nodes]);
    ap.nodes.forEach((n, i) => {
      for (const k of ['temp', 'pres', 'cloud']) align.push({ node: n.name, t, field: k, page: vals[k][i], raw: hour.points[n.name]?.[k] });
    });
  }
}
await browser.close();

// ---- 2. references ---------------------------------------------------------------------
const lats = CITIES.map(c => c.lat).join(','), lons = CITIES.map(c => c.lon).join(',');
const validS = times.map(t => (meta.base + t * 3600e3) / 1000);
const refErr = [];
let om = null, aq = null;
try {
  om = await json(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover,pressure_msl&models=gfs_global,gfs_seamless&timezone=GMT&timeformat=unixtime&wind_speed_unit=kmh&past_days=1&forecast_days=3`);
} catch (e) { refErr.push(String(e)); }
const aqPts = [...CITIES, ...AQ_NODES];
try {
  aq = await json(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${aqPts.map(c => c.lat).join(',')}&longitude=${aqPts.map(c => c.lon).join(',')}&hourly=pm2_5,us_aqi&domains=cams_global&timezone=GMT&timeformat=unixtime&past_days=2&forecast_days=3`);
} catch (e) { refErr.push(String(e)); }
const omAt = (i, key, ts) => { const h = om?.[i]?.hourly; if (!h) return null; const j = h.time.indexOf(ts); return j < 0 ? null : h[key]?.[j]; };
const aqAt = (i, key, ts) => { const h = aq?.[i]?.hourly; if (!h) return null; const j = h.time.indexOf(ts); return j < 0 ? null : h[key]?.[j]; };

// NWS gridpoints (US only): values whose validTime interval contains the hour.
const nws = {};
for (const c of CITIES.filter(c => c.us)) {
  try {
    const pt = await json(`https://api.weather.gov/points/${c.lat},${c.lon}`);
    const gd = await json(pt.properties.forecastGridData);
    nws[c.name] = gd.properties;
  } catch (e) { refErr.push(`NWS ${c.name}: ${e}`); }
}
function nwsAt(name, key, ts) {
  const p = nws[name]?.[key];
  if (!p) return null;
  for (const v of p.values) {
    const [start, dur] = v.validTime.split('/');
    const s = Date.parse(start) / 1000, h = /PT?(?:(\d+)D)?T?(?:(\d+)H)?/.exec(dur);
    const len = ((+h[1] || 0) * 24 + (+h[2] || 0)) * 3600 || 3600;
    if (ts >= s && ts < s + len) return key === 'quantitativePrecipitation' ? v.value / (len / 3600) : v.value; // mm per hour
  }
  return null;
}

// ---- 3. table -------------------------------------------------------------------------
const fmt = (v, d = 1) => v == null || Number.isNaN(v) ? '—' : (+v).toFixed(d);
const angle = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const rows = [], summaries = {};
function row(city, t, field, our, ref, refName, tol, opts = {}) {
  const sum = summaries[opts.group || refName] ||= { pass: 0, fail: 0, na: 0 };
  let diff = our == null || ref == null || Number.isNaN(our) ? null : opts.angle ? angle(our, ref) : our - ref;
  let note = '';
  if (diff != null && opts.calm) { diff = null; note = 'calm'; }
  const ok = diff == null ? null : Math.abs(diff) <= tol;
  sum[ok == null ? 'na' : ok ? 'pass' : 'fail']++;
  rows.push(`| ${city} | +${t} h | ${field} | ${fmt(our, opts.d)} | ${refName} ${fmt(ref, opts.d)} | ${diff == null ? '—' : fmt(diff, opts.d)} | ±${tol} | ${ok == null ? (note || 'n/a') : ok ? 'ok' : '**FAIL**'} |`);
}
const resRows = [];
const rawAt = (f, name) => report.city_raw?.hours.find(h => h.f === f)?.cities[name];
CITIES.forEach((c, i) => times.forEach((t, k) => {
  const o = ours[t][c.name], ts = validS[k];
  const raw = rawAt(meta.first + t, c.name);
  const g120 = t === T120 ? '120' : '';   // f120 rows get their own summary lines
  if (raw) {
    // Primary: the page vs NOAA's own GFS 0.25 deg values (bilinear) for the same run and hour.
    // The difference is what our 0.5 deg grid + encoding adds.
    row(c.name, t, 'temp °C', o.temp.value, raw.temp, 'GFS 0.25° raw', 0.7, { group: 'raw' + g120 });
    row(c.name, t, 'wind km/h', o.wind.value, raw.wind_kmh, 'GFS 0.25° raw', TOL.wind, { group: 'raw' + g120 });
    row(c.name, t, 'wind from °', o.wind.dirFrom, raw.wind_from_deg, 'GFS 0.25° raw', TOL.dir, { group: 'raw' + g120, angle: true, d: 0, calm: Math.max(o.wind.value, raw.wind_kmh) < CALM_KMH });
    row(c.name, t, 'precip mm/h', o.rain.value, raw.rain, 'GFS 0.25° raw', TOL.rain, { group: 'raw' + g120, d: 2 });
    row(c.name, t, 'cloud %', o.cloud.value, raw.cloud, 'GFS 0.25° raw', TOL.cloud, { group: 'raw' + g120, d: 0 });
    row(c.name, t, 'pressure hPa', o.pres.value, raw.pres, 'GFS 0.25° raw', 0.5, { group: 'raw' + g120 });
  }
  const gv = raw?.grid;
  if (gv) {
    // Page vs the data job's own grid before PNG encoding (same sampling): what encoding and
    // decoding add. Tolerances: half a step of each encoding plus float noise.
    row(c.name, t, 'temp °C', o.temp.value, gv.temp, 'stored grid', 0.15, { group: 'grid' + g120 });
    row(c.name, t, 'wind km/h', o.wind.value, gv.wind_kmh, 'stored grid', 1, { group: 'grid' + g120 });
    row(c.name, t, 'cloud %', o.cloud.value, gv.cloud, 'stored grid', 1, { group: 'grid' + g120, d: 0 });
    row(c.name, t, 'pressure hPa', o.pres.value, gv.pres, 'stored grid', 0.1, { group: 'grid' + g120, d: 2 });
    resRows.push(`| ${c.name} | +${t} h${g120 ? ' (f120)' : ''} | ${fmt(gv.temp, 2)} | ${fmt(raw.temp, 2)} | ${fmt(gv.temp - raw.temp, 2)} | ${fmt(gv.wind_kmh)} | ${fmt(raw.wind_kmh)} | ${fmt(gv.wind_kmh - raw.wind_kmh)} | ${fmt(gv.cloud, 0)} | ${fmt(raw.cloud, 0)} |`);
  }
  if (g120) return;
  for (const model of ['gfs_global', 'gfs_seamless']) {
    const omW = omAt(i, `wind_speed_10m_${model}`, ts);
    row(c.name, t, 'temp °C', o.temp.value, omAt(i, `temperature_2m_${model}`, ts), model, TOL.temp);
    row(c.name, t, 'wind km/h', o.wind.value, omW, model, TOL.wind);
    row(c.name, t, 'wind from °', o.wind.dirFrom, omAt(i, `wind_direction_10m_${model}`, ts), model, TOL.dir, { angle: true, d: 0, calm: Math.max(o.wind.value, omW ?? 0) < CALM_KMH });
    row(c.name, t, 'precip mm/h', o.rain.value, omAt(i, `precipitation_${model}`, ts), model, TOL.rain, { d: 2 });
    row(c.name, t, 'cloud %', o.cloud.value, omAt(i, `cloud_cover_${model}`, ts), model, TOL.cloud, { d: 0 });
    row(c.name, t, 'pressure hPa', o.pres.value, omAt(i, `pressure_msl_${model}`, ts), model, TOL.pres);
  }
  row(c.name, t, 'PM2.5 µg/m³', o.aq.value, aqAt(i, 'pm2_5', ts), 'cams_global', TOL.pm25);
  if (c.us) {
    row(c.name, t, 'temp °C', o.temp.value, nwsAt(c.name, 'temperature', ts), 'NWS', 3);
    row(c.name, t, 'wind km/h', o.wind.value, nwsAt(c.name, 'windSpeed', ts), 'NWS', 8);
    row(c.name, t, 'cloud %', o.cloud.value, nwsAt(c.name, 'skyCover', ts), 'NWS', 30, { d: 0 });
    row(c.name, t, 'precip mm/h', o.rain.value, nwsAt(c.name, 'quantitativePrecipitation', ts), 'NWS', 1, { d: 2 });
  }
}));
const summary = summaries.align = { pass: 0, fail: 0, na: 0 };
const alignRows = align.map(a => {
  const d = a.page == null || a.raw == null ? null : a.page - a.raw;
  const tol = { temp: 0.5, pres: 0.5, cloud: 1 }[a.field];
  const ok = d != null && Math.abs(d) <= tol;
  summary[d == null ? 'na' : ok ? 'pass' : 'fail']++;
  return `| ${a.node} | +${a.t} h | ${a.field} | ${fmt(a.page, 2)} | ${fmt(a.raw, 2)} | ${fmt(d, 2)} | ±${tol} | ${d == null ? 'n/a' : ok ? 'ok' : '**FAIL**'} |`;
});

// AQ nodes: exact reproduction expected (16-bit, 0.1 ug/m3 steps).
const aqNodeRows = AQ_NODES.map((n, j) => {
  const ref = aqAt(CITIES.length + j, 'pm2_5', validS[0]), our = aqNodes[j];
  const d = our == null || ref == null ? null : our - ref, ok = d != null && Math.abs(d) <= 0.2;
  const sm = summaries.aqnode ||= { pass: 0, fail: 0, na: 0 };
  sm[d == null ? 'na' : ok ? 'pass' : 'fail']++;
  return `| ${n.name} | +0 h | ${fmt(our, 2)} | ${fmt(ref, 2)} | ${d == null ? '—' : fmt(d, 2)} | ±0.2 | ${d == null ? 'n/a' : ok ? 'ok' : '**FAIL**'} |`;
});
// Which table does Open-Meteo's us_aqi follow? Compare with AQI computed from its PM2.5.
const aqiRows = [], aqiScore = { '2024 hourly': 0, '2024 24-h mean': 0, '2012 hourly': 0, '2012 24-h mean': 0 };
aqPts.forEach((c, i) => {
  const h = aq?.[i]?.hourly; if (!h) return;
  const j = h.time.indexOf(validS[0]); if (j < 24) return;
  const pm = h.pm2_5[j], mean = h.pm2_5.slice(j - 23, j + 1).reduce((a, b) => a + b, 0) / 24, om = h.us_aqi[j];
  const v = { '2024 hourly': aqiFrom(pm, 2024), '2024 24-h mean': aqiFrom(mean, 2024), '2012 hourly': aqiFrom(pm, 2012), '2012 24-h mean': aqiFrom(mean, 2012) };
  for (const k in v) aqiScore[k] += Math.abs(v[k] - om);
  aqiRows.push(`| ${c.name} | ${fmt(pm)} | ${fmt(mean)} | ${om} | ${Object.values(v).join(' | ')} |`);
});
const bestTable = Object.entries(aqiScore).sort((a, b) => a[1] - b[1])[0]?.[0];

const runIso = new Date(meta.run).toISOString();
const md = `# Accuracy check${label ? ` (${label})` : ''}

Generated ${new Date().toISOString()} by \`scripts/data/accuracy.mjs\`. Site data: GFS run ${runIso}, timeline +0 h = ${new Date(meta.base).toISOString()} (f${String(meta.first).padStart(3, '0')}); live data: ${meta.live}.
Values are read through the page's own code (\`getGrid\` + \`sample\` + \`reading()\`), bilinear at the city's coordinates.
References: Open-Meteo \`gfs_global\` / \`gfs_seamless\` (may come from a different GFS run than ours; Open-Meteo precipitation is the sum over the preceding hour), NWS gridpoints (different model blend: sanity check only), Open-Meteo \`cams_global\`.

**Summary** (within tolerance / outside / not comparable):
${Object.entries(summaries).map(([k, v]) => `- ${{ raw: 'Page vs raw NOAA GFS 0.25° (grid resolution + encoding), +0 h and +24 h', grid: 'Page vs the stored grid before encoding (encoding only), +0 h and +24 h', raw120: 'f120 (+5 d): page vs raw NOAA GFS 0.25°', grid120: 'f120 (+5 d): page vs the stored grid (encoding only)', align: 'Grid alignment at 0.5° nodes', aqnode: 'Air quality at 4° grid nodes vs CAMS', gfs_global: 'Open-Meteo gfs_global', gfs_seamless: 'Open-Meteo gfs_seamless (uses HRRR over the US)', cams_global: 'Open-Meteo cams_global at the cities', NWS: 'NWS gridpoints (sanity check)' }[k] || k}: ${v.pass} / ${v.fail} / ${v.na}`).join('\n')}
${refErr.length ? `\nReference errors: ${refErr.join('; ')}\n` : ''}
## Point values

| City | Time | Field | Ours | Reference | Diff | Tol | |
|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Resolution: stored grid vs raw NOAA 0.25° at the cities

The stored grids (temperature 0.5° every second point, wind 0.75° every third point, cloud 0.5° area average), sampled the way the page samples them, against NOAA's 0.25° values. This is the part of "page vs raw" that comes from grid resolution; the rest is encoding (the "stored grid" rows above). See \`docs/data-pipeline.md\` → "Grid resolution".

| City | Time | Temp grid | Temp 0.25° | Diff | Wind grid | Wind 0.25° | Diff | Cloud area avg | Cloud 0.25° point |
|---|---|---|---|---|---|---|---|---|---|
${resRows.join('\n') || '| (no stored-grid values in run report) | | | | | | | | | |'}

## Grid alignment (page value at a 0.5° node vs raw GFS 0.25° value at that node)

| Node | Time | Field | Page | Raw GFS | Diff | Tol | |
|---|---|---|---|---|---|---|---|
${alignRows.join('\n') || '| (no alignment data in run report) | | | | | | | |'}

## Air quality at 4° grid nodes (page vs Open-Meteo cams_global at the node)

| Node | Time | Page PM2.5 | CAMS | Diff | Tol | |
|---|---|---|---|---|---|---|
${aqNodeRows.join('\n')}

## Which AQI table does Open-Meteo's us_aqi use?

Open-Meteo us_aqi vs AQI computed here from Open-Meteo's own PM2.5 (hourly value, or the mean of the past 24 h) with the 2024 and the previous (2012) EPA tables. **Closest match: ${bestTable || 'n/a'}** (total absolute difference ${JSON.stringify(aqiScore)}).

| Point | PM2.5 now | PM2.5 24-h mean | Open-Meteo us_aqi | 2024 hourly | 2024 24-h | 2012 hourly | 2012 24-h |
|---|---|---|---|---|---|---|---|
${aqiRows.join('\n')}

## Probe text at +0 h (what a user sees when hovering)

| City | ${FIELDS.join(' | ')} |
|---|${FIELDS.map(() => '---').join('|')}|
${CITIES.map(c => `| ${c.name} | ${FIELDS.map(k => probe[c.name][k].replace(/\|/g, '/')).join(' | ')} |`).join('\n')}
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md);
console.log(md);
for (const [k, v] of Object.entries(summaries)) console.log(`::notice title=Accuracy ${label} ${k}::${v.pass} within tolerance, ${v.fail} outside, ${v.na} n/a`);
console.log(`::notice title=AQI table::Open-Meteo us_aqi is closest to: ${bestTable} ${JSON.stringify(aqiScore)}`);
for (const r of rows.filter(r => r.includes('FAIL')).slice(0, 8)) console.log(`::notice title=Outside tolerance::${r.replace(/\*/g, '')}`);
for (const r of alignRows.filter(r => r.includes('FAIL')).slice(0, 2)) console.log(`::notice title=Alignment::${r.replace(/\*/g, '')}`);
