import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const DOT_COLOR = '120, 116, 244';
const LARGE_COUNT = 340;
const SMALL_COUNT = 170;
const WOBBLE_AMP = 0.16;

function randomSphere(n, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  const points = [];
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(2 * rand() - 1);
    const theta = 2 * Math.PI * rand();
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
      // Two harmonics per axis at incommensurable frequencies → quasi-random path
      fA:  0.12 + rand() * 0.7,  phA:  rand() * Math.PI * 2,
      fA2: 0.45 + rand() * 1.1,  phA2: rand() * Math.PI * 2,
      fB:  0.12 + rand() * 0.7,  phB:  rand() * Math.PI * 2,
      fB2: 0.45 + rand() * 1.1,  phB2: rand() * Math.PI * 2,
      fC:  0.12 + rand() * 0.7,  phC:  rand() * Math.PI * 2,
      fC2: 0.45 + rand() * 1.1,  phC2: rand() * Math.PI * 2,
    });
  }
  return points;
}

function rotateY(x, y, z, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: x * c + z * s, y, z: -x * s + z * c };
}

function drawDot(ctx, cx, cy, size, opacity) {
  if (opacity <= 0.005) return;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${DOT_COLOR}, ${Math.min(1, opacity)})`;
  ctx.fill();
}

function renderSphere(ctx, points, cx, cy, rotY, radius, dotSize, mouseX, mouseY, time) {
  const perspective = 600;
  const mouseR = radius * 0.55;
  const isMouseOver = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2) < radius * 1.1;

  const projected = points.map((p) => {
    const wx = (Math.sin(time * p.fA  + p.phA)  * 0.6 + Math.sin(time * p.fA2 + p.phA2) * 0.4) * WOBBLE_AMP;
    const wy = (Math.cos(time * p.fB  + p.phB)  * 0.6 + Math.cos(time * p.fB2 + p.phB2) * 0.4) * WOBBLE_AMP;
    const wz = (Math.sin(time * p.fC  + p.phC)  * 0.6 + Math.sin(time * p.fC2 + p.phC2) * 0.4) * WOBBLE_AMP;

    const r = rotateY((p.x + wx) * radius, (p.y + wy) * radius, (p.z + wz) * radius, rotY);
    const scale = perspective / (perspective + r.z + radius);
    const px = cx + r.x * scale;
    const py = cy + r.y * scale;

    const normalizedZ = (r.z / radius + 1) / 2;
    // Edge factor: 0 at poles, 1 at the visible silhouette of the sphere
    const edgeFactor = Math.min(1, Math.sqrt(r.x * r.x + r.y * r.y) / radius);
    const edgeBoost = Math.pow(edgeFactor, 2.2) * 0.55;
    let opacity = Math.min(1, 0.22 + normalizedZ * 0.78 + edgeBoost);

    if (isMouseOver) {
      const dx = px - mouseX;
      const dy = py - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / mouseR);
      opacity = Math.max(0.08, opacity * (1 - proximity * 0.85));
    }

    return { px, py, scale, opacity, z: r.z };
  });

  projected.sort((a, b) => a.z - b.z);
  for (const { px, py, scale, opacity } of projected) {
    drawDot(ctx, px, py, dotSize * scale, opacity);
  }
}

function renderPentagon(ctx, cx, cy, radius, rotZ, mouseX, mouseY, spheres) {
  const sides = 5;
  const segsPerSide = 60;
  const baseOpacity = 0.85;
  ctx.lineWidth = 1;

  for (let s = 0; s < sides; s++) {
    const a1 = (2 * Math.PI * s) / sides - Math.PI / 2 + rotZ;
    const a2 = (2 * Math.PI * (s + 1)) / sides - Math.PI / 2 + rotZ;
    const x1 = cx + Math.cos(a1) * radius;
    const y1 = cy + Math.sin(a1) * radius;
    const x2 = cx + Math.cos(a2) * radius;
    const y2 = cy + Math.sin(a2) * radius;

    for (let i = 0; i < segsPerSide; i++) {
      const t1 = i / segsPerSide;
      const t2 = (i + 1) / segsPerSide;
      const px1 = x1 + t1 * (x2 - x1);
      const py1 = y1 + t1 * (y2 - y1);
      const px2 = x1 + t2 * (x2 - x1);
      const py2 = y1 + t2 * (y2 - y1);
      const pmx = (px1 + px2) / 2;
      const pmy = (py1 + py2) / 2;

      let overlap = 0;
      for (const sp of spheres) {
        const sdx = pmx - sp.cx;
        const sdy = pmy - sp.cy;
        const d = Math.sqrt(sdx * sdx + sdy * sdy);
        const t = Math.max(0, 1 - d / sp.r);
        if (t > overlap) overlap = t;
      }

      const segOpacity = baseOpacity * (1 - overlap * 0.82);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.strokeStyle = `rgba(120, 116, 244, ${segOpacity})`;
      ctx.stroke();
    }
  }
}

function HeroScene({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const largePts = randomSphere(LARGE_COUNT, 42);
    const smallPts = randomSphere(SMALL_COUNT, 137);

    const anim = { rotY: 0, rotY2: 0, pentRotZ: 0 };
    const mouse = { x: -9999, y: -9999 };

    let w = 0, h = 0, dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function render() {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      const largeR = Math.min(w * 0.40, h * 0.36);
      const smallR = largeR * 0.28;
      const pentR = largeR * 0.587;

      const largeCx = w * 0.60;
      const largeCy = h * 0.65;
      const smallCx = w * 0.84;
      const smallCy = h * 0.30;
      const pentCx = w * 0.74;
      const pentCy = h * 0.35;

      const time = gsap.ticker.time;

      renderPentagon(ctx, pentCx, pentCy, pentR, anim.pentRotZ + 0.15, mouse.x, mouse.y, [
        { cx: largeCx, cy: largeCy, r: largeR },
        { cx: smallCx, cy: smallCy, r: smallR },
      ]);
      renderSphere(ctx, largePts, largeCx, largeCy, anim.rotY, largeR, 15, mouse.x, mouse.y, time);
      renderSphere(ctx, smallPts, smallCx, smallCy, anim.rotY2, smallR, 8, mouse.x, mouse.y, time);
    }

    gsap.to(anim, { rotY: Math.PI * 2, duration: 28, ease: 'none', repeat: -1 });
    gsap.to(anim, { rotY2: Math.PI * 2, duration: 20, ease: 'none', repeat: -1 });
    gsap.to(anim, { pentRotZ: Math.PI * 2, duration: 65, ease: 'none', repeat: -1 });

    gsap.ticker.add(render);

    function handleMouse(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function handleMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    window.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gsap.ticker.remove(render);
      gsap.killTweensOf(anim);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

export default HeroScene;
