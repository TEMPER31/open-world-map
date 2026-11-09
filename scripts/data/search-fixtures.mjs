// Stand-in for the Photon geocoder (photon.komoot.io), in its GeoJSON answer format, so the tests
// never contact the real service. Places: Kansas City (MO), London and Tokyo; anything else
// finds nothing.
//   import { routeSearch } from './search-fixtures.mjs';
//   const log = await routeSearch(page, { mode: 'ok' | 'empty' | 'error' | 'slow', delay });
//   log.queries: the q of every request; log.aborted: queries the page cancelled.

const P = (name, coords, props) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: coords }, properties: { name, osm_type: 'N', osm_id: 1, ...props } });
export const PLACES = {
  kansas: [
    P('Kansas City', [-94.5786, 39.0997], { osm_key: 'place', osm_value: 'city', type: 'city', state: 'Missouri', country: 'United States', countrycode: 'US', extent: [-94.7695, 39.3322, -94.3848, 38.8279] }),
    P('Grand Boulevard', [-94.5815, 39.0965], { osm_key: 'highway', osm_value: 'secondary', type: 'street', city: 'Kansas City', state: 'Missouri', country: 'United States', countrycode: 'US' })
  ],
  london: [
    P('London', [-0.1278, 51.5074], { osm_key: 'place', osm_value: 'city', type: 'city', state: 'England', country: 'United Kingdom', countrycode: 'GB', extent: [-0.5103, 51.6919, 0.3340, 51.2868] }),
    P('London Bridge Street', [-0.0868, 51.5045], { osm_key: 'highway', osm_value: 'residential', type: 'street', city: 'London', district: 'Southwark', state: 'England', country: 'United Kingdom', countrycode: 'GB' }),
    P(undefined, [-0.1276, 51.5034], { osm_key: 'building', osm_value: 'house', type: 'house', housenumber: '10', street: 'Downing Street', city: 'London', state: 'England', country: 'United Kingdom', countrycode: 'GB' })
  ],
  tokyo: [
    P('Tokyo', [139.6917, 35.6895], { osm_key: 'place', osm_value: 'city', type: 'city', state: 'Tokyo', country: 'Japan', countrycode: 'JP', extent: [139.5629, 35.8174, 139.9189, 35.5233] })
  ]
};
const find = q => { q = q.trim().toLowerCase(); const k = Object.keys(PLACES).find(k => q.length >= 3 && (k.startsWith(q.slice(0, k.length)) || q.startsWith(k))); return k ? PLACES[k] : []; };

// mode: 'ok' (answers by query), 'empty' (no results), 'error' (HTTP 500), 'slow' (answers after
// delay ms, default 3000); delay also applies to 'ok' when given.
export async function routeSearch(page, { mode = 'ok', delay = mode === 'slow' ? 3000 : 0 } = {}) {
  const log = { queries: [], aborted: [], answered: [] };
  page.on('requestfailed', r => { if (r.url().startsWith('https://photon.komoot.io/')) log.aborted.push(new URL(r.url()).searchParams.get('q')); });
  await page.route('https://photon.komoot.io/**', async r => {
    const q = new URL(r.request().url()).searchParams.get('q') || '';
    log.queries.push(q);
    if (delay) await new Promise(res => setTimeout(res, delay));
    const body = mode === 'error' ? { message: 'test: Photon down' } : { type: 'FeatureCollection', features: mode === 'empty' ? [] : find(q) };
    try {
      await r.fulfill({ status: mode === 'error' ? 500 : 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
      log.answered.push(q);
    } catch { /* the page cancelled the request meanwhile */ }
  });
  return log;
}
