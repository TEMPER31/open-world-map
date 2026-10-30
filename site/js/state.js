// One small shared state store. Components subscribe to the keys they care about.
// Preferences persist in localStorage on this device only (no accounts, nothing sent).

const STORE_KEY = 'owm:prefs:v1';
const PERSIST = ['field', 'basemap', 'particles', 'opacity', 'density', 'tempUnit'];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// First visit: °F where it is the everyday unit (US and a few others), else °C.
const fahrenheit = /-(US|LR|BS|BZ|KY|PW|FM|MH)$/i.test(navigator.language || '');

const state = {
  field: 'wind',          // wind | temp | rain | aq | cloud | pres
  basemap: 'dark',        // dark | light | satellite
  particles: !reduceMotion,
  opacity: 1,             // field opacity multiplier (Settings)
  density: 1,             // particle density multiplier (Settings)
  tempUnit: fahrenheit ? 'F' : 'C', // display unit for temperature (Settings, legend)
  t: 0,                   // forecast hour, 0..HOURS
  playing: false,
  selection: null,        // {type: 'place', lon, lat}
  layersMin: false
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
export function on(keys, fn, { now = true } = {}) {
  subs.add({ keys, fn });
  if (now) fn(state);
}
