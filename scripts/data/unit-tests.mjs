// Unit tests for display-unit conversions and distances (site/js/units.js), place search,
// the lat/lon parser and the nearest place (site/js/places.js, on site/data/places.json), and
// sunrise and sunset (site/js/sun.js). No dependencies.
//   node scripts/data/unit-tests.mjs
import { readFileSync } from 'node:fs';
import { setUnits, conv, label, fmtDist, scaleBar, haversineKm, greatCircle, PRESETS, presetOf, defaultPreset } from '../../site/js/units.js';
import { fold, indexOf, search, parseLatLon, nearest, nearText, placeLabel } from '../../site/js/places.js';
import { sunTimes } from '../../site/js/sun.js';

let fail = 0, n = 0;
const near = (name, got, want, tol) => { n++; const ok = Math.abs(got - want) <= tol; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${got} (want ${want} ± ${tol})`); };
const eq = (name, got, want) => { n++; const ok = got === want; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${JSON.stringify(got)}${ok ? '' : ` (want ${JSON.stringify(want)})`}`); };

// temperature
setUnits({ temp: 'F' });
near('0 °C -> °F', conv('temp', 0), 32, 1e-9);
near('100 °C -> °F', conv('temp', 100), 212, 1e-9);
near('-40 °C -> °F', conv('temp', -40), -40, 1e-9);
eq('°F label', label('temp'), '°F');
setUnits({ temp: 'C' });
near('20 °C stays', conv('temp', 20), 20, 0);
// wind speed (data in km/h)
setUnits({ speed: 'mph' }); near('100 km/h -> mph', conv('speed', 100), 62.1371, 1e-4);
setUnits({ speed: 'ms' }); near('36 km/h -> m/s', conv('speed', 36), 10, 1e-9);
setUnits({ speed: 'kn' }); near('100 km/h -> kn', conv('speed', 100), 53.9957, 1e-4);
eq('kn label', label('speed'), 'kn');
setUnits({ speed: 'kmh' }); near('km/h stays', conv('speed', 50), 50, 0);
// distance (data in km)
setUnits({ dist: 'mi' }); near('1.609344 km -> mi', conv('dist', 1.609344), 1, 1e-12);
eq('fmtDist 5570 km in mi', fmtDist(5570), '3,461 mi');
eq('fmtDist 0.05 km in mi -> ft', fmtDist(0.05), '164 ft');
setUnits({ dist: 'km' });
eq('fmtDist 5570 km', fmtDist(5570), '5,570 km');
eq('fmtDist 0.25 km -> m', fmtDist(0.25), '250 m');
eq('fmtDist 3.456 km', fmtDist(3.456), '3.46 km');
// scale bar: a round number in the display unit that fits
eq('scale bar 1 km/px, 100 px max (km)', scaleBar(1000)[0], '100 km');
setUnits({ dist: 'mi' });
const [sl, spx] = scaleBar(1000);
eq('scale bar 1 km/px (mi) label', sl, '50 mi');
near('scale bar 50 mi width px', spx, 80.4672, 1e-3);
setUnits({ dist: 'km' });
// presets
eq('preset of US units', presetOf(PRESETS.us), 'us');
eq('preset of metric', presetOf(PRESETS.metric), 'metric');
eq('custom mix', presetOf({ temp: 'C', speed: 'kn', dist: 'km' }), 'custom');
eq('en-US default', defaultPreset('en-US'), 'us');
eq('en-GB default', defaultPreset('en-GB'), 'metric');
eq('de-DE default', defaultPreset('de-DE'), 'metric');
// great circle: London -> New York ~ 5,570 km (3,461 mi), within 0.5 %
const L = [-0.1278, 51.5074], NY = [-74.0060, 40.7128];
const d = haversineKm(L, NY);
near('London -> New York km', d, 5570, 5570 * 0.005);
near('London -> New York mi', d / 1.609344, 3461, 3461 * 0.005);
near('quarter meridian (pole to equator) km', haversineKm([0, 0], [0, 90]), 10007.5, 1);
const gc = greatCircle(L, NY, 64);
near('great-circle path ends at New York (lon)', gc[gc.length - 1][0], NY[0], 1e-6);
// highest latitude of the path vs Clairaut's relation, from the initial bearing at London
const r = x => x * Math.PI / 180, y = Math.sin(r(NY[0] - L[0])) * Math.cos(r(NY[1])), x = Math.cos(r(L[1])) * Math.sin(r(NY[1])) - Math.sin(r(L[1])) * Math.cos(r(NY[1])) * Math.cos(r(NY[0] - L[0]));
const vertex = Math.acos(Math.abs(Math.sin(Math.atan2(y, x)) * Math.cos(r(L[1])))) * 180 / Math.PI;
near('great-circle path: highest latitude matches Clairaut vertex', Math.max(...gc.map(p => p[1])), vertex, 0.05);
const pac = greatCircle([170, 0], [-170, 0], 8);
eq('crossing 180°: longitudes stay continuous', pac.every((p, i) => !i || Math.abs(p[0] - pac[i - 1][0]) < 10), true);

// place search: accents and case ignored; starts-with before contains, then population
eq('fold accents and case', fold('São Paulo'), 'sao paulo');
eq('fold letters without a combining accent', fold('Łódź Æbeltoft Straße'), 'lodz aebeltoft strasse');
eq('fold dotted capital I', fold('İstanbul'), 'istanbul');
eq('fold punctuation', fold("St. Louis, Winston-Salem, N'Djamena"), 'st louis winston salem ndjamena');
const mini = indexOf({ regions: [['US', 'MO', 'Missouri'], ['US', 'KS', 'Kansas'], ['FR', '11', 'Île-de-France'], ['BR', '27', 'São Paulo']], places: [
  ['Kansas City', 1, 39.11, -94.63, 156607], ['Kansas City', 0, 39.1, -94.58, 508090], ['Arkansas City', 1, 37.06, -97.04, 11839],
  ['Paris', 2, 48.85, 2.35, 2138551], ['Comparis', 2, 48.9, 2.4, 9000000], ['Le Pré-Saint-Gervais', 2, 48.89, 2.4, 17000], ['São Paulo', 3, -23.55, -46.64, 10021295]] });
const names = r => r.map(placeLabel).join(' | ');
eq('starts-with ranks above a larger place that only contains it', names(search(mini, 'paris')), 'Paris, Île-de-France, FR | Comparis, Île-de-France, FR');
eq('ties broken by population', names(search(mini, 'Kansas City')), 'Kansas City, Missouri, US | Kansas City, Kansas, US | Arkansas City, Kansas, US');
eq('contains, after starts-with', names(search(mini, 'kansas')), 'Kansas City, Missouri, US | Kansas City, Kansas, US | Arkansas City, Kansas, US');
eq('accents and case ignored', names(search(mini, 'SAO PAULO')), 'São Paulo, São Paulo, BR');
eq('hyphens match spaces', names(search(mini, 'pre saint')), 'Le Pré-Saint-Gervais, Île-de-France, FR');
eq('region code after the name', names(search(mini, 'kansas city mo')), 'Kansas City, Missouri, US');
eq('region name after a comma', names(search(mini, 'Kansas City, Missouri')), 'Kansas City, Missouri, US');
eq('country code after the name', names(search(mini, 'sao paulo br')), 'São Paulo, São Paulo, BR');
eq('fewer than 2 characters: no search', search(mini, 'p').length, 0);
eq('no match: empty', search(mini, 'qqq').length, 0);
const many = indexOf({ regions: [['US', 'MO', 'Missouri']], places: Array.from({ length: 20 }, (_, i) => [`Town ${i}`, 0, 0, 0, i]) });
eq('at most 8 suggestions, largest first', search(many, 'town').map(p => p.name).join(), 'Town 19,Town 18,Town 17,Town 16,Town 15,Town 14,Town 13,Town 12');
// the real index (site/data/places.json, GeoNames cities5000)
const idx = indexOf(JSON.parse(readFileSync(new URL('../../site/data/places.json', import.meta.url), 'utf8')));
const top = q => { const r = search(idx, q); return r.length ? placeLabel(r[0]) : null; };
eq('index: Kansas City MO', top('Kansas City MO'), 'Kansas City, Missouri, US');
eq('index: Kansas City (Missouri first)', top('Kansas City'), 'Kansas City, Missouri, US');
eq('index: Kansas City then Kansas City KS', placeLabel(search(idx, 'Kansas City')[1]), 'Kansas City, Kansas, US');
eq('index: Miami', top('Miami'), 'Miami, Florida, US');
eq('index: Denver', top('Denver'), 'Denver, Colorado, US');
eq('index: London', top('London'), 'London, England, GB');
eq('index: Delhi', top('Delhi'), 'Delhi, Delhi, IN');
eq('index: sao paulo (no accents typed)', top('sao paulo'), 'São Paulo, São Paulo, BR');
eq('index: 8 suggestions for "san"', search(idx, 'san').length, 8);
// lat, lon
const ll = t => JSON.stringify(parseLatLon(t));
eq('lat, lon with comma', ll('39.1, -94.58'), '{"lat":39.1,"lon":-94.58}');
eq('lat lon with a space', ll('39.1 -94.58'), '{"lat":39.1,"lon":-94.58}');
eq('degrees and hemispheres', ll('39.1° N, 94.58° W'), '{"lat":39.1,"lon":-94.58}');
eq('south and east', ll('33.87S 151.21E'), '{"lat":-33.87,"lon":151.21}');
eq('integers and plus sign', ll('+51, 0'), '{"lat":51,"lon":0}');
eq('latitude out of range', parseLatLon('91, 10')?.error, 'Latitude must be between -90 and 90.');
eq('longitude out of range', parseLatLon('10, 181')?.error, 'Longitude must be between -180 and 180.');
eq('beyond the map (86° N)', parseLatLon('86, 10')?.error, 'The map only reaches 85° north and south.');
eq('a name is not coordinates', parseLatLon('Kansas City'), null);
eq('one number is not coordinates', parseLatLon('12'), null);
eq('three numbers are not coordinates', parseLatLon('1 2 3'), null);
// nearest indexed place, labelled with distance in the display unit
eq('nearest: on Uniontown PA', nearText(nearest(idx, -79.72, 39.9)), 'Near Uniontown, Pennsylvania, US');
const off = nearest(idx, -94.58 + 0.15, 39.1 + 0.05);
eq('nearest: 12 km rounding (km)', nearText({ place: off.place, km: 12.4 }), `12 km from ${placeLabel(off.place)}`);
setUnits({ dist: 'mi' });
eq('nearest: distance follows the unit (mi)', nearText({ place: off.place, km: 12.4 }), `8 mi from ${placeLabel(off.place)}`);
setUnits({ dist: 'km' });
eq('nearest: nothing within 100 km (mid-Atlantic)', nearest(idx, -30, 0), null);
near('nearest: distance is the great-circle distance', nearest(idx, -79.72, 40.0).km, haversineKm([-79.72, 40.0], [nearest(idx, -79.72, 40.0).place.lon, nearest(idx, -79.72, 40.0).place.lat]), 1e-9);
eq('nearest: across the 180° meridian (Savusavu, Fiji, from both sides)', [179.99, -179.99].map(lon => nearest(idx, lon, -16.8)?.place.name).join(), 'Savusavu,Savusavu');

// sunrise and sunset (NOAA solar formulas): times in UTC, minutes of tolerance
const day = d => Date.parse(d + 'T00:00Z'), min = (a, b) => (a - Date.parse(b)) / 60e3;
const kc = sunTimes(39.0997, -94.5786, day('2026-11-10'));
near('Kansas City MO, 10 Nov 2026: sunrise 12:56 UTC (06:56 CST)', min(kc.rise, '2026-11-10T12:56Z'), 0, 2);
near('Kansas City MO, 10 Nov 2026: sunset 23:08 UTC (17:08 CST)', min(kc.set, '2026-11-10T23:08Z'), 0, 2);
const ldn = sunTimes(51.5074, -0.1278, day('2026-11-10'));
near('London, 10 Nov 2026: sunrise 07:10 UTC', min(ldn.rise, '2026-11-10T07:10Z'), 0, 2);
near('London, 10 Nov 2026: sunset 16:18 UTC', min(ldn.set, '2026-11-10T16:18Z'), 0, 2);
// independent of any table: equinox day at the equator is 12 h plus ~7 min (sun's radius and
// refraction at both ends); solar noon at 0° falls at 12:00 minus the equation of time (about -7.5 min on 20 Mar)
const e0 = sunTimes(0, 0, day('2026-03-20'));
near('Equator, March equinox: day length 12 h 7 min', (e0.set - e0.rise) / 60e3, 727, 2);
near('Equator, March equinox: solar noon 12:07 UTC', min((e0.rise + e0.set) / 2, '2026-03-20T12:07:30Z'), 0, 1);
const syd = sunTimes(-33.8688, 151.2093, day('2026-06-21'));
near('Sydney, June solstice: shortest day 9 h 54 min', (syd.set - syd.rise) / 60e3, 594, 3);
eq('Sydney: sunrise falls on its own morning (20 Jun 20:59 UTC = 21 Jun 06:59 AEST)', new Date(syd.rise).toISOString().slice(0, 13), '2026-06-20T20');
// polar: Tromsø's polar night runs from about 27-28 Nov to 14-15 Jan; Longyearbyen's midnight
// sun from about 19-20 Apr to 23 Aug
eq('Tromsø 21 Dec: the sun does not rise', sunTimes(69.6492, 18.9553, day('2026-12-21')).polar, 'night');
eq('Tromsø 27 Nov: last sunrise before the polar night', typeof sunTimes(69.6492, 18.9553, day('2026-11-27')).rise, 'number');
eq('Tromsø 28 Nov: polar night', sunTimes(69.6492, 18.9553, day('2026-11-28')).polar, 'night');
eq('Tromsø 15 Jan 2027: first sunrise', typeof sunTimes(69.6492, 18.9553, day('2027-01-15')).rise, 'number');
eq('Longyearbyen 21 Jun: the sun does not set', sunTimes(78.2232, 15.6267, day('2026-06-21')).polar, 'day');
eq('Longyearbyen 17 Apr: still sets', typeof sunTimes(78.2232, 15.6267, day('2026-04-17')).set, 'number');
eq('Longyearbyen 18 Apr: rises but does not set (midnight sun begins)', JSON.stringify(Object.values(sunTimes(78.2232, 15.6267, day('2026-04-18'))).map(x => x == null ? null : 'time')), '["time",null]');
eq('Longyearbyen 20 Apr: midnight sun', sunTimes(78.2232, 15.6267, day('2026-04-20')).polar, 'day');
eq('Longyearbyen 25 Aug: sets again', typeof sunTimes(78.2232, 15.6267, day('2026-08-25')).set, 'number');

console.log(`\n${n - fail} / ${n} passed`);
process.exit(fail ? 1 : 0);
