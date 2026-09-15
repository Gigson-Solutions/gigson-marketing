'use client';

import { useId } from 'react';

import {
  build2D,
  massPath,
  sparklePaths,
  squigglePath,
  type MassName,
  type Shape2DName,
  type Shape2DParams,
} from './geometry';

/**
 * Named steps on the brand's purple ladder. Any CSS colour is also accepted,
 * so a composition can reach outside the ladder without the design system
 * having to bless a new token first.
 */
const TONES: Record<string, string> = {
  light: 'var(--gs-purple-light)',
  base: 'var(--gs-purple)',
  dark: 'var(--gs-purple-dark)',
  deep: 'var(--gs-purple-deep)',
  lavender: 'var(--gs-lavender)',
  ink: 'var(--gs-ink)',
  cream: 'var(--gs-cream)',
  white: 'var(--gs-white)',
};

const tone = (value = 'base') => TONES[value] ?? value;

/** Placement is fractional so a composition is resolution-independent. */
type Placed = {
  /** Centre, as a fraction of the canvas width/height. Values outside 0–1 bleed off the edge. */
  x: number;
  y: number;
  /** Box side, as a fraction of the canvas width. */
  size: number;
  rotate?: number;
  opacity?: number;
};

export type CollageLayer = Placed &
  (
    | { kind: 'mass'; shape: MassName; tone?: string; blend?: boolean }
    | {
        kind: 'pattern';
        clip: MassName;
        figure: Shape2DName;
        params?: Shape2DParams;
        /** Colour of the field the figure is drawn on. Omit for a transparent field. */
        field?: string;
        tone?: string;
        strokeWidth?: number;
        blend?: boolean;
      }
    | { kind: 'lines'; figure: Shape2DName; params?: Shape2DParams; tone?: string; strokeWidth?: number }
    | { kind: 'squiggle'; tone?: string; cycles?: number; loop?: boolean; strokeWidth?: number; ratio?: number }
    | { kind: 'sparkle'; tone?: string; rays?: number; strokeWidth?: number }
  );

type CollageProps = {
  layers: CollageLayer[];
  /** Canvas background. Bleeds to the full frame. */
  background?: string;
  width?: number;
  /** Canvas aspect. 1120×545 is the common editorial hero ratio. */
  aspect?: number;
  className?: string;
};

/**
 * A layered editorial composition built entirely from generated geometry.
 *
 * The visual grammar is three ingredients: large filled masses, `multiply`
 * blending so overlaps resolve into a third colour, and a loose hand-drawn
 * accent. That combination is what makes the result read as an illustration
 * rather than a diagram — and it costs no asset file.
 */
export function Collage({ layers, background = 'var(--gs-cream)', width = 1120, aspect = 1120 / 545, className }: CollageProps) {
  const uid = useId().replaceAll(':', '');
  const height = width / aspect;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="presentation"
      aria-hidden="true"
      // Contain the multiply blending so it never reaches the page behind.
      style={{ isolation: 'isolate', display: 'block' }}
    >
      <rect width={width} height={height} fill={background} />

      {layers.map((layer, index) => {
        const side = layer.size * width;
        const frame = `translate(${layer.x * width} ${layer.y * height}) rotate(${layer.rotate ?? 0}) translate(${-side / 2} ${-side / 2})`;
        const common = { transform: frame, opacity: layer.opacity };

        switch (layer.kind) {
          case 'mass':
            return (
              <g key={index} {...common} style={layer.blend === false ? undefined : { mixBlendMode: 'multiply' }}>
                <path d={massPath(layer.shape, side)} fill={tone(layer.tone)} />
              </g>
            );

          /** A stroked figure clipped to a mass — the figure fills the shape. */
          case 'pattern': {
            const clipId = `${uid}-clip-${index}`;
            return (
              <g key={index} {...common} style={layer.blend === false ? undefined : { mixBlendMode: 'multiply' }}>
                <clipPath id={clipId}>
                  <path d={massPath(layer.clip, side)} />
                </clipPath>
                <g clipPath={`url(#${clipId})`}>
                  {layer.field ? <rect width={side} height={side} fill={tone(layer.field)} /> : null}
                  {build2D(layer.figure, side, layer.params).map((d, i) => (
                    <path key={i} d={d} fill="none" stroke={tone(layer.tone)} strokeWidth={layer.strokeWidth ?? 1.5} />
                  ))}
                </g>
              </g>
            );
          }

          case 'lines':
            return (
              <g key={index} {...common}>
                {build2D(layer.figure, side, layer.params).map((d, i) => (
                  <path key={i} d={d} fill="none" stroke={tone(layer.tone)} strokeWidth={layer.strokeWidth ?? 1.5} />
                ))}
              </g>
            );

          /** A squiggle is wide and short, so centre it in the square slot. */
          case 'squiggle': {
            const squiggleHeight = side * (layer.ratio ?? 0.42);
            return (
              <g key={index} {...common}>
                <path
                  transform={`translate(0 ${(side - squiggleHeight) / 2})`}
                  d={squigglePath(side, squiggleHeight, layer.cycles ?? 3, layer.loop ?? true)}
                  fill="none"
                  stroke={tone(layer.tone)}
                  strokeWidth={layer.strokeWidth ?? 3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          }

          case 'sparkle':
            return (
              <g key={index} {...common}>
                {sparklePaths(side, layer.rays ?? 7).map((d, i) => (
                  <path key={i} d={d} stroke={tone(layer.tone)} strokeWidth={layer.strokeWidth ?? 3} strokeLinecap="round" />
                ))}
              </g>
            );
        }
      })}
    </svg>
  );
}
