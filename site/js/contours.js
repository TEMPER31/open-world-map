// H/L centres for the pressure field (isobars are drawn by the field shader). Runs in the worker.

const STRIDE_DEG = 1; // search a 1 deg subset: pressure is smooth at that scale

function subset(grid, data) {
  const s = Math.max(1, Math.round(STRIDE_DEG / grid.deg));
  const nx = Math.floor(grid.nx / s), ny = Math.floor((grid.ny - 1) / s) + 1, out = new Float32Array(nx * ny);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) out[j * nx + i] = data[j * s * grid.nx + i * s];
  return { g: { nx, ny, deg: grid.deg * s, lon0: grid.lon0, lat0: grid.lat0 }, a: out };
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
