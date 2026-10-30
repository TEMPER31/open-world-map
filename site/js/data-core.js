// Loads and decodes forecast frames. Used by frame-worker.js (normally) and by data.js on
// the main thread when module workers are unavailable.
//
// Live data (data/live/, built by scripts/data/build_data.py) is a set of PNGs:
//   gfs/wind/fNNN.png  R = U, G = V, 8-bit, linear between the frame's [min, max] (m/s)
//   gfs/{temp,pres}/fNNN.png  16-bit: value = offset + step * (R * 256 + G)
//   gfs/cloud/fNNN.png  grey 8-bit, 0-100 %
//   gfs/rain/fNNN.png  grey, 0 = < 0.01 mm, b -> 10 ** ((b - 1) * 0.02 - 2) mm in the past hour
//   aq/YYYYMMDDHH.png  three stacked 16-bit blocks: PM2.5, PM10, US AQI (65535 = no data)
//   gfs/series.png     R = temperature, G = wind km/h; 3-hourly blocks for the place chart
// Without live data the sample generator is used, in the same frame shape.

import { loadScales, FIELDS, lut } from './scales.js';
import { centres } from './contours.js';
import { fillNaN, upsample } from './grid.js';
import { frame as sampleFrame, pointSeries } from './sample-data.js';
import { HOURS } from './config.js';

let M = null;       // live manifest, or null for sample mode
let base = '', runTag = '';
const cache = new Map();
const CACHE_MAX = 40;

function remember(key, make) {
  if (!cache.has(key)) {
    cache.set(key, make());
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  }
  const p = cache.get(key);
  p.catch(() => cache.delete(key));
  return p;
}

export async function init(manifestUrl) {
  await loadScales();
  if (!manifestUrl) return null;
  const r = await fetch(manifestUrl, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`manifest HTTP ${r.status}`);
  M = await r.json();
  base = new URL('.', new URL(manifestUrl, self.location.href)).href;
  // Frame files are cached by the browser; tag them with the run so a new run never reuses
  // an older run's frame under the new metadata.
  runTag = `?run=${M.gfs.run.replace(/\D/g, '').slice(0, 10)}`;
  return M;
}

async function decodePNG(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  // No colour management or premultiplication: the bytes are data, not colours.
  const bmp = await createImageBitmap(await r.blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
  const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(bmp.width, bmp.height)
    : Object.assign(document.createElement('canvas'), { width: bmp.width, height: bmp.height });
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0);
  const px = ctx.getImageData(0, 0, bmp.width, bmp.height).data;
  bmp.close?.();
  return { w: c.width, h: c.height, px };
}

const lin = (b, [lo, hi]) => lo + b / 255 * (hi - lo);
const u16 = (px, i) => px[i * 4] * 256 + px[i * 4 + 1];

// The AQ file nearest to a valid time (within 90 minutes).
function aqFile(validMs) {
  let best = null, gap = 90 * 60e3;
  for (const x of M.aq?.files || []) {
    const d = Math.abs(Date.parse(x.valid_utc) - validMs);
    if (d <= gap) { best = x; gap = d; }
  }
  return best;
}

async function windPNG(f) {
  return remember(`wpng:${f}`, () => decodePNG(`${base}gfs/wind/f${String(f).padStart(3, '0')}.png${runTag}`));
}

async function liveGrid(f, field) {
  const fr = M.gfs.frames.find(x => x.f === f);
  if (!fr) throw new Error(`no frame f${f}`);
  const name = `f${String(f).padStart(3, '0')}.png${runTag}`;
  if (field === 'wind') {
    const { px } = await windPNG(f);
    const grid = M.gfs.wind_grid, n = grid.nx * grid.ny;
    const u = new Float32Array(n), v = new Float32Array(n), data = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      u[i] = lin(px[i * 4], fr.wind.u); v[i] = lin(px[i * 4 + 1], fr.wind.v);
      data[i] = Math.hypot(u[i], v[i]) * 3.6; // km/h, as in the design scale
    }
    return { grid, u, v, data };
  }
  if (field === 'aq') {
    const x = M.aq && aqFile(Date.parse(fr.valid_utc));
    const g4 = M.aq?.grid || { nx: 1, ny: 1, deg: 180, lon0: -180, lat0: 90 };
    if (!x) return { grid: g4, data: new Float32Array(g4.nx * g4.ny).fill(NaN), missing: true };
    const { px } = await decodePNG(`${base}aq/${x.file}`);
    const n = g4.nx * g4.ny, enc = M.aq.encoding, pm = new Float32Array(n), aqi = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const a = u16(px, i), c = u16(px, i + 2 * n);
      pm[i] = a === enc.nodata ? NaN : a * enc.step[0];
      aqi[i] = c === enc.nodata ? NaN : c * enc.step[2];
    }
    // Fill missing points from their neighbours, then smooth to 1 deg with Catmull-Rom so the
    // 4 deg grid doesn't look blocky. Values at the original nodes are unchanged.
    const up = upsample(g4, fillNaN(g4, pm), 4), upA = upsample(g4, fillNaN(g4, aqi), 4);
    for (let i = 0; i < up.data.length; i++) { up.data[i] = Math.max(0, up.data[i]); upA.data[i] = Math.max(0, upA.data[i]); }
    return { grid: up.grid, data: up.data, aqi: upA.data, valid_utc: x.valid_utc };
  }
  const { px } = await decodePNG(`${base}gfs/${field}/${name}`);
  const grid = M.gfs.grid, n = grid.nx * grid.ny, data = new Float32Array(n), m = fr[field];
  if (field === 'rain') for (let i = 0; i < n; i++) { const b = px[i * 4]; data[i] = b ? Math.pow(10, (b - 1) * 0.02 - 2) : 0; }
  else if (m.step) for (let i = 0; i < n; i++) data[i] = m.offset + m.step * u16(px, i);
  else for (let i = 0; i < n; i++) data[i] = lin(px[i * 4], m.range);
  return { grid, data };
}

export function grid(f, field) {
  return remember(`${f}:${field}`, () => M ? liveGrid(f, field) : Promise.resolve(sampleFrame(f).grids[field]));
}

// Fixed storage ranges (in the scale's transformed units: log for precipitation) for the
// 16-bit values in the field texture. Wide enough for any real value; precision is range/65535
// (e.g. 0.004 hPa, 0.003 degC).
const STORE = { temp: [-100, 70], wind: [0, 400], rain: [-7.5, 7.5], cloud: [0, 100], pres: [850, 1100], aq: [0, 2000] };

// Texture for the GPU field layer: per grid cell, the field value (transformed, 16-bit over
// STORE: R = high, G = low byte) and a mask (B = 255 data, 0 = transparent / no data). The
// shader maps values to the colour LUT and draws isobars from the pressure values directly.
// Independent of the theme: only the LUT texture changes with Light/Dark.
export function fieldTexture(f, field) {
  return remember(`tex:${f}:${field}`, async () => {
    const g = await grid(f, field), L = lut(field, false), [lo, hi] = STORE[field], n = g.grid.nx * g.grid.ny, out = new Uint8Array(n * 4);
    const below = FIELDS[field].transparentBelow;
    for (let i = 0; i < n; i++) {
      const v = g.data[i];
      if (v !== v || (below != null && v < below)) continue;
      const q = Math.max(0, Math.min(65535, Math.round((L.tf(v) - lo) / (hi - lo) * 65535)));
      out[i * 4] = q >> 8; out[i * 4 + 1] = q & 255; out[i * 4 + 2] = 255; out[i * 4 + 3] = 255;
    }
    return { rgba: out, grid: g.grid, missing: !!g.missing, store: [lo, hi], domain: L.domain };
  }).then(t => ({ ...t, rgba: t.rgba.slice() })); // copy: the cached buffer may be transferred
}

// H/L centres for pressure (isobars themselves are drawn by the field shader).
export function pressureOverlays(f) {
  return remember(`iso:${f}`, async () => {
    const g = await grid(f, 'pres');
    return { centres: centres(g.grid, g.data) };
  });
}

// Wind texture for the GPU particles: the PNG's own bytes (R = U, G = V) with the file's
// ranges, so values are quantised once (by the data job), not twice.
export async function windTexture(f) {
  if (M) {
    const fr = M.gfs.frames.find(x => x.f === f), { px, w, h } = await windPNG(f);
    return { rgba: new Uint8Array(px), grid: M.gfs.wind_grid, u: fr.wind.u, v: fr.wind.v, w, h };
  }
  const g = await grid(f, 'wind'), n = g.grid.nx * g.grid.ny; // sample mode: quantise once here
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (let i = 0; i < n; i++) { u0 = Math.min(u0, g.u[i]); u1 = Math.max(u1, g.u[i]); v0 = Math.min(v0, g.v[i]); v1 = Math.max(v1, g.v[i]); }
  const rgba = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = Math.round((g.u[i] - u0) / ((u1 - u0) || 1) * 255);
    rgba[i * 4 + 1] = Math.round((g.v[i] - v0) / ((v1 - v0) || 1) * 255);
    rgba[i * 4 + 3] = 255;
  }
  return { rgba, grid: g.grid, u: [u0, u1], v: [v0, v1] };
}

// Point time series for the place chart: [{f, temp, wind}] (wind in km/h).
let series = null;
export async function pointSeriesAt(lon, lat) {
  if (!M) {
    const T = pointSeries(lon, lat, 'temp'), W = pointSeries(lon, lat, 'wind');
    return T.map((t, f) => ({ f, temp: t, wind: W[f] })).filter(p => p.f <= HOURS);
  }
  const s = M.gfs.series;
  if (!s) return [];
  series ||= decodePNG(`${base}gfs/series.png${runTag}`);
  const { px } = await series, g = s.grid, block = g.nx * g.ny;
  const x = ((((lon - g.lon0) / g.deg) % g.nx) + g.nx) % g.nx, y = Math.max(0, Math.min(g.ny - 1, (g.lat0 - lat) / g.deg));
  const i0 = Math.floor(x), j0 = Math.floor(y), i1 = (i0 + 1) % g.nx, j1 = Math.min(g.ny - 1, j0 + 1), fx = x - i0, fy = y - j0;
  return s.hours.map((f, k) => {
    const at = (i, j, c) => px[(k * block + j * g.nx + i) * 4 + c];
    const bil = c => (at(i0, j0, c) * (1 - fx) + at(i1, j0, c) * fx) * (1 - fy) + (at(i0, j1, c) * (1 - fx) + at(i1, j1, c) * fx) * fy;
    return { f, temp: lin(bil(0), s.temp), wind: lin(bil(1), s.wind_kmh) };
  });
}
