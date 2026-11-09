// Quick View wording: plain rules from the forecast values, kept free of the page (no DOM) so the
// tests can call them directly. Our data has rain amounts, not rain chances: these rules only ever
// say when rain is expected and roughly how much, never a percentage.
//
// Each hour i covers the hour that ends at its valid time ms (GFS rain is the mean rate over the
// hour before each frame). Hour 0 is the hour ending at the Now frame, so it stands for "now".

// Thresholds (one place, used by every rule below):
export const QV = {
  RAIN_MM_H: 0.2, // an hour with >= 0.2 mm counts as rain (less is a trace in a ~50 km area average)
  CLOUDY_PCT: 70, // mean cloud cover >= 70 % is "cloudy"
  CLEAR_PCT: 30,  // mean cloud cover <= 30 % is "clear"
  HOURS: 12       // how far ahead Quick View looks (hourly frames)
};

export const wet = mm => mm != null && mm === mm && mm >= QV.RAIN_MM_H;

// "about 2 mm", "under 1 mm"
export const amountText = mm => mm < 1 ? 'under 1 mm' : `about ${Math.round(mm)} mm`;

// Sky from cloud cover: 'cloud' | 'part' | 'clear' (or null without data)
export const skyOf = pct => pct == null || pct !== pct ? null : pct >= QV.CLOUDY_PCT ? 'cloud' : pct <= QV.CLEAR_PCT ? 'clear' : 'part';

// hours: [{ms, rain, cloud}] with hours[0] = now (rain in mm over the hour, cloud in %; a value
// is null where it could not be loaded). time(ms): how a time is written ("15:00").
// Returns { takeaway, rain: {state: 'now' | 'soon' | 'none' | 'unknown', text, amount} }.
//   Raining now:  "Rain now, easing by {end of the last wet hour}" or "Rain now and through {last hour}"
//   Rain later:   "Rain expected from {start of the first wet hour}"
//   Dry:          "Dry and mostly clear" (mean cloud <= 30 %), "Dry but cloudy" (>= 70 %),
//                 otherwise "Dry with some cloud", "for the next 12 hours"
export function summarise(hours, time) {
  const n = hours.length - 1, span = `the next ${n} hour${n === 1 ? '' : 's'}`;
  const rains = hours.map(h => h.rain);
  if (n < 1 || rains.filter(v => v == null || v !== v).length > n / 2) {
    return { takeaway: 'Forecast details are not available for this place right now', rain: { state: 'unknown', text: 'Rain forecast not available', amount: '' } };
  }
  const ahead = rains.slice(1).reduce((a, v) => a + (v == null || v !== v ? 0 : v), 0);
  const amount = ahead >= QV.RAIN_MM_H ? `${amountText(ahead)} in ${span}` : '';
  if (wet(rains[0])) {
    // the first dry hour after now; rain eases by the end of the wet hour before it
    const dry = rains.findIndex((v, i) => i > 0 && v != null && !wet(v));
    const takeaway = dry < 0 ? `Rain now and through ${time(hours[n].ms)}` : dry === 1 ? 'Rain now, easing soon' : `Rain now, easing by ${time(hours[dry - 1].ms)}`;
    return { takeaway, rain: { state: 'now', text: 'Raining now', amount } };
  }
  const first = rains.findIndex((v, i) => i > 0 && wet(v));
  if (first > 0) {
    const at = time(hours[first - 1].ms); // the wet hour starts at the previous frame's time
    return { takeaway: `Rain expected from ${at}`, rain: { state: 'soon', text: `Rain from ${at}`, amount } };
  }
  const clouds = hours.map(h => h.cloud).filter(v => v != null && v === v);
  const mean = clouds.length ? clouds.reduce((a, b) => a + b, 0) / clouds.length : null, sky = skyOf(mean);
  const dry = sky === 'clear' ? 'Dry and mostly clear' : sky === 'cloud' ? 'Dry but cloudy' : sky ? 'Dry with some cloud' : 'Dry';
  return { takeaway: `${dry} for ${span}`, rain: { state: 'none', text: `No rain expected in ${span}`, amount: '' } };
}

// Is the sun up at (lon, lat) at time ms? Low-precision solar position (about 0.01°, Astronomical
// Almanac formulas), only used to draw a sun or a moon for clear spells.
export function sunUp(ms, lon, lat) {
  const r = Math.PI / 180, d = (ms - 946728000000) / 864e5; // days since J2000.0
  const g = (357.529 + 0.98560028 * d) * r, q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * r, e = (23.439 - 3.6e-7 * d) * r;
  const dec = Math.asin(Math.sin(e) * Math.sin(L)), ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const gmst = ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24;
  const ha = (gmst * 15 + lon) * r - ra;
  return Math.asin(Math.sin(lat * r) * Math.sin(dec) + Math.cos(lat * r) * Math.cos(dec) * Math.cos(ha)) > -0.833 * r;
}
