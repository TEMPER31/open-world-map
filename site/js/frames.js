// Frame + field-image provider. Uses a module worker when the browser supports one and
// falls back to the main thread otherwise. Phase 2 swaps the sample generator for
// fetched hourly files behind this same interface.

import { frame as localFrame } from './sample-data.js';
import { colorize, IMG } from './colorize.js';

let worker = null;
const pending = new Map();
let seq = 0;

try {
  worker = new Worker(new URL('./frame-worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const p = pending.get(data.id);
    pending.delete(data.id);
    if (p) data.error ? p.reject(new Error(data.error)) : p.resolve(data.result);
  };
  worker.onerror = e => { // e.g. no module-worker support: finish on the main thread
    e.preventDefault?.();
    worker = null;
    for (const p of pending.values()) p.reject(new Error('worker unavailable'));
    pending.clear();
  };
} catch { worker = null; }

function call(msg) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    worker.postMessage({ ...msg, id });
  });
}

const frames = new Map();

export async function getFrame(t) {
  if (frames.has(t)) return frames.get(t);
  let fr = null;
  if (worker) fr = await call({ type: 'frame', t }).catch(() => null);
  fr ||= localFrame(t);
  frames.set(t, fr);
  if (frames.size > 8) frames.delete(frames.keys().next().value);
  return fr;
}

// RGBA pixels (IMG x IMG, Web Mercator) of the coloured field.
export async function getPixels(t, field, light) {
  let px = null;
  if (worker) px = await call({ type: 'pixels', t, field, light }).catch(() => null);
  return px || colorize(await getFrame(t), field, light, new Uint8ClampedArray(IMG * IMG * 4));
}
