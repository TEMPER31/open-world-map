// Timeline: Now -> +48 h in 1 h steps (one frame per hour). Scrub by clicking or
// dragging the track, or with arrow keys; play advances one hour every 350 ms and loops.

import { HOURS } from './config.js';
import * as S from './state.js';

const STEP_MS = 350;
const pct = t => (t / HOURS * 100).toFixed(3) + '%';

export const relT = t => t === 0 ? 'Now' : '+' + (t % 24 === 0 ? t / 24 + ' d' : t + ' h');

export function fmtUTC(ms, { weekday = true } = {}) {
  const d = new Date(ms);
  const day = d.toLocaleDateString('en-GB', { weekday: weekday ? 'short' : undefined, day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '');
  return `${day} · ${String(d.getUTCHours()).padStart(2, '0')}:00 UTC`;
}

export function initTimeline(base) {
  const tracks = document.querySelectorAll('[data-track]');
  tracks.forEach(el => buildTrack(el, base, el.dataset.track === 'mini'));
  tracks.forEach(bindTrack);

  let timer = null;
  document.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', () => S.set({ playing: !S.get('playing') })));
  S.on(['playing'], s => {
    clearInterval(timer);
    document.querySelectorAll('[data-play]').forEach(b => {
      b.classList.toggle('on', s.playing);
      b.setAttribute('aria-label', s.playing ? 'Pause' : 'Play');
      b.setAttribute('aria-pressed', String(s.playing));
    });
    if (s.playing) timer = setInterval(() => S.set({ t: S.get('t') >= HOURS ? 0 : S.get('t') + 1 }), STEP_MS);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) S.set({ playing: false }); });

  S.on(['t'], s => {
    const t = s.t, abs = base + t * 3600e3;
    document.querySelectorAll('.tl-head').forEach(e => e.style.left = pct(t));
    document.querySelectorAll('[data-track]').forEach(e => {
      e.setAttribute('aria-valuenow', t);
      e.setAttribute('aria-valuetext', `${relT(t)}, ${fmtUTC(abs)}`);
    });
    document.querySelectorAll('[data-rel]').forEach(e => e.textContent = relT(t));
    document.querySelectorAll('[data-abs]').forEach(e => e.textContent = fmtUTC(abs));
    document.querySelectorAll('[data-abs-short]').forEach(e => e.textContent = fmtUTC(abs).replace(/ \d+ \w+ ·/, '').replace(' UTC', ''));
  });
}

function buildTrack(el, base, mini) {
  let h = `<div class="tl-zone fc" style="left:0;right:0">${mini ? 'FCST' : 'FORECAST · SAMPLE DATA'}</div><div class="tl-axis"></div>`;
  for (let t = 0; t <= HOURS; t += 3) {
    const d = new Date(base + t * 3600e3), midnight = d.getUTCHours() === 0;
    if (mini && !midnight && t % 12) continue;
    h += `<div class="tl-tick${midnight ? ' major' : ''}" style="left:${pct(t)}"></div>`;
  }
  if (!mini) {
    h += `<div class="tl-lab" style="left:0"><b>Now</b></div><div class="tl-lab end" style="left:100%">+48 h</div>`;
    for (let t = 1; t < HOURS; t++) {
      const d = new Date(base + t * 3600e3);
      if (d.getUTCHours() !== 0 || t < 4 || t > HOURS - 5) continue;
      h += `<div class="tl-lab" style="left:${pct(t)}">${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).replace(',', '')}</div>`;
    }
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
    return Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * HOURS);
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
    const next = { ArrowRight: t + 1, ArrowUp: t + 1, ArrowLeft: t - 1, ArrowDown: t - 1, PageUp: t + 6, PageDown: t - 6, Home: 0, End: HOURS }[e.key];
    if (next == null) return;
    e.preventDefault();
    S.set({ playing: false, t: Math.max(0, Math.min(HOURS, next)) });
  });
}
