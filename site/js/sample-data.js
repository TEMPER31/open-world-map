// SAMPLE DATA. Everything in this module is synthetic, generated in the browser from the
// same formulas as the v3 design mockup. Nothing here is a real observation or forecast.
// Since Phase 2 it is only used when no live data is available (local preview without a
// data build, or a first deployment before the data job has run); the UI labels it.

import { HOURS, SAMPLE_GRID_DEG } from './config.js';

const D = Math.PI / 180;
const NX = Math.round(360 / SAMPLE_GRID_DEG), NY = Math.round(180 / SAMPLE_GRID_DEG) + 1;

// Synthetic storm/vortex keyframes: [hour, lon, lat, strength].
const VK = [
  { r: 3.2, d: 1, pk: 58 / 150, k: [[-24, 141, 12, 110], [-10, 136.2, 15.6, 135], [0, 132, 18, 150], [12, 130, 18.6, 158], [18, 129, 18.8, 165], [24, 127.9, 18.9, 162], [31, 124.4, 18.5, 150], [36, 123.2, 18.3, 120], [48, 121, 18.2, 90], [72, 118.5, 19.8, 55]] },
  { r: 3, d: -1, pk: 30 / 85, k: [[-24, 72, -14, 70], [0, 68, -17, 85], [48, 64, -20, 100], [96, 61, -23, 60]] },
  { r: 8, d: 1, pk: 32 / 55, k: [[-24, -46, 49, 50], [0, -38, 52, 55], [72, -20, 55, 58]] },
  { r: 9, d: -1, pk: 26 / 50, k: [[-24, -158, -47, 50], [0, -150, -48, 50], [168, -95, -50, 45]] }
];
const HOT = [[78, 27, 7, 150], [88, 24, 4, 80], [115, 33, 7, 90], [10, 16, 10, 55], [-58, -11, 7, 55], [24, -9, 8, 50], [100, 18, 5, 45], [45, 25, 7, 35], [-99, 20, 3, 40], [31, 30, 3, 45]];
const wdx = (lo, o, la) => { let dx = lo - o.lon; dx = ((dx + 540) % 360) - 180; return dx * Math.cos(la * D); };

// Analytic sample model at forecast hour t (0..48).
function model(t) {
  const PH = t * 0.045;
  const VORT = VK.map(v => {
    const k = v.k; let j = 0;
    while (j < k.length - 2 && t > k[j + 1][0]) j++;
    const a = k[j], b = k[j + 1], f = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0])));
    const s = a[3] + (b[3] - a[3]) * f;
    return { r: v.r, d: v.d, lon: a[1] + (b[1] - a[1]) * f, lat: a[2] + (b[2] - a[2]) * f, s, p: s * v.pk };
  });
  const wind = (lon, lat) => {
    const φ = lat * D;
    let u = -24 * Math.cos(φ * 6) * Math.cos(φ), v = 0;
    u += 14 * Math.sin(lon * D * 3 + lat * .09 + PH) + 8 * Math.sin(lon * D * 7 - lat * .05 + 1.3 - PH * .7);
    v += 13 * Math.sin(lon * D * 3 - lat * .07 + .7 + PH * .8) + 9 * Math.cos(lon * D * 6 + lat * .13 - PH * .5);
    const jet = Math.exp(-Math.pow((Math.abs(lat) - 47) / 8, 2)); u += jet * 28 * (1 + .5 * Math.sin(lon * D * 2));
    for (const o of VORT) {
      const dx = wdx(lon, o, lat), dy = lat - o.lat, d = Math.hypot(dx, dy) + 1e-6;
      if (d > o.r * 6) continue;
      const q = d / o.r, f = o.s * q * Math.exp((1 - q * q) / 2);
      u += -dy / d * f * o.d; v += dx / d * f * o.d;
    }
    return [u, v];
  };
  const temp = (lo, la) => 45 * Math.pow(Math.max(0, Math.cos(la * D)), 1.2) - 18 + 4 * Math.sin(lo * D * 3 + la * .08 + PH * .5) + 3 * Math.cos(lo * D * 7 + .4) - (la < -62 ? 14 : 0) - 1.5 * (1 + Math.tanh(la / 5));
  const rain = (lo, la) => {
    let r = Math.exp(-Math.pow((la - 7) / 5, 2)) * 5 * Math.max(0, Math.sin(lo * D * 11 + la * .4 - PH * .6) + .8 * Math.sin(lo * D * 4 + 1.7) + .2 * Math.sin(lo * D * 30));
    r += Math.exp(-Math.pow((Math.abs(la) - 48 - 6 * Math.sin(lo * D * 2)) / 4, 2)) * 4 * Math.max(0, Math.sin(lo * D * 5 + la * .2 + .5 + PH) + .25);
    for (const o of VORT) {
      const dx = wdx(lo, o, la), dy = la - o.lat, d = Math.hypot(dx, dy) / o.r;
      if (d > 6) continue;
      r += (o.s / 150) * 42 * Math.exp(-d * d / 3) * (.55 + .45 * Math.sin(3 * Math.atan2(dy, dx) * o.d + d * 2.2));
    }
    return r;
  };
  const aq = (lo, la) => {
    let v = 6 + 3 * Math.sin(lo * D * 11 + la * .3);
    for (const [x, y, s, a] of HOT) { let dx = lo - x; dx = ((dx + 540) % 360) - 180; v += a * Math.exp(-(dx * dx + (la - y) * (la - y)) / (s * s)); }
    return Math.max(0, v);
  };
  const cloud = (lo, la, r = rain(lo, la)) => {
    let c = 40 + 30 * Math.sin(lo * D * 4 + la * .12 + PH) + 18 * Math.sin(lo * D * 9 - la * .09 + 1) + 7 * Math.sin(lo * D * 19 + la * .3);
    c += 35 * Math.exp(-Math.pow((la - 7) / 6, 2)) - 34 * Math.exp(-Math.pow((Math.abs(la) - 24) / 7, 2));
    c += Math.min(60, r * 10);
    return Math.max(0, Math.min(100, c));
  };
  const pres = (lo, la) => {
    const a = Math.abs(la);
    let p = 1012 + 11 * Math.exp(-Math.pow((a - 32) / 9, 2)) - 11 * Math.exp(-Math.pow((a - 62) / 9, 2)) + 6 * Math.sin(lo * D * 3 + la * .06 + PH) + 3 * Math.cos(lo * D * 6);
    for (const o of VORT) { const dx = wdx(lo, o, la), dy = la - o.lat, d = Math.hypot(dx, dy) / (o.r * 1.8); if (d < 5) p -= o.p * Math.exp(-d * d); }
    return p;
  };
  return { wind, temp, rain, aq, cloud, pres };
}

// ---- Gridded frames (what the renderer consumes) ---------------------------
const cache = new Map();

export function frame(t) {
  if (cache.has(t)) return cache.get(t);
  const m = model(t), n = NX * NY;
  const u = new Float32Array(n), v = new Float32Array(n);
  const fields = { wind: new Float32Array(n), temp: new Float32Array(n), rain: new Float32Array(n), aq: new Float32Array(n), cloud: new Float32Array(n), pres: new Float32Array(n) };
  for (let j = 0; j < NY; j++) {
    const lat = 90 - j * SAMPLE_GRID_DEG;
    for (let i = 0; i < NX; i++) {
      const lon = -180 + i * SAMPLE_GRID_DEG, k = j * NX + i;
      const [uu, vv] = m.wind(lon, lat), r = m.rain(lon, lat);
      u[k] = uu; v[k] = vv;
      fields.wind[k] = Math.hypot(uu, vv);
      fields.temp[k] = m.temp(lon, lat);
      fields.rain[k] = r;
      fields.aq[k] = m.aq(lon, lat);
      fields.cloud[k] = m.cloud(lon, lat, r);
      fields.pres[k] = m.pres(lon, lat);
    }
  }
  // Same shape as live frames (see data-core.js): wind u/v in m/s, speed in km/h.
  const grid = { nx: NX, ny: NY, deg: SAMPLE_GRID_DEG, lon0: -180, lat0: 90 };
  const ms = a => a.map(x => x / 3.6);
  const fr = { t, f: t, grids: { wind: { grid, u: ms(u), v: ms(v), data: fields.wind } } };
  for (const k of ['temp', 'rain', 'aq', 'cloud', 'pres']) fr.grids[k] = { grid, data: fields[k] };
  cache.set(t, fr);
  if (cache.size > 8) cache.delete(cache.keys().next().value);
  return fr;
}

// Values at one point for every hour (detail panel charts). Sample only.
export function pointSeries(lon, lat, key) {
  const out = [];
  for (let t = 0; t <= HOURS; t++) {
    const m = model(t);
    out.push(key === 'wind' ? Math.hypot(...m.wind(lon, lat)) : m[key](lon, lat));
  }
  return out;
}
