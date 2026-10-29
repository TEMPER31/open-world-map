// Weather field as a MapLibre custom layer, coloured on the GPU.
//
// The data texture holds, per grid cell, the field value as 16 bits over a fixed range
// (R = high, G = low byte; log units for precipitation) and a mask (B: 255 = data,
// 0 = transparent). The fragment shader works out each screen pixel's lon/lat (flat Mercator,
// no rotation or pitch), interpolates the grid bilinearly (mask-weighted, so transparent cells
// don't pull values towards zero), maps the value onto a 1024 x 1 colour LUT texture and, for
// pressure, draws the isobars itself: a line wherever the value crosses a multiple of 4 hPa,
// sized in screen pixels from the local gradient. Changing the hour uploads one small
// texture; changing Light/Dark only swaps the LUT. Pixels stay sharp at any zoom, and nothing
// is handed to MapLibre's GeoJSON pipeline. H/L labels are a small WebGL symbol layer.

import { lut, LUT_N } from './scales.js';
import { viewRect } from './grid.js';
import { FIELD_BEFORE } from './basemaps.js';

const EMPTY = { type: 'FeatureCollection', features: [] };
const QUAD = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

const VS = `
attribute vec2 a_pos; varying vec2 v_pos;
void main() { v_pos = vec2(a_pos.x, 1.0 - a_pos.y); gl_Position = vec4(2.0 * a_pos - 1.0, 0.0, 1.0); }`;

const FS = `
precision highp float;
uniform sampler2D u_data; uniform sampler2D u_lut;
uniform vec2 u_res;          // grid nx, ny
uniform vec3 u_grid;         // lon0, lat0, deg
uniform vec4 u_view;         // west lon, lon span, north mercator y, mercator y span
uniform vec4 u_range;        // stored range lo, hi; LUT domain a, b (same units)
uniform vec4 u_iso;          // isobars: on, interval, major every, line alpha scale
uniform vec3 u_ink;          // isobar colour
uniform vec2 u_px;           // one screen pixel in v_pos units
uniform float u_opacity;
varying vec2 v_pos;          // 0..1 across the screen, y down
vec2 cell(float i, float j) {    // (value * mask, mask), value in 0..1 of the stored range
  vec4 c = texture2D(u_data, (vec2(mod(i, u_res.x), clamp(j, 0.0, u_res.y - 1.0)) + 0.5) / u_res);
  return vec2((c.r * 65280.0 + c.g * 255.0) / 65535.0 * c.b, c.b);
}
vec2 sampleAt(vec2 pos) {        // (value in stored units, mask)
  float lon = u_view.x + pos.x * u_view.y;
  float my = u_view.z - pos.y * u_view.w;
  float lat = degrees(atan((exp(my) - exp(-my)) * 0.5));
  vec2 g = vec2((lon - u_grid.x) / u_grid.z, (u_grid.y - lat) / u_grid.z);
  vec2 b = floor(g), f = g - b;
  vec2 v = mix(mix(cell(b.x, b.y), cell(b.x + 1.0, b.y), f.x), mix(cell(b.x, b.y + 1.0), cell(b.x + 1.0, b.y + 1.0), f.x), f.y);
  return vec2(u_range.x + v.x / max(v.y, 1e-6) * (u_range.y - u_range.x), v.y);
}
void main() {
  vec2 s = sampleAt(v_pos);
  if (s.y < 0.02) discard;
  vec4 c = texture2D(u_lut, vec2(clamp((s.x - u_range.z) / (u_range.w - u_range.z), 0.0, 1.0), 0.5));
  float a = c.a * smoothstep(0.25, 0.75, s.y) * u_opacity;
  vec3 rgb = c.rgb;
  if (u_iso.x > 0.5) {
    // distance (in pixels) to the nearest isobar, from the value's screen-space gradient
    float gx = sampleAt(v_pos + vec2(u_px.x, 0.0)).x - s.x, gy = sampleAt(v_pos + vec2(0.0, u_px.y)).x - s.x;
    float level = floor(s.x / u_iso.y + 0.5) * u_iso.y;
    float d = abs(s.x - level) / max(length(vec2(gx, gy)), 1e-4);
    bool major = mod(level + 0.5, u_iso.z) < 1.0;
    float w = major ? 0.7 : 0.35;
    float line = (1.0 - smoothstep(w - 0.5, w + 0.5, d)) * (major ? 0.75 : 0.45) * u_iso.w;
    rgb = mix(rgb, u_ink, line);
    a = max(a, line * u_opacity);
  }
  gl_FragColor = vec4(rgb * a, a);
}`;

function compile(gl) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {};
  for (const n of ['u_data', 'u_lut', 'u_res', 'u_grid', 'u_view', 'u_range', 'u_iso', 'u_ink', 'u_px', 'u_opacity']) u[n] = gl.getUniformLocation(p, n);
  return { p, u, a_pos: gl.getAttribLocation(p, 'a_pos') };
}

function texture(gl, filter) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  for (const [k, v] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, filter], [gl.TEXTURE_MAG_FILTER, filter]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  return t;
}

// H/L plate drawn once into an image for the symbol layer.
function plateImage(light) {
  const w = 44, h = 30, data = new Uint8Array(w * h * 4);
  const [r, g, b, a] = light ? [247, 245, 239, 217] : [7, 9, 12, 191];
  for (let i = 0; i < w * h; i++) data.set([r, g, b, a], i * 4);
  return { width: w, height: h, data };
}

export class FieldGL {
  constructor() {
    this.id = 'field';
    this.type = 'custom';
    this.renderingMode = '2d';
    this.opacity = 1;
    this.visible = true;
    this.hasData = false;
  }

  onAdd(map, gl) {
    this.map = map;
    this.gl = gl;
    this.prog = compile(gl);
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    this.dataTex = texture(gl, gl.NEAREST);   // interpolated in the shader (wraps in longitude)
    this.lutTex = texture(gl, gl.LINEAR);
  }

  onRemove(map, gl) {
    gl.deleteTexture(this.dataTex);
    gl.deleteTexture(this.lutTex);
    gl.deleteBuffer(this.quad);
  }

  // Adds this layer plus the H/L label layer. Call once after the style has loaded.
  addTo(map) {
    this.map = map;
    map.addLayer(this, FIELD_BEFORE);
    map.addSource('hl', { type: 'geojson', data: EMPTY });
    map.addImage('hl-plate-dark', plateImage(false));
    map.addImage('hl-plate-light', plateImage(true));
    map.addLayer({
      id: 'hl', type: 'symbol', source: 'hl',
      layout: {
        'icon-image': 'hl-plate-dark', 'icon-allow-overlap': true, 'text-allow-overlap': true,
        'text-field': ['format', ['get', 'type'], { 'font-scale': 1.15 }, '\n', {}, ['get', 'value'], { 'font-scale': 0.8 }],
        'text-font': ['Noto Sans Bold'], 'text-size': 11, 'text-line-height': 1.1
      },
      paint: { 'text-color': ['case', ['==', ['get', 'type'], 'L'], '#9ec3ff', '#f1c48a'] }
    });
  }

  setLut(field, light) {
    const gl = this.gl, L = lut(field, light);
    gl.bindTexture(gl.TEXTURE_2D, this.lutTex);
    const f = L.banded ? gl.NEAREST : gl.LINEAR; // banded fields keep hard band edges
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    // design: non-veil fields at 90 % alpha on the Light basemap
    const rgba = new Uint8Array(L.rgba);
    if (light && field !== 'cloud') for (let i = 3; i < rgba.length; i += 4) rgba[i] = Math.round(rgba[i] * 0.9);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, LUT_N, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    this.map.triggerRepaint();
  }

  setData(tex) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tex.grid.nx, tex.grid.ny, 0, gl.RGBA, gl.UNSIGNED_BYTE, tex.rgba);
    this.grid = tex.grid;
    this.range = [...tex.store, ...tex.domain];
    this.hasData = true;
    this.map.triggerRepaint();
  }

  setVisible(on) { this.visible = on; this.map.triggerRepaint(); }

  // opacity: user setting x basemap factor; the field also fades a little at street zooms.
  setOpacity(o) { this.opacity = o; this.map.triggerRepaint(); }

  // Isobars (drawn in the shader) for pressure: interval and major spacing in hPa, or null.
  setIsobars(iso, light) {
    this.iso = iso;
    this.ink = light ? [21 / 255, 23 / 255, 26 / 255] : [1, 1, 1];
    this.map.triggerRepaint();
  }

  // ov = {centres} for pressure, or null to clear the H/L labels.
  setOverlays(ov, light) {
    const map = this.map;
    map.getSource('hl').setData(ov ? {
      type: 'FeatureCollection',
      features: ov.centres.map(c => ({ type: 'Feature', properties: { type: c.type, value: String(Math.round(c.value)) }, geometry: { type: 'Point', coordinates: [c.lon, c.lat] } }))
    } : EMPTY);
    map.setLayoutProperty('hl', 'icon-image', light ? 'hl-plate-light' : 'hl-plate-dark');
    map.setPaintProperty('hl', 'text-color', ['case', ['==', ['get', 'type'], 'L'], light ? '#2b4e9a' : '#9ec3ff', light ? '#8a4a1e' : '#f1c48a']);
  }

  render(gl) {
    if (!this.visible || !this.hasData) return;
    const z = this.map.getZoom(), k = z <= 5 ? 1 : z >= 10 ? 0.55 : 1 - 0.45 * (z - 5) / 5;
    const { p, u, a_pos } = this.prog, g = this.grid;
    gl.useProgram(p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(a_pos);
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.dataTex);
    gl.uniform1i(u.u_data, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.lutTex);
    gl.uniform1i(u.u_lut, 1);
    gl.uniform2f(u.u_res, g.nx, g.ny);
    gl.uniform3f(u.u_grid, g.lon0, g.lat0, g.deg);
    gl.uniform4f(u.u_view, ...viewRect(this.map));
    gl.uniform4f(u.u_range, ...this.range);
    const iso = this.iso;
    gl.uniform4f(u.u_iso, iso ? 1 : 0, iso?.interval || 4, iso?.majorEvery || 20, 1);
    gl.uniform3f(u.u_ink, ...(this.ink || [1, 1, 1]));
    const el = this.map.getCanvas();
    gl.uniform2f(u.u_px, 1 / el.clientWidth, 1 / el.clientHeight);
    gl.uniform1f(u.u_opacity, this.opacity * k);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
