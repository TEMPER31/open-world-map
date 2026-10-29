// Weather field layer: shows the coloured field (a MapLibre canvas source with linear
// resampling = smooth field) plus isobars and H/L labels for pressure. Pixels and
// contours are produced off the main thread (data.js) and handed in here.

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

  // Isobars + H/L plates (pressure only). ov = {geojson, centres} from the worker, or null.
  setOverlays(ov, light) {
    this.map.getSource('isobars').setData(ov ? ov.geojson : EMPTY);
    const ink = light ? '21,23,26' : '255,255,255';
    this.map.setPaintProperty('isobars', 'line-color', ['case', ['get', 'major'], `rgba(${ink},.75)`, `rgba(${ink},${light ? .4 : .45})`]);
    this.markers.forEach(m => m.remove());
    this.markers = ov ? ov.centres.map(c => {
      const el = document.createElement('div');
      el.className = `hl-plate ${c.type}${light ? ' light' : ''}`;
      el.innerHTML = `<b>${c.type}</b><span>${Math.round(c.value)}</span>`;
      el.setAttribute('aria-label', `${c.type === 'H' ? 'High' : 'Low'} pressure ${Math.round(c.value)} hPa`);
      return new maplibregl.Marker({ element: el }).setLngLat([c.lon, c.lat]).addTo(this.map);
    }) : [];
  }
}
