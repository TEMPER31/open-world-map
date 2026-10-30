// Probe for a keyless zoom 16+ imagery layer over the contiguous US (USGS The National Map).
// Runs in CI (the USGS hosts are not reachable from every environment). For each USGS imagery
// service it records: whether it answers without a key, cached levels / pixel size, export and
// WMS support, CORS, load time for one 1280x800 screen at z16-z18 at Brantley AL, image detail
// by zoom (to find the real resolution), acquisition metadata at the point, and whether
// MapLibre can draw it as tiles via {bbox-epsg-3857}. Writes <out>/satellite-probe.md and
// <out>/satellite-probe.json plus a few sample images.
//
//   node scripts/data/satellite-probe.mjs <out-dir>
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const [, , out = 'satellite-probe'] = process.argv;
mkdirSync(out, { recursive: true });
const UA = 'open-world-map-satellite-probe (+https://github.com/TEMPER31/open-world-map)';
const ORIGIN = 'https://temper31.github.io';
const HOSTS = ['https://basemap.nationalmap.gov/arcgis/rest/services', 'https://imagery.nationalmap.gov/arcgis/rest/services'];
const PT = { name: 'Brantley, AL', lat: 31.585, lon: -86.255 };
const SCREEN = [1280, 800];
const R = 6378137, HALF = Math.PI * R;

const merc = (lon, lat) => [lon * Math.PI / 180 * R, Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * R];
const mpp = z => 2 * HALF / (256 * 2 ** z);               // metres per pixel at the equator (Mercator units)
const ground = z => mpp(z) * Math.cos(PT.lat * Math.PI / 180); // real metres per pixel at Brantley
const [X0, Y0] = merc(PT.lon, PT.lat);
const bboxAround = (z, w, h) => [X0 - w / 2 * mpp(z), Y0 - h / 2 * mpp(z), X0 + w / 2 * mpp(z), Y0 + h / 2 * mpp(z)];
const tileOf = z => { const n = 2 ** z; return [(X0 + HALF) / (2 * HALF) * n, (HALF - Y0) / (2 * HALF) * n]; };
const tileBbox = (z, x, y) => { const s = 2 * HALF / 2 ** z; return [-HALF + x * s, HALF - (y + 1) * s, -HALF + (x + 1) * s, HALF - y * s]; };

async function get(url, { origin = false, method = 'GET' } = {}) {
  const t = performance.now();
  try {
    const r = await fetch(url, { method, headers: { 'User-Agent': UA, ...(origin && { Origin: ORIGIN }) } });
    const body = Buffer.from(await r.arrayBuffer());
    return { status: r.status, ms: Math.round(performance.now() - t), type: r.headers.get('content-type') || '', bytes: body.length, body, acao: r.headers.get('access-control-allow-origin'), cache: r.headers.get('cache-control') };
  } catch (e) { return { status: 0, ms: Math.round(performance.now() - t), error: String(e.cause?.code || e.message), bytes: 0, body: Buffer.alloc(0) }; }
}
const json = async url => { const r = await get(url); try { return { ...r, j: JSON.parse(r.body.toString()) }; } catch { return { ...r, j: null }; } };
const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const imageOk = r => r.status === 200 && /^image\//.test(r.type) && r.bytes > 200;

async function pool(items, n, fn) {
  const res = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; res[k] = await fn(items[k]); } }));
  return res;
}

const report = { generated: new Date().toISOString(), point: PT, directory: {}, services: [] };

// ---- 1. what exists ------------------------------------------------------------------
for (const h of HOSTS) {
  const d = await json(`${h}?f=json`);
  report.directory[h] = d.j ? { status: d.status, services: (d.j.services || []).map(s => `${s.name}/${s.type}`), folders: d.j.folders || [] } : { status: d.status, error: d.error || strip(d.body.toString()).slice(0, 200) };
}
const all = Object.entries(report.directory).flatMap(([h, d]) => (d.services || []).map(s => { const [name, type] = s.split('/'); return { host: h, name, type }; }));
const targets = all.filter(s => /imag|naip/i.test(s.name) && /MapServer|ImageServer/.test(s.type));
if (!targets.some(s => s.name === 'USGSImageryOnly')) targets.unshift({ host: HOSTS[0], name: 'USGSImageryOnly', type: 'MapServer' });

// ---- 2. each service ------------------------------------------------------------------
for (const s of targets) {
  const base = `${s.host}/${s.name}/${s.type}`;
  const m = await json(`${base}?f=json`);
  const j = m.j || {};
  const svc = {
    name: s.name, type: s.type, url: base, status: m.status,
    keyless: m.status === 200 && !!m.j && !j.error,
    error: j.error ? `${j.error.code} ${j.error.message}` : m.error,
    cached: !!(j.singleFusedMapCache || j.tileInfo), cachedMaxLevel: j.tileInfo?.lods?.length ? Math.max(...j.tileInfo.lods.map(l => l.level)) : null,
    capabilities: j.capabilities, formats: j.supportedImageFormatTypes, maxImage: j.maxImageWidth ? `${j.maxImageWidth}×${j.maxImageHeight}` : null,
    minScale: j.minScale, maxScale: j.maxScale, pixelSize: j.pixelSizeX ? `${(+j.pixelSizeX).toFixed(3)} × ${(+j.pixelSizeY).toFixed(3)} (${j.spatialReference?.latestWkid || j.spatialReference?.wkid})` : null,
    copyright: strip(j.copyrightText).slice(0, 300), description: strip(j.serviceDescription || j.description).slice(0, 600),
    layers: (j.layers || []).map(l => `${l.id}:${l.name}${l.minScale || l.maxScale ? ` (scales ${l.minScale || '∞'}–${l.maxScale || 0})` : ''}`).slice(0, 25)
  };
  report.services.push(svc);
  if (!svc.keyless) continue;
  const isImage = s.type === 'ImageServer';
  const canExport = isImage || /Map/.test(j.capabilities || '');
  const exp = (bb, w, h, fmt = 'jpg') => isImage
    ? `${base}/exportImage?bbox=${bb.map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=${w},${h}&format=${fmt === 'jpg' ? 'jpgpng' : 'png'}&f=image`
    : `${base}/export?bbox=${bb.map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=${w},${h}&format=${fmt}&transparent=false&f=image`;
  svc.exportTemplate = canExport ? exp([0, 0, 0, 0], 256, 256).replace('bbox=0.00,0.00,0.00,0.00', 'bbox={bbox-epsg-3857}') : null;

  // one export, with an Origin header (CORS decides whether WebGL may use the image)
  if (canExport) {
    const r = await get(exp(bboxAround(17, 256, 256), 256, 256), { origin: true });
    svc.exportTest = { status: r.status, type: r.type, bytes: r.bytes, ms: r.ms, acao: r.acao, cache: r.cache, note: imageOk(r) ? '' : strip(r.body.toString()).slice(0, 200) };
  }
  // WMS
  const caps = await get(`${base}/WMSServer?service=WMS&request=GetCapabilities&version=1.3.0`);
  const capsText = caps.body.toString();
  svc.wms = { status: caps.status, isCapabilities: /WMS_Capabilities|WMT_MS_Capabilities/.test(capsText), epsg3857: /EPSG:3857|EPSG:102100/.test(capsText), layers: [...capsText.matchAll(/<Layer[^>]*>\s*<Name>([^<]+)<\/Name>/g)].map(x => x[1]).slice(0, 10) };
  if (svc.wms.isCapabilities) {
    const lyr = svc.wms.layers[0] || '0', bb = bboxAround(17, 256, 256);
    const url = `${base}/WMSServer?service=WMS&request=GetMap&version=1.3.0&layers=${encodeURIComponent(lyr)}&styles=&crs=EPSG:3857&bbox=${bb.map(v => v.toFixed(2)).join(',')}&width=256&height=256&format=image/jpeg`;
    const r = await get(url, { origin: true });
    svc.wms.getMap = { status: r.status, type: r.type, bytes: r.bytes, ms: r.ms, acao: r.acao, note: imageOk(r) ? '' : strip(r.body.toString()).slice(0, 200) };
    svc.wms.template = url.replace(/bbox=[^&]+/, 'bbox={bbox-epsg-3857}');
  }
  // load time for one 1280x800 screen at Brantley, as 256 px tiles (6 at a time, like a
  // browser on HTTP/1.1) and as one export image
  svc.screens = [];
  for (const z of [16, 17, 18]) {
    const [tx, ty] = tileOf(z), x0 = Math.floor(tx - SCREEN[0] / 512), x1 = Math.floor(tx + SCREEN[0] / 512), y0 = Math.floor(ty - SCREEN[1] / 512), y1 = Math.floor(ty + SCREEN[1] / 512);
    const tiles = [];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tiles.push([x, y]);
    const url = ([x, y]) => svc.cached && (svc.cachedMaxLevel ?? -1) >= z ? `${base}/tile/${z}/${y}/${x}` : canExport ? exp(tileBbox(z, x, y), 256, 256) : null;
    if (!url(tiles[0])) { svc.screens.push({ z, note: 'no tile or export at this zoom' }); continue; }
    const t = performance.now();
    const rs = await pool(tiles, 6, xy => get(url(xy)));
    const total = Math.round(performance.now() - t), ok = rs.filter(imageOk), ms = ok.map(r => r.ms).sort((a, b) => a - b);
    const one = canExport ? await get(exp(bboxAround(z, ...SCREEN), ...SCREEN)) : null;
    svc.screens.push({ z, groundM: +ground(z).toFixed(2), tiles: tiles.length, ok: ok.length, totalMs: total, medianTileMs: ms[ms.length >> 1] ?? null, maxTileMs: ms.at(-1) ?? null, kb: Math.round(ok.reduce((a, r) => a + r.bytes, 0) / 1024), oneExportMs: one?.ms ?? null, oneExportOk: one ? imageOk(one) : null, mode: svc.cached && (svc.cachedMaxLevel ?? -1) >= z ? 'cached tiles' : 'export per tile' });
  }
  // metadata at the point (acquisition dates, resolution) where the service offers it
  const g = encodeURIComponent(JSON.stringify({ x: PT.lon, y: PT.lat, spatialReference: { wkid: 4326 } }));
  if (isImage) {
    const id = await json(`${base}/identify?geometry=${g}&geometryType=esriGeometryPoint&returnCatalogItems=true&returnGeometry=false&f=json`);
    svc.identify = { status: id.status, value: id.j?.value, items: (id.j?.catalogItems?.features || []).slice(0, 8).map(f => f.attributes) };
  } else {
    const ext = [PT.lon - 0.01, PT.lat - 0.01, PT.lon + 0.01, PT.lat + 0.01].join(',');
    const id = await json(`${base}/identify?geometry=${PT.lon},${PT.lat}&geometryType=esriGeometryPoint&sr=4326&layers=all&tolerance=1&mapExtent=${ext}&imageDisplay=256,256,96&returnGeometry=false&f=json`);
    svc.identify = { status: id.status, error: id.j?.error?.message, items: (id.j?.results || []).slice(0, 8).map(r => ({ layer: r.layerName, ...r.attributes })) };
  }
  svc.canExport = canExport;
}

// ---- 3. image detail by zoom, colour match, MapLibre (in a browser) ----------------------
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
// Mean absolute difference between neighbouring pixels (grey): falls by ~2x per zoom level once
// the request is finer than the source imagery (the image is only being upscaled).
const stats = (b64, mime = 'image/png') => page.evaluate(async ([b64, mime]) => {
  const blob = await (await fetch(`data:${mime};base64,${b64}`)).blob(), bmp = await createImageBitmap(blob);
  const c = new OffscreenCanvas(bmp.width, bmp.height), x = c.getContext('2d'); x.drawImage(bmp, 0, 0);
  const d = x.getImageData(0, 0, bmp.width, bmp.height).data, w = bmp.width, h = bmp.height;
  let g = 0, n = 0, r = 0, gg = 0, b = 0;
  for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) {
    const k = (y * w + i) * 4, v = d[k] * 0.3 + d[k + 1] * 0.59 + d[k + 2] * 0.11;
    r += d[k]; gg += d[k + 1]; b += d[k + 2];
    if (i + 1 < w) { const k2 = k + 4; g += Math.abs(v - (d[k2] * 0.3 + d[k2 + 1] * 0.59 + d[k2 + 2] * 0.11)); n++; }
  }
  const p = w * h;
  return { w, h, detail: +(g / n).toFixed(2), rgb: [r / p, gg / p, b / p].map(v => Math.round(v)) };
}, [b64, mime]);

for (const svc of report.services.filter(s => s.keyless && s.canExport)) {
  const base = svc.url, isImage = svc.type === 'ImageServer';
  const exp = (bb, w, h) => isImage
    ? `${base}/exportImage?bbox=${bb.map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=${w},${h}&format=png&f=image`
    : `${base}/export?bbox=${bb.map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=${w},${h}&format=png&transparent=false&f=image`;
  svc.detail = [];
  for (const z of [15, 16, 17, 18, 19, 20]) {
    const r = await get(exp(bboxAround(z, 512, 512), 512, 512));
    svc.detail.push({ z, groundM: +ground(z).toFixed(2), ...(imageOk(r) ? await stats(r.body.toString('base64')) : { error: `${r.status} ${r.type}` }) });
  }
  // a wide view for seams / mismatched dates (about 4.8 x 4.8 km), saved for review
  const wide = await get(exp(bboxAround(14, 1024, 1024), 1024, 1024).replace('format=png', 'format=jpg'));
  if (imageOk(wide)) writeFileSync(`${out}/${svc.name}-brantley-wide.jpg`, wide.body);
}
// cached z16 tile vs each export service over the same tile: colour/date match at the handover
const cached = report.services.find(s => s.name === 'USGSImageryOnly');
if (cached?.keyless) {
  const [tx, ty] = tileOf(16), x = Math.floor(tx), y = Math.floor(ty);
  const t = await get(`${cached.url}/tile/16/${y}/${x}`);
  if (imageOk(t)) {
    writeFileSync(`${out}/cached-z16-tile.jpg`, t.body);
    report.cachedZ16 = { tile: [16, x, y], ...(await stats(t.body.toString('base64'), 'image/jpeg')) };
    for (const svc of report.services.filter(s => s.keyless && s.canExport && s.name !== 'USGSImageryOnly')) {
      const u = svc.type === 'ImageServer'
        ? `${svc.url}/exportImage?bbox=${tileBbox(16, x, y).map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=256,256&format=png&f=image`
        : `${svc.url}/export?bbox=${tileBbox(16, x, y).map(v => v.toFixed(2)).join(',')}&bboxSR=3857&imageSR=3857&size=256,256&format=png&transparent=false&f=image`;
      const r = await get(u);
      if (imageOk(r)) { writeFileSync(`${out}/${svc.name}-z16-same-tile.png`, r.body); svc.vsCachedZ16 = await stats(r.body.toString('base64')); }
    }
  }
}
// MapLibre: can it draw the export / WMS endpoints as raster tiles?
const ML = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist/maplibre-gl';
report.maplibre = [];
for (const svc of report.services.filter(s => s.keyless)) {
  for (const [kind, tpl] of [['export', svc.exportTemplate], ['wms', svc.wms?.template]]) {
    if (!tpl) continue;
    const p = await browser.newPage({ viewport: { width: 640, height: 400 } });
    await p.setContent(`<html><head><link rel="stylesheet" href="${ML}.css"><script src="${ML}.js"></script></head><body style="margin:0"><div id="m" style="width:640px;height:400px"></div></body></html>`);
    const res = await p.evaluate(([tpl, c]) => new Promise(done => {
      const errors = [];
      const map = new maplibregl.Map({ container: 'm', center: [c.lon, c.lat], zoom: 17, fadeDuration: 0, attributionControl: false,
        style: { version: 8, sources: { s: { type: 'raster', tiles: [tpl], tileSize: 256, maxzoom: 20 } }, layers: [{ id: 's', type: 'raster', source: 's' }] } });
      map.on('error', e => errors.push(String(e.error?.message || e.error || e).slice(0, 160)));
      const t0 = performance.now();
      map.once('idle', () => done({ ms: Math.round(performance.now() - t0), errors: errors.slice(0, 3), loaded: map.areTilesLoaded() }));
      setTimeout(() => done({ ms: null, errors: [...errors, 'timeout after 45 s'].slice(0, 3), loaded: false }), 45000);
    }), [tpl, PT]);
    await p.screenshot({ path: `${out}/maplibre-${svc.name}-${kind}-z17.png` });
    report.maplibre.push({ service: svc.name, kind, ...res });
    await p.close();
  }
}
await browser.close();

// ---- 4. report -------------------------------------------------------------------------------
const yes = v => v == null ? '—' : v ? 'yes' : 'no';
const md = [`# Satellite zoom probe`, '', `Generated ${report.generated} by \`scripts/data/satellite-probe.mjs\` (GitHub Actions runner). Point: ${PT.name} (${PT.lat}, ${PT.lon}). Ground size of one screen pixel there: z16 ${ground(16).toFixed(2)} m, z17 ${ground(17).toFixed(2)} m, z18 ${ground(18).toFixed(2)} m.`, '',
  '## Services directory', '', ...Object.entries(report.directory).map(([h, d]) => `- ${h}: HTTP ${d.status}${d.services ? ` — ${d.services.join(', ')}` : ` — ${d.error}`}${d.folders?.length ? `; folders: ${d.folders.join(', ')}` : ''}`), '',
  '## Imagery services', '', '| Service | Type | Keyless | Cached (max level) | Export | Formats | Max image | Pixel size | Max scale |', '|---|---|---|---|---|---|---|---|---|',
  ...report.services.map(s => `| ${s.name} | ${s.type} | ${yes(s.keyless)}${s.error ? ` (${s.error})` : ''} | ${s.cached ? `yes (${s.cachedMaxLevel})` : 'no'} | ${yes(s.canExport)} | ${s.formats || '—'} | ${s.maxImage || '—'} | ${s.pixelSize || '—'} | ${s.maxScale ?? '—'} |`), '',
  ...report.services.filter(s => s.description || s.layers.length).flatMap(s => [`**${s.name}**: ${s.description || ''}${s.copyright ? ` Copyright: ${s.copyright}` : ''}${s.layers.length ? ` Layers: ${s.layers.join('; ')}` : ''}`, '']),
  '## Export, WMS and CORS (one 256 px image at z17, request sent with Origin: ' + ORIGIN + ')', '', '| Service | Export | Export CORS | WMS caps | WMS EPSG:3857 | WMS GetMap | WMS CORS |', '|---|---|---|---|---|---|---|',
  ...report.services.filter(s => s.keyless).map(s => `| ${s.name} | ${s.exportTest ? `${s.exportTest.status} ${s.exportTest.type} ${s.exportTest.bytes} B ${s.exportTest.ms} ms ${s.exportTest.note}` : '—'} | ${s.exportTest?.acao ?? 'none'} | ${s.wms?.status} ${yes(s.wms?.isCapabilities)} | ${yes(s.wms?.epsg3857)} | ${s.wms?.getMap ? `${s.wms.getMap.status} ${s.wms.getMap.type} ${s.wms.getMap.ms} ms ${s.wms.getMap.note}` : '—'} | ${s.wms?.getMap?.acao ?? 'none'} |`), '',
  '## Load time for one 1280×800 screen at Brantley (256 px requests, 6 at a time; plus one 1280×800 export)', '', '| Service | Zoom | m/pixel | Mode | Requests (ok) | Total | Median / max per request | KB | One export |', '|---|---|---|---|---|---|---|---|---|',
  ...report.services.filter(s => s.screens).flatMap(s => s.screens.map(r => r.note ? `| ${s.name} | ${r.z} | | ${r.note} | | | | | |` : `| ${s.name} | ${r.z} | ${r.groundM} | ${r.mode} | ${r.tiles} (${r.ok}) | ${r.totalMs} ms | ${r.medianTileMs} / ${r.maxTileMs} ms | ${r.kb} | ${r.oneExportMs ?? '—'} ms${r.oneExportOk === false ? ' (failed)' : ''} |`)), '',
  '## Image detail by zoom (512×512 export at Brantley)', '', 'Mean absolute difference between neighbouring pixels. While the source is sharper than the request, detail stays roughly level or rises; once requests are finer than the source, it roughly halves with each zoom level (the image is only being upscaled).', '',
  '| Service | ' + [15, 16, 17, 18, 19, 20].map(z => `z${z} (${ground(z).toFixed(2)} m)`).join(' | ') + ' |', '|---|' + [15, 16, 17, 18, 19, 20].map(() => '---').join('|') + '|',
  ...report.services.filter(s => s.detail).map(s => `| ${s.name} | ${s.detail.map(d => d.error || d.detail).join(' | ')} |`), '',
  '## Handover at z16: cached tile vs export of the same tile (colour = mean RGB)', '',
  report.cachedZ16 ? `- USGSImageryOnly cached tile ${report.cachedZ16.tile.join('/')}: mean RGB ${report.cachedZ16.rgb.join(', ')}, detail ${report.cachedZ16.detail}` : '- cached tile unavailable',
  ...report.services.filter(s => s.vsCachedZ16).map(s => `- ${s.name} export of the same tile: mean RGB ${s.vsCachedZ16.rgb.join(', ')}, detail ${s.vsCachedZ16.detail}`), '',
  '## Metadata at the point (identify)', '', ...report.services.filter(s => s.identify).map(s => `- **${s.name}** (HTTP ${s.identify.status}${s.identify.error ? `, ${s.identify.error}` : ''}): ${s.identify.items?.length ? '```' + JSON.stringify(s.identify.items).slice(0, 1500) + '```' : 'no items'}`), '',
  '## MapLibre 5.24.0 drawing the endpoint as raster tiles ({bbox-epsg-3857}, z17)', '', '| Service | Kind | Idle after | All tiles loaded | Errors |', '|---|---|---|---|---|',
  ...report.maplibre.map(m => `| ${m.service} | ${m.kind} | ${m.ms ?? '—'} ms | ${yes(m.loaded)} | ${m.errors.join('; ') || 'none'} |`), ''].join('\n');
writeFileSync(`${out}/satellite-probe.md`, md);
writeFileSync(`${out}/satellite-probe.json`, JSON.stringify(report, null, 1));
console.log(md);
for (const s of report.services) console.log(`::notice title=Imagery ${s.name}::keyless=${s.keyless} cached=${s.cached}(${s.cachedMaxLevel}) export=${s.canExport} cors=${s.exportTest?.acao ?? 'n/a'} detail=${(s.detail || []).map(d => d.detail).join('/')}`);
