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
  { name: 'place-panel', field: 'cloud', hash: '5/39.10/-94.58', click: true },
  { name: 'precipitation', field: 'rain', hash: '1.6/20/-30' },
  { name: 'clouds', field: 'cloud', hash: '1.6/20/30' },
  { name: 'pressure', field: 'pres', hash: '1.6/35/-20' },
  { name: 'air-quality', field: 'aq', hash: '1.6/25/70' },
  { name: 'none', field: 'none', hash: '2.6/42/-38', particles: true },
  // Satellite past the cached USGS level 16, at Brantley AL (no weather field on top)
  ...[16, 17, 18].map(z => ({ name: `satellite-brantley-z${z}`, field: 'none', basemap: 'satellite', hash: `${z}/31.585/-86.255`, wait: 6000 })),
  // the teal strip seen in the NAIP Plus layer at z16 (31.588 N, ~86.258 W), centred
  { name: 'satellite-strip-z17', field: 'none', basemap: 'satellite', hash: '17/31.588/-86.262', wait: 6000 }
];
// 7-day forecast: the same view at Now, +4 days and the end of the run (t: hours from Now, or 'end')
VIEWS.push(
  { name: 'forecast-now', field: 'temp', hash: '1.6/30/0', t: 0 },
  { name: 'forecast-4d', field: 'temp', hash: '1.6/30/0', t: 96 },
  { name: 'forecast-7d', field: 'temp', hash: '1.6/30/0', t: 'end' },
  { name: 'rain-7d', field: 'rain', hash: '1.6/20/-30', t: 'end' },
  { name: 'aq-7d', field: 'aq', hash: '1.6/25/70', t: 'end' },
  { name: 'place-panel-7d', field: 'temp', hash: '4/39.10/-94.58', t: 96, click: true },
  { name: 'phone-4d', field: 'temp', hash: '0.4/30/10', t: 96, phone: true }
);
const only = process.env.VIEWS ? process.env.VIEWS.split(',') : null;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
for (const v of VIEWS.filter(v => !only || only.some(o => v.name.startsWith(o)))) {
  const page = await browser.newPage(v.phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 800 } });
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
  // NAIP Plus tiles (satellite views): keep every response, and every failed request, so an
  // odd-coloured tile can be traced to the bytes USGS sent or to drawing.
  const naip = [], naipFailed = [];
  page.on('response', r => { if (/imagery\.nationalmap\.gov\/.*exportImage/.test(r.url())) naip.push(r.body().then(body => ({ url: r.url(), status: r.status(), type: r.headers()['content-type'] || '', body }), e => ({ url: r.url(), status: r.status(), error: String(e).slice(0, 120) }))); });
  page.on('requestfailed', r => { if (/imagery\.nationalmap\.gov/.test(r.url())) naipFailed.push({ bbox: new URL(r.url()).searchParams.get('bbox'), failure: r.failure()?.errorText }); });
  await page.addInitScript(p => localStorage.setItem('owm:prefs:v1', JSON.stringify(p)),
    { field: v.field, basemap: v.basemap || 'dark', particles: !!v.particles, opacity: 1, density: 1, tempUnit: v.tempUnit || 'C' });
  await page.goto(`${site}#map=${v.hash}`);
  await page.waitForFunction(() => window.owmMap?.getLayer('field') && window.owmMap.loaded(), null, { timeout: 60000 }).catch(() => errors.push('map not idle after 60 s'));
  if (v.t != null) { // jump to a forecast time (snapped to a frame)
    await page.evaluate(t => { const T = window.owmTest; T.state.set({ t: t === 'end' ? T.meta.hours : T.stepTime(t, 0) }); }, v.t);
    await page.waitForTimeout(1500);
  }
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
    time: [...document.querySelectorAll('[data-rel]')].map(e => e.textContent).find(Boolean) + ' · ' + ([...document.querySelectorAll('[data-abs]')].map(e => e.textContent).find(Boolean) || ''),
    legendMsg: document.querySelector('#legend')?.classList.contains('unavailable') ? document.querySelector('#legend').dataset.msg : null,
    stale: document.querySelector('#stale').hidden ? null : document.querySelector('#stale').textContent,
    updated: document.querySelector('[data-updated]')?.textContent,
    sampleLabelsVisible: [...document.querySelectorAll('[data-sample-only]')].filter(e => !e.hidden).length
  }));
  await page.screenshot({ path: `${out}/${v.name}.png` });
  const tiles = [];
  for (const [i, x] of (await Promise.all(naip)).entries()) {
    const bbox = new URL(x.url).searchParams.get('bbox')?.split(',').map(v => Math.round(+v)).join(',');
    if (!x.body) { tiles.push({ bbox, status: x.status, error: x.error }); continue; }
    const st = await page.evaluate(async ([b64, mime]) => {
      try {
        const bmp = await createImageBitmap(await (await fetch(`data:${mime};base64,${b64}`)).blob(), { premultiplyAlpha: 'none' });
        const c = new OffscreenCanvas(bmp.width, bmp.height), g = c.getContext('2d'); g.drawImage(bmp, 0, 0);
        const d = g.getImageData(0, 0, bmp.width, bmp.height).data; let r = 0, gg = 0, b = 0, a = 0;
        for (let k = 0; k < d.length; k += 4) { r += d[k]; gg += d[k + 1]; b += d[k + 2]; a += d[k + 3]; }
        const n = d.length / 4; return { w: bmp.width, rgba: [r / n, gg / n, b / n, a / n].map(Math.round) };
      } catch (e) { return { decodeError: String(e).slice(0, 100) }; }
    }, [x.body.toString('base64'), x.type.split(';')[0] || 'image/jpeg']);
    const teal = st.rgba && st.rgba[0] < 0.6 * Math.min(st.rgba[1], st.rgba[2]);
    const t = { bbox, status: x.status, type: x.type, kb: Math.round(x.body.length / 1024), ...st, teal };
    if (teal || !/jpeg/.test(x.type)) {
      mkdirSync(`${out}/naip-tiles`, { recursive: true });
      t.saved = `naip-tiles/${v.name}-${i}.${/png/.test(x.type) ? 'png' : /jpeg/.test(x.type) ? 'jpg' : 'bin'}`;
      writeFileSync(`${out}/${t.saved}`, x.body);
    }
    tiles.push(t);
  }
  report.push({ view: v.name, ...info, errors, ...(tiles.length || naipFailed.length ? { naip: tiles, naipFailed } : {}) });
  await page.close();
}
await browser.close();
writeFileSync(`${out}/views.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
