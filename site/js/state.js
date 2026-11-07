// One small shared state store. Components subscribe to the keys they care about.
// Preferences persist in localStorage on this device only (no accounts, nothing sent).

const STORE_KEY = 'owm:prefs:v1';
const PERSIST = ['field', 'basemap', 'particles', 'opacity', 'density', 'tempUnit', 'speedUnit', 'distUnit', 'timeFirst', 'speed', 'events', 'evWin', 'photos', 'overlays'];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// First visit: US units (°F, mph, mi) for an en-US browser, metric everywhere else.
const us = /^en-US$/i.test(navigator.language || '');

const state = {
  field: 'wind',          // wind | temp | rain | aq | cloud | pres
  basemap: 'dark',        // dark | light | satellite
  particles: !reduceMotion,
  opacity: 1,             // field opacity multiplier (Settings)
  density: 1,             // particle density multiplier (Settings)
  tempUnit: us ? 'F' : 'C',   // display units (Settings): C | F
  speedUnit: us ? 'mph' : 'kmh', // kmh | mph | ms | kn
  distUnit: us ? 'mi' : 'km',  // km | mi
  timeFirst: 'local',     // which clock the timeline shows first: local | utc
  speed: 1,               // playback speed: 1, 2 or 4 frames per 350 ms
  measuring: false,       // distance tool on
  t: 0,                   // hours from Now (a frame time: hourly to f120, then every 3 h)
  playing: false,
  selection: null,        // {type: 'place', lon, lat} | {type: 'event' | 'photo', id, lon, lat}
  layersMin: false,
  // natural events (Phase 5): one toggle per type, all off until chosen (no requests while off)
  events: { eq: false, fv: false, st: false, ga: false },
  evWin: '7d',            // observed events shown: '24h' | '7d'
  photos: false,          // street photos (Mapillary, Phase 4): off until chosen
  overlays: []            // up to 2 of 'cloud' | 'rain' | 'pres', drawn over the main field
};

try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  for (const k of PERSIST) if (k in saved) state[k] = saved[k];
} catch { /* storage unavailable: defaults are fine */ }

const subs = new Set();

export const get = k => k ? state[k] : state;

export function set(patch) {
  const changed = Object.keys(patch).filter(k => state[k] !== patch[k]);
  if (!changed.length) return;
  Object.assign(state, patch);
  if (changed.some(k => PERSIST.includes(k))) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(PERSIST.map(k => [k, state[k]])))); } catch { /* ignore */ }
  }
  for (const s of subs) if (s.keys.some(k => changed.includes(k))) s.fn(state);
}

// on(['field', 't'], fn) calls fn(state) now and whenever one of those keys changes.
// Returns a function that unsubscribes.
export function on(keys, fn, { now = true } = {}) {
  const s = { keys, fn };
  subs.add(s);
  if (now) fn(state);
  return () => subs.delete(s);
}
