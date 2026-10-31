// Timeline: Now -> the end of the forecast run. Frames are hourly to f120 and 3-hourly after
// (live data); t is hours from "Now", so the 3-hourly part keeps its true width and shows
// wider tick spacing behind a divider. Scrub by clicking or dragging the track (snaps to the
// nearest frame), step with the buttons or the arrow keys (next / previous frame), Space plays
// and pauses. Play shows one frame per tick (350 ms at 1x, 175 at 2x, 88 at 4x) and waits for a
// frame to be drawn before moving on, so a slow download holds the playhead instead of skipping.

import * as S from './state.js';
import { stamp, layerTimes, validOf } from './clock.js';

const STEP_MS = 350, SPEEDS = [1, 2, 4];
let HOURS = 48, TIMES = [], step = (t, d) => t, fhOf = t => t;
const pct = t => (t / HOURS * 100).toFixed(3) + '%';
const pad = n => String(n).padStart(2, '0');

// "+5 h", "+2 d", "+3 d 6 h"
export const relT = t => t === 0 ? 'Now' : t < 48 ? '+' + (t % 24 === 0 ? t / 24 + ' d' : t + ' h') : `+${Math.floor(t / 24)} d${t % 24 ? ` ${t % 24} h` : ''}`;

export function fmtUTC(ms, { weekday = true } = {}) {
  const d = new Date(ms);
  const day = d.toLocaleDateString('en-GB', { weekday: weekday ? 'short' : undefined, day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '');
  return `${day} · ${pad(d.getUTCHours())}:00 UTC`;
}

// "Sat 31 Oct 02:00 local · 07:00 UTC" (or UTC first). The second clock carries its weekday
// only when it falls on another day.
export function fmtBoth(ms, first = S.get('timeFirst'), { date = true } = {}) {
  const d = new Date(ms), opt = { weekday: 'short', ...(date ? { day: 'numeric', month: 'short' } : {}) };
  const L = [d.toLocaleDateString('en-GB', opt).replace(',', ''), `${pad(d.getHours())}:${pad(d.getMinutes())}`, 'local'];
  const U = [d.toLocaleDateString('en-GB', { ...opt, timeZone: 'UTC' }).replace(',', ''), `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`, 'UTC'];
  const [a, b] = first === 'utc' ? [U, L] : [L, U];
  return `${a.join(' ')} · ${(b[0] === a[0] ? b.slice(1) : b.map((x, i) => i ? x : x.split(' ')[0])).join(' ')}`;
}

// base: valid time (ms) of t = 0; times: the frame times (hours from base); stepTime(t, dir):
// next/previous/nearest frame; coarseFrom: t where 3-hourly frames start (or null); zone:
// label on the track; uncertainFrom: t after which a "less certain" note is shown; fh(t):
// forecast hour of the run at t (null for sample data).
export function initTimeline({ base, times, stepTime, coarseFrom, zone, uncertainFrom, fh }) {
  TIMES = times; HOURS = times[times.length - 1] || 1; step = stepTime; fhOf = fh;
  const tracks = document.querySelectorAll('[data-track]');
  tracks.forEach(el => buildTrack(el, base, el.dataset.track === 'mini', zone, coarseFrom, uncertainFrom));
  tracks.forEach(bindTrack);

  const go = dir => S.set({ playing: false, t: step(S.get('t'), dir) });
  document.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', () => S.set({ playing: !S.get('playing') })));
  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => go(+b.dataset.step)));
  document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => S.set({ speed: SPEEDS[(SPEEDS.indexOf(S.get('speed')) + 1) % SPEEDS.length] })));
  document.querySelectorAll('[data-tfirst]').forEach(b => b.addEventListener('click', () => S.set({ timeFirst: S.get('timeFirst') === 'utc' ? 'local' : 'utc' })));
  // Space plays/pauses and Left/Right step anywhere on the page, except in form fields and on
  // buttons (Space presses those). On the map, Up/Down still pan; Left/Right move in time.
  const typing = el => el.closest?.('input, textarea, select, [contenteditable="true"]');
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || typing(e.target) || e.target.closest?.('[data-track]')) return;
    if (e.key === ' ' && !e.target.closest('button, a')) { e.preventDefault(); S.set({ playing: !S.get('playing') }); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); go(e.key === 'ArrowRight' ? 1 : -1); }
  }, true);

  let timer = null, waited = 0;
  // the frame on screen is drawn when every visible layer reports the current time
  const drawn = () => { const want = new Date(validOf(S.get('t'))).toISOString(); return Object.values(layerTimes()).every(v => v === want); };
  const tick = () => {
    const ms = STEP_MS / S.get('speed');
    if (!drawn() && (waited += ms) < 1500) return;
    waited = 0;
    S.set({ t: S.get('t') >= HOURS ? 0 : step(S.get('t'), 1) });
  };
  S.on(['playing', 'speed'], s => {
    clearInterval(timer);
    document.querySelectorAll('[data-play]').forEach(b => {
      b.classList.toggle('on', s.playing);
      b.setAttribute('aria-label', s.playing ? 'Pause (Space)' : 'Play (Space)');
      b.setAttribute('aria-pressed', String(s.playing));
    });
    document.querySelectorAll('[data-speed]').forEach(b => { b.textContent = s.speed + '×'; b.setAttribute('aria-label', `Playback speed ${s.speed}×`); });
    // one frame per tick, so the 3-hourly part plays through time 3x faster
    if (s.playing) timer = setInterval(tick, STEP_MS / s.speed);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.set({ playing: false }); });

  S.on(['t', 'timeFirst'], s => {
    const t = s.t, abs = base + t * 3600e3, f = fhOf(t);
    stamp('timeline', t);
    document.querySelectorAll('.tl-head').forEach(e => e.style.left = pct(t));
    document.querySelectorAll('[data-track]').forEach(e => {
      e.setAttribute('aria-valuenow', t);
      e.setAttribute('aria-valuetext', `${relT(t)}, ${fmtBoth(abs)}`);
    });
    document.querySelectorAll('[data-step]').forEach(b => { b.disabled = +b.dataset.step < 0 ? t <= TIMES[0] : t >= HOURS; });
    document.querySelectorAll('[data-rel]').forEach(e => e.textContent = relT(t));
    // which forecast hour of the model run this frame is
    document.querySelectorAll('[data-fh]').forEach(e => { e.textContent = f == null ? 'sample' : `forecast hour ${f}`; e.title = f == null ? 'Generated sample data' : `Hour ${f} of the GFS run`; });
    document.querySelectorAll('[data-abs]').forEach(e => { e.textContent = fmtBoth(abs, s.timeFirst, { date: false }); e.title = fmtBoth(abs); });
    document.querySelectorAll('[data-abs-short]').forEach(e => e.textContent = fmtBoth(abs, s.timeFirst, { date: false }));
    document.querySelectorAll('[data-tfirst]').forEach(b => { b.textContent = s.timeFirst === 'utc' ? 'UTC · local' : 'Local · UTC'; b.title = 'Switch which clock is shown first'; });
  });
}

function buildTrack(el, base, mini, zone, coarseFrom, uncertainFrom) {
  let h = `<div class="tl-zone fc" style="left:0;right:0">${mini ? 'FCST' : zone}</div><div class="tl-axis"></div>`;
  // forecasts lose skill with lead time; the part past ~3 days is shaded and labelled
  if (uncertainFrom != null && uncertainFrom < HOURS) h += `<div class="tl-unc" style="left:${pct(uncertainFrom)}" title="Forecasts become less certain beyond about 3 days">${mini ? '' : 'LESS CERTAIN'}</div>`;
  // where frames go from hourly to 3-hourly
  if (coarseFrom != null && coarseFrom < HOURS) h += `<div class="tl-coarse" style="left:${pct(coarseFrom)}" title="Hourly steps to here, then every 3 hours">${mini ? '' : '3-HOURLY'}</div>`;
  // ticks: one per frame (so the step change is visible), taller at UTC midnight
  for (const t of TIMES) {
    const midnight = new Date(base + t * 3600e3).getUTCHours() === 0;
    if (mini && !midnight) continue;
    if (!mini && !midnight && t < (coarseFrom ?? Infinity) && t % 3) continue;
    h += `<div class="tl-tick${midnight ? ' major' : ''}${t >= (coarseFrom ?? Infinity) ? ' coarse' : ''}" style="left:${pct(t)}"></div>`;
  }
  if (!mini) h += `<div class="tl-lab" style="left:0"><b>Now</b></div><div class="tl-lab end" style="left:100%">${relT(HOURS)}</div>`;
  // day labels at UTC midnights (short on the phone track)
  for (let t = 1; t < HOURS; t++) {
    const d = new Date(base + t * 3600e3);
    // keep clear of the "Now" and end labels (the end label is ~28 h wide on a 7-day track)
    if (d.getUTCHours() !== 0 || t < (mini ? 6 : 8) || t > HOURS - (mini ? 6 : HOURS > 72 ? 28 : 10)) continue;
    const lab = d.toLocaleDateString('en-GB', { weekday: 'short', ...(mini ? {} : { day: 'numeric' }), timeZone: 'UTC' }).replace(',', '');
    h += `<div class="tl-lab${mini ? ' mini' : ''}" style="left:${pct(t)}">${lab}</div>`;
  }
  el.innerHTML = h + '<div class="tl-head"></div>';
  el.setAttribute('role', 'slider');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', 'Forecast time');
  el.setAttribute('aria-valuemin', '0');
  el.setAttribute('aria-valuemax', String(HOURS));
}

function bindTrack(el) {
  const at = e => {
    const r = el.getBoundingClientRect();
    return step(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * HOURS, 0);
  };
  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId);
    S.set({ playing: false, t: at(e) });
    const move = ev => S.set({ t: at(ev) });
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
  el.addEventListener('keydown', e => {
    const t = S.get('t');
    const next = { ArrowRight: step(t, 1), ArrowUp: step(t, 1), ArrowLeft: step(t, -1), ArrowDown: step(t, -1), PageUp: step(t + 23, 1), PageDown: step(t - 23, -1), Home: TIMES[0], End: HOURS }[e.key];
    if (e.key === ' ') { e.preventDefault(); S.set({ playing: !S.get('playing') }); return; }
    if (next == null) return;
    e.preventDefault();
    S.set({ playing: false, t: next });
  });
}
