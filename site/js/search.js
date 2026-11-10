// Place search box (top bar on desktop, search pill on phones) and the place panel's name line.
// Suggestions come from the static place index (places.js), loaded the first time a search box
// is focused or the map is clicked. Up/Down move, Enter picks, Esc closes; "lat, lon" also works.
// A pick flies the map there and opens the place panel at the hour already on the timeline.
// Nothing typed is sent anywhere or stored.

import * as S from './state.js';
import { loadPlaces, search, parseLatLon, nearest, nearText, placeLabel } from './places.js';

const WAIT_MS = 150; // after typing pauses
const esc = s => String(s).replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
const fmtLat = la => `${Math.abs(la).toFixed(2)}° ${la >= 0 ? 'N' : 'S'}`;
const fmtLon = lo => `${Math.abs(lo).toFixed(2)}° ${lo >= 0 ? 'E' : 'W'}`;
let idx = null, failed = false;
const ready = () => loadPlaces().then(i => { idx = i; failed = false; return i; }, e => { failed = true; throw e; });

export function initSearch(map, onName) {
  document.querySelectorAll('[data-search]').forEach((box, n) => bind(map, box, n));
  watchSelection(onName);
}

// Focus the search box on screen (Ctrl/Cmd+K).
export function focusSearch() {
  const box = [...document.querySelectorAll('[data-search] input')].find(i => i.offsetParent);
  box?.focus();
  box?.select();
}

function bind(map, box, n) {
  const input = box.querySelector('input');
  const pop = Object.assign(document.createElement('div'), { className: 's-pop panel', hidden: true });
  pop.innerHTML = `<ul role="listbox" id="s-list-${n}" aria-label="Places"></ul><p class="s-msg" role="status" aria-live="polite"></p>`;
  box.append(pop);
  const list = pop.querySelector('ul'), msg = pop.querySelector('.s-msg');
  input.setAttribute('aria-controls', list.id);
  let items = [], active = -1, timer = 0;

  const close = () => { pop.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
  const say = text => { items = []; list.innerHTML = ''; msg.textContent = text; pop.hidden = false; input.setAttribute('aria-expanded', 'false'); };
  function show(found) {
    items = found; active = -1; msg.textContent = '';
    list.innerHTML = found.map((it, i) => `<li role="option" id="${list.id}-${i}" aria-selected="false" data-i="${i}"><b>${esc(it.name)}</b><span>${esc(it.where)}</span></li>`).join('');
    pop.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
  }
  function move(to) {
    if (!items.length) return;
    active = (to + items.length) % items.length;
    list.querySelectorAll('[role=option]').forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    input.setAttribute('aria-activedescendant', `${list.id}-${active}`);
    list.children[active].scrollIntoView({ block: 'nearest' });
  }
  function run() {
    clearTimeout(timer); timer = 0;
    const text = input.value, xy = parseLatLon(text);
    if (xy?.error) return say(xy.error);
    if (xy) return show([{ name: `${fmtLat(xy.lat)}, ${fmtLon(xy.lon)}`, where: 'Coordinates', lat: xy.lat, lon: xy.lon }]);
    if (text.trim().length < 2) return close();
    if (!idx) {
      if (failed) return say('Search unavailable: the place list could not be loaded.');
      say('Loading places…');
      ready().then(run, run);
      return;
    }
    const found = search(idx, text);
    if (!found.length) return say(`No results for “${text.trim()}”.`);
    show(found.map(p => ({ name: p.name, where: [p.region.name, p.region.country].filter(Boolean).join(', '), lat: p.lat, lon: p.lon, label: placeLabel(p) })));
  }
  function pick(it) {
    close();
    input.value = it.label || it.name;
    input.blur();
    map.flyTo({ center: [it.lon, it.lat], zoom: Math.max(map.getZoom(), 9) });
    // the panel reads the shared clock (state.t), so it opens at the hour already on the timeline
    S.set({ measuring: false, selection: { type: 'place', lon: it.lon, lat: it.lat, name: it.label } });
  }

  input.addEventListener('focus', () => { ready().catch(() => {}); if (input.value.trim()) run(); });
  input.addEventListener('blur', close);
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, WAIT_MS); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (pop.hidden) run();
      else move(active + (e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (timer || pop.hidden) run(); // Enter before the pause: search now
      if (items.length) pick(items[Math.max(active, 0)]);
    } else if (e.key === 'Escape') {
      e.stopPropagation(); // Esc here closes the suggestions, not the place panel
      if (!pop.hidden) close(); else if (input.value) input.value = ''; else input.blur();
    }
  });
  // pointerdown would move focus off the box and close the list before the click lands
  list.addEventListener('pointerdown', e => e.preventDefault());
  list.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) pick(items[+li.dataset.i]); });
  list.addEventListener('pointermove', e => { const li = e.target.closest('[data-i]'); if (li && +li.dataset.i !== active) move(+li.dataset.i); });
}

// ---- place panel name line ------------------------------------------------------------
// A clicked point gets the nearest indexed place (within 100 km), labelled as such; a searched
// place shows its own name.
let named = { key: '', hit: null, state: 'none' };
const keyOf = sel => `${sel.lon},${sel.lat}`;

function watchSelection(onName) {
  S.on(['selection'], s => {
    const sel = s.selection;
    if (sel?.type !== 'place' || sel.name || (named.key === keyOf(sel) && named.state !== 'failed')) return;
    const key = keyOf(sel);
    named = { key, hit: null, state: 'loading' };
    ready().then(i => {
      const hit = nearest(i, sel.lon, sel.lat);
      return { hit, state: hit ? 'near' : 'none' };
    }, () => ({ hit: null, state: 'failed' })).then(r => {
      if (named.key !== key) return;
      named = { key, ...r };
      onName();
    });
  });
}

export function placeNameHTML(sel) {
  if (sel.name) return `<div class="d-name" data-place-name>${esc(sel.name)}</div>`;
  if (named.key !== keyOf(sel) || named.state === 'loading') return '<div class="d-name" data-place-name>Finding the nearest place…</div>';
  if (named.state === 'failed') return '<div class="d-name" data-place-name>Place name unavailable: the place list could not be loaded.</div>';
  if (named.state === 'none') return ''; // nothing within 100 km: the coordinates alone
  return `<div class="d-name" data-place-name title="The nearest town or city in the GeoNames place list, not an exact address"><span>${esc(nearText(named.hit))}</span><span class="np">Nearest place</span></div>`;
}
