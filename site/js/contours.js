// Isobars (marching squares) and H/L centres for the pressure field. Runs in the worker.

const STRIDE_DEG = 1; // contour on a 1 deg subset: pressure is smooth and the GeoJSON stays small

function subset(grid, data) {
  const s = Math.max(1, Math.round(STRIDE_DEG / grid.deg));
  const nx = Math.floor(grid.nx / s), ny = Math.floor((grid.ny - 1) / s) + 1, out = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) out[j * nx + i] = data[j * s * grid.nx + i * s];
  return { g: { nx, ny, deg: grid.deg * s, lon0: grid.lon0, lat0: grid.lat0 }, a: out };
}

export function isobars(grid, data, interval, majorEvery) {
  const { g, a } = subset(grid, data), { nx, ny, deg } = g, feats = [];
  let lo = Infinity, hi = -Infinity;
  for (const v of a) { if (v < lo) lo = v; if (v > hi) hi = v; }
  for (let L = Math.ceil(lo / interval) * interval; L <= hi; L += interval) {
    const segs = [];
    for (let j = 0; j < ny - 1; j++) {
      const y0 = g.lat0 - j * deg;
      if (Math.abs(y0) > 84) continue;
      for (let i = 0; i < nx; i++) {
        const i1 = (i + 1) % nx;
        const v0 = a[j * nx + i], v1 = a[j * nx + i1], v2 = a[(j + 1) * nx + i1], v3 = a[(j + 1) * nx + i];
        const c = (v0 > L) | (v1 > L) << 1 | (v2 > L) << 2 | (v3 > L) << 3;
        if (c === 0 || c === 15) continue;
        const x0 = g.lon0 + i * deg, x1 = x0 + deg, y1 = y0 - deg;
        const t = (p, q) => (L - p) / (q - p);
        const top = [x0 + t(v0, v1) * deg, y0], right = [x1, y0 - t(v1, v2) * deg];
        const bottom = [x0 + t(v3, v2) * deg, y1], left = [x0, y0 - t(v0, v3) * deg];
        switch (c) {
          case 1: case 14: segs.push([left, top]); break;
          case 2: case 13: segs.push([top, right]); break;
          case 3: case 12: segs.push([left, right]); break;
          case 4: case 11: segs.push([right, bottom]); break;
          case 6: case 9: segs.push([top, bottom]); break;
          case 7: case 8: segs.push([left, bottom]); break;
          case 5: segs.push([left, top], [right, bottom]); break;
          case 10: segs.push([top, right], [left, bottom]); break;
        }
      }
    }
    if (segs.length) feats.push({ type: 'Feature', properties: { major: L % majorEvery === 0, level: L }, geometry: { type: 'MultiLineString', coordinates: segs } });
  }
  return { type: 'FeatureCollection', features: feats };
}

// H / L centres: extrema within +/-9 deg, away from the poles, one plate per centre.
export function centres(grid, data) {
  const { g, a } = subset(grid, data), { nx, ny, deg } = g, R = Math.round(9 / deg), out = [];
  for (let j = Math.max(1, R); j < ny - Math.max(1, R); j++) {
    const lat = g.lat0 - j * deg;
    if (Math.abs(lat) > 70) continue;
    for (let i = 0; i < nx; i++) {
      const v = a[j * nx + i], isL = v < 1004, isH = v > 1022;
      if (!isL && !isH) continue;
      const at = (di, dj) => a[(j + dj) * nx + ((i + di + nx) % nx)];
      // cheap 3x3 test first, then the full window
      if (isL ? (at(-1, 0) < v || at(1, 0) < v || at(0, -1) < v || at(0, 1) < v) : (at(-1, 0) > v || at(1, 0) > v || at(0, -1) > v || at(0, 1) > v)) continue;
      let ok = true;
      for (let dj = -R; dj <= R && ok; dj++) for (let di = -R; di <= R; di++) {
        const w = at(di, dj);
        if (isL ? w < v : w > v) { ok = false; break; }
      }
      const lon = g.lon0 + i * deg;
      if (ok && !out.some(c => c.type === (isL ? 'L' : 'H') && Math.abs(c.lat - lat) < 12 && Math.abs(((c.lon - lon + 540) % 360) - 180) < 12)) {
        out.push({ type: isL ? 'L' : 'H', lon: lon > 180 ? lon - 360 : lon, lat, value: v });
      }
    }
  }
  return out;
}
