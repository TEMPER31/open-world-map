// Place search and the nearest place to a point, from the static GeoNames index
// (data/places.json, built by scripts/build_places.py). The index is fetched from this site the
// first time it is needed and searched in the browser; nothing is sent anywhere else and nothing
// is stored. No DOM: also imported by scripts/data/unit-tests.mjs.

import { haversineKm, conv, label } from './units.js';

// Case and accents don't matter ("sao paulo" finds São Paulo). Letters that Unicode does not
// split into base + accent are folded by hand.
const FOLD = { 'ß': 'ss', 'ø': 'o', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'æ': 'ae', 'œ': 'oe', 'ı': 'i', 'ħ': 'h' };
export const fold = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[ßøłđðþæœıħ]/g, c => FOLD[c]).replace(/['’.]/g, '').replace(/[\s,-]+/g, ' ').trim();

// The parsed file, with a folded key per place for matching.
export function indexOf(json) {
  const regions = json.regions.map(([country, code, name]) => ({ country, code: fold(code), name, key: fold(name) }));
  const places = json.places.map(([name, r, lat, lon, pop]) => ({ name, region: regions[r], lat, lon, pop, key: fold(name) }));
  return { regions, places };
}

let loading = null;
export function loadPlaces() {
  loading ||= fetch(new URL('../data/places.json', import.meta.url)).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }).then(indexOf);
  loading.catch(() => { loading = null; }); // the next try fetches again
  return loading;
}

export const placeLabel = p => [p.name, p.region.name, p.region.country].filter(Boolean).join(', ');

// Names that start with the query first, then names that contain it; larger places first in each.
function byName(idx, q) {
  const starts = [], within = [];
  for (const p of idx.places) {
    const i = p.key.indexOf(q);
    if (i === 0) starts.push(p);
    else if (i > 0) within.push(p);
  }
  const big = (a, b) => b.pop - a.pop;
  return [...starts.sort(big), ...within.sort(big)];
}

// The last words can name the region or the country: "Kansas City MO", "Kansas City, Missouri",
// "London, UK".
const ALIAS = { uk: 'gb', usa: 'us' };
const inPlace = (p, q) => p.region.code === q || p.region.key.startsWith(q) || p.region.country.toLowerCase() === (ALIAS[q] || q);

export function search(idx, text, limit = 8) {
  const q = fold(text);
  if (q.length < 2) return [];
  const comma = text.indexOf(',');
  const tries = [[q, '']];
  if (comma > 0) tries.unshift([fold(text.slice(0, comma)), fold(text.slice(comma + 1))]);
  const words = q.split(' ');
  for (let n = words.length - 1; n > 0; n--) tries.push([words.slice(0, n).join(' '), words.slice(n).join(' ')]);
  for (const [name, where] of tries) {
    if (name.length < 2) continue;
    const hits = where ? byName(idx, name).filter(p => inPlace(p, where)) : byName(idx, name);
    if (hits.length) return hits.slice(0, limit);
  }
  return [];
}

// "39.1, -94.58", "39.1 -94.58" or "39.1° N, 94.58° W" -> {lat, lon}; out of range -> {error};
// anything else -> null (search by name instead).
const NUM = '([-+]?\\d+(?:\\.\\d+)?)\\s*°?\\s*';
const COORDS = new RegExp(`^\\s*${NUM}([NS])?\\s*(?:,|\\s)\\s*${NUM}([EW])?\\s*$`, 'i');
export function parseLatLon(text) {
  const m = COORDS.exec(text);
  if (!m) return null;
  const lat = m[2] ? Math.abs(+m[1]) * (/s/i.test(m[2]) ? -1 : 1) : +m[1];
  const lon = m[4] ? Math.abs(+m[3]) * (/w/i.test(m[4]) ? -1 : 1) : +m[3];
  if (Math.abs(lat) > 90) return { error: 'Latitude must be between -90 and 90.' };
  if (Math.abs(lon) > 180) return { error: 'Longitude must be between -180 and 180.' };
  // the map (Web Mercator) ends at about 85° north and south
  if (Math.abs(lat) > 85) return { error: 'The map only reaches 85° north and south.' };
  return { lat, lon };
}

// The indexed place nearest to a point, if one is within maxKm: {place, km}.
export function nearest(idx, lon, lat, maxKm = 100) {
  const dLat = maxKm / 111, dLon = dLat / Math.max(0.01, Math.cos(lat * Math.PI / 180));
  let best = null, km = maxKm;
  for (const p of idx.places) {
    if (Math.abs(p.lat - lat) > dLat || Math.abs(((p.lon - lon + 540) % 360) - 180) > dLon) continue;
    const d = haversineKm([lon, lat], [p.lon, p.lat]);
    if (d <= km) { best = p; km = d; }
  }
  return best && { place: best, km };
}

// "Near Uniontown, Pennsylvania, US" within 5 km, else "12 km from Uniontown, ..." (display unit).
export const nearText = ({ place, km }) => km < 5 ? `Near ${placeLabel(place)}` : `${Math.round(conv('dist', km))} ${label('dist')} from ${placeLabel(place)}`;
