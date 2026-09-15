import type { Shape2DName, Shape2DParams } from '../../design-system/shapes';

/* One shapes-lab figure per use case — fourteen cases, fourteen figures, no
   repeats. They all animate with the design system's single draw-on
   (useDrawOn: stroke-dashoffset, on scroll, reduced-motion aware); what
   changes per case is the figure plus the pace it is drawn at. */

export type Industry = 'logistics' | 'retail' | 'construction' | 'professional-services';

export type UseCaseShape = {
  name: Shape2DName;
  params?: Shape2DParams;
  /** Seconds per stroke. */
  duration: number;
  /** Delay between consecutive strokes. */
  stagger: number;
};

const SHAPES: Record<Industry, UseCaseShape[]> = {
  logistics: [
    { name: 'orbit', params: { rings: 3, rotation: 20 }, duration: 1.1, stagger: 0.16 },
    { name: 'radial', params: { sides: 18 }, duration: 0.8, stagger: 0.035 },
    { name: 'concentric', params: { rings: 5 }, duration: 1.3, stagger: 0.18 },
    { name: 'grid', params: { sides: 6 }, duration: 0.95, stagger: 0.07 },
  ],
  retail: [
    { name: 'rose', params: { ratio: 5 }, duration: 1.4, stagger: 0.1 },
    { name: 'hexgrid', params: { sides: 5 }, duration: 0.75, stagger: 0.06 },
    { name: 'spirograph', params: { ratio: 3.4, inner: 0.55, turns: 5 }, duration: 2, stagger: 0.1 },
    { name: 'wave', params: { sides: 7, turns: 2 }, duration: 1.05, stagger: 0.13 },
  ],
  construction: [
    { name: 'chord', params: { sides: 16, ratio: 6 }, duration: 1.2, stagger: 0.28 },
    { name: 'contour', params: { rings: 5 }, duration: 1.35, stagger: 0.15 },
    { name: 'lissajous', params: { ratio: 3 }, duration: 1.15, stagger: 0.1 },
    { name: 'staircase', params: { sides: 6 }, duration: 0.7, stagger: 0.08 },
  ],
  'professional-services': [
    { name: 'arcs', params: { rings: 4 }, duration: 1.2, stagger: 0.2 },
    { name: 'superellipse', params: { ratio: 4, rotation: 15 }, duration: 1, stagger: 0.1 },
  ],
};

/* Note: rose, spirograph, lissajous and staircase are single-stroke figures,
   so for those the pace is carried by `duration` alone — `stagger` has no
   second stroke to delay. Their durations are spread deliberately. */
export const shapeFor = (industry: Industry, index: number): UseCaseShape => {
  const set = SHAPES[industry];
  return set[index % set.length];
};
