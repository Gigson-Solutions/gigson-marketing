/* ============================================================
   Gigson Design System — Shape geometry
   Pure math. No React, no DOM, no side effects.

   Two families:
   1. build2D()  → flat parametric figures, emitted as SVG path strings
   2. MESHES     → 3D wireframes (vertices + edges) for canvas projection

   Every figure in the system is generated from these primitives, so a
   new shape costs a few lines instead of a new asset file.
   ============================================================ */

export type Point3 = { x: number; y: number; z: number };
export type Edge = readonly [number, number];
export type Mesh = { vertices: Point3[]; edges: Edge[] };

const TAU = Math.PI * 2;

/** Trim float noise so emitted paths stay small and diffable. */
const n = (value: number) => Math.round(value * 100) / 100;

/** Sample a parametric curve into an SVG polyline path. */
function polyline(points: readonly { x: number; y: number }[], close = false): string {
  const d = points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${n(x)} ${n(y)}`).join(' ');
  return close ? `${d} Z` : d;
}

/**
 * Ellipse as two arc segments. `rotation` uses the SVG arc's native
 * x-axis-rotation, so no transform attribute is needed.
 */
function ellipse(cx: number, cy: number, rx: number, ry: number, rotation = 0): string {
  const c = Math.cos(rotation);
  const s = Math.sin(rotation);
  const ax = cx + rx * c;
  const ay = cy + rx * s;
  const bx = cx - rx * c;
  const by = cy - rx * s;
  const deg = n((rotation * 180) / Math.PI);
  return `M ${n(ax)} ${n(ay)} A ${n(rx)} ${n(ry)} ${deg} 1 1 ${n(bx)} ${n(by)} A ${n(rx)} ${n(ry)} ${deg} 1 1 ${n(ax)} ${n(ay)}`;
}

/* ── 2D FIGURES ─────────────────────────────────────────────── */

export type Shape2DName =
  | 'polygon'
  | 'orbit'
  | 'concentric'
  | 'spiral'
  | 'wave'
  | 'grid'
  | 'radial'
  | 'lissajous'
  | 'star'
  | 'rose'
  | 'spirograph'
  | 'superellipse'
  | 'chord'
  | 'contour'
  | 'hexgrid'
  | 'arcs'
  | 'staircase'
  | 'moire';

export type Shape2DParams = {
  /** Sides for `polygon`, lines for `wave`/`grid`, rays for `radial`. */
  sides?: number;
  /** Ring count for `orbit` / `concentric`. */
  rings?: number;
  /** Revolutions for `spiral`, cycles for `wave`. */
  turns?: number;
  /** Curve sampling resolution. */
  samples?: number;
  /** Base rotation in degrees. */
  rotation?: number;
  /** Lissajous frequency ratio, rose petal count, chord step, superellipse exponent. */
  ratio?: number;
  /** Waist of `star`, pen offset of `spirograph`. Fraction of the outer radius. */
  inner?: number;
};

/**
 * Every builder returns a list of `d` strings — one per stroke — drawn
 * inside a `size × size` viewBox. Multiple strokes let a single figure
 * animate its lines in sequence.
 */
export function build2D(name: Shape2DName, size: number, params: Shape2DParams = {}): string[] {
  const { sides = 5, rings = 3, turns = 3, samples = 180, rotation = 0, ratio = 3, inner = 0.45 } = params;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 1; // keep the 1px stroke inside the viewBox
  const rot = (rotation * Math.PI) / 180;

  switch (name) {
    /** Regular n-gon. Generalises the existing pentagon asset. */
    case 'polygon': {
      const points = Array.from({ length: sides }, (_, index) => {
        const a = rot - Math.PI / 2 + (index / sides) * TAU;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      });
      return [polyline(points, true)];
    }

    /** Sphere wireframe: outer circle plus progressively squashed ellipses. */
    case 'orbit': {
      const paths = [ellipse(cx, cy, r, r)];
      for (let index = 1; index <= rings; index++) {
        const t = index / (rings + 1);
        paths.push(ellipse(cx, cy, r, r * Math.cos(t * (Math.PI / 2) * 0.95), rot));
      }
      return paths;
    }

    /** Nested circles, evenly stepped. */
    case 'concentric':
      return Array.from({ length: rings }, (_, index) => ellipse(cx, cy, r * ((index + 1) / rings), r * ((index + 1) / rings)));

    /** Archimedean spiral. */
    case 'spiral': {
      const points = Array.from({ length: samples + 1 }, (_, index) => {
        const t = index / samples;
        const a = rot + t * turns * TAU;
        const rr = r * t;
        return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
      });
      return [polyline(points)];
    }

    /** Stacked sine waves with a phase offset per line. */
    case 'wave': {
      const lines = sides;
      const amp = size / (lines * 2.6);
      return Array.from({ length: lines }, (_, row) => {
        const y0 = ((row + 0.5) / lines) * size;
        const phase = (row / lines) * Math.PI;
        const points = Array.from({ length: samples + 1 }, (_, index) => {
          const t = index / samples;
          return { x: t * size, y: y0 + Math.sin(t * turns * TAU + phase) * amp };
        });
        return polyline(points);
      });
    }

    /** Square lattice — one stroke per line so it can draw on progressively. */
    case 'grid': {
      const cells = sides;
      const step = size / cells;
      const paths: string[] = [];
      for (let index = 0; index <= cells; index++) {
        const p = n(index * step);
        paths.push(`M ${p} 0 L ${p} ${n(size)}`, `M 0 ${p} L ${n(size)} ${p}`);
      }
      return paths;
    }

    /** Rays from centre to rim, plus the rim itself. */
    case 'radial': {
      const rays = Array.from({ length: sides }, (_, index) => {
        const a = rot + (index / sides) * TAU;
        return `M ${n(cx)} ${n(cy)} L ${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
      });
      return [ellipse(cx, cy, r, r), ...rays];
    }

    /** Lissajous curve — the most "signal/data" looking figure of the set. */
    case 'lissajous': {
      const points = Array.from({ length: samples + 1 }, (_, index) => {
        const t = (index / samples) * TAU;
        return { x: cx + r * Math.sin(ratio * t + rot), y: cy + r * Math.sin((ratio + 1) * t) };
      });
      return [polyline(points, true)];
    }

    /** n-pointed star. `inner` is the waist: 0.38 reads sharp, 0.7 blunt. */
    case 'star': {
      const points = Array.from({ length: sides * 2 }, (_, index) => {
        const a = rot - Math.PI / 2 + (index / (sides * 2)) * TAU;
        const rr = index % 2 === 0 ? r : r * inner;
        return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
      });
      return [polyline(points, true)];
    }

    /** Rhodonea rose, r = cos(ratio·theta). Odd ratio gives that many petals, even gives double. */
    case 'rose': {
      const span = Number.isInteger(ratio) ? (ratio % 2 === 1 ? Math.PI : TAU) : TAU * 2;
      const points = Array.from({ length: samples + 1 }, (_, index) => {
        const t = (index / samples) * span;
        const rr = r * Math.cos(ratio * t);
        return { x: cx + rr * Math.cos(t + rot), y: cy + rr * Math.sin(t + rot) };
      });
      return [polyline(points, true)];
    }

    /**
     * Hypotrochoid — the spirograph curve. `ratio` is the gear ratio and
     * `inner` the pen offset; the result is fitted to the box afterwards
     * because those two together decide the real extent.
     */
    case 'spirograph': {
      const rolling = 1 / Math.max(1.2, ratio);
      const arm = (1 - rolling) / rolling;
      const raw = Array.from({ length: samples * 2 + 1 }, (_, index) => {
        const t = (index / (samples * 2)) * TAU * turns + rot;
        return {
          x: (1 - rolling) * Math.cos(t) + inner * Math.cos(arm * t),
          y: (1 - rolling) * Math.sin(t) - inner * Math.sin(arm * t),
        };
      });
      const max = Math.max(...raw.map((p) => Math.hypot(p.x, p.y))) || 1;
      return [polyline(raw.map((p) => ({ x: cx + (p.x / max) * r, y: cy + (p.y / max) * r })))];
    }

    /** Lamé superellipse: ratio 2 is an ellipse, 4 a squircle, 8 nearly a square. */
    case 'superellipse': {
      const e = 2 / Math.max(0.5, ratio);
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      const points = Array.from({ length: samples }, (_, index) => {
        const t = (index / samples) * TAU;
        const px = r * Math.sign(Math.cos(t)) * Math.abs(Math.cos(t)) ** e;
        const py = r * Math.sign(Math.sin(t)) * Math.abs(Math.sin(t)) ** e;
        return { x: cx + px * cr - py * sr, y: cy + px * sr + py * cr };
      });
      return [polyline(points, true)];
    }

    /**
     * Times-table chord diagram: node i joins node i·ratio around the rim.
     * All chords share one path so the draw-on stays one continuous gesture
     * instead of dozens of staggered ticks.
     */
    case 'chord': {
      const nodes = sides;
      const step = Math.max(2, Math.round(ratio));
      const at = (index: number) => {
        const a = rot - Math.PI / 2 + ((index % nodes) / nodes) * TAU;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      };
      const chords = Array.from({ length: nodes }, (_, index) => {
        const a = at(index);
        const b = at(index * step);
        return `M ${n(a.x)} ${n(a.y)} L ${n(b.x)} ${n(b.y)}`;
      }).join(' ');
      return [ellipse(cx, cy, r, r), chords];
    }

    /** Topographic contours. Sum of sines, so it is organic but deterministic. */
    case 'contour':
      return Array.from({ length: rings }, (_, index) => {
        const level = (index + 1) / rings;
        const points = Array.from({ length: 48 }, (_, i) => {
          const a = rot + (i / 48) * TAU;
          const wobble = 0.86 + 0.1 * Math.sin(a * 3 + index) + 0.06 * Math.sin(a * 5 - index * 1.7);
          const rr = r * level * wobble;
          return { x: cx + rr * Math.cos(a), y: cy + rr * Math.sin(a) };
        });
        return smoothClosed(points);
      });

    /** Hexagonal tiling. Rows overhang the box; the SVG viewport clips them. */
    case 'hexgrid': {
      const cols = sides;
      const rad = size / (cols * Math.sqrt(3));
      const stepX = Math.sqrt(3) * rad;
      const stepY = 1.5 * rad;
      const hex = (hx: number, hy: number) =>
        polyline(
          Array.from({ length: 6 }, (_, index) => {
            const a = -Math.PI / 2 + (index / 6) * TAU;
            return { x: hx + rad * Math.cos(a), y: hy + rad * Math.sin(a) };
          }),
          true
        );
      return Array.from({ length: Math.ceil(size / stepY) + 1 }, (_, row) =>
        Array.from({ length: cols + 1 }, (_, col) => hex((row % 2 === 0 ? 0 : stepX / 2) + col * stepX, row * stepY)).join(' ')
      );
    }

    /** Concentric arc segments, each with its own sweep and start angle. */
    case 'arcs':
      return Array.from({ length: rings }, (_, index) => {
        const rr = r * ((index + 1) / rings);
        const a0 = rot + index * 0.7;
        const sweep = TAU * (0.28 + 0.5 * ((rings - index) / rings));
        const a1 = a0 + sweep;
        return `M ${n(cx + rr * Math.cos(a0))} ${n(cy + rr * Math.sin(a0))} A ${n(rr)} ${n(rr)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${n(cx + rr * Math.cos(a1))} ${n(cy + rr * Math.sin(a1))}`;
      });

    /** Orthogonal staircase — reads as a process, or as a step chart. */
    case 'staircase': {
      const stepX = size / sides;
      const stepY = size / sides;
      const points = [{ x: 0, y: size }];
      for (let index = 0; index < sides; index++) {
        points.push({ x: index * stepX, y: size - (index + 1) * stepY }, { x: (index + 1) * stepX, y: size - (index + 1) * stepY });
      }
      return [polyline(points)];
    }

    /**
     * Two families of parallel lines at a slight angle. The figure is the
     * interference between them, not the lines — `rotation` is that angle.
     */
    case 'moire': {
      const delta = rot || (Math.PI / 180) * 12;
      const family = (angle: number) =>
        Array.from({ length: sides }, (_, index) => {
          const offset = (index / (sides - 1) - 0.5) * size * 1.4;
          const nx = Math.cos(angle + Math.PI / 2) * offset;
          const ny = Math.sin(angle + Math.PI / 2) * offset;
          const dx = Math.cos(angle) * size;
          const dy = Math.sin(angle) * size;
          return `M ${n(cx + nx - dx)} ${n(cy + ny - dy)} L ${n(cx + nx + dx)} ${n(cy + ny + dy)}`;
        }).join(' ');
      return [family(0), family(delta)];
    }
  }
}

/* ── FILLED MASSES ──────────────────────────────────────────── */

export type MassName =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'pentagon'
  | 'hexagon'
  | 'bubble'
  | 'blob'
  | 'arch'
  | 'lozenge';

/** Smooth a closed ring of points into a path using midpoint quadratics. */
function smoothClosed(points: readonly { x: number; y: number }[]): string {
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const start = mid(points.at(-1)!, points[0]);
  let d = `M ${n(start.x)} ${n(start.y)}`;
  for (const [index, p] of points.entries()) {
    const next = points[(index + 1) % points.length];
    const m = mid(p, next);
    d += ` Q ${n(p.x)} ${n(p.y)} ${n(m.x)} ${n(m.y)}`;
  }
  return `${d} Z`;
}

/**
 * A closed, fillable silhouette drawn inside a `size × size` box.
 *
 * Distinct from `build2D`, which emits open line work meant to be stroked.
 * These are the solid colour fields a collage is built from.
 */
export function massPath(name: MassName, size: number, rotation = 0): string {
  const c = size / 2;
  const r = size / 2;
  const rot = (rotation * Math.PI) / 180;

  switch (name) {
    case 'circle':
      return ellipse(c, c, r, r);

    case 'triangle':
    case 'square':
    case 'pentagon':
    case 'hexagon': {
      const points = outline(name).map((p) => {
        const a = Math.atan2(p.y, p.x) + rot;
        const rr = Math.hypot(p.x, p.y) * r;
        return { x: c + rr * Math.cos(a), y: c + rr * Math.sin(a) };
      });
      return polyline(points, true);
    }

    /** Ellipse body with a tail at the lower left — the "conversation" mass. */
    case 'bubble': {
      const by = c * 0.82;
      const ry = r * 0.74;
      const body = ellipse(c, by, r, ry);
      const tail = polyline(
        [
          { x: c - r * 0.46, y: by + ry * 0.72 },
          { x: c - r * 0.30, y: size },
          { x: c - r * 0.06, y: by + ry * 0.94 },
        ],
        true
      );
      return `${body} ${tail}`;
    }

    /** Organic lobed silhouette — the only non-geometric mass in the set. */
    case 'blob': {
      const points = Array.from({ length: 14 }, (_, index) => {
        const a = rot + (index / 14) * TAU;
        const rr = r * (0.84 + 0.16 * Math.sin(a * 3 + 0.7) + 0.06 * Math.sin(a * 5));
        return { x: c + rr * Math.cos(a), y: c + rr * Math.sin(a) };
      });
      return smoothClosed(points);
    }

    /** Semicircular top on straight sides — reads as a doorway or a card. */
    case 'arch':
      return `M 0 ${n(size)} L 0 ${n(c)} A ${n(r)} ${n(r)} 0 0 1 ${n(size)} ${n(c)} L ${n(size)} ${n(size)} Z`;

    /** Fully rounded pill. Used as a label or a connector block. */
    case 'lozenge': {
      const h = size * 0.42;
      const y = c - h / 2;
      const rr = h / 2;
      return `M ${n(rr)} ${n(y)} L ${n(size - rr)} ${n(y)} A ${n(rr)} ${n(rr)} 0 0 1 ${n(size - rr)} ${n(y + h)} L ${n(rr)} ${n(y + h)} A ${n(rr)} ${n(rr)} 0 0 1 ${n(rr)} ${n(y)} Z`;
    }
  }
}

/* ── HAND-DRAWN ACCENTS ─────────────────────────────────────── */

/** Fit a point cloud to the given box, preserving its shape. */
function fitToBox(points: { x: number; y: number }[], width: number, height: number) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1;
  const spanY = Math.max(...ys) - minY || 1;
  return points.map((p) => ({ x: ((p.x - minX) / spanX) * width, y: ((p.y - minY) / spanY) * height }));
}

/**
 * A loose, looping line — the one deliberately imperfect element in the
 * system. `loop` traces a prolate cycloid, whose curtate arches cross
 * themselves; without it the line is a plain modulated sine.
 */
export function squigglePath(width: number, height: number, cycles = 3, loop = true, samples = 240): string {
  const raw = Array.from({ length: samples + 1 }, (_, index) => {
    const theta = (index / samples) * cycles * TAU;
    if (loop) return { x: theta - 1.6 * Math.sin(theta), y: -1.6 * Math.cos(theta) };
    return { x: theta, y: -Math.cos(theta) * (0.8 + 0.2 * Math.sin(theta * 0.6)) };
  });
  return polyline(fitToBox(raw, width, height));
}

/** Short radiating strokes — the "spark" that sits beside a focal mass. */
export function sparklePaths(size: number, rays = 7, spread = Math.PI * 0.9): string[] {
  const c = size / 2;
  return Array.from({ length: rays }, (_, index) => {
    const a = -Math.PI / 2 - spread / 2 + (index / (rays - 1)) * spread;
    const inner = size * (index % 2 === 0 ? 0.3 : 0.36);
    const outer = size * (index % 2 === 0 ? 0.5 : 0.44);
    return `M ${n(c + inner * Math.cos(a))} ${n(c + inner * Math.sin(a))} L ${n(c + outer * Math.cos(a))} ${n(c + outer * Math.sin(a))}`;
  });
}

/* ── POINT CLOUDS ───────────────────────────────────────────── */

export type CloudName =
  | 'sphere'
  | 'ball'
  | 'ring'
  | 'disc'
  | 'helix'
  | 'plume'
  | 'lattice'
  | 'wave'
  | 'edges'
  | 'rim';

/**
 * The same linear congruential generator `HeroScene` uses. Seeded on purpose:
 * a cloud that re-randomised on every render would flicker between the server
 * and the client, and could not be art-directed.
 */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) & 0xff_ff_ff_ff;
    return (state >>> 0) / 0xff_ff_ff_ff;
  };
}

/**
 * A cloud of points, distributed so that the *distribution* is the figure.
 * Coordinates sit inside the unit sphere; the renderer adds the drift.
 */
export function cloudPoints(name: CloudName, count = 260, seed = 42): Point3[] {
  const rand = seeded(seed);
  const points: Point3[] = [];

  switch (name) {
    /** Surface of a sphere — the hero's own distribution. */
    case 'sphere':
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(2 * rand() - 1);
        const theta = TAU * rand();
        points.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.sin(phi) * Math.sin(theta), z: Math.cos(phi) });
      }
      return points;

    /** Filled volume. The cube root keeps the density even instead of centre-heavy. */
    case 'ball':
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(2 * rand() - 1);
        const theta = TAU * rand();
        const rr = Math.cbrt(rand());
        points.push({ x: rr * Math.sin(phi) * Math.cos(theta), y: rr * Math.sin(phi) * Math.sin(theta), z: rr * Math.cos(phi) });
      }
      return points;

    /** Torus of dots. */
    case 'ring': {
      const major = 0.74;
      const minor = 0.22;
      for (let i = 0; i < count; i++) {
        const u = TAU * rand();
        const v = TAU * rand();
        const tube = Math.sqrt(rand()) * minor;
        const rr = major + tube * Math.cos(v);
        points.push({ x: rr * Math.cos(u), y: tube * Math.sin(v), z: rr * Math.sin(u) });
      }
      return points;
    }

    /** Flat disc on the horizontal plane — the camera tilt turns it into an ellipse. */
    case 'disc':
      for (let i = 0; i < count; i++) {
        const rr = Math.sqrt(rand()) * 0.95;
        const a = TAU * rand();
        points.push({ x: rr * Math.cos(a), y: (rand() - 0.5) * 0.06, z: rr * Math.sin(a) });
      }
      return points;

    /** Dots strung along a helix, with enough jitter to read as a cloud. */
    case 'helix':
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const a = t * 3 * TAU;
        const jitter = () => (rand() - 0.5) * 0.09;
        points.push({ x: 0.64 * Math.cos(a) + jitter(), y: t * 1.6 - 0.8 + jitter(), z: 0.64 * Math.sin(a) + jitter() });
      }
      return points;

    /**
     * Dense at the top, thinning and spreading as it falls — the plume under
     * the hero's pentagon. The exponent on `k` is what keeps the head tight.
     */
    case 'plume':
      for (let i = 0; i < count; i++) {
        const k = rand() ** 1.7;
        const a = TAU * rand();
        const rr = Math.sqrt(rand()) * (0.14 + k * 0.68);
        points.push({ x: rr * Math.cos(a), y: 0.76 - k * 1.58, z: rr * Math.sin(a) });
      }
      return points;

    /** Points sitting on a 5×5×5 grid, loosened just enough to breathe. */
    case 'lattice': {
      const steps = 5;
      const at = (v: number) => (v / (steps - 1)) * 1.22 - 0.61;
      const jitter = () => (rand() - 0.5) * 0.06;
      for (let i = 0; i < count; i++) {
        const cell = i % steps ** 3;
        points.push({
          x: at(cell % steps) + jitter(),
          y: at(Math.floor(cell / steps) % steps) + jitter(),
          z: at(Math.floor(cell / (steps * steps))) + jitter(),
        });
      }
      return points;
    }

    /** A sheet of dots riding a standing wave. */
    case 'wave':
      for (let i = 0; i < count; i++) {
        const x = rand() * 1.44 - 0.72;
        const z = rand() * 1.44 - 0.72;
        points.push({ x, y: Math.sin(x * 3 + z * 1.6) * 0.3, z });
      }
      return points;

    /** Scattered along the twelve edges of a cube — the solid implied, never drawn. */
    case 'edges': {
      const corners: Point3[] = [];
      for (const x of [-0.6, 0.6]) for (const y of [-0.6, 0.6]) for (const z of [-0.6, 0.6]) corners.push({ x, y, z });
      const pairs = edgesByProximity(corners);
      for (let i = 0; i < count; i++) {
        const [a, b] = pairs[i % pairs.length];
        const t = rand();
        points.push({
          x: corners[a].x + (corners[b].x - corners[a].x) * t,
          y: corners[a].y + (corners[b].y - corners[a].y) * t,
          z: corners[a].z + (corners[b].z - corners[a].z) * t,
        });
      }
      return points;
    }

    /** Dots tracing a pentagon rim, so the outline exists without a stroke. */
    case 'rim': {
      const sides = 5;
      for (let i = 0; i < count; i++) {
        const edge = i % sides;
        const t = rand();
        const a1 = -Math.PI / 2 + (edge / sides) * TAU;
        const a2 = -Math.PI / 2 + ((edge + 1) / sides) * TAU;
        points.push({
          x: (Math.cos(a1) + (Math.cos(a2) - Math.cos(a1)) * t) * 0.92 + (rand() - 0.5) * 0.08,
          y: (Math.sin(a1) + (Math.sin(a2) - Math.sin(a1)) * t) * 0.92 + (rand() - 0.5) * 0.08,
          z: (rand() - 0.5) * 0.12,
        });
      }
      return points;
    }
  }
}

/* ── 3D WIREFRAMES ──────────────────────────────────────────── */

/** Connect every vertex pair sitting at the polyhedron's minimum edge length. */
function edgesByProximity(vertices: Point3[], tolerance = 0.001): Edge[] {
  let min = Number.POSITIVE_INFINITY;
  const distance = (a: Point3, b: Point3) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      min = Math.min(min, distance(vertices[i], vertices[j]));
    }
  }

  const edges: Edge[] = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      if (distance(vertices[i], vertices[j]) <= min * (1 + tolerance)) edges.push([i, j]);
    }
  }
  return edges;
}

function ring(count: number, radius: number, y: number, offset = 0): Point3[] {
  return Array.from({ length: count }, (_, index) => {
    const a = offset + (index / count) * TAU;
    return { x: radius * Math.cos(a), y, z: radius * Math.sin(a) };
  });
}

function cube(): Mesh {
  const vertices: Point3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) vertices.push({ x, y, z });
  return { vertices, edges: edgesByProximity(vertices) };
}

function octahedron(): Mesh {
  const vertices: Point3[] = [
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 },
  ];
  return { vertices, edges: edgesByProximity(vertices) };
}

function icosahedron(): Mesh {
  const p = (1 + Math.sqrt(5)) / 2;
  const vertices: Point3[] = [];
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) {
      vertices.push({ x: 0, y: s1, z: s2 * p }, { x: s1, y: s2 * p, z: 0 }, { x: s2 * p, y: 0, z: s1 });
    }
  }
  return { vertices, edges: edgesByProximity(vertices) };
}

function pyramid(base = 4): Mesh {
  const vertices: Point3[] = [...ring(base, 1, -0.7, Math.PI / 4), { x: 0, y: 1, z: 0 }];
  const apex = base;
  const edges: Edge[] = [];
  for (let index = 0; index < base; index++) {
    edges.push([index, (index + 1) % base], [index, apex]);
  }
  return { vertices, edges };
}

function cone(segments = 32, slants = 8): Mesh {
  const vertices: Point3[] = [...ring(segments, 1, -0.7), { x: 0, y: 1, z: 0 }];
  const apex = segments;
  const edges: Edge[] = [];
  for (let index = 0; index < segments; index++) edges.push([index, (index + 1) % segments]);
  for (let index = 0; index < slants; index++) {
    edges.push([Math.round((index / slants) * segments) % segments, apex]);
  }
  return { vertices, edges };
}

function cylinder(segments = 24, slants = 8): Mesh {
  const top = ring(segments, 1, 1);
  const bottom = ring(segments, 1, -1);
  const vertices = [...top, ...bottom];
  const edges: Edge[] = [];
  for (let index = 0; index < segments; index++) {
    edges.push([index, (index + 1) % segments], [segments + index, segments + ((index + 1) % segments)]);
  }
  for (let index = 0; index < slants; index++) {
    const v = Math.round((index / slants) * segments) % segments;
    edges.push([v, segments + v]);
  }
  return { vertices, edges };
}

function torus(major = 20, minor = 10, tube = 0.38): Mesh {
  const vertices: Point3[] = [];
  const edges: Edge[] = [];
  for (let i = 0; i < major; i++) {
    const u = (i / major) * TAU;
    for (let j = 0; j < minor; j++) {
      const v = (j / minor) * TAU;
      const rr = 1 + tube * Math.cos(v);
      vertices.push({ x: rr * Math.cos(u), y: tube * Math.sin(v), z: rr * Math.sin(u) });
      const current = i * minor + j;
      edges.push([current, i * minor + ((j + 1) % minor)], [current, ((i + 1) % major) * minor + j]);
    }
  }
  return { vertices, edges };
}

function helix(turns = 3, samples = 120, radius = 0.75): Mesh {
  const vertices = Array.from({ length: samples }, (_, index) => {
    const t = index / (samples - 1);
    const a = t * turns * TAU;
    return { x: radius * Math.cos(a), y: t * 2 - 1, z: radius * Math.sin(a) };
  });
  const edges = Array.from({ length: samples - 1 }, (_, index) => [index, index + 1] as Edge);
  return { vertices, edges };
}

function tetrahedron(): Mesh {
  const vertices: Point3[] = [
    { x: 1, y: 1, z: 1 }, { x: 1, y: -1, z: -1 },
    { x: -1, y: 1, z: -1 }, { x: -1, y: -1, z: 1 },
  ];
  return { vertices, edges: edgesByProximity(vertices) };
}

function dodecahedron(): Mesh {
  const p = (1 + Math.sqrt(5)) / 2;
  const q = 1 / p;
  const vertices: Point3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) vertices.push({ x, y, z });
  for (const s1 of [-1, 1]) {
    for (const s2 of [-1, 1]) {
      vertices.push({ x: 0, y: s1 * q, z: s2 * p }, { x: s1 * q, y: s2 * p, z: 0 }, { x: s2 * p, y: 0, z: s1 * q });
    }
  }
  return { vertices, edges: edgesByProximity(vertices) };
}

/** Cube and octahedron rectified into one — squares and triangles alternating. */
function cuboctahedron(): Mesh {
  const vertices: Point3[] = [];
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      vertices.push({ x: a, y: b, z: 0 }, { x: a, y: 0, z: b }, { x: 0, y: a, z: b });
    }
  }
  return { vertices, edges: edgesByProximity(vertices) };
}

/** Latitude/longitude globe. Parallels plus meridians, closed at both poles. */
function sphere(lats = 5, lons = 12): Mesh {
  const vertices: Point3[] = [];
  const edges: Edge[] = [];
  for (let i = 0; i < lats; i++) {
    const phi = ((i + 1) / (lats + 1)) * Math.PI;
    vertices.push(...ring(lons, Math.sin(phi), Math.cos(phi)));
  }
  const north = vertices.push({ x: 0, y: 1, z: 0 }) - 1;
  const south = vertices.push({ x: 0, y: -1, z: 0 }) - 1;
  for (let i = 0; i < lats; i++) {
    for (let j = 0; j < lons; j++) {
      const current = i * lons + j;
      edges.push([current, i * lons + ((j + 1) % lons)]);
      if (i < lats - 1) edges.push([current, (i + 1) * lons + j]);
    }
  }
  for (let j = 0; j < lons; j++) edges.push([north, j], [south, (lats - 1) * lons + j]);
  return { vertices, edges };
}

/** (p,q) torus knot — a single closed strand that reads as woven. */
function torusKnot(p = 2, q = 3, samples = 160): Mesh {
  const vertices = Array.from({ length: samples }, (_, index) => {
    const t = (index / samples) * TAU;
    const rr = 2 + Math.cos(q * t);
    return { x: rr * Math.cos(p * t), y: -Math.sin(q * t), z: rr * Math.sin(p * t) };
  });
  const edges = Array.from({ length: samples }, (_, index) => [index, (index + 1) % samples] as Edge);
  return { vertices, edges };
}

/** Two counter-phased helices joined by rungs. */
function doubleHelix(turns = 2, samples = 60, radius = 0.62): Mesh {
  const vertices: Point3[] = [];
  const edges: Edge[] = [];
  for (let index = 0; index < samples; index++) {
    const t = index / (samples - 1);
    const a = t * turns * TAU;
    const y = t * 2 - 1;
    vertices.push(
      { x: radius * Math.cos(a), y, z: radius * Math.sin(a) },
      { x: radius * Math.cos(a + Math.PI), y, z: radius * Math.sin(a + Math.PI) }
    );
    if (index > 0) edges.push([(index - 1) * 2, index * 2], [(index - 1) * 2 + 1, index * 2 + 1]);
    if (index % 5 === 0) edges.push([index * 2, index * 2 + 1]);
  }
  return { vertices, edges };
}

/** n-gonal prism — the faceted answer to the cylinder. */
function prism(sides = 6): Mesh {
  const vertices = [...ring(sides, 1, 1), ...ring(sides, 1, -1)];
  const edges: Edge[] = [];
  for (let index = 0; index < sides; index++) {
    edges.push([index, (index + 1) % sides], [sides + index, sides + ((index + 1) % sides)], [index, sides + index]);
  }
  return { vertices, edges };
}

/** Antiprism — same two rings, half a step out of phase, laced with a zigzag. */
function antiprism(sides = 6): Mesh {
  const vertices = [...ring(sides, 1, 0.85), ...ring(sides, 1, -0.85, Math.PI / sides)];
  const edges: Edge[] = [];
  for (let index = 0; index < sides; index++) {
    edges.push(
      [index, (index + 1) % sides],
      [sides + index, sides + ((index + 1) % sides)],
      [index, sides + index],
      [sides + index, (index + 1) % sides]
    );
  }
  return { vertices, edges };
}

/** Cubic lattice. Proximity edges give exactly the axis-aligned struts. */
function lattice(steps = 3): Mesh {
  const vertices: Point3[] = [];
  const at = (index: number) => (index / (steps - 1)) * 2 - 1;
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      for (let k = 0; k < steps; k++) vertices.push({ x: at(i), y: at(j), z: at(k) });
    }
  }
  return { vertices, edges: edgesByProximity(vertices) };
}

/** Möbius band: two rails that swap sides at the seam, so it has one edge. */
function mobius(samples = 48, width = 0.32): Mesh {
  const vertices: Point3[] = [];
  const edges: Edge[] = [];
  for (let index = 0; index < samples; index++) {
    const u = (index / samples) * TAU;
    for (const v of [-width, width]) {
      const rr = 1 + v * Math.cos(u / 2);
      vertices.push({ x: rr * Math.cos(u), y: v * Math.sin(u / 2), z: rr * Math.sin(u) });
    }
    const a = index * 2;
    const b = ((index + 1) % samples) * 2;
    // The half twist means the last segment joins the rails crossed over.
    const seam = index === samples - 1;
    edges.push([a, seam ? b + 1 : b], [a + 1, seam ? b : b + 1], [a, a + 1]);
  }
  return { vertices, edges };
}

export const MESHES = {
  cube: cube(),
  cone: cone(),
  pyramid: pyramid(),
  octahedron: octahedron(),
  icosahedron: icosahedron(),
  cylinder: cylinder(),
  torus: torus(),
  helix: helix(),
  tetrahedron: tetrahedron(),
  dodecahedron: dodecahedron(),
  cuboctahedron: cuboctahedron(),
  sphere: sphere(),
  torusKnot: torusKnot(),
  doubleHelix: doubleHelix(),
  prism: prism(),
  antiprism: antiprism(),
  lattice: lattice(),
  mobius: mobius(),
} satisfies Record<string, Mesh>;

export type MeshName = keyof typeof MESHES;

/** Scale a mesh so its furthest vertex sits on the unit sphere. */
export function normalize(mesh: Mesh): Mesh {
  const max = Math.max(...mesh.vertices.map((v) => Math.hypot(v.x, v.y, v.z)));
  if (max === 0) return mesh;
  return {
    edges: mesh.edges,
    vertices: mesh.vertices.map((v) => ({ x: v.x / max, y: v.y / max, z: v.z / max })),
  };
}

/* ── FLAT OUTLINES PLACED IN 3D ─────────────────────────────── */

export type OutlineName = 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon';

/**
 * A closed flat outline on the local XY plane, radius 1, centred on the
 * origin. Meant to be transformed into 3D space — a 2D figure that lives
 * in a 3D world rather than a 3D solid.
 */
export function outline(name: OutlineName, samples = 64): Point3[] {
  const sides = { triangle: 3, square: 4, pentagon: 5, hexagon: 6 } as const;
  const count = name === 'circle' ? samples : sides[name];
  return Array.from({ length: count }, (_, index) => {
    const a = -Math.PI / 2 + (index / count) * TAU;
    return { x: Math.cos(a), y: Math.sin(a), z: 0 };
  });
}

/** Full Euler rotation (X then Y then Z) — needed to orient a flat plane freely. */
export function rotateXYZ(p: Point3, rx: number, ry: number, rz: number): Point3 {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = p.y * cx - p.z * sx;
  const z1 = p.y * sx + p.z * cx;

  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = p.x * cy + z1 * sy;
  const z2 = -p.x * sy + z1 * cy;

  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  return { x: x2 * cz - y1 * sz, y: x2 * sz + y1 * cz, z: z2 };
}

/**
 * Rotate around Y then X. Same projection model as the existing hero
 * scene (`HeroScene.tsx`) so both share one visual language.
 */
export function rotate(p: Point3, yaw: number, pitch: number): Point3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;

  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}
