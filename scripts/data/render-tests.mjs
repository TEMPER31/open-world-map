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
  await page.addInitScript(p => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('owm:prefs:v1', JSON.stringify(p)); sessionStorage.setItem('seeded', '1'); } }, { basemap: 'dark', opacity: 1, density: 1, ...prefs });
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
