'use client';

import { useEffect, useRef } from 'react';

import { MESHES, type MeshName, normalize, rotate } from './geometry';

// Camera distance in px. Lower = stronger perspective, which is what makes a
// wireframe read as a solid instead of a flat diagram.
const PERSPECTIVE = 420;
// Start off-axis: a face-on cube is visually ambiguous.
const START_YAW = 0.62;

type Wireframe3DProps = {
  name: MeshName;
  size?: number;
  /** CSS custom property or literal colour. */
  color?: string;
  /** Revolutions per second around Y. */
  speed?: number;
  /** Fixed tilt in degrees. Positive looks down on the figure from above. */
  tilt?: number;
  lineWidth?: number;
  /** Tilt the figure slightly towards the pointer. */
  interactive?: boolean;
  className?: string;
};

/** Resolve `var(--token)` against the document, since canvas needs a literal. */
function resolveColor(input: string, element: Element): string {
  const match = /^var\((--[\w-]+)\)$/.exec(input.trim());
  if (!match) return input;
  const value = globalThis.getComputedStyle(element).getPropertyValue(match[1]).trim();
  return value || '#7874F4';
}

/**
 * Rotating wireframe rendered to canvas.
 *
 * Deliberately not a 3D library: these solids are line projections, and
 * the projection is ~10 lines of arithmetic already proven in HeroScene.
 * Cost at runtime is zero extra bytes.
 */
export function Wireframe3D({
  name,
  size = 220,
  color = 'var(--gs-purple)',
  speed = 0.08,
  tilt = 18,
  lineWidth = 1,
  interactive = true,
  className,
}: Wireframe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const mesh = normalize(MESHES[name]);
    const stroke = resolveColor(color, canvas);
    // Meshes are normalised to their circumsphere, so this radius is the
    // bounding circle at any rotation — the figure can never clip.
    const radius = size * 0.38;
    const centre = size / 2;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const draw = (yaw: number, pitch: number) => {
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = lineWidth;

      const projected = mesh.vertices.map((v) => {
        const r = rotate({ x: v.x * radius, y: v.y * radius, z: v.z * radius }, yaw, pitch);
        const scale = PERSPECTIVE / (PERSPECTIVE + r.z + radius);
        // Meshes use Y-up; canvas is Y-down, so flip on projection.
        return { x: centre + r.x * scale, y: centre - r.y * scale, z: r.z };
      });

      for (const [a, b] of mesh.edges) {
        const p1 = projected[a];
        const p2 = projected[b];
        // Depth cue: edges at the back fade out, same model as HeroScene.
        const depth = (p1.z + p2.z) / 2 / radius;
        ctx.globalAlpha = 0.28 + 0.72 * ((depth + 1) / 2);
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const basePitch = (tilt * Math.PI) / 180;

    if (reduced) {
      draw(START_YAW, basePitch);
      return;
    }

    let frame = 0;
    let running = true;
    let start: number | undefined;

    const loop = (now: number) => {
      if (!running) return;
      start ??= now;
      const elapsed = (now - start) / 1000;
      const yaw = START_YAW + elapsed * speed * Math.PI * 2 + pointer.current.x * 0.4;
      draw(yaw, basePitch + pointer.current.y * 0.25);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Don't burn CPU on figures that aren't on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          start = undefined;
          frame = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      pointer.current = {
        x: (event.clientX - (rect.left + rect.width / 2)) / rect.width,
        y: (event.clientY - (rect.top + rect.height / 2)) / rect.height,
      };
    };
    if (interactive) globalThis.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (interactive) globalThis.removeEventListener('pointermove', onPointerMove);
    };
  }, [name, size, color, speed, tilt, lineWidth, interactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      role="presentation"
      aria-hidden="true"
    />
  );
}
