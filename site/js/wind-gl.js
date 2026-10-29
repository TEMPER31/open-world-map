// GPU wind particles as a MapLibre custom layer. Technique ported from mapbox/webgl-wind
// (ISC licence, (c) Vladimir Agafonkin): particle positions live in an RGBA texture and are
// advected by a fragment shader; trails come from fading the previous frame.
//
// Positions are kept in screen space (0..1 across the current view): the map is flat
// Mercator with no rotation or pitch, so screen -> lon/lat needs only the view's edges.
// Particles are re-seeded after every pan/zoom, which keeps them dense at any zoom.
// Particles move in the direction the wind blows TOWARDS (GFS U = eastward, V = northward).

const QUAD = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

const VS_QUAD = `
attribute vec2 a_pos; varying vec2 v_tex_pos;
void main() { v_tex_pos = a_pos; gl_Position = vec4(2.0 * a_pos - 1.0, 0.0, 1.0); }`;

const FS_SCREEN = `
precision mediump float;
uniform sampler2D u_screen; uniform float u_opacity; varying vec2 v_tex_pos;
void main() {
  vec4 c = texture2D(u_screen, v_tex_pos);
  // floor() makes trails fade to exactly zero instead of leaving a faint residue
  gl_FragColor = vec4(floor(255.0 * c * u_opacity) / 255.0);
}`;

const FS_UPDATE = `
precision highp float;
uniform sampler2D u_particles; uniform sampler2D u_wind;
uniform vec2 u_wind_res; uniform vec2 u_wind_min; uniform vec2 u_wind_max;
uniform vec4 u_grid;        // lon0, lat0, deg, unused
uniform vec4 u_view;        // west lon, lon span, north mercator y, mercator y span (radians)
uniform vec2 u_px;          // px per unit of (m/s) per frame, divided by viewport size
uniform float u_rand_seed; uniform float u_drop_rate; uniform float u_drop_rate_bump;
varying vec2 v_tex_pos;
const vec3 rc = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) { float t = dot(rc.xy, co); return fract(sin(t) * (rc.z + t)); }
vec2 texel(float i, float j) {
  return texture2D(u_wind, (vec2(mod(i, u_wind_res.x), clamp(j, 0.0, u_wind_res.y - 1.0)) + 0.5) / u_wind_res).rg;
}
vec2 wind_at(vec2 pos) {
  float lon = u_view.x + pos.x * u_view.y;
  float my = u_view.z - pos.y * u_view.w;
  float lat = degrees(atan((exp(my) - exp(-my)) * 0.5));
  vec2 g = vec2((lon - u_grid.x) / u_grid.z, (u_grid.y - lat) / u_grid.z);
  vec2 b = floor(g), f = g - b;
  vec2 w = mix(mix(texel(b.x, b.y), texel(b.x + 1.0, b.y), f.x), mix(texel(b.x, b.y + 1.0), texel(b.x + 1.0, b.y + 1.0), f.x), f.y);
  return mix(u_wind_min, u_wind_max, w);
}
void main() {
  vec4 c = texture2D(u_particles, v_tex_pos);
  vec2 pos = vec2(c.r / 255.0 + c.b, c.g / 255.0 + c.a);
  vec2 vel = wind_at(pos);
  pos += vec2(vel.x, -vel.y) * u_px;               // screen y grows southwards
  vec2 seed = (pos + v_tex_pos) * u_rand_seed;
  float speed_t = length(vel) / length(max(abs(u_wind_min), abs(u_wind_max)));
  float drop = step(1.0 - (u_drop_rate + speed_t * u_drop_rate_bump), rand(seed));
  if (pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0) drop = 1.0;
  pos = mix(pos, vec2(rand(seed + 1.3), rand(seed + 2.1)), drop);
  gl_FragColor = vec4(fract(pos * 255.0), floor(pos * 255.0) / 255.0);
}`;

const VS_DRAW = `
precision highp float;
attribute float a_index;
uniform sampler2D u_particles; uniform float u_res; uniform float u_size;
void main() {
  vec4 c = texture2D(u_particles, vec2(fract(a_index / u_res), floor(a_index / u_res) / u_res));
  vec2 pos = vec2(c.r / 255.0 + c.b, c.g / 255.0 + c.a);
  gl_PointSize = u_size;
  gl_Position = vec4(2.0 * pos.x - 1.0, 1.0 - 2.0 * pos.y, 0.0, 1.0);
}`;

const FS_DRAW = `
precision mediump float;
uniform vec4 u_color;   // premultiplied
void main() { gl_FragColor = u_color; }`;

function program(gl, vs, fs) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS), u = {};
  for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
  return { p, u, a_pos: gl.getAttribLocation(p, 'a_pos'), a_index: gl.getAttribLocation(p, 'a_index') };
}

function texture(gl, filter, data, w, h) {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  return t;
}

export class WindGL {
  constructor({ id = 'wind-particles', count = 65536 } = {}) {
    this.id = id;
    this.type = 'custom';
    this.renderingMode = '2d';
    this.count = count;
    this.fade = 0.95;          // trail fade per update (design: about 0.9; longer reads better at this density)
    this.speed = 1;
    this.color = [1, 1, 1, 0.6];
    this.running = false;
    this.moving = false;
    this.last = 0;
  }

  onAdd(map, gl) {
    this.map = map;
    this.gl = gl;
    this.pQuad = program(gl, VS_QUAD, FS_SCREEN);
    this.pUpdate = program(gl, VS_QUAD, FS_UPDATE);
    this.pDraw = program(gl, VS_DRAW, FS_DRAW);
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    this.fb = gl.createFramebuffer();
    this.setCount(this.count);
    this.onMoveStart = () => { this.moving = true; this.clearTrails = true; };
    this.onMoveEnd = () => { this.moving = false; this.seed(); this.clearTrails = true; this.kick(); };
    map.on('movestart', this.onMoveStart);
    map.on('moveend', this.onMoveEnd);
    this.loop = this.loop.bind(this);
  }

  onRemove(map, gl) {
    this.stop();
    map.off('movestart', this.onMoveStart);
    map.off('moveend', this.onMoveEnd);
    for (const t of [this.windTex, this.stateA, this.stateB, this.screenA, this.screenB]) if (t) gl.deleteTexture(t);
    gl.deleteFramebuffer(this.fb);
    gl.deleteBuffer(this.quad);
    gl.deleteBuffer(this.indexBuf);
  }

  setCount(n) {
    const gl = this.gl, res = Math.ceil(Math.sqrt(n));
    this.res = res;
    this.count = res * res;
    this.seed();
    const idx = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) idx[i] = i;
    if (this.indexBuf) gl.deleteBuffer(this.indexBuf);
    this.indexBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuf);
    gl.bufferData(gl.ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  }

  seed() {
    if (!this.gl) return;
    const gl = this.gl, state = new Uint8Array(this.res * this.res * 4);
    for (let i = 0; i < state.length; i++) state[i] = Math.floor(Math.random() * 256);
    if (this.stateA) { gl.deleteTexture(this.stateA); gl.deleteTexture(this.stateB); }
    this.stateA = texture(gl, gl.NEAREST, state, this.res, this.res);
    this.stateB = texture(gl, gl.NEAREST, state, this.res, this.res);
  }

  // rgba: Uint8Array (R = U, G = V) of grid.nx x grid.ny; u/v: [min, max] in m/s
  setWind(rgba, grid, u, v) {
    const gl = this.gl;
    if (this.windTex) gl.deleteTexture(this.windTex);
    this.windTex = texture(gl, gl.NEAREST, rgba, grid.nx, grid.ny);
    this.wind = { grid, u, v };
    this.kick();
  }

  setColor(rgba) { this.color = rgba; }

  start() { if (!this.running) { this.running = true; this.clearTrails = true; requestAnimationFrame(this.loop); } }
  stop() { this.running = false; this.clearTrails = true; this.map?.triggerRepaint(); }
  kick() { this.map?.triggerRepaint(); }

  loop(now) {
    if (!this.running) return;
    requestAnimationFrame(this.loop);
    if (document.hidden || this.moving || !this.wind) return;
    if (now - this.last < 32) return; // ~30 updates per second
    this.last = now;
    this.step = true;
    this.map.triggerRepaint();
  }

  resizeScreen(gl) {
    const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
    if (this.screenA && this.sw === w && this.sh === h) return;
    if (this.screenA) { gl.deleteTexture(this.screenA); gl.deleteTexture(this.screenB); }
    const empty = new Uint8Array(w * h * 4);
    this.screenA = texture(gl, gl.NEAREST, empty, w, h);
    this.screenB = texture(gl, gl.NEAREST, empty, w, h);
    this.sw = w; this.sh = h;
  }

  bindQuad(gl, prog) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(prog.a_pos);
    gl.vertexAttribPointer(prog.a_pos, 2, gl.FLOAT, false, 0, 0);
  }

  target(gl, tex, w, h) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
  }

  // Offscreen pass: advect particles and draw them onto the faded trail texture.
  prerender(gl) {
    this.resizeScreen(gl);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.CULL_FACE);
    if (this.clearTrails || !this.running) {
      for (const t of [this.screenA, this.screenB]) {
        this.target(gl, t, this.sw, this.sh);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      this.clearTrails = false;
    }
    if (!this.running || this.moving || !this.wind || !this.step) return;
    this.step = false;

    // 1. trails: previous frame, faded
    this.target(gl, this.screenB, this.sw, this.sh);
    gl.disable(gl.BLEND);
    gl.useProgram(this.pQuad.p);
    this.bindQuad(gl, this.pQuad);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.screenA);
    gl.uniform1i(this.pQuad.u.u_screen, 0);
    gl.uniform1f(this.pQuad.u.u_opacity, this.fade);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2. particles on top
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const d = this.pDraw;
    gl.useProgram(d.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.indexBuf);
    gl.enableVertexAttribArray(d.a_index);
    gl.vertexAttribPointer(d.a_index, 1, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateA);
    gl.uniform1i(d.u.u_particles, 0);
    gl.uniform1f(d.u.u_res, this.res);
    gl.uniform1f(d.u.u_size, Math.max(1, Math.round(window.devicePixelRatio || 1)));
    const [r, g, b, a] = this.color;
    gl.uniform4f(d.u.u_color, r * a, g * a, b * a, a);
    gl.drawArrays(gl.POINTS, 0, this.count);
    gl.disableVertexAttribArray(d.a_index);
    [this.screenA, this.screenB] = [this.screenB, this.screenA];

    // 3. advect
    this.target(gl, this.stateB, this.res, this.res);
    gl.disable(gl.BLEND);
    const u = this.pUpdate;
    gl.useProgram(u.p);
    this.bindQuad(gl, u);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stateA);
    gl.uniform1i(u.u.u_particles, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.windTex);
    gl.uniform1i(u.u.u_wind, 1);
    const { grid, u: ur, v: vr } = this.wind;
    gl.uniform2f(u.u.u_wind_res, grid.nx, grid.ny);
    gl.uniform2f(u.u.u_wind_min, ur[0], vr[0]);
    gl.uniform2f(u.u.u_wind_max, ur[1], vr[1]);
    gl.uniform4f(u.u.u_grid, grid.lon0, grid.lat0, grid.deg, 0);
    const bnd = this.map.getBounds(), merc = la => Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360));
    const yN = merc(bnd.getNorth()), yS = merc(bnd.getSouth());
    gl.uniform4f(u.u.u_view, bnd.getWest(), bnd.getEast() - bnd.getWest(), yN, yN - yS);
    // Visual speed: pixels per frame per m/s, growing gently with zoom (as in the design).
    const z = this.map.getZoom(), cssW = this.map.getCanvas().clientWidth, cssH = this.map.getCanvas().clientHeight;
    const k = 0.18 * Math.pow(2, z * 0.15) * this.speed;
    gl.uniform2f(u.u.u_px, k / cssW, k / cssH);
    gl.uniform1f(u.u.u_rand_seed, Math.random());
    gl.uniform1f(u.u.u_drop_rate, 0.003);
    gl.uniform1f(u.u.u_drop_rate_bump, 0.01);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    [this.stateA, this.stateB] = [this.stateB, this.stateA];
  }

  // Test hook: mean particle position (0..1 screen space) read back from the state texture.
  meanPosition() {
    const gl = this.gl, px = new Uint8Array(this.res * this.res * 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.stateA, 0);
    gl.readPixels(0, 0, this.res, this.res, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    let x = 0, y = 0;
    const n = this.res * this.res;
    for (let i = 0; i < n; i++) { x += px[i * 4] / 65025 + px[i * 4 + 2] / 255; y += px[i * 4 + 1] / 65025 + px[i * 4 + 3] / 255; }
    return [x / n, y / n];
  }

  // Main pass: composite the trail texture over the map.
  render(gl) {
    if (!this.running || !this.screenA) return;
    gl.useProgram(this.pQuad.p);
    this.bindQuad(gl, this.pQuad);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.screenA);
    gl.uniform1i(this.pQuad.u.u_screen, 0);
    gl.uniform1f(this.pQuad.u.u_opacity, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
