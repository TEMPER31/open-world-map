// Quick View: a simple, large-text summary of the next 12 hours at the selected place, opened from
// the place panel's "Quick view" button. The place panel itself stays as it is underneath.
// Desktop: a panel beside the place panel. Phones: a full-height sheet. Closes with ×, Esc or a
// tap outside; focus goes back to the button.
//
// Data: rain for every hour from Now to +12 h, temperature and cloud every 2 hours (the strip),
// read with getPoint only while Quick View is open, at most 3 frames at a time so the map's own
// frames are not held up. Files the map already loaded come from the cache. The 7-day row and the
// rest-of-today high / low beyond +12 h use the place chart's series (already loaded by the panel).

import * as S from './state.js';
import { meta, getPoint, getSeries } from './data.js';
import { toTemp, unitOf } from './scales.js';
import { fmtBoth } from './timeline.js';
import { QV, summarise, skyOf, wet, sunUp } from './quick-rules.js';
import { SAMPLE_GRID_DEG } from './config.js';

const $ = (s, el = document) => el.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const POOL = 3; // frames loaded at the same time

// Icons in the site's line style (20 px box, 1.5 px strokes, current colour).
const CLOUD = 'M5.5 15.5h9a3.5 3.5 0 0 0 .3-7A4.8 4.8 0 0 0 5.6 9.6 3 3 0 0 0 5.5 15.5z';
const ICON = {
  rain: '<path d="M5.5 11.5h9a3.2 3.2 0 0 0 .3-6.4A4.4 4.4 0 0 0 6 6.3 2.6 2.6 0 0 0 5.5 11.5z"/><path d="M7.2 14l-1 3M10.7 14l-1 3M14.2 14l-1 3"/>',
  cloud: `<path d="${CLOUD}"/>`,
  sun: '<circle cx="10" cy="10" r="3.5"/><path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7"/>',
  moon: '<path d="M15.8 12.6A6.6 6.6 0 0 1 7.4 4.2a6.6 6.6 0 1 0 8.4 8.4z"/>',
  partsun: '<circle cx="7" cy="7" r="2.6"/><path d="M7 1.6v1.6M1.6 7h1.6M3.2 3.2l1.1 1.1M10.8 3.2l-1.1 1.1"/><path d="M8.3 17.5h7a2.9 2.9 0 0 0 .2-5.8 3.9 3.9 0 0 0-7.4 1A2.4 2.4 0 0 0 8.3 17.5z"/>',
  partmoon: '<path d="M10.2 7.8A4.4 4.4 0 0 1 4.6 2.2a4.4 4.4 0 1 0 5.6 5.6z"/><path d="M8.3 17.5h7a2.9 2.9 0 0 0 .2-5.8 3.9 3.9 0 0 0-7.4 1A2.4 2.4 0 0 0 8.3 17.5z"/>'
};
const NAME = { rain: 'rain', cloud: 'cloudy', sun: 'clear', moon: 'clear', partsun: 'some cloud', partmoon: 'some cloud' };
const icon = (k, cls = 'qv-ic') => `<svg class="${cls}" viewBox="0 0 20 20" role="img" aria-label="${NAME[k]}" data-icon="${k}"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</g></svg>`;
const skyIcon = (sky, day) => sky === 'cloud' ? 'cloud' : sky === 'part' ? (day ? 'partsun' : 'partmoon') : sky === 'clear' ? (day ? 'sun' : 'moon') : null;

// Times in the clock shown first (Settings › Time shown first), as on the timeline.
const utcFirst = () => S.get('timeFirst') === 'utc';
const hm = ms => { const d = new Date(ms); return utcFirst() ? `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC` : `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dayKey = (ms, utc = utcFirst()) => { const d = new Date(ms); return utc ? d.toISOString().slice(0, 10) : `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
// "15:00", or "06:00 tomorrow" when the time falls on the next day of that clock
const when = ms => `${hm(ms)}${dayKey(ms) !== dayKey(meta.base) ? ' tomorrow' : ''}`;
const deg = c => c == null || c !== c ? '—' : `${Math.round(toTemp(c))}°`;

let el = null, opener = null, place = null, hours = null, loadId = 0, closedAt = 0;

export function initQuickView() {
  el = $('#qview');
  el.addEventListener('click', e => { if (e.target.closest('[data-qv-close]')) close(); });
  // Esc closes Quick View only (the place panel stays open)
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { e.preventDefault(); e.stopImmediatePropagation(); close(); } }, true);
  // a tap or click outside closes it; a click on the map that closed it does nothing else
  document.addEventListener('pointerdown', e => {
    if (!isOpen() || el.contains(e.target) || e.target.closest?.('[data-qview]')) return;
    if (e.target.closest?.('#map')) closedAt = performance.now();
    close({ focus: false });
  }, true);
  S.on(['selection'], s => { if (isOpen() && (s.selection?.type !== 'place' || s.selection.lon !== place.lon || s.selection.lat !== place.lat)) close({ focus: false }); }, { now: false });
  S.on(['tempUnit', 'timeFirst'], () => { if (isOpen()) render(); }, { now: false });
}

export const isOpen = () => !!el && !el.hidden;
// true once after an outside click on the map closed Quick View (the map ignores that click)
export function tookClick() { const took = performance.now() - closedAt < 800; closedAt = 0; return took; }

export function open({ lon, lat }, button) {
  opener = button || null; place = { lon, lat };
  hours = null;
  el.hidden = false;
  document.body.classList.add('has-qv');
  button?.setAttribute('aria-expanded', 'true');
  render();
  $('#qv-title', el).focus();
  load(++loadId);
}

export function close({ focus = true } = {}) {
  if (!isOpen()) return;
  loadId++; // stop loading (frames already loading finish into the cache)
  el.hidden = true;
  document.body.classList.remove('has-qv');
  // the place panel redraws its buttons, so find the current one
  const b = $('#detail [data-qview]') || opener;
  b?.setAttribute('aria-expanded', 'false');
  if (focus) b?.focus();
}

// Frames from Now to +12 h: rain every hour; temperature and cloud at Now and every 2 hours.
async function load(id) {
  const { lon, lat } = place, times = meta.times.filter(t => t <= QV.HOURS);
  const out = times.map(t => ({ t, ms: meta.base + t * 3600e3, rain: undefined, cloud: undefined, temp: undefined, strip: t % 2 === 0 }));
  let next = 0;
  const worker = async () => {
    while (next < out.length && id === loadId) {
      const h = out[next++], fields = h.strip ? ['temp', 'rain', 'cloud'] : ['rain'];
      const p = await getPoint(h.t, fields, lon, lat).catch(() => ({}));
      for (const k of fields) h[k] = p[k] && !p[k].missing ? p[k].v : null;
    }
  };
  const series = getSeries(lon, lat).catch(() => []);
  await Promise.all(Array.from({ length: POOL }, worker));
  const s = await series;
  if (id !== loadId) return;
  hours = Object.assign(out, { series: s });
  render();
}

// Rest-of-today high and low (local calendar day) from the loaded hours and, past +12 h, the
// place chart's series; late in the evening (under 3 hours of today left), tomorrow's instead.
function highLow() {
  const today = dayKey(meta.base, false), pts = [];
  for (const h of hours) if (h.temp != null && dayKey(h.ms, false) === today) pts.push(h.temp);
  for (const p of hours.series) if (p.t > QV.HOURS && dayKey(meta.base + p.t * 3600e3, false) === today) pts.push(p.temp);
  const left = (new Date(meta.base).setHours(24, 0, 0, 0) - meta.base) / 3600e3;
  if (left >= 3 && pts.length) return { label: 'rest of today', hi: Math.max(...pts), lo: Math.min(...pts) };
  const tom = dayKey(new Date(meta.base).setHours(36, 0, 0, 0), false);
  const t2 = hours.series.filter(p => dayKey(meta.base + p.t * 3600e3, false) === tom).map(p => p.temp);
  return t2.length ? { label: 'tomorrow', hi: Math.max(...t2), lo: Math.min(...t2) } : pts.length ? { label: 'rest of today', hi: Math.max(...pts), lo: Math.min(...pts) } : null;
}

// Next days' high / low from the series (local days after today with most of the day covered).
function week(skip) {
  const days = new Map(), today = dayKey(meta.base, false);
  for (const p of hours.series) {
    const ms = meta.base + p.t * 3600e3, k = dayKey(ms, false);
    if (k === today || k === skip) continue;
    if (!days.has(k)) days.set(k, { ms, T: [] });
    days.get(k).T.push(p.temp);
  }
  const step = hours.series.length > 1 ? hours.series[1].t - hours.series[0].t : 3;
  return [...days.values()].filter(d => d.T.length * step >= 18).slice(0, 6)
    .map(d => ({ day: new Date(d.ms).toLocaleDateString('en-GB', { weekday: 'short' }), hi: Math.max(...d.T), lo: Math.min(...d.T) }));
}

// Redraws keep keyboard focus where it was (the title or the close button).
function render() {
  if (!isOpen()) return;
  const a = document.activeElement, keep = el.contains(a) ? (a.matches('[data-qv-close]') ? '[data-qv-close]' : '#qv-title') : null;
  draw();
  if (keep) $(keep, el)?.focus();
}

function draw() {
  const { lon, lat } = place, u = unitOf('temp');
  const coord = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(((lon + 540) % 360) - 180).toFixed(2)}°${((lon + 540) % 360) - 180 >= 0 ? 'E' : 'W'}`;
  const sample = !meta.live;
  const head = `<div class="d-hd qv-hd"><button class="d-x" type="button" data-qv-close aria-label="Close Quick view (Esc)" title="Close (Esc)">×</button>
      <div class="kick">Quick view · ${sample ? '<span class="sample-badge">Sample data</span>' : 'GFS forecast'}</div>
      <h2 class="qv-title" id="qv-title" tabindex="-1">${coord}</h2>
      <div class="d-sub"><span class="tag">Now</span><span class="mono">${fmtBoth(meta.base)}</span></div></div>
    ${sample ? '<div class="d-sec"><div class="alert"><b>Sample data</b><span>Generated to test the layout. Not an observation or a forecast.</span></div></div>' : ''}`;
  const foot = `<div class="d-sec qv-note"><div class="src">Model forecast on a ~50 km grid, not an official warning. Mountains and coasts can differ from local conditions.</div>
      <div class="src">${meta.live ? 'NOAA GFS' : `Sample generator · ${SAMPLE_GRID_DEG}° grid`} · Updated ${new Date(meta.generated).toISOString().slice(11, 16)} UTC</div></div>`;
  if (!hours) {
    el.innerHTML = `${head}<div class="d-sec"><p class="qv-loading src" role="status">Loading the next ${QV.HOURS} hours…</p></div>${foot}`;
    return;
  }
  const sum = summarise(hours.map(h => ({ ms: h.ms, rain: h.rain, cloud: h.cloud })), when);
  const now = hours[0], day = ms => sunUp(ms, lon, lat);
  const rainIc = sum.rain.state === 'now' || sum.rain.state === 'soon' ? 'rain' : skyIcon(skyOf(now.cloud), day(now.ms)) || 'cloud';
  const hl = highLow();
  const days = week(hl?.label === 'tomorrow' ? dayKey(new Date(meta.base).setHours(36, 0, 0, 0), false) : null);
  // strip: every 2 hours; rain icon when either hour since the last cell had rain
  const cells = hours.filter(h => h.strip).map(h => {
    const i = hours.indexOf(h), rainy = wet(h.rain) || (i > 0 && wet(hours[i - 1].rain));
    const ic = rainy ? 'rain' : skyIcon(skyOf(h.cloud), day(h.ms));
    return `<li><span class="qv-t mono">${i ? hm(h.ms).replace(' UTC', '') : 'Now'}</span>${ic ? icon(ic) : '<span class="qv-ic"></span>'}<b class="mono">${deg(h.temp)}</b></li>`;
  }).join('');
  el.innerHTML = `${head}
    <div class="d-sec qv-take"><p class="qv-sum" data-qv-takeaway>${sum.takeaway}</p></div>
    <div class="d-sec qv-rain" data-qv-rain>${icon(rainIc, 'qv-ic big')}<div><b>${sum.rain.text}</b>${sum.rain.amount ? `<span>${sum.rain.amount}</span>` : ''}</div></div>
    <div class="d-sec qv-temp" data-qv-temp><div class="qv-now mono">${deg(now.temp)}<small>${u.replace('°', '')}</small></div>
      <div class="qv-hl">${hl ? `<span>Forecast high <b class="mono">${deg(hl.hi)}</b></span><span>Forecast low <b class="mono">${deg(hl.lo)}</b></span><span class="qv-lab">${hl.label}</span>` : ''}</div></div>
    <div class="d-sec qv-next"><div class="kick"><span>Next ${QV.HOURS} hours</span><span>${utcFirst() ? 'UTC' : 'local time'} · ${u}</span></div><ol class="qv-strip" data-qv-strip>${cells}</ol></div>
    ${days.length ? `<div class="d-sec qv-next"><div class="kick"><span>Next days</span><span>high / low · ${u}</span></div><ol class="qv-days mono" data-qv-days>${days.map(d => `<li><span>${d.day}</span><b>${deg(d.hi)}</b><i>${deg(d.lo)}</i></li>`).join('')}</ol></div>` : ''}
    ${foot}`;
}
