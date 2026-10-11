// engine.js: three.js viewer + helpers used by every lesson scene.
// A lesson's `scene(api)` builds objects and returns { setStep(i), update?(dt,t), dispose?() }.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const C = {
  A: 0xe8505b, T: 0xf2c94c, G: 0x3fb27f, C: 0x4a90e2, U: 0xf2994a,
  backbone: 0x9aa5b1, phosphate: 0xf5a623, sugar: 0xc9d1d9,
  dna1: 0x5b8def, dna2: 0xef6c8b, rna: 0xf2994a, protein: 0x9b6dd6,
  enzyme: 0x2bb3a3, membrane: 0xd8b26e, methyl: 0xff3b30, good: 0x34c759, bad: 0xff453a,
  grey: 0x8e8e93, ribosome: 0x7fb3d5, histone: 0xb58ad6, ub: 0xffd60a,
};
export const BASE_PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };

export class Viewer {
  constructor(host) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    this.camera.position.set(0, 4, 18);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(this.renderer.domElement);
    this.labels = new CSS2DRenderer();
    this.labels.domElement.className = 'labels-layer';
    host.appendChild(this.labels.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 3; this.controls.maxDistance = 80;
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.4));
    const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(6, 10, 8); this.scene.add(d);
    const d2 = new THREE.DirectionalLight(0x99bbff, 0.8); d2.position.set(-8, -4, -6); this.scene.add(d2);
    this.clock = new THREE.Clock();
    this.anims = new Map();      // smooth targets: key -> {obj, prop, to, k}
    this.frameCbs = new Set();
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.camTarget = null;
    window.__viewer = this;
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host);
    this.resize();
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.05), t = this.clock.elapsedTime;
      this._step(dt, t);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.labels.render(this.scene, this.camera);
    };
    loop();
  }
  // test hook: simulate `sec` seconds instantly (used for automated checks)
  advance(sec = 1) { for (let i = 0; i < sec * 30; i++) { this._step(1 / 30, (this._t = (this._t || 0) + 1 / 30)); this.controls.update(); } this.renderer.render(this.scene, this.camera); this.labels.render(this.scene, this.camera); }
  resize() {
    const w = this.host.clientWidth || 600, h = this.host.clientHeight || 400;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h); this.labels.setSize(w, h);
  }
  _step(dt, t) {
    const f = 1 - Math.exp(-dt * 4.5);
    for (const [key, a] of this.anims) {
      const k = 1 - Math.exp(-dt * (a.k || 4.5));
      if (a.kind === 'vec') { a.obj.lerp(a.to, k); if (a.obj.distanceTo(a.to) < 1e-3) { a.obj.copy(a.to); this.anims.delete(key); } }
      else if (a.kind === 'num') { a.obj[a.prop] += (a.to - a.obj[a.prop]) * k; if (Math.abs(a.obj[a.prop] - a.to) < 1e-3) { a.obj[a.prop] = a.to; this.anims.delete(key); } }
      else if (a.kind === 'color') { a.obj.lerp(a.to, k); }
    }
    if (this.camTarget) {
      this.camera.position.lerp(this.camTarget.pos, f * 0.8);
      this.controls.target.lerp(this.camTarget.look, f * 0.8);
      if (this.camera.position.distanceTo(this.camTarget.pos) < 0.02) this.camTarget = null;
    }
    for (const cb of this.frameCbs) cb(dt, t);
  }
  clear() {
    this.anims.clear(); this.frameCbs.clear();
    this.root.traverse(o => { if (o.isCSS2DObject && o.element) o.element.remove(); });
    this.scene.remove(this.root);
    this.root.traverse(o => { o.geometry?.dispose?.(); if (o.material) [].concat(o.material).forEach(m => m.dispose?.()); });
    this.root = new THREE.Group(); this.scene.add(this.root);
  }
  dispose() {
    this.running = false; cancelAnimationFrame(this.raf); this.ro.disconnect(); this.clear();
    this.renderer.dispose(); this.renderer.domElement.remove(); this.labels.domElement.remove();
  }
}

// ---------- API given to lesson scenes ----------
export function makeApi(viewer, ui) {
  const root = () => viewer.root;
  const matCache = new Map();
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05, transparent: true, opacity: opts.opacity ?? 1, ...opts });
  const api = {
    THREE, C, BASE_PAIR, viewer,
    get root() { return root(); },
    add(obj, parent) { (parent || root()).add(obj); return obj; },
    mat,
    group(parent) { const g = new THREE.Group(); (parent || root()).add(g); return g; },
    sphere(r = 0.3, color = 0xffffff, parent, opts) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(color, opts)); (parent || root()).add(m); return m; },
    box(w, h, d, color, parent, opts) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts)); (parent || root()).add(m); return m; },
    cylinder(rt, rb, h, color, parent, opts) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), mat(color, opts)); (parent || root()).add(m); return m; },
    torus(r, tube, color, parent, opts) { const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 16, 48), mat(color, opts)); (parent || root()).add(m); return m; },
    // stick between two points
    stick(a, b, r = 0.06, color = 0xcccccc, parent, opts) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), mat(color, opts));
      api.setStick(m, a, b); (parent || root()).add(m); return m;
    },
    setStick(m, a, b) {
      const d = new THREE.Vector3().subVectors(b, a), L = d.length();
      m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, Math.max(L, 1e-4), 1);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    },
    // tube along points
    tube(points, r = 0.12, color = C.rna, parent, opts) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => p.isVector3 ? p : new THREE.Vector3(...p)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, points.length * 8), r, 10, false), mat(color, opts));
      (parent || root()).add(m); return m;
    },
    // organic "protein" blob
    blob(r = 1, color = C.enzyme, parent, opts = {}) {
      const g = new THREE.IcosahedronGeometry(r, 4); const p = g.attributes.position; const v = new THREE.Vector3();
      const seed = opts.seed ?? Math.random() * 10;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + 0.12 * Math.sin(v.x * 2.1 + seed) * Math.cos(v.y * 1.7 + seed * 1.3) + 0.06 * Math.sin(v.z * 3.3 + seed); v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat(color, { roughness: 0.6, ...opts.mat })); if (opts.scale) m.scale.set(...opts.scale);
      (parent || root()).add(m); return m;
    },
    // HTML label attached in 3D. cls: 'tag' (default), 'big', 'warn', 'good', 'dim'
    label(text, pos = [0, 0, 0], parent, cls = '') {
      const el = document.createElement('div'); el.className = 'lbl ' + cls; el.innerHTML = text;
      const o = new CSS2DObject(el); o.position.set(...(pos.isVector3 ? pos.toArray() : pos)); (parent || root()).add(o); return o;
    },
    setLabel(o, text) { o.element.innerHTML = text; },
    showLabel(o, on) { o.element.style.opacity = on ? 1 : 0; o.visible = !!on; },
    // ---- smooth animation targets ----
    moveTo(obj, to, k) { const v = to.isVector3 ? to.clone() : new THREE.Vector3(...to); viewer.anims.set(obj.uuid + ':p', { kind: 'vec', obj: obj.position, to: v, k }); },
    scaleTo(obj, s, k) { const v = typeof s === 'number' ? new THREE.Vector3(s, s, s) : new THREE.Vector3(...s); viewer.anims.set(obj.uuid + ':s', { kind: 'vec', obj: obj.scale, to: v, k }); },
    rotateTo(obj, axis, ang, k) { viewer.anims.set(obj.uuid + ':r' + axis, { kind: 'num', obj: obj.rotation, prop: axis, to: ang, k }); },
    fadeTo(obj, op, k) {
      obj.traverse(o => {
        if (o.isCSS2DObject) { o.element.style.opacity = op; o.visible = op > 0.02; return; }
        if (o.material) [].concat(o.material).forEach(m => { m.transparent = true; viewer.anims.set(m.uuid + ':o', { kind: 'num', obj: m, prop: 'opacity', to: op, k }); });
      });
      obj.visible = true;
    },
    colorTo(obj, color, k) { obj.traverse(o => { if (o.material?.color) viewer.anims.set(o.material.uuid + ':c', { kind: 'color', obj: o.material.color, to: new THREE.Color(color), k }); }); },
    setOpacity(obj, op) { obj.traverse(o => { if (o.isCSS2DObject) { o.element.style.opacity = op; o.visible = op > 0.02; } else if (o.material) [].concat(o.material).forEach(m => { m.transparent = true; m.opacity = op; }); }); },
    camera(pos, look = [0, 0, 0]) {
      const P = new THREE.Vector3(...pos), L = new THREE.Vector3(...look), a = viewer.camera.aspect;
      const fit = (viewer.host.clientWidth || 600) < 520 ? 1.5 : 1.3; // narrow phone canvas: labels take relatively more room, so frame a bit wider
      if (a < fit) P.sub(L).multiplyScalar(Math.min(2.6, fit / a)).add(L); // portrait/phone: back off so the scene fits
      viewer.camTarget = { pos: P, look: L };
    },
    onFrame(cb) { viewer.frameCbs.add(cb); return () => viewer.frameCbs.delete(cb); },
    // ---- UI controls in the viewer panel ----
    toggle: (label, init, onChange) => ui.toggle(label, init, onChange),
    slider: (label, min, max, step, init, onChange, fmt) => ui.slider(label, min, max, step, init, onChange, fmt),
    buttons: (items) => ui.buttons(items),
    readout: (html) => ui.readout(html),
    // ---- reusable molecular builders ----
    dna: (opts) => makeDNA(api, opts),
    seq(n, gc = 0.5) { let s = ''; for (let i = 0; i < n; i++) { const r = Math.random(); s += r < gc ? (Math.random() < .5 ? 'G' : 'C') : (Math.random() < .5 ? 'A' : 'T'); } return s; },
  };
  return api;
}

// Double helix built base-pair by base-pair so scenes can open / recolor / remove parts.
// opts: { seq, rise=0.34*?, radius, turn (bp per turn), axis:'x'|'y', x0, colors }
// Returns { group, pairs:[{i, b1, b2, s1, s2, hb, base1, base2, pos(i,open)}], setOpen(i, amt), length }
function makeDNA(api, opts = {}) {
  const THREE = api.THREE;
  const seq = (opts.seq || 'ATGCGTACGTTAGCCATGCA').toUpperCase();
  const n = seq.length, rise = opts.rise ?? 0.5, R = opts.radius ?? 1.0, bpt = opts.turn ?? 10;
  const g = api.group(opts.parent);
  const pairs = [];
  const sphereG = new THREE.SphereGeometry(0.17, 14, 10), baseG = new THREE.BoxGeometry(1, 0.16, 0.26);
  const m1 = api.mat(opts.c1 ?? C.dna1), m2 = api.mat(opts.c2 ?? C.dna2);
  const center = (n - 1) * rise / 2;
  let twist = opts.twist ?? 1;
  const geo = (i) => { const a = (i / bpt) * Math.PI * 2 * twist + (opts.phase || 0); const x = i * rise - center; return { x, a }; };
  for (let i = 0; i < n; i++) {
    const b1 = seq[i], b2 = BASE_PAIR[b1] || 'N';
    const s1 = new THREE.Mesh(sphereG, m1.clone()), s2 = new THREE.Mesh(sphereG, m2.clone());
    const base1 = new THREE.Mesh(baseG, api.mat(C[b1] ?? 0xcccccc)), base2 = new THREE.Mesh(baseG, api.mat(C[b2] ?? 0xcccccc));
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), api.mat(0xffffff, { opacity: 0.8 }));
    const half1 = new THREE.Group(), half2 = new THREE.Group();
    half1.add(s1, base1); half2.add(s2, base2);
    g.add(half1, half2, hb);
    pairs.push({ i, b1, b2, s1, s2, base1, base2, hb, half1, half2, open: 0, hbonds: (b1 === 'G' || b1 === 'C') ? 3 : 2 });
  }
  const tmp = new THREE.Vector3();
  function layout() {
    for (const p of pairs) {
      const { x, a } = geo(p.i);
      const sep = p.open; // 0 = paired, 1 = fully apart
      const r = R + sep * (opts.openR ?? 1.6);
      const y1 = Math.cos(a) * r, z1 = Math.sin(a) * r;
      const off = opts.offset ?? Math.PI; const y2 = Math.cos(a + off) * r, z2 = Math.sin(a + off) * r;
      const dy = opts.splitY ? sep * opts.splitY : 0;
      p.s1.position.set(0, 0, 0); p.s2.position.set(0, 0, 0);
      p.half1.position.set(x, y1 + dy, z1); p.half2.position.set(x, y2 - dy, z2);
      // base sticks point toward axis
      const L = R * 0.92;
      for (const [base, half, yy, zz] of [[p.base1, p.half1, y1 + dy, z1], [p.base2, p.half2, y2 - dy, z2]]) {
        const dir = new THREE.Vector3(0, -yy, -zz).normalize();
        base.scale.set(L, 1, 1);
        base.position.copy(dir).multiplyScalar(L / 2);
        base.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
      }
      const e1 = new THREE.Vector3(x, (y1 + dy) * (1 - L / r), z1 * (1 - L / r));
      const e2 = new THREE.Vector3(x, (y2 - dy) * (1 - L / r), z2 * (1 - L / r));
      api.setStick(p.hb, e1, e2); p.hb.visible = sep < 0.15 && !p.hbHide;
      // backbone sticks are drawn below
    }
    for (let i = 0; i < pairs.length - 1; i++) {
      const p = pairs[i], q = pairs[i + 1];
      p.bb1 ??= (() => { const m = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.07, opts.c1 ?? C.dna1, g); return m; })();
      p.bb2 ??= (() => { const m = api.stick(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.07, opts.c2 ?? C.dna2, g); return m; })();
      api.setStick(p.bb1, p.half1.position, q.half1.position);
      api.setStick(p.bb2, p.half2.position, q.half2.position);
    }
  }
  layout();
  const api2 = {
    group: g, pairs, length: n * rise, rise, seq,
    xOf: (i) => geo(i).x,
    setOpen(i, amt) { if (pairs[i]) pairs[i].open = amt; },
    // open region [a,b) smoothly (amt 0..1)
    openRange(a, b, amt = 1) { for (const p of pairs) p.target = (p.i >= a && p.i < b) ? amt : 0; },
    tick(dt) { let ch = false; for (const p of pairs) { const t = p.target ?? p.open; if (Math.abs(t - p.open) > 1e-3) { p.open += (t - p.open) * (1 - Math.exp(-dt * 5)); ch = true; } } if (ch) layout(); },
    relayout: layout,
    setTwist(v) { twist = v; layout(); },
    get twist() { return twist; },
    // opacity of one strand (1 or 2), incl. its backbone sticks
    strandOpacity(which, op, range) {
      for (const p of pairs) {
        if (range && (p.i < range[0] || p.i >= range[1])) continue;
        const objs = which === 1 ? [p.half1, p.bb1] : [p.half2, p.bb2];
        for (const o of objs) if (o) api.fadeTo(o, op);
        p.hbHide = op < 0.5; p.hb.visible = !p.hbHide && p.open < 0.15;
      }
    },
  };
  api.onFrame((dt) => api2.tick(dt));
  if (axisY(opts)) g.rotation.z = Math.PI / 2;
  return api2;
}
const axisY = (o) => o.axis === 'y';
