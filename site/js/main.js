// Open World Map: layout, basemaps, forecast fields, GPU wind particles, timeline.

import { CREDITS, SAMPLE_GRID_DEG } from './config.js';
import * as S from './state.js';
import { loadScales, FIELDS, ORDER, legendHTML, barHTML, rangeText, aqCategory, aqi2024, toTemp, unitOf } from './scales.js';
import { setUnits, conv, label, PRESETS, presetOf, scaleBar } from './units.js';
import { initClock, stamp, layerTimes, getValidTime, onTime } from './clock.js';
import { sheet } from './sheet.js';
import { initMeasure } from './measure.js';
import { sample } from './grid.js';
import { initData, meta, stepTime, getGrid, getPoint, getFieldTexture, getPressureOverlays, getWindTexture, getSeries } from './data.js';
import { buildStyle, applyBasemap, activeSatellite } from './basemaps.js';
import { FieldGL } from './field-gl.js';
import { WindGL } from './wind-gl.js';
import { initTimeline, relT, fmtUTC, fmtBoth } from './timeline.js';
import { initPhotos, status as phStatus, credits as phCredits, hit as phHit, panelHTML as phPanel, photosTest } from './photos.js';
import { initEvents, TYPES as EV_TYPES, status as evStatus, credits as evCredits, hit as evHit, panelHTML as evPanel, sourceTimes as evSourceTimes, eventsTest } from './events.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mobile = matchMedia('(max-width: 1023px)');

const hhmm = ms => new Date(ms).toISOString().slice(11, 16);
const runLabel = ms => `${new Date(ms).toISOString().slice(11, 13)}Z ${new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}`;

const BASEMAPS = [['dark', 'Dark'], ['light', 'Light'], ['satellite', 'Satellite']];
const DENSITY = [[0.5, 'Low'], [1, 'Normal'], [1.6, 'High']];
const SEGS = {
  presets: ['preset', [['metric', 'Metric'], ['us', 'US'], ['custom', 'Custom']]],
  tunits: ['tunit', [['C', '°C'], ['F', '°F']]],
  sunits: ['sunit', [['kmh', 'km/h'], ['mph', 'mph'], ['ms', 'm/s'], ['kn', 'kn']]],
  dunits: ['dunit', [['km', 'km'], ['mi', 'mi']]],
  tfirsts: ['settfirst', [['local', 'Local'], ['utc', 'UTC']]],
  speeds: ['setspeed', [['1', '1×'], ['2', '2×'], ['4', '4×']]]
};
const segHTML = ([attr, opts]) => opts.map(([v, n]) => `<button type="button" role="radio" data-${attr}="${v}">${n}</button>`).join('');
// What each field's expanded section in the Layers rail says under its legend.
const FIELD_NOTE = {
  wind: () => 'Colours: speed at 10 m. Particles move with the wind.',
  temp: () => 'Air temperature 2 m above ground.',
  rain: () => 'Mean rate over the past hour (past 3 h after +5 days). Area average, about 50 km.',
  aq: () => `PM2.5, US EPA 2024 bands on hourly values.${meta.aqEnd ? ` ${aqEndText()}.` : ''}`,
  cloud: () => 'Total cloud cover, area average (about 50 km).',
  pres: () => 'Sea-level pressure. Isobars every 4 hPa; H and L mark highs and lows.'
};
const EV_SW = { eq: 'eq', fv: 'fi', st: 'st', ga: 'ga' };
// Events section (rail and phone sheet): a toggle per type, the 24 h / 7 d window and a status note.
const eventsHTML = () => `<div class="lsec ev" data-events><div class="kick"><span>Events</span><div class="seg" role="radiogroup" aria-label="Events shown">${[['24h', '24 h'], ['7d', '7 d']].map(([v, n]) => `<button type="button" role="radio" data-evwin="${v}">${n}</button>`).join('')}</div></div>
  ${EV_TYPES.map(([k, n, v]) => `<div class="row" data-toggle><span class="sw ${EV_SW[k]}"></span><b>${n}</b><span class="v" data-evs="${k}">${v}</span><button class="tg" type="button" role="switch" data-ev="${k}" aria-label="${n}"></button></div>`).join('')}
  <p class="lx-note" data-evnote></p></div>`;

const photosHTML = () => `<div class="lsec ev"><div class="kick"><span>Imagery</span><span>Mapillary</span></div>
  <div class="row" data-toggle><span class="gdot"></span><b>Street photos</b><span class="v" data-phs>CC BY-SA</span><button class="tg" type="button" role="switch" data-photos aria-label="Street photos"></button></div>
  <p class="lx-note" data-phnote>Green lines and dots: places with street-level photos. Zoom in and click a dot to see one.</p></div>`;

// Labels that depend on whether real data is loaded.
const L = {
  fieldMeta: () => meta.live ? `GFS ${runLabel(meta.run)}` : `Sample · ${SAMPLE_GRID_DEG}°`,
  legendMeta: k => {
    const f = FIELDS[k];
    if (!meta.live) return f.mode === 'banded' ? `US EPA bands · sample · ${SAMPLE_GRID_DEG}° grid` : `${f.level} · sample · ${SAMPLE_GRID_DEG}° grid`;
    if (k === 'aq') return `US EPA 2024 bands · hourly · CAMS ${meta.aq?.grid?.deg ?? 4}°`;
    if (k === 'rain') return `${rainSpan()} · GFS ${meta.gfs.grid.deg}°`;
    return `${f.level} · GFS ${k === 'wind' ? meta.gfs.wind_grid.deg : meta.gfs.grid.deg}°`;
  },
  foot: () => meta.live ? 'Weather: NOAA GFS · Air quality: CAMS via Open-Meteo<br>Basemap OpenFreeMap · OpenStreetMap · Natural Earth'
    : '<b>Weather is generated sample data.</b><br>Basemap OpenFreeMap · OpenStreetMap · Natural Earth',
  zone: () => meta.live ? `FORECAST · GFS ${runLabel(meta.run)}` : 'FORECAST · SAMPLE DATA'
};

// ---- formatting ----------------------------------------------------------------
// Rain is the mean rate over the hour before each frame, or the 3 hours before after f120.
const rainSpan = (t = S.get('t')) => meta.rainHours(t) >= 3 ? 'past 3 h' : 'past hour';
// Air quality (CAMS) ends ~5 days out, before the weather does.
const aqEnded = (t = S.get('t')) => meta.live && meta.aqEnd != null && meta.base + t * 3600e3 > meta.aqEnd + 90 * 60e3;
const aqEndText = () => `Air quality forecast ends ${fmtUTC(meta.aqEnd)}`;
const DIRS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
// GFS U/V give where the air moves TO; "from" is the opposite direction (meteorological convention).
const dirFrom = (u, v) => DIRS[Math.round(((Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360) / 22.5) % 16];
const fmtLat = la => `${Math.abs(la).toFixed(2)}°${la >= 0 ? 'N' : 'S'}`;
const fmtLon = lo => { lo = ((lo + 540) % 360) - 180; return `${Math.abs(lo).toFixed(2)}°${lo >= 0 ? 'E' : 'W'}`; };
const fmtCoord = (lo, la) => `${fmtLat(la)} ${fmtLon(lo)}`;

// [value, unit, description] for a point value p = {v, u, w, aqi} (from getPoint).
// Cloud cover and rain are stored as area averages (a 3x3 tent over the 0.25° points, about
// 50 km across), which is what the colours show, so they are labelled as such: a single 0.25°
// point can differ by 25 % or more where clouds are patchy.
function readingOf(k, p) {
  if (p === undefined) return ['—', '', 'loading'];
  const v = p ? p.v : NaN;
  if (v !== v) return ['—', '', k === 'aq' ? (aqEnded() ? `forecast ends ${fmtUTC(meta.aqEnd, { weekday: false })}` : 'no data') : ''];
  switch (k) {
    case 'wind': return [Math.round(conv('speed', v)), label('speed'), `from ${dirFrom(p.u, p.w)}`];
    case 'temp': return [Math.round(toTemp(v)), unitOf('temp'), 'at 2 m'];
    case 'rain': return v < 0.1 ? ['Dry', '', `${rainSpan()} · area avg`] : [v.toFixed(1), 'mm/h', `${rainSpan()} · area avg`];
    case 'aq': {
      // Category from the hourly PM2.5 (what the colours show). The AQI number follows EPA's
      // definition (24-hour mean): Open-Meteo's us_aqi, which the CI check matched to the 2024
      // table on 24-h means. Without it, the hourly-based value is shown and labelled so.
      const a = p.aqi ?? NaN;
      return [v < 10 ? v.toFixed(1) : Math.round(v), 'µg/m³', `${aqCategory(v)} · ${a === a ? `AQI ${Math.round(a)} (24 h)` : `AQI ${aqi2024(v)} (hourly)`}`];
    }
    case 'cloud': return [Math.round(v), '%', 'area average'];
    case 'pres': return [Math.round(v), 'hPa', 'sea level'];
  }
}

// The same from a whole grid (used by the test scripts through window.owmTest).
function reading(g, k, lo, la) {
  if (!g) return readingOf(k, undefined);
  const p = { v: sample(g.grid, g.data, lo, la) };
  if (g.u) { p.u = sample(g.grid, g.u, lo, la); p.w = sample(g.grid, g.v, lo, la); }
  if (g.aqi) p.aqi = sample(g.grid, g.aqi, lo, la);
  return readingOf(k, p);
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
      ${ORDER.map(k => `<button class="row" type="button" role="radio" data-field="${k}"><span class="rad"></span><b>${FIELDS[k].label}</b><span class="v">${levelShort(FIELDS[k])}</span></button><div class="lx" data-lx="${k}" hidden><div class="lx-lg"></div>${k === 'temp' ? `<div class="seg" role="radiogroup" aria-label="Temperature unit">${segHTML(SEGS.tunits)}</div>` : k === 'wind' ? `<div class="seg" role="radiogroup" aria-label="Wind speed unit">${segHTML(SEGS.sunits)}</div>` : ''}<p class="lx-note">${FIELD_NOTE[k]()}</p></div>`).join('')}
      <button class="row" type="button" role="radio" data-field="none"><span class="rad"></span><b>None</b><span class="v">map only</span></button>
      <div class="row" data-toggle><b>Wind particles</b><button class="tg" type="button" role="switch" data-particles aria-label="Wind particles"></button></div>
    </div>
    ${eventsHTML()}
    ${photosHTML()}
    <div class="lfoot">${L.foot()}</div>`;

  $('#lsheet').innerHTML = `
    <div class="ls-hd"><b>Map layers</b><button class="d-x" type="button" data-lyr-close aria-label="Close">×</button></div>
    <div class="grp"><div class="kick"><span>Field</span><span>${meta.live ? 'GFS · CAMS' : 'sample data'}</span></div>
      <div class="ftiles" role="radiogroup" aria-label="Weather field">${ORDER.map(k => `<button class="ftile" type="button" role="radio" data-field="${k}"><b>${FIELDS[k].short}</b>${barHTML(k, false)}<span data-unit="${k}">${unitOf(k)}</span></button>`).join('')}<button class="ftile" type="button" role="radio" data-field="none"><b>None</b><div class="lg-bar"></div><span>map only</span></button></div>
      <div class="ls-lg"></div></div>
    <div class="grp"><div class="kick"><span>Basemap</span><span></span></div>
      <div class="card"><div class="it">Map<div class="seg" role="radiogroup" aria-label="Basemap" data-basemaps></div></div></div></div>
    <div class="grp"><div class="card">
      <div class="it">Wind particles<button class="tg" type="button" role="switch" data-particles aria-label="Wind particles"></button></div>
    </div></div>
    <div class="grp">${eventsHTML()}</div>
    <div class="grp">${photosHTML()}</div>`;

  $$('[data-basemaps]').forEach(g => g.innerHTML = BASEMAPS.map(([v, n]) => `<button type="button" role="radio" data-basemap="${v}">${n}</button>`).join(''));
  $('[data-density]').innerHTML = DENSITY.map(([v, n]) => `<button type="button" role="radio" data-dens="${v}">${n}</button>`).join('');
  for (const k in SEGS) $$(`[data-${k}]`).forEach(el => el.innerHTML = segHTML(SEGS[k]));
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
    else if (t.dataset.ev) S.set({ events: { ...S.get('events'), [t.dataset.ev]: !S.get('events')[t.dataset.ev] } });
    else if (t.dataset.evwin) S.set({ evWin: t.dataset.evwin });
    else if ('photos' in t.dataset) S.set({ photos: !S.get('photos') });
    else if (t.dataset.dens) S.set({ density: +t.dataset.dens });
    else if (t.dataset.tunit) S.set({ tempUnit: t.dataset.tunit });
    else if (t.dataset.sunit) S.set({ speedUnit: t.dataset.sunit });
    else if (t.dataset.dunit) S.set({ distUnit: t.dataset.dunit });
    else if (t.dataset.preset) { const p = PRESETS[t.dataset.preset]; if (p) S.set({ tempUnit: p.temp, speedUnit: p.speed, distUnit: p.dist }); }
    else if (t.dataset.settfirst) S.set({ timeFirst: t.dataset.settfirst });
    else if (t.dataset.setspeed) S.set({ speed: +t.dataset.setspeed });
    else if ('measure' in t.dataset) S.set({ measuring: !S.get('measuring'), selection: null });
    else if ('particles' in t.dataset) S.set({ particles: !S.get('particles') });
    else if ('lmin' in t.dataset) S.set({ layersMin: !S.get('layersMin') });
    else if (t.dataset.soon) toast(`${t.dataset.soon} arrives in a later phase.`);
    else if (t.dataset.open) togglePop(t.dataset.open);
    else if ('close' in t.dataset) closePops();
    else if ('lyr' in t.dataset) toggleLayersSheet();
    else if ('lyrTab' in t.dataset) { toggleLayersSheet(true); $('#lsheet [data-events]').scrollIntoView({ block: 'nearest' }); }
    else if ('lyrClose' in t.dataset) toggleLayersSheet(false);
    else if (t.dataset.zoom) t.dataset.zoom > 0 ? map.zoomIn() : map.zoomOut();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePops(); toggleLayersSheet(false); S.set({ selection: null }); $('#probe').hidden = true; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toast('Search arrives in a later phase.'); }
  });
  const op = $('#set-opacity');
  op.value = Math.round(S.get('opacity') * 100);
  op.addEventListener('input', () => S.set({ opacity: op.value / 100 }));

  // The legend is one element, shown where it is read: inside the selected field's section of the
  // Layers rail, floating over the map when the rail is minimised, in the layers sheet on phones.
  const placeLegend = () => {
    const lg = $('#legend'), k = S.get('field');
    const host = mobile.matches ? $('.ls-lg') : S.get('layersMin') || !FIELDS[k] ? $('#app') : $(`[data-lx="${k}"] .lx-lg`);
    if (lg.parentNode !== host) host.prepend(lg);
    lg.classList.toggle('docked', host !== $('#app'));
  };
  mobile.addEventListener('change', placeLegend);
  S.on(['field', 'layersMin'], s => {
    $$('[data-lx]').forEach(el => el.hidden = el.dataset.lx !== s.field);
    placeLegend();
  });
  S.on(['field'], s => {
    $$('[data-field]').forEach(el => {
      const on = el.dataset.field === s.field;
      el.classList.toggle('on', on && el.classList.contains('row'));
      el.setAttribute('aria-checked', String(on));
    });
    $$('[data-lsum]').forEach(el => el.textContent = s.field === 'none' ? 'No layer' : `${FIELDS[s.field].short} · ${meta.live ? 'GFS' : 'sample'}`);
  });
  S.on(['events', 'evWin'], s => {
    $$('[data-ev]').forEach(el => { const on = !!s.events[el.dataset.ev]; el.classList.toggle('on', on); el.setAttribute('aria-checked', String(on)); });
    $$('[data-evwin]').forEach(el => el.setAttribute('aria-checked', String(el.dataset.evwin === s.evWin)));
    renderEvStatus();
  });
  S.on(['photos'], s => { $$('[data-photos]').forEach(el => { el.classList.toggle('on', s.photos); el.setAttribute('aria-checked', String(s.photos)); }); renderPhStatus(); });
  S.on(['basemap'], s => $$('[data-basemap]').forEach(el => el.setAttribute('aria-checked', String(el.dataset.basemap === s.basemap))));
  // One units setting for the whole page: probe, place panel, chart, legends, scale bar, measure.
  S.on(['tempUnit', 'speedUnit', 'distUnit'], s => {
    const u = { temp: s.tempUnit, speed: s.speedUnit, dist: s.distUnit };
    setUnits(u);
    const radio = (attr, v) => $$(`[data-${attr}]`).forEach(el => el.closest('.seg') && el.setAttribute('aria-checked', String(el.dataset[attr] === v)));
    radio('tunit', s.tempUnit); radio('sunit', s.speedUnit); radio('dunit', s.distUnit); radio('preset', presetOf(u));
    $$('[data-unit]').forEach(el => el.textContent = unitOf(el.dataset.unit));
  });
  S.on(['timeFirst'], s => $$('[data-settfirst]').forEach(el => el.setAttribute('aria-checked', String(el.dataset.settfirst === s.timeFirst))));
  S.on(['speed'], s => $$('[data-setspeed]').forEach(el => el.setAttribute('aria-checked', String(+el.dataset.setspeed === s.speed))));
  S.on(['density'], s => $$('[data-dens]').forEach(el => el.setAttribute('aria-checked', String(+el.dataset.dens === s.density))));
  S.on(['particles'], s => $$('[data-particles]').forEach(el => { el.classList.toggle('on', s.particles); el.setAttribute('aria-checked', String(s.particles)); }));
  S.on(['layersMin'], s => {
    $('#layers').classList.toggle('min', s.layersMin);
    const b = $('[data-lmin]');
    b.setAttribute('aria-expanded', String(!s.layersMin));
    b.setAttribute('aria-label', s.layersMin ? 'Expand layers' : 'Minimise layers');
  });
  let legendKey = '';
  S.on(['field', 'basemap', 'tempUnit', 'speedUnit', 't'], s => {
    const light = s.basemap === 'light', f = FIELDS[s.field];
    // only rebuild when something shown changes (rain's span and the AQ end state follow t)
    const key = [s.field, s.basemap, s.tempUnit, s.speedUnit, s.field === 'rain' ? rainSpan(s.t) : '', s.field === 'aq' ? aqEnded(s.t) : ''].join();
    if (key === legendKey) return;
    legendKey = key;
    if (!f) {
      $('#legend').innerHTML = '<div class="lg-h"><span>No layer</span><span>map only</span></div>';
      $('#mchip').innerHTML = 'No layer';
      return;
    }
    $('#legend').innerHTML = legendHTML(s.field, light, L.legendMeta(s.field));
    const ended = s.field === 'aq' && aqEnded(s.t);
    $('#legend').classList.toggle('ended', ended);
    $('#legend').dataset.msg = ended ? aqEndText() : 'No data for this hour';
    $('#legend').title = s.field === 'aq' ? 'PM2.5 categories use the US EPA breakpoints revised in May 2024. EPA defines them for 24-hour averages; this map applies them to hourly forecast values.' : '';
    $('#mchip').innerHTML = `${f.short} ${unitOf(s.field)}${barHTML(s.field, light)}${rangeText(s.field)}${meta.live ? '' : '<span class="sample-badge">Sample</span>'}`;
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
// t: playhead; nowTemp: the panel's own temperature at t (°C, 0.5° grid) so the chart's playhead
// dot shows the same number as the panel (the line itself comes from a coarser 3° file).
function chartSVG(series, t, nowTemp) {
  if (!series?.length) return '<p class="src">Chart loading…</p>';
  const w = 310, h = 74, L = 26, n = meta.hours || 1, x = t => (L + t / n * (w - L)).toFixed(1);
  // day boundaries (UTC midnight) with short day names
  let days = '';
  for (let d = 1; d < n; d++) {
    const at = new Date(meta.base + d * 3600e3);
    if (at.getUTCHours()) continue;
    days += `<line x1="${x(d)}" x2="${x(d)}" y1="2" y2="${h - 14}" stroke="var(--line2)" stroke-width="1"/>`;
    if (d > 6 && d < n - 10) days += `<text x="${(+x(d) + 2).toFixed(1)}" y="9" font-family="IBM Plex Mono" font-size="8.5" fill="var(--faint)">${at.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })}</text>`;
  }
  series = series.map(p => ({ ...p, temp: toTemp(p.temp), wind: conv('speed', p.wind) }));
  const T = series.map(p => p.temp), W = series.map(p => p.wind);
  const tMin = Math.floor(Math.min(...T) - 1), tMax = Math.ceil(Math.max(...T) + 1), wMax = Math.max(conv('speed', 40), ...W);
  const y = v => (6 + (tMax - v) / (tMax - tMin) * (h - 26)).toFixed(1);
  const bw = Math.max(2.8, (w - L) / series.length - 2);
  const bars = series.map(p => `<rect x="${(+x(p.t) - bw / 2).toFixed(1)}" y="${(h - 14 - p.wind / wMax * 18).toFixed(1)}" width="${bw.toFixed(1)}" height="${(p.wind / wMax * 18).toFixed(1)}" fill="var(--mute)" opacity=".45"/>`).join('');
  const line = series.map((p, i) => `${i ? 'L' : 'M'}${x(p.t)} ${y(p.temp)}`).join('');
  // temperature at the playhead: the panel's value, else interpolated between series points
  const k = series.findIndex(p => p.t >= t), a = series[Math.max(0, k - 1)], b = series[Math.max(0, k)];
  const tt = nowTemp != null && nowTemp === nowTemp ? toTemp(nowTemp) : k <= 0 ? series[k < 0 ? series.length - 1 : 0].temp : a.temp + (b.temp - a.temp) * (t - a.t) / ((b.t - a.t) || 1);
  const ax = (v, yy, anchor = 'end', fill = 'var(--mute)') => `<text x="${L - 4}" y="${yy}" text-anchor="${anchor}" font-family="IBM Plex Mono" font-size="8.5" fill="${fill}">${v}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Temperature (${label('temp')}) and wind (${label('speed')}) for the forecast period" data-chart-t="${t}">${days}${bars}
    ${ax(tMax + '°', 12)}${ax(tMin + '°', h - 20)}
    <path d="${line}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
    <line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${h - 12}" stroke="var(--accent)" stroke-width="1.5"/>
    <circle cx="${x(t)}" cy="${Math.max(2, Math.min(h - 14, y(tt)))}" r="3.5" fill="var(--accent)"/>
    <text x="${L}" y="${h - 1}" font-family="IBM Plex Mono" font-size="9.5" fill="var(--ink)">Now</text>
    <text x="${(L + w) / 2}" y="${h - 1}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">${relT(Math.round(n / 2))}</text>
    <text x="${w}" y="${h - 1}" text-anchor="end" font-family="IBM Plex Mono" font-size="9.5" fill="var(--mute)">${relT(n)}</text></svg>`;
}

let detailVals = null, detailSeries = null, detailKey = '', placeSheet = null;
// Each value appears as soon as its own file is ready (the field on screen is already loaded,
// so it shows at once) instead of waiting for all six downloads.
let detailFrame = 0;
const redrawDetail = () => { detailFrame ||= requestAnimationFrame(() => { detailFrame = 0; renderDetail(S.get()); }); };
function loadDetail(s) {
  if (s.selection?.type !== 'place') return;
  const { lon, lat } = s.selection, key = `${lon},${lat},${s.t}`, place = `${lon},${lat}`;
  if (key === detailKey) return;
  detailKey = key;
  const vals = detailVals = {};
  for (const k of [s.field, ...ORDER.filter(k => k !== s.field)].filter(k => FIELDS[k])) {
    getPoint(s.t, [k], lon, lat).then(p => p[k], () => null).then(v => {
      if (detailKey === key) { vals[k] = v; redrawDetail(); }
    });
  }
  if (detailSeries?.key !== place) {
    detailSeries = null;
    getSeries(lon, lat).catch(() => []).then(v => {
      if (S.get('selection')?.lon === lon && S.get('selection')?.lat === lat) { detailSeries = Object.assign(v, { key: place }); redrawDetail(); }
    });
  }
}

function renderDetail(s) {
  const el = $('#detail'), body = $('#detail .d-body');
  document.body.classList.toggle('has-detail', !!s.selection);
  if (!s.selection) { el.hidden = true; detailKey = ''; stamp('panel', null); stamp('chart', null); return; }
  if (s.selection.type !== 'place') { // event or photo: same panel / sheet, last click wins
    const html = s.selection.type === 'photo' ? phPanel(s.selection.id) : evPanel(s.selection.id);
    if (!html) { S.set({ selection: null }); return; }
    body.innerHTML = html; el.hidden = false; detailKey = ''; stamp('panel', null); stamp('chart', null);
    return;
  }
  const { lon, lat } = s.selection, t = s.t;
  const all = detailVals && ORDER.every(k => k in detailVals);
  const stat = k => { const [v, u, d] = readingOf(k, detailVals && k in detailVals ? detailVals[k] : undefined); return `<button class="stat${k === s.field ? ' on' : ''}" type="button" data-field="${k}" title="Show ${FIELDS[k].label}"><div class="l">${FIELDS[k].label}</div><div class="n">${v}<small>${u}</small></div><div class="l">${d}</div></button>`; };
  const note = meta.live
    ? `<div class="d-sec"><div class="src">NOAA GFS run ${runLabel(meta.run)} · air quality CAMS ${meta.aq ? fmtUTC(meta.aqGenerated) : 'unavailable'} </div><div class="src">Model values on a ~50 km grid; mountains and coasts can differ from local conditions. Forecasts become less certain beyond about 3 days.</div></div>`
    : `<div class="d-sec"><div class="alert"><b>Sample data</b><span>Generated to test the layout. Not an observation or a forecast.</span></div></div>`;
  body.innerHTML = `
    <div class="d-hd"><button class="d-x" type="button" data-deselect aria-label="Close (Esc)" title="Close (Esc)">×</button>
      <div class="kick">Place · ${meta.live ? 'GFS forecast' : 'sample data'}</div>
      <div class="d-title">${fmtCoord(lon, lat)}</div>
      <div class="d-name">Place name <span class="soon">Coming soon</span></div>
      <div class="d-sub" data-panel-t="${t}"><span class="tag">${relT(t)}</span><span class="mono">${fmtBoth(meta.base + t * 3600e3)}</span></div></div>
    <div class="stats">${ORDER.map(stat).join('')}</div>
    <div class="d-sec"><div class="kick"><span>Forecast</span><span>— temp ${label('temp')} · ▮ wind ${label('speed')}</span></div>${chartSVG(detailSeries, t, detailVals?.temp?.v)}</div>
    ${note}
    <div class="d-ft"><div class="d-btns"><button class="btn pri" type="button" data-center>Centre map here</button><button class="btn" type="button" data-soon="Point download">Data ↓</button></div>
      <div class="src">${meta.live ? 'NOAA GFS · CAMS via Open-Meteo (CC BY 4.0)' : `Sample generator · ${SAMPLE_GRID_DEG}° grid`} · Updated ${hhmm(meta.generated)} UTC</div></div>`;
  el.hidden = false;
  // the panel counts as drawn for this hour once every value has arrived
  stamp('panel', all ? t : -1); stamp('chart', detailSeries ? t : -1);
}

// ---- events status (counts, unavailable / none active, source update times) --------------
function renderEvStatus() {
  const notes = [];
  for (const [k, , v] of EV_TYPES) {
    const st = evStatus(k);
    $$(`[data-evs="${k}"]`).forEach(el => { el.textContent = st ? st.text : v; el.classList.toggle('bad', st?.text === 'unavailable'); });
    if (st?.note && st.note !== 'loading') notes.push(st.note);
  }
  if (evSourceTimes()) notes.push(evSourceTimes() + '.');
  const on = Object.values(S.get('events')).some(Boolean);
  $$('[data-evnote]').forEach(el => el.textContent = on ? [`Events from the past ${S.get('evWin') === '24h' ? '24 hours' : '7 days'}; storm forecasts follow the timeline.`, ...notes].join(' ') : 'Events from the past 7 days. Turn a type on to load it.');
}

function renderPhStatus() {
  const st = phStatus();
  const bad = st === 'unavailable' || st === 'down';
  $$('[data-phs]').forEach(el => { el.textContent = bad ? 'unavailable' : st === '…' ? '…' : 'CC BY-SA'; el.classList.toggle('bad', bad); });
  $$('[data-phnote]').forEach(el => el.textContent = st === 'down' ? 'Street photos: unavailable right now. Mapillary is not accepting requests from this site at the moment (its daily limit may be reached); turn the layer off and on to try again later.'
    : st === 'unavailable' ? 'Street photos: unavailable (no Mapillary access token is configured for this site).' : 'Green lines and dots: places with street-level photos. Zoom in and click a dot to see one.');
}

// ---- credits strip -------------------------------------------------------------------
function renderCredits(map) {
  const parts = meta.live ? [CREDITS.gfs, CREDITS.cams] : [CREDITS.sample];
  parts.push(...evCredits(), ...phCredits());
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
  const [text, px] = scaleBar(mpp);
  $('#scale span').textContent = text;
  $('#scale i').style.width = px.toFixed(0) + 'px';
}

// ---- probe (desktop hover) -------------------------------------------------------------
function bindProbe(map) {
  // Values come from the worker (a few bytes per move); one lookup is in flight at a time and
  // the newest mouse position runs next. It also refreshes when the hour or field changes, so
  // the probe never shows another hour than the map.
  const probe = $('#probe');
  let pending = null, last = null, busy = false, left = true;
  const hide = () => { probe.hidden = true; stamp('probe', null); };
  async function show() {
    if (busy || !pending) return;
    const { lngLat: { lng, lat }, point } = pending; pending = null;
    const k = S.get('field'), t = S.get('t');
    if (k === 'none' || Math.abs(lat) > 85 || S.get('measuring')) { hide(); return; }
    busy = true;
    const p = await getPoint(t, [k], lng, lat).catch(() => null);
    busy = false;
    if (p && S.get('field') === k && S.get('t') === t && !left) {
      const [v, u, d] = readingOf(k, p[k]);
      probe.innerHTML = `<b>${v}${u ? ' ' + u : ''}</b><span>${d}</span><small>${fmtLat(lat).replace(/(\.\d)\d/, '$1')} ${fmtLon(lng).replace(/(\.\d)\d/, '$1')} · ${fmtBoth(meta.base + t * 3600e3, undefined, { date: false })}</small>`;
      probe.dataset.t = t;
      probe.style.left = point.x + 'px';
      probe.style.top = point.y + 'px';
      probe.hidden = false;
      stamp('probe', t);
    }
    if (pending) requestAnimationFrame(show);
  }
  map.on('mousemove', e => {
    if (mobile.matches) return;
    left = false;
    pending = last = e;
    requestAnimationFrame(show);
  });
  S.on(['t', 'field', 'tempUnit', 'speedUnit', 'timeFirst'], () => { if (last && !left) { pending = last; show(); } }, { now: false });
  map.getCanvas().addEventListener('mouseleave', () => { pending = null; left = true; hide(); });
  map.on('movestart', hide);
}

// ---- boot ------------------------------------------------------------------------------
async function boot() {
  if (!window.maplibregl) { document.body.insertAdjacentHTML('beforeend', '<p class="noscript">The map library failed to load. Check your connection and reload.</p>'); return; }
  // The basemap starts loading at once; forecast data and scales load alongside it.
  const dataReady = Promise.all([loadScales(), initData()]);
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
  const mapLoaded = new Promise(r => map.once('load', r));
  await dataReady;
  window.owmMap = map; // handy for debugging in the console and used by the test scripts
  performance.mark('owm:data-ready');
  setUnits({ temp: S.get('tempUnit'), speed: S.get('speedUnit'), dist: S.get('distUnit') });
  buildLayers();
  renderStatus();

  bindChrome(map);
  initClock({ base: meta.base, snap: stepTime });
  S.set({ t: stepTime(Math.min(S.get('t'), meta.hours), 0) });
  // last hourly frame: from here on frames are 3 hours apart
  const ci = meta.times.findIndex((t, i) => i && t - meta.times[i - 1] > 1);
  initTimeline({ base: meta.base, times: meta.times, stepTime, coarseFrom: ci > 0 ? meta.times[ci - 1] : null, zone: L.zone(), uncertainFrom: meta.hours > 72 ? 72 : null,
    fh: t => meta.live ? meta.first + t : null });
  // phone sheets: place panel peek / half / full; layers half / full (half <= 40 % of the map)
  placeSheet = sheet($('#detail'), ['peek', 'half', 'full'], s => {
    document.body.dataset.place = s;
    // phones: keep the chosen place in view above the sheet and the scrubber
    const sel = S.get('selection');
    if (!mobile.matches || !sel || s === 'full') return;
    requestAnimationFrame(() => {
      const top = $('.m-scrub').getBoundingClientRect().top, y = map.project([sel.lon, sel.lat]).y;
      if (y > top - 40) map.panBy([0, y - top / 2]);
    });
  });
  const layersSheet = sheet($('#lsheet'), ['half', 'full']);
  const sheets = { place: placeSheet, layers: layersSheet };
  S.on(['t'], s => { const nx = stepTime(s.t, 1); $$('[data-stepsize]').forEach(el => el.textContent = `${nx > s.t ? nx - s.t : (s.t - stepTime(s.t, -1)) || 1} h step`); });
  bindProbe(map);

  const field = new FieldGL();
  const wind = new WindGL({ count: particleCount() });
  function particleCount() { return Math.round((mobile.matches ? 12000 : 36000) * S.get('density')); }
  const light = () => S.get('basemap') === 'light';

  await mapLoaded;
  field.addTo(map);
  map.addLayer(wind, 'omt-road-minor'); // above the field, below roads, borders and labels
  window.owmWind = wind;
  // Read-only hooks for the accuracy and rendering tests (scripts/data/*.mjs).
  const measure = initMeasure(map);
  const changed = () => { renderEvStatus(); renderPhStatus(); renderCredits(map); const s = S.get(); if (s.selection && s.selection.type !== 'place') renderDetail(s); };
  initEvents(map, changed);
  initPhotos(map, changed);
  window.owmTest = { meta, getGrid, sample, reading, state: S, aqi2024, field, stepTime, layerTimes, getValidTime, measure, sheets, events: eventsTest, photos: photosTest };
  // Public time API for future layers (events, Phase 5): see clock.js.
  window.owmClock = { onTime, getValidTime, layerTimes };

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
  const updateField = latest(async () => {
    const t = S.get('t'), k = S.get('field');
    field.setVisible(k !== 'none');
    if (k === 'none') { field.setOverlays(null, light()); field.setIsobars(null); for (const l of ['field', 'isobars', 'hl']) stamp(l, null); return; }
    const tex = await getFieldTexture(t, k);
    if (S.get('field') !== k) return;
    field.setData(tex);
    field.setIsobars(k === 'pres' ? FIELDS.pres : null, light());
    // the field shader draws the isobars from the same texture, so they share its time
    stamp('field', t); stamp('isobars', k === 'pres' ? t : null);
    if (!firstPaint) { firstPaint = true; map.once('render', () => performance.mark('owm:first-field')); }
    $('#legend').classList.toggle('unavailable', !!tex.missing);
    // pressure H/L labels follow without holding up the colours
    if (k === 'pres') stamp('hl', -1);
    const ov = k === 'pres' ? await getPressureOverlays(t) : null;
    if (S.get('field') !== k) return;
    field.setOverlays(ov, light());
    stamp('hl', k === 'pres' ? t : null);
    // prefetch the next 2 frames
    for (const n of [stepTime(t, 1), stepTime(stepTime(t, 1), 1)]) if (n > t) getFieldTexture(n, k).catch(() => {});
  });
  let firstPaint = false;
  const updateWind = latest(async () => {
    if (!S.get('particles')) { stamp('wind', null); return; }
    const t = S.get('t'), tex = await getWindTexture(t);
    wind.setWind(tex.rgba, tex.grid, tex.u, tex.v);
    stamp('wind', t);
    for (const n of [stepTime(t, 1), stepTime(stepTime(t, 1), 1)]) if (n > t) getWindTexture(n).catch(() => {});
  });
  // Particles are thin and partly transparent so the field and labels read through them.
  const windColour = () => wind.setColor(light() ? [0.08, 0.09, 0.1, 0.42] : S.get('field') === 'cloud' ? [1, 0.84, 0.59, 0.55] : [1, 1, 1, 0.58]);

  S.on(['basemap'], s => { applyBasemap(map, s.basemap); renderCredits(map); });
  S.on(['t', 'field'], updateField);
  S.on(['field', 'basemap'], s => { if (FIELDS[s.field]) field.setLut(s.field, light()); windColour(); });
  S.on(['basemap'], () => updateField(), { now: false }); // isobar ink follows the theme
  S.on(['t', 'particles'], updateWind);
  S.on(['opacity', 'basemap'], s => field.setOpacity(s.opacity * (s.basemap === 'satellite' ? 0.6 : 1)));
  S.on(['particles'], s => s.particles ? wind.start() : wind.stop());
  S.on(['density'], () => { wind.setCount(particleCount()); wind.kick(); }, { now: false });
  S.on(['selection', 't'], s => { loadDetail(s); renderDetail(s); });
  S.on(['field', 'tempUnit', 'speedUnit', 'distUnit', 'timeFirst'], s => { if (s.selection) renderDetail(s); }, { now: false });
  S.on(['distUnit'], () => renderScale(map), { now: false });

  // Selection marker + detail panel on click / tap.
  let pin = null;
  map.on('click', e => {
    const { lng, lat } = e.lngLat;
    if (S.get('measuring')) return; // the measure tool owns clicks while on
    const ev = phHit(e) || evHit(e.point); // a photo or event under the click wins over the place
    if (ev) return S.set({ selection: ev });
    if (Math.abs(lat) > 85) return;
    S.set({ selection: { type: 'place', lon: lng, lat } });
  });
  S.on(['selection'], s => {
    pin?.remove(); pin = null;
    if (!s.selection) return;
    toggleLayersSheet(false); closePops(); placeSheet.set('peek');
    if (s.selection.type !== 'place') return; // events are highlighted by a map layer
    const el = document.createElement('div'); el.className = 'pin';
    pin = new maplibregl.Marker({ element: el }).setLngLat([s.selection.lon, s.selection.lat]).addTo(map);
  });
  $('#detail').addEventListener('click', e => {
    if (e.target.closest('[data-deselect]')) S.set({ selection: null });
    else if (e.target.closest('.d-hd') && !e.target.closest('button') && placeSheet.get() === 'peek') placeSheet.set('half');
    if (e.target.closest('[data-center]')) { const s = S.get('selection'); map.easeTo({ center: [s.lon, s.lat] }); }
  });

  map.on('moveend', () => { renderScale(map); if (S.get('basemap') === 'satellite') renderCredits(map); });
  addEventListener('resize', () => renderCredits(map));
  renderScale(map);
}

boot();
