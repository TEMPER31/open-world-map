// Unit tests for display-unit conversions and distances (site/js/units.js). No dependencies.
//   node scripts/data/unit-tests.mjs
import { setUnits, conv, label, fmtDist, scaleBar, haversineKm, greatCircle, PRESETS, presetOf, defaultPreset } from '../../site/js/units.js';

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

console.log(`\n${n - fail} / ${n} passed`);
process.exit(fail ? 1 : 0);
