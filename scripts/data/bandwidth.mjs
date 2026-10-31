// Download size per frame and for a full 7-day play, from the built data files (CI, PR builds).
//   node scripts/data/bandwidth.mjs <site/data/live> <out.md>
// Each layer on screen downloads one PNG per frame: the main field, wind particles (the wind
// file) and each overlay. Air quality has its own hourly files (shared by every frame in the hour).
import { readdirSync, statSync, writeFileSync, readFileSync } from 'node:fs';

const [, , dir = 'site/data/live', out = 'bandwidth.md'] = process.argv;
const M = JSON.parse(readFileSync(`${dir}/manifest.json`, 'utf8'));
const frames = M.gfs.frames.map(f => f.f);
const size = (layer, f) => { try { return statSync(`${dir}/gfs/${layer}/f${String(f).padStart(3, '0')}.png`).size; } catch { return 0; } };
const L = ['temp', 'wind', 'rain', 'cloud', 'pres'];
const per = Object.fromEntries(L.map(l => { const s = frames.map(f => size(l, f)); return [l, { mean: s.reduce((a, b) => a + b, 0) / s.length, max: Math.max(...s), total: s.reduce((a, b) => a + b, 0) }]; }));
let aq = { total: 0, n: 0 };
try { const fs = readdirSync(`${dir}/aq`).filter(f => f.endsWith('.png')); aq = { n: fs.length, total: fs.reduce((a, f) => a + statSync(`${dir}/aq/${f}`).size, 0) }; } catch { /* no AQ files */ }
const kb = b => (b / 1024).toFixed(1);
const mb = b => (b / 1048576).toFixed(2);
// scenarios: main field temperature with wind particles, plus 0, 1 or 2 overlays (the largest
// combinations), and the brief's two screenshot combos
const S = [
  ['Temperature + particles, 0 overlays', ['temp', 'wind']],
  ['+ 1 overlay (isobars)', ['temp', 'wind', 'pres']],
  ['+ 1 overlay (rain)', ['temp', 'wind', 'rain']],
  ['+ 1 overlay (clouds)', ['temp', 'wind', 'cloud']],
  ['+ 2 overlays (isobars + rain)', ['temp', 'wind', 'pres', 'rain']],
  ['+ 2 overlays (largest pair: ' + ['pres', 'rain', 'cloud'].sort((a, b) => per[b].mean - per[a].mean).slice(0, 2).join(' + ') + ')', ['temp', 'wind', ...['pres', 'rain', 'cloud'].sort((a, b) => per[b].mean - per[a].mean).slice(0, 2)]],
  ['Wind main field + clouds overlay (wind file serves both)', ['wind', 'cloud']]
];
const md = `# Bandwidth per frame and per 7-day play

Generated ${new Date().toISOString()} by \`scripts/data/bandwidth.mjs\` from the files this PR build produced (GFS run ${M.gfs.run}, ${frames.length} frames).
Sizes are the PNG files as stored (PNG is already compressed). The browser caches each file, so replaying the same run costs nothing more.

| Layer file | Mean per frame (KB) | Largest frame (KB) | All ${frames.length} frames (MB) |
|---|---|---|---|
${L.map(l => `| ${l} | ${kb(per[l].mean)} | ${kb(per[l].max)} | ${mb(per[l].total)} |`).join('\n')}
| air quality (${aq.n} hourly files, not per frame) | ${aq.n ? kb(aq.total / aq.n) : 'n/a'} | | ${mb(aq.total)} |

| What is on screen | Per frame (KB) | Full 7-day play (MB) |
|---|---|---|
${S.map(([n, ls]) => `| ${n} | ${kb(ls.reduce((a, l) => a + per[l].mean, 0))} | ${mb(ls.reduce((a, l) => a + per[l].total, 0))} |`).join('\n')}
`;
writeFileSync(out, md);
console.log(md);
