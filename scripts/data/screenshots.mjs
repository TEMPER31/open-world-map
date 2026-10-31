// Screenshots of the built site with its data, for pull-request review.
//   node scripts/data/screenshots.mjs <site-url> <out-dir>
// Needs Playwright with Chromium (CI installs a pinned version). Writes one PNG per view
// and views.json with what each view showed (legend text, probe readings, errors).
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { route as eventSamples } from './event-fixtures.mjs';

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
// Phase 3 (usability): desktop and phone. act: what to do before the screenshot.
for (const phone of [false, true]) {
  const d = phone ? 'phone' : 'desktop', h = phone ? '0.6/30/-20' : '2/35/-30';
  VIEWS.push(
    { name: `p3-${d}-default`, field: 'wind', hash: h, particles: true, phone, units: 'metric' },
    { name: `p3-${d}-us-units`, field: 'temp', hash: phone ? '3/39.1/-94.6' : '4/39.1/-94.6', phone, units: 'us', click: true, snap: 'half' },
    { name: `p3-${d}-popup`, field: 'pres', hash: phone ? '3/50/-20' : '4/50/-20', phone, click: true, snap: 'half' },
    { name: `p3-${d}-place-peek`, field: 'temp', hash: phone ? '3/51.5/-0.1' : '5/51.5/-0.1', phone, click: true, snap: 'peek' },
    { name: `p3-${d}-place-full`, field: 'temp', hash: phone ? '3/51.5/-0.1' : '5/51.5/-0.1', phone, click: true, snap: 'full' },
    { name: `p3-${d}-layers`, field: 'aq', hash: h, phone, act: 'layers' },
    { name: `p3-${d}-measure`, field: 'none', hash: phone ? '1.2/45/-40' : '3/45/-45', phone, act: 'measure' },
    { name: `p3-${d}-light`, field: 'wind', basemap: 'light', hash: h, particles: true, phone },
    // 7-day features: +0 h, +5 d (past the air-quality end), +7 d (3-hourly, rain "past 3 h")
    { name: `p3-${d}-t0`, field: 'temp', hash: h, t: 0, phone },
    { name: `p3-${d}-5d-aq`, field: 'aq', hash: phone ? '1/25/70' : '1.6/25/70', t: 120, phone },
    { name: `p3-${d}-7d-rain`, field: 'rain', hash: h, t: 'end', phone }
  );
}
// Phase 5 events: live sources (world view, a quake panel) and the saved storm sample (no live
// storm may be active): desktop and phone.
const ALL_EV = { eq: true, fv: true, st: true, ga: true };
for (const phone of [false, true]) {
  const d = phone ? 'phone' : 'desktop';
  VIEWS.push(
    { name: `p5-${d}-events-world`, field: 'none', hash: phone ? '0.4/20/0' : '1.6/20/0', phone, events: ALL_EV },
    { name: `p5-${d}-event-panel`, field: 'none', hash: phone ? '0.4/20/0' : '1.6/20/0', phone, events: ALL_EV, act: 'event', snap: 'half' },
    { name: `p5-${d}-storm-track`, field: 'wind', hash: phone ? '2.4/22/-66' : '3.4/22/-66', phone, events: { st: true }, samples: { nhc: 'storm' }, t: 30, act: 'storm', snap: 'half' },
    { name: `p5-${d}-layers-events`, field: 'temp', hash: phone ? '0.4/20/0' : '1.6/20/0', phone, events: ALL_EV, act: 'layers-events' }
  );
}
// Phase 4 street photos: with the optional CI token, live coverage at world / city / street zoom
// and an open photo at Times Square and Brantley AL; without it, the "unavailable" state.
for (const phone of [false, true]) {
  const d = phone ? 'phone' : 'desktop', z = phone ? -1 : 0;
  if (process.env.MLY_CI === '1') VIEWS.push(
    { name: `p4-${d}-coverage-world`, field: 'none', hash: `${2 + z}/30/-40`, phone, photos: true },
    { name: `p4-${d}-lines-city`, field: 'none', hash: `${12 + z}/40.758/-73.9855`, phone, photos: true },
    { name: `p4-${d}-dots-times-square`, field: 'none', hash: `${17 + z}/40.758/-73.9855`, phone, photos: true },
    { name: `p4-${d}-photo-times-square`, field: 'none', hash: `17/40.758/-73.9855`, phone, photos: true, act: 'photo', snap: 'half' },
    { name: `p4-${d}-photo-brantley`, field: 'none', hash: `16/31.585/-86.255`, phone, photos: true, act: 'photo', snap: 'half' });
  else VIEWS.push({ name: `p4-${d}-unavailable`, field: 'temp', hash: phone ? '0.4/20/0' : '1.6/20/0', phone, photos: true, act: 'layers-photos' });
}
const only = process.env.VIEWS ? process.env.VIEWS.split(',') : null;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
for (const v of VIEWS.filter(v => !only || only.some(o => v.name.startsWith(o)))) {
  const page = await browser.newPage({ timezoneId: 'America/Chicago', ...(v.phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 800 } }) });
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
  if (v.samples) await eventSamples(page, { usgs: 'live', eonet: 'live', gdacs: 'live', ...v.samples });
  await page.addInitScript(p => localStorage.setItem('owm:prefs:v1', JSON.stringify(p)),
    { events: v.events || {}, photos: !!v.photos, field: v.field, basemap: v.basemap || 'dark', particles: !!v.particles, opacity: 1, density: 1, tempUnit: v.units === 'us' ? 'F' : v.tempUnit || 'C', speedUnit: v.units === 'us' ? 'mph' : 'kmh', distUnit: v.units === 'us' ? 'mi' : 'km' });
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
    if (v.snap) { await page.evaluate(s => window.owmTest.sheets?.place.set(s), v.snap); await page.waitForTimeout(800); }
  }
  if (v.act === 'layers') { await page.evaluate(() => document.querySelector(matchMedia('(max-width: 1023px)').matches ? '[data-lyr]' : '.layers .row.on')?.scrollIntoView()); if (v.phone) { await page.tap('[data-lyr]'); await page.waitForTimeout(600); } }
  if (v.act === 'measure') {
    await page.click(v.phone ? '.m-top [data-measure]' : '.zoom [data-measure]');
    const pts = await page.evaluate(() => [[-0.1278, 51.5074], [-74.006, 40.7128], [-43.2, -22.9]].map(p => window.owmMap.project(p)));
    for (const p of pts) await page.mouse.click(box.x + p.x, box.y + p.y);
    await page.waitForTimeout(800);
  }
  if (v.act === 'event' || v.act === 'storm') { // open the panel of the largest quake, or the storm
    if (v.events) await page.waitForFunction(() => { const C = window.owmTest.events.cache; return Object.keys(C).length && Object.values(C).every(c => c.at); }, null, { timeout: 30000 }).catch(() => {});
    await page.evaluate(storm => {
      const C = window.owmTest.events.cache, i = storm ? C.nhc?.items?.[0] : [...(C.usgs?.items || [])].sort((a, b) => b.mag - a.mag)[0];
      if (!i) return;
      window.owmMap.jumpTo({ center: [i.lon, i.lat] });
      window.owmTest.state.set({ selection: { type: 'event', id: i.id, lon: i.lon, lat: i.lat } });
    }, v.act === 'storm');
    await page.waitForTimeout(1200);
    if (v.snap && v.phone) { await page.evaluate(s => window.owmTest.sheets?.place.set(s), v.snap); await page.waitForTimeout(800); }
  }
  if (v.act === 'photo') { // open the image dot nearest the centre
    await page.waitForTimeout(2500);
    const f = await page.evaluate(() => { const m = window.owmMap, c = m.getCenter(), fs = m.getLayer('mly-img') ? m.queryRenderedFeatures({ layers: ['mly-img'] }) : []; fs.sort((a, b) => Math.hypot(a.geometry.coordinates[0] - c.lng, a.geometry.coordinates[1] - c.lat) - Math.hypot(b.geometry.coordinates[0] - c.lng, b.geometry.coordinates[1] - c.lat)); return fs[0] && m.project(fs[0].geometry.coordinates); });
    if (f) { await page.mouse.click(box.x + f.x, box.y + f.y); await page.waitForTimeout(3000); }
    if (v.snap && v.phone) { await page.evaluate(s => window.owmTest.sheets?.place.set(s), v.snap); await page.waitForTimeout(800); }
  }
  if (v.act === 'layers-photos') { if (v.phone) { await page.tap('[data-lyr]'); await page.waitForTimeout(600); await page.evaluate(() => document.querySelector('#lsheet [data-photos]').scrollIntoView()); } }
  if (v.act === 'layers-events') { if (v.phone) { await page.tap('.tabs [data-lyr-tab]'); await page.waitForTimeout(800); } else await page.evaluate(() => document.querySelector('.layers [data-events]').scrollIntoView()); }
  if (!v.phone && !v.act) { await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.45); await page.waitForTimeout(400); }
  const info = await page.evaluate(() => ({
    legend: document.querySelector('#legend .lg-h')?.textContent,
    fh: document.querySelector('[data-fh]')?.textContent,
    measure: document.querySelector('#measure:not([hidden]) [data-mtotal]')?.textContent || null,
    layerTimes: window.owmTest?.layerTimes(), snap: document.querySelector('#detail:not([hidden])')?.dataset.snap || null,
    probe: document.querySelector('#probe')?.textContent,
    detail: document.querySelector('#detail:not([hidden])')?.innerText.replace(/\s+/g, ' ').trim() || null,
    time: [...document.querySelectorAll('[data-rel]')].map(e => e.textContent).find(Boolean) + ' · ' + ([...document.querySelectorAll('[data-abs]')].map(e => e.textContent).find(Boolean) || ''),
    legendMsg: document.querySelector('#legend')?.classList.contains('unavailable') ? document.querySelector('#legend').dataset.msg : null,
    stale: document.querySelector('#stale').hidden ? null : document.querySelector('#stale').textContent,
    updated: document.querySelector('[data-updated]')?.textContent,
    events: document.querySelector('.layers [data-evnote]')?.textContent, photos: document.querySelector('.layers [data-phnote]')?.textContent, photoCredit: document.querySelector('[data-photo-credit]')?.textContent || null, eventCounts: Object.fromEntries([...document.querySelectorAll('.layers [data-evs]')].map(e => [e.dataset.evs, e.textContent])),
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
