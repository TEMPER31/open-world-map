// Module worker: builds sample frames and colours field images off the main thread.

import { frame } from './sample-data.js';
import { loadScales } from './scales.js';
import { colorize, IMG } from './colorize.js';

const ready = loadScales();

onmessage = async ({ data: m }) => {
  await ready;
  try {
    if (m.type === 'frame') {
      postMessage({ id: m.id, result: frame(m.t) });
    } else if (m.type === 'pixels') {
      const px = colorize(frame(m.t), m.field, m.light, new Uint8ClampedArray(IMG * IMG * 4));
      postMessage({ id: m.id, result: px }, [px.buffer]);
    }
  } catch (e) {
    postMessage({ id: m.id, error: String(e) });
  }
};
