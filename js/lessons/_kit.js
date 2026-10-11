// _kit.js: small helpers shared by lesson scenes (not a lesson; not in the registry).
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ease = (t) => t * t * (3 - 2 * t);

// Linear progress value with snap(start,end) per step and tick(dt) per frame.
export function progress(rate = 0.5, v = 0) {
  return { v, to: v, rate, snap(a, b) { this.v = a; this.to = b; return this; }, go(b) { this.to = b; return this; },
    tick(dt) { const d = this.to - this.v; this.v += Math.sign(d) * Math.min(Math.abs(d), this.rate * dt); return this.v; },
    get done() { return Math.abs(this.to - this.v) < 1e-4; } };
}

// Named label registry: only([...keys]) shows just those labels.
export function labels(api) {
  const m = {};
  return {
    add(key, text, pos, parent, cls) { m[key] = api.label(text, pos, parent, cls); return m[key]; },
    only(keys) { for (const k in m) api.showLabel(m[k], keys.includes(k)); },
    show(k, on) { if (m[k]) api.showLabel(m[k], on); },
    set(k, t) { if (m[k]) api.setLabel(m[k], t); },
    get: (k) => m[k], all: m,
  };
}

// Single nucleic-acid strand drawn as a row: backbone (sugar-phosphate) + base sticks pointing to +y (or -y).
// opts: { seq, x0=0, dx=0.6, y=0, z=0, up=1, parent, rna=false, color }
export function strand(api, opts) {
  const { THREE, C } = api;
  const g = api.group(opts.parent);
  const seq = opts.seq, dx = opts.dx ?? 0.6, up = opts.up ?? 1;
  const sugarG = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 5), phosG = new THREE.SphereGeometry(0.15, 12, 8), baseG = new THREE.BoxGeometry(0.22, 0.75, 0.22);
  const items = [];
  for (let i = 0; i < seq.length; i++) {
    const b = seq[i];
    const n = new THREE.Group(); g.add(n);
    const sug = new THREE.Mesh(sugarG, api.mat(opts.color ?? (opts.rna ? C.rna : C.sugar))); sug.rotation.x = Math.PI / 2; n.add(sug);
    const ph = new THREE.Mesh(phosG, api.mat(C.phosphate)); ph.position.set(-dx / 2, -0.12 * up, 0); n.add(ph);
    const base = new THREE.Mesh(baseG, api.mat(C[b] ?? 0xcccccc)); base.position.set(0, 0.5 * up, 0); n.add(base);
    if (opts.rna) { const oh = new THREE.Mesh(phosG, api.mat(0xff3b30)); oh.scale.setScalar(0.55); oh.position.set(0.12, -0.18 * up, 0.2); n.add(oh); n.userData.oh = oh; }
    n.position.set((opts.x0 ?? 0) + i * dx, opts.y ?? 0, opts.z ?? 0);
    items.push({ n, b, base, sug, ph });
  }
  const bb = api.box(1, 0.07, 0.07, opts.rna ? C.rna : 0xb0b8c4, g); bb.position.y = opts.y ?? 0;
  const res = {
    group: g, items, dx,
    // show the first k nucleotides (others scaled away)
    setCount(k, dt = 1) {
      items.forEach((it, i) => { const t = i < k ? 1 : 0.001; it.n.scale.setScalar(it.n.scale.x + (t - it.n.scale.x) * Math.min(1, dt * 10)); });
      const kk = Math.max(0, Math.min(items.length, Math.ceil(k)));
      if (kk > 0) { const a = items[0].n.position.x - dx / 2, b = items[kk - 1].n.position.x; bb.scale.x = Math.max(0.01, b - a); bb.position.x = (a + b) / 2; bb.visible = true; } else bb.visible = false;
    },
    xOf: (i) => (opts.x0 ?? 0) + i * dx,
    bb,
  };
  res.setCount(seq.length);
  return res;
}

// Phospholipid bilayer patch using instancing. opts: { w=16, d=8, y=0, spacing=0.5, parent, raft:[x0,x1,z0,z1] }
export function membrane(api, opts = {}) {
  const { THREE } = api;
  const g = api.group(opts.parent); g.position.y = opts.y ?? 0;
  const sp = opts.spacing ?? 0.5, w = opts.w ?? 16, d = opts.d ?? 8;
  const nx = Math.floor(w / sp), nz = Math.floor(d / sp), n = nx * nz * 2;
  const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.21, 12, 8), new THREE.MeshStandardMaterial({ roughness: 0.5 }), n);
  const tail = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 6), new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.7 }), n * 2);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3(), col = new THREE.Color();
  const cells = [];
  let k = 0, kt = 0;
  for (let leaf = 0; leaf < 2; leaf++) for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const x = -w / 2 + (i + 0.5) * sp, z = -d / 2 + (j + 0.5) * sp, sgn = leaf ? -1 : 1;
    const inRaft = opts.raft && x > opts.raft[0] && x < opts.raft[1] && z > opts.raft[2] && z < opts.raft[3];
    const hy = sgn * (inRaft ? 1.25 : 1.05);
    p.set(x, hy, z); m.compose(p, q, s); head.setMatrixAt(k, m);
    head.setColorAt(k, col.set(inRaft ? 0xd98cd9 : (opts.color ?? 0x7fb2e5)));
    for (const off of [-0.08, 0.08]) { p.set(x + off, hy - sgn * 0.55, z); m.compose(p, q, s); tail.setMatrixAt(kt++, m); }
    cells.push({ x, z, leaf, inRaft }); k++;
  }
  head.instanceMatrix.needsUpdate = true; head.instanceColor.needsUpdate = true; tail.instanceMatrix.needsUpdate = true;
  g.add(head, tail);
  return { group: g, head, tail, cells, w, d };
}

// Simple arrow (shaft + cone) from a to b.
export function arrow(api, a, b, color = 0xffffff, parent, r = 0.06) {
  const { THREE } = api;
  const g = api.group(parent);
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), dir = B.clone().sub(A), L = dir.length(); dir.normalize();
  const shaft = api.stick(A, A.clone().addScaledVector(dir, Math.max(0.01, L - 0.35)), r, color, g);
  const cone = api.cylinder(0, r * 3.2, 0.4, color, g); cone.position.copy(B).addScaledVector(dir, -0.2);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return g;
}
