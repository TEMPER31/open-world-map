// One clock for every layer. The page has a single time value, state.t: hours from "Now",
// always a frame time (hourly to f120, then every 3 h). The field, wind particles, isobars, H/L
// labels, probe, place panel and chart all read it; future layers (events, Phase 5) plug in here.
//
//   import { onTime, getValidTime } from './clock.js';
//   const off = onTime(({ t, valid }) => draw(valid)); // now, then on every change; off() stops
//   getValidTime()        valid time shown on the map (ms since epoch, UTC)
//   getT() / setTime(t)   hours from Now (setTime snaps to the nearest frame)
//   stamp(layer, t)       a layer records the time it is drawing (t, or null when hidden)
//   layerTimes()          {layer: ISO valid time} of everything visible (render tests)

import * as S from './state.js';

let base = 0, snap = t => t;
const shown = {};

export function initClock(opts) { base = opts.base; snap = opts.snap; }
export const getT = () => S.get('t');
export const validOf = t => base + t * 3600e3;
export const getValidTime = () => validOf(getT());
export const setTime = t => S.set({ t: snap(t, 0) });
export const onTime = fn => S.on(['t'], s => fn({ t: s.t, valid: validOf(s.t) }));
export function stamp(layer, t) { if (t == null) delete shown[layer]; else shown[layer] = t; }
export const layerTimes = () => Object.fromEntries(Object.entries(shown).map(([k, t]) => [k, new Date(validOf(t)).toISOString()]));
