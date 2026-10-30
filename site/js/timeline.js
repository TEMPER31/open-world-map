// Timeline: Now -> the end of the forecast run. Frames are hourly to f120 and 3-hourly after
// (live data); t is hours from "Now", so the 3-hourly part keeps its true width and shows
// wider tick spacing behind a divider. Scrub by clicking or dragging the track (snaps to the
// nearest frame), step with the buttons or arrow keys (next / previous frame), play advances
// one frame every 350 ms and loops.

import * as S from './state.js';

const STEP_MS = 350;
let HOURS = 48, TIMES = [], step = (t, d) => t;
const pct = t => (t / HOURS * 100).toFixed(3) + '%';

// "+5 h", "+2 d", "+3 d 6 h"
export const relT = t => t === 0 ? 'Now' : t < 48 ? '+' + (t % 24 === 0 ? t / 24 + ' d' : t + ' h') : `+${Math.floor(t / 24)} d${t % 24 ? ` ${t % 24} h` : ''}`;

export function fmtUTC(ms, { weekday = true } = {}) {
  const d = new Date(ms);
  const day = d.toLocaleDateString('en-GB', { weekday: weekday ? 'short' : undefined, day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '');
  return `${day} · ${String(d.getUTCHours()).padStart(2, '0')}:00 UTC`;
}

// base: valid time (ms) of t = 0; times: the frame times (hours from base); stepTime(t, dir):
// next/previous/nearest frame; coarseFrom: t where 3-hourly frames start (or null); zone:
// label on the track; uncertainFrom: t after which a "less certain" note is shown.
export function initTimeline({ base, times, stepTime, coarseFrom, zone, uncertainFrom }) {
  TIMES = times; HOURS = times[times.length - 1] || 1; step = stepTime;
  const tracks = document.querySelectorAll('[data-track]');
  tracks.forEach(el => buildTrack(el, base, el.dataset.track === 'mini', zone, coarseFrom, uncertainFrom));
  tracks.forEach(bindTrack);

  let timer = null;
  document.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', () => S.set({ playing: !S.get('playing') })));
  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => S.set({ playing: false, t: step(S.get('t'), +b.dataset.step) })));
  S.on(['playing'], s => {
    clearInterval(timer);
    document.querySelectorAll('[data-play]').forEach(b => {
      b.classList.toggle('on', s.playing);
      b.setAttribute('aria-label', s.playing ? 'Pause' : 'Play');
      b.setAttribute('aria-pressed', String(s.playing));
    });
    // one frame per tick, so the 3-hourly part plays through time 3x faster
    if (s.playing) timer = setInterval(() => S.set({ t: S.get('t') >= HOURS ? 0 : step(S.get('t'), 1) }), STEP_MS);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.set({ playing: false }); });

  S.on(['t'], s => {
    const t = s.t, abs = base + t * 3600e3;
    document.querySelectorAll('.tl-head').forEach(e => e.style.left = pct(t));
    document.querySelectorAll('[data-track]').forEach(e => {
      e.setAttribute('aria-valuenow', t);
      e.setAttribute('aria-valuetext', `${relT(t)}, ${fmtUTC(abs)}`);
    });
    document.querySelectorAll('[data-step]').forEach(b => { b.disabled = +b.dataset.step < 0 ? t <= TIMES[0] : t >= HOURS; });
    document.querySelectorAll('[data-rel]').forEach(e => e.textContent = relT(t));
    // UTC is the reference; local time is shown too so the hour is easy to compare with
    // local forecasts (skipped when the browser itself is on UTC).
    const local = new Date().getTimezoneOffset() ? ` · ${new Date(abs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} local` : '';
    document.querySelectorAll('[data-abs]').forEach(e => e.textContent = fmtUTC(abs) + local);
    document.querySelectorAll('[data-abs-short]').forEach(e => e.textContent = fmtUTC(abs).replace(/ \d+ \w+ ·/, '').replace(' UTC', ''));
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
    if (next == null) return;
    e.preventDefault();
    S.set({ playing: false, t: next });
  });
}
