// Screenshots of the built site with its data, for pull-request review.
//   node scripts/data/screenshots.mjs <site-url> <out-dir>
// Needs Playwright with Chromium (CI installs a pinned version). Writes one PNG per view
// and views.json with what each view showed (legend text, probe readings, errors).
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [, , site = 'http://127.0.0.1:8123/', out = 'screenshots'] = process.argv;
mkdirSync(out, { recursive: true });

const VIEWS = [
  { name: 'wind-atlantic', field: 'wind', hash: '2.6/42/-38', particles: true },
  { name: 'temperature', field: 'temp', hash: '1.6/30/0' },
  { name: 'temperature-f', field: 'temp', hash: '1.6/30/0', tempUnit: 'F' },
  { name: 'place-panel', field: 'cloud', hash: '5/39.80/-89.64', click: true },
  { name: 'precipitation', field: 'rain', hash: '1.6/20/-30' },
  { name: 'clouds', field: 'cloud', hash: '1.6/20/30' },
  { name: 'pressure', field: 'pres', hash: '1.6/35/-20' },
  { name: 'air-quality', field: 'aq', hash: '1.6/25/70' },
  { name: 'none', field: 'none', hash: '2.6/42/-38', particles: true },
  // Satellite past the cached USGS level 16, at Brantley AL (no weather field on top)
  ...[16, 17, 18].map(z => ({ name: `satellite-brantley-z${z}`, field: 'none', basemap: 'satellite', hash: `${z}/31.585/-86.255`, wait: 6000 }))
];
const only = process.env.VIEWS ? process.env.VIEWS.split(',') : null;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
for (const v of VIEWS.filter(v => !only || only.some(o => v.name.startsWith(o)))) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  if (process.env.OWM_ML_DIR) { // local testing only: serve MapLibre from disk when the CDN is unreachable
    const { readFileSync } = await import('node:fs');
    await page.route('https://cdn.jsdelivr.net/npm/maplibre-gl@*/dist/*', r => {
      const f = new URL(r.request().url()).pathname.split('/').pop();
      r.fulfill({ body: readFileSync(`${process.env.OWM_ML_DIR}/${f}`), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
    });
  }
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(p => localStorage.setItem('owm:prefs:v1', JSON.stringify(p)),
    { field: v.field, basemap: v.basemap || 'dark', particles: !!v.particles, opacity: 1, density: 1, tempUnit: v.tempUnit || 'C' });
  await page.goto(`${site}#map=${v.hash}`);
  await page.waitForFunction(() => window.owmMap?.getLayer('field') && window.owmMap.loaded(), null, { timeout: 60000 }).catch(() => errors.push('map not idle after 60 s'));
  await page.waitForTimeout(v.wait || (v.particles ? 5000 : 2500));
  const box = await page.$('#map').then(e => e.boundingBox());
  if (v.click) { // open the place panel at the map centre
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1500);
  }
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.45);
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => ({
    legend: document.querySelector('#legend .lg-h')?.textContent,
    probe: document.querySelector('#probe')?.textContent,
    detail: document.querySelector('#detail:not([hidden])')?.innerText.replace(/\s+/g, ' ').trim() || null,
    stale: document.querySelector('#stale').hidden ? null : document.querySelector('#stale').textContent,
    updated: document.querySelector('[data-updated]')?.textContent,
    sampleLabelsVisible: [...document.querySelectorAll('[data-sample-only]')].filter(e => !e.hidden).length
  }));
  await page.screenshot({ path: `${out}/${v.name}.png` });
  report.push({ view: v.name, ...info, errors });
  await page.close();
}
await browser.close();
writeFileSync(`${out}/views.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
