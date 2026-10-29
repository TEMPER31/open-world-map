// Basemaps: Dark, Light (one keyless vector source, two palettes) and Satellite
// (keyless raster stack, added on demand). The UI stays dark for all three.

import { OPENFREEMAP, SATELLITE } from './config.js';

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

// Switch palettes in place (no style reload) and add/remove the satellite stack.
export function applyBasemap(map, variant) {
  const p = PALETTE[variant];
  for (const [id, prop, key] of BINDINGS) {
    if (!map.getLayer(id)) continue;
    map.setLayoutProperty(id, 'visibility', p[key] ? 'visible' : 'none');
    if (p[key]) map.setPaintProperty(id, prop, p[key]);
  }
  if (variant === 'satellite') addSatellite(map); else removeSatellite(map);
}

function addSatellite(map) {
  for (const s of SATELLITE) {
    if (map.getSource(s.id)) continue;
    const src = { type: 'raster', tiles: s.tiles(), tileSize: s.tileSize, maxzoom: s.maxzoom };
    if (s.bounds) src.bounds = s.bounds;
    map.addSource(s.id, src);
    const L = s.layer;
    map.addLayer({
      id: s.id, type: 'raster', source: s.id,
      ...(L.minzoom != null && { minzoom: L.minzoom }),
      ...(L.maxzoom != null && { maxzoom: L.maxzoom }),
      paint: { 'raster-opacity': L.fadeIn ? z(L.fadeIn[0], 0, L.fadeIn[1], 1) : 1, 'raster-fade-duration': 250 }
    }, map.getLayer(SAT_BEFORE) ? SAT_BEFORE : FIELD_BEFORE);
  }
}

// Removing the layers and sources drops their tile caches, so imagery is released.
function removeSatellite(map) {
  for (const s of SATELLITE) {
    if (map.getLayer(s.id)) map.removeLayer(s.id);
    if (map.getSource(s.id)) map.removeSource(s.id);
  }
}

// Which satellite sources contribute at the current view (for the credits strip).
export function activeSatellite(map) {
  const zm = map.getZoom(), b = map.getBounds();
  return SATELLITE.filter(s => {
    const L = s.layer;
    if (L.minzoom != null && zm < L.minzoom) return false;
    if (L.maxzoom != null && zm >= L.maxzoom) return false;
    if (s.bounds) {
      const [w, so, e, n] = s.bounds;
      if (b.getEast() < w || b.getWest() > e || b.getNorth() < so || b.getSouth() > n) return false;
    }
    return true;
  });
}
