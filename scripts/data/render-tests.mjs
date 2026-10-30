// Rendering and behaviour tests on the built site (run by CI on pull requests).
//   node scripts/data/render-tests.mjs <site-url> <out.md>
// Headless Chromium here renders WebGL in software (SwiftShader): frame rates are far below
// real hardware and are only useful for comparing before/after on the same machine.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

const [, , site = 'http://127.0.0.1:8123/', out = 'render-tests.md'] = process.argv;
const results = [];
const check = (name, ok, info = '') => results.push({ name, ok, info: String(info) });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
async function open(prefs, hash = '2/35/-20') {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  if (process.env.OWM_ML_DIR) { // local testing only: serve MapLibre from disk when the CDN is unreachable
    await page.route('https://cdn.jsdelivr.net/npm/maplibre-gl@*/dist/*', r => {
      const f = new URL(r.request().url()).pathname.split('/').pop();
      r.fulfill({ body: readFileSync(`${process.env.OWM_ML_DIR}/${f}`), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } });
    });
  }
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const reqs = [];
  page.on('request', r => { const m = r.url().match(/data\/live\/(gfs\/\w+\/f\d+|aq\/\d+)\.png/); if (m) reqs.push(m[1]); });
  // seed preferences once per tab (a reload must keep what the page saved)
  await page.addInitScript(p => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('owm:prefs:v1', JSON.stringify(p)); sessionStorage.setItem('seeded', '1'); } }, { basemap: 'dark', opacity: 1, density: 1, tempUnit: 'C', ...prefs });
  await page.goto(`${site}#map=${hash}`);
  await page.waitForFunction(() => window.owmTest && window.owmMap?.loaded(), null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  return { page, errors, reqs };
}

// 1. Wind direction: uniform synthetic fields; particles must move with the wind (towards).
{
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
{
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
{
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
{
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
{
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
    await new Promise(r => setTimeout(r, 2300)); S.set({ playing: false });
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

await browser.close();

const md = `# Rendering and behaviour tests

Generated ${new Date().toISOString()} by \`scripts/data/render-tests.mjs\` (headless Chromium, software WebGL).

| Test | Result | Detail |
|---|---|---|
${results.map(r => `| ${r.name} | ${r.ok ? 'pass' : '**FAIL**'} | ${r.info.replace(/\|/g, '/')} |`).join('\n')}

## Profiling (software WebGL: compare before/after on the same machine only)

| Field | Long tasks per hour step (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|
${Object.entries(perf).map(([k, v]) => `| ${k} | ${v.longTaskMsPerStep} | ${v.worstFrameGapMs} | ${v.panFramesPerSec} |`).join('\n')}
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md);
console.log(md);
for (const r of results) console.log(`::notice title=${r.ok ? 'Pass' : 'FAIL'}: ${r.name.replace(/[:,]/g, '')}::${r.info}`);
