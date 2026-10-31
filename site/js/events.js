// Natural events (Phase 5): earthquakes (USGS), wildfires, volcanoes and storms (NASA EONET),
// disaster alerts (GDACS), active tropical storms with forecast track and cone (NOAA NHC). All
// keyless and CORS-enabled (scripts/data/sources-probe.mjs), fetched by the browser only while a
// toggle that needs them is on, at most every 10 min, kept in memory. Observed events don't move
// with the timeline; NHC storm positions follow it. Drawn as GeoJSON layers, no DOM markers.

import * as S from './state.js';
import { onTime, stamp, validOf } from './clock.js';
import { fmtDist, conv, label } from './units.js';
import { fmtBoth, relT } from './timeline.js';

export const TYPES = [['eq', 'Earthquakes', 'M2.5+'], ['fv', 'Wildfires & volcanoes', 'EONET'], ['st', 'Storms', 'NHC · EONET'], ['ga', 'Disaster alerts', 'GDACS']];
const NAME = Object.fromEntries(TYPES), DAY = 864e5, REFRESH = 6e5;
const NHC = 'https://mapservices.weather.noaa.gov/tropical/rest/services/tropical/NHC_tropical_weather/MapServer/';
// NHC storm slots AT1-5, EP1-5, CP1-5: slot i has Forecast Points at layer 6 + 26 i, Cone 8 + 26 i.
const BINS = ['AT', 'EP', 'CP'].flatMap(b => [1, 2, 3, 4, 5].map(n => b + n));
const STY = { HU: 'Hurricane', MH: 'Major Hurricane', TS: 'Tropical Storm', TD: 'Tropical Depression', STS: 'Subtropical Storm', STD: 'Subtropical Depression', PTC: 'Potential Tropical Cyclone' };
const GT = { EQ: 'Earthquake', TC: 'Tropical cyclone', FL: 'Flood', VO: 'Volcano', DR: 'Drought', WF: 'Wildfire' };
const utc = s => Date.parse(/[zZ]$|[+-]\d\d:?\d\d$/.test(s) ? s : s + 'Z');
const ymd = d => new Date(Date.now() + d * DAY).toISOString().slice(0, 10);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
const http = (u, alt) => /^https?:\/\//.test(u || '') ? u : alt;
async function get(url) { const r = await fetch(url, { signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }

export const CREDIT = {
  usgs: 'Earthquakes: <a href="https://earthquake.usgs.gov/">USGS</a>',
  eonet: 'Events: <a href="https://eonet.gsfc.nasa.gov/">NASA EONET</a>',
  gdacs: 'Alerts: <a href="https://www.gdacs.org/">GDACS</a> (EC JRC, UN OCHA)',
  nhc: 'Storm forecasts: <a href="https://www.nhc.noaa.gov/">NOAA NHC</a>'
};

// Each source: the toggles that need it, and load() -> {items, updated (the source's own time)}.
// Item stats are [label, value, unit, note] (all text), built when the panel opens so they follow units.
const SRC = {
  usgs: { types: ['eq'], async load() {
    const j = await get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson');
    return { updated: j.metadata?.generated, items: j.features.map(f => { const p = f.properties, [lon, lat, depth] = f.geometry.coordinates;
      return { id: 'us:' + f.id, k: 'eq', title: p.mag != null ? `M ${p.mag.toFixed(1)} earthquake` : 'Earthquake', place: p.place, time: p.time, mag: p.mag, lon, lat, src: 'usgs', link: p.url,
        stats: () => [['Magnitude', p.mag?.toFixed(1) ?? '—', '', p.magType], ['Depth', fmtDist(depth), '', 'below the surface'], ...(p.alert ? [['PAGER alert', p.alert, '', 'USGS impact estimate']] : [])] }; }) };
  } },
  eonet: { types: ['fv', 'st'], async load() {
    const j = await get('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7');
    const C = { wildfires: ['fv', 'fire', 'Wildfire'], volcanoes: ['fv', 'volc', 'Volcano'], severeStorms: ['st', 'storm', 'Severe storm'] };
    return { items: j.events.flatMap(e => {
      const c = C[e.categories?.[0]?.id], g = e.geometry?.at(-1);
      if (!c || !g) return [];
      let [lon, lat] = g.coordinates; if (Array.isArray(lon)) [lon, lat] = lon[0]; // polygon: first vertex
      return [{ id: 'eo:' + e.id, k: c[0], icon: c[1], title: e.title, place: c[2] + ' · latest report', time: utc(g.date), lon, lat, src: 'eonet', link: http(e.sources?.[0]?.url, e.link),
        stats: () => [['Category', e.categories[0].title, '', 'NASA EONET'], ['Reported by', e.sources?.map(s => s.id).join(', ') || '—', '', 'source'], ...(g.magnitudeValue != null ? [['Size', g.magnitudeValue, g.magnitudeUnit, 'as reported']] : [])] }];
    }) };
  } },
  gdacs: { types: ['ga'], async load() {
    const j = await get(`https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=${ymd(-7)}&toDate=${ymd(1)}&alertlevel=Green;Orange;Red&pageSize=100`);
    const F = j.features.filter(f => f.geometry?.type === 'Point');
    return { updated: Math.max(0, ...F.map(f => utc(f.properties.datemodified || f.properties.todate) || 0)) || null, items: F.map(f => {
      const p = f.properties, [lon, lat] = f.geometry.coordinates;
      return { id: `ga:${p.eventtype}${p.eventid}`, k: 'ga', icon: 'alert-' + (/^(orange|red)$/i.test(p.alertlevel) ? p.alertlevel.toLowerCase() : 'green'), title: p.name || GT[p.eventtype], place: p.country || '', time: utc(p.fromdate), lon, lat, src: 'gdacs',
        link: http(p.url?.report, `https://www.gdacs.org/report.aspx?eventtype=${p.eventtype}&eventid=${p.eventid}`),
        stats: () => [['Alert level', p.alertlevel || '—', '', 'GDACS'], ['Type', GT[p.eventtype] || p.eventtype, '', p.severitydata?.severitytext || ''], ['Last update', p.todate ? fmtBoth(utc(p.todate)) : '—', '', 'GDACS: indicative only, check other sources']] };
    }) };
  } },
  nhc: { types: ['st'], async load() {
    const q = (id, f = '*') => get(`${NHC}${id}/query?where=1%3D1&outFields=${f}&f=geojson`);
    const storms = (await Promise.all(BINS.map(async (bin, i) => {
      const pts = (await q(6 + 26 * i)).features;
      if (!pts.length) return null;
      const cone = await q(8 + 26 * i, 'stormname').then(c => c.features, () => []);
      return { bin, cone, pts: pts.map(f => ({ ...f.properties, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], at: validAt(f.properties.validtime) })).filter(p => p.at === p.at).sort((a, b) => a.tau - b.tau) };
    }))).filter(s => s?.pts.length);
    return { storms, items: storms.map(({ bin, pts: [p] }) => ({ id: 'nhc:' + bin, k: 'st', nhc: bin, title: `${STY[p.stormtype] || p.stormtype || ''} ${p.stormname}`.trim(), place: `NHC advisory ${p.advisnum} · ${p.advdate}`, time: p.at, lon: p.lon, lat: p.lat, src: 'nhc', link: 'https://www.nhc.noaa.gov/' })) };
  } }
};
// NHC "validtime" is "DD/HHMM" UTC: the month that puts it nearest now.
function validAt(s) {
  const [, d, h, m] = String(s).match(/(\d+)\/(\d\d)(\d\d)/) || [], n = new Date();
  return d ? [-1, 0, 1].map(k => Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + k, +d, +h, +m)).reduce((a, b) => Math.abs(b - n) < Math.abs(a - n) ? b : a) : NaN;
}

const cache = {};   // source -> {at, items, updated, storms, error, busy}
let map, timer = null, onChange = () => {};
const want = s => Object.keys(SRC).filter(n => SRC[n].types.some(k => s.events[k]));
const items = () => Object.values(cache).flatMap(c => c.items || []);
const byId = id => items().find(i => i.id === id);

async function refresh() {
  await Promise.all(want(S.get()).map(async n => {
    const c = cache[n] ||= {};
    if (c.busy || Date.now() - (c.at || 0) < REFRESH) return;
    c.busy = true;
    try { Object.assign(c, await SRC[n].load(), { error: null }); } catch (e) { c.error = String(e.message || e); console.warn(n, e); }
    c.at = Date.now(); c.busy = false;
    draw();
  }));
}

const visible = s => {
  const from = Date.now() - (s.evWin === '24h' ? DAY : 7 * DAY), on = want(s);
  return Object.entries(cache).flatMap(([n, c]) => on.includes(n) ? c.items || [] : []).filter(i => s.events[i.k] && (i.nhc || i.time >= from));
};
// Per toggle for the layers panel: {text: count | "…" | "unavailable" | "none active", note}.
export function status(k) {
  const s = S.get(), cs = Object.keys(SRC).filter(n => SRC[n].types.includes(k)).map(n => cache[n] || {});
  if (!s.events[k]) return null;
  if (cs.every(c => !c.at)) return { text: '…' };
  if (cs.every(c => c.error)) return { text: 'unavailable', note: `${NAME[k]}: unavailable.` };
  const n = visible(s).filter(i => i.k === k).length, none = k === 'st' && cache.nhc?.storms?.length === 0;
  return { text: n ? String(n) : none ? 'none active' : 'none', note: none ? 'No active storms (NHC: Atlantic, East and Central Pacific).' : '' };
}
// "USGS updated 19:33 UTC · EONET checked 19:34 UTC": the source's own time where it gives one.
export const sourceTimes = () => want(S.get()).filter(n => cache[n]?.at).map(n => { const c = cache[n]; return `${n.toUpperCase()} ${c.error ? 'unavailable' : `${c.updated ? 'updated' : 'checked'} ${new Date(c.updated || c.at).toISOString().slice(11, 16)} UTC`}`; }).join(' · ');
export const credits = () => want(S.get()).map(n => CREDIT[n]);

const fc = features => ({ type: 'FeatureCollection', features });
const pt = (c, p = {}) => ({ type: 'Feature', properties: p, geometry: { type: 'Point', coordinates: c } });
function draw() {
  if (!map) return;
  const s = S.get(), now = Date.now(), sel = s.selection?.type === 'event' && byId(s.selection.id);
  map.getSource('events').setData(fc(visible(s).filter(i => !i.nhc).map(i => pt([i.lon, i.lat], { id: i.id, k: i.k, icon: i.icon || '', mag: i.mag ?? 0, recent: +(now - i.time < DAY) }))));
  map.getSource('nhc').setData(fc((s.events.st && cache.nhc?.storms || []).flatMap(st => [...st.cone.map(f => ({ ...f, properties: { k: 'cone' } })),
    { type: 'Feature', properties: { k: 'track' }, geometry: { type: 'LineString', coordinates: st.pts.map(p => [p.lon, p.lat]) } },
    ...st.pts.map(p => pt([p.lon, p.lat], { k: 'fpt', id: 'nhc:' + st.bin }))])));
  map.getSource('ev-sel').setData(fc(sel ? [pt(stormAt(sel) || [sel.lon, sel.lat])] : []));
  position(s.t);
  onChange();
}

// An NHC storm at a valid time: interpolated between forecast points; at the first point before
// it; null (hidden) after the last.
function stormAt(i, v = validOf(S.get('t'))) {
  const P = i?.nhc && cache.nhc?.storms?.find(x => x.bin === i.nhc)?.pts;
  if (!P || v > P.at(-1).at) return null;
  const k = P.findIndex(p => p.at >= v), a = P[k - 1], b = P[k];
  if (k <= 0) return [P[0].lon, P[0].lat];
  const f = (v - a.at) / (b.at - a.at);
  return [a.lon + (b.lon - a.lon) * f, a.lat + (b.lat - a.lat) * f];
}
// One clock: event layers report the hour they show (-1 while their first download runs).
function position(t) {
  const s = S.get(), on = want(s);
  stamp('events', on.length ? (on.some(n => !cache[n]?.at) ? -1 : t) : null);
  const now = s.events.st ? (cache.nhc?.items || []).map(i => [i, stormAt(i, validOf(t))]).filter(([, c]) => c) : [];
  map.getSource('nhc-now').setData(fc(now.map(([i, c]) => pt(c, { id: i.id }))));
  stamp('storms', s.events.st ? (cache.nhc?.at ? t : -1) : null);
}

// Marker shapes drawn once into images: fire, volcano, storm, alert diamonds by level.
function icon(fill, pts) {
  const c = document.createElement('canvas'); c.width = c.height = 44;
  const g = c.getContext('2d'); g.scale(2, 2); g.translate(11, 11); g.lineWidth = 1.5; g.strokeStyle = '#07090c'; g.fillStyle = fill; g.beginPath();
  if (pts) pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); else g.arc(0, 0, 6, 0, 7);
  g.closePath(); g.fill(); g.stroke();
  if (!pts) { g.beginPath(); g.arc(0, 0, 2.2, 0, 7); g.fillStyle = '#07090c'; g.fill(); }
  return { width: 44, height: 44, data: g.getImageData(0, 0, 44, 44).data };
}
const DIA = [[0, -7], [7, 0], [0, 7], [-7, 0]];
const ICONS = { fire: ['#ff5a1f', [[0, -7], [5, 1], [3, 6], [-3, 6], [-5, 1]]], volc: ['#ff8a3d', [[0, -6], [7, 6], [-7, 6]]], storm: ['#8a7cff'],
  'alert-green': ['#45d483', DIA], 'alert-orange': ['#ff9f1c', DIA], 'alert-red': ['#ff3b30', DIA] };
const HIT = ['ev-eq', 'ev-pt', 'nhc-pt', 'nhc-now'];

export function initEvents(m, changed) {
  map = m; onChange = changed;
  for (const [n, a] of Object.entries(ICONS)) map.addImage('ev-' + n, icon(...a), { pixelRatio: 2 });
  for (const id of ['events', 'nhc', 'nhc-now', 'ev-sel']) map.addSource(id, { type: 'geojson', data: fc([]) });
  // above the weather field and particles, below the labels
  const L = o => map.addLayer(o, map.getLayer('omt-label-road') ? 'omt-label-road' : undefined), k = v => ['==', ['get', 'k'], v];
  L({ id: 'nhc-cone', type: 'fill', source: 'nhc', filter: k('cone'), paint: { 'fill-color': '#8a7cff', 'fill-opacity': 0.16, 'fill-outline-color': '#b3a9ff' } });
  L({ id: 'nhc-track', type: 'line', source: 'nhc', filter: k('track'), paint: { 'line-color': '#b3a9ff', 'line-width': 1.6, 'line-dasharray': [2, 1.5] } });
  L({ id: 'nhc-pt', type: 'circle', source: 'nhc', filter: k('fpt'), paint: { 'circle-radius': 3, 'circle-color': '#07090c', 'circle-stroke-color': '#b3a9ff', 'circle-stroke-width': 1.5 } });
  L({ id: 'ev-eq', type: 'circle', source: 'events', filter: k('eq'), paint: { 'circle-radius': ['interpolate', ['linear'], ['get', 'mag'], 2.5, 3, 5, 7, 7, 13, 9, 20],
    'circle-color': ['case', ['==', ['get', 'recent'], 1], 'rgba(237,232,221,.38)', 'rgba(237,232,221,.1)'], 'circle-stroke-color': '#ede8dd', 'circle-stroke-width': 1.2 } });
  L({ id: 'ev-pt', type: 'symbol', source: 'events', filter: ['!=', ['get', 'k'], 'eq'], layout: { 'icon-image': ['concat', 'ev-', ['get', 'icon']], 'icon-allow-overlap': true, 'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.8, 6, 1.1] } });
  L({ id: 'nhc-now', type: 'symbol', source: 'nhc-now', layout: { 'icon-image': 'ev-storm', 'icon-size': 1.5, 'icon-allow-overlap': true } });
  L({ id: 'ev-sel', type: 'circle', source: 'ev-sel', paint: { 'circle-radius': 14, 'circle-opacity': 0, 'circle-stroke-color': '#dcb672', 'circle-stroke-width': 2.5 } });

  S.on(['events'], s => { clearInterval(timer); if (want(s).length) { refresh(); timer = setInterval(refresh, 6e4); } draw(); });
  S.on(['evWin', 'selection'], draw, { now: false });
  onTime(({ t }) => position(t));
}

// The event under a click or tap (within 8 px), as a selection, or null.
export function hit(p) {
  const f = map.queryRenderedFeatures([[p.x - 8, p.y - 8], [p.x + 8, p.y + 8]], { layers: HIT }).find(f => f.properties.id), i = f && byId(f.properties.id);
  return i ? { type: 'event', id: i.id, lon: i.lon, lat: i.lat } : null;
}

const ago = ms => { const m = Math.max(0, Math.round((Date.now() - ms) / 6e4)); return m < 60 ? `${m} min ago` : m < 2880 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const spd = kt => [Math.round(conv('speed', kt * 1.852)), label('speed')];

// Panel HTML for an event, or null if it is gone (source refreshed or turned off).
export function panelHTML(id) {
  const i = byId(id), c = cache[i?.src];
  if (!i) return null;
  let stats = i.stats, tag = ago(i.time), when = i.time, note = '';
  if (i.nhc) { // the forecast point nearest the timeline's time
    const P = cache.nhc.storms.find(x => x.bin === i.nhc).pts, v = validOf(S.get('t')), over = v > P.at(-1).at;
    const p = P.reduce((a, b) => Math.abs(b.at - v) < Math.abs(a.at - v) ? b : a);
    tag = over ? 'past the last forecast point' : `forecast ${relT(S.get('t'))}`; when = over ? p.at : v;
    stats = () => [['Max wind', ...spd(p.maxwind), `gusts ${spd(p.gust).join(' ')}`], ['Pressure', Math.round(p.mslp), 'hPa', 'centre'], ['Type', STY[p.stormtype] || p.stormtype, '', 'at that point'], ['Moving', ...(p.tcspd ? spd(p.tcspd) : ['—', '']), p.tcdir != null ? `towards ${Math.round(p.tcdir)}°` : '']];
    note = `<div class="d-sec"><div class="src">NHC forecast point nearest ${over ? 'the end' : 'this time'}: +${p.tau} h from advisory ${esc(p.advisnum)}. The cone shows where the centre will probably track, not the storm's size.</div></div>`;
  }
  return `<div class="d-hd"><button class="d-x" type="button" data-deselect aria-label="Close (Esc)" title="Close (Esc)">×</button>
      <div class="kick">Event · ${NAME[i.k]}</div><div class="d-title" data-event-id="${esc(i.id)}">${esc(i.title)}</div><div class="d-name">${esc(i.place)}</div>
      <div class="d-sub"><span class="tag">${tag}</span><span class="mono">${fmtBoth(when)}</span></div></div>
    <div class="stats">${stats().map(([l, v, u, d]) => `<div class="stat"><div class="l">${l}</div><div class="n">${esc(v)}<small>${esc(u)}</small></div><div class="l">${esc(d)}</div></div>`).join('')}</div>${note}
    <div class="d-ft"><div class="d-btns"><a class="btn pri" href="${esc(i.link)}" target="_blank" rel="noopener">Open source page ↗</a><button class="btn" type="button" data-center>Centre map here</button></div>
      <div class="src">${CREDIT[i.src].replace(/<[^>]+>/g, '')} · ${c.updated ? 'updated' : 'checked'} ${fmtBoth(c.updated || c.at)}</div></div>`;
}
export const eventsTest = { cache, stormAt: id => stormAt(byId(id)) };
