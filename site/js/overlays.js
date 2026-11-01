// Overlays: up to 2 extra weather layers drawn over the main field (below labels), each its own
// GPU field layer using the same shader and data files as the main field: clouds (translucent
// veil), rain (only where it rains) and pressure (isobars and H/L, no colours). An overlay can't
// be the main field. Each one follows the one clock (stamp 'ov-<k>') and prefetches the next 2
// frames; overlays that are off fetch nothing.

import * as S from './state.js';
import { stamp } from './clock.js';
import { FIELDS, barHTML, rangeText, unitOf } from './scales.js';
import { FieldGL } from './field-gl.js';
import { FIELD_BEFORE } from './basemaps.js';

export const OVERLAYS = [['cloud', 'Clouds', 'translucent veil'], ['rain', 'Rain', 'only where it rains'], ['pres', 'Isobars + H/L', 'lines only']];
export const MAX = 2;
const ALPHA = { cloud: 0.75, rain: 0.7, pres: 1 };

// Section for the layers rail / phone sheet.
export const overlaysHTML = () => `<div class="lsec ov" role="group" aria-label="Overlays"><div class="kick"><span>Overlays</span><span>max ${MAX}</span></div>
  ${OVERLAYS.map(([k, n, d]) => `<button class="row" type="button" role="checkbox" data-ov="${k}"><span class="chk"></span><b>${n}</b><span class="v" data-ovv="${k}">${d}</span></button><div class="ov-lg" data-ovlg="${k}" hidden></div>`).join('')}
  <p class="lx-note" data-ovnote></p></div>`;

// Toggle k: blocked when it is the main field or when 2 are already on (the UI says why).
export function toggle(k) {
  const s = S.get(), on = s.overlays.includes(k);
  if (!on && (k === s.field || s.overlays.length >= MAX)) return false;
  S.set({ overlays: on ? s.overlays.filter(x => x !== k) : [...s.overlays, k] });
  return true;
}

export function renderOverlayUI(s) {
  const light = s.basemap === 'light';
  for (const [k, , d] of OVERLAYS) {
    const on = s.overlays.includes(k), main = k === s.field, full = !on && s.overlays.length >= MAX;
    document.querySelectorAll(`[data-ov="${k}"]`).forEach(el => { el.setAttribute('aria-checked', String(on)); el.setAttribute('aria-disabled', String(main || full)); el.classList.toggle('dis', main || full); el.title = main ? 'This is the main field' : full ? `Up to ${MAX} overlays: turn one off first` : ''; });
    document.querySelectorAll(`[data-ovv="${k}"]`).forEach(el => el.textContent = main ? 'main field' : full ? `max ${MAX}` : d);
    document.querySelectorAll(`[data-ovlg="${k}"]`).forEach(el => {
      el.hidden = !on;
      if (on) el.innerHTML = k === 'pres' ? '<span class="mono">every 4 hPa · H high · L low</span>' : `${barHTML(k, light)}<span class="mono">${rangeText(k)} ${unitOf(k)}</span>`;
    });
  }
  const full = s.overlays.length >= MAX;
  document.querySelectorAll('[data-ovnote]').forEach(el => el.textContent = full ? `${MAX} overlays on: turn one off to choose another.` : 'Drawn over the main field. Wind particles have their own switch.');
}

// The GPU layers and their updates. load(t, k) -> texture; pres(t) -> H/L centres.
export function initOverlays(map, { load, latest, stepTime, opacity }) {
  const layers = {};
  for (const [k] of OVERLAYS) { layers[k] = new FieldGL('ov-' + k); map.addLayer(layers[k], FIELD_BEFORE); layers[k].setVisible(false); }
  const style = s => {
    const light = s.basemap === 'light';
    for (const [k] of OVERLAYS) {
      layers[k].setLut(k, light, k === 'pres');
      layers[k].setIsobars(k === 'pres' ? FIELDS.pres : null, light);
      layers[k].setOpacity(ALPHA[k] * opacity(s));
    }
  };
  const update = {};
  for (const [k] of OVERLAYS) update[k] = latest(async () => {
    const s = S.get(), t = s.t, ly = layers[k];
    if (!s.overlays.includes(k) || s.field === k) { ly.setVisible(false); stamp('ov-' + k, null); return; }
    stamp('ov-' + k, -1);
    const tex = await load(t, k);
    if (!S.get('overlays').includes(k)) return;
    ly.setData(tex); ly.setVisible(true);
    stamp('ov-' + k, t);
    for (const n of [stepTime(t, 1), stepTime(stepTime(t, 1), 1)]) if (n > t) load(n, k).catch(() => {});
  });
  S.on(['basemap', 'opacity'], style);
  S.on(['t', 'overlays', 'field'], () => { for (const k in update) update[k](); });
  // the main field can't also be an overlay: switching the field to one drops it from the overlays
  S.on(['field'], s => { if (s.overlays.includes(s.field)) S.set({ overlays: s.overlays.filter(x => x !== s.field) }); });
  return layers;
}
