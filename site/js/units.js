// Display units and distances. Data stays metric everywhere (°C, km/h, km); only what people
// read is converted. No DOM: also imported by scripts/data/unit-tests.mjs.

const MI = 1.609344, NM = 1.852;
export const UNITS = {
  temp: { C: ['°C', c => c], F: ['°F', c => c * 9 / 5 + 32] },
  speed: { kmh: ['km/h', k => k], mph: ['mph', k => k / MI], ms: ['m/s', k => k / 3.6], kn: ['kn', k => k / NM] },
  dist: { km: ['km', k => k], mi: ['mi', k => k / MI] }
};
export const PRESETS = { metric: { temp: 'C', speed: 'kmh', dist: 'km' }, us: { temp: 'F', speed: 'mph', dist: 'mi' } };
// First visit: US units for an en-US browser, metric everywhere else.
export const defaultPreset = lang => /^en-US$/i.test(lang || '') ? 'us' : 'metric';
export const presetOf = u => Object.keys(PRESETS).find(p => ['temp', 'speed', 'dist'].every(k => PRESETS[p][k] === u[k])) || 'custom';

let cur = { ...PRESETS.metric };
export const setUnits = u => { for (const k in UNITS) if (UNITS[k][u[k]]) cur[k] = u[k]; };
export const units = () => ({ ...cur });
export const conv = (kind, v) => UNITS[kind][cur[kind]][1](v);
export const label = kind => UNITS[kind][cur[kind]][0];

// "5,570 km", "3,461 mi"; short distances in m / ft.
export function fmtDist(km) {
  if (cur.dist === 'mi') {
    const mi = km / MI;
    return mi < 0.1 ? `${Math.round(mi * 5280)} ft` : `${mi < 10 ? mi.toFixed(2) : Math.round(mi).toLocaleString('en-US')} mi`;
  }
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(2) : Math.round(km).toLocaleString('en-US')} km`;
}

// Scale bar: the longest round distance (1, 2, 5 x 10^n in the display unit) that fits in maxPx,
// given metres per pixel. Returns [label, px].
export function scaleBar(mpp, maxPx = 100) {
  const mi = cur.dist === 'mi', small = mi ? 0.3048 : 1, big = mi ? MI * 1000 : 1000;
  const fit = (unit, name) => {
    const max = mpp * maxPx / unit, pow = Math.pow(10, Math.floor(Math.log10(max))), d = max / pow;
    const n = (d >= 5 ? 5 : d >= 2 ? 2 : 1) * pow;
    return [`${n.toLocaleString('en-US')} ${name}`, n * unit / mpp];
  };
  return mpp * maxPx >= big ? fit(big, mi ? 'mi' : 'km') : fit(small, mi ? 'ft' : 'm');
}

// Great-circle distance in km between [lon, lat] points (haversine, mean Earth radius 6,371.0088 km).
const R = 6371.0088, rad = d => d * Math.PI / 180;
export function haversineKm([lo1, la1], [lo2, la2]) {
  const a = Math.sin(rad(la2 - la1) / 2) ** 2 + Math.cos(rad(la1)) * Math.cos(rad(la2)) * Math.sin(rad(lo2 - lo1) / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Points along the great circle from a to b (for drawing the curved leg on the Mercator map).
// Longitudes are kept continuous (may pass ±180) so MapLibre draws the short way round.
export function greatCircle(a, b, n = 64) {
  const [l1, p1, l2, p2] = [a[0], a[1], b[0], b[1]].map(rad), d = haversineKm(a, b) / R;
  if (d < 1e-9) return [a, b];
  const out = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n, A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(p1) * Math.cos(l1) + B * Math.cos(p2) * Math.cos(l2);
    const y = A * Math.cos(p1) * Math.sin(l1) + B * Math.cos(p2) * Math.sin(l2);
    const z = A * Math.sin(p1) + B * Math.sin(p2);
    let lon = Math.atan2(y, x) * 180 / Math.PI;
    if (out.length) { const prev = out[out.length - 1][0]; lon += Math.round((prev - lon) / 360) * 360; }
    else lon += Math.round((a[0] - lon) / 360) * 360;
    out.push([lon, Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI]);
  }
  return out;
}
