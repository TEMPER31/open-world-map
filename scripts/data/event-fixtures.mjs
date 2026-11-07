// Saved samples of each events source, in the upstream formats recorded by sources-probe.mjs
// (field names as the live services returned them on 31 Oct 2026), with times relative to now.
// Used by the render tests and screenshots for states the live feeds may not show (an active
// storm with its forecast track and cone, a source that is down) and for offline runs.
//   import { route } from './event-fixtures.mjs'; await route(page, { nhc: 'storm', usgs: 'down' });

const H = 3600e3, iso = ms => new Date(ms).toISOString();
const ddhhmm = ms => { const d = new Date(ms); return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCHours()).padStart(2, '0')}00`; };

export function usgs(now = Date.now()) {
  const q = (id, mag, lon, lat, depth, hAgo, place) => ({ type: 'Feature', id, geometry: { type: 'Point', coordinates: [lon, lat, depth] },
    properties: { mag, place, time: now - hAgo * H, updated: now - hAgo * H + 6e5, url: `https://earthquake.usgs.gov/earthquakes/eventpage/${id}`, alert: mag >= 6 ? 'green' : null, tsunami: 0, magType: 'mww', type: 'earthquake', title: `M ${mag} - ${place}` } });
  return { type: 'FeatureCollection', metadata: { generated: now - 60e3, title: 'USGS Magnitude 2.5+ Earthquakes, Past Week', count: 4 },
    features: [q('us7000test1', 6.4, -98.05, -36.41, 10, 30, 'southeast of Easter Island'), q('us7000test2', 4.5, -172.79, 51.70, 44.9, 2, '111 km ESE of Atka, Alaska'),
      q('us7000test3', 5.2, 142.3, 37.9, 35, 70, 'off the east coast of Honshu, Japan'), q('us7000test4', 3.1, -97.5, 36.2, 6, 12, '8 km S of Perry, Oklahoma')] };
}

export function eonet(now = Date.now()) {
  const e = (id, title, cat, catTitle, lon, lat, hAgo, src) => ({ id, title, description: null, link: `https://eonet.gsfc.nasa.gov/api/v3/events/${id}`, closed: null,
    categories: [{ id: cat, title: catTitle }], sources: [{ id: src, url: `https://example.org/${id}` }],
    geometry: [{ magnitudeValue: cat === 'wildfires' ? 1200 : null, magnitudeUnit: cat === 'wildfires' ? 'acres' : null, date: iso(now - hAgo * H), type: 'Point', coordinates: [lon, lat] }] });
  return { title: 'EONET Events', events: [e('EONET_T1', 'Ridge Fire, California', 'wildfires', 'Wildfires', -120.5, 38.6, 20, 'InciWeb'),
    e('EONET_T2', 'Etna Volcano, Italy', 'volcanoes', 'Volcanoes', 14.99, 37.75, 50, 'SIVolcano'),
    e('EONET_T3', 'Tropical Storm Test', 'severeStorms', 'Severe Storms', 130.2, 15.1, 6, 'JTWC'),
    e('EONET_T4', 'Iceberg T9', 'seaLakeIce', 'Sea and Lake Ice', 99.6, -65.7, 40, 'NATICE')] };
}

export function gdacs(now = Date.now()) {
  const g = (type, id, level, name, country, lon, lat, hAgo) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] },
    properties: { eventtype: type, eventid: id, episodeid: id + 1, name, description: name, alertlevel: level, country, fromdate: iso(now - hAgo * H).slice(0, 19), todate: iso(now - hAgo * H / 2).slice(0, 19), datemodified: iso(now - H).slice(0, 19),
      url: { report: `https://www.gdacs.org/report.aspx?eventid=${id}&eventtype=${type}` }, severitydata: { severity: 1, severitytext: `${level} test severity`, severityunit: '' } } });
  return { type: 'FeatureCollection', features: [g('FL', 1103001, 'Orange', 'Flood in Nigeria', 'Nigeria', 7.5, 9.1, 60), g('EQ', 1574979, 'Green', 'Earthquake in United States', 'United States', -172.79, 51.70, 2), g('TC', 1001200, 'Red', 'Tropical Cyclone TEST-26', 'Philippines', 127.0, 13.0, 30)] };
}

// One Atlantic storm (AT1): forecast points every 12 h to +120 h, and a simple cone.
export function nhcPoints(now = Date.now()) {
  const adv = Math.floor(now / (6 * H)) * 6 * H - 3 * H;
  const pts = [0, 12, 24, 36, 48, 72, 96, 120].map(tau => ({ tau, lon: -60 - tau * 0.12, lat: 18 + tau * 0.06 }));
  return { type: 'FeatureCollection', features: pts.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
    properties: { stormname: 'Testa', stormtype: p.tau < 24 ? 'TS' : 'HU', dvlbl: p.tau < 24 ? 'S' : 'H', basin: 'al', advdate: '500 AM AST Sat Oct 31 2026', advisnum: '7', fcstprd: 120, gust: 60 + p.tau / 2, maxwind: 50 + p.tau / 3, mslp: 1000 - p.tau / 6, ssnum: 0, tcdir: 290, tcspd: 12, lat: p.lat, lon: p.lon, stormnum: 21, tau: p.tau, timezone: 'AST', validtime: ddhhmm(adv + p.tau * H), binnumber: 'AT1' } })) };
}
export function nhcCone() {
  const ring = [[-60, 17.5], [-62, 21], [-75, 26.5], [-76, 25.5], [-75, 22.5], [-62, 16.5], [-60, 17.5]];
  return { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: { stormname: 'Testa' } }] };
}
const EMPTY = { type: 'FeatureCollection', features: [] };

// Serve the samples instead of the live hosts. modes: {usgs, eonet, gdacs, nhc}: 'sample' (default),
// 'down' (HTTP 503), 'empty', or 'live' (don't intercept). nhc: 'storm' | 'none' | 'down' | 'live'.
export async function route(page, modes = {}) {
  const json = (r, body, status = 200) => r.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  const serve = (key, pattern, make, empty) => {
    const m = modes[key] || 'sample';
    if (m === 'live') return;
    return page.route(pattern, r => m === 'down' ? json(r, { error: 'test: source down' }, 503) : json(r, m === 'empty' || m === 'none' ? empty : make(r)));
  };
  await serve('usgs', 'https://earthquake.usgs.gov/**', () => usgs(), { ...usgs(), features: [] });
  await serve('eonet', 'https://eonet.gsfc.nasa.gov/**', () => eonet(), { events: [] });
  await serve('gdacs', 'https://www.gdacs.org/**', () => gdacs(), EMPTY);
  await serve('nhc', 'https://mapservices.weather.noaa.gov/**', r => {
    const id = +new URL(r.request().url()).pathname.match(/MapServer\/(\d+)/)[1];
    return id === 6 ? nhcPoints() : id === 8 ? nhcCone() : EMPTY;
  }, EMPTY);
}
