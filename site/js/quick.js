// Quick view of the place panel: the same forecast in plain words and large numbers. Now (the
// hour on the timeline), the next 48 hours, the next 7 days, sunrise and sunset. It reads the
// values the detailed panel already loads; only the 48-hour row's rain needs more, and it comes
// from this site's own rain frames. The numbers come first; where each one comes from (source,
// run, grid, method) is one line at the foot and a "Sources and method" list that opens on demand.

import { meta, getPoint } from './data.js';
import { conv, label, rainNum } from './units.js';
import { toTemp, unitOf } from './scales.js';
import { relT, fmtBoth } from './timeline.js';
import { runLabel } from './fresh.js';
import { sunTimes } from './sun.js';
import { SAMPLE_GRID_DEG } from './config.js';

const H = 3600e3, DAY = 864e5;
const pad = n => String(n).padStart(2, '0');
const temp = c => c == null || c !== c ? '—' : `${Math.round(toTemp(c))}°`;
const wind = k => k == null || k !== k ? '—' : `${Math.round(conv('speed', k))} ${label('speed')}`;
const rainText = v => v === undefined ? '…' : v == null || v !== v ? '—' : v < 0.1 ? 'Dry' : `${rainNum(v)} ${label('rain')}`;
const validOf = t => meta.base + t * H;

// Plain sky words from total cloud cover (%), precipitation (mm in the past hour, the
// detailed view's "Dry" threshold is 0.1) and 2 m temperature (°C). Precipitation comes first.
export function skyWord(cloud, rain, tempC) {
  if (rain >= 0.1) {
    const kind = tempC <= 1 ? 'rain or snow' : 'rain';
    return rain < 1 ? `Light ${kind}` : rain < 4 ? kind[0].toUpperCase() + kind.slice(1) : `Heavy ${kind}`;
  }
  if (cloud !== cloud || cloud == null) return '—';
  return cloud < 25 ? 'Clear' : cloud < 70 ? 'Partly cloudy' : 'Cloudy';
}

// Grid of the summary file the rows come from, as stored with the data.
const seriesDeg = () => meta.live ? meta.gfs?.series?.grid?.deg : SAMPLE_GRID_DEG;
const gridText = deg => deg ? `${deg}° grid (about ${deg >= 1 ? Math.round(deg * 111 / 10) * 10 : Math.round(deg * 111 / 5) * 5} km)` : 'coarse grid';

// "every 3 h to +2 d, then every 6 h" from the times actually in the file.
function stepText(pts) {
  const parts = [];
  for (let i = 1; i < pts.length; i++) {
    const gap = pts[i].t - pts[i - 1].t, last = parts[parts.length - 1];
    if (last?.gap === gap) last.to = pts[i].t; else parts.push({ gap, to: pts[i].t });
  }
  return parts.map((p, i) => `every ${p.gap} h${i < parts.length - 1 ? ` to ${relT(p.to)}` : ''}`).join(', then ') || 'one time';
}

// Times for the 48-hour row: the file's times after Now, at least 3 hours apart.
function rowPoints(series) {
  const out = [];
  for (const p of series || []) if (p.t > 0 && p.t <= 48 && p.t - (out[out.length - 1]?.t ?? -Infinity) >= 3) out.push(p);
  return out;
}

// Rain at the row's times (mm in the hour before), loaded once per place.
let rain = { key: '', v: {} };
export function loadRain(sel, series, redraw) {
  const key = `${sel.lon},${sel.lat}`;
  if (rain.key === key || !series?.length) return;
  rain = { key, v: {} };
  const v = rain.v;
  for (const p of rowPoints(series)) {
    getPoint(p.t, ['rain'], sel.lon, sel.lat).then(r => r.rain ? r.rain.v : null, () => null).then(x => { if (rain.v === v) { v[p.t] = x; redraw(); } });
  }
}

// Days in the viewer's local time: high and low temperature and the strongest wind.
function days(series) {
  const out = [];
  for (const p of series || []) {
    if (p.t < 0) continue;
    const d = new Date(validOf(p.t)), key = d.toDateString();
    let day = out[out.length - 1];
    if (day?.key !== key) out.push(day = { key, date: d, hi: -Infinity, lo: Infinity, wind: 0, first: p.t, last: p.t });
    day.hi = Math.max(day.hi, p.temp); day.lo = Math.min(day.lo, p.temp); day.wind = Math.max(day.wind, p.wind); day.last = p.t;
  }
  return out;
}

// The place's own calendar day at the timeline hour (from its longitude, 15° per hour).
const SUN_SRC = 'Worked out in your browser with NOAA\'s solar formulas for this point (centre of the sun 0.833° below a flat horizon). Not a forecast value.';
function sunHTML(lat, lon, t, first) {
  const at = validOf(t) + lon / 15 * H, day0 = at - ((at % DAY) + DAY) % DAY;
  const r = sunTimes(lat, lon, day0);
  const date = new Date(day0).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '');
  // first clock large, the other one small beside it
  const clock = (ms, k) => { const [a, b] = fmtBoth(ms, first, { date: false }).split(' · '); return `<b class="mono" data-sun${k}="${new Date(ms).toISOString()}">${a}</b><small class="mono"><i> · </i>${b}</small>`; };
  const body = r.polar === 'night' ? '<p class="qv-msg">The sun does not rise on this day.</p>'
    : r.polar === 'day' ? '<p class="qv-msg">The sun does not set on this day.</p>'
    : `<div class="qv-sun">${[['Sunrise', r.rise, 'rise'], ['Sunset', r.set, 'set']].map(([n, ms, k]) => `<div><span>${n}</span>${ms == null ? `<b data-sun${k}="none">None: the sun stays up</b>` : clock(ms, k)}</div>`).join('')}</div>`;
  return `<div class="d-sec" data-qv="sun"><div class="kick"><span>Sun</span><span>${date} at this spot</span></div>${body}</div>`;
}

// "Sources and method" stays open or closed as the reader left it while the panel redraws.
let aboutOpen = false;
export function bindQuick(el) {
  el.addEventListener('toggle', e => { if (e.target.matches?.('[data-qv-about]')) aboutOpen = e.target.open; }, true);
}

// s: page state; vals: the detailed panel's values at the timeline hour ({field: {v, u, w}});
// series: [{t, temp, wind}] from the summary file; dirFrom(u, v): compass point the wind comes
// from; about: extra rows [[name, html]] for the "Sources and method" list (the panel's own note).
export function quickHTML(s, vals, series, dirFrom, about = []) {
  const { lon, lat } = s.selection, t = s.t, v = k => vals?.[k] ? vals[k].v : vals && k in vals ? null : undefined;
  const w = vals?.wind, src = meta.live ? `NOAA GFS run ${runLabel(meta.run)}` : 'Sample data (generated)';
  const fine = meta.live ? `${meta.gfs?.grid?.deg ?? 0.5}° grid (~50 km); wind ${meta.gfs?.wind_grid?.deg ?? 0.75}°; clouds and rain are area averages` : `${SAMPLE_GRID_DEG}° grid`;
  const sky = v('cloud') === undefined || v('rain') === undefined ? '…' : skyWord(v('cloud'), v('rain'), v('temp'));
  const windNow = w === undefined ? '…' : w && w.v === w.v ? `${wind(w.v)} from ${dirFrom(w.u, w.w)}` : '—';
  const rainNow = v('rain') === undefined ? '…' : v('rain') == null || v('rain') !== v('rain') ? '—' : v('rain') < 0.1 ? 'Dry' : `${rainNum(v('rain'))} ${unitOf('rain')}`;
  const now = `<div class="d-sec" data-qv="now"><div class="kick"><span>${t ? `At ${relT(t)}` : 'Now'}</span><span>follows the timeline</span></div>
    <div class="qv-now"><b class="qv-temp mono">${v('temp') === undefined ? '…' : temp(v('temp')).replace('°', '')}<small>${unitOf('temp')}</small></b><div class="qv-sky" data-sky>${sky}</div></div>
    <div class="qv-facts"><div><span>Wind</span><b class="mono">${windNow}</b></div><div><span>Rain, ${meta.rainHours(t) >= 3 ? 'past 3 h' : 'past hour'}</span><b class="mono">${rainNow}</b></div></div></div>`;

  const pts = rowPoints(series), first = s.timeFirst, deg = seriesDeg();
  const on = pts.reduce((a, p) => p.t <= t ? p.t : a, null);
  let lastDay = '';
  const cells = pts.map(p => {
    const d = new Date(validOf(p.t)), utc = first === 'utc';
    const day = utc ? d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }) : d.toLocaleDateString('en-GB', { weekday: 'short' });
    const hh = `${pad(utc ? d.getUTCHours() : d.getHours())}:${pad(utc ? d.getUTCMinutes() : d.getMinutes())}`;
    const showDay = day !== lastDay; lastDay = day;
    const r = rain.v[p.t];
    return `<div class="qv-h${p.t === on && t <= 48 ? ' on' : ''}${showDay ? ' day' : ''}" data-qt="${p.t}"><span class="qv-t">${showDay ? day : '&nbsp;'}<br>${hh}</span><b class="mono">${temp(p.temp)}</b><span class="mono${r >= 0.1 ? ' wet' : ''}">${rainText(r)}</span><span class="mono">${wind(p.wind)}</span></div>`;
  }).join('');
  const hours = `<div class="d-sec" data-qv="hours"><div class="kick"><span>Next 48 hours</span><span>${first === 'utc' ? 'UTC' : 'local time'}</span></div>
    ${pts.length ? `<div class="qv-hours" tabindex="0" role="group" aria-label="Next 48 hours: time, temperature, rain, wind">${cells}</div>` : '<p class="qv-msg">Loading…</p>'}</div>`;

  // each day's low-to-high bar sits on the week's own range, so warm and cold days line up
  const ds = days(series), today = new Date(validOf(0)).toDateString();
  const lo = Math.min(...ds.map(d => d.lo)), span = (Math.max(...ds.map(d => d.hi)) - lo) || 1;
  const rows = ds.map(d => `<div class="qv-day"><span>${d.key === today ? 'Today' : d.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}${d.last - d.first < 12 ? ' <small>part</small>' : ''}</span><small class="mono">${temp(d.lo)}</small><i class="qv-bar" aria-hidden="true"><i style="left:${((d.lo - lo) / span * 100).toFixed(1)}%;width:${Math.max(4, (d.hi - d.lo) / span * 100).toFixed(1)}%"></i></i><b class="mono">${temp(d.hi)}</b><span class="mono">${wind(d.wind)}</span></div>`).join('');
  const week = `<div class="d-sec" data-qv="days"><div class="kick"><span>Next 7 days</span><span>low · high · wind</span></div>
    ${ds.length ? `<div class="qv-days">${rows}</div>` : '<p class="qv-msg">Loading…</p>'}</div>`;

  // one line that is always shown, and the full account behind a disclosure
  const list = [
    ['Now', 'now', `${src} · ${fine}`],
    ['Next 48 hours', 'hours', `Temperature (${unitOf('temp')}) and wind (${label('speed')}): ${src}, summary file on a ${gridText(deg)}, ${stepText(pts)}. Rain: ${label('rain') === 'in' ? 'inches' : 'mm'} in the hour before each time, ${fine.split(';')[0]}, area average.`],
    ['Next 7 days', 'days', `${src}, summary file on a ${gridText(deg)}, ${stepText((series || []).filter(p => p.t >= 0))}; days in your local time; wind is the day's strongest value. “part”: the day is only partly in the forecast. Rain by day is not in the summary file.`],
    ['Sun', 'sun', SUN_SRC]
  ].map(([n, k, x]) => `<dt>${n}</dt><dd class="src" data-qv-src="${k}">${x}</dd>`).join('') + about.map(([n, x]) => `<dt>${n}</dt><dd class="src">${x}</dd>`).join('');
  const foot = `<div class="d-sec qv-foot"><div class="src" data-qv-line>${src} · now on a ${fine.split(' (')[0].split(';')[0]}, outlook on a ${gridText(deg)}</div>
    <details class="qv-about" data-qv-about${aboutOpen ? ' open' : ''}><summary>Sources and method</summary><dl>${list}</dl></details></div>`;

  return now + hours + week + sunHTML(lat, lon, t, first) + foot;
}
