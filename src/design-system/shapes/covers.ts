import type { CollageLayer } from './Collage';

/**
 * Four mass slots plus a line colour. Both palettes fill the same slots, so
 * the two galleries differ by colour alone and the comparison is honest.
 */
export type Palette = {
  bg: string;
  /** Palest — background masses that bleed off the frame. */
  m1: string;
  /** Mid — the primary focal mass. */
  m2: string;
  /** Secondary focal mass, must read against m2 under `multiply`. */
  m3: string;
  /** Darkest — small accents, sparkles, rare emphasis. */
  m4: string;
  /** Line work drawn on top of a mass. */
  line: string;
};

/** Option A — the existing purple ladder only. No new brand decisions. */
export const MONO: Palette = {
  bg: 'var(--gs-cream)',
  m1: 'var(--gs-lavender)',
  m2: 'var(--gs-purple-light)',
  m3: 'var(--gs-purple)',
  m4: 'var(--gs-purple-dark)',
  line: 'var(--gs-cream)',
};

/**
 * Option B — purple plus a split-complementary amber in two steps, bridged by
 * a teal that keeps purple + amber from reading as Halloween. All three are
 * desaturated toward the cream background so they sit beside the brand purple
 * instead of competing with it.
 */
export const EDITORIAL: Palette = {
  bg: 'var(--gs-cream)',
  m1: 'var(--gs-amber)',
  m2: 'var(--gs-purple)',
  m3: 'var(--gs-teal)',
  m4: 'var(--gs-amber-deep)',
  line: 'var(--gs-cream)',
};

/**
 * The frame every surface has to agree on: the blog cards, the lab preview and
 * the PNG rasteriser. `Collage` defaults to the wider 1120/545 editorial ratio,
 * but every cover box in the blog is 16/9 — change it here and all three follow.
 */
export const COVER_ASPECT = 16 / 9;

/** Raster target for `public/img/blog-covers/*.png` — COVER_ASPECT × 900. */
export const COVER_RASTER = { width: 1600, height: 900 } as const;

/**
 * Stable identifier for a composition. Used as the PNG filename and as the key
 * anything outside the design system maps onto — `title` is copy and will drift.
 */
export type CoverId = 'agentes' | 'automatizar' | 'senal' | 'conocimiento';

export type Cover = { id: CoverId; title: string; note: string; build: (p: Palette) => CollageLayer[] };

export const COVERS: Cover[] = [
  {
    id: 'agentes',
    title: 'Agentes de IA que trabajan solos',
    note: 'bubble + hexágono con grafo · sparkle',
    build: (p) => [
      { kind: 'mass', shape: 'circle', x: 0.9, y: 0.24, size: 0.3, tone: p.m1 },
      { kind: 'mass', shape: 'lozenge', x: 0.74, y: 0.82, size: 0.22, tone: p.m1 },
      { kind: 'mass', shape: 'bubble', x: 0.26, y: 0.46, size: 0.31, tone: p.m2 },
      { kind: 'squiggle', x: 0.25, y: 0.42, size: 0.16, tone: p.line, cycles: 3, strokeWidth: 4 },
      { kind: 'pattern', clip: 'hexagon', figure: 'radial', params: { sides: 9 }, x: 0.47, y: 0.55, size: 0.26, field: p.m3, tone: p.line, strokeWidth: 2 },
      { kind: 'sparkle', x: 0.63, y: 0.2, size: 0.13, tone: p.m4, strokeWidth: 4 },
    ],
  },
  {
    id: 'automatizar',
    title: 'Automatizar el trabajo repetitivo',
    note: 'arco + retícula recortada · onda suelta',
    build: (p) => [
      { kind: 'mass', shape: 'circle', x: 0.06, y: 0.16, size: 0.24, tone: p.m1 },
      { kind: 'mass', shape: 'arch', x: 0.28, y: 0.58, size: 0.3, tone: p.m2 },
      { kind: 'pattern', clip: 'square', figure: 'grid', params: { sides: 6 }, x: 0.55, y: 0.5, size: 0.25, field: p.m3, tone: p.line, strokeWidth: 2, rotate: -8 },
      { kind: 'mass', shape: 'circle', x: 0.84, y: 0.66, size: 0.22, tone: p.m1 },
      { kind: 'lines', figure: 'concentric', params: { rings: 5 }, x: 0.84, y: 0.66, size: 0.18, tone: p.m4, strokeWidth: 2 },
      { kind: 'squiggle', x: 0.62, y: 0.16, size: 0.28, ratio: 0.22, loop: false, tone: p.m4, strokeWidth: 3 },
    ],
  },
  {
    id: 'senal',
    title: 'Leer la señal en los datos',
    note: 'círculo grande + lissajous · blob al corte',
    build: (p) => [
      { kind: 'mass', shape: 'circle', x: 0.22, y: 0.5, size: 0.38, tone: p.m2 },
      { kind: 'lines', figure: 'lissajous', params: { ratio: 3 }, x: 0.22, y: 0.5, size: 0.3, tone: p.line, strokeWidth: 2.5 },
      { kind: 'mass', shape: 'hexagon', x: 0.55, y: 0.34, size: 0.22, tone: p.m3, rotate: 14 },
      { kind: 'mass', shape: 'blob', x: 0.82, y: 0.62, size: 0.28, tone: p.m1 },
      { kind: 'pattern', clip: 'blob', figure: 'wave', params: { sides: 6, turns: 2 }, x: 0.82, y: 0.62, size: 0.28, tone: p.m4, strokeWidth: 2 },
      { kind: 'sparkle', x: 0.63, y: 0.8, size: 0.11, tone: p.m4, strokeWidth: 3 },
    ],
  },
  {
    id: 'conocimiento',
    title: 'Conocimiento que circula por el equipo',
    note: 'masas solapadas · el multiply crea el tercer color',
    build: (p) => [
      { kind: 'mass', shape: 'blob', x: 0.2, y: 0.46, size: 0.32, tone: p.m1 },
      { kind: 'mass', shape: 'circle', x: 0.38, y: 0.62, size: 0.26, tone: p.m2 },
      { kind: 'pattern', clip: 'circle', figure: 'orbit', params: { rings: 3, rotation: 18 }, x: 0.54, y: 0.38, size: 0.26, field: p.m3, tone: p.line, strokeWidth: 2 },
      { kind: 'mass', shape: 'triangle', x: 0.76, y: 0.62, size: 0.2, tone: p.m4, rotate: 18 },
      { kind: 'squiggle', x: 0.86, y: 0.24, size: 0.26, ratio: 0.3, tone: p.m2, strokeWidth: 3.5 },
    ],
  },
];

export const COVER_BY_ID = Object.fromEntries(COVERS.map((cover) => [cover.id, cover])) as Record<CoverId, Cover>;
