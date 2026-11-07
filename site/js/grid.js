// Grid helpers shared by the page, the worker and the GPU layers.
// A grid is {nx, ny, deg, lon0, lat0}: row 0 is lat0 (north), column 0 is lon0, and every
// grid spans 360 deg of longitude (columns wrap).

// Bilinear sample at lon/lat (lon wraps, lat clamps). NaN where there is no data.
export function sample(grid, data, lon, lat) {
  const x = ((((lon - grid.lon0) / grid.deg) % grid.nx) + grid.nx) % grid.nx;
  const y = Math.max(0, Math.min(grid.ny - 1, (grid.lat0 - lat) / grid.deg));
  const i0 = Math.floor(x), j0 = Math.floor(y), i1 = (i0 + 1) % grid.nx, j1 = Math.min(grid.ny - 1, j0 + 1);
  const fx = x - i0, fy = y - j0, nx = grid.nx;
  const a = data[j0 * nx + i0], b = data[j0 * nx + i1], c = data[j1 * nx + i0], d = data[j1 * nx + i1];
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
}

// The current view as linear ranges in longitude and Mercator y, computed from the centre and
// zoom (not map.getBounds(), which clamps at +/-85 deg when the view extends past the world).
// Valid because the map never rotates or pitches. Returns [west lon, lon span, north y, y span]
// with y = ln(tan(pi/4 + lat/2)) in radians.
export function viewRect(map) {
  const c = map.getCenter(), ws = 512 * Math.pow(2, map.getZoom());
  const el = map.getCanvas(), w = el.clientWidth, h = el.clientHeight;
  const lonSpan = w / ws * 360, ySpan = h / ws * 2 * Math.PI;
  const yc = Math.log(Math.tan(Math.PI / 4 + c.lat * Math.PI / 360));
  return [c.lng - lonSpan / 2, lonSpan, yc + ySpan / 2, ySpan];
}

// Replace NaN cells by the mean of their valid neighbours, growing inwards until filled
// (so a missing CAMS point never punches a hole into the interpolated field).
export function fillNaN(grid, data) {
  const { nx, ny } = grid, out = Float32Array.from(data);
  for (let pass = 0; pass < 8; pass++) {
    let left = 0;
    const src = Float32Array.from(out);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i;
      if (src[k] === src[k]) continue;
      let s = 0, n = 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const jj = j + dj;
        if (jj < 0 || jj >= ny) continue;
        const v = src[jj * nx + (i + di + nx) % nx];
        if (v === v) { s += v; n++; }
      }
      if (n) out[k] = s / n; else left++;
    }
    if (!left) break;
  }
  return out;
}

// Catmull-Rom upsampling by an integer factor (passes through the original nodes).
export function upsample(grid, data, factor) {
  const nx = grid.nx * factor, ny = (grid.ny - 1) * factor + 1, out = new Float32Array(nx * ny);
  const cr = (p0, p1, p2, p3, t) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  const at = (i, j) => data[Math.max(0, Math.min(grid.ny - 1, j)) * grid.nx + ((i % grid.nx) + grid.nx) % grid.nx];
  const rowTmp = new Float32Array(grid.ny * nx);
  for (let j = 0; j < grid.ny; j++) for (let x = 0; x < nx; x++) {     // along longitude
    const i = Math.floor(x / factor), t = x / factor - i;
    rowTmp[j * nx + x] = cr(at(i - 1, j), at(i, j), at(i + 1, j), at(i + 2, j), t);
  }
  const col = (x, j) => rowTmp[Math.max(0, Math.min(grid.ny - 1, j)) * nx + x];
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {          // along latitude
    const j = Math.floor(y / factor), t = y / factor - j;
    out[y * nx + x] = cr(col(x, j - 1), col(x, j), col(x, j + 1), col(x, j + 2), t);
  }
  return { grid: { nx, ny, deg: grid.deg / factor, lon0: grid.lon0, lat0: grid.lat0 }, data: out };
}
