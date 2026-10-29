// Wind particles: a 2D canvas over the map. Particles advect along the frame's u/v at
// ~30 fps, with trails faded by 0.9 alpha per frame (design README). The map is flat
// Mercator with no rotation or pitch, so screen <-> lon/lat is a cheap closed form.

import { sample } from './sample-data.js';

const AREA_PER_PARTICLE = 1600; // px^2
const MAX_PARTICLES = 4000;

export class Particles {
  constructor(map) {
    this.map = map;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particles';
    this.canvas.setAttribute('aria-hidden', 'true');
    map.getCanvasContainer().appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.P = [];
    this.enabled = false;
    this.density = 1;
    this.color = 'rgba(255,255,255,.75)';
    this.moving = false;
    this.last = 0;
    this.resize();
    map.on('resize', () => this.resize());
    map.on('movestart', () => { this.moving = true; this.clear(); });
    map.on('moveend', () => { this.moving = false; this.respawnAll(); });
    this.tick = this.tick.bind(this);
  }

  resize() {
    const c = this.map.getContainer();
    this.w = c.clientWidth; this.h = c.clientHeight;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = this.w * this.dpr; this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px'; this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.respawnAll();
  }

  setFrame(fr) { this.fr = fr; }
  setColor(c) { this.color = c; }
  setDensity(d) { this.density = d; this.respawnAll(); }

  setEnabled(on) {
    if (on === this.enabled) return;
    this.enabled = on;
    this.clear();
    if (on) { this.respawnAll(); requestAnimationFrame(this.tick); }
  }

  clear() { this.ctx.clearRect(0, 0, this.w, this.h); }

  respawnAll() {
    const n = Math.min(MAX_PARTICLES, Math.round(this.w * this.h / AREA_PER_PARTICLE * this.density));
    this.P = Array.from({ length: n }, () => this.spawn({}, true));
  }

  spawn(p, randomAge) {
    p.x = Math.random() * this.w; p.y = Math.random() * this.h;
    p.m = 40 + Math.random() * 90;
    p.a = randomAge ? Math.random() * p.m : 0;
    return p;
  }

  // Screen -> lon/lat for an unrotated, unpitched Mercator map.
  view() {
    const m = this.map, ws = 512 * Math.pow(2, m.getZoom()), c = m.getCenter();
    const cx = (c.lng + 180) / 360 * ws;
    const cy = (1 - Math.log(Math.tan(Math.PI / 4 + c.lat * Math.PI / 360)) / Math.PI) / 2 * ws;
    return { ws, ox: cx - this.w / 2, oy: cy - this.h / 2, k: 0.05 * Math.pow(ws / 1024, 0.15) };
  }

  tick(now) {
    if (!this.enabled) return;
    requestAnimationFrame(this.tick);
    if (now - this.last < 32 || this.moving || !this.fr || document.hidden) return; // ~30 fps
    this.last = now;
    const ctx = this.ctx, fr = this.fr, { ws, ox, oy, k } = this.view();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'rgba(0,0,0,.9)';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    for (const p of this.P) {
      if (++p.a > p.m) { this.spawn(p); continue; }
      const wy = (oy + p.y) / ws;
      if (wy <= 0 || wy >= 1) { this.spawn(p); continue; }
      const lon = (ox + p.x) / ws * 360 - 180;
      const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * wy))) * 180 / Math.PI;
      const u = sample(fr, fr.u, lon, lat), v = sample(fr, fr.v, lon, lat);
      const nx = p.x + u * k, ny = p.y - v * k;
      ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny);
      p.x = nx; p.y = ny;
      if (nx < 0 || ny < 0 || nx > this.w || ny > this.h) this.spawn(p);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
}
