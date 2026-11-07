// Place search: Photon by komoot (OpenStreetMap data), contacted only while someone types in
// the search field. Photon asks for fair use, so the field:
//   - sends nothing until 3+ characters have been typed and typing pauses for 300 ms;
//   - keeps one request in flight (a new one cancels the previous one with AbortController);
//   - gives up after 8 s, and says "Searching…" once a request takes longer than 2 s;
//   - remembers answers in memory for this visit only (no storage, no search history).
// The field follows the ARIA combobox pattern (list autocomplete): ↑/↓ move, Enter picks the
// highlighted (or first) place, Esc closes the list and leaves the field.

const API = 'https://photon.komoot.io/api/';
const MIN_CHARS = 3, PAUSE_MS = 300, SLOW_MS = 2000, TIMEOUT_MS = 8000, LIMIT = 6;
export const MSG = {
  none: 'No places found. Check the spelling or try a nearby town.',
  slow: 'Searching…',
  down: "Search isn't available right now. You can still click the map."
};
const cache = new Map(); // normalised query -> features (this page visit only)
let inflight = null;     // the one request in flight: {key, ctl}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const keyOf = q => q.trim().replace(/\s+/g, ' ').toLowerCase();

// Readable label from Photon's properties: name, then the place it is in, then the country.
export function labelOf(p = {}) {
  const house = p.housenumber && p.street ? `${p.housenumber} ${p.street}` : null;
  const name = p.name || house || p.street || p.city || p.county || p.state || p.country || 'Unnamed place';
  const parts = [p.name && house ? house : null, p.district !== name ? p.district : null, p.city, p.county, p.state, p.country];
  const seen = new Set([name]);
  const area = parts.filter(x => x && !seen.has(x) && seen.add(x)).slice(-3);
  return { name, area: area.join(', ') };
}

// How close to fly: by Photon's place type, framed by its extent when it has one.
// [lowest, highest, default] map zoom per type.
const ZOOM = {
  country: [2, 6, 4], state: [4, 8, 6], county: [6, 10, 8], city: [8, 10, 9], district: [10, 13, 11],
  locality: [11, 14, 12], street: [13, 16, 15], house: [15, 17, 17], other: [12, 16, 14]
};
export function viewFor(f, map) {
  const p = f.properties || {}, [lon, lat] = f.geometry.coordinates;
  const type = ZOOM[p.type] ? p.type : p.housenumber ? 'house' : ['city', 'town', 'village', 'hamlet', 'municipality'].includes(p.osm_value) ? 'city' : 'other';
  const [lo, hi, def] = ZOOM[type];
  let zoom = def;
  // Photon's extent is [west, north, east, south]
  if (Array.isArray(p.extent) && p.extent.length === 4 && map?.cameraForBounds) {
    const [w, n, e, s] = p.extent;
    const cam = map.cameraForBounds([[Math.min(w, e), Math.min(n, s)], [Math.max(w, e), Math.max(n, s)]], { padding: 40 });
    if (cam && Number.isFinite(cam.zoom)) zoom = Math.max(lo, Math.min(hi, cam.zoom));
  }
  return { center: [lon, lat], zoom: +zoom.toFixed(2), type };
}

// One request at a time; resolves to features, rejects 'abort' when a newer request replaced it.
async function query(q) {
  const key = keyOf(q);
  if (cache.has(key)) return cache.get(key);
  inflight?.ctl.abort('replaced');
  const ctl = new AbortController(), me = { key, ctl };
  inflight = me;
  const timer = setTimeout(() => ctl.abort('timeout'), TIMEOUT_MS);
  try {
    const r = await fetch(`${API}?q=${encodeURIComponent(q.trim())}&limit=${LIMIT}&lang=en`, { signal: ctl.signal, credentials: 'omit' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    const feats = (j.features || []).filter(f => f?.geometry?.type === 'Point' && f.geometry.coordinates?.length >= 2 && f.geometry.coordinates.every(Number.isFinite));
    cache.set(key, feats);
    return feats;
  } catch (e) {
    if (ctl.signal.aborted && ctl.signal.reason === 'replaced') throw 'abort';
    throw e;
  } finally {
    clearTimeout(timer);
    if (inflight === me) inflight = null;
  }
}

// input: the text field (role="combobox"); pop: its pop-up (.sq) holding the listbox, a message
// line and the credit. onPick(feature, view) is called when a place is chosen.
export function initSearch(input, pop, { onPick, map }) {
  const list = pop.querySelector('[role="listbox"]'), msg = pop.querySelector('[data-sqmsg]');
  const inside = el => !!el && (input.contains(el) || pop.contains(el));
  let items = [], active = -1, shownKey = '', timer = 0, slowTimer = 0, pickWhenReady = false, seq = 0;

  const setOpen = open => {
    pop.hidden = !open;
    input.setAttribute('aria-expanded', String(open && items.length > 0));
    if (!open) setActive(-1);
  };
  const setActive = i => {
    active = i;
    [...list.children].forEach((li, k) => li.setAttribute('aria-selected', String(k === i)));
    if (i >= 0) { input.setAttribute('aria-activedescendant', list.children[i].id); list.children[i].scrollIntoView({ block: 'nearest' }); }
    else input.removeAttribute('aria-activedescendant');
  };
  const say = text => { msg.textContent = text || ''; };
  const render = (feats, key) => {
    items = feats; shownKey = key;
    list.innerHTML = feats.map((f, i) => { const { name, area } = labelOf(f.properties); return `<li role="option" id="${list.id}-${i}" aria-selected="false"><b>${esc(name)}</b>${area ? `<span>${esc(area)}</span>` : ''}</li>`; }).join('');
    say(feats.length ? '' : MSG.none);
    setActive(-1);
    setOpen(true);
  };
  const cancelTimers = () => { clearTimeout(timer); clearTimeout(slowTimer); };

  async function run() {
    cancelTimers();
    const q = input.value, key = keyOf(q), me = ++seq;
    if (key.length < MIN_CHARS) return;
    slowTimer = setTimeout(() => { if (me === seq) { say(MSG.slow); setOpen(true); } }, SLOW_MS);
    try {
      const feats = await query(q);
      if (me !== seq) return;
      clearTimeout(slowTimer);
      render(feats, key);
      if (pickWhenReady) { pickWhenReady = false; if (feats.length) pick(0); }
    } catch (e) {
      if (e === 'abort' || me !== seq) return;
      clearTimeout(slowTimer);
      items = []; list.innerHTML = ''; shownKey = ''; pickWhenReady = false;
      say(MSG.down); setOpen(true);
    }
  }

  function pick(i) {
    const f = items[i];
    if (!f) return;
    input.value = labelOf(f.properties).name;
    setOpen(false);
    onPick(f, viewFor(f, map));
  }

  input.addEventListener('input', () => {
    cancelTimers(); pickWhenReady = false;
    const key = keyOf(input.value);
    if (key.length < MIN_CHARS) { seq++; inflight?.ctl.abort('replaced'); items = []; list.innerHTML = ''; say(''); setOpen(false); return; }
    timer = setTimeout(run, PAUSE_MS);
  });
  input.addEventListener('keydown', e => {
    const n = items.length, ready = shownKey === keyOf(input.value);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!n || !ready) return;
      if (pop.hidden) setOpen(true);
      setActive(e.key === 'ArrowDown' ? (active + 1) % n : (active <= 0 ? n : active) - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (ready && n) pick(active >= 0 ? active : 0);
      else if (keyOf(input.value).length >= MIN_CHARS) { pickWhenReady = true; run(); }
    } else if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation(); // Esc here only closes the list, not the place panel
      setOpen(false); input.blur();
    } else if (e.key === 'Tab') setOpen(false);
  });
  input.addEventListener('focus', () => { if (shownKey && shownKey === keyOf(input.value)) setOpen(true); });
  // keep focus in the field while choosing with the mouse or a finger
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => { const li = e.target.closest('[role="option"]'); if (li) pick([...list.children].indexOf(li)); });
  for (const el of [input, pop]) el.addEventListener('focusout', e => { if (!inside(e.relatedTarget)) setOpen(false); });
  document.addEventListener('pointerdown', e => { if (!inside(e.target)) setOpen(false); });
  return { input, close: () => setOpen(false) };
}
