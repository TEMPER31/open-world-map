// Weather field layer: shows the coloured field (a MapLibre canvas source with linear
// resampling = smooth field) plus isobars and H/L labels for pressure. The pixels are
// produced off the main thread by frames.js and copied in here.

import { FIELDS } from './scales.js';
import { sample } from './sample-data.js';
import { FIELD_BEFORE } from './basemaps.js';
import { MAX_LAT, IMG } from './colorize.js';

const CORNERS = [[-180, MAX_LAT], [180, MAX_LAT], [180, -MAX_LAT], [-180, -MAX_LAT]];
const EMPTY = { type: 'FeatureCollection', features: [] };

export class FieldLayer {
  constructor(map) {
    this.map = map;
    this.canvas = Object.assign(document.createElement('canvas'), { width: IMG, height: IMG });
    this.ctx = this.canvas.getContext('2d');
    this.markers = [];
    this.key = '';
  }

  // Add sources/layers once the style has loaded.
  add(px) {
    this.ctx.putImageData(new ImageData(px, IMG, IMG), 0, 0);
    this.map.addSource('field', { type: 'canvas', canvas: this.canvas, animate: false, coordinates: CORNERS });
    this.map.addLayer({ id: 'field', type: 'raster', source: 'field', paint: { 'raster-resampling': 'linear', 'raster-fade-duration': 0 } }, FIELD_BEFORE);
    this.map.addSource('isobars', { type: 'geojson', data: EMPTY });
    this.map.addLayer({ id: 'isobars', type: 'line', source: 'isobars', paint: { 'line-width': ['case', ['get', 'major'], 1.4, 0.7] } }, 'omt-road-minor');
  }

  setPixels(px) {
    this.ctx.putImageData(new ImageData(px, IMG, IMG), 0, 0);
    const src = this.map.getSource('field');
    src.play(); src.pause(); // a static canvas source re-uploads its texture on pause()
    this.map.triggerRepaint();
  }

  // opacity: user setting x basemap factor; the field also fades a little at street zooms.
  setOpacity(o) {
    this.map.setPaintProperty('field', 'raster-opacity', ['interpolate', ['linear'], ['zoom'], 5, o, 10, o * 0.55]);
  }

  // Isobars + H/L plates (pressure only).
  setOverlays(fr, field, light) {
    const key = `${fr.t}|${field}|${light}`;
    if (key === this.key) return;
    this.key = key;
    const pres = field === 'pres';
    this.map.getSource('isobars').setData(pres ? isobars(fr, FIELDS.pres.interval, FIELDS.pres.majorEvery) : EMPTY);
    const ink = light ? '21,23,26' : '255,255,255';
    this.map.setPaintProperty('isobars', 'line-color', ['case', ['get', 'major'], `rgba(${ink},.75)`, `rgba(${ink},${light ? .4 : .45})`]);
    this.markers.forEach(m => m.remove());
    this.markers = pres ? centres(fr).map(c => {
      const el = document.createElement('div');
      el.className = `hl-plate ${c.type}${light ? ' light' : ''}`;
      el.innerHTML = `<b>${c.type}</b><span>${Math.round(c.value)}</span>`;
      el.setAttribute('aria-label', `${c.type === 'H' ? 'High' : 'Low'} pressure ${Math.round(c.value)} hPa`);
      return new maplibregl.Marker({ element: el }).setLngLat([c.lon, c.lat]).addTo(this.map);
    }) : [];
  }
}

// Marching squares over the pressure grid -> one MultiLineString per level.
function isobars(fr, interval, majorEvery) {
  const { nx, ny, deg } = fr, a = fr.fields.pres, feats = [];
  let lo = Infinity, hi = -Infinity;
  for (const v of a) { if (v < lo) lo = v; if (v > hi) hi = v; }
  for (let L = Math.ceil(lo / interval) * interval; L <= hi; L += interval) {
    const segs = [];
    for (let j = 0; j < ny - 1; j++) {
      const lat0 = 90 - j * deg;
      if (Math.abs(lat0) > 84) continue;
      for (let i = 0; i < nx; i++) {
        const i1 = (i + 1) % nx;
        const v0 = a[j * nx + i], v1 = a[j * nx + i1], v2 = a[(j + 1) * nx + i1], v3 = a[(j + 1) * nx + i];
        const c = (v0 > L) | (v1 > L) << 1 | (v2 > L) << 2 | (v3 > L) << 3;
        if (c === 0 || c === 15) continue;
        const x0 = -180 + i * deg, x1 = x0 + deg, y0 = lat0, y1 = lat0 - deg;
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

// H / L centres: grid extrema within a +/-R cell window, away from the poles.
function centres(fr) {
  const { nx, ny, deg } = fr, a = fr.fields.pres, R = Math.round(9 / deg), out = [];
  for (let j = R; j < ny - R; j++) {
    const lat = 90 - j * deg;
    if (Math.abs(lat) > 70) continue;
    for (let i = 0; i < nx; i++) {
      const v = a[j * nx + i];
      const isL = v < 1004, isH = v > 1022;
      if (!isL && !isH) continue;
      let ok = true;
      for (let dj = -R; dj <= R && ok; dj++) for (let di = -R; di <= R; di++) {
        if (!di && !dj) continue;
        const w = a[(j + dj) * nx + ((i + di + nx) % nx)];
        if (isL ? w < v : w > v) { ok = false; break; }
      }
      const lon = -180 + i * deg;
      // flat extrema repeat across neighbouring cells: keep one plate per centre
      if (ok && !out.some(c => c.type === (isL ? 'L' : 'H') && Math.abs(c.lat - lat) < 12 && Math.abs(((c.lon - lon + 540) % 360) - 180) < 12)) {
        out.push({ type: isL ? 'L' : 'H', lon, lat, value: v });
      }
    }
  }
  return out;
}

// Helpers for the probe / detail panel.
export function valueAt(fr, field, lon, lat) {
  return sample(fr, fr.fields[field], lon, lat);
}
export function windAt(fr, lon, lat) {
  return [sample(fr, fr.u, lon, lat), sample(fr, fr.v, lon, lat)];
}
