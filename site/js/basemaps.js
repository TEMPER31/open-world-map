// Basemaps: Dark, Light (one keyless vector source, two palettes) and Satellite
// (raster stack, added on demand: Esri World Imagery when configured, else keyless sources).
// The UI stays dark for all three.

import { OPENFREEMAP, SATELLITE, ESRI } from './config.js';

const NAME = ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
const FONT = ['Noto Sans Regular'], FONT_B = ['Noto Sans Bold'];
const z = (...stops) => ['interpolate', ['linear'], ['zoom'], ...stops];
const cls = (...v) => ['match', ['get', 'class'], v, true, false];

// Palettes: layer id -> paint values. Satellite hides the vector fills (imagery shows).
const PALETTE = {
  dark: {
    land: '#1c2229', water: '#0c1015', park: '#1d2722', landuse: '#1f252c', building: '#262d36',
    tint: 'rgba(4,6,9,.28)', coast: 'rgba(255,255,255,.5)', borders: 'rgba(255,255,255,.16)', waterTint: 'rgba(7,9,12,.42)',
    roadMinor: 'rgba(237,232,221,.13)', roadMajor: 'rgba(237,232,221,.24)', motorway: 'rgba(220,182,114,.42)',
    bCountry: 'rgba(255,255,255,.34)', bState: 'rgba(255,255,255,.16)',
    label: '#ede8dd', labelMute: '#a09d95', halo: 'rgba(7,9,12,.85)'
  },
  light: {
    land: '#cfc8b9', water: '#e2ded3', park: '#c4c5ab', landuse: '#c9c2b2', building: '#bdb5a4',
    tint: 'rgba(255,255,255,.2)', coast: 'rgba(21,23,26,.6)', borders: 'rgba(21,23,26,.22)', waterTint: 'rgba(247,245,239,.35)',
    roadMinor: 'rgba(21,23,26,.16)', roadMajor: 'rgba(21,23,26,.3)', motorway: 'rgba(210,63,28,.45)',
    bCountry: 'rgba(21,23,26,.5)', bState: 'rgba(21,23,26,.25)',
    label: '#15171a', labelMute: '#55585d', halo: 'rgba(247,245,239,.9)'
  },
  satellite: {
    land: '#05070a', water: '#05070a', park: null, landuse: null, building: null,
    tint: null, coast: 'rgba(255,255,255,.55)', borders: 'rgba(255,255,255,.3)', waterTint: null,
    roadMinor: 'rgba(255,255,255,.18)', roadMajor: 'rgba(255,255,255,.32)', motorway: 'rgba(255,214,150,.55)',
    bCountry: 'rgba(255,255,255,.55)', bState: 'rgba(255,255,255,.28)',
    label: '#ffffff', labelMute: '#e6e2d8', halo: 'rgba(0,0,0,.85)'
  }
};

// [layer id, paint property, palette key]. A null palette value hides the layer.
const BINDINGS = [
  ['background', 'background-color', 'land'],
  ['omt-water', 'fill-color', 'water'],
  ['omt-park', 'fill-color', 'park'],
  ['omt-landuse', 'fill-color', 'landuse'],
  ['omt-waterway', 'line-color', 'water'],
  ['omt-building', 'fill-color', 'building'],
  ['ne-tint', 'fill-color', 'tint'],
  ['ne-coast', 'line-color', 'coast'],
  ['ne-borders', 'line-color', 'borders'],
  ['omt-water-tint', 'fill-color', 'waterTint'],
  ['omt-road-minor', 'line-color', 'roadMinor'],
  ['omt-road-major', 'line-color', 'roadMajor'],
  ['omt-road-motorway', 'line-color', 'motorway'],
  ['omt-boundary-state', 'line-color', 'bState'],
  ['omt-boundary-country', 'line-color', 'bCountry'],
  ['omt-label-road', 'text-color', 'labelMute'],
  ['omt-label-road', 'text-halo-color', 'halo'],
  ['omt-label-place', 'text-color', 'label'],
  ['omt-label-place', 'text-halo-color', 'halo'],
  ['omt-label-country', 'text-color', 'labelMute'],
  ['omt-label-country', 'text-halo-color', 'halo']
];

// The field raster and isobars are inserted by FieldLayer before this layer.
export const FIELD_BEFORE = 'ne-tint';
const SAT_BEFORE = 'field';

export function buildStyle(variant) {
  const p = PALETTE[variant] || PALETTE.dark;
  const v = k => p[k] || 'rgba(0,0,0,0)';
  const label = (id, filter, minzoom, maxzoom, size, extra = {}) => ({
    id, type: 'symbol', source: 'omt', 'source-layer': 'place', filter, minzoom, maxzoom,
    layout: { 'text-field': NAME, 'text-font': FONT, 'text-size': size, 'text-max-width': 8, ...extra },
    paint: { 'text-color': v('label'), 'text-halo-color': v('halo'), 'text-halo-width': 1.2 }
  });
  return {
    version: 8,
    glyphs: OPENFREEMAP.glyphs,
    sources: {
      omt: { type: 'vector', url: OPENFREEMAP.tilejson },
      'ne-land': { type: 'geojson', data: 'data/ne-110m-land.geojson', maxzoom: 6 },
      'ne-coast': { type: 'geojson', data: 'data/ne-110m-coast.geojson', maxzoom: 6 },
      'ne-borders': { type: 'geojson', data: 'data/ne-110m-borders.geojson', maxzoom: 6 }
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': v('land') } },
      { id: 'omt-water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': v('water') } },
      { id: 'omt-park', type: 'fill', source: 'omt', 'source-layer': 'park', minzoom: 8, paint: { 'fill-color': v('park') } },
      { id: 'omt-landuse', type: 'fill', source: 'omt', 'source-layer': 'landuse', minzoom: 10, filter: cls('residential', 'commercial', 'industrial'), paint: { 'fill-color': v('landuse') } },
      { id: 'omt-waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', minzoom: 9, paint: { 'line-color': v('water'), 'line-width': z(9, 0.6, 15, 2) } },
      { id: 'omt-building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 14, paint: { 'fill-color': v('building') } },
      // (satellite rasters, then the weather field + isobars, are inserted here)
      { id: 'ne-tint', type: 'fill', source: 'ne-land', paint: { 'fill-color': v('tint'), 'fill-opacity': z(4, 1, 6.5, 0) } },
      { id: 'ne-coast', type: 'line', source: 'ne-coast', paint: { 'line-color': v('coast'), 'line-width': 0.7, 'line-opacity': z(5, 1, 7, 0) } },
      { id: 'ne-borders', type: 'line', source: 'ne-borders', paint: { 'line-color': v('borders'), 'line-width': 0.5, 'line-opacity': z(4, 1, 5.5, 0) } },
      { id: 'omt-water-tint', type: 'fill', source: 'omt', 'source-layer': 'water', minzoom: 5, paint: { 'fill-color': v('waterTint'), 'fill-opacity': z(5, 0, 7, 1) } },
      { id: 'omt-road-minor', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 12, filter: cls('minor', 'service'), paint: { 'line-color': v('roadMinor'), 'line-width': z(12, 0.5, 16, 2.5) } },
      { id: 'omt-road-major', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 7, filter: cls('primary', 'secondary', 'tertiary'), paint: { 'line-color': v('roadMajor'), 'line-width': z(7, 0.4, 16, 4) } },
      { id: 'omt-road-motorway', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 5, filter: cls('motorway', 'trunk'), paint: { 'line-color': v('motorway'), 'line-width': z(5, 0.5, 16, 5) } },
      { id: 'omt-boundary-state', type: 'line', source: 'omt', 'source-layer': 'boundary', minzoom: 4, filter: ['all', ['==', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]], paint: { 'line-color': v('bState'), 'line-width': 0.6, 'line-dasharray': [3, 2] } },
      { id: 'omt-boundary-country', type: 'line', source: 'omt', 'source-layer': 'boundary', minzoom: 4, filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]], paint: { 'line-color': v('bCountry'), 'line-width': z(4, 0.6, 10, 1.4), 'line-opacity': z(4, 0, 5.5, 1) } },
      { id: 'omt-label-road', type: 'symbol', source: 'omt', 'source-layer': 'transportation_name', minzoom: 13, layout: { 'symbol-placement': 'line', 'text-field': NAME, 'text-font': FONT, 'text-size': 10 }, paint: { 'text-color': v('labelMute'), 'text-halo-color': v('halo'), 'text-halo-width': 1 } },
      label('omt-label-place', ['match', ['get', 'class'], ['city', 'town', 'village'], true, false], 4, 24,
        z(4, ['match', ['get', 'class'], 'city', 10.5, 9], 10, ['match', ['get', 'class'], 'city', 15, 'town', 12.5, 11]),
        { 'text-letter-spacing': 0.04 }),
      {
        ...label('omt-label-country', ['==', ['get', 'class'], 'country'], 2, 7, z(2, 10, 6, 13),
          { 'text-transform': 'uppercase', 'text-letter-spacing': 0.12, 'text-font': FONT_B }),
        paint: { 'text-color': v('labelMute'), 'text-halo-color': v('halo'), 'text-halo-width': 1.2 }
      }
    ]
  };
}

// Switch palettes in place (no style reload) and add/remove the satellite stack. changed() is
// called when the stack changes later on its own (Esri ready, or Esri dropped for the fallback).
export function applyBasemap(map, variant, changed = () => {}) {
  const p = PALETTE[variant];
  for (const [id, prop, key] of BINDINGS) {
    if (!map.getLayer(id)) continue;
    map.setLayoutProperty(id, 'visibility', p[key] ? 'visible' : 'none');
    if (p[key]) map.setPaintProperty(id, prop, p[key]);
  }
  onStack = changed;
  if (variant === 'satellite') addSatellite(map); else removeSatellite(map);
}

// ---- Satellite stack -------------------------------------------------------------------------
// NASA GIBS at world zoom, then Esri World Imagery when a key is configured and Esri answers;
// otherwise (or once Esri fails) EOX and USGS as before. Nothing is fetched until Satellite is
// chosen, and nothing from Esri while Dark or Light is shown.
const GIBS = SATELLITE[0], FALLBACK = SATELLITE.slice(1);
let stack = [], onStack = () => {}, gen = 0;
let esri = null;        // promise of the Esri layer entry, or of null (no key, refused, unusable)
let esriDown = false;   // Esri failed during this visit: never asked again until the page reloads
let esriErrors = 0;

const esc = s => String(s).replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
const plain = s => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// The Imagery Standard style, once per visit: its raster source gives the tile URLs (the key is
// echoed into them), tile size, zoom range and the imagery providers' attribution.
function loadEsri() {
  esri ||= (async () => {
    const key = await import('./secrets.js').then(m => String(m.ARCGIS_API_KEY || '').trim(), () => '');
    if (!key) return null;
    const r = await fetch(`${ESRI.style}?token=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`style answered HTTP ${r.status}`);
    const style = await r.json();
    if (style.error) throw new Error(`style answered error ${style.error.code ?? ''}`.trim());
    const src = Object.values(style.sources || {}).find(s => s && s.type === 'raster');
    if (!src) throw new Error('style has no raster source');
    const urls = src.tiles || (src.url ? [src.url] : []);
    if (!urls.length || !urls.every(u => ESRI.origins.includes(new URL(u).origin))) throw new Error('style points to an unexpected host');
    const withKey = u => /[?&]token=/.test(u) ? u : `${u}${u.includes('?') ? '&' : '?'}token=${encodeURIComponent(key)}`;
    const source = { type: 'raster', ...(src.tiles ? { tiles: src.tiles.map(withKey) } : { url: withKey(src.url) }), tileSize: src.tileSize || ESRI.tileSize,
      ...(src.minzoom != null && { minzoom: src.minzoom }), maxzoom: src.maxzoom ?? ESRI.maxzoom, ...(src.bounds && { bounds: src.bounds }) };
    const data = esc(plain(src.attribution) || ESRI.data);
    return { id: ESRI.id, source, layer: ESRI.layer,
      credit: `Imagery: <a href="https://www.esri.com">Powered by Esri</a> · ${data}`,
      fresh: () => `Esri World Imagery (ArcGIS Imagery Standard) · capture dates vary by area · ${source.tileSize} px tiles to zoom ${source.maxzoom}` };
  })().catch(e => { console.warn(`Esri imagery not used: ${e.message}`); esriDown = true; return null; });
  return esri;
}

function addLayer(map, s) {
  if (map.getSource(s.id)) return;
  const src = s.source || { type: 'raster', tiles: s.tiles(), tileSize: s.tileSize, maxzoom: s.maxzoom, ...(s.bounds && { bounds: s.bounds }) };
  map.addSource(s.id, src);
  const L = s.layer;
  map.addLayer({
    id: s.id, type: 'raster', source: s.id,
    ...(L.minzoom != null && { minzoom: L.minzoom }),
    ...(L.maxzoom != null && { maxzoom: L.maxzoom }),
    paint: { 'raster-opacity': L.fadeIn ? z(L.fadeIn[0], 0, L.fadeIn[1], 1) : 1, 'raster-fade-duration': 250 }
  }, map.getLayer(SAT_BEFORE) ? SAT_BEFORE : FIELD_BEFORE);
  stack.push(s);
}

// Layers that stay keep their tiles; new ones go on top (GIBS stays at the bottom).
function setStack(map, layers) {
  for (const s of stack) if (!layers.includes(s)) dropLayer(map, s);
  stack = stack.filter(s => layers.includes(s));
  for (const s of layers) addLayer(map, s);
}
function dropLayer(map, s) {
  if (map.getLayer(s.id)) map.removeLayer(s.id);
  if (map.getSource(s.id)) map.removeSource(s.id);
}

async function addSatellite(map) {
  if (stack.length) return;
  const my = ++gen;
  addLayer(map, GIBS); // world zoom shows at once; the rest follows when the key is known
  map.on('error', onMapError);
  const e = esriDown ? null : await loadEsri();
  if (my !== gen) return; // left Satellite (or came back) meanwhile
  setStack(map, e && !esriDown ? [GIBS, e] : [GIBS, ...FALLBACK]);
  onStack();
}

// Removing the layers and sources drops their tile caches, so imagery is released.
function removeSatellite(map) {
  gen++;
  map.off('error', onMapError);
  for (const s of stack) dropLayer(map, s);
  stack = [];
}

// Esri tile failures (refused key, free quota used up, blocked host): after a few, drop Esri for
// the rest of the visit and show the fallback stack instead of asking again. The message leaves
// out the tile URL, which carries the key. Other errors are logged as MapLibre would, unless the
// street-photo layer's own listener already does that.
function onMapError(e) {
  if (e.sourceId !== ESRI.id) { if (!e.target?.getSource?.('mly')) console.error(e.error || e); return; }
  console.warn(`Esri imagery tile failed${e.error?.status ? ` (HTTP ${e.error.status})` : ''}`);
  if (esriDown || ++esriErrors < ESRI.maxErrors) return;
  esriDown = true;
  const map = e.target;
  setStack(map, [GIBS, ...FALLBACK]);
  onStack();
}

// For the test scripts: which imagery is in use and why.
export const satelliteTest = () => ({ stack: stack.map(s => s.id), esriDown, esriErrors });

// Which satellite sources contribute at the current view (for the credits strip).
export function activeSatellite(map) {
  const zm = map.getZoom(), b = map.getBounds();
  return stack.filter(s => {
    const L = s.layer;
    if (L.minzoom != null && zm < L.minzoom) return false;
    if (L.maxzoom != null && zm >= L.maxzoom) return false;
    const bounds = s.bounds || s.source?.bounds;
    if (bounds) {
      const [w, so, e, n] = bounds;
      if (b.getEast() < w || b.getWest() > e || b.getNorth() < so || b.getSouth() > n) return false;
    }
    return true;
  });
}
