// Field colour scales. Source of truth: data/field-scales.json (copied verbatim from
// docs/design/field-scales.json). This module turns them into legend markup and
// colour lookup tables for the field renderer.

export let FIELDS = {};
export let ORDER = [];

export async function loadScales() {
  const r = await fetch(new URL('../data/field-scales.json', import.meta.url));
  const j = await r.json();
  FIELDS = j.fields;
  ORDER = j.order;
}

// "light" = the Light basemap: use stopsLight where provided (design README).
const stopsFor = (f, light) => (light && f.stopsLight) || f.stops;
const tfFor = f => f.mode === 'continuous-log' ? (x => Math.log(Math.max(x, 1e-3))) : (x => x);

function parseColor(s) {
  if (s[0] === '#') return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 255];
  const m = s.match(/[\d.]+/g).map(Number);
  return [m[0], m[1], m[2], Math.round((m[3] ?? 1) * 255)];
}

const LUT_N = 1024;
const AQ_MAX = 300; // banded domain upper bound; anything above is "Hazardous"
const luts = {};

// A LUT maps a value to RGBA via lut.index(v); index -1 means transparent.
export function lut(k, light) {
  const key = k + (light ? 'L' : 'D');
  if (luts[key]) return luts[key];
  const f = FIELDS[k], raw = stopsFor(f, light), tf = tfFor(f);
  const st = raw.map(s => ({ v: s[0], c: parseColor(s[1]) }));
  const banded = f.mode === 'banded';
  const a = banded ? 0 : tf(st[0].v), b = banded ? AQ_MAX : tf(st[st.length - 1].v);
  const rgba = new Uint8ClampedArray(LUT_N * 4);
  for (let i = 0; i < LUT_N; i++) {
    const x = a + (b - a) * i / (LUT_N - 1);
    let c;
    if (banded) { let j = 0; while (j < st.length - 1 && x >= st[j + 1].v) j++; c = st[j].c; }
    else {
      c = st[st.length - 1].c;
      for (let j = 0; j < st.length - 1; j++) {
        const x0 = tf(st[j].v), x1 = tf(st[j + 1].v);
        if (x <= x1) { const t = Math.max(0, (x - x0) / (x1 - x0)), c0 = st[j].c, c1 = st[j + 1].c; c = c0.map((v, n) => v + (c1[n] - v) * t); break; }
      }
    }
    rgba.set(c, i * 4);
  }
  const below = f.transparentBelow;
  return luts[key] = {
    rgba,
    index(v) {
      if (below != null && v < below) return -1;
      const x = banded ? v : tf(v);
      const i = Math.round((x - a) / (b - a) * (LUT_N - 1));
      return i < 0 ? 0 : i >= LUT_N ? LUT_N - 1 : i;
    }
  };
}

export function aqCategory(v) {
  const st = FIELDS.aq.stops;
  let i = 0;
  while (i < st.length - 1 && v >= st[i + 1][0]) i++;
  return st[i][2];
}

export function barHTML(k, light) {
  const f = FIELDS[k], raw = stopsFor(f, light), tf = tfFor(f);
  if (f.mode === 'banded') return `<div class="lg-bar">${raw.map(s => `<i style="background:${s[1]}"></i>`).join('')}</div>`;
  const a = tf(raw[0][0]), b = tf(raw[raw.length - 1][0]), p = v => ((tf(v) - a) / (b - a) * 100).toFixed(1);
  return `<div class="lg-bar" style="background:linear-gradient(90deg,${raw.map(s => `${s[1]} ${p(s[0])}%`).join(',')})"></div>`;
}

// meta: right-hand legend text, e.g. "10 m · sample data, 1° grid".
export function legendHTML(k, light, meta) {
  const f = FIELDS[k], raw = stopsFor(f, light), tf = tfFor(f);
  let ticks;
  if (f.mode === 'banded') {
    ticks = `<div class="lg-t band">${raw.map(s => `<span>${s[0]}</span>`).join('')}</div><div class="lg-cats">${raw.map(s => `<span>${s[2]}</span>`).join('')}</div>`;
  } else {
    const a = tf(raw[0][0]), b = tf(raw[raw.length - 1][0]), p = v => ((tf(parseFloat(v)) - a) / (b - a) * 100).toFixed(1);
    ticks = `<div class="lg-t">${f.ticks.map(x => `<span style="left:${p(x)}%">${x}</span>`).join('')}</div>`;
  }
  return `<div class="lg-h"><span>${f.label} · ${f.unit}</span><span>${meta}</span></div>${barHTML(k, light)}${ticks}`;
}

export function rangeText(k) {
  const f = FIELDS[k];
  return f.mode === 'banded' ? 'US EPA' : `${f.ticks[0]}–${f.ticks[f.ticks.length - 1]}`;
}
