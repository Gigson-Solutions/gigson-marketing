'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type DrawOnOptions = {
  /** Seconds per stroke. */
  duration?: number;
  /** Delay between consecutive strokes. */
  stagger?: number;
  /** Viewport position that fires the animation. */
  start?: string;
  /** Replay every time the figure re-enters the viewport. */
  repeat?: boolean;
};

/**
 * Draws every `<path>` inside the returned ref by animating
 * stroke-dashoffset from "fully hidden" to "fully drawn".
 *
 * Only possible because the figures are real paths — this is exactly
 * what a rasterised shape cannot do.
 */
export function useDrawOn<T extends SVGSVGElement>({
  duration = 1.1,
  stagger = 0.12,
  start = 'top 85%',
  repeat = false,
}: DrawOnOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGPathElement>('path', ref.current);
      if (paths.length === 0) return;

      // Honour the OS setting: leave the finished figure on screen, skip the motion.
      if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      for (const path of paths) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration,
        stagger,
        ease: 'power2.inOut',
        scrollTrigger: repeat
          ? { trigger: ref.current, start, toggleActions: 'restart none none reset' }
          : { trigger: ref.current, start, once: true },
      });
    },
    { scope: ref }
  );

  return ref;
}
