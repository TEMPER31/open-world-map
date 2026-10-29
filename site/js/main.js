// Open World Map, Phase 1: layout, basemaps, sample weather field, particles, timeline.

import { HOURS, CREDITS, SAMPLE_GRID_DEG } from './config.js';
import * as S from './state.js';
import { loadScales, FIELDS, ORDER, legendHTML, barHTML, rangeText, aqCategory } from './scales.js';
import { pointSeries } from './sample-data.js';
import { getFrame, getPixels } from './frames.js';
import { buildStyle, applyBasemap, activeSatellite } from './basemaps.js';
import { FieldLayer, valueAt, windAt } from './field-layer.js';
import { Particles } from './particles.js';
import { initTimeline, relT, fmtUTC } from './timeline.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mobile = matchMedia('(max-width: 1023px)');

// Sample "run" time: the current UTC hour. Real runs come from the Phase 2 manifest.
const BASE = Math.floor(Date.now() / 3600e3) * 3600e3;
const hhmm = ms => new Date(ms).toISOString().slice(11, 16);
const SAMPLE_META = `sample · ${SAMPLE_GRID_DEG}° grid`;
let current = null; // the frame currently drawn on the map

const BASEMAPS = [['dark', 'Dark'], ['light', 'Light'], ['satellite', 'Satellite']];
const DENSITY = [[0.5, 'Low'], [1, 'Normal'], [1.6, 'High']];
const EVENTS = [['eq', 'Earthquakes M2.5+'], ['fi', 'Wildfires'], ['cy', 'Tropical cyclones'], ['st', 'Severe storms']];

// ---- formatting ----------------------------------------------------------------
const DIRS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const dirFrom = (u, v) => DIRS[Math.round(((Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360) / 22.5) % 16];
const fmtLat = la => `${Math.abs(la).toFixed(2)}°${la >= 0 ? 'N' : 'S'}`;
const fmtLon = lo => { lo = ((lo + 540) % 360) - 180; return `${Math.abs(lo).toFixed(2)}°${lo >= 0 ? 'E' : 'W'}`; };
const fmtCoord = (lo, la) => `${fmtLat(la)} ${fmtLon(lo)}`;

function reading(fr, k, lo, la) {
  const v = valueAt(fr, k, lo, la);
  switch (k) {
    case 'wind': { const [u, w] = windAt(fr, lo, la); return [Math.round(v), 'km/h', `from ${dirFrom(u, w)}`]; }
    case 'temp': return [Math.round(v), '°C', 'at 2 m'];
    case 'rain': return v < 0.1 ? ['Dry', '', 'precipitation'] : [v.toFixed(1), 'mm/h', 'precipitation'];
    case 'aq': return [Math.round(v), 'µg/m³', aqCategory(v)];
    case 'cloud': return [Math.round(v), '%', 'cloud cover'];
    case 'pres': return [Math.round(v), 'hPa', 'sea level'];
  }
}

// ---- toast ---------------------------------------------------------------------
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ---- layers panel (desktop rail + mobile sheet) ---------------------------------
function buildLayers() {
  const levelShort = f => f.level === 'mean sea level' ? 'MSL' : f.level === 'total cover' ? 'total' : f.level;
  $('#layers').innerHTML = `
    <div class="l-hd"><b>Layers</b><span class="l-sum" data-lsum></span><button class="l-min" type="button" data-lmin aria-label="Minimise layers" aria-expanded="true"></button></div>
    <div class="lsec" role="radiogroup" aria-label="Weather field"><div class="kick"><span>Field</span><span>Sample · ${SAMPLE_GRID_DEG}°</span></div>
      ${ORDER.map(k => `<button class="row" type="button" role="radio" data-field="${k}"><span class="rad"></span><b>${FIELDS[k].label}</b><span class="v">${levelShort(FIELDS[k])}</span></button>`).join('')}
      <div class="row" data-toggle><b>Wind particles</b><button class="tg" type="button" role="switch" data-particles aria-label="Wind particles"></button></div>
    </div>
    <div class="lsec"><div class="kick"><span>Events</span><span>Phase 5</span></div>
      ${EVENTS.map(([c, n]) => `<div class="row off" aria-disabled="true"><span class="sw ${c}"></span><b>${n}</b><span class="v soon">Soon</span><button class="tg" type="button" role="switch" aria-checked="false" aria-label="${n} (coming soon)" disabled></button></div>`).join('')}
    </div>
    <div class="lsec"><div class="kick"><span>Imagery</span><span>Phase 4</span></div>
      <div class="row off" aria-disabled="true"><span class="gdot"></span><b>Street photos</b><span class="v soon">Soon</span><button class="tg" type="button" role="switch" aria-checked="false" aria-label="Street photos (coming soon)" disabled></button></div>
    </div>
    <div class="lfoot"><b>Weather is generated sample data.</b><br>Basemap OpenFreeMap · OpenStreetMap · Natural Earth</div>`;

  $('#lsheet').innerHTML = `
    <div class="ls-hd"><b>Map layers</b><button class="d-x" type="button" data-lyr-close aria-label="Close">×</button></div>
    <div class="grp"><div class="kick"><span>Field</span><span>sample data</span></div>
      <div class="ftiles" role="radiogroup" aria-label="Weather field">${ORDER.map(k => `<button class="ftile" type="button" role="radio" data-field="${k}"><b>${FIELDS[k].short}</b>${barHTML(k, false)}<span>${FIELDS[k].unit}</span></button>`).join('')}</div></div>
    <div class="grp"><div class="kick"><span>Basemap</span><span></span></div>
      <div class="card"><div class="it">Map<div class="seg" role="radiogroup" aria-label="Basemap" data-basemaps></div></div></div></div>
    <div class="grp"><div class="card">
      <div class="it">Wind particles<button class="tg" type="button" role="switch" data-particles aria-label="Wind particles"></button></div>
      <div class="it">Events<span class="soon">Coming soon</span></div>
      <div class="it"><span><span class="gdot"></span> Street photos</span><span class="soon">Coming soon</span></div>
    </div></div>`;

  $$('[data-basemaps]').forEach(g => g.innerHTML = BASEMAPS.map(([v, n]) => `<button type="button" role="radio" data-basemap="${v}">${n}</button>`).join(''));
  $('[data-density]').innerHTML = DENSITY.map(([v, n]) => `<button type="button" role="radio" data-dens="${v}">${n}</button>`).join('');
}

function bindChrome(map) {
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.field) S.set({ field: t.dataset.field });
    else if (t.dataset.basemap) S.set({ basemap: t.dataset.basemap });
    else if (t.dataset.dens) S.set({ density: +t.dataset.dens });
    else if ('particles' in t.dataset) S.set({ particles: !S.get('particles') });
    else if ('lmin' in t.dataset) S.set({ layersMin: !S.get('layersMin') });
    else if (t.dataset.soon) toast(`${t.dataset.soon} arrives in a later phase.`);
    else if (t.dataset.open) togglePop(t.dataset.open);
    else if ('close' in t.dataset) closePops();
    else if ('lyr' in t.dataset) toggleLayersSheet();
    else if ('lyrClose' in t.dataset) toggleLayersSheet(false);
    else if (t.dataset.zoom) t.dataset.zoom > 0 ? map.zoomIn() : map.zoomOut();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePops(); toggleLayersSheet(false); S.set({ selection: null }); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toast('Search arrives in a later phase.'); }
  });
  const op = $('#set-opacity');
  op.value = Math.round(S.get('opacity') * 100);
  op.addEventListener('input', () => S.set({ opacity: op.value / 100 }));

  S.on(['field'], s => {
    $$('[data-field]').forEach(el => {
      const on = el.dataset.field === s.field;
      el.classList.toggle('on', on && el.classList.contains('row'));
      el.setAttribute('aria-checked', String(on));
    });
    $$('[data-lsum]').forEach(el => el.textContent = `${FIELDS[s.field].short} · sample`);
  });
  S.on(['basemap'], s => $$('[data-basemap]').forEach(el => el.setAttribute('aria-checked', String(el.dataset.basemap === s.basemap))));
  S.on(['density'], s => $$('[data-dens]').forEach(el => el.setAttribute('aria-checked', String(+el.dataset.dens === s.density))));
  S.on(['particles'], s => $$('[data-particles]').forEach(el => { el.classList.toggle('on', s.particles); el.setAttribute('aria-checked', String(s.particles)); }));
  S.on(['layersMin'], s => {
    $('#layers').classList.toggle('min', s.layersMin);
    const b = $('[data-lmin]');
    b.setAttribute('aria-expanded', String(!s.layersMin));
    b.setAttribute('aria-label', s.layersMin ? 'Expand layers' : 'Minimise layers');
  });
  S.on(['field', 'basemap'], s => {
    const light = s.basemap === 'light', f = FIELDS[s.field];
    $('#legend').innerHTML = legendHTML(s.field, light, f.mode === 'banded' ? `US EPA bands · ${SAMPLE_META}` : `${f.level} · ${SAMPLE_META}`);
    $('#mchip').innerHTML = `${f.short} ${f.unit}${barHTML(s.field, light)}${rangeText(s.field)}<span class="sample-badge">Sample</span>`;
  });
  $$('[data-updated]').forEach(el => el.textContent = `Updated ${hhmm(BASE)} UTC`);
}

function closePops() { $$('.pop').forEach(p => p.hidden = true); }
function togglePop(id) {
  const p = $('#pop-' + id), open = p.hidden;
  closePops();
  toggleLayersSheet(false);
  p.hidden = !open;
}
function toggleLayersSheet(force) {
  const sh = $('#lsheet'), open = force ?? sh.hidden;
  if (open) closePops();
  sh.hidden = !open;
  $('[data-lyr]').setAttribute('aria-expanded', String(open));
}

// ---- detail panel (clicked place) ------------------------------------------------
function chartSVG(lo, la, t) {
  const T = pointSeries(lo, la, 'temp'), W = pointSeries(lo, la, 'wind');
  const w = 310, h = 64, n = HOURS, x = i => (i / n * w).toFixed(1);
  const tMin = Math.min(...T) - 1, tMax = Math.max(...T) + 1, wMax = Math.max(40, ...W);
  const y = v => (6 + (tMax - v) / (tMax - tMin) * (h - 26)).toFixed(1);
  const bars = W.map((v, i) => `<rect x="${(i / n * w - 1.4).toFixed(1)}" y="${(h - 14 - v / wMax * 18).toFixed(1)}" width="2.8" height="${(v / wMax * 18).toFixed(1)}" fill="var(--mute)" opacity=".45"/>`).join('');
  const line = T.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Sample temperature and wind for the next 48 hours">${bars}
    <path d="${line}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
    <line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 12}" stroke="var(--accent)" stroke-width="1.5"/>
    <circle cx="${x(t)}" cy="${y(T[t])}" r="3.5" fill="var(--accent)"/>
    <text x="0" y="${h - 1}" font-family="IBM Plex Mono" font-size="9.5" fill="var(--ink)">Now</text>
    <text x="${w / 2}" y="${h - 1}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">+24 h</text>
    <text x="${w}" y="${h - 1}" text-anchor="end" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">+48 h</text></svg>`;
}

function renderDetail(s) {
  const el = $('#detail');
  document.body.classList.toggle('has-detail', !!s.selection);
  if (!s.selection) { el.hidden = true; return; }
  if (!current) return;
  const { lon, lat } = s.selection, fr = current, t = fr.t;
  const stat = k => { const [v, u, d] = reading(fr, k, lon, lat); return `<button class="stat${k === s.field ? ' on' : ''}" type="button" data-field="${k}" title="Show ${FIELDS[k].label}"><div class="l">${FIELDS[k].label}</div><div class="n">${v}<small>${u}</small></div><div class="l">${d}</div></button>`; };
  el.innerHTML = `
    <div class="d-hd"><button class="d-x" type="button" data-deselect aria-label="Close">×</button>
      <div class="kick">Place · sample data</div>
      <div class="d-title">${fmtCoord(lon, lat)}</div>
      <div class="d-sub"><span class="tag">${relT(t)}</span>${fmtUTC(BASE + t * 3600e3)}</div></div>
    <div class="stats">${ORDER.map(stat).join('')}</div>
    <div class="d-sec"><div class="kick"><span>Next 48 h</span><span>— temp · ▮ wind</span></div>${chartSVG(lon, lat, t)}</div>
    <div class="d-sec"><div class="alert"><b>Sample data</b><span>Generated to test the layout. Not an observation or a forecast.</span></div></div>
    <div class="d-ft"><div class="d-btns"><button class="btn pri" type="button" data-center>Centre map here</button><button class="btn" type="button" data-soon="Point download">Data ↓</button></div>
      <div class="src">Sample generator · ${SAMPLE_GRID_DEG}° grid · Updated ${hhmm(BASE)} UTC</div></div>`;
  el.hidden = false;
}

// ---- credits strip -------------------------------------------------------------------
function renderCredits(map) {
  const s = S.get('basemap');
  const parts = [CREDITS.sample];
  if (s === 'satellite') parts.push(...activeSatellite(map).map(x => x.credit));
  parts.push(CREDITS.vector, CREDITS.naturalEarth, CREDITS.maplibre);
  const el = $('#credits');
  el.innerHTML = parts.join(' · ');
  // chrome above the strip moves up if the credits wrap onto more lines
  document.documentElement.style.setProperty('--credits-h', el.offsetHeight + 'px');
}

// ---- scale bar -----------------------------------------------------------------------
function renderScale(map) {
  const lat = map.getCenter().lat, mpp = 40075016.686 * Math.cos(lat * Math.PI / 180) / (512 * Math.pow(2, map.getZoom()));
  const max = mpp * 100, pow = Math.pow(10, Math.floor(Math.log10(max))), d = max / pow;
  const nice = (d >= 5 ? 5 : d >= 2 ? 2 : 1) * pow, px = nice / mpp;
  $('#scale span').textContent = nice >= 1000 ? `${nice / 1000} km` : `${nice} m`;
  $('#scale i').style.width = px.toFixed(0) + 'px';
}

// ---- probe (desktop hover) -------------------------------------------------------------
function bindProbe(map) {
  const probe = $('#probe');
  let pending = null;
  map.on('mousemove', e => {
    if (mobile.matches) return;
    pending = e;
    requestAnimationFrame(() => {
      if (!pending) return;
      const { lngLat: { lng, lat }, point } = pending; pending = null;
      if (Math.abs(lat) > 85 || !current) { probe.hidden = true; return; }
      const [v, u, d] = reading(current, S.get('field'), lng, lat);
      probe.innerHTML = `<b>${v}${u ? ' ' + u : ''}</b><span>${d}</span><span>·</span><span>${fmtLat(lat).replace(/(\.\d)\d/, '$1')} ${fmtLon(lng).replace(/(\.\d)\d/, '$1')}</span>`;
      probe.style.left = point.x + 'px';
      probe.style.top = point.y + 'px';
      probe.hidden = false;
    });
  });
  map.getCanvas().addEventListener('mouseleave', () => { pending = null; probe.hidden = true; });
  map.on('movestart', () => { probe.hidden = true; });
}

// ---- boot ------------------------------------------------------------------------------
async function boot() {
  if (!window.maplibregl) { document.body.insertAdjacentHTML('beforeend', '<p class="noscript">The map library failed to load. Check your connection and reload.</p>'); return; }
  await loadScales();
  buildLayers();

  const map = new maplibregl.Map({
    container: 'map',
    style: buildStyle(S.get('basemap')),
    center: mobile.matches ? [10, 30] : [20, 22],
    zoom: mobile.matches ? 0.4 : 1.3,
    minZoom: 0, maxZoom: 18,
    hash: 'map',
    attributionControl: false,
    dragRotate: false, pitchWithRotate: false, touchPitch: false, maxPitch: 0,
    fadeDuration: 150
  });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  window.owmMap = map; // handy for debugging in the console

  bindChrome(map);
  initTimeline(BASE);
  bindProbe(map);

  const field = new FieldLayer(map);
  const particles = new Particles(map);

  // Frame + image for the first paint, fetched while the style loads.
  const light = () => S.get('basemap') === 'light';
  const first = Promise.all([getFrame(S.get('t')), getPixels(S.get('t'), S.get('field'), light())]);
  await new Promise(r => map.once('load', r));
  const [fr0, px0] = await first;
  field.add(px0);
  show(fr0);

  // One request in flight at a time; while scrubbing, only the latest wanted state is drawn.
  let busy = false, wanted = false;
  async function refresh() {
    if (busy) { wanted = true; return; }
    busy = true;
    do {
      wanted = false;
      const { t, field: k } = { t: S.get('t'), field: S.get('field') }, lt = light();
      const [fr, px] = await Promise.all([getFrame(t), getPixels(t, k, lt)]);
      field.setPixels(px); show(fr); // drawn even if superseded: scrubbing stays responsive
    } while (wanted);
    busy = false;
    if (S.get('playing')) getFrame((S.get('t') + 1) % (HOURS + 1)); // prefetch next hour
  }
  function show(fr) {
    current = fr;
    const k = S.get('field');
    field.setOverlays(fr, k, light());
    particles.setFrame(fr);
    particles.setColor(light() ? 'rgba(21,23,26,.55)' : k === 'cloud' ? 'rgba(255,215,150,.7)' : 'rgba(255,255,255,.75)');
    renderDetail(S.get());
  }

  S.on(['basemap'], s => { applyBasemap(map, s.basemap); renderCredits(map); });
  S.on(['t', 'field', 'basemap'], refresh, { now: false });
  S.on(['opacity', 'basemap'], s => field.setOpacity(s.opacity * (s.basemap === 'satellite' ? 0.6 : 1)));
  S.on(['particles'], s => particles.setEnabled(s.particles));
  S.on(['density'], s => particles.setDensity(s.density));
  S.on(['selection'], renderDetail);

  // Selection marker + detail panel on click / tap.
  let pin = null;
  map.on('click', e => {
    const { lng, lat } = e.lngLat;
    if (Math.abs(lat) > 85) return;
    S.set({ selection: { type: 'place', lon: lng, lat } });
  });
  S.on(['selection'], s => {
    pin?.remove(); pin = null;
    if (!s.selection) return;
    const el = document.createElement('div'); el.className = 'pin';
    pin = new maplibregl.Marker({ element: el }).setLngLat([s.selection.lon, s.selection.lat]).addTo(map);
    toggleLayersSheet(false); closePops();
  });
  $('#detail').addEventListener('click', e => {
    if (e.target.closest('[data-deselect]')) S.set({ selection: null });
    if (e.target.closest('[data-center]')) { const s = S.get('selection'); map.easeTo({ center: [s.lon, s.lat] }); }
  });

  map.on('moveend', () => { renderScale(map); if (S.get('basemap') === 'satellite') renderCredits(map); });
  addEventListener('resize', () => renderCredits(map));
  renderScale(map);
}

boot();
