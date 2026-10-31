// Street photos (Phase 4): Mapillary coverage as vector tiles (overview dots z0-5, sequence
// lines z6-14, image dots z14+) and, on click, one photo from the Graph API in the shared
// panel. The public client token comes from js/secrets.js, written at deploy time from the
// MAPILLARY_CLIENT_TOKEN Actions secret and never committed. Nothing is requested from Mapillary
// until the layer is on; turning it off removes the source (no more tile requests).

import * as S from './state.js';

const TILES = 'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}';
const GRAPH = 'https://graph.mapillary.com/';
export const CREDIT = 'Street photos: <a href="https://www.mapillary.com/">© Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>';
const GREEN = '#2fd27a', esc = s => String(s ?? '').replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
let map, token = null, onChange = () => {};
const photos = {}; // image id -> {state: 'loading' | 'ok' | 'error' | 'none', ...}

// '' when no token is configured (the layer then says "unavailable" and sends nothing).
async function getToken() {
  if (token == null) token = await import('./secrets.js').then(m => m.MAPILLARY_TOKEN || '', () => '');
  return token;
}
export const status = () => !S.get('photos') ? null : token == null ? '…' : token ? 'on' : 'unavailable';

async function show(on) {
  const has = !!map.getSource('mly');
  if (!on || !(await getToken())) {
    if (has) for (const id of ['mly-ov', 'mly-seq', 'mly-img', 'mly-sel']) map.removeLayer(id);
    if (has) map.removeSource('mly');
    return onChange();
  }
  if (has || !S.get('photos')) return;
  map.addSource('mly', { type: 'vector', tiles: [`${TILES}?access_token=${encodeURIComponent(token)}`], minzoom: 0, maxzoom: 14, attribution: '' });
  const L = o => map.addLayer({ source: 'mly', ...o }, map.getLayer('omt-label-road') ? 'omt-label-road' : undefined);
  L({ id: 'mly-ov', type: 'circle', 'source-layer': 'overview', maxzoom: 6, paint: { 'circle-radius': 1.6, 'circle-color': GREEN, 'circle-opacity': 0.7 } });
  L({ id: 'mly-seq', type: 'line', 'source-layer': 'sequence', minzoom: 6, paint: { 'line-color': GREEN, 'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0.8, 14, 2.2], 'line-opacity': 0.75 }, layout: { 'line-cap': 'round' } });
  L({ id: 'mly-img', type: 'circle', 'source-layer': 'image', minzoom: 14, paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 3, 18, 6], 'circle-color': GREEN, 'circle-stroke-color': '#07090c', 'circle-stroke-width': 1 } });
  L({ id: 'mly-sel', type: 'circle', 'source-layer': 'image', minzoom: 14, filter: ['==', ['to-string', ['get', 'id']], ''], paint: { 'circle-radius': 9, 'circle-opacity': 0, 'circle-stroke-color': '#dcb672', 'circle-stroke-width': 2.5 } });
  onChange();
}

export function initPhotos(m, changed) {
  map = m; onChange = changed;
  S.on(['photos'], s => show(s.photos));
  S.on(['selection'], s => map.getLayer('mly-sel') && map.setFilter('mly-sel', ['==', ['to-string', ['get', 'id']], s.selection?.type === 'photo' ? s.selection.id : '']), { now: false });
}
export const credits = () => S.get('photos') && token ? [CREDIT] : [];

// The photo under a click (image dot, or a sequence line's representative image), or null.
export function hit({ point: p, lngLat }) {
  if (!map.getLayer('mly-img')) return null;
  const f = map.queryRenderedFeatures([[p.x - 6, p.y - 6], [p.x + 6, p.y + 6]], { layers: ['mly-img', 'mly-seq'] })[0];
  const id = f && String(f.layer.id === 'mly-img' ? f.properties.id : f.properties.image_id || '');
  return id ? { type: 'photo', id, lon: f.geometry.type === 'Point' ? f.geometry.coordinates[0] : lngLat.lng, lat: f.geometry.type === 'Point' ? f.geometry.coordinates[1] : lngLat.lat } : null;
}

async function load(id) {
  const p = photos[id] = { state: 'loading' };
  try {
    const r = await fetch(`${GRAPH}${encodeURIComponent(id)}?fields=id,thumb_1024_url,captured_at,creator,geometry&access_token=${encodeURIComponent(token)}`, { signal: AbortSignal.timeout(20000) });
    const j = await r.json();
    if (!r.ok || j.error) throw new Error(j.error?.message || `HTTP ${r.status}`);
    Object.assign(p, j.thumb_1024_url ? { state: 'ok', ...j } : { state: 'none' });
  } catch (e) { Object.assign(p, { state: 'error', error: String(e.message || e) }); }
  onChange();
}

// Panel HTML for a photo (loading, error, "no photo here" and the photo with its credit).
export function panelHTML(id) {
  const p = photos[id] || (load(id), photos[id]), page = `https://www.mapillary.com/app/?pKey=${encodeURIComponent(id)}`;
  const body = p.state === 'ok'
    ? `<a href="${page}" target="_blank" rel="noopener"><img class="ph-img" src="${esc(p.thumb_1024_url)}" alt="Street-level photo taken ${new Date(p.captured_at).toLocaleDateString()}" referrerpolicy="no-referrer"></a>`
    : `<div class="ph-img ph-msg">${p.state === 'loading' ? 'Loading photo…' : p.state === 'none' ? 'No photo here.' : `Photo unavailable (${esc(p.error)}).`}</div>`;
  const when = p.captured_at ? new Date(p.captured_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  return `<div class="d-hd"><button class="d-x" type="button" data-deselect aria-label="Close (Esc)" title="Close (Esc)">×</button>
      <div class="kick">Street photo · Mapillary</div><div class="d-title" data-photo-id="${esc(id)}">${when ? esc(when) : 'Street photo'}</div>
      <div class="d-sub">${when ? '<span class="mono">captured, your local time</span>' : ''}</div></div>
    <div class="d-sec">${body}</div>
    <div class="d-ft"><div class="d-btns"><a class="btn pri" href="${page}" target="_blank" rel="noopener">Open on Mapillary ↗</a><button class="btn" type="button" data-center>Centre map here</button></div>
      <div class="src" data-photo-credit>CC BY-SA 4.0 — Mapillary / ${esc(p.creator?.username || (p.state === 'ok' ? 'unknown' : '…'))}</div></div>`;
}
export const photosTest = { photos, getToken: () => token };
