// Stand-ins for Mapillary (tests and screenshots without a token): a fake token served as
// js/secrets.js, coverage vector tiles with one image dot and one sequence line at a given place
// (layer and field names as in the Mapillary docs read by sources-probe.mjs), the Graph API
// answer for that image and a small thumbnail. Minimal Mapbox Vector Tile encoder, no packages.
//   import { routePhotos } from './photo-fixtures.mjs'; await routePhotos(page, { at: [-73.9855, 40.758] });

const FAKE_TOKEN = 'MLY|1|test-not-a-real-token';
export const IMAGE_ID = '498763468214164';

const varint = n => { const b = []; n = BigInt(n); while (n > 127n) { b.push(Number(n & 127n) | 128); n >>= 7n; } b.push(Number(n)); return b; };
const zz = n => (n << 1) ^ (n >> 31);
const field = (no, wire, payload) => [...varint(no << 3 | wire), ...payload];
const bytes = (no, b) => field(no, 2, [...varint(b.length), ...b]);
const str = (no, s) => bytes(no, [...Buffer.from(s)]);
const packed = (no, arr) => bytes(no, arr.flatMap(varint));

// layer(name, [{props, type: 1 point | 2 line, pts: [[x, y], ...]}]) in tile units (extent 4096)
function layer(name, feats) {
  const keys = [], vals = [], kv = (k, v) => { let i = keys.indexOf(k); if (i < 0) i = keys.push(k) - 1; const vs = JSON.stringify(v); let j = vals.findIndex(x => JSON.stringify(x) === vs); if (j < 0) j = vals.push(v) - 1; return [i, j]; };
  const F = feats.map((f, n) => {
    const tags = Object.entries(f.props).flatMap(([k, v]) => kv(k, v));
    let x = 0, y = 0;
    const geom = [9, ...[f.pts[0]].flatMap(([a, b]) => { const r = [zz(a - x), zz(b - y)]; x = a; y = b; return r; })];
    if (f.type === 2) geom.push(2 | (f.pts.length - 1) << 3, ...f.pts.slice(1).flatMap(([a, b]) => { const r = [zz(a - x), zz(b - y)]; x = a; y = b; return r; }));
    return bytes(2, [...field(1, 0, varint(n + 1)), ...packed(2, tags), ...field(3, 0, varint(f.type)), ...packed(4, geom)]);
  });
  const V = vals.map(v => bytes(4, typeof v === 'string' ? str(1, v) : field(4, 0, varint(v))));
  return bytes(3, [...field(15, 0, varint(2)), ...str(1, name), ...F.flat(), ...keys.flatMap(k => str(3, k)), ...V.flat(), ...field(5, 0, varint(4096))]);
}

// The tile z/x/y with the image at lon/lat (if it falls inside), a line through it, an overview dot.
export function tile(z, x, y, [lon, lat]) {
  const n = 2 ** z, px = ((lon + 180) / 360 * n - x) * 4096;
  const py = ((1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2 * n - y) * 4096;
  if (px < 0 || px >= 4096 || py < 0 || py >= 4096) return Buffer.alloc(0);
  const p = [Math.round(px), Math.round(py)], t = 1793000000000;
  return Buffer.from([
    ...layer('overview', [{ type: 1, pts: [p], props: { captured_at: t, creator_id: 1, id: 7, sequence_id: 'seq1', is_pano: false } }]),
    ...layer('sequence', [{ type: 2, pts: [[p[0] - 300, p[1]], p, [p[0] + 300, p[1]]], props: { captured_at: t, creator_id: 1, id: 'seq1', image_id: IMAGE_ID, is_pano: false } }]),
    ...layer('image', [{ type: 1, pts: [p], props: { captured_at: t, compass_angle: 90, creator_id: 1, id: +IMAGE_ID, sequence_id: 'seq1', is_pano: false } }])
  ]);
}

// 4x3 grey PNG (thumbnail stand-in)
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAAEElEQVR4nGOIyquAIwacHAAjTg8BdDh92gAAAABJRU5ErkJggg==', 'base64');

// modes: graph 'ok' | 'error' | 'none'; token: true (fake token) | false (empty: "unavailable")
// tiles: 'ok' | 'limit' (HTTP 429, as when the daily tile limit is reached) | 'rejected' (HTTP 403) |
// 'blocked' (request fails with no status, as a 4xx without CORS headers does in a browser);
// graph: also 'token' (code 190, token rejected).
export async function routePhotos(page, { at = [-73.9855, 40.758], graph = 'ok', token = true, tiles = 'ok' } = {}) {
  await page.route('**/js/secrets.js', r => r.fulfill({ contentType: 'text/javascript', body: `export const MAPILLARY_TOKEN = '${token ? FAKE_TOKEN : ''}';\n` }));
  await page.route('https://tiles.mapillary.com/**', r => {
    if (tiles === 'blocked') return r.abort('failed'); // a 4xx without CORS headers, as the browser sees it
    if (tiles !== 'ok') return r.fulfill({ status: tiles === 'limit' ? 429 : 403, contentType: 'text/html', body: '' });
    const [z, x, y] = new URL(r.request().url()).pathname.split('/').slice(-3).map(Number);
    r.fulfill({ status: 200, contentType: 'application/x-protobuf', headers: { 'access-control-allow-origin': '*' }, body: tile(z, x, y, at) });
  });
  await page.route('https://graph.mapillary.com/**', r => r.fulfill({ status: graph === 'error' || graph === 'token' ? (graph === 'token' ? 401 : 500) : 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(graph === 'token' ? { error: { message: 'Invalid OAuth 2.0 Access Token', type: 'MLYApiException', code: 190 } } : graph === 'error' ? { error: { message: 'test: Graph API down', code: 1 } } : graph === 'none' ? { id: IMAGE_ID } :
      { id: IMAGE_ID, thumb_1024_url: 'https://scontent.mapillary-test.invalid/thumb.png', captured_at: 1793000000000, creator: { username: 'test_mapper', id: '1' }, geometry: { type: 'Point', coordinates: at } }) }));
  await page.route('https://scontent.mapillary-test.invalid/**', r => r.fulfill({ contentType: 'image/png', body: PNG, headers: { 'access-control-allow-origin': '*' } }));
}
