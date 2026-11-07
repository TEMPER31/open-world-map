// Freshness labels (Phase 6): for each layer, where it comes from, when it was updated and its
// grid, where the user reads it (legend, layers rail, place panel). Pure functions of the data
// metadata (data.js `meta`), so the render tests can check the live wording with any manifest.
// The optional manifest fields gfs.nomads_hours / gfs.aws_hours only add a tooltip.

import { fmtUTC } from './timeline.js';

const hhmm = ms => new Date(ms).toISOString().slice(11, 16);
const day = ms => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export const runLabel = ms => `${new Date(ms).toISOString().slice(11, 13)}Z ${day(ms)}`;

// Grid of each field as drawn (cloud and rain are stored as ~50 km area averages).
const gridOf = (meta, k) => {
  if (k === 'aq') return `${meta.aq?.grid?.deg ?? 4}° grid`;
  const deg = k === 'wind' ? meta.gfs?.wind_grid?.deg ?? 0.75 : meta.gfs?.grid?.deg ?? 0.5;
  return `${deg}° grid${k === 'cloud' || k === 'rain' ? ', area average' : ''}`;
};

// One line for field k: {text, title}. who: '' for the main field, else a prefix such as
// 'Clouds overlay' or 'Particles'.
export function fieldFresh(meta, k, who = '', sampleDeg = 1) {
  const pre = who ? `${who}: ` : '';
  if (!meta.live) return { text: `${pre}Sample data (generated, no update time) · ${sampleDeg}° grid`, title: 'Generated sample data' };
  if (k === 'aq') {
    if (!meta.aq) return { text: `${pre}CAMS via Open-Meteo · unavailable`, title: '' };
    return { text: `${pre}CAMS via Open-Meteo · Updated ${hhmm(meta.aqGenerated)} UTC ${day(meta.aqGenerated)} · ${gridOf(meta, k)}${meta.aqEnd ? ` · forecast ends ${fmtUTC(meta.aqEnd)}` : ''}`,
      title: `Air quality data built ${new Date(meta.aqGenerated).toISOString().replace('.000', '')}` };
  }
  const g = meta.gfs || {}, n = Array.isArray(g.nomads_hours) ? g.nomads_hours.length : null, a = Array.isArray(g.aws_hours) ? g.aws_hours.length : null;
  const hosts = n != null || a != null ? ` · forecast hours from NOAA NOMADS: ${n ?? 0}, from the AWS mirror: ${a ?? 0}` : '';
  return { text: `${pre}NOAA GFS · run ${runLabel(meta.run)} · Updated ${hhmm(meta.generated)} UTC · ${gridOf(meta, k)}`,
    title: `Data built ${new Date(meta.generated).toISOString().replace('.000', '')}${hosts}` };
}

// The place panel's source line: both models with their update times and grids.
export function placeFresh(meta) {
  const aq = meta.aq ? `air quality CAMS via Open-Meteo, Updated ${hhmm(meta.aqGenerated)} UTC ${day(meta.aqGenerated)}, ${gridOf(meta, 'aq')}` : 'air quality unavailable';
  return `NOAA GFS run ${runLabel(meta.run)}, Updated ${hhmm(meta.generated)} UTC: ${gridOf(meta, 'temp')} (wind ${gridOf(meta, 'wind')}) · ${aq}`;
}
