// Distance tool: click or tap points; each leg and the total are great-circle (straight-line on
// the globe) distances, drawn as curves in a MapLibre GeoJSON layer. While it is on, map clicks
// add points instead of opening the place panel. Undo, Clear, Esc (or Done) to exit. The km/mi
// buttons set the page-wide distance unit (handled in main.js).

import * as S from './state.js';
import { haversineKm, greatCircle, fmtDist } from './units.js';

const EMPTY = { type: 'FeatureCollection', features: [] };
let pts = [];

export function initMeasure(map) {
  const panel = document.getElementById('measure');
  map.addSource('measure', { type: 'geojson', data: EMPTY });
  map.addLayer({ id: 'measure-line', type: 'line', source: 'measure', filter: ['==', ['geometry-type'], 'LineString'],
    paint: { 'line-color': '#dcb672', 'line-width': 2.5 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
  map.addLayer({ id: 'measure-pt', type: 'circle', source: 'measure', filter: ['==', ['get', 'k'], 'pt'],
    paint: { 'circle-radius': 5, 'circle-color': '#dcb672', 'circle-stroke-color': '#07090c', 'circle-stroke-width': 2 } });
  map.addLayer({ id: 'measure-lab', type: 'symbol', source: 'measure', filter: ['==', ['get', 'k'], 'leg'],
    layout: { 'text-field': ['get', 'd'], 'text-font': ['Noto Sans Bold'], 'text-size': 12, 'text-offset': [0, -1], 'text-allow-overlap': true, 'text-ignore-placement': true },
    paint: { 'text-color': '#ede8dd', 'text-halo-color': '#07090c', 'text-halo-width': 1.6 } });

  const legs = () => pts.slice(1).map((p, i) => haversineKm(pts[i], p));
  function draw() {
    const L = legs(), total = L.reduce((a, b) => a + b, 0), f = [];
    pts.forEach((p, i) => {
      f.push({ type: 'Feature', properties: { k: 'pt' }, geometry: { type: 'Point', coordinates: p } });
      if (!i) return;
      const line = greatCircle(pts[i - 1], p);
      f.push({ type: 'Feature', properties: { k: 'line' }, geometry: { type: 'LineString', coordinates: line } });
      f.push({ type: 'Feature', properties: { k: 'leg', d: fmtDist(L[i - 1]) }, geometry: { type: 'Point', coordinates: line[line.length >> 1] } });
    });
    map.getSource('measure').setData({ type: 'FeatureCollection', features: f });
    panel.querySelector('[data-mtotal]').textContent = pts.length > 1 ? fmtDist(total) : '—';
    panel.querySelector('[data-mtotal]').dataset.km = total.toFixed(3);
    panel.querySelector('[data-mhint]').textContent = pts.length ? `${pts.length} point${pts.length > 1 ? 's' : ''} · ${L.length} leg${L.length === 1 ? '' : 's'}` : 'Click the map to add points';
    panel.querySelector('[data-mlegs]').innerHTML = L.map((d, i) => `<li><span>Leg ${i + 1}</span><b>${fmtDist(d)}</b></li>`).join('');
    panel.querySelectorAll('[data-mundo], [data-mclear]').forEach(b => b.disabled = !pts.length);
    panel.querySelectorAll('[data-dunit]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.dunit === S.get('distUnit'))));
  }
  const add = p => { pts.push(p); draw(); };

  panel.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if ('mundo' in b.dataset) { pts.pop(); draw(); }
    else if ('mclear' in b.dataset) { pts = []; draw(); }
    else if ('mdone' in b.dataset) S.set({ measuring: false });
  });
  map.on('click', e => { if (S.get('measuring')) add([e.lngLat.lng, e.lngLat.lat]); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.get('measuring')) { e.stopImmediatePropagation(); S.set({ measuring: false }); } }, true);
  S.on(['measuring'], s => {
    panel.hidden = !s.measuring;
    map.getCanvas().style.cursor = s.measuring ? 'crosshair' : '';
    document.querySelectorAll('[data-measure]').forEach(b => b.setAttribute('aria-pressed', String(s.measuring)));
    if (!s.measuring) pts = [];
    draw();
  });
  S.on(['distUnit'], draw, { now: false });
  return { add, totalKm: () => legs().reduce((a, b) => a + b, 0) };
}
