// Rendering and behaviour tests on the built site (run by CI on pull requests).
//   node scripts/data/render-tests.mjs <site-url> <out.md>
// Headless Chromium here renders WebGL in software (SwiftShader): frame rates are far below
// real hardware and are only useful for comparing before/after on the same machine.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { route as eventSamples } from './event-fixtures.mjs';
import { routePhotos, IMAGE_ID } from './photo-fixtures.mjs';
import { routeSearch } from './search-fixtures.mjs';

const [, , site = 'http://127.0.0.1:8123/', out = 'render-tests.md'] = process.argv;
const results = [];
// RT_PART=1..4 runs one part (CI runs the parts side by side): 1 = Phase 2/3, 2 = events,
// 3 = street photos, 4 = overlays. Without RT_PART every part runs.
const PART = +(process.env.RT_PART || 0);
let section = 1;
const part = () => !PART || PART === section;
const check = (name, ok, info = '') => results.push({ name, ok, info: String(info) });
// OWM_ML_DIR = local offline run: MapLibre from disk, OpenFreeMap blocked, event feeds from saved samples.
const OFFLINE = !!process.env.OWM_ML_DIR;
const blockedHosts = new Set(); // offline run: hosts whose requests were stopped
// Content Security Policy: every page any test opens reports violations (the document's
// securitypolicyviolation event and Chromium's "Content Security Policy" console messages).
const csp = [];
let cspPages = 0;
async function watchCsp(page) {
  cspPages++;
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.warn('CSP violation: ' + JSON.stringify({ directive: e.violatedDirective, blocked: e.blockedURI, source: e.sourceFile, line: e.lineNumber }))));
  page.on('console', m => { if (/CSP violation|Content.Security.Policy/i.test(m.text())) csp.push(`${page.url().replace(site, '/')}: ${m.text().slice(0, 300)}`); });
}
// The photo fixtures' stand-in thumbnail host (.invalid) is not one the site requests; the CSP allows
// Mapillary's image CDN (*.fbcdn.net), so the same stand-in image is served from an fbcdn.net name.
const THUMB = 'scontent.owm-test.fbcdn.net';
const fbcdn = page => ({ route: (pat, h) => pat.startsWith('https://scontent.mapillary-test.invalid') ? page.route(`https://${THUMB}/**`, h)
  : page.route(pat, pat.startsWith('https://graph.mapillary.com') ? r => h({ request: () => r.request(), abort: e => r.abort(e), fulfill: o => r.fulfill({ ...o, body: String(o.body).replace('scontent.mapillary-test.invalid', THUMB) }) }) : h) });
const liveName = n => OFFLINE ? `${n} [offline run: saved samples, live feeds not contacted]` : n;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Local time zone US Central, so local time and UTC differ in the time label.
const TZ = 'America/Chicago';
async function open(prefs, hash = '2/35/-20', { samples, photos, logo, search, ...ctx } = {}) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, timezoneId: TZ, ...ctx });
  await watchCsp(page);
  if (process.env.OWM_ML_DIR) { // local testing only: serve MapLibre from disk when the CDN is unreachable
    // registered first, so it only sees what no fixture serves: nothing leaves the machine
    await page.route('**/*', r => { const u = new URL(r.request().url()); if (u.origin === new URL(site).origin || u.protocol === 'data:' || u.protocol === 'blob:') return r.continue(); blockedHosts.add(u.host); return r.abort(); });
    await page.route('https://cdn.jsdelivr.net/npm/maplibre-gl@*/dist/*', r => {
      const f = new URL(r.request().url()).pathname.split('/').pop();
      r.fulfill({ body: readFileSync(`${process.env.OWM_ML_DIR}/${f}`), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
    });
    await page.route('https://tiles.openfreemap.org/**', r => r.abort()); // offline: fail fast instead of hanging
    if (!samples) await eventSamples(page, {}); // offline: event feeds come from the saved samples, never the live hosts
  }
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // requests to each third-party events / photos host (privacy: a layer that is off sends none)
  const hosts = {};
  page.on('request', r => { const h = new URL(r.url()).host; if (/usgs\.gov|nasa\.gov|gdacs\.org|weather\.noaa\.gov|nhc\.noaa\.gov|mapillary\.com/.test(h)) (hosts[h] ||= []).push(r.url()); });
  if (samples) await eventSamples(page, samples);
  if (photos) await routePhotos(fbcdn(page), photos);
  const searchLog = await routeSearch(page, search || {}); // place search: always the stand-in, never the real Photon
  if (logo) { // the owner's logo file is not in the repository: a plain grey 48 x 12 rectangle stands in for it
    await page.route('**/js/config.js', async r => { const res = await r.fetch(); r.fulfill({ response: res, body: (await res.text()).replace("export const MAPILLARY_LOGO = null;", "export const MAPILLARY_LOGO = 'img/mapillary-logo.svg';") }); });
    await page.route('**/img/mapillary-logo.svg', r => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="12"><rect width="48" height="12" fill="#888"/></svg>' }));
  }
  const reqs = [];
  page.on('request', r => { const m = r.url().match(/data\/live\/(gfs\/\w+\/f\d+|aq\/\d+)\.png/); if (m) reqs.push(m[1]); });
  // seed preferences once per tab (a reload must keep what the page saved)
  await page.addInitScript(p => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('owm:prefs:v1', JSON.stringify(p)); sessionStorage.setItem('seeded', '1'); } }, { basemap: 'dark', opacity: 1, density: 1, tempUnit: 'C', speedUnit: 'kmh', distUnit: 'km', ...prefs });
  await page.goto(`${site}#map=${hash}`);
  await page.waitForFunction(() => window.owmTest && window.owmMap?.loaded(), null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  return { page, errors, reqs, hosts, searchLog };
}

// 1. Wind direction: uniform synthetic fields; particles must move with the wind (towards).
if (part()) {
  const { page } = await open({ field: 'wind', particles: true }, '3/30/-30');
  const run = (u, v) => page.evaluate(async ([u, v]) => {
    const w = window.owmWind, nx = 480, ny = 241, rgba = new Uint8Array(nx * ny * 4);
    for (let i = 0; i < nx * ny; i++) { rgba[i * 4] = 255; rgba[i * 4 + 1] = 255; rgba[i * 4 + 3] = 255; }
    w.setWind(rgba, { nx, ny, deg: 0.75, lon0: -180, lat0: 90 }, [u, u], [v, v]);
    w.seed(); w.stop(); w.start();
    await new Promise(r => setTimeout(r, 400));
    const a = w.meanPosition();
    await new Promise(r => setTimeout(r, 2500));
    const b = w.meanPosition();
    return { dx: +(b[0] - a[0]).toFixed(4), dy: +(b[1] - a[1]).toFixed(4) };
  }, [u, v]);
  const west = await run(10, 0), south = await run(0, 10), east = await run(-10, 0);
  check('Westerly (+U only): particles move east', west.dx > 0.005 && Math.abs(west.dy) < west.dx / 3, JSON.stringify(west));
  check('Southerly (+V only): particles move north (screen up)', south.dy < -0.005 && Math.abs(south.dx) < -south.dy / 3, JSON.stringify(south));
  check('Easterly (-U only): particles move west', east.dx < -0.005, JSON.stringify(east));
  await page.close();
}

// 2. Pressure: isobars and H/L drawn by MapLibre (WebGL), no DOM markers that could lag.
const perf = {};
if (part()) {
  const { page, errors } = await open({ field: 'pres', particles: true });
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => ({
    domMarkers: document.querySelectorAll('.maplibregl-marker, .hl-plate').length,
    hlFeatures: window.owmMap.querySourceFeatures('hl').length,
    isobarsInShader: !!window.owmTest.field.iso
  }));
  check('Pressure: isobars drawn by the field shader and H/L labels are a WebGL symbol layer (no DOM markers)', st.domMarkers === 0 && st.hlFeatures > 0 && st.isobarsInShader, JSON.stringify(st));
  // During an animated pan, count the frames in which MapLibre itself rendered H/L labels: they
  // are part of each WebGL frame, so they cannot trail the map the way DOM markers did.
  const sync = await page.evaluate(() => new Promise(res => {
    const m = window.owmMap; let frames = 0, withLabels = 0;
    const f = () => { frames++; if (m.queryRenderedFeatures({ layers: ['hl'] }).length) withLabels++; };
    m.on('render', f);
    m.panBy([500, 0], { duration: 1500 });
    setTimeout(() => { m.off('render', f); res({ frames, withLabels }); }, 1600);
  }));
  check('Pressure stays in sync while panning (labels drawn in the same WebGL frame as the map)', sync.frames > 0 && sync.withLabels === sync.frames && st.domMarkers === 0, `${sync.withLabels} of ${sync.frames} pan frames rendered the H/L layer; DOM labels: ${st.domMarkers}`);
  // profiling: main-thread long tasks per hour step, and frames during a pan
  perf.pres = await profile(page);
  check('No page errors (pressure)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.close();
}
if (part()) {
  const { page } = await open({ field: 'temp', particles: true });
  perf.temp = await profile(page);
  await page.close();
}

async function profile(page) {
  return page.evaluate(async () => {
    const lt = [];
    const po = new PerformanceObserver(l => l.getEntries().forEach(e => lt.push(e.duration)));
    po.observe({ entryTypes: ['longtask'] });
    let worst = 0, last = performance.now(), go = true;
    (function f() { const n = performance.now(); worst = Math.max(worst, n - last); last = n; if (go) requestAnimationFrame(f); })();
    for (let i = 0; i < 6; i++) { window.owmTest.state.set({ t: window.owmTest.state.get('t') + 1 }); await new Promise(r => setTimeout(r, 700)); }
    go = false; po.disconnect();
    const step = { longTaskMsPerStep: Math.round(lt.reduce((a, b) => a + b, 0) / 6), worstFrameGapMs: Math.round(worst) };
    const m = window.owmMap; let n = 0; const f = () => n++; m.on('render', f);
    m.panBy([600, 0], { duration: 2000 });
    await new Promise(r => setTimeout(r, 2050));
    m.off('render', f);
    return { ...step, panFramesPerSec: +(n / 2).toFixed(1) };
  });
}

// 3. "None": field hidden, no field data fetched; particles off: no wind fetched either.
if (part()) {
  const { page, reqs, errors } = await open({ field: 'temp', particles: false });
  await page.click('.layers .row[data-field="none"]');
  await page.waitForTimeout(500);
  const n0 = reqs.length;
  for (let i = 0; i < 4; i++) { await page.evaluate(() => window.owmTest.state.set({ t: window.owmTest.state.get('t') + 1 })); await page.waitForTimeout(400); }
  const st = await page.evaluate(() => ({ visible: window.owmTest.field.visible, legend: document.querySelector('#legend').textContent, isobars: !!window.owmTest.field.iso, hl: window.owmMap.querySourceFeatures('hl').length }));
  check('None: field hidden and legend says "No layer"', !st.visible && /No layer/.test(st.legend), JSON.stringify(st));
  check('None + particles off: no data files fetched while stepping 4 hours', reqs.length === n0, `${reqs.length - n0} requests: ${reqs.slice(n0).join(', ')}`);
  await page.click('.layers .row[data-field="cloud"]'); await page.waitForTimeout(800);
  await page.click('.layers .row[data-field="cloud"]'); await page.waitForTimeout(400);
  check('Clicking the active layer again turns it off', await page.evaluate(() => window.owmTest.state.get('field') === 'none'));
  await page.reload(); await page.waitForFunction(() => window.owmTest && window.owmMap?.loaded(), null, { timeout: 60000 });
  check('"None" is remembered across reloads', await page.evaluate(() => window.owmTest.state.get('field') === 'none'));
  check('No page errors (None)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.close();
}
// 4. 7-day timeline: frames to f168 (hourly to f120, then 3-hourly), step/keys/play move frame
// to frame, the chart spans the run, rain says "past 3 h" where it applies, and air quality
// shows where its forecast ends.
if (part()) {
  const { page, errors, reqs } = await open({ field: 'temp', particles: false });
  const m = await page.evaluate(() => { const M = window.owmTest.meta; return { live: M.live, first: M.first, times: M.times, hours: M.hours, aqEnd: M.aqEnd, base: M.base }; });
  const lastF = m.first + m.times[m.times.length - 1];
  const hourly = m.times.filter(t => t + m.first <= 120).length, coarse = m.times.filter(t => t + m.first > 120);
  check('7-day: frames run to f168, hourly to f120 then every 3 h', m.live && lastF === 168 && coarse.every((t, i) => (i ? t - coarse[i - 1] : t + m.first - 120) === 3),
    `first f${m.first}, last f${lastF}, ${m.times.length} frames on the timeline (${hourly} hourly + ${coarse.length} three-hourly)`);
  const t120 = 120 - m.first;
  const stepped = await page.evaluate(async t120 => {
    const S = window.owmTest.state, out = {};
    S.set({ t: t120 }); document.querySelector('.timeline [data-step="1"]').click(); out.button = S.get('t');
    const tr = document.querySelector('[data-track="full"]'); tr.focus();
    tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); out.right = S.get('t');
    tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })); out.left = S.get('t');
    out.chip = document.querySelector('[data-stepsize]').textContent;
    return out;
  }, t120);
  check('Step button and arrow keys move to the next available frame (f120 -> f123 -> f126 -> back to f120)',
    stepped.button === t120 + 3 && stepped.right === t120 + 6 && stepped.left === t120, JSON.stringify({ ...stepped, t120 }));
  // scrubbing snaps to a frame
  const box = await page.$('[data-track="full"]').then(e => e.boundingBox());
  await page.mouse.click(box.x + box.width * 0.913, box.y + box.height / 2);
  const scrub = await page.evaluate(() => window.owmTest.state.get('t'));
  check('Scrubbing in the 3-hourly part snaps to a frame', m.times.includes(scrub), `t=${scrub} (f${scrub + m.first})`);
  // play crosses into the 3-hourly part one frame per tick
  const played = await page.evaluate(async t => {
    const S = window.owmTest.state, seen = [];
    S.set({ t }); const off = S.on(['t'], s => seen.push(s.t), { now: false }); S.set({ playing: true });
    await new Promise(r => setTimeout(r, 3000)); S.set({ playing: false }); off();
    return seen;
  }, t120 - 3);
  check('Play moves frame to frame across f120 (same speed per frame)', played.length >= 4 && played.every(t => m.times.includes(t)) && played.slice(0, 4).join() === [t120 - 2, t120 - 1, t120, t120 + 3].join(), played.slice(0, 8).join(', '));
  // rain label
  const rain = await page.evaluate(async t => { const S = window.owmTest.state; S.set({ field: 'rain', t }); await new Promise(r => setTimeout(r, 800)); const a = document.querySelector('#legend .lg-h').textContent; S.set({ t: 1 }); await new Promise(r => setTimeout(r, 300)); return [a, document.querySelector('#legend .lg-h').textContent]; }, t120 + 9);
  check('Rain legend says "past 3 h" after f120 and "past hour" before', /past 3 h/.test(rain[0]) && /past hour/.test(rain[1]), rain.join(' | '));
  // air quality end state
  const aqReqBefore = reqs.filter(r => r.startsWith('aq/')).length;
  const aq = await page.evaluate(async last => { const S = window.owmTest.state; S.set({ field: 'aq', t: last }); await new Promise(r => setTimeout(r, 1500)); const l = document.querySelector('#legend'); return { ended: l.classList.contains('ended'), unavailable: l.classList.contains('unavailable'), msg: l.dataset.msg }; }, m.hours);
  check('Air quality past its forecast end: legend dimmed with "Air quality forecast ends {date}", no stale data', aq.ended && aq.unavailable && /^Air quality forecast ends /.test(aq.msg) && reqs.filter(r => r.startsWith('aq/')).length === aqReqBefore,
    `${aq.msg} (AQ files requested at that hour: ${reqs.filter(r => r.startsWith('aq/')).length - aqReqBefore})`);
  // chart spans the run with day boundaries
  await page.evaluate(() => window.owmTest.state.set({ field: 'temp', t: 0 }));
  await page.mouse.click(box.x + 400, box.y - 300);
  await page.waitForFunction(() => document.querySelector('#detail svg path'), null, { timeout: 20000 }).catch(() => {});
  const chart = await page.evaluate(() => { const svg = document.querySelector('#detail svg'); return svg ? { days: svg.querySelectorAll('line[stroke="var(--line2)"]').length, end: [...svg.querySelectorAll('text')].pop().textContent, points: (svg.querySelector('path').getAttribute('d').match(/[ML]/g) || []).length } : null; });
  check('Place-panel chart covers the whole run with day boundaries', chart && chart.days >= 6 && chart.points >= 30, JSON.stringify(chart));
  check('No page errors (7-day timeline)', !errors.length, errors.join(' | '));
  await page.close();
}

// ---- Phase 3: one clock, timeline controls, units, pop-up, layers, measure, phone sheets ----
// Waits until every visible layer reports the page's valid time (or 8 s), and returns them.
const synced = page => page.evaluate(async () => {
  const T = window.owmTest, t0 = performance.now();
  let lt, want;
  for (;;) {
    want = new Date(T.getValidTime()).toISOString(); lt = T.layerTimes();
    if (Object.values(lt).every(v => v === want) || performance.now() - t0 > 8000) break;
    await new Promise(r => setTimeout(r, 50));
  }
  return { want, lt, ms: Math.round(performance.now() - t0), ok: Object.values(lt).every(v => v === want) };
});
// 5. Every layer shows the same valid time while stepping (pressure: field, isobars, H/L; wind
// particles; probe; place panel; chart), including the step from f120 to f123.
if (part()) {
  const { page, errors } = await open({ field: 'pres', particles: true }, '3/45/-30');
  const m = await page.evaluate(() => ({ first: window.owmTest.meta.first, times: window.owmTest.meta.times }));
  await page.mouse.click(700, 350); // place panel
  await page.mouse.move(640, 300); // probe
  const rows = [];
  const starts = [0, 120 - m.first - 2];
  for (const start of starts) {
    await page.evaluate(t => window.owmTest.state.set({ t }), start);
    await page.mouse.move(641, 301);
    await page.waitForFunction(() => !document.querySelector('#probe').hidden, null, { timeout: 10000 }).catch(() => {});
    for (let i = 0; i < 4; i++) {
      // step with the arrow key so the pointer stays on the map: the probe must follow the hour
      // without a mouse move (clicking the step button would take the pointer off the map)
      await page.keyboard.press('ArrowRight');
      const r = await synced(page);
      rows.push({ t: await page.evaluate(() => window.owmTest.state.get('t')), ...r });
    }
  }
  const layers = [...new Set(rows.flatMap(r => Object.keys(r.lt)))];
  const need = ['field', 'isobars', 'hl', 'wind', 'probe', 'panel', 'chart', 'timeline'];
  check('One clock: after each step every layer reports the same valid time (8 steps, across f120 -> f123)', rows.every(r => r.ok) && need.every(k => layers.includes(k)),
    `${rows.filter(r => r.ok).length}/${rows.length} steps in sync; layers: ${layers.join(', ')}; slowest sync ${Math.max(...rows.map(r => r.ms))} ms; t: ${rows.map(r => r.t).join(', ')}`);
  const dom = await page.evaluate(() => ({ panel: document.querySelector('[data-panel-t]')?.dataset.panelT, chart: document.querySelector('[data-chart-t]')?.dataset.chartT, probe: document.querySelector('#probe').dataset.t, t: String(window.owmTest.state.get('t')) }));
  check('Place panel, chart playhead and probe show the timeline hour (DOM)', dom.panel === dom.t && dom.chart === dom.t && dom.probe === dom.t, JSON.stringify(dom));
  const api = await page.evaluate(() => { const C = window.owmClock; let got = null; const off = C.onTime(x => { got = x; }); window.owmTest.state.set({ t: window.owmTest.stepTime(5, 0) }); off(); return { got, valid: C.getValidTime() }; });
  check('Time API for future layers: onTime() fires with {t, valid}; getValidTime() agrees', api.got && api.got.valid === api.valid, JSON.stringify(api));
  await page.keyboard.press('Escape');
  check('Esc closes the place pop-up', await page.evaluate(() => document.querySelector('#detail').hidden && !window.owmTest.state.get('selection')));
  check('No page errors (one clock)', !errors.length, errors.join(' | '));
  await page.close();
}
// 6. Timeline controls: buttons, Space and arrows, speed, local time next to UTC, "Now".
if (part()) {
  const { page, errors, reqs } = await open({ field: 'none', particles: false });
  const r = await page.evaluate(async () => {
    const S = window.owmTest.state, M = window.owmTest.meta, o = {}, wait = ms => new Promise(r => setTimeout(r, ms));
    const key = k => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    document.activeElement?.blur();
    o.t0 = S.get('t');
    document.querySelector('.timeline [data-play]').click(); o.playBtn = S.get('playing');
    document.querySelector('.timeline [data-play]').click(); o.pauseBtn = S.get('playing');
    key(' '); o.space = S.get('playing'); key(' '); o.space2 = S.get('playing');
    S.set({ t: 0 }); key('ArrowRight'); key('ArrowRight'); o.right = S.get('t'); key('ArrowLeft'); o.left = S.get('t');
    document.querySelector('.timeline [data-step="1"]').click(); o.stepBtn = S.get('t');
    // speed: frames advanced in 2 s at 1x and at 4x
    const count = async sp => { S.set({ t: 0, speed: sp }); let n = 0; const off = S.on(['t'], () => n++, { now: false }); S.set({ playing: true }); await wait(2000); S.set({ playing: false }); off(); return n; };
    o.at1 = await count(1); o.at4 = await count(4);
    S.set({ speed: 1 }); document.querySelector('[data-speed]').click(); o.chip = [S.get('speed'), document.querySelector('[data-speed]').textContent];
    S.set({ speed: 1, t: 0 });
    o.label = document.querySelector('[data-abs]').textContent; o.fh = document.querySelector('[data-fh]').textContent;
    o.base = M.base; o.nowGapMin = Math.round(Math.abs(M.base - Date.now()) / 60000); o.first = M.first;
    document.querySelector('[data-tfirst]').click(); o.utcFirst = document.querySelector('[data-abs]').textContent;
    document.querySelector('[data-tfirst]').click();
    return o;
  });
  const localH = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: TZ }).format(new Date(r.base));
  check('Play/pause button and Space toggle playing', r.playBtn === true && r.pauseBtn === false && r.space === true && r.space2 === false, JSON.stringify({ playBtn: r.playBtn, pauseBtn: r.pauseBtn, space: r.space, space2: r.space2 }));
  check('Arrow keys and step buttons move one frame', r.right === 2 && r.left === 1 && r.stepBtn === 2, JSON.stringify({ right: r.right, left: r.left, stepBtn: r.stepBtn }));
  check('Speed 4x plays about 4x as many frames as 1x; the chip cycles 1x -> 2x', r.at4 >= r.at1 * 3 && r.chip[0] === 2 && r.chip[1] === '2×', `1×: ${r.at1} frames in 2 s, 4×: ${r.at4}; chip ${r.chip.join(' ')}`);
  check('Local time is shown next to UTC (US Central), and the order can be switched', new RegExp(`^\\w+ ${localH}:00 local · .*\\d\\d:00 UTC$`).test(r.label) && /^\w+ \d\d:00 UTC · /.test(r.utcFirst),
    `"${r.label}" | UTC first: "${r.utcFirst}" (expected local hour ${localH})`);
  check('"Now" is the frame closest to the current time and says which forecast hour it is', r.nowGapMin <= 30 && r.fh === `forecast hour ${r.first}`, `Now is ${r.nowGapMin} min from the clock; label "${r.fh}"`);
  // prefetch: stepping with a field on fetches the next 2 frames, and nothing for hidden layers
  await page.evaluate(() => window.owmTest.state.set({ field: 'temp', t: 10 }));
  await page.waitForTimeout(2500);
  const f10 = await page.evaluate(() => window.owmTest.meta.first + 10);
  const got = [1, 2].map(k => `gfs/temp/f${String(f10 + k).padStart(3, '0')}`);
  check('Prefetch: the next 2 frames of the visible field are fetched; no wind (particles off) or other fields', got.every(g => reqs.includes(g)) && !reqs.some(q => /gfs\/(wind|rain|cloud|pres)\//.test(q)), `${got.map(g => `${g}: ${reqs.includes(g) ? 'fetched' : 'missing'}`).join(', ')}; other files: ${reqs.filter(q => !q.includes('/temp/')).join(', ') || 'none'}`);
  check('No page errors (timeline controls)', !errors.length, errors.join(' | '));
  await page.close();
}
// 6b. Unbuilt features say "Coming soon" (visible, not only in aria-label; search is built now, so
// it no longer does), and the Now button returns every layer to the Now frame (desktop chip and phone button).
const shown = (page, sel) => page.evaluate(s => { const e = document.querySelector(s), r = e?.getBoundingClientRect(); return !!e && e.checkVisibility() && r.width > 0 && r.height > 0 ? e.textContent.trim() : null; }, sel);
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: true, overlays: ['pres'] }, '3/45/-30');
  const soon = { search: await shown(page, '.topbar .search .soon') };
  await page.keyboard.press('Control+K'); soon.ctrlK = await page.evaluate(() => document.activeElement?.id);
  await page.keyboard.press('Escape');
  await page.mouse.click(700, 350); await page.waitForSelector('#detail [data-soon="Point download"]', { timeout: 10000 }).catch(() => {});
  soon.dataBtn = await shown(page, '#detail [data-soon="Point download"] .soon');
  soon.dataBtnLabel = await page.$eval('#detail [data-soon="Point download"]', e => e.getAttribute('aria-label')).catch(() => null);
  await page.click('#detail [data-soon="Point download"]'); soon.dataToast = await page.$eval('#toast', e => e.textContent);
  await page.keyboard.press('Escape');
  await page.click('.topbar [data-open="data"]'); soon.downloads = await shown(page, '#pop-data [data-downloads] .soon');
  soon.downloadsText = await page.$eval('#pop-data [data-downloads]', e => e.textContent.replace(/\s+/g, ' ').trim());
  await page.keyboard.press('Escape');
  check('Coming soon (desktop): visible label on "Data ↓" and the Data popover downloads line, toast says "… coming soon."; Search has no such label and Ctrl+K focuses it',
    soon.search === null && soon.ctrlK === 'q' && soon.dataBtn === 'Coming soon' && soon.downloads === 'Coming soon' && soon.dataToast === 'Point download coming soon.' && /coming soon/i.test(soon.dataBtnLabel || ''), JSON.stringify(soon));
  // Now: inactive at Now; after stepping forward, keyboard Tab-reachable, Enter returns to t = 0 and every visible layer stamps that hour
  const now = await page.evaluate(() => { const b = document.querySelector('.timeline [data-now]'); return { disabled: b.disabled, label: b.getAttribute('aria-label'), t: window.owmTest.state.get('t') }; });
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
  await synced(page);
  const fwd = await page.evaluate(() => ({ t: window.owmTest.state.get('t'), disabled: document.querySelector('.timeline [data-now]').disabled }));
  let tabbed = false;
  await page.evaluate(() => document.querySelector('.timeline [data-speed]').focus());
  await page.keyboard.press('Shift+Tab'); tabbed = await page.evaluate(() => document.activeElement?.matches('.timeline [data-now]'));
  await page.keyboard.press('Enter');
  const back = await synced(page);
  const after = await page.evaluate(() => ({ t: window.owmTest.state.get('t'), playing: window.owmTest.state.get('playing'), disabled: document.querySelector('.timeline [data-now]').disabled, rel: document.querySelector('.timeline [data-rel]').textContent }));
  const want0 = await page.evaluate(() => new Date(window.owmTest.meta.base).toISOString());
  check('Now button (desktop): inactive at Now; after 3 steps forward it is reachable with Tab, Enter returns to t = 0, and every visible layer stamps that hour',
    now.disabled && now.t === 0 && /Now/.test(now.label) && fwd.t > 0 && !fwd.disabled && tabbed && after.t === 0 && !after.playing && after.disabled && after.rel === 'Now' && back.ok && back.want === want0 && ['field', 'wind', 'ov-pres', 'hl', 'timeline'].every(k => k in back.lt),
    JSON.stringify({ now, fwd, tabbed, after, layers: back.lt }));
  check('No page errors (Coming soon, Now)', !errors.length, errors.join(' | '));
  await page.close();
}
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '1/30/-30', { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const search = await page.evaluate(() => ({ soon: !!document.querySelector('.m-search .soon'), field: document.querySelector('.m-search input')?.getAttribute('role') }));
  const b0 = await page.$eval('.m-scrub [data-now]', e => { const r = e.getBoundingClientRect(), s = document.querySelector('.m-scrub').getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), disabled: e.disabled, aboveScrub: r.bottom <= s.top, visible: e.checkVisibility() }; });
  await page.tap('.m-scrub [data-step="1"]'); await page.tap('.m-scrub [data-step="1"]');
  const t1 = await page.evaluate(() => window.owmTest.state.get('t'));
  await page.tap('.m-scrub [data-now]');
  const back = await synced(page);
  const t2 = await page.evaluate(() => ({ t: window.owmTest.state.get('t'), disabled: document.querySelector('.m-scrub [data-now]').disabled, scrubW: Math.round(document.querySelector('[data-track="mini"]').getBoundingClientRect().width) }));
  check('Phone (375 px): Search pill is a search field (no "Coming soon"); Now button is 44 px+, sits above the scrubber, is inactive at Now and returns to t = 0 after stepping',
    !search.soon && search.field === 'combobox' && b0.w >= 44 && b0.h >= 44 && b0.disabled && b0.aboveScrub && b0.visible && t1 > 0 && t2.t === 0 && t2.disabled && back.ok, JSON.stringify({ search, b0, t1, t2, layers: back.lt }));
  check('No page errors (phone Now)', !errors.length, errors.join(' | '));
  await page.close();
}
const FRESH = { src: /NOAA GFS|CAMS via Open-Meteo|Sample data/, time: /Updated \d\d:\d\d UTC|generated, no update time/, grid: /\d(\.\d+)?° grid/ };
const freshOk = t => FRESH.src.test(t) && FRESH.time.test(t) && FRESH.grid.test(t) && !/\blive\b/i.test(t);
// 6c. Freshness labels: every visible weather layer (field, overlays, particles) has a legend line with
// source, update time (or why there is none) and grid; the live wording, checked with a synthetic
// manifest (with and without the optional NOMADS / AWS hour lists); satellite imagery dates and tiles.
if (part()) {
  const { page, errors } = await open({ field: 'wind', particles: true, overlays: ['cloud', 'pres'] }, '5/38/-95');
  const lines = async () => { await page.waitForTimeout(300); return page.evaluate(() => Object.fromEntries([...document.querySelectorAll('#legend [data-fresh]')].map(e => [e.dataset.fresh, e.textContent]))); };
  const dom = { 'wind+cloud+pres': await lines() };
  const layers1 = await synced(page).then(r => Object.keys(r.lt));
  for (const f of ['temp', 'rain', 'aq', 'cloud', 'pres', 'none']) { await page.evaluate(f => window.owmTest.state.set({ field: f, overlays: [], particles: true }), f); dom[f + '+particles'] = await lines(); }
  const need = { 'wind+cloud+pres': ['wind', 'ov-cloud', 'ov-pres'], 'temp+particles': ['temp', 'particles'], 'none+particles': ['particles'] };
  const domOk = Object.entries(dom).every(([k, v]) => Object.keys(v).length && Object.values(v).every(freshOk) && (need[k] || []).every(n => n in v));
  const live = await page.evaluate(async () => {
    const F = await import('./js/fresh.js'), H = 3600e3, run = Date.UTC(2026, 10, 5, 18);
    const base = { live: true, run, generated: run + 4 * H + 47 * 60e3, gfs: { grid: { deg: 0.5 }, wind_grid: { deg: 0.75 } }, aq: { grid: { deg: 4 } }, aqGenerated: Date.UTC(2026, 10, 5, 10, 52), aqEnd: Date.UTC(2026, 10, 9, 0) };
    const withHosts = { ...base, gfs: { ...base.gfs, nomads_hours: [0, 1, 2], aws_hours: [3] } };
    const out = {};
    for (const k of ['wind', 'temp', 'rain', 'cloud', 'pres', 'aq']) out[k] = F.fieldFresh(base, k);
    out.overlay = F.fieldFresh(base, 'cloud', 'Clouds overlay'); out.hosts = F.fieldFresh(withHosts, 'temp'); out.noAq = F.fieldFresh({ ...base, aq: null }, 'aq');
    out.place = F.placeFresh(base);
    return out;
  });
  const liveOk = ['wind', 'temp', 'rain', 'cloud', 'pres', 'aq'].every(k => freshOk(live[k].text)) && live.temp.text === 'NOAA GFS · run 18Z 5 Nov · Updated 22:47 UTC · 0.5° grid' && live.wind.text.endsWith('· 0.75° grid')
    && /0\.5° grid, area average$/.test(live.cloud.text) && /^CAMS via Open-Meteo · Updated 10:52 UTC 5 Nov · 4° grid · forecast ends Mon 9 Nov · 00:00 UTC$/.test(live.aq.text) && /^Clouds overlay: NOAA GFS/.test(live.overlay.text)
    && /NOMADS: 3, from the AWS mirror: 1/.test(live.hosts.title) && !/NOMADS/.test(live.temp.title) && /unavailable/.test(live.noAq.text) && /Updated 22:47 UTC: 0\.5° grid \(wind 0\.75° grid\) · air quality CAMS via Open-Meteo, Updated 10:52 UTC 5 Nov, 4° grid/.test(live.place);
  // satellite at regional zoom over the US: GIBS (daily date) and EOX (2016 mosaic), each with its tile levels
  await page.evaluate(() => window.owmTest.state.set({ basemap: 'satellite' })); await page.waitForTimeout(800);
  const sat = await page.evaluate(() => [...document.querySelectorAll('.layers [data-satfresh]')].map(e => e.textContent)[0] || '');
  const yday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const satOk = sat.includes(`NASA GIBS VIIRS true colour · ${yday} (daily`) && /EOX Sentinel-2 cloudless · 2016 mosaic/.test(sat) && (sat.match(/tiles to zoom \d+/g) || []).length === 2;
  await page.evaluate(() => window.owmTest.state.set({ basemap: 'dark' })); await page.waitForTimeout(300);
  const satOff = await page.evaluate(() => document.querySelector('.layers [data-satfresh]').textContent);
  check('Freshness: each visible weather layer (field, overlays, particles) shows source, update time (or "generated, no update time") and grid; live wording with a synthetic manifest; satellite dates and tile levels',
    domOk && liveOk && satOk && satOff === '' && ['field', 'wind', 'ov-cloud', 'ov-pres'].every(k => layers1.includes(k)), JSON.stringify({ dom, live, sat, satOff, layers1 }).slice(0, 2500));
  check('No page errors (freshness)', !errors.length, errors.join(' | '));
  await page.close();
}
// 7. Units: one setting everywhere, converted for display only, remembered after reload.
if (part()) {
  const { page, errors } = await open({ field: 'wind', particles: false, tempUnit: 'C' }, '4/45/-30');
  await page.mouse.click(640, 400); await page.waitForTimeout(2500);
  await page.click('[data-open="settings"]'); await page.click('#pop-settings [data-preset="us"]'); await page.keyboard.press('Escape');
  await page.mouse.click(640, 400); await page.waitForTimeout(2500);
  await page.mouse.move(700, 380); await page.waitForTimeout(1200);
  const us = await page.evaluate(() => ({
    probe: document.querySelector('#probe').textContent,
    panel: [...document.querySelectorAll('.stat')].slice(0, 2).map(e => e.innerText.replace(/\s+/g, ' ')).join(' | '),
    chart: document.querySelector('#detail .d-sec .kick')?.textContent,
    legend: document.querySelector('#legend').textContent,
    scale: document.querySelector('#scale span').textContent,
    raw: window.owmTest.reading(null, 'wind'), // data stays metric
    ticks: [...document.querySelectorAll('#legend .lg-t span')].map(e => e.textContent).join(' ')
  }));
  await page.click('.zoom [data-measure]');
  const [a, b] = await page.evaluate(() => [window.owmMap.project([-30, 45]), window.owmMap.project([-25, 45])]);
  await page.mouse.click(a.x, a.y); await page.mouse.click(b.x, b.y);
  us.measure = await page.evaluate(() => document.querySelector('[data-mtotal]').textContent);
  await page.keyboard.press('Escape');
  check('US units everywhere: probe, place panel, chart, legend ticks, scale bar, measure tool', /mph/.test(us.probe) && /mph/.test(us.panel) && /°F/.test(us.panel) && /°F/.test(us.chart) && /mph/.test(us.chart) && /mph/.test(us.legend) && / (mi|ft)$/.test(us.scale) && / mi$/.test(us.measure) && /^0 12 25 37 50 62 93\+$/.test(us.ticks), JSON.stringify(us));
  await page.reload(); await page.waitForFunction(() => window.owmTest && window.owmMap?.loaded(), null, { timeout: 60000 });
  const kept = await page.evaluate(() => ({ t: window.owmTest.state.get('tempUnit'), s: window.owmTest.state.get('speedUnit'), d: window.owmTest.state.get('distUnit'), preset: document.querySelector('[data-preset][aria-checked="true"]')?.dataset.preset }));
  check('Units are remembered after reload', kept.t === 'F' && kept.s === 'mph' && kept.d === 'mi' && kept.preset === 'us', JSON.stringify(kept));
  await page.evaluate(() => { document.querySelector('[data-open="settings"]').click(); document.querySelector('#pop-settings [data-sunit="kn"]').click(); });
  check('Custom mix (knots with °F) shows the "Custom" preset', await page.evaluate(() => document.querySelector('[data-preset][aria-checked="true"]')?.dataset.preset === 'custom'));
  check('No page errors (units)', !errors.length, errors.join(' | '));
  await page.close();
}
// 8. Measure tool: London -> New York by clicking, within 0.5 % of 5,570 km; no place panel.
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '3/45/-45');
  await page.click('.zoom [data-measure]');
  const pts = await page.evaluate(() => [window.owmMap.project([-0.1278, 51.5074]), window.owmMap.project([-74.006, 40.7128])]);
  for (const p of pts) await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(300);
  const m = await page.evaluate(() => ({ km: +document.querySelector('[data-mtotal]').dataset.km, text: document.querySelector('[data-mtotal]').textContent, panel: !document.querySelector('#detail').hidden, legs: document.querySelectorAll('[data-mlegs] li').length, drawn: window.owmMap.querySourceFeatures('measure').length, dom: document.querySelectorAll('.maplibregl-marker').length }));
  check('Measure: London -> New York within 0.5 % of 5,570 km, drawn as a GeoJSON layer, place panel not opened', Math.abs(m.km - 5570) / 5570 <= 0.005 && !m.panel && m.legs === 1 && m.drawn > 0 && m.dom === 0,
    `${m.text} (${m.km.toFixed(1)} km, ${((m.km - 5570) / 5570 * 100).toFixed(2)} %); place panel open: ${m.panel}; features: ${m.drawn}; DOM markers: ${m.dom}`);
  await page.click('#measure [data-dunit="mi"]');
  const mi = await page.evaluate(() => document.querySelector('[data-mtotal]').textContent);
  check('Measure km/mi toggle updates the page-wide unit (3,461 mi ± 0.5 %)', /mi$/.test(mi) && Math.abs(parseFloat(mi.replace(/,/g, '')) - 3461) / 3461 <= 0.005 && await page.evaluate(() => window.owmTest.state.get('distUnit') === 'mi'), mi);
  await page.click('[data-mundo]');
  const undo = await page.evaluate(() => document.querySelector('[data-mtotal]').textContent);
  await page.keyboard.press('Escape');
  const off = await page.evaluate(() => ({ on: window.owmTest.state.get('measuring'), hidden: document.querySelector('#measure').hidden, features: window.owmMap.querySourceFeatures('measure').length }));
  check('Undo removes the last point; Esc exits the measure tool', undo === '—' && !off.on && off.hidden, `after undo: ${undo}; after Esc: ${JSON.stringify(off)}`);
  check('No page errors (measure)', !errors.length, errors.join(' | '));
  await page.close();
}
// 9. Layers rail: only the selected field is expanded (legend + options); None collapses all.
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false });
  const open1 = await page.evaluate(() => [...document.querySelectorAll('[data-lx]')].filter(e => !e.hidden).map(e => e.dataset.lx + (e.querySelector('#legend') ? '+legend' : '')));
  await page.click('.layers .row[data-field="none"]');
  const none = await page.evaluate(() => ({ open: [...document.querySelectorAll('[data-lx]')].filter(e => !e.hidden).length, legend: document.querySelector('#legend').textContent }));
  await page.click('.layers .row[data-field="pres"]'); await page.click('.layers .row[data-field="pres"]');
  const toggled = await page.evaluate(() => window.owmTest.state.get('field'));
  check('Layers rail: only the selected field is expanded, with its legend; None collapses all; clicking the active row turns it off', open1.join() === 'temp+legend' && none.open === 0 && /No layer/.test(none.legend) && toggled === 'none', JSON.stringify({ open1, none, toggled }));
  check('No page errors (layers)', !errors.length, errors.join(' | '));
  await page.close();
}
// 10. Phone: 44 px targets, sheets (place: peek/half/full; layers half <= 40 % of the map), and
// nothing over the map's centre in the default view.
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '1/30/-30', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const box = s => page.$eval(s, e => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width), bottom: Math.round(r.bottom) }; });
  const targets = await page.evaluate(() => [...document.querySelectorAll('.m-scrub button, .m-top button, [data-track="mini"]')].map(e => { const r = e.getBoundingClientRect(); return { el: e.dataset.step ? 'step' : e.dataset.track ? 'track' : e.className.split(' ')[0], w: Math.round(r.width), h: Math.round(r.height) }; }));
  const centre = await page.evaluate(() => { const els = [...document.querySelectorAll('.m-top, .m-field, .m-scrub, .credits, .tabs')]; const cx = innerWidth / 2, cy = (innerHeight - document.querySelector('.tabs').offsetHeight) / 2; return els.filter(e => { const r = e.getBoundingClientRect(); return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom; }).map(e => e.className); });
  check('Phone: buttons and scrubber are at least 44 px; nothing covers the map centre', targets.every(t => t.h >= 44 && (t.el === 'track' ? t.w > 300 : t.w >= 44)) && !centre.length, `${JSON.stringify(targets)}; over the centre: ${centre.join(', ') || 'none'}`);
  const mapH = 844 - (await box('.tabs')).h;
  await page.tap('[data-lyr]'); await page.waitForTimeout(400);
  const ls = await box('#lsheet');
  await page.tap('[data-lyr-close]');
  check('Phone layers sheet: half-open covers at most ~40 % of the map, with a drag handle', ls.h / mapH <= 0.41 && await page.$('#lsheet .grab') != null, `${ls.h} of ${mapH} px (${(ls.h / mapH * 100).toFixed(1)} %)`);
  await page.touchscreen.tap(200, 380); await page.waitForTimeout(1500);
  const snaps = {};
  for (const s of ['peek', 'half', 'full']) { await page.evaluate(s => document.querySelector('#detail').dataset.snap !== s && 0, s); snaps[s] = { ...(await box('#detail')), snap: await page.$eval('#detail', e => e.dataset.snap) }; await page.tap('#detail .grab'); await page.waitForTimeout(400); }
  check('Phone place sheet: peek, half and full (tap the handle to step)', snaps.peek.snap === 'peek' && snaps.half.snap === 'half' && snaps.full.snap === 'full' && snaps.peek.h < snaps.half.h && snaps.half.h < snaps.full.h, JSON.stringify(snaps));
  // drag the handle down from full to peek
  const g = await box('#detail .grab');
  await page.evaluate(() => document.querySelector('#detail').dataset.snap = 'full');
  await page.waitForTimeout(300);
  const g2 = await box('#detail .grab');
  const cdp = await page.context().newCDPSession(page);
  const tp = y => [{ x: 195, y }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(g2.top + 10) });
  for (let y = g2.top + 30; y < 780; y += 40) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(y) });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(400);
  check('Phone place sheet: dragging the handle down snaps to peek', await page.$eval('#detail', e => e.dataset.snap) === 'peek', await page.$eval('#detail', e => e.dataset.snap));
  check('No page errors (phone)', !errors.length, errors.join(' | '));
  await page.close();
}

// ---- Phase 5: natural events --------------------------------------------------------------
section = 2;
const evCount = hosts => Object.values(hosts).reduce((a, b) => a + b.length, 0);
const evWait = page => page.waitForFunction(() => { const C = window.owmTest.events.cache; return Object.keys(C).length && Object.values(C).every(c => c.at); }, null, { timeout: 30000 }).catch(() => {});
// 11. Privacy: all event types off by default = no request to any event host, while stepping
// and after a reload; each toggle contacts only its own source; off again = no more requests.
if (part()) {
  const { page, errors, hosts } = await open({ field: 'temp', particles: false });
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
  const off0 = evCount(hosts);
  const perType = {};
  for (const [k, re] of [['eq', /usgs/], ['fv', /nasa/], ['ga', /gdacs/], ['st', /noaa|nasa/]]) {
    for (const h in hosts) delete hosts[h];
    await page.click(`.layers [data-ev="${k}"]`); await evWait(page); await page.waitForTimeout(800);
    const got = Object.keys(hosts);
    await page.click(`.layers [data-ev="${k}"]`);
    for (const h in hosts) delete hosts[h];
    for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
    perType[k] = { hosts: got, onlyOwn: got.length > 0 && got.every(h => re.test(h)), afterOff: evCount(hosts) };
  }
  check('Events off (default): 0 requests to USGS, NASA, GDACS or NOAA while stepping the timeline', off0 === 0, `${off0} requests`);
  const style = () => page.evaluate(() => { const st = window.owmMap.getStyle(); return { sources: Object.keys(st.sources).filter(k => /^(events|nhc|nhc-now|ev-sel)$/.test(k)).length, layers: st.layers.filter(l => /^(ev-|nhc-)/.test(l.id)).length, images: window.owmMap.listImages().filter(i => i.startsWith('ev-')).length }; });
  const offStyle = await style();
  await page.click('.layers [data-ev="eq"]'); await evWait(page);
  const onStyle = await style();
  await page.click('.layers [data-ev="eq"]'); await page.waitForTimeout(300);
  const offAgain = await style();
  for (const h in hosts) delete hosts[h];
  check('Events off cost nothing: no event sources, layers or icons on the map; added when a type is turned on, removed when the last is turned off', offStyle.sources + offStyle.layers + offStyle.images === 0 && onStyle.layers === 7 && onStyle.sources === 4 && offAgain.sources + offAgain.layers + offAgain.images === 0, JSON.stringify({ offStyle, onStyle, offAgain }));
  check('Each event toggle contacts only its own source, and 0 requests after it is turned off', Object.values(perType).every(x => x.onlyOwn && x.afterOff === 0), JSON.stringify(perType));
  await page.click('.layers [data-ev="eq"]'); await page.click('.layers [data-evwin="24h"]');
  await page.reload(); await page.waitForFunction(() => window.owmTest && window.owmMap?.loaded(), null, { timeout: 60000 });
  check('Event toggles and the 24 h / 7 d choice are remembered across reloads', await page.evaluate(() => { const s = window.owmTest.state.get(); return s.events.eq && !s.events.st && s.evWin === '24h'; }));
  check('No page errors (events privacy)', !errors.length, errors.join(' | '));
  await page.close();
}
// 12. Live sources: each type shows real events (CI has network); counts and update times.
if (part()) {
  const { page, errors } = await open({ field: 'none', particles: false, events: { eq: true, fv: true, st: true, ga: true } }, '1.6/20/0');
  await evWait(page); await page.waitForTimeout(1500);
  const live = await page.evaluate(() => ({ rows: Object.fromEntries([...document.querySelectorAll('.layers [data-evs]')].map(e => [e.dataset.evs, e.textContent])), note: document.querySelector('.layers [data-evnote]').textContent,
    drawn: window.owmMap.queryRenderedFeatures({ layers: ['ev-eq', 'ev-pt'] }).length, credits: document.querySelector('#credits').textContent, errors: Object.fromEntries(Object.entries(window.owmTest.events.cache).map(([k, c]) => [k, c.error || null])) }));
  check(liveName('Live events: earthquakes, wildfires & volcanoes and disaster alerts load from their sources and are drawn'), +live.rows.eq > 0 && /^\d+$|none/.test(live.rows.fv) && +live.rows.ga > 0 && live.drawn > 0, JSON.stringify(live));
  check(liveName('Live storms: NHC answered (a storm count or "none active"), credits list every source in use'), /^\d+$|none active/.test(live.rows.st) && ['USGS', 'NASA EONET', 'GDACS', 'NOAA NHC'].every(c => live.credits.includes(c)), `${live.rows.st}; ${live.credits}`);
  // the panel of the largest quake: magnitude, depth in the chosen unit, source link
  const panel = await page.evaluate(async () => {
    const i = [...(window.owmTest.events.cache.usgs.items || [])].sort((a, b) => b.mag - a.mag)[0];
    if (!i) return { id: null, x: 0, y: 0 };
    window.owmMap.jumpTo({ center: [i.lon, i.lat], zoom: 4 }); await new Promise(r => window.owmMap.once('idle', r));
    const p = window.owmMap.project([i.lon, i.lat]);
    return { id: i.id, x: p.x, y: p.y };
  });
  await page.mouse.click(panel.x, panel.y); await page.waitForTimeout(600);
  const shown = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection'), title: document.querySelector('#detail .d-title')?.textContent, text: document.querySelector('#detail')?.innerText.replace(/\s+/g, ' '), link: document.querySelector('#detail a.btn')?.href, pin: document.querySelectorAll('.maplibregl-marker').length }));
  check(liveName('Click a live earthquake: the event panel opens (title, time local + UTC, magnitude, depth, source link)'), shown.sel?.id === panel.id && /local · .*UTC/.test(shown.text) && /Magnitude/.test(shown.text) && /Depth \d[\d.,]* km/.test(shown.text) && /^https:\/\/earthquake\.usgs\.gov\//.test(shown.link) && shown.pin === 0, JSON.stringify(shown).slice(0, 600));
  await page.evaluate(() => window.owmTest.state.set({ distUnit: 'mi' }));
  check('Event panel depth follows the distance unit (km -> mi)', await page.evaluate(() => /Depth \d[\d.,]* (mi|ft)/.test(document.querySelector('#detail').innerText.replace(/\s+/g, ' '))));
  await page.keyboard.press('Escape');
  check('Esc closes the event panel', await page.evaluate(() => document.querySelector('#detail').hidden && !window.owmTest.state.get('selection')));
  check(liveName('No page errors (live events)'), !errors.length, errors.join(' | '));
  await page.close();
}
// 13. Saved samples: panel rule with places and the measure tool, storm follows the slider,
// one clock includes the event layers, "unavailable" and "no active storms" states.
if (part()) {
  const { page, errors } = await open({ field: 'pres', particles: true, events: { eq: true, fv: true, st: true, ga: true } }, '3/22/-66', { samples: { nhc: 'storm' } });
  await evWait(page); await page.waitForTimeout(800);
  const P = pt => page.evaluate(([lo, la]) => window.owmMap.project([lo, la]), pt);
  // storm marker at t = 0 (current position), +30 h (between points), past the last point (hidden)
  const st = await page.evaluate(async () => {
    const T = window.owmTest, S = T.state, out = {}, P = T.events.cache.nhc.storms[0].pts;
    for (const t of [0, 30, T.meta.hours]) { S.set({ t: T.stepTime(t, 0) }); await new Promise(r => setTimeout(r, 300)); out[t] = { at: T.events.stormAt('nhc:AT1'), stamp: T.layerTimes().storms }; }
    out.lastPoint = new Date(P.at(-1).at).toISOString(); out.want30 = (() => { const v = T.meta.base + T.stepTime(30, 0) * 3600e3, k = P.findIndex(p => p.at >= v), a = P[k - 1], b = P[k], f = (v - a.at) / (b.at - a.at); return [a.lon + (b.lon - a.lon) * f, a.lat + (b.lat - a.lat) * f]; })();
    S.set({ t: 0 });
    return out;
  });
  const near = (a, b) => a && b && Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;
  check('Storm position follows the slider: at the forecast point for Now, interpolated at +30 h, hidden past the last forecast point', st[0].at && near(st[30].at, st.want30) && !near(st[0].at, st[30].at) && st[Object.keys(st).find(k => +k > 30)].at === null,
    JSON.stringify(st));
  // click the storm marker: event panel; click a plain spot: the place panel replaces it
  const sp = await P(await page.evaluate(() => window.owmTest.events.stormAt('nhc:AT1')));
  await page.mouse.click(sp.x, sp.y); await page.waitForTimeout(500);
  const a = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection'), title: document.querySelector('#detail .d-title')?.textContent }));
  await page.mouse.click(300, 650); await page.waitForTimeout(500);
  const b = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection')?.type, panel: document.querySelector('#detail .kick')?.textContent }));
  check('Click a storm: storm panel opens; then a place click replaces it (one panel, last click wins)', a.sel?.id === 'nhc:AT1' && /Testa/.test(a.title) && b.sel === 'place' && /Place/.test(b.panel), JSON.stringify({ a, b }));
  // measure tool blocks event clicks
  await page.keyboard.press('Escape');
  await page.click('.zoom [data-measure]');
  await page.mouse.click(sp.x, sp.y); await page.waitForTimeout(300);
  const m = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection'), pts: document.querySelector('[data-mhint]').textContent, hidden: document.querySelector('#detail').hidden }));
  await page.keyboard.press('Escape');
  check('Measure tool on: clicking an event adds a point and opens no panel', !m.sel && m.hidden && /^1 point/.test(m.pts), JSON.stringify(m));
  // one clock with event layers: every layer reports the same time after each step
  await page.mouse.click(sp.x, sp.y); await page.mouse.move(640, 300);
  const rows = [];
  for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); rows.push(await synced(page)); }
  const layers = [...new Set(rows.flatMap(r => Object.keys(r.lt)))];
  check('One clock includes the event layers (events, storms) with field, isobars, H/L, wind, timeline', rows.every(r => r.ok) && ['events', 'storms', 'field', 'wind', 'timeline'].every(k => layers.includes(k)), `${rows.filter(r => r.ok).length}/4 in sync; layers: ${layers.join(', ')}`);
  check('No page errors (event samples)', !errors.length, errors.join(' | '));
  await page.close();
}
// 13b. GDACS panel (owner decision C3): no "indicative only" caveat; the last update and the credit stay.
if (part()) {
  const { page, errors } = await open({ field: 'none', particles: false, events: { ga: true } }, '2/20/0', { samples: {} });
  await evWait(page);
  const g = await page.evaluate(async () => {
    const i = window.owmTest.events.cache.gdacs?.items?.[0];
    if (!i) return null;
    window.owmTest.state.set({ selection: { type: 'event', id: i.id, lon: i.lon, lat: i.lat } });
    await new Promise(r => setTimeout(r, 300));
    return { id: i.id, text: document.querySelector('#detail:not([hidden])')?.innerText.replace(/\s+/g, ' ') || '' };
  });
  const ef = await page.evaluate(async () => { window.owmTest.state.set({ selection: null, events: { eq: true, fv: true, st: true, ga: true } }); await new Promise(r => setTimeout(r, 2500)); return document.querySelector('.layers [data-evfresh]').textContent.split('\n'); });
  check('Event freshness: one line per source in use with the time this browser fetched it, the newest item (GDACS: latest update) and "no grid"',
    ef.length === 4 && ef.every(l => /fetched \d\d:\d\d UTC/.test(l) && /no grid/.test(l)) && /^USGS earthquakes · fetched .* · newest event \d\d:\d\d UTC \d+ \w+ · point locations, no grid$/.test(ef.find(l => l.startsWith('USGS')) || '') && /newest update/.test(ef.find(l => l.startsWith('GDACS')) || '') && /NOAA NHC storms · fetched .* forecast points, no grid$/.test(ef.find(l => l.startsWith('NOAA')) || ''), JSON.stringify(ef));
  check('GDACS event panel: no "indicative" wording; "Last update" row and the GDACS credit remain', g && !/indicative/i.test(g.text) && /Last update/.test(g.text) && /Alerts: GDACS \(EC JRC, UN OCHA\)/.test(g.text) && !errors.length, JSON.stringify(g).slice(0, 400));
  await page.close();
}
if (part()) {
  const { page, errors } = await open({ field: 'none', particles: false, events: { eq: true, fv: true, st: true, ga: true } }, '2/20/0', { samples: { usgs: 'down', eonet: 'down', gdacs: 'empty', nhc: 'none' } });
  await evWait(page); await page.waitForTimeout(500);
  const r = await page.evaluate(() => ({ rows: Object.fromEntries([...document.querySelectorAll('.layers [data-evs]')].map(e => [e.dataset.evs, e.textContent])), note: document.querySelector('.layers [data-evnote]').textContent }));
  check('A source that is down or empty shows a clear state ("unavailable", "none", "No active storms") and no page errors',
    r.rows.eq === 'unavailable' && r.rows.fv === 'unavailable' && r.rows.ga === 'none' && r.rows.st === 'none active' && /Earthquakes: unavailable/.test(r.note) && /No active storms/.test(r.note) && !errors.length, JSON.stringify(r) + (errors.length ? ' errors: ' + errors.join(' | ') : ''));
  await page.close();
}

// ---- Overlays: main field + up to 2 overlays --------------------------------------------
section = 4;
// ---- Phase 6 pages and footer ----------------------------------------------------------------
const PAGES = ['about.html', 'data.html', 'sources.html', 'privacy.html', '404.html'];
// A static page (no map). 404.html uses the published project path, mapped to this server here.
async function openPage(path, ctx = {}) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, ...ctx });
  await watchCsp(page);
  if (process.env.OWM_ML_DIR) await page.route('**/*', r => { const u = new URL(r.request().url()); if (u.origin === new URL(site).origin) return r.continue(); blockedHosts.add(u.host); return r.abort(); });
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.route(`${new URL(site).origin}/open-world-map/**`, r => r.continue({ url: r.request().url().replace('/open-world-map/', '/') }));
  await page.goto(new URL(path, site).href);
  await page.waitForLoadState('load');
  return { page, errors, failed };
}
const rect = (page, sel) => page.evaluate(s => [...document.querySelectorAll(s)].filter(e => e.checkVisibility()).map(e => { const r = e.getBoundingClientRect(); return { sel: s, l: r.left, t: r.top, r: r.right, b: r.bottom }; }), sel);
const overlap = (a, b) => a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5;
if (part()) {
  // map footer (desktop): four links, clear of the timeline, credits, zoom, scale, legend and the rail's last row, rail open and minimised
  const { page, errors } = await open({ field: 'temp', particles: false, events: { eq: true, fv: true, st: true, ga: true }, photos: true }, '2/35/-20', { samples: {}, photos: {} });
  const foot = async () => {
    const f = (await rect(page, '.sitefoot'))[0];
    const others = (await Promise.all(['.timeline', '#credits', '.zoom', '#scale', '#legend:not(.docked)', '.layers .lfoot', '.measure'].map(s => rect(page, s)))).flat();
    await page.evaluate(() => { const l = document.querySelector('#layers'); l.scrollTop = l.scrollHeight; });
    const lf = (await rect(page, '.layers .lfoot'))[0];
    return { f, hits: others.filter(o => f && overlap(f, o)).map(o => o.sel), lfootAbove: !lf || lf.b <= f.t + 0.5 };
  };
  const links = await page.$$eval('.sitefoot a', as => as.map(a => [a.textContent, a.getAttribute('href')]));
  const open1 = await foot();
  await page.click('[data-lmin]'); await page.waitForTimeout(300);
  const min = await foot();
  await page.click('[data-lmin]');
  await page.setViewportSize({ width: 1024, height: 768 }); await page.waitForTimeout(500);
  const narrow = await foot();
  check('Map footer (desktop): About · Data · Sources & licences · Privacy & disclaimer, covering no control, the credits strip, the timeline or the rail\'s last row (1280 px rail open / minimised, 1024 px)',
    links.map(l => l[1]).join() === 'about.html,data.html,sources.html,privacy.html' && [open1, min, narrow].every(x => x.f && !x.hits.length && x.lfootAbove), JSON.stringify({ links, open1, min, narrow }));
  check('No page errors (map footer)', !errors.length, errors.join(' | '));
  await page.close();
}
if (part()) {
  // phone: the Data and Settings sheets end with the four links, 44 px targets, above the tab bar
  const { page, errors } = await open({ field: 'temp', particles: false }, '1/30/-30', { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const out = {};
  for (const tab of ['data', 'settings']) {
    await page.tap(`.tabs [data-open="${tab}"]`); await page.waitForTimeout(400);
    await page.evaluate(t => document.querySelector(`#pop-${t} .popfoot`).scrollIntoView({ block: 'nearest' }), tab);
    out[tab] = await page.evaluate(t => { const tabs = document.querySelector('.tabs').getBoundingClientRect(); return [...document.querySelectorAll(`#pop-${t} .popfoot a`)].map(a => { const r = a.getBoundingClientRect(); return { href: a.getAttribute('href'), h: Math.round(r.height), visible: a.checkVisibility() && r.bottom <= tabs.top + 0.5 }; }); }, tab);
    await page.tap(`#pop-${tab} [data-close]`);
  }
  const hidden = await page.$eval('.sitefoot', e => !e.checkVisibility());
  check('Map footer (phone 375 px): the Data and Settings sheets end with the four page links, each 44 px tall and above the tab bar; the desktop strip is hidden',
    hidden && Object.values(out).every(ls => ls.map(l => l.href).join() === 'about.html,data.html,sources.html,privacy.html' && ls.every(l => l.h >= 44 && l.visible)), JSON.stringify({ hidden, ...out }));
  check('No page errors (phone footer)', !errors.length, errors.join(' | '));
  await page.close();
}
if (part()) {
  // every page: loads with its styles, has a title and the footer's four links, and no sideways scroll on a phone
  const rows = {};
  for (const p of PAGES) for (const phone of [false, true]) {
    const { page, errors, failed } = await openPage(p, phone ? { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } : {});
    const r = await page.evaluate(() => ({ title: document.title, h1: document.querySelector('h1')?.textContent, font: getComputedStyle(document.body).fontFamily.split(',')[0], bg: getComputedStyle(document.body).backgroundColor,
      foot: [...document.querySelectorAll('.pg-foot nav a')].map(a => new URL(a.href).pathname.split('/').pop()), back: [...document.querySelectorAll('.pg-top a')].map(a => new URL(a.href).pathname),
      sideways: document.documentElement.scrollWidth > innerWidth }));
    rows[`${p}${phone ? ' (phone)' : ''}`] = { ...r, errors: errors.length, failed };
    await page.close();
  }
  check('Pages: About, Data, Sources & licences, Privacy & disclaimer and 404 load with the map\'s fonts and dark theme, a title, a link back to the map and the four footer links; no sideways scroll at 375 px',
    Object.values(rows).every(r => /Open World Map/.test(r.title) && r.h1 && /IBM Plex Sans Condensed/.test(r.font) && r.bg === 'rgb(7, 9, 12)' && r.foot.join() === 'about.html,data.html,sources.html,privacy.html' && r.back.length === 2 && r.back.every(b => b === '/' || b === '/open-world-map/') && !r.sideways && !r.errors && !r.failed.length),
    JSON.stringify(rows).slice(0, 1500));
  const { page } = await openPage('index.html');
  const img = await page.evaluate(async () => {
    const meta = Object.fromEntries([...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map(m => [m.getAttribute('property') || m.name, m.content]));
    const size = async u => { const r = await fetch(u); const b = await createImageBitmap(await r.blob()); return { status: r.status, type: r.headers.get('content-type'), w: b.width, h: b.height, kb: +((await (await fetch(u)).arrayBuffer()).byteLength / 1024).toFixed(1) }; };
    const out = { meta };
    for (const f of ['share.png', 'icon-32.png', 'icon-192.png', 'apple-touch-icon.png']) out[f] = await size(f);
    out.links = [...document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')].map(l => l.getAttribute('href'));
    return out;
  });
  check('Share card and icons: Open Graph and Twitter tags point at share.png (1200 × 630, under 300 KB); icon-32, icon-192 and the 180 px Apple touch icon load at their sizes and are linked',
    img.meta['og:image'] === 'https://temper31.github.io/open-world-map/share.png' && img.meta['twitter:card'] === 'summary_large_image' && img.meta['og:image:width'] === '1200' && img.meta['og:image:height'] === '630'
    && img['share.png'].w === 1200 && img['share.png'].h === 630 && img['share.png'].kb < 300 && img['icon-32.png'].w === 32 && img['icon-192.png'].w === 192 && img['apple-touch-icon.png'].w === 180
    && ['favicon.svg', 'icon-32.png', 'icon-192.png', 'apple-touch-icon.png'].every(f => img.links.includes(f)), JSON.stringify(img));
  await page.close();
}
// 18. Overlays on/off, max 2, same-as-main blocked, off = no files, one clock, probe values, reload.
if (part()) {
  const { page, errors, reqs } = await open({ field: 'temp', particles: false, overlays: [] }, '3/45/-30');
  const files = () => reqs.filter(r => /gfs\/(pres|rain|cloud)\//.test(r)).length;
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
  const off0 = files();
  await page.click('.layers [data-ov="pres"]'); await page.click('.layers [data-ov="rain"]'); await page.waitForTimeout(1500);
  const third = await page.evaluate(() => { const b = document.querySelector('.layers [data-ov="cloud"]'); b.click(); return { ov: window.owmTest.state.get('overlays'), disabled: b.getAttribute('aria-disabled'), why: b.title, toast: document.querySelector('#toast').textContent }; });
  check('Overlays: 0 overlay files fetched while none is on', off0 === 0, `${off0} files`);
  check('Overlays: max 2; a third is disabled with a note why', third.ov.join() === 'pres,rain' && third.disabled === 'true' && /Up to 2/.test(third.why) && /Up to 2/.test(third.toast), JSON.stringify(third));
  const same = await page.evaluate(() => { const S = window.owmTest.state; S.set({ overlays: ['rain'] }); S.set({ field: 'pres' }); const b = document.querySelector('.layers [data-ov="pres"]'); b.click(); return { ov: S.get('overlays'), disabled: b.getAttribute('aria-disabled'), label: document.querySelector('.layers [data-ovv="pres"]').textContent }; });
  const drop = await page.evaluate(() => { const S = window.owmTest.state; S.set({ field: 'rain' }); return S.get('overlays'); });
  check('Overlay same as the main field is blocked ("main field"), and choosing it as the main field drops it from the overlays', same.ov.join() === 'rain' && same.disabled === 'true' && same.label === 'main field' && drop.length === 0, JSON.stringify({ same, drop }));
  await page.evaluate(() => window.owmTest.state.set({ field: 'temp', overlays: ['pres', 'rain'] }));
  await page.mouse.move(640, 300); await page.waitForTimeout(1500);
  const rows = [];
  for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); rows.push(await synced(page)); }
  const layers = [...new Set(rows.flatMap(r => Object.keys(r.lt)))];
  check('One clock includes the overlays (ov-pres, ov-rain, H/L) with the field, probe and timeline', rows.every(r => r.ok) && ['ov-pres', 'ov-rain', 'hl', 'field', 'probe'].every(k => layers.includes(k)), `${rows.filter(r => r.ok).length}/4 in sync; slowest ${Math.max(...rows.map(r => r.ms))} ms; layers: ${layers.join(', ')}`);
  const probe = await page.evaluate(() => ({ text: document.querySelector('#probe').innerText.replace(/\n/g, ' | '), ov: [...document.querySelectorAll('#probe [data-pov]')].map(e => e.dataset.pov) }));
  await page.mouse.click(640, 300); await page.waitForTimeout(2500);
  const panel = await page.evaluate(() => [...document.querySelectorAll('#detail .stat')].map(e => e.innerText.replace(/\s+/g, ' ')));
  check('Probe and place panel show the main field and every overlay', probe.ov.join() === 'pres,rain' && /°C/.test(probe.text) && /hPa/.test(probe.text) && panel.some(t => /Pressure · overlay \d/.test(t)) && panel.some(t => /Precipitation · overlay/.test(t)), JSON.stringify({ probe, panel }));
  await page.keyboard.press('Escape');
  // prefetch: next 2 frames of each active overlay; turning them off stops their files
  const t0 = await page.evaluate(() => window.owmTest.state.get('t')), f0 = await page.evaluate(() => window.owmTest.meta.first);
  await page.waitForTimeout(1500);
  const want = ['pres', 'rain'].flatMap(l => [1, 2].map(k => `gfs/${l}/f${String(f0 + t0 + k).padStart(3, '0')}`));
  const prefetched = want.filter(w => reqs.includes(w));
  await page.evaluate(() => window.owmTest.state.set({ overlays: [] }));
  const n1 = files();
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
  check('Overlays prefetch their next 2 frames; turned off they fetch nothing', prefetched.length === want.length && files() === n1, `prefetched ${prefetched.length}/${want.length}; after off: ${files() - n1} files`);
  await page.evaluate(() => window.owmTest.state.set({ overlays: ['cloud'] }));
  await page.reload(); await page.waitForFunction(() => window.owmTest?.overlays && window.owmMap?.loaded(), null, { timeout: 60000 });
  check('Overlays are remembered across reloads', await page.evaluate(() => window.owmTest.state.get('overlays').join() === 'cloud' && !!document.querySelector('.layers [data-ov="cloud"][aria-checked="true"]')));
  check('No page errors (overlays)', !errors.length, errors.join(' | '));
  await page.close();
}
// 19. Overlays over "None" and on the phone sheet (44 px rows).
if (part()) {
  const { page, errors } = await open({ field: 'none', particles: false, overlays: ['cloud', 'pres'] }, '1/30/-30', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.waitForTimeout(1500);
  await page.tap('[data-lyr]'); await page.waitForTimeout(400);
  const r = await page.evaluate(() => ({ chip: document.querySelector('#mchip').textContent, rows: [...document.querySelectorAll('#lsheet [data-ov]')].map(e => Math.round(e.getBoundingClientRect().height)), lt: Object.keys(window.owmTest.layerTimes()) }));
  check('Phone: overlays section in the layers sheet (44 px rows); overlays draw over "None"; chip shows "+2"', r.rows.every(h => h >= 44) && /\+2/.test(r.chip) && r.lt.includes('ov-cloud') && r.lt.includes('ov-pres') && !r.lt.includes('field'), JSON.stringify(r));
  check('No page errors (overlays, phone)', !errors.length, errors.join(' | '));
  await page.close();
}

// ---- Phase 4: street photos (Mapillary) ---------------------------------------------------
section = 3;
const mly = hosts => Object.entries(hosts).filter(([h]) => /mapillary/.test(h)).reduce((a, [, v]) => a + v.length, 0);
// 14. No token (what PR builds get): clean "unavailable" state, 0 requests, no errors.
if (part()) {
  const { page, errors, hosts } = await open({ field: 'temp', particles: false, photos: true }, '15/40.758/-73.9855', { photos: { token: false } });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => ({ v: document.querySelector('.layers [data-phs]').textContent, note: document.querySelector('.layers [data-phnote]').textContent, layer: !!window.owmMap.getLayer('mly-img'), credits: document.querySelector('#credits').textContent }));
  check('Street photos without a token: "unavailable" state, no Mapillary requests, no page errors', r.v === 'unavailable' && /unavailable/.test(r.note) && !r.layer && mly(hosts) === 0 && !errors.length, `${JSON.stringify(r).slice(0, 300)}; Mapillary requests: ${mly(hosts)}`);
  await page.close();
}
// 15. With stand-in tiles and Graph API (fake token): toggle on/off, off = 0 requests, click a dot
// -> photo with credit and link, Esc closes, panel rule with events and the measure tool.
if (part()) {
  const { page, errors, hosts } = await open({ field: 'none', particles: false, photos: false, events: { eq: true } }, '15.5/40.758/-73.9855', { photos: { at: [-73.9855, 40.758] }, samples: {} });
  await page.waitForTimeout(800);
  const off0 = mly(hosts);
  await page.click('.layers [data-photos]'); await page.waitForTimeout(2500);
  const on = { tiles: mly(hosts), drawn: await page.evaluate(() => window.owmMap.queryRenderedFeatures({ layers: ['mly-img', 'mly-seq'] }).length) };
  const phFresh = await page.evaluate(() => document.querySelector('.layers [data-phfresh]').textContent);
  await page.mouse.click(640, 400);
  await page.waitForFunction(() => document.querySelector('#detail img.ph-img')?.complete, null, { timeout: 10000 }).catch(() => {});
  const ph = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection'), credit: document.querySelector('[data-photo-credit]')?.textContent, link: [...document.querySelectorAll('#detail a.btn')].map(a => a.href)[0], img: document.querySelector('#detail img.ph-img')?.naturalWidth, title: document.querySelector('#detail .d-title')?.textContent }));
  check('Photo layer: toggle on draws coverage (stand-in tiles); off before = 0 Mapillary requests', off0 === 0 && on.tiles > 0 && on.drawn > 0, JSON.stringify({ off0, ...on }));
  check('Click a photo dot: photo, capture date, credit "CC BY-SA 4.0 — Mapillary / {creator}" and "Open on Mapillary" link', ph.sel?.type === 'photo' && ph.sel.id === IMAGE_ID && ph.credit === 'CC BY-SA 4.0 — Mapillary / test_mapper' && ph.link === `https://www.mapillary.com/app/?pKey=${IMAGE_ID}` && ph.img > 0, JSON.stringify(ph));
  await page.keyboard.press('Escape');
  check('Photo freshness: the layer says Mapillary, that each photo shows its capture date (no update-time claim) and "no grid"; the open photo shows its capture date',
    /^Mapillary · each photo shows its own capture date .*no update time.* no grid$/.test(phFresh) && /\d{4}/.test(ph.title || ''), JSON.stringify({ phFresh, title: ph.title }));
  check('Esc closes the photo', await page.evaluate(() => document.querySelector('#detail').hidden && !window.owmTest.state.get('selection')));
  // panel rule: a photo, then an event (sample quake), then the photo again; the measure tool blocks both
  const q = await page.evaluate(() => window.owmMap.project([-73.9855 + 0.002, 40.758]));
  await page.evaluate(() => { const C = window.owmTest.events.cache.usgs; C.items.push({ ...C.items[0], id: 'us:near', lon: -73.9855 + 0.002, lat: 40.758 }); window.owmTest.state.set({ evWin: '7d', events: { eq: true, st: false, fv: false, ga: false } }); });
  await page.evaluate(() => window.owmTest.state.set({ events: { ...window.owmTest.state.get('events') } }));
  await page.waitForTimeout(400);
  await page.mouse.click(640, 400); await page.waitForTimeout(300);
  const a = await page.evaluate(() => window.owmTest.state.get('selection')?.type);
  await page.mouse.click(q.x, q.y); await page.waitForTimeout(300);
  const b = await page.evaluate(() => window.owmTest.state.get('selection')?.type);
  await page.click('.zoom [data-measure]');
  await page.mouse.click(640, 400); await page.waitForTimeout(300);
  const c = await page.evaluate(() => ({ sel: window.owmTest.state.get('selection')?.type ?? null, pts: document.querySelector('[data-mhint]').textContent }));
  await page.keyboard.press('Escape');
  check('Panel rule: photo then event replace each other (last click wins); measure tool on: clicks only add points', a === 'photo' && b === 'event' && /^1 point/.test(c.pts), JSON.stringify({ a, b, c }));
  await page.click('.layers [data-photos]'); await page.waitForTimeout(300);
  const n0 = mly(hosts);
  await page.evaluate(async () => { const m = window.owmMap; m.panBy([400, 200], { duration: 0 }); m.zoomTo(13, { duration: 0 }); await new Promise(r => m.once('idle', r)); });
  check('Photo layer off: source removed, 0 Mapillary requests while panning and zooming', mly(hosts) === n0 && !(await page.evaluate(() => !!window.owmMap.getSource('mly'))), `${mly(hosts) - n0} requests`);
  check('No page errors (street photos)', !errors.length, errors.join(' | '));
  await page.close();
}
// 16a. Mapillary credit (I7): linked to the Mapillary homepage in the credits strip (layer on) and
// the photo panel, with CC BY-SA 4.0 and the creator. The logo shows only from the owner's
// official file: without it (today) there is no logo image; with the setting on (here a plain
// grey test rectangle stands in for the file) the strip and the panel show it, linked.
if (part()) for (const logo of [false, true]) {
  const { page, errors } = await open({ field: 'none', particles: false, photos: true }, '15.5/40.758/-73.9855', { photos: { at: [-73.9855, 40.758] }, logo });
  await page.waitForTimeout(2500); await page.mouse.click(640, 400);
  await page.waitForFunction(() => document.querySelector('#detail img.ph-img')?.complete, null, { timeout: 10000 }).catch(() => {});
  const r = await page.evaluate(() => {
    const links = s => [...document.querySelectorAll(s)].map(a => [a.textContent.trim() || a.querySelector('img')?.alt, a.href]);
    const img = s => { const i = document.querySelector(s); return i ? { alt: i.alt, w: i.naturalWidth, h: Math.round(i.getBoundingClientRect().height), href: i.closest('a')?.href, visible: i.checkVisibility() } : null; };
    return { strip: links('#credits a'), stripLogo: img('#credits [data-mly-logo] img'), panel: document.querySelector('[data-photo-credit]')?.textContent.trim(), panelLinks: links('[data-photo-credit] a'), panelLogo: img('[data-photo-credit] [data-mly-logo] img') };
  });
  const home = 'https://www.mapillary.com/';
  const base = r.strip.some(([t, h]) => t === '© Mapillary' && h === home) && r.strip.some(([t, h]) => t === 'CC BY-SA 4.0' && /creativecommons\.org\/licenses\/by-sa\/4\.0/.test(h)) && r.panel === 'CC BY-SA 4.0 — Mapillary / test_mapper' && r.panelLinks.some(([t, h]) => t === 'Mapillary' && h === home);
  const logoOk = logo ? [r.stripLogo, r.panelLogo].every(i => i && i.alt === 'Mapillary' && i.w > 0 && i.h === 12 && i.href === home && i.visible) : !r.stripLogo && !r.panelLogo;
  check(logo ? 'Mapillary credit with the logo setting on (test stand-in file): logo linked to the Mapillary homepage in the credits strip and the photo panel, plus CC BY-SA 4.0 and the creator'
    : 'Mapillary credit (no logo file yet): "© Mapillary" and "Mapillary" linked to the Mapillary homepage in the credits strip and the photo panel, CC BY-SA 4.0 and the creator; no logo image', base && logoOk && !errors.length, JSON.stringify(r) + (errors.length ? ' errors: ' + errors.join(' | ') : ''));
  await page.close();
}
// 16. Graph API failure and "no photo here": clear states, no errors.
if (part()) {
  for (const graph of ['error', 'none']) {
    const { page, errors } = await open({ field: 'none', particles: false, photos: true }, '15.5/40.758/-73.9855', { photos: { graph } });
    await page.waitForTimeout(2500); await page.mouse.click(640, 400); await page.waitForTimeout(1200);
    const msg = await page.evaluate(() => document.querySelector('#detail .ph-msg')?.textContent);
    check(`Photo panel state when the Graph API ${graph === 'error' ? 'fails' : 'has no thumbnail'}: "${graph === 'error' ? 'Photo unavailable' : 'No photo here.'}"`, graph === 'error' ? /^Photo unavailable/.test(msg || '') : msg === 'No photo here.', `${msg}; errors: ${errors.join(' | ') || 'none'}`);
    await page.close();
  }
}
// A coverage hit with no thumbnail shows the existing no-photo state at Brantley.
if (part()) {
  const { page, errors } = await open(
    { field: 'none', particles: false, photos: true },
    '16/31.585/-86.255',
    { photos: { at: [-86.255, 31.585], graph: 'none' } }
  );
  await page.mouse.click(640, 400);
  const message = page.locator('#detail:not([hidden]) .ph-msg', { hasText: /^No photo here\.$/ });
  const shown = await message.waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);
  check('Brantley AL: clicking a fixture dot without a thumbnail shows "No photo here."', shown && !errors.length, errors.join(' | '));
  await page.close();
}

// 16b. Mapillary refuses (daily tile limit reached: HTTP 429; token rejected: 403 / Graph code 190):
// "Street photos: unavailable right now", source removed, no further requests, no page errors.
if (part()) for (const [name, opts] of [['tile limit reached (HTTP 429)', { tiles: 'limit' }], ['token rejected by the tiles (HTTP 403)', { tiles: 'rejected' }], ['tile refusal without CORS headers (request fails, no status)', { tiles: 'blocked' }], ['token rejected by the Graph API (code 190)', { graph: 'token' }]]) {
  const { page, errors, hosts } = await open({ field: 'none', particles: false, photos: true }, '15.5/40.758/-73.9855', { photos: opts });
  await page.waitForTimeout(2500);
  if (opts.graph) { await page.mouse.click(640, 400); await page.waitForTimeout(1500); }
  const r = await page.evaluate(() => ({ v: document.querySelector('.layers [data-phs]').textContent, note: document.querySelector('.layers [data-phnote]').textContent, source: !!window.owmMap.getSource('mly'), panel: document.querySelector('#detail .ph-msg')?.textContent || null, credits: /Mapillary/.test(document.querySelector('#credits').textContent) }));
  const n = mly(hosts);
  await page.evaluate(async () => { const m = window.owmMap; m.panBy([300, 0], { duration: 0 }); await new Promise(r => setTimeout(r, 800)); });
  check(`Street photos when Mapillary refuses (${name}): "Street photos: unavailable right now", layer removed, no more requests, no page errors`,
    r.v === 'unavailable' && /^Street photos: unavailable right now/.test(r.note) && !r.source && !r.credits && mly(hosts) === n && !errors.length && (!opts.graph || r.panel === 'Street photos: unavailable right now.'),
    `${JSON.stringify(r)}; requests after: ${mly(hosts) - n}; errors: ${errors.join(' | ') || 'none'}`);
  await page.close();
}
// 17. Live Mapillary (only when the optional MAPILLARY_CI_TOKEN secret is set): coverage at world
// zoom, lines at city zoom, dots at street zoom, a photo at Times Square and on I-65 near Greenville, AL.
if (!part()) { /* another part runs this */ } else if (process.env.MLY_CI === '1') {
  const { page, errors } = await open({ field: 'none', particles: false, photos: true }, '1.5/30/-40');
  const at = async (hash, layer) => { await page.evaluate(h => { const [z, la, lo] = h.split('/').map(Number); window.owmMap.jumpTo({ zoom: z, center: [lo, la] }); }, hash); await page.evaluate(() => new Promise(r => window.owmMap.once('idle', r))); await page.waitForTimeout(800); return page.evaluate(l => window.owmMap.queryRenderedFeatures({ layers: [l] }).length, layer); };
  const world = await at('1.5/30/-40', 'mly-ov'), city = await at('11/40.758/-73.9855', 'mly-seq');
  const shots = {};
  for (const [name, hash] of [['Times Square', '17/40.758/-73.9855'], ['I-65 near Greenville AL', '16/31.7001/-86.7404']]) {
    // find the image dot nearest the place (at z14 if none is in view at street zoom), then go there
    let dots = await at(hash, 'mly-img'), near = null;
    if (!dots) { const [, la, lo] = hash.split('/'); await at(`14/${la}/${lo}`, 'mly-img'); const n = await page.evaluate(() => { const m = window.owmMap, c = m.getCenter(), fs = m.queryRenderedFeatures({ layers: ['mly-img'] }); fs.sort((a, b) => Math.hypot(a.geometry.coordinates[0] - c.lng, a.geometry.coordinates[1] - c.lat) - Math.hypot(b.geometry.coordinates[0] - c.lng, b.geometry.coordinates[1] - c.lat)); return fs[0]?.geometry.coordinates; }); if (n) dots = await at(`17/${n[1]}/${n[0]}`, 'mly-img'); 
    // still none in view: ask Mapillary for the images nearest the place (bbox about 10 km)
    if (!dots) {
      const [, la, lo] = hash.split('/').map(Number);
      near = await page.evaluate(([lo, la]) => (async (lo, la) => { // nearest image Mapillary lists around lo/la: boxes of 0.098 deg (API max 0.01 sq deg), centre then the 8 around it
        const { MAPILLARY_TOKEN: t } = await import('./js/secrets.js'), h = 0.049, out = { boxes: 0, errors: [] };
        for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const x = lo + dx * 2 * h, y = la + dy * 2 * h; out.boxes++;
          const r = await fetch(`https://graph.mapillary.com/images?fields=id,geometry&limit=50&bbox=${x - h},${y - h},${x + h},${y + h}`, { headers: { Authorization: `OAuth ${t}` } });
          const j = await r.json();
          if (j.error) { out.errors.push(`${r.status} ${j.error.message}`.slice(0, 100)); continue; }
          const d = (j.data || []).map(i => ({ id: i.id, at: i.geometry.coordinates, km: +Math.hypot((i.geometry.coordinates[0] - lo) * 111.32 * Math.cos(la * Math.PI / 180), (i.geometry.coordinates[1] - la) * 110.57).toFixed(2) })).sort((a, b) => a.km - b.km);
          if (d.length) return { ...out, found: d.length, nearest: d[0] };
        }
        return { ...out, found: 0, nearest: null };
      })(lo, la), [lo, la]);
      if (near.nearest) dots = await at(`17/${near.nearest.at[1]}/${near.nearest.at[0]}`, 'mly-img');
    }
  }
    const f = await page.evaluate(() => { const c = window.owmMap.getCenter(), fs = window.owmMap.queryRenderedFeatures({ layers: ['mly-img'] }); fs.sort((a, b) => Math.hypot(a.geometry.coordinates[0] - c.lng, a.geometry.coordinates[1] - c.lat) - Math.hypot(b.geometry.coordinates[0] - c.lng, b.geometry.coordinates[1] - c.lat)); return fs[0] && window.owmMap.project(fs[0].geometry.coordinates); });
    if (f) { await page.mouse.click(f.x, f.y); await page.waitForFunction(() => document.querySelector('#detail img.ph-img')?.complete || document.querySelector('#detail .ph-msg:not(:empty)') && !/Loading/.test(document.querySelector('#detail .ph-msg').textContent), null, { timeout: 15000 }).catch(() => {}); }
    shots[name] = { dots, near, ...(await page.evaluate(() => ({ at: window.owmMap.getCenter().toArray().map(v => +v.toFixed(4)), sel: window.owmTest.state.get('selection')?.id || null, open: !document.querySelector('#detail').hidden, img: document.querySelector('#detail:not([hidden]) img.ph-img')?.naturalWidth || 0, credit: document.querySelector('#detail:not([hidden]) [data-photo-credit]')?.textContent || null, msg: document.querySelector('#detail:not([hidden]) .ph-msg')?.textContent || null }))) };
    await page.keyboard.press('Escape');
  }
  // Diagnostics (no token printed): Graph API answers for a tile image id and for an id the API
  // itself lists, with the token as ?access_token= and as the Authorization header.
  const diag = await page.evaluate(async tileId => {
    const { MAPILLARY_TOKEN: t } = await import('./js/secrets.js'), G = 'https://graph.mapillary.com/', out = {};
    const ask = async (u, h) => { try { const r = await fetch(u, h ? { headers: { Authorization: `OAuth ${t}` } } : {}); const j = await r.json(); return { status: r.status, ok: !!j.id || !!j.data, err: j.error ? `${j.error.code}: ${j.error.message}`.slice(0, 140) : null, id: j.id || j.data?.[0]?.id || null }; } catch (e) { return { error: String(e).slice(0, 100) }; } };
    out.list = await ask(`${G}images?fields=id&limit=1&bbox=-73.99,40.75,-73.98,40.76&access_token=${encodeURIComponent(t)}`);
    for (const [k, id] of [['tileId', tileId], ['listedId', out.list.id]]) if (id) {
      out[k + 'Query'] = await ask(`${G}${id}?fields=id,thumb_1024_url&access_token=${encodeURIComponent(t)}`);
      out[k + 'Header'] = await ask(`${G}${id}?fields=id,thumb_1024_url`, true);
    }
    out.tileId = tileId; return out;
  }, shots['Times Square']?.sel || null);
  check('Live Mapillary diagnostics: Graph API with the token as query parameter and as header (information)', true, JSON.stringify(diag));
  check('Live Mapillary: coverage at world zoom, lines at city zoom, dots at street zoom', world > 0 && city > 0 && Object.values(shots).every(x => x.dots > 0), JSON.stringify({ world, city, dots: Object.fromEntries(Object.entries(shots).map(([k, v]) => [k, v.dots])) }));
  check('Live Mapillary: click a dot at Times Square and on I-65 near Greenville AL -> photo with "CC BY-SA 4.0 — Mapillary / {creator}"', Object.values(shots).every(x => x.open && x.img > 0 && /^CC BY-SA 4\.0 — Mapillary \/ \S/.test(x.credit || '') && !/…$/.test(x.credit)), JSON.stringify(shots));
  check('No page errors (live Mapillary)', !errors.length, errors.join(' | '));
  await page.close();
}

// ---- Place search (Photon stand-in, scripts/data/search-fixtures.mjs) and Quick View --------
// Runs with part 3. No test contacts the real Photon service.
const qsel = page => page.evaluate(() => { const s = window.owmTest.state.get('selection'), m = window.owmMap; return { sel: s, panel: !document.querySelector('#detail').hidden && !!document.querySelector('#detail .d-title'), zoom: +m.getZoom().toFixed(2), center: m.getCenter().toArray().map(v => +v.toFixed(3)) }; });
const settle = page => page.waitForFunction(() => !window.owmMap.isMoving(), null, { timeout: 15000 }).catch(() => {});
const nearLL = (a, b, d) => !!a && !!b && Math.abs(a[0] - b[0]) <= d && Math.abs(a[1] - b[1]) <= d;
const popState = (page, phone = false) => page.evaluate(phone => {
  const i = document.querySelector(phone ? '#mq' : '#q'), pop = document.querySelector(phone ? '#mq-pop' : '#q-pop');
  return { open: !pop.hidden, items: [...pop.querySelectorAll('[role="option"]')].map(li => li.innerText.replace(/\s+/g, ' ').trim()), msg: pop.querySelector('[data-sqmsg]').textContent,
    expanded: i.getAttribute('aria-expanded'), active: i.getAttribute('aria-activedescendant'), focused: document.activeElement === i };
}, phone);
const retype = async (page, sel, text) => { await page.click(sel, { clickCount: 3 }); await page.keyboard.press('Backspace'); await page.keyboard.type(text); };
// 20. Search: fair use, suggestions, keyboard and mouse picks, Esc.
if (part()) {
  const { page, errors, searchLog: log } = await open({ field: 'temp', particles: false }, '2/35/-20');
  await page.keyboard.press('Control+K');
  const focused = await page.evaluate(() => document.activeElement?.id);
  await page.keyboard.type('Lo'); await page.waitForTimeout(700);
  const two = { reqs: log.queries.length, ...(await popState(page)) };
  await page.keyboard.type('n');
  const early = log.queries.length; // still inside the 300 ms pause
  await page.waitForTimeout(800);
  const three = { reqs: log.queries.slice(), ...(await popState(page)) };
  check('Search: Ctrl+K focuses the field; 2 characters send no request; a 3rd sends one after the 300 ms pause', focused === 'q' && two.reqs === 0 && !two.open && early === 0 && three.reqs.join() === 'Lon' && three.open && three.items.length === 3, JSON.stringify({ focused, two, early, three }));
  await page.keyboard.type('don', { delay: 60 }); await page.waitForTimeout(800);
  const word = { reqs: log.queries.slice(), ...(await popState(page)) };
  const aria = await page.evaluate(() => { const i = document.querySelector('#q'), l = document.getElementById(i.getAttribute('aria-controls')); return { role: i.getAttribute('role'), auto: i.getAttribute('aria-autocomplete'), list: l?.getAttribute('role'), opts: [...l.children].every(o => o.getAttribute('role') === 'option' && o.id), credit: [...document.querySelectorAll('#q-pop .sq-credit a')].map(a => a.href).join(' '), creditText: document.querySelector('#q-pop .sq-credit').textContent, soon: !!document.querySelector('.search .soon') }; });
  check('Search: typing on sends one request for the word; suggestions show name, region and country (combobox, listbox, options); credit "Search: Photon by komoot · © OpenStreetMap contributors" under the list; no "Coming soon"',
    word.reqs.join() === 'Lon,London' && word.items[0] === 'London England, United Kingdom' && word.items[2] === '10 Downing Street London, England, United Kingdom' && word.expanded === 'true' && aria.role === 'combobox' && aria.auto === 'list' && aria.list === 'listbox' && aria.opts && /https:\/\/photon\.komoot\.io/.test(aria.credit) && aria.creditText === 'Search: Photon by komoot · © OpenStreetMap contributors' && !aria.soon, JSON.stringify({ word, aria }));
  await page.keyboard.press('ArrowDown');
  const act = await popState(page);
  await page.keyboard.press('Enter'); await page.waitForTimeout(300); await settle(page);
  const london = await qsel(page);
  check('Search: ↓ highlights the first place and Enter flies there (city zoom about 9) and opens the place panel', act.active === 'q-list-0' && london.sel?.type === 'place' && nearLL([london.sel.lon, london.sel.lat], [-0.1278, 51.5074], 1e-9) && london.panel && nearLL(london.center, [-0.128, 51.507], 0.01) && london.zoom >= 8 && london.zoom <= 10, JSON.stringify({ active: act.active, london }));
  // an address flies closer; the same query again is answered from memory (no new request)
  const n1 = log.queries.length;
  await retype(page, '#q', 'London'); await page.waitForTimeout(800);
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter'); await page.waitForTimeout(300); await settle(page);
  const house = await qsel(page);
  check('Search: a street address flies closer (zoom 15+); a repeated query comes from memory without a new request', house.zoom >= 15 && nearLL([house.sel?.lon, house.sel?.lat], [-0.1276, 51.5034], 1e-9) && house.panel && log.queries.length === n1, JSON.stringify({ house, requests: log.queries.slice(n1) }));
  await retype(page, '#q', 'Kansas City'); await page.waitForTimeout(800);
  await page.click('#q-list li >> nth=0'); await page.waitForTimeout(300); await settle(page);
  const kc = await qsel(page);
  check('Search: clicking a suggestion flies to it and opens the place panel', nearLL([kc.sel?.lon, kc.sel?.lat], [-94.5786, 39.0997], 1e-9) && kc.panel && nearLL(kc.center, [-94.579, 39.1], 0.01) && kc.zoom >= 8 && kc.zoom <= 10, JSON.stringify(kc));
  await retype(page, '#q', 'Tokyo'); await page.waitForTimeout(800);
  const before = await popState(page);
  await page.keyboard.press('Escape');
  const after = { ...(await popState(page)), sel: await page.evaluate(() => window.owmTest.state.get('selection')?.lon) };
  await page.focus('#q'); await page.keyboard.press('Enter'); await page.waitForTimeout(300); await settle(page);
  const tokyo = await qsel(page);
  check('Search: Esc closes the list and leaves the field (the place panel stays); Enter without ↓ picks the first place', before.open && !after.open && !after.focused && after.expanded === 'false' && after.sel === -94.5786 && nearLL([tokyo.sel?.lon, tokyo.sel?.lat], [139.6917, 35.6895], 1e-9) && tokyo.panel, JSON.stringify({ before, after, tokyo }));
  check('No page errors (search)', !errors.length, errors.join(' | '));
  await page.close();
}
// 21. Search: a slow answer says "Searching…"; a newer query cancels the older request.
if (part()) {
  const { page, errors, searchLog: log } = await open({ field: 'temp', particles: false }, '2/35/-20', { search: { mode: 'slow', delay: 3500 } });
  await page.click('#q'); await page.keyboard.type('Tok'); await page.waitForTimeout(2700);
  const slow = await popState(page);
  await page.keyboard.type('yo'); await page.waitForTimeout(4500);
  const done = await popState(page);
  check('Search: a request slower than 2 s shows "Searching…"; a newer query cancels the older request and its answer is shown', slow.open && slow.msg === 'Searching…' && log.queries.join() === 'Tok,Tokyo' && log.aborted.includes('Tok') && done.items[0] === 'Tokyo Japan' && done.msg === '', JSON.stringify({ slow, done, log }));
  check('No page errors (slow search)', !errors.length, errors.join(' | '));
  await page.close();
}
// 22. Search: no results, a failed request (HTTP 500) and a timeout (no answer within 8 s) show a
// short message in the list, and the map still works (a click opens the place panel).
if (part()) for (const [name, search, wait, want] of [['no results', { mode: 'empty' }, 900, 'No places found. Check the spelling or try a nearby town.'], ['failed request (HTTP 500)', { mode: 'error' }, 900, "Search isn't available right now. You can still click the map."], ['no answer within 8 s', { mode: 'slow', delay: 10000 }, 8900, "Search isn't available right now. You can still click the map."]]) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '3/45/-30', { search });
  await page.click('#q'); await page.keyboard.type('Qwxzt'); await page.waitForTimeout(wait);
  const st = await popState(page);
  await page.mouse.click(700, 420); await page.waitForTimeout(800);
  const after = { ...(await qsel(page)), open: (await popState(page)).open };
  check(`Search, ${name}: the list says "${want}"; the map still works`, st.open && st.msg === want && !st.items.length && st.expanded === 'false' && after.panel && after.sel?.type === 'place' && !after.open && !errors.length, JSON.stringify({ st, after, errors }));
  await page.close();
}
// 23. Phone (375 px): the pill and the suggestions are 44 px+ targets; a tap flies to the place.
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '1/30/-30', { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.tap('#mq'); await page.keyboard.type('Tokyo'); await page.waitForTimeout(900);
  const st = await popState(page, true);
  const box = await page.evaluate(() => { const r = e => { const b = document.querySelector(e).getBoundingClientRect(); return { h: Math.round(b.height), w: Math.round(b.width), l: Math.round(b.left), r: Math.round(b.right) }; }; return { pill: r('.m-search'), pop: r('#mq-pop'), items: [...document.querySelectorAll('#mq-list li')].map(li => Math.round(li.getBoundingClientRect().height)), font: getComputedStyle(document.querySelector('#mq')).fontSize, sideways: document.documentElement.scrollWidth > innerWidth }; });
  await page.tap('#mq-list li >> nth=0'); await page.waitForTimeout(300); await settle(page);
  const t = { ...(await qsel(page)), blurred: await page.evaluate(() => document.activeElement !== document.querySelector('#mq')) };
  check('Phone (375 px): the search pill and each suggestion are at least 44 px tall, the list fits the screen; a tap flies to the place, opens the place sheet and closes the keyboard',
    st.open && st.items[0] === 'Tokyo Japan' && box.pill.h >= 44 && box.items.length && box.items.every(h => h >= 44) && box.pop.l >= 0 && box.pop.r <= 375 && box.font === '16px' && !box.sideways && nearLL([t.sel?.lon, t.sel?.lat], [139.6917, 35.6895], 1e-9) && t.panel && t.blurred, JSON.stringify({ st, box, t }));
  check('No page errors (phone search)', !errors.length, errors.join(' | '));
  await page.close();
}
// 24. Quick View: opens from the place panel, shows the summary, closes with ×, Esc and a click
// outside, and leaves the place panel exactly as it was. Reports the bytes one open downloads.
if (part()) {
  const { page, errors, reqs } = await open({ field: 'wind', particles: false, tempUnit: 'C', timeFirst: 'local' }, '3/45/-30');
  const bytes = [];
  page.on('response', async r => { if (/\/data\/live\//.test(r.url())) { try { bytes.push([r.url().replace(/.*data\/live\//, '').replace(/\?.*/, ''), (await r.request().sizes()).responseBodySize]); } catch { /* ignore */ } } });
  await page.mouse.click(700, 350);
  await page.waitForFunction(() => document.querySelector('#detail [data-qview]') && 'panel' in window.owmTest.layerTimes() && window.owmTest.layerTimes().panel && window.owmTest.layerTimes().chart, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(500);
  const html0 = await page.$eval('#detail', e => e.innerHTML), sel0 = await page.evaluate(() => JSON.stringify(window.owmTest.state.get('selection')));
  const n0 = reqs.length; bytes.length = 0;
  await page.click('#detail [data-qview]');
  const focusIn = await page.evaluate(() => document.querySelector('#qview').contains(document.activeElement));
  await page.waitForSelector('#qview [data-qv-takeaway]', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(300);
  const qv = await page.evaluate(() => {
    const q = document.querySelector('#qview'), a = q.getBoundingClientRect(), b = document.querySelector('#detail').getBoundingClientRect(), txt = s => q.querySelector(s)?.innerText.replace(/\s+/g, ' ').trim() || null;
    return { live: window.owmTest.meta.live, takeaway: txt('[data-qv-takeaway]'), rain: txt('[data-qv-rain]'), rainIcon: q.querySelector('[data-qv-rain] svg')?.dataset.icon, temp: txt('[data-qv-temp]'),
      strip: [...q.querySelectorAll('[data-qv-strip] li')].map(li => [li.querySelector('.qv-t').textContent, li.querySelector('svg')?.dataset.icon || null, li.querySelector('b').textContent]),
      days: q.querySelectorAll('[data-qv-days] li').length, unitLine: txt('.qv-next .kick'), percent: q.innerText.includes('%'), note: /Model forecast on a ~50 km grid, not an official warning/.test(q.innerText) && /Updated \d\d:\d\d UTC/.test(q.innerText),
      sample: q.querySelector('.sample-badge')?.textContent || null, beside: a.right <= b.left + 1 && a.width > 280, title: document.activeElement?.id };
  });
  const files = reqs.slice(n0), kb = (bytes.reduce((s, [, n]) => s + n, 0) / 1024).toFixed(1);
  check('Quick view: opens beside the place panel with focus inside; takeaway, rain line with icon (no "%" anywhere), now temperature with forecast high / low, the next-12-hours strip (7 times with icon and temperature), the model note and update time; "Sample data" shown on sample data',
    focusIn && qv.title === 'qv-title' && qv.takeaway?.length > 8 && /^(Rain|Dry|Forecast)/.test(qv.takeaway) && /^(Raining now|Rain from \d\d:\d\d|No rain expected in the next 12 hours)/.test(qv.rain || '') && qv.rainIcon && /^-?\d+°\s?C Forecast high -?\d+° Forecast low -?\d+° (rest of today|tomorrow)$/.test(qv.temp || '') && qv.strip.length === 7 && qv.strip[0][0] === 'Now' && qv.strip.every(([t, ic, v], i) => (i ? /^\d\d:\d\d$/.test(t) : true) && ic && /^-?\d+°$/.test(v)) && /local time · °C/i.test(qv.unitLine) && !qv.percent && qv.note && qv.beside && (qv.live || qv.sample === 'Sample data'),
    JSON.stringify(qv));
  check('Quick view: extra downloads for one open (information; 0 with sample data)', true, `${files.length} frame files: ${files.join(', ') || 'none'}; ${kb} KB (response bodies of data/live files)`);
  const closed = async how => {
    if (how !== 'first') { await page.click('#detail [data-qview]'); await page.waitForSelector('#qview [data-qv-takeaway]', { timeout: 30000 }).catch(() => {}); }
    if (how === 'x' || how === 'first') await page.click('#qview [data-qv-close]');
    else if (how === 'esc') await page.keyboard.press('Escape');
    else await page.mouse.click(420, 640); // the map, outside Quick View and the panel
    await page.waitForTimeout(400);
    return page.evaluate(([h0, s0]) => ({ hidden: document.querySelector('#qview').hidden, focus: !!document.activeElement?.matches('#detail [data-qview]'), same: document.querySelector('#detail').innerHTML === h0, place: JSON.stringify(window.owmTest.state.get('selection')) === s0, panel: !document.querySelector('#detail').hidden }), [html0, sel0]);
  };
  const ways = { x: await closed('first'), esc: await closed('esc'), outside: await closed('outside') };
  check('Quick view closes with ×, Esc and a click outside; the place panel stays open and unchanged (same HTML and place); × and Esc return focus to the button',
    Object.values(ways).every(w => w.hidden && w.same && w.place && w.panel) && ways.x.focus && ways.esc.focus, JSON.stringify(ways));
  // the wording rules on known inputs (site/js/quick-rules.js)
  const rules = await page.evaluate(async () => {
    const R = await import('./js/quick-rules.js'), t = ms => new Date(ms).toISOString().slice(11, 16);
    const H = (rain, cloud) => rain.map((r, i) => ({ ms: Date.UTC(2026, 10, 7, 12 + i), rain: r, cloud }));
    const run = (rain, cloud = 50) => { const s = R.summarise(H(rain, cloud), t); return [s.takeaway, s.rain.text, s.rain.amount]; };
    return { q: R.QV, now: run([1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), later: run([0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0]), clear: run(Array(13).fill(0), 10), cloudy: run(Array(13).fill(0.1), 85), some: run(Array(13).fill(0), 50) };
  });
  check('Quick view rules: rain >= 0.2 mm/h is rain, cloud >= 70 % cloudy, <= 30 % clear; "Rain now, easing by", "Rain expected from", "Dry and mostly clear", "Dry but cloudy"; amounts, never a percentage',
    rules.q.RAIN_MM_H === 0.2 && rules.q.CLOUDY_PCT === 70 && rules.q.CLEAR_PCT === 30 && rules.now.join('|') === 'Rain now, easing by 14:00|Raining now|about 2 mm in the next 12 hours' && rules.later.join('|') === 'Rain expected from 14:00|Rain from 14:00|about 4 mm in the next 12 hours'
    && rules.clear.join('|') === 'Dry and mostly clear for the next 12 hours|No rain expected in the next 12 hours|' && rules.cloudy[0] === 'Dry but cloudy for the next 12 hours' && rules.some[0] === 'Dry with some cloud for the next 12 hours' && !JSON.stringify(rules).includes('%'), JSON.stringify(rules));
  // °F and UTC first follow Settings
  await page.evaluate(() => window.owmTest.state.set({ tempUnit: 'F', timeFirst: 'utc' }));
  await page.click('#detail [data-qview]'); await page.waitForSelector('#qview [data-qv-takeaway]', { timeout: 30000 }).catch(() => {});
  const fu = await page.evaluate(() => ({ unit: document.querySelector('#qview .qv-next .kick').innerText.replace(/\s+/g, ' '), now: document.querySelector('#qview .qv-now').innerText.replace(/\s+/g, ''), panelTemp: document.querySelector('#detail .stat[data-field="temp"] .n').innerText.replace(/\s+/g, '') }));
  await page.keyboard.press('Escape');
  check('Quick view follows Settings: °F and UTC-first times', /UTC · °F/i.test(fu.unit) && /°F$/.test(fu.now) && /°F$/.test(fu.panelTemp), JSON.stringify(fu));
  check('No page errors (Quick view)', !errors.length, errors.join(' | '));
  await page.close();
}
// 25. Quick View is for places only (no button on an event panel), and is a full-height sheet on phones.
if (part()) {
  const { page, errors } = await open({ field: 'none', particles: false, events: { eq: false, fv: false, st: true, ga: false } }, '3/22/-66', { samples: { nhc: 'storm' } });
  await evWait(page); await page.waitForTimeout(500);
  await page.evaluate(() => window.owmTest.state.set({ selection: { type: 'event', id: 'nhc:AT1' } })); await page.waitForTimeout(400);
  const ev = await page.evaluate(() => ({ open: !document.querySelector('#detail').hidden, title: document.querySelector('#detail .d-title')?.textContent, btn: !!document.querySelector('#detail [data-qview]') }));
  check('Quick view button is shown for places only (not on an event panel)', ev.open && /Testa/.test(ev.title || '') && !ev.btn && !errors.length, JSON.stringify(ev));
  await page.close();
}
if (part()) {
  const { page, errors } = await open({ field: 'temp', particles: false }, '1/30/-30', { viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.touchscreen.tap(200, 380); await page.waitForTimeout(1200);
  await page.evaluate(() => window.owmTest.sheets.place.set('full')); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelector('#detail [data-qview]').scrollIntoView({ block: 'nearest' }));
  await page.tap('#detail [data-qview]'); await page.waitForSelector('#qview [data-qv-takeaway]', { timeout: 30000 }).catch(() => {});
  const r = await page.evaluate(() => { const q = document.querySelector('#qview').getBoundingClientRect(), tabs = document.querySelector('.tabs').getBoundingClientRect(), x = document.querySelector('#qview [data-qv-close]').getBoundingClientRect(); return { top: Math.round(q.top), bottom: Math.round(q.bottom), tabsTop: Math.round(tabs.top), w: Math.round(q.width), close: [Math.round(x.width), Math.round(x.height)], strip: document.querySelectorAll('#qview [data-qv-strip] li').length, sideways: document.documentElement.scrollWidth > innerWidth }; });
  await page.tap('#qview [data-qv-close]'); await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({ hidden: document.querySelector('#qview').hidden, panel: !document.querySelector('#detail').hidden }));
  check('Phone (375 px): Quick view is a full-height sheet above the tab bar with a 44 px close button; closing returns to the place sheet', r.top <= 1 && Math.abs(r.bottom - r.tabsTop) <= 1 && r.w === 375 && r.close.every(v => v >= 44) && r.strip === 7 && !r.sideways && after.hidden && after.panel && !errors.length, JSON.stringify({ r, after, errors }));
  await page.close();
}

// Every part: the static pages are opened too, and no page any test opened may report a CSP
// violation. Part 1 also shows Satellite at regional and street zoom (all four imagery hosts).
{
  if (!PART || PART === 1) {
    const seen = new Set();
    for (const hash of ['5/38/-95', '15/31.7001/-86.7404']) {
      const { page, errors } = await open({ field: 'none', particles: false, basemap: 'satellite' }, hash);
      page.on('request', r => seen.add(new URL(r.url()).host));
      await page.evaluate(() => new Promise(r => { window.owmMap.once('idle', r); setTimeout(r, 4000); }));
      if (errors.length) csp.push(`satellite ${hash}: page errors ${errors.join(' | ')}`);
      await page.close();
    }
    const imagery = ['gibs.earthdata.nasa.gov', 'tiles.maps.eox.at', 'basemap.nationalmap.gov', 'imagery.nationalmap.gov'];
    check('Satellite at regional and street zoom (US): requests to all four imagery hosts pass the CSP', imagery.every(h => seen.has(h) || blockedHosts.has(h)), imagery.map(h => `${h}: ${seen.has(h) || blockedHosts.has(h) ? 'requested' : 'not requested'}`).join(', '));
  }
  for (const p of PAGES) { const { page } = await openPage(p); await page.waitForTimeout(300); await page.close(); }
  check('No Content-Security-Policy violation on any page (every map page this part opened and every static page)', !csp.length, csp.length ? csp.slice(0, 6).join(' | ') : `${cspPages} pages watched, 0 violations`);
}

await browser.close();

const md = `# Rendering and behaviour tests

Generated ${new Date().toISOString()} by \`scripts/data/render-tests.mjs\` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
${results.map(r => `| ${r.name} | ${r.ok ? 'pass' : '**FAIL**'} | ${r.info.replace(/\|/g, '/')} |`).join('\n')}

${part() && process.env.MLY_CI !== '1' ? 'Live Mapillary (Times Square and I-65 near Greenville AL): not run because no CI token was configured.\n' : ''}
${OFFLINE ? `Offline run (OWM_ML_DIR): MapLibre served from disk, event feeds from saved samples; requests stopped before leaving the machine: ${[...blockedHosts].sort().join(', ') || 'none'}.\n` : ''}
## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
${Object.entries(perf).map(([k, v]) => `| ${k} | ${v.longTaskMsPerStep} | ${v.worstFrameGapMs} | ${v.panFramesPerSec} |`).join('\n')}
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md);
console.log(md);
for (const r of results) console.log(`::notice title=${r.ok ? 'Pass' : 'FAIL'}: ${r.name.replace(/[:,]/g, '')}::${r.info}`);
