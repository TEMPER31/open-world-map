// Module worker: decodes forecast frames and colours fields off the main thread.

import * as core from './data-core.js';

let ready = null;

onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'init') { ready = core.init(m.manifestUrl); await ready; return postMessage({ id: m.id, result: true }); }
    await ready;
    if (m.type === 'grid') {
      postMessage({ id: m.id, result: await core.grid(m.f, m.field) });
    } else if (m.type === 'pixels') {
      const px = await core.pixels(m.f, m.field, m.light);
      postMessage({ id: m.id, result: px }, [px.buffer]);
    } else if (m.type === 'windtex') {
      const w = await core.windTexture(m.f);
      postMessage({ id: m.id, result: w }, [w.rgba.buffer]);
    } else if (m.type === 'isobars') {
      postMessage({ id: m.id, result: await core.pressureOverlays(m.f) });
    } else if (m.type === 'series') {
      postMessage({ id: m.id, result: await core.pointSeriesAt(m.lon, m.lat) });
    }
  } catch (e) {
    postMessage({ id: m.id, error: String(e) });
  }
};
