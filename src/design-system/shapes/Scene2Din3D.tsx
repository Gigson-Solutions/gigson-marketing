'use client';

import { useEffect, useRef } from 'react';

import { outline, type OutlineName, type Point3, rotate, rotateXYZ } from './geometry';

const PERSPECTIVE = 420;
// Default camera. Off-axis so planes read as planes rather than flat outlines.
const BASE_YAW = 0.5;

export type ScenePreset = 'gyroscope' | 'carousel' | 'tunnel' | 'tumble' | 'constellation';

/**
 * Presets whose depth axis *is* the view axis. Rotating the camera would slide
 * them diagonally out of frame, so they're viewed straight down the barrel.
 */
const AXIS_ALIGNED = new Set<ScenePreset>(['tunnel']);

type Scene2Din3DProps = {
  preset: ScenePreset;
  size?: number;
  color?: string;
  speed?: number;
  tilt?: number;
  lineWidth?: number;
  interactive?: boolean;
  className?: string;
};

type Instance = {
  /** World-space outline, or null when the figure is a screen-facing billboard. */
  points: Point3[] | null;
  /** Billboard centre in world space. */
  centre?: Point3;
  /** Billboard outline on the flat plane, radius 1. */
  flat?: Point3[];
  scale: number;
};

function resolveColor(input: string, element: Element): string {
  const match = /^var\((--[\w-]+)\)$/.exec(input.trim());
  if (!match) return input;
  return globalThis.getComputedStyle(element).getPropertyValue(match[1]).trim() || '#7874F4';
}

/** Place a flat outline in world space with an orientation and offset. */
function place(shape: Point3[], rx: number, ry: number, rz: number, scale: number, offset: Point3): Point3[] {
  return shape.map((p) => {
    const r = rotateXYZ({ x: p.x * scale, y: p.y * scale, z: 0 }, rx, ry, rz);
    return { x: r.x + offset.x, y: r.y + offset.y, z: r.z + offset.z };
  });
}

/** Each preset returns the figures for a given moment in time. */
function buildFrame(preset: ScenePreset, t: number): Instance[] {
  switch (preset) {
    /** Three rings on orthogonal planes — flat circles reading as a sphere. */
    case 'gyroscope': {
      const ring = outline('circle');
      return [
        { points: place(ring, 0, 0, 0, 0.95, { x: 0, y: 0, z: 0 }), scale: 1 },
        { points: place(ring, Math.PI / 2, t * 0.6, 0, 0.95, { x: 0, y: 0, z: 0 }), scale: 1 },
        { points: place(ring, 0, Math.PI / 2, t * 0.4, 0.95, { x: 0, y: 0, z: 0 }), scale: 1 },
      ];
    }

    /** Flat polygons orbiting in depth, always facing the viewer. */
    case 'carousel': {
      const flat = outline('pentagon');
      const count = 6;
      return Array.from({ length: count }, (_, index) => {
        const a = t * 0.5 + (index / count) * Math.PI * 2;
        return { points: null, flat, scale: 0.3, centre: { x: Math.cos(a), y: 0, z: Math.sin(a) } };
      });
    }

    /** Squares receding into depth, recycled as they pass the camera. */
    case 'tunnel': {
      const flat = outline('square');
      const count = 9;
      return Array.from({ length: count }, (_, index) => {
        // Loop z through [-1, 1) so figures stream continuously toward the viewer.
        const z = (((index / count + t * 0.16) % 1) + 1) % 1;
        return { points: null, flat, scale: 0.28 + z * 0.5, centre: { x: 0, y: 0, z: 1 - z * 2 } };
      });
    }

    /** A single flat hexagon tumbling on two axes — the clearest "2D in 3D" read. */
    case 'tumble': {
      const flat = outline('hexagon');
      return [{ points: place(flat, t * 0.7, t * 0.45, 0, 0.9, { x: 0, y: 0, z: 0 }), scale: 1 }];
    }

    /** Triangles scattered in depth, each spinning on its own plane. */
    case 'constellation': {
      const flat = outline('triangle');
      const seeds = [
        { x: -0.62, y: 0.44, z: 0.3 },
        { x: 0.58, y: 0.2, z: -0.45 },
        { x: 0.1, y: -0.6, z: 0.5 },
        { x: -0.35, y: -0.2, z: -0.6 },
        { x: 0.66, y: -0.52, z: 0.15 },
      ];
      return seeds.map((offset, index) => ({
        points: place(flat, t * (0.3 + index * 0.12), t * (0.25 + index * 0.09), 0, 0.26, offset),
        scale: 1,
      }));
    }
  }
}

/**
 * Flat parametric outlines moving through a 3D space.
 *
 * Different from `Wireframe3D`: there is no solid here. Every figure is a
 * 2D shape that is either oriented on a plane in world space or kept
 * facing the viewer while it travels in depth.
 */
export function Scene2Din3D({
  preset,
  size = 220,
  color = 'var(--gs-purple)',
  speed = 0.5,
  tilt = 16,
  lineWidth = 1,
  interactive = true,
  className,
}: Scene2Din3DProps) {
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

    const stroke = resolveColor(color, canvas);
    const radius = size * 0.34;
    const centre = size / 2;
    const axisAligned = AXIS_ALIGNED.has(preset);
    const baseYaw = axisAligned ? 0 : BASE_YAW;
    const basePitch = axisAligned ? 0 : (tilt * Math.PI) / 180;
    // Axis-aligned scenes get a gentler pointer response for the same reason.
    const sway = axisAligned ? 0.14 : 0.5;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const project = (p: Point3, yaw: number, pitch: number) => {
      const r = rotate({ x: p.x * radius, y: p.y * radius, z: p.z * radius }, yaw, pitch);
      const scale = PERSPECTIVE / (PERSPECTIVE + r.z + radius);
      return { x: centre + r.x * scale, y: centre - r.y * scale, z: r.z, scale };
    };

    const draw = (t: number, yaw: number, pitch: number) => {
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = stroke;

      const drawables = buildFrame(preset, t).map((instance) => {
        if (instance.points) {
          const pts = instance.points.map((p) => project(p, yaw, pitch));
          const depth = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
          return { pts, depth };
        }

        // Billboard: only the centre travels in 3D; the outline stays flat
        // and is scaled by that centre's perspective factor.
        const c = project(instance.centre!, yaw, pitch);
        const r = instance.scale * radius * c.scale;
        const pts = instance.flat!.map((p) => ({ x: c.x + p.x * r, y: c.y - p.y * r, z: c.z, scale: c.scale }));
        return { pts, depth: c.z };
      });

      // Painter's algorithm: far figures first, so nearer ones read as in front.
      drawables.sort((a, b) => a.depth - b.depth);

      for (const { pts, depth } of drawables) {
        ctx.globalAlpha = 0.3 + 0.7 * ((depth / radius + 1) / 2);
        ctx.beginPath();
        for (const [index, p] of pts.entries()) {
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      draw(0.8, baseYaw, basePitch);
      return;
    }

    let frame = 0;
    let running = true;
    let start: number | undefined;

    const loop = (now: number) => {
      if (!running) return;
      start ??= now;
      const t = ((now - start) / 1000) * speed;
      draw(t, baseYaw + pointer.current.x * sway, basePitch + pointer.current.y * sway * 0.6);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        start = undefined;
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
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
  }, [preset, size, color, speed, tilt, lineWidth, interactive]);

  return (
    <canvas ref={canvasRef} style={{ width: size, height: size }} className={className} role="presentation" aria-hidden="true" />
  );
}
