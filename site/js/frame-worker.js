// Module worker: decodes forecast frames and builds field/wind textures off the main thread.

import * as core from './data-core.js';

let ready = null;

onmessage = async ({ data: m }) => {
  try {
    if (m.type === 'init') { ready = core.init(m.manifestUrl, m.manifest, m.scales); await ready; return postMessage({ id: m.id, result: true }); }
    await ready;
    if (m.type === 'grid') {
      postMessage({ id: m.id, result: await core.grid(m.f, m.field) });
    } else if (m.type === 'fieldtex') {
      const t = await core.fieldTexture(m.f, m.field);
      postMessage({ id: m.id, result: t }, [t.rgba.buffer]);
    } else if (m.type === 'windtex') {
      const w = await core.windTexture(m.f);
      postMessage({ id: m.id, result: w }, [w.rgba.buffer]);
    } else if (m.type === 'isobars') {
      postMessage({ id: m.id, result: await core.pressureOverlays(m.f) });
    } else if (m.type === 'point') {
      postMessage({ id: m.id, result: await core.point(m.f, m.fields, m.lon, m.lat) });
    } else if (m.type === 'series') {
      postMessage({ id: m.id, result: await core.pointSeriesAt(m.lon, m.lat) });
    }
  } catch (e) {
    postMessage({ id: m.id, error: String(e) });
  }
};
