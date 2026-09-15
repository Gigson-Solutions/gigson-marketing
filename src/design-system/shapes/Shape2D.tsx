'use client';

import { build2D, type Shape2DName, type Shape2DParams } from './geometry';
import { useDrawOn } from './useDrawOn';

type Shape2DProps = {
  name: Shape2DName;
  /** Rendered box in px. Geometry is generated to fit exactly. */
  size?: number;
  /** Defaults to the brand accent token. */
  color?: string;
  strokeWidth?: number;
  /** Draw the figure on with GSAP when it scrolls into view. */
  animate?: boolean;
  /** Seconds per stroke — lets each figure draw on at its own pace. */
  duration?: number;
  /** Delay between consecutive strokes. */
  stagger?: number;
  className?: string;
  params?: Shape2DParams;
};

/**
 * A parametric line figure. Generated from `build2D()`, coloured from the
 * design tokens, and drawable on scroll — no asset file involved.
 */
export function Shape2D({
  name,
  size = 220,
  color = 'var(--gs-purple)',
  strokeWidth = 1,
  animate = true,
  duration,
  stagger,
  className,
  params,
}: Shape2DProps) {
  const ref = useDrawOn<SVGSVGElement>({ duration, stagger });
  const paths = build2D(name, size, params);

  return (
    <svg
      ref={animate ? ref : undefined}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
