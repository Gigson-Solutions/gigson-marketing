'use client';

import { useEffect, useRef } from 'react';

import { cloudPoints, type CloudName, outline, type OutlineName, type Point3, rotate } from './geometry';

const PERSPECTIVE = 520;
// Start off-axis so a lattice or a disc never reads as a flat pattern.
const START_YAW = 0.3;
/** How far a dot drifts from its place in the distribution, in unit space. */
const WOBBLE = 0.055;
/**
 * Where the wireframe sits relative to the cloud. Concentric would fade
 * uniformly and say nothing; offset up and to the right reproduces the
 * overlap the home hero is built on.
 */
const OUTLINE_SHIFT = { x: 0.2, y: 0.22 };

type PointCloudProps = {
  preset: CloudName;
  size?: number;
  /** CSS custom property or literal colour. */
  color?: string;
  /** Dots in the cloud. */
  count?: number;
  /** Dot diameter in px at neutral depth. Defaults to `size / 50`. */
  dotSize?: number;
  /** Revolutions per second around Y. */
  speed?: number;
  /** Fixed tilt in degrees. Positive looks down on the cloud. */
  tilt?: number;
  /** Flat wireframe drawn behind the cloud; it fades where the cloud covers it. */
  outlineShape?: OutlineName;
  lineWidth?: number;
  /** Dots dim and give way around the pointer. */
  interactive?: boolean;
  /** Same seed, same cloud — on the server and in the browser. */
  seed?: number;
  className?: string;
};

/** Resolve `var(--token)` against the document, since canvas needs a literal. */
function resolveColor(input: string, element: Element): string {
  const match = /^var\((--[\w-]+)\)$/.exec(input.trim());
  if (!match) return input;
  return globalThis.getComputedStyle(element).getPropertyValue(match[1]).trim() || '#7874F4';
}

/** Dots need per-dot alpha, so the colour has to be channels, not a hex string. */
function toChannels(value: string): string {
  const hex = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(value.trim());
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    const int = Number.parseInt(full, 16);
    return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
  }
  const rgb = /rgba?\(([^)]+)\)/i.exec(value);
  if (rgb) return rgb[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).join(', ');
  return '120, 116, 244';
}

/**
 * Deterministic per-dot noise. Two dots must never share a drift phase or the
 * cloud pulses in unison, and a stateful RNG here would desync server/client.
 */
function hash(index: number, channel: number): number {
  const value = Math.sin(index * 12.9898 + channel * 78.233) * 43_758.5453;
  return value - Math.floor(value);
}

/**
 * A figure made of floating points.
 *
 * Same language as the home hero — seeded distribution, multi-frequency
 * drift, opacity from depth plus a rim boost — but the distribution is a
 * parameter, so the shape a cloud describes becomes a design decision
 * instead of a one-off scene.
 */
export function PointCloud({
  preset,
  size = 220,
  color = 'var(--gs-purple)',
  count = 260,
  dotSize,
  speed = 0.045,
  tilt = 12,
  outlineShape,
  lineWidth = 1,
  interactive = true,
  seed = 42,
  className,
}: PointCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, inside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const points = cloudPoints(preset, count, seed);
    const channels = toChannels(resolveColor(color, canvas));
    const radius = size * 0.38;
    const centre = size / 2;
    const dotRadius = (dotSize ?? size / 50) / 2;
    const rim = outlineShape ? outline(outlineShape) : null;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    /** Six harmonics per dot: the cloud breathes instead of vibrating. */
    const drift = (time: number, index: number, axis: number) => {
      const slow = 0.12 + hash(index, axis) * 0.7;
      const fast = 0.45 + hash(index, axis + 3) * 1.1;
      const phase = hash(index, axis + 6) * Math.PI * 2;
      return (Math.sin(time * slow + phase) * 0.6 + Math.sin(time * fast + phase * 1.7) * 0.4) * WOBBLE;
    };

    const drawRim = (spin: number) => {
      if (!rim) return;
      const rx = centre + OUTLINE_SHIFT.x * radius;
      const ry = centre - OUTLINE_SHIFT.y * radius;
      const rr = radius * 1.12;
      const segments = 18;
      ctx.lineWidth = lineWidth;

      for (const [index, from] of rim.entries()) {
        const to = rim[(index + 1) % rim.length];
        const at = (p: Point3, t: number, other: Point3) => {
          const x = p.x + (other.x - p.x) * t;
          const y = p.y + (other.y - p.y) * t;
          return { x: rx + (x * Math.cos(spin) - y * Math.sin(spin)) * rr, y: ry - (x * Math.sin(spin) + y * Math.cos(spin)) * rr };
        };
        for (let step = 0; step < segments; step++) {
          const a = at(from, step / segments, to);
          const b = at(from, (step + 1) / segments, to);
          // Fade the stroke where the cloud sits in front of it.
          const covered = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - centre, (a.y + b.y) / 2 - centre) / (radius * 1.05));
          ctx.strokeStyle = `rgba(${channels}, ${0.8 * (1 - covered * 0.82)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const draw = (time: number, yaw: number, pitch: number) => {
      ctx.clearRect(0, 0, size, size);
      drawRim(time * 0.04);

      const projected = points.map((p, index) => {
        const r = rotate(
          {
            x: (p.x + drift(time, index, 0)) * radius,
            y: (p.y + drift(time, index, 1)) * radius,
            z: (p.z + drift(time, index, 2)) * radius,
          },
          yaw,
          pitch
        );
        const scale = PERSPECTIVE / (PERSPECTIVE + r.z + radius);
        const px = centre + r.x * scale;
        const py = centre - r.y * scale;
        // Depth carries most of the opacity; the rim boost is what gives a
        // sphere of dots its silhouette instead of an even fog.
        const depth = (r.z / radius + 1) / 2;
        const edge = Math.min(1, Math.hypot(r.x, r.y) / radius);
        let alpha = Math.min(1, 0.2 + depth * 0.75 + edge ** 2.2 * 0.5);

        if (pointer.current.inside) {
          const proximity = Math.max(0, 1 - Math.hypot(px - pointer.current.x, py - pointer.current.y) / (radius * 0.55));
          alpha = Math.max(0.08, alpha * (1 - proximity * 0.85));
        }
        return { px, py, scale, alpha, z: r.z };
      });

      projected.sort((a, b) => a.z - b.z);
      for (const { px, py, scale, alpha } of projected) {
        if (alpha <= 0.005) continue;
        ctx.beginPath();
        ctx.arc(px, py, dotRadius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${channels}, ${alpha})`;
        ctx.fill();
      }
    };

    const basePitch = (tilt * Math.PI) / 180;

    if (reduced) {
      draw(4, START_YAW, basePitch);
      return;
    }

    let frame = 0;
    let running = true;
    let start: number | undefined;

    const loop = (now: number) => {
      if (!running) return;
      start ??= now;
      const elapsed = (now - start) / 1000;
      draw(elapsed, START_YAW + elapsed * speed * Math.PI * 2, basePitch);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // Hundreds of dots per cloud: never animate one that isn't on screen.
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
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.current = { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    };
    if (interactive) globalThis.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (interactive) globalThis.removeEventListener('pointermove', onPointerMove);
    };
  }, [preset, size, color, count, dotSize, speed, tilt, outlineShape, lineWidth, interactive, seed]);

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
