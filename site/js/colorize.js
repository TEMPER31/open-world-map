// Colours one gridded field into an RGBA Web Mercator image (rows spaced in Mercator y,
// so MapLibre's image source places them correctly). Runs in the worker or main thread.

import { FIELDS, lut } from './scales.js';

export const IMG = 1024;
export const MAX_LAT = 85.051129;

let idx = null; // per-column / per-row bilinear indices for the current grid shape

function indices(fr) {
  if (idx && idx.nx === fr.nx && idx.ny === fr.ny) return idx;
  const i0 = new Int32Array(IMG), i1 = new Int32Array(IMG), fx = new Float32Array(IMG);
  const j0 = new Int32Array(IMG), fy = new Float32Array(IMG);
  for (let k = 0; k < IMG; k++) {
    const x = ((k + 0.5) / IMG * 360) / fr.deg;          // lon -180..180 -> grid x
    i0[k] = Math.floor(x) % fr.nx; i1[k] = (i0[k] + 1) % fr.nx; fx[k] = x - Math.floor(x);
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (k + 0.5) / IMG))) * 180 / Math.PI;
    const y = Math.min(fr.ny - 1.001, (90 - lat) / fr.deg);
    j0[k] = Math.floor(y); fy[k] = y - j0[k];
  }
  return idx = { nx: fr.nx, ny: fr.ny, i0, i1, fx, j0, fy };
}

export function colorize(fr, field, light, out) {
  const f = FIELDS[field], L = lut(field, light), arr = fr.fields[field], rgba = L.rgba;
  const alpha = light && f.mode !== 'veil' ? 0.9 : 1;
  const { nx, i0, i1, fx, j0, fy } = indices(fr);
  let p = 0;
  for (let y = 0; y < IMG; y++) {
    const r0 = j0[y] * nx, r1 = r0 + nx, wy = fy[y];
    for (let x = 0; x < IMG; x++, p += 4) {
      const a = arr[r0 + i0[x]], b = arr[r0 + i1[x]], c = arr[r1 + i0[x]], d = arr[r1 + i1[x]], wx = fx[x];
      const top = a + (b - a) * wx, v = top + (c + (d - c) * wx - top) * wy;
      const i = L.index(v);
      if (i < 0) { out[p + 3] = 0; continue; }
      const q = i << 2;
      out[p] = rgba[q]; out[p + 1] = rgba[q + 1]; out[p + 2] = rgba[q + 2]; out[p + 3] = rgba[q + 3] * alpha;
    }
  }
  return out;
}
