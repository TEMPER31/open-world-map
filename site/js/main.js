// Open World Map: layout, basemaps, forecast fields, GPU wind particles, timeline.

import { CREDITS, SAMPLE_GRID_DEG } from './config.js';
import * as S from './state.js';
import { loadScales, FIELDS, ORDER, legendHTML, barHTML, rangeText, aqCategory, aqi2024 } from './scales.js';
import { sample } from './grid.js';
import { initData, meta, getGrid, getFieldTexture, getPressureOverlays, getWindTexture, getSeries } from './data.js';
import { buildStyle, applyBasemap, activeSatellite } from './basemaps.js';
import { FieldGL } from './field-gl.js';
import { WindGL } from './wind-gl.js';
import { initTimeline, relT, fmtUTC } from './timeline.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mobile = matchMedia('(max-width: 1023px)');

const hhmm = ms => new Date(ms).toISOString().slice(11, 16);
const runLabel = ms => `${new Date(ms).toISOString().slice(11, 13)}Z ${new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`;
let current = null; // {t, grids: {field: grid}} currently drawn on the map

const BASEMAPS = [['dark', 'Dark'], ['light', 'Light'], ['satellite', 'Satellite']];
const DENSITY = [[0.5, 'Low'], [1, 'Normal'], [1.6, 'High']];
const EVENTS = [['eq', 'Earthquakes M2.5+'], ['fi', 'Wildfires'], ['cy', 'Tropical cyclones'], ['st', 'Severe storms']];

// Labels that depend on whether real data is loaded.
const L = {
  fieldMeta: () => meta.live ? `GFS ${runLabel(meta.run)}` : `Sample · ${SAMPLE_GRID_DEG}°`,
  legendMeta: k => {
    const f = FIELDS[k];
    if (!meta.live) return f.mode === 'banded' ? `US EPA bands · sample · ${SAMPLE_GRID_DEG}° grid` : `${f.level} · sample · ${SAMPLE_GRID_DEG}° grid`;
    if (k === 'aq') return `US EPA 2024 bands · hourly · CAMS ${meta.aq?.grid?.deg ?? 4}°`;
    if (k === 'rain') return `past hour · GFS ${meta.gfs.grid.deg}°`;
    return `${f.level} · GFS ${k === 'wind' ? meta.gfs.wind_grid.deg : meta.gfs.grid.deg}°`;
  },
  foot: () => meta.live ? 'Weather: NOAA GFS · Air quality: CAMS via Open-Meteo<br>Basemap OpenFreeMap · OpenStreetMap · Natural Earth'
    : '<b>Weather is generated sample data.</b><br>Basemap OpenFreeMap · OpenStreetMap · Natural Earth',
  zone: () => meta.live ? `FORECAST · GFS ${runLabel(meta.run)}` : 'FORECAST · SAMPLE DATA'
};

// ---- formatting ----------------------------------------------------------------
const DIRS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
// GFS U/V give where the air moves TO; "from" is the opposite direction (meteorological convention).
const dirFrom = (u, v) => DIRS[Math.round(((Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360) / 22.5) % 16];
const fmtLat = la => `${Math.abs(la).toFixed(2)}°${la >= 0 ? 'N' : 'S'}`;
const fmtLon = lo => { lo = ((lo + 540) % 360) - 180; return `${Math.abs(lo).toFixed(2)}°${lo >= 0 ? 'E' : 'W'}`; };
const fmtCoord = (lo, la) => `${fmtLat(la)} ${fmtLon(lo)}`;

function reading(g, k, lo, la) {
  if (!g) return ['—', '', 'loading'];
  const v = sample(g.grid, g.data, lo, la);
  if (v !== v) return ['—', '', k === 'aq' ? 'no data' : ''];
  switch (k) {
    case 'wind': return [Math.round(v), 'km/h', `from ${dirFrom(sample(g.grid, g.u, lo, la), sample(g.grid, g.v, lo, la))}`];
    case 'temp': return [Math.round(v), '°C', 'at 2 m'];
    case 'rain': return v < 0.1 ? ['Dry', '', 'past hour'] : [v.toFixed(1), 'mm/h', 'past hour'];
    case 'aq': return [v < 10 ? v.toFixed(1) : Math.round(v), 'µg/m³', `${aqCategory(v)} · AQI ${aqi2024(v)}`];
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
    <div class="lsec" role="radiogroup" aria-label="Weather field"><div class="kick"><span>Field</span><span>${L.fieldMeta()}</span></div>
      ${ORDER.map(k => `<button class="row" type="button" role="radio" data-field="${k}"><span class="rad"></span><b>${FIELDS[k].label}</b><span class="v">${levelShort(FIELDS[k])}</span></button>`).join('')}
      <button class="row" type="button" role="radio" data-field="none"><span class="rad"></span><b>None</b><span class="v">map only</span></button>
      <div class="row" data-toggle><b>Wind particles</b><button class="tg" type="button" role="switch" data-particles aria-label="Wind particles"></button></div>
    </div>
    <div class="lsec"><div class="kick"><span>Events</span><span>Phase 5</span></div>
      ${EVENTS.map(([c, n]) => `<div class="row off" aria-disabled="true"><span class="sw ${c}"></span><b>${n}</b><span class="v soon">Soon</span><button class="tg" type="button" role="switch" aria-checked="false" aria-label="${n} (coming soon)" disabled></button></div>`).join('')}
    </div>
    <div class="lsec"><div class="kick"><span>Imagery</span><span>Phase 4</span></div>
      <div class="row off" aria-disabled="true"><span class="gdot"></span><b>Street photos</b><span class="v soon">Soon</span><button class="tg" type="button" role="switch" aria-checked="false" aria-label="Street photos (coming soon)" disabled></button></div>
    </div>
    <div class="lfoot">${L.foot()}</div>`;

  $('#lsheet').innerHTML = `
    <div class="ls-hd"><b>Map layers</b><button class="d-x" type="button" data-lyr-close aria-label="Close">×</button></div>
    <div class="grp"><div class="kick"><span>Field</span><span>${meta.live ? 'GFS · CAMS' : 'sample data'}</span></div>
      <div class="ftiles" role="radiogroup" aria-label="Weather field">${ORDER.map(k => `<button class="ftile" type="button" role="radio" data-field="${k}"><b>${FIELDS[k].short}</b>${barHTML(k, false)}<span>${FIELDS[k].unit}</span></button>`).join('')}<button class="ftile" type="button" role="radio" data-field="none"><b>None</b><div class="lg-bar"></div><span>map only</span></button></div></div>
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

// Header, banner and data popover copy for live vs sample data.
function renderStatus() {
  $$('[data-sample-only]').forEach(el => el.hidden = meta.live);
  $$('[data-live-only]').forEach(el => el.hidden = !meta.live);
  $$('[data-updated]').forEach(el => {
    el.textContent = `Updated ${hhmm(meta.generated)} UTC`;
    el.title = meta.live ? `GFS run ${runLabel(meta.run)} · data built ${new Date(meta.generated).toISOString().replace('.000', '')}` : 'Sample data generated in your browser';
  });
  const b = $('#stale');
  const msgs = [];
  if (!meta.live) msgs.push('Live forecast data is unavailable right now, so the map shows generated sample data.');
  else {
    const age = Math.round((Date.now() - meta.generated) / 3600e3);
    if (meta.stale) msgs.push(`Forecast data may be out of date: last updated ${fmtUTC(meta.generated)} (${age} h ago).`);
    if (meta.aqStale) msgs.push(meta.aq ? `Air quality is from ${fmtUTC(meta.aqGenerated)}.` : 'Air quality data is unavailable.');
  }
  b.textContent = msgs.join(' ');
  b.hidden = !msgs.length;
  if (meta.live) {
    $('[data-run]').textContent = runLabel(meta.run);
    $('[data-aq-run]').textContent = meta.aq ? fmtUTC(meta.aqGenerated) : 'unavailable';
  }
}

function bindChrome(map) {
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.field) {
      // the layer rows/tiles act as radios plus "None"; clicking the active one turns it off
      const toggle = t.matches('.row, .ftile') && t.dataset.field === S.get('field');
      S.set({ field: toggle ? 'none' : t.dataset.field });
    }
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
    $$('[data-lsum]').forEach(el => el.textContent = s.field === 'none' ? 'No layer' : `${FIELDS[s.field].short} · ${meta.live ? 'GFS' : 'sample'}`);
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
    if (!f) {
      $('#legend').innerHTML = '<div class="lg-h"><span>No layer</span><span>map only</span></div>';
      $('#mchip').innerHTML = 'No layer';
      return;
    }
    $('#legend').innerHTML = legendHTML(s.field, light, L.legendMeta(s.field));
    $('#mchip').innerHTML = `${f.short} ${f.unit}${barHTML(s.field, light)}${rangeText(s.field)}${meta.live ? '' : '<span class="sample-badge">Sample</span>'}`;
  });
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
function chartSVG(series, t) {
  if (!series?.length) return '<p class="src">Chart loading…</p>';
  const w = 310, h = 64, n = meta.hours || 1, x = t => (t / n * w).toFixed(1);
  const T = series.map(p => p.temp), W = series.map(p => p.wind);
  const tMin = Math.min(...T) - 1, tMax = Math.max(...T) + 1, wMax = Math.max(40, ...W);
  const y = v => (6 + (tMax - v) / (tMax - tMin) * (h - 26)).toFixed(1);
  const bw = Math.max(2.8, w / series.length - 2);
  const bars = series.map(p => `<rect x="${(p.t / n * w - bw / 2).toFixed(1)}" y="${(h - 14 - p.wind / wMax * 18).toFixed(1)}" width="${bw.toFixed(1)}" height="${(p.wind / wMax * 18).toFixed(1)}" fill="var(--mute)" opacity=".45"/>`).join('');
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${x(p.t)} ${y(p.temp)}`).join('');
  // temperature at the playhead, interpolated between series points
  const k = series.findIndex(p => p.t >= t), a = series[Math.max(0, k - 1)], b = series[Math.max(0, k)];
  const tt = k <= 0 ? series[k < 0 ? series.length - 1 : 0].temp : a.temp + (b.temp - a.temp) * (t - a.t) / ((b.t - a.t) || 1);
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Temperature and wind for the forecast period">${bars}
    <path d="${line}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
    <line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 12}" stroke="var(--accent)" stroke-width="1.5"/>
    <circle cx="${x(t)}" cy="${y(tt)}" r="3.5" fill="var(--accent)"/>
    <text x="0" y="${h - 1}" font-family="IBM Plex Mono" font-size="9.5" fill="var(--ink)">Now</text>
    <text x="${w / 2}" y="${h - 1}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">+${Math.round(n / 2)} h</text>
    <text x="${w}" y="${h - 1}" text-anchor="end" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">+${n} h</text></svg>`;
}

let detailGrids = null, detailSeries = null, detailKey = '';
async function loadDetail(s) {
  if (!s.selection) return;
  const { lon, lat } = s.selection, key = `${lon},${lat},${s.t}`;
  if (key === detailKey) return;
  detailKey = key;
  const [grids, series] = await Promise.all([
    Promise.all(ORDER.map(k => getGrid(s.t, k).catch(() => null))),
    detailSeries?.key === `${lon},${lat}` ? detailSeries : getSeries(lon, lat).then(v => Object.assign(v, { key: `${lon},${lat}` })).catch(() => [])
  ]);
  if (detailKey !== key) return;
  detailGrids = Object.fromEntries(ORDER.map((k, i) => [k, grids[i]]));
  detailSeries = series;
  renderDetail(S.get());
}

function renderDetail(s) {
  const el = $('#detail');
  document.body.classList.toggle('has-detail', !!s.selection);
  if (!s.selection) { el.hidden = true; detailKey = ''; return; }
  const { lon, lat } = s.selection, t = s.t;
  const stat = k => { const [v, u, d] = reading(detailGrids?.[k], k, lon, lat); return `<button class="stat${k === s.field ? ' on' : ''}" type="button" data-field="${k}" title="Show ${FIELDS[k].label}"><div class="l">${FIELDS[k].label}</div><div class="n">${v}<small>${u}</small></div><div class="l">${d}</div></button>`; };
  const note = meta.live
    ? `<div class="d-sec"><div class="src">NOAA GFS run ${runLabel(meta.run)} · air quality CAMS ${meta.aq ? fmtUTC(meta.aqGenerated) : 'unavailable'} · model values on a ${meta.gfs.grid.deg}° grid, not local observations</div></div>`
    : `<div class="d-sec"><div class="alert"><b>Sample data</b><span>Generated to test the layout. Not an observation or a forecast.</span></div></div>`;
  el.innerHTML = `
    <div class="d-hd"><button class="d-x" type="button" data-deselect aria-label="Close">×</button>
      <div class="kick">Place · ${meta.live ? 'GFS forecast' : 'sample data'}</div>
      <div class="d-title">${fmtCoord(lon, lat)}</div>
      <div class="d-sub"><span class="tag">${relT(t)}</span>${fmtUTC(meta.base + t * 3600e3)}</div></div>
    <div class="stats">${ORDER.map(stat).join('')}</div>
    <div class="d-sec"><div class="kick"><span>Forecast</span><span>— temp · ▮ wind</span></div>${chartSVG(detailSeries, t)}</div>
    ${note}
    <div class="d-ft"><div class="d-btns"><button class="btn pri" type="button" data-center>Centre map here</button><button class="btn" type="button" data-soon="Point download">Data ↓</button></div>
      <div class="src">${meta.live ? 'NOAA GFS · CAMS via Open-Meteo (CC BY 4.0)' : `Sample generator · ${SAMPLE_GRID_DEG}° grid`} · Updated ${hhmm(meta.generated)} UTC</div></div>`;
  el.hidden = false;
}

// ---- credits strip -------------------------------------------------------------------
function renderCredits(map) {
  const parts = meta.live ? [CREDITS.gfs, CREDITS.cams] : [CREDITS.sample];
  if (S.get('basemap') === 'satellite') parts.push(...activeSatellite(map).map(x => x.credit));
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
      const k = S.get('field');
      if (k === 'none' || Math.abs(lat) > 85 || !current?.grids[k] || current.t !== S.get('t')) { probe.hidden = true; return; }
      const [v, u, d] = reading(current.grids[k], k, lng, lat);
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
  await Promise.all([loadScales(), initData()]);
  buildLayers();
  renderStatus();

  const map = new maplibregl.Map({
    container: 'map',
    style: buildStyle(S.get('basemap')),
    center: mobile.matches ? [10, 30] : [-30, 35],
    zoom: mobile.matches ? 0.4 : 1.6,
    minZoom: 0, maxZoom: 18,
    hash: 'map',
    attributionControl: false,
    dragRotate: false, pitchWithRotate: false, touchPitch: false, maxPitch: 0,
    fadeDuration: 150
  });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  window.owmMap = map; // handy for debugging in the console and used by the test scripts

  bindChrome(map);
  S.set({ t: Math.min(S.get('t'), meta.hours) });
  initTimeline(meta.base, meta.hours, L.zone());
  $('[data-range]').textContent = `${meta.hours} h`;
  bindProbe(map);

  const field = new FieldGL();
  const wind = new WindGL({ count: particleCount() });
  function particleCount() { return Math.round((mobile.matches ? 12000 : 36000) * S.get('density')); }
  const light = () => S.get('basemap') === 'light';

  await new Promise(r => map.once('load', r));
  field.addTo(map);
  map.addLayer(wind, 'omt-road-minor'); // above the field, below roads, borders and labels
  window.owmWind = wind;
  // Read-only hooks for the accuracy and rendering tests (scripts/data/*.mjs).
  window.owmTest = { meta, getGrid, sample, reading, state: S, aqi2024, field };

  // Each part updates as soon as its own data is ready. One request per part is in flight;
  // while scrubbing, the newest wanted state runs next. Hidden parts do no work at all.
  function latest(run) {
    let busy = false, again = false;
    return async function go() {
      if (busy) { again = true; return; }
      busy = true;
      try { do { again = false; await run(); } while (again); } catch (e) { console.warn(e); toast('Could not load this hour of data.'); }
      busy = false;
    };
  }
  current = { t: -1, grids: {} };
  const updateField = latest(async () => {
    const t = S.get('t'), k = S.get('field');
    field.setVisible(k !== 'none');
    if (k === 'none') { field.setOverlays(null, light()); field.setIsobars(null); current = { t, grids: {} }; return; }
    const tex = await getFieldTexture(t, k);
    if (S.get('field') !== k) return;
    field.setData(tex);
    field.setIsobars(k === 'pres' ? FIELDS.pres : null, light());
    $('#legend').classList.toggle('unavailable', !!tex.missing);
    // probe values and pressure overlays follow without holding up the colours
    const [g, ov] = await Promise.all([getGrid(t, k), k === 'pres' ? getPressureOverlays(t) : null]);
    if (S.get('field') !== k) return;
    current = { t, grids: { [k]: g } };
    field.setOverlays(ov, light());
    const n = t + 1;
    if (n <= meta.hours) getFieldTexture(n, k).catch(() => {}); // prefetch the next hour
  });
  const updateWind = latest(async () => {
    if (!S.get('particles')) return;
    const t = S.get('t'), tex = await getWindTexture(t);
    wind.setWind(tex.rgba, tex.grid, tex.u, tex.v);
    if (t + 1 <= meta.hours) getWindTexture(t + 1).catch(() => {});
  });
  const windColour = () => wind.setColor(light() ? [0.08, 0.09, 0.1, 0.55] : S.get('field') === 'cloud' ? [1, 0.84, 0.59, 0.7] : [1, 1, 1, 0.75]);

  S.on(['basemap'], s => { applyBasemap(map, s.basemap); renderCredits(map); });
  S.on(['t', 'field'], updateField);
  S.on(['field', 'basemap'], s => { if (FIELDS[s.field]) field.setLut(s.field, light()); windColour(); });
  S.on(['basemap'], () => updateField(), { now: false }); // isobar ink follows the theme
  S.on(['t', 'particles'], updateWind);
  S.on(['opacity', 'basemap'], s => field.setOpacity(s.opacity * (s.basemap === 'satellite' ? 0.6 : 1)));
  S.on(['particles'], s => s.particles ? wind.start() : wind.stop());
  S.on(['density'], () => { wind.setCount(particleCount()); wind.kick(); }, { now: false });
  S.on(['selection', 't'], s => { renderDetail(s); loadDetail(s); });
  S.on(['field'], s => { if (s.selection) renderDetail(s); }, { now: false });

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
