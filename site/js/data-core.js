// Loads and decodes forecast frames. Used by frame-worker.js (normally) and by data.js on
// the main thread when module workers are unavailable.
//
// Live data (data/live/, built by scripts/data/build_data.py) is a set of 8-bit PNGs:
//   gfs/wind/fNNN.png  R = U, G = V (m/s, linear between the frame's [min, max])
//   gfs/{temp,pres,cloud}/fNNN.png  grey, linear between [min, max]
//   gfs/rain/fNNN.png  grey, 0 = dry, b -> 10 ** ((b - 1) * 0.02 - 2) mm/h
//   aq/YYYYMMDDHH.png  R = PM2.5, G = PM10, B = US AQI; 0 = no data
//   gfs/series.png     R = temperature, G = wind km/h; 3-hourly blocks for the place chart
// Without live data the sample generator is used, in the same frame shape.

import { loadScales, FIELDS } from './scales.js';
import { isobars, centres } from './contours.js';
import { colorize, IMG } from './colorize.js';
import { frame as sampleFrame, pointSeries } from './sample-data.js';
import { HOURS } from './config.js';

let M = null;       // live manifest, or null for sample mode
let base = '';
const cache = new Map();
const CACHE_MAX = 30;

export async function init(manifestUrl) {
  await loadScales();
  if (!manifestUrl) return null;
  const r = await fetch(manifestUrl, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`manifest HTTP ${r.status}`);
  M = await r.json();
  base = new URL('.', new URL(manifestUrl, self.location.href)).href;
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
const lin0 = (b, [lo, hi]) => b === 0 ? NaN : lo + (b - 1) / 254 * (hi - lo);

// The AQ file nearest to a valid time (within 90 minutes).
function aqFile(validMs) {
  let best = null, gap = 90 * 60e3;
  for (const x of M.aq?.files || []) {
    const d = Math.abs(Date.parse(x.valid_utc) - validMs);
    if (d <= gap) { best = x; gap = d; }
  }
  return best;
}

async function liveGrid(f, field) {
  const fr = M.gfs.frames.find(x => x.f === f);
  if (!fr) throw new Error(`no frame f${f}`);
  const name = `f${String(f).padStart(3, '0')}.png`;
  if (field === 'wind') {
    const { px } = await decodePNG(`${base}gfs/wind/${name}`);
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
    const grid = M.aq?.grid || { nx: 1, ny: 1, deg: 180, lon0: -180, lat0: 90 };
    if (!x) return { grid, data: new Float32Array(grid.nx * grid.ny).fill(NaN), missing: true };
    const { px } = await decodePNG(`${base}aq/${x.file}`);
    const n = grid.nx * grid.ny, data = new Float32Array(n), aqi = new Float32Array(n);
    for (let i = 0; i < n; i++) { data[i] = lin0(px[i * 4], x.pm2_5); aqi[i] = lin0(px[i * 4 + 2], x.us_aqi); }
    return { grid, data, aqi, valid_utc: x.valid_utc };
  }
  const { px } = await decodePNG(`${base}gfs/${field}/${name}`);
  const grid = M.gfs.grid, n = grid.nx * grid.ny, data = new Float32Array(n);
  if (field === 'rain') for (let i = 0; i < n; i++) { const b = px[i * 4]; data[i] = b ? Math.pow(10, (b - 1) * 0.02 - 2) : 0; }
  else { const r = fr[field].range; for (let i = 0; i < n; i++) data[i] = lin(px[i * 4], r); }
  return { grid, data };
}

export async function grid(f, field) {
  const key = `${f}:${field}`;
  if (!cache.has(key)) {
    cache.set(key, M ? liveGrid(f, field) : Promise.resolve(sampleFrame(f).grids[field]));
    if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value);
  }
  try { return await cache.get(key); } catch (e) { cache.delete(key); throw e; }
}

export async function pixels(f, field, light) {
  const g = await grid(f, field);
  return colorize(g.grid, g.data, field, light, new Uint8ClampedArray(IMG * IMG * 4));
}

export async function pressureOverlays(f) {
  const g = await grid(f, 'pres');
  return { geojson: isobars(g.grid, g.data, FIELDS.pres.interval, FIELDS.pres.majorEvery), centres: centres(g.grid, g.data) };
}

// RGBA bytes for the GPU particle layer (R = U, G = V) plus the value ranges.
export async function windTexture(f) {
  const g = await grid(f, 'wind'), n = g.grid.nx * g.grid.ny;
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (let i = 0; i < n; i++) { u0 = Math.min(u0, g.u[i]); u1 = Math.max(u1, g.u[i]); v0 = Math.min(v0, g.v[i]); v1 = Math.max(v1, g.v[i]); }
  const su = 255 / ((u1 - u0) || 1), sv = 255 / ((v1 - v0) || 1), rgba = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    rgba[i * 4] = Math.round((g.u[i] - u0) * su);
    rgba[i * 4 + 1] = Math.round((g.v[i] - v0) * sv);
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
  series ||= decodePNG(`${base}gfs/series.png`);
  const { px } = await series, g = s.grid, block = g.nx * g.ny;
  const x = ((((lon - g.lon0) / g.deg) % g.nx) + g.nx) % g.nx, y = Math.max(0, Math.min(g.ny - 1, (g.lat0 - lat) / g.deg));
  const i0 = Math.floor(x), j0 = Math.floor(y), i1 = (i0 + 1) % g.nx, j1 = Math.min(g.ny - 1, j0 + 1), fx = x - i0, fy = y - j0;
  return s.hours.map((f, k) => {
    const at = (i, j, c) => px[(k * block + j * g.nx + i) * 4 + c];
    const bil = c => (at(i0, j0, c) * (1 - fx) + at(i1, j0, c) * fx) * (1 - fy) + (at(i0, j1, c) * (1 - fx) + at(i1, j1, c) * fx) * fy;
    return { f, temp: lin(bil(0), s.temp), wind: lin(bil(1), s.wind_kmh) };
  });
}
