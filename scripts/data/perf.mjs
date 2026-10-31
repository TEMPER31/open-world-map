// Before/after performance on the same machine and the same data.
//   node scripts/data/perf.mjs <out.md> <label>=<url> [<label>=<url> ...]
// Per site (3 page loads, medians): first contentful paint, time until the first weather field
// is drawn, main-thread time per hour step (the synchronous work of the step plus long tasks),
// step -> new field on screen, worst frame gap while stepping, frames per second while panning.
// CI renders WebGL in software (SwiftShader): absolute numbers are far below real hardware;
// compare the columns with each other only.
import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';

const [, , out = 'perf.md', ...sites] = process.argv;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : NaN; };

async function run(url) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  if (process.env.OWM_ML_DIR) await page.route('https://cdn.jsdelivr.net/npm/maplibre-gl@*/dist/*', r => { const f = new URL(r.request().url()).pathname.split('/').pop(); r.fulfill({ body: readFileSync(`${process.env.OWM_ML_DIR}/${f}`), contentType: f.endsWith('.css') ? 'text/css' : 'application/javascript', headers: { 'access-control-allow-origin': '*' } }); });
  await page.addInitScript(() => localStorage.setItem('owm:prefs:v1', JSON.stringify({ field: 'temp', basemap: 'dark', particles: true, opacity: 1, density: 1, tempUnit: 'C', speedUnit: 'kmh', distUnit: 'km' })));
  await page.goto(`${url}#map=2/35/-20`);
  const firstField = await page.evaluate(() => new Promise(res => { (function f() { if (window.owmTest?.field?.hasData) requestAnimationFrame(() => res(performance.now())); else requestAnimationFrame(f); })(); }));
  await page.waitForFunction(() => window.owmMap?.loaded(), null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  return page.evaluate(async firstField => {
    const T = window.owmTest, S = T.state, fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
    const lt = []; const po = new PerformanceObserver(l => l.getEntries().forEach(e => lt.push(e.duration))); po.observe({ entryTypes: ['longtask'] });
    let drawnAt = 0; const orig = T.field.setData.bind(T.field); T.field.setData = x => { drawnAt = performance.now(); orig(x); };
    let worst = 0, last = performance.now(), go = true;
    (function f() { const n = performance.now(); worst = Math.max(worst, n - last); last = n; if (go) requestAnimationFrame(f); })();
    const sync = [], lat = [];
    for (let i = 0; i < 10; i++) {
      const t = T.stepTime(S.get('t'), 1), a = performance.now(); drawnAt = 0;
      S.set({ t }); sync.push(performance.now() - a);
      while (!drawnAt && performance.now() - a < 5000) await new Promise(r => setTimeout(r, 10));
      lat.push(drawnAt ? drawnAt - a : 5000);
      await new Promise(r => setTimeout(r, 500));
    }
    go = false; po.disconnect(); T.field.setData = orig;
    const m = window.owmMap; let n = 0; const f = () => n++; m.on('render', f);
    m.panBy([600, 0], { duration: 2000 }); await new Promise(r => setTimeout(r, 2050)); m.off('render', f);
    const med = a => [...a].sort((x, y) => x - y)[a.length >> 1];
    return { fcp, firstField, syncMs: med(sync), longTaskMs: lt.reduce((a, b) => a + b, 0) / 10, stepToDrawnMs: med(lat), worstGapMs: worst, panFps: n / 2 };
  }, firstField).finally(() => page.close());
}

const rows = [];
for (const s of sites) {
  const [label, url] = s.split('=');
  const runs = [];
  for (let i = 0; i < 3; i++) runs.push(await run(url).catch(e => ({ error: String(e).slice(0, 120) })));
  const ok = runs.filter(r => !r.error), k = key => med(ok.map(r => r[key]));
  rows.push({ label, n: ok.length, errors: runs.filter(r => r.error).map(r => r.error), fcp: k('fcp'), firstField: k('firstField'), syncMs: k('syncMs'), longTaskMs: k('longTaskMs'), stepToDrawnMs: k('stepToDrawnMs'), worstGapMs: k('worstGapMs'), panFps: k('panFps') });
}
await browser.close();
const f = (v, d = 0) => v == null || v !== v ? 'n/a' : v.toFixed(d);
const md = `# Performance before / after (same machine, same data)

Generated ${new Date().toISOString()} by \`scripts/data/perf.mjs\`. Headless Chromium with software WebGL (SwiftShader):
compare the rows with each other only; real-laptop numbers are higher and are for the owner to check.
Medians of 3 page loads; per-step values are medians of 10 hour steps (temperature field, wind particles on).

| Site | Loads | First contentful paint (ms) | First weather field drawn (ms) | Main-thread work per hour step (ms, synchronous) | Long tasks per step (ms) | Step -> new field on screen (ms) | Worst frame gap while stepping (ms) | Frames/s during a 2 s pan |
|---|---|---|---|---|---|---|---|---|
${rows.map(r => `| ${r.label} | ${r.n} | ${f(r.fcp)} | ${f(r.firstField)} | ${f(r.syncMs, 1)} | ${f(r.longTaskMs, 1)} | ${f(r.stepToDrawnMs)} | ${f(r.worstGapMs)} | ${f(r.panFps, 1)} |`).join('\n')}
${rows.some(r => r.errors.length) ? '\nErrors: ' + rows.map(r => r.errors.join(' / ')).join(' | ') : ''}`;
writeFileSync(out, md);
console.log(md);
