// Forecast data provider for the page. Loads data/live/manifest.json (real GFS + CAMS data
// built by the data job); without it, falls back to the labelled sample generator.
// Work happens in a module worker when available, otherwise on the main thread.

import * as core from './data-core.js';
import { loadScales } from './scales.js';
import { HOURS } from './config.js';

const MANIFEST = 'data/live/manifest.json';
const STALE_AFTER_H = 10;      // runs every 6 h, ~4 h after each cycle
const AQ_STALE_AFTER_H = 30;   // refreshed every ~12 h

let worker = null;
const pending = new Map();
let seq = 0;

function call(msg, transfer) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    worker.postMessage({ ...msg, id }, transfer || []);
  });
}

// The worker is created first and its modules load while the manifest downloads.
// Handlers are attached at once so a module that fails to load is never missed.
let failed = null;
function createWorker() {
  try { worker = new Worker(new URL('./frame-worker.js', import.meta.url), { type: 'module' }); } catch { worker = null; return; }
  failed = new Promise(res => { worker.onerror = e => { e.preventDefault?.(); res(false); }; });
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id);
    pending.delete(data.id);
    if (p) data.error ? p.reject(new Error(data.error)) : p.resolve(data.result);
  };
}

async function startWorker(manifestUrl, manifest, scales) {
  if (!worker) return false;
  const ok = await Promise.race([call({ type: 'init', manifestUrl, manifest, scales }).then(() => true, () => false), failed]);
  if (!ok) { worker.terminate(); worker = null; }
  return ok;
}

// Metadata describing what's on the timeline. t (timeline hour) maps to f = first + t.
export let meta = null;

export async function initData() {
  const now = Date.now();
  let manifest = null, error = null;
  createWorker();
  const scalesP = loadScales();
  try {
    const r = await fetch(MANIFEST, { cache: 'no-cache' });
    if (r.ok) manifest = await r.json(); else error = `HTTP ${r.status}`;
  } catch (e) { error = String(e); }
  const url = manifest ? new URL(MANIFEST, location.href).href : null, scales = await scalesP;
  if (!(await startWorker(url, manifest, scales))) { worker = null; await core.init(url, manifest, scales); }

  if (!manifest) {
    const base = Math.floor(now / 3600e3) * 3600e3;
    meta = { live: false, error, first: 0, hours: HOURS, base, run: base, generated: base, stale: false };
    return meta;
  }
  const run = Date.parse(manifest.gfs.run), last = Math.max(...manifest.gfs.frames.map(x => x.f));
  const first = Math.max(0, Math.min(last, Math.floor((now - run) / 3600e3)));
  const generated = Date.parse(manifest.generated_utc);
  const aqGen = manifest.aq ? Date.parse(manifest.aq.generated_utc) : null;
  meta = {
    live: true, manifest, run, generated, first, hours: last - first, base: run + first * 3600e3,
    gfs: manifest.gfs, aq: manifest.aq,
    stale: manifest.gfs.stale || (now - generated) / 3600e3 > STALE_AFTER_H,
    aqStale: !manifest.aq || manifest.aq.stale || (now - aqGen) / 3600e3 > AQ_STALE_AFTER_H,
    aqGenerated: aqGen
  };
  return meta;
}

const f = t => meta.first + t;

export const getGrid = (t, field) => worker ? call({ type: 'grid', f: f(t), field }) : core.grid(f(t), field);
export const getFieldTexture = (t, field) => worker ? call({ type: 'fieldtex', f: f(t), field }) : core.fieldTexture(f(t), field);
export const getPressureOverlays = t => worker ? call({ type: 'isobars', f: f(t) }) : core.pressureOverlays(f(t));
// {field: {v, u, w, aqi, missing} | null} at one place (probe and place panel).
export const getPoint = (t, fields, lon, lat) => worker ? call({ type: 'point', f: f(t), fields, lon, lat }) : core.point(f(t), fields, lon, lat);
export const getWindTexture = t => worker ? call({ type: 'windtex', f: f(t) }) : core.windTexture(f(t));

// [{t, temp, wind}] over the timeline, for the place chart.
export async function getSeries(lon, lat) {
  const s = worker ? await call({ type: 'series', lon, lat }) : await core.pointSeriesAt(lon, lat);
  return s.map(p => ({ t: p.f - meta.first, temp: p.temp, wind: p.wind })).filter(p => p.t >= 0 && p.t <= meta.hours);
}
