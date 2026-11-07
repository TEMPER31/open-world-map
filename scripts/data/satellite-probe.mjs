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
// Zooms below are MapLibre map zooms (the site's #map= hash), which count 512 px tiles: map
// zoom z shows 256 px web tiles of level z + 1. The cached USGS layer ends at level 16, i.e.
// it is sharp up to map zoom 15.
const LV = z => z + 1;
const mpp = z => 2 * HALF / (512 * 2 ** z);               // Mercator metres per screen pixel at map zoom z
const ground = z => mpp(z) * Math.cos(PT.lat * Math.PI / 180); // real metres per pixel at Brantley
const [X0, Y0] = merc(PT.lon, PT.lat);
const bboxAround = (z, w, h) => [X0 - w / 2 * mpp(z), Y0 - h / 2 * mpp(z), X0 + w / 2 * mpp(z), Y0 + h / 2 * mpp(z)];
const tileOf = l => { const n = 2 ** l; return [(X0 + HALF) / (2 * HALF) * n, (HALF - Y0) / (2 * HALF) * n]; };
const tileBbox = (l, x, y) => { const s = 2 * HALF / 2 ** l; return [-HALF + x * s, HALF - (y + 1) * s, -HALF + (x + 1) * s, HALF - y * s]; };

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
    const l = LV(z), [tx, ty] = tileOf(l), x0 = Math.floor(tx - SCREEN[0] / 512), x1 = Math.floor(tx + SCREEN[0] / 512), y0 = Math.floor(ty - SCREEN[1] / 512), y1 = Math.floor(ty + SCREEN[1] / 512);
    const tiles = [];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) tiles.push([x, y]);
    const url = ([x, y]) => svc.cached && (svc.cachedMaxLevel ?? -1) >= l ? `${base}/tile/${l}/${y}/${x}` : canExport ? exp(tileBbox(l, x, y), 256, 256) : null;
    if (!url(tiles[0])) { svc.screens.push({ z, note: 'no tile or export at this zoom' }); continue; }
    const t = performance.now();
    const rs = await pool(tiles, 6, xy => get(url(xy)));
    const total = Math.round(performance.now() - t), ok = rs.filter(imageOk), ms = ok.map(r => r.ms).sort((a, b) => a - b);
    const one = canExport ? await get(exp(bboxAround(z, ...SCREEN), ...SCREEN)) : null;
    svc.screens.push({ z, groundM: +ground(z).toFixed(2), tiles: tiles.length, ok: ok.length, totalMs: total, medianTileMs: ms[ms.length >> 1] ?? null, maxTileMs: ms.at(-1) ?? null, kb: Math.round(ok.reduce((a, r) => a + r.bytes, 0) / 1024), oneExportMs: one?.ms ?? null, oneExportOk: one ? imageOk(one) : null, mode: svc.cached && (svc.cachedMaxLevel ?? -1) >= l ? `cached tiles (level ${l})` : 'export per tile' });
  }
  // metadata at the point (acquisition dates, resolution) where the service offers it
  const g = encodeURIComponent(JSON.stringify({ x: PT.lon, y: PT.lat, spatialReference: { wkid: 4326 } }));
  if (isImage) {
    const id = await json(`${base}/identify?geometry=${g}&geometryType=esriGeometryPoint&returnCatalogItems=true&returnGeometry=false&f=json`);
    svc.identify = { status: id.status, value: id.j?.value, items: (id.j?.catalogItems?.features || []).slice(0, 8).map(f => f.attributes) };
    // which source images cover the 4.8 km area around the point (a 5 x 5 grid): seams sit
    // where the image name or date changes
    const sheets = new Map();
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
      const q = encodeURIComponent(JSON.stringify({ x: PT.lon + b * 0.0105, y: PT.lat + a * 0.0105, spatialReference: { wkid: 4326 } }));
      const r = await json(`${base}/identify?geometry=${q}&geometryType=esriGeometryPoint&returnCatalogItems=true&returnGeometry=false&f=json`);
      const f = (r.j?.catalogItems?.features || []).map(x => x.attributes).find(x => x.Category === 1);
      if (f) { const k = f.Name; const e = sheets.get(k) || { name: k, date: f.acquisition_date ? new Date(f.acquisition_date).toISOString().slice(0, 10) : null, year: f.Year, res: f.resolution_value, agency: f.agency, points: 0 }; e.points++; sheets.set(k, e); }
    }
    svc.sheets = [...sheets.values()];
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
  for (const z of [14, 15, 16, 17, 18, 19]) {
    const r = await get(exp(bboxAround(z, 512, 512), 512, 512));
    svc.detail.push({ z, groundM: +ground(z).toFixed(2), ...(imageOk(r) ? await stats(r.body.toString('base64')) : { error: `${r.status} ${r.type}` }) });
  }
  // a wide view for seams / mismatched dates (about 4.8 x 4.8 km), saved for review
  const wide = await get(exp(bboxAround(14, 1024, 1024), 1024, 1024).replace('format=png', 'format=jpg'));
  if (imageOk(wide)) writeFileSync(`${out}/${svc.name}-brantley-wide.jpg`, wide.body);
}
// Spot check: a teal horizontal strip showed in the NAIP Plus layer at map zoom 16, about
// 31.588 N, 86.256-86.259 W (CI after screenshot, 30 Oct). Export that strip straight from each
// service (no MapLibre involved) and identify the source image there, to see whether it is in
// USGS's imagery or in our rendering.
report.spot = { lat: 31.588, lon: -86.258, services: [] };
{
  const [a, b] = merc(-86.272, 31.5865), [c, d] = merc(-86.244, 31.5895);
  for (const svc of report.services.filter(s => s.keyless && s.canExport)) {
    const isImage = svc.type === 'ImageServer', bb = [a, b, c, d].map(v => v.toFixed(2)).join(',');
    const u = isImage ? `${svc.url}/exportImage?bbox=${bb}&bboxSR=3857&imageSR=3857&size=1400,180&format=png&f=image`
      : `${svc.url}/export?bbox=${bb}&bboxSR=3857&imageSR=3857&size=1400,180&format=png&transparent=false&f=image`;
    const r = await get(u);
    if (imageOk(r)) writeFileSync(`${out}/spot-${svc.name}.png`, r.body);
    const e = { service: svc.name, status: r.status, saved: imageOk(r) };
    if (isImage) {
      const q = encodeURIComponent(JSON.stringify({ x: -86.258, y: 31.588, spatialReference: { wkid: 4326 } }));
      const id = await json(`${svc.url}/identify?geometry=${q}&geometryType=esriGeometryPoint&returnCatalogItems=true&returnGeometry=false&f=json`);
      e.value = id.j?.value;
      e.images = (id.j?.catalogItems?.features || []).map(f => f.attributes).filter(x => x.Category === 1).map(x => `${x.Name} (${x.acquisition_date ? new Date(x.acquisition_date).toISOString().slice(0, 10) : x.Year})`);
    }
    report.spot.services.push(e);
  }
}
// Tile colour check: at map zoom 16 one 512 px NAIP Plus tile came back teal in CI (and a
// thin teal strip in an earlier run), while direct exports were clean. Request the 3 x 3
// tiles around Brantley at map zoom 16 three times, with the layer's URL and with variants,
// decode each response as the browser would (RGBA), and flag tiles whose colour is off
// (red far below green and blue) or that carry partial transparency.
report.tileCheck = [];
{
  const naip = report.services.find(s => s.name === 'USGSNAIPPlus' && s.keyless);
  if (naip) {
    const variants = {
      'layer (jpgpng)': '&format=jpgpng',
      'jpgpng + bandIds=0,1,2': '&format=jpgpng&bandIds=0,1,2',
      'jpg + bandIds=0,1,2': '&format=jpg&bandIds=0,1,2',
      'png': '&format=png'
    };
    const z = 16, n = 2 ** z, cx = Math.floor((X0 + HALF) / (2 * HALF) * n), cy = Math.floor((HALF - Y0) / (2 * HALF) * n);
    for (const [label, q] of Object.entries(variants)) {
      const res = { variant: label, responses: 0, teal: 0, partialAlpha: 0, types: {}, kb: 0 };
      for (let k = 0; k < 3; k++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const bb = tileBbox(z, cx + dx, cy + dy).map(v => v.toFixed(2)).join(',');
        const r = await get(`${naip.url}/exportImage?bbox=${bb}&bboxSR=3857&imageSR=3857&size=512,512${q}&f=image`);
        if (!imageOk(r)) continue;
        res.responses++; res.kb += r.bytes / 1024; res.types[r.type] = (res.types[r.type] || 0) + 1;
        const st = await page.evaluate(async ([b64, mime]) => {
          const bmp = await createImageBitmap(await (await fetch(`data:${mime};base64,${b64}`)).blob(), { premultiplyAlpha: 'none' });
          const c = new OffscreenCanvas(bmp.width, bmp.height), x = c.getContext('2d'); x.drawImage(bmp, 0, 0);
          const d = x.getImageData(0, 0, bmp.width, bmp.height).data; let r = 0, g = 0, b = 0, a = 0, part = 0;
          for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; a += d[i + 3]; if (d[i + 3] > 0 && d[i + 3] < 255) part++; }
          const p = d.length / 4; return { r: r / p, g: g / p, b: b / p, a: a / p, part: part / p };
        }, [r.body.toString('base64'), r.type.split(';')[0]]);
        if (st.r < 0.6 * Math.min(st.g, st.b)) res.teal++;
        if (st.part > 0.01) res.partialAlpha++;
      }
      res.kb = Math.round(res.kb / Math.max(1, res.responses));
      report.tileCheck.push(res);
    }
  }
}
// The teal tile, traced (CI, 30 Oct): a format=jpgpng request that USGS answered with an RGBA
// PNG in which one side of a source-image seam has no red. Request that exact map zoom 16
// tile (full-precision bbox, as MapLibre sends it) with each format variant, plus a tile that
// is half sea off Miami Beach (to see how each format fills no-data). Saved as
// variant-<tile>-<n>.<ext>.
report.variants = [];
{
  const naip = report.services.find(s => s.name === 'USGSNAIPPlus' && s.keyless);
  const tileAt = (z, lon, lat) => { const [x, y] = merc(lon, lat), n = 2 ** z; return [Math.floor((x + HALF) / (2 * HALF) * n), Math.floor((HALF - y) / (2 * HALF) * n)]; };
  const cases = [['teal-seam', 16, ...tileAt(16, -86.2605, 31.5865)], ['miami-coast', 16, ...tileAt(16, -80.125, 25.79)], ['offshore-20km', 16, ...tileAt(16, -79.93, 25.79)]];
  const fmts = { jpgpng: '&format=jpgpng', 'jpgpng+bands': '&format=jpgpng&bandIds=0,1,2', jpg: '&format=jpg', 'jpg+bands': '&format=jpg&bandIds=0,1,2', png: '&format=png', 'png+bands': '&format=png&bandIds=0,1,2' };
  let n = 0;
  for (const [name, z, x, y] of naip ? cases : []) {
    const bb = tileBbox(z, x, y).join(',');
    for (const [label, q] of Object.entries(fmts)) {
      const r = await get(`${naip.url}/exportImage?bbox=${bb}&bboxSR=3857&imageSR=3857&size=512,512${q}&f=image`);
      const e = { tile: `${name} ${z}/${x}/${y}`, variant: label, status: r.status, type: r.type, kb: Math.round(r.bytes / 1024) };
      if (imageOk(r)) {
        const st = await page.evaluate(async ([b64, mime]) => {
          const bmp = await createImageBitmap(await (await fetch(`data:${mime};base64,${b64}`)).blob(), { premultiplyAlpha: 'none' });
          const c = new OffscreenCanvas(bmp.width, bmp.height), g = c.getContext('2d'); g.drawImage(bmp, 0, 0);
          const d = g.getImageData(0, 0, bmp.width, bmp.height).data; let r = 0, gg = 0, b = 0, a = 0, clear = 0, black = 0, white = 0, teal = 0;
          for (let k = 0; k < d.length; k += 4) {
            r += d[k]; gg += d[k + 1]; b += d[k + 2]; a += d[k + 3];
            if (d[k + 3] === 0) clear++; else if (d[k] + d[k + 1] + d[k + 2] < 6) black++; else if (d[k] + d[k + 1] + d[k + 2] > 759) white++;
            if (d[k + 3] && d[k] < 0.5 * Math.min(d[k + 1], d[k + 2]) && d[k + 1] > 60) teal++;
          }
          const p = d.length / 4, pc = v => +(v / p * 100).toFixed(1);
          return { rgba: [r / p, gg / p, b / p, a / p].map(Math.round), transparentPct: pc(clear), blackPct: pc(black), whitePct: pc(white), tealPct: pc(teal) };
        }, [r.body.toString('base64'), r.type.split(';')[0]]);
        Object.assign(e, st);
        e.saved = `variant-${name}-${n++}.${/png/.test(r.type) ? 'png' : 'jpg'}`;
        writeFileSync(`${out}/${e.saved}`, r.body);
      }
      report.variants.push(e);
    }
  }
}
// cached z16 tile vs each export service over the same tile: colour/date match at the handover
const cached = report.services.find(s => s.name === 'USGSImageryOnly');
if (cached?.keyless) {
  const [tx, ty] = tileOf(16), x = Math.floor(tx), y = Math.floor(ty); // level 16 = the last cached level
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
// Full 1280x800 screen in MapLibre: 256 px vs 512 px requests (fewer, larger exports), z17
// and z18, three alternating runs each, fresh browser context per run (no cache).
report.screenTiming = [];
const timeScreen = async (tpl, tileSize, z) => {
  const ctx = await browser.newContext({ viewport: { width: SCREEN[0], height: SCREEN[1] } }), p = await ctx.newPage();
  await p.setContent(`<html><head><link rel="stylesheet" href="${ML}.css"><script src="${ML}.js"></script></head><body style="margin:0"><div id="m" style="width:${SCREEN[0]}px;height:${SCREEN[1]}px"></div></body></html>`);
  const r = await p.evaluate(([tpl, ts, z, c]) => new Promise(done => {
    let n = 0;
    const map = new maplibregl.Map({ container: 'm', center: [c.lon, c.lat], zoom: z, fadeDuration: 0, attributionControl: false,
      style: { version: 8, sources: { s: { type: 'raster', tiles: [tpl], tileSize: ts, maxzoom: 20 } }, layers: [{ id: 's', type: 'raster', source: 's' }] } });
    map.on('dataloading', e => { if (e.tile) n++; });
    const t0 = performance.now();
    map.once('idle', () => done({ ms: Math.round(performance.now() - t0), requests: n }));
    setTimeout(() => done({ ms: null, requests: n }), 60000);
  }), [tpl, tileSize, z, PT]);
  await ctx.close();
  return r;
};
for (const svc of report.services.filter(s => s.keyless && s.type === 'ImageServer' && s.exportTemplate)) {
  for (const z of [17, 18]) for (const ts of [256, 512]) {
    const tpl = svc.exportTemplate.replace('size=256,256', `size=${ts},${ts}`), runs = [];
    for (let k = 0; k < 3; k++) runs.push(await timeScreen(tpl, ts, z));
    const ms = runs.map(r => r.ms).filter(v => v != null).sort((a, b) => a - b);
    report.screenTiming.push({ service: svc.name, z, tileSize: ts, requests: runs[0].requests, runsMs: runs.map(r => r.ms), medianMs: ms[ms.length >> 1] ?? null });
  }
}
await browser.close();

// ---- 4. report -------------------------------------------------------------------------------
const yes = v => v == null ? '—' : v ? 'yes' : 'no';
const md = [`# Satellite zoom probe`, '', `Generated ${report.generated} by \`scripts/data/satellite-probe.mjs\` (GitHub Actions runner). Point: ${PT.name} (${PT.lat}, ${PT.lon}). **Zooms are the site's map zooms** (MapLibre, 512 px tiles): map zoom z uses 256 px web tiles of level z + 1, so the cached USGS layer (levels ≤ 16) is sharp up to map zoom 15. Ground size of one screen pixel at Brantley: z15 ${ground(15).toFixed(2)} m, z16 ${ground(16).toFixed(2)} m, z17 ${ground(17).toFixed(2)} m, z18 ${ground(18).toFixed(2)} m.`, '',
  '## Services directory', '', ...Object.entries(report.directory).map(([h, d]) => `- ${h}: HTTP ${d.status}${d.services ? ` — ${d.services.join(', ')}` : ` — ${d.error}`}${d.folders?.length ? `; folders: ${d.folders.join(', ')}` : ''}`), '',
  '## Imagery services', '', '| Service | Type | Keyless | Cached (max level) | Export | Formats | Max image | Pixel size | Max scale |', '|---|---|---|---|---|---|---|---|---|',
  ...report.services.map(s => `| ${s.name} | ${s.type} | ${yes(s.keyless)}${s.error ? ` (${s.error})` : ''} | ${s.cached ? `yes (${s.cachedMaxLevel})` : 'no'} | ${yes(s.canExport)} | ${s.formats || '—'} | ${s.maxImage || '—'} | ${s.pixelSize || '—'} | ${s.maxScale ?? '—'} |`), '',
  ...report.services.filter(s => s.description || s.layers.length).flatMap(s => [`**${s.name}**: ${s.description || ''}${s.copyright ? ` Copyright: ${s.copyright}` : ''}${s.layers.length ? ` Layers: ${s.layers.join('; ')}` : ''}`, '']),
  '## Export, WMS and CORS (one 256 px image at z17, request sent with Origin: ' + ORIGIN + ')', '', '| Service | Export | Export CORS | WMS caps | WMS EPSG:3857 | WMS GetMap | WMS CORS |', '|---|---|---|---|---|---|---|',
  ...report.services.filter(s => s.keyless).map(s => `| ${s.name} | ${s.exportTest ? `${s.exportTest.status} ${s.exportTest.type} ${s.exportTest.bytes} B ${s.exportTest.ms} ms ${s.exportTest.note}` : '—'} | ${s.exportTest?.acao ?? 'none'} | ${s.wms?.status} ${yes(s.wms?.isCapabilities)} | ${yes(s.wms?.epsg3857)} | ${s.wms?.getMap ? `${s.wms.getMap.status} ${s.wms.getMap.type} ${s.wms.getMap.ms} ms ${s.wms.getMap.note}` : '—'} | ${s.wms?.getMap?.acao ?? 'none'} |`), '',
  '## Load time for one 1280×800 screen at Brantley (256 px requests, 6 at a time; plus one 1280×800 export)', '', '| Service | Zoom | m/pixel | Mode | Requests (ok) | Total | Median / max per request | KB | One export |', '|---|---|---|---|---|---|---|---|---|',
  ...report.services.filter(s => s.screens).flatMap(s => s.screens.map(r => r.note ? `| ${s.name} | ${r.z} | | ${r.note} | | | | | |` : `| ${s.name} | ${r.z} | ${r.groundM} | ${r.mode} | ${r.tiles} (${r.ok}) | ${r.totalMs} ms | ${r.medianTileMs} / ${r.maxTileMs} ms | ${r.kb} | ${r.oneExportMs ?? '—'} ms${r.oneExportOk === false ? ' (failed)' : ''} |`)), '',
  '## Image detail by zoom (512×512 export at Brantley)', '', 'Mean absolute difference between neighbouring pixels. While the source is sharper than the request, detail stays roughly level or rises; once requests are finer than the source, it roughly halves with each zoom level (the image is only being upscaled).', '',
  '| Service | ' + [14, 15, 16, 17, 18, 19].map(z => `z${z} (${ground(z).toFixed(2)} m)`).join(' | ') + ' |', '|---|' + [14, 15, 16, 17, 18, 19].map(() => '---').join('|') + '|',
  ...report.services.filter(s => s.detail).map(s => `| ${s.name} | ${s.detail.map(d => d.error || d.detail).join(' | ')} |`), '',
  '## Handover: last cached tile (level 16) vs an export of the same area (colour = mean RGB)', '',
  report.cachedZ16 ? `- USGSImageryOnly cached tile ${report.cachedZ16.tile.join('/')}: mean RGB ${report.cachedZ16.rgb.join(', ')}, detail ${report.cachedZ16.detail}` : '- cached tile unavailable',
  ...report.services.filter(s => s.vsCachedZ16).map(s => `- ${s.name} export of the same tile: mean RGB ${s.vsCachedZ16.rgb.join(', ')}, detail ${s.vsCachedZ16.detail}`), '',
  '## Metadata at the point (identify)', '', ...report.services.filter(s => s.identify).map(s => `- **${s.name}** (HTTP ${s.identify.status}${s.identify.error ? `, ${s.identify.error}` : ''}): ${s.identify.items?.length ? '```' + JSON.stringify(s.identify.items).slice(0, 1500) + '```' : 'no items'}`), '',
  '## Source images around the point (5 × 5 identify grid, about 4.8 km across)', '',
  ...report.services.filter(s => s.sheets).map(s => `- **${s.name}**: ${s.sheets.map(x => `${x.name} (${x.date || x.year}, ${x.res ?? '?'} m, ${x.agency || '?'}; ${x.points} of 25 points)`).join('; ') || 'none'}`), '',
  '## Spot check: teal strip near 31.588 N, 86.258 W', '', 'Export of the strip area (86.272–86.244 W, 31.5865–31.5895 N, 1400×180 px, about 1.9 m/px) straight from each service; images saved as `spot-<service>.png`.', '',
  ...report.spot.services.map(e => `- **${e.service}**: HTTP ${e.status}${e.saved ? ', saved' : ''}${e.value != null ? `; pixel value at the point: ${e.value}` : ''}${e.images ? `; source images: ${e.images.join(', ') || 'none'}` : ''}`), '',
  '## Tile colour check (NAIP Plus, 3 × 3 tiles of 512 px at map zoom 16, 3 rounds)', '', '| Variant | Responses | Teal / off-colour | Partly transparent | Types | Mean KB |', '|---|---|---|---|---|---|',
  ...report.tileCheck.map(t => `| ${t.variant} | ${t.responses} | ${t.teal} | ${t.partialAlpha} | ${Object.entries(t.types).map(([k, v]) => `${k} ×${v}`).join(', ')} | ${t.kb} |`), '',
  '## Format variants on two tiles (NAIP Plus, map zoom 16, full-precision bbox)', '', 'teal-seam: the tile that drew teal in the page; miami-coast: half sea. Pixel shares: transparent / black / white / teal (red under half of green and blue).', '', '| Tile | Variant | HTTP | Type | KB | Mean RGBA | Transparent % | Black % | White % | Teal % | File |', '|---|---|---|---|---|---|---|---|---|---|---|',
  ...report.variants.map(v => `| ${v.tile} | ${v.variant} | ${v.status} | ${v.type} | ${v.kb} | ${v.rgba?.join(', ') ?? '—'} | ${v.transparentPct ?? '—'} | ${v.blackPct ?? '—'} | ${v.whitePct ?? '—'} | ${v.tealPct ?? '—'} | ${v.saved || ''} |`), '',
  '## Full 1280×800 screen in MapLibre (until idle, fresh cache each run)', '', '| Service | Zoom | Request size | Requests | Runs (ms) | Median |', '|---|---|---|---|---|---|',
  ...report.screenTiming.map(t => `| ${t.service} | ${t.z} | ${t.tileSize} px | ${t.requests} | ${t.runsMs.join(', ')} | ${t.medianMs ?? '—'} ms |`), '',
  '## MapLibre 5.24.0 drawing the endpoint as raster tiles ({bbox-epsg-3857}, z17)', '', '| Service | Kind | Idle after | All tiles loaded | Errors |', '|---|---|---|---|---|',
  ...report.maplibre.map(m => `| ${m.service} | ${m.kind} | ${m.ms ?? '—'} ms | ${yes(m.loaded)} | ${m.errors.join('; ') || 'none'} |`), ''].join('\n');
writeFileSync(`${out}/satellite-probe.md`, md);
writeFileSync(`${out}/satellite-probe.json`, JSON.stringify(report, null, 1));
console.log(md);
for (const s of report.services) console.log(`::notice title=Imagery ${s.name}::keyless=${s.keyless} cached=${s.cached}(${s.cachedMaxLevel}) export=${s.canExport} cors=${s.exportTest?.acao ?? 'n/a'} detail=${(s.detail || []).map(d => d.detail).join('/')}`);
