// Colours one gridded field into an RGBA Web Mercator image (rows spaced in Mercator y,
// so MapLibre's canvas source places them correctly). Runs in the worker or main thread.
// A grid is {nx, ny, deg, lon0, lat0}: row 0 is lat0 (north), column 0 is lon0.

import { FIELDS, lut } from './scales.js';

export const IMG = 1024;
export const MAX_LAT = 85.051129;

const cache = new Map(); // grid shape -> per-column / per-row bilinear indices

function indices(g) {
  const key = `${g.nx}|${g.ny}|${g.deg}|${g.lon0}|${g.lat0}`;
  if (cache.has(key)) return cache.get(key);
  const i0 = new Int32Array(IMG), i1 = new Int32Array(IMG), fx = new Float32Array(IMG);
  const j0 = new Int32Array(IMG), j1 = new Int32Array(IMG), fy = new Float32Array(IMG);
  for (let k = 0; k < IMG; k++) {
    const lon = -180 + (k + 0.5) / IMG * 360;
    const x = ((((lon - g.lon0) / g.deg) % g.nx) + g.nx) % g.nx;
    i0[k] = Math.floor(x); i1[k] = (i0[k] + 1) % g.nx; fx[k] = x - i0[k];
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (k + 0.5) / IMG))) * 180 / Math.PI;
    const y = Math.max(0, Math.min(g.ny - 1, (g.lat0 - lat) / g.deg));
    j0[k] = Math.floor(y); j1[k] = Math.min(g.ny - 1, j0[k] + 1); fy[k] = y - j0[k];
  }
  const v = { i0, i1, fx, j0, j1, fy };
  cache.set(key, v);
  return v;
}

// data: Float32Array in display units (NaN = no data -> transparent).
export function colorize(grid, data, field, light, out) {
  const f = FIELDS[field], L = lut(field, light), rgba = L.rgba;
  const alpha = light && f.mode !== 'veil' ? 0.9 : 1;
  const { i0, i1, fx, j0, j1, fy } = indices(grid), nx = grid.nx;
  let p = 0;
  for (let y = 0; y < IMG; y++) {
    const r0 = j0[y] * nx, r1 = j1[y] * nx, wy = fy[y];
    for (let x = 0; x < IMG; x++, p += 4) {
      const a = data[r0 + i0[x]], b = data[r0 + i1[x]], c = data[r1 + i0[x]], d = data[r1 + i1[x]], wx = fx[x];
      const top = a + (b - a) * wx, v = top + (c + (d - c) * wx - top) * wy;
      const i = L.index(v);
      if (i < 0) { out[p + 3] = 0; continue; }
      const q = i << 2;
      out[p] = rgba[q]; out[p + 1] = rgba[q + 1]; out[p + 2] = rgba[q + 2]; out[p + 3] = rgba[q + 3] * alpha;
    }
  }
  return out;
}

// Bilinear sample of a grid at lon/lat (lon wraps, lat clamps). NaN where there is no data.
export function sample(grid, data, lon, lat) {
  const x = ((((lon - grid.lon0) / grid.deg) % grid.nx) + grid.nx) % grid.nx;
  const y = Math.max(0, Math.min(grid.ny - 1, (grid.lat0 - lat) / grid.deg));
  const i0 = Math.floor(x), j0 = Math.floor(y), i1 = (i0 + 1) % grid.nx, j1 = Math.min(grid.ny - 1, j0 + 1);
  const fx = x - i0, fy = y - j0, nx = grid.nx;
  const a = data[j0 * nx + i0], b = data[j0 * nx + i1], c = data[j1 * nx + i0], d = data[j1 * nx + i1];
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}
