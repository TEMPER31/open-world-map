// Sunrise and sunset from NOAA's published solar position formulas (the NOAA Solar Calculator
// and its spreadsheet: Meeus, "Astronomical Algorithms"). Worked out in the browser; no request.
// No DOM: also imported by scripts/data/unit-tests.mjs.

const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
// The sun's centre 0.833° below the horizon: its radius plus standard refraction.
const ZENITH = 90.833;

// Declination (degrees) and equation of time (minutes) at a moment (ms since epoch, UTC).
function solar(ms) {
  const T = (ms / 864e5 + 2440587.5 - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(rad(M)) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(rad(2 * M)) * (0.019993 - 0.000101 * T) + Math.sin(rad(3 * M)) * 0.000289;
  const omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(rad(omega));
  const decl = deg(Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda))));
  const y = Math.tan(rad(eps / 2)) ** 2;
  const eot = 4 * deg(y * Math.sin(2 * rad(L0)) - 2 * e * Math.sin(rad(M)) + 4 * e * y * Math.sin(rad(M)) * Math.cos(2 * rad(L0))
    - 0.5 * y * y * Math.sin(4 * rad(L0)) - 1.25 * e * e * Math.sin(2 * rad(M)));
  return { decl, eot };
}

// Sunrise and sunset for latitude lat and longitude lon (east positive) on the day whose mean
// solar noon falls in the UTC calendar day starting at day0 (ms, 00:00 UTC). Returns {rise, set}
// in ms (UTC); either is null when the sun stays up through that half of the day (the day
// midnight sun starts or ends). {polar: 'night'}: below the horizon all day; {polar: 'day'}:
// above it all day.
export function sunTimes(lat, lon, day0) {
  const noon = day0 + (720 - 4 * lon) * 60e3;
  const cosH = (ms, decl = solar(ms).decl) => Math.cos(rad(ZENITH)) / (Math.cos(rad(lat)) * Math.cos(rad(decl))) - Math.tan(rad(lat)) * Math.tan(rad(decl));
  if (cosH(noon) > 1) return { polar: 'night' };
  const event = sign => {
    // start from the sun's lowest point on this side of noon: if it is above the horizon even
    // there, there is no sunrise (or sunset) in this half of the day
    let ms = noon - sign * 12 * 3600e3;
    if (cosH(ms) < -1) return null;
    for (let i = 0; i < 3; i++) {
      const { decl, eot } = solar(ms), c = Math.max(-1, Math.min(1, cosH(ms, decl)));
      ms = day0 + (720 - 4 * (lon + sign * deg(Math.acos(c))) - eot) * 60e3;
    }
    return ms;
  };
  const rise = event(1), set = event(-1);
  return rise == null && set == null ? { polar: 'day' } : { rise, set };
}
