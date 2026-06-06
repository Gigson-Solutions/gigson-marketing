import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ARROW_COLOR = '120, 116, 244';

function fibonacciSphere(n, radius) {
  const points = [];
  const golden = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi = (2 * Math.PI * i) / golden;
    points.push({
      x: Math.sin(theta) * Math.cos(phi) * radius,
      y: Math.sin(theta) * Math.sin(phi) * radius,
      z: Math.cos(theta) * radius,
    });
  }
  return points;
}

function pentagonEdgePoints_unused(n, radius) {
  const points = [];
  const sides = 5;
  const perSide = Math.ceil(n / sides);
  for (let s = 0; s < sides; s++) {
    const a1 = (2 * Math.PI * s) / sides - Math.PI / 2;
    const a2 = (2 * Math.PI * (s + 1)) / sides - Math.PI / 2;
    const x1 = Math.cos(a1) * radius;
    const y1 = Math.sin(a1) * radius;
    const x2 = Math.cos(a2) * radius;
    const y2 = Math.sin(a2) * radius;
    const edgeAngle = Math.atan2(y2 - y1, x2 - x1);
    for (let i = 0; i < perSide; i++) {
      const t = i / perSide;
      points.push({
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
        angle: edgeAngle,
      });
    }
  }
  return points;
}

function rotateY(x, y, z, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: x * c + z * s, y, z: -x * s + z * c };
}

function drawArrow(ctx, cx, cy, size, opacity, angle) {
  if (opacity <= 0.01) return;
  const sc = size / 19;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(sc, sc);
  ctx.translate(-9.5, -9);
  ctx.beginPath();
  ctx.moveTo(1, 9);
  ctx.lineTo(12, 9);
  ctx.moveTo(12, 1);
  ctx.lineTo(17.76, 9);
  ctx.lineTo(12, 17);
  ctx.strokeStyle = `rgba(${ARROW_COLOR}, ${Math.min(1, Math.max(0, opacity))})`;
  ctx.lineWidth = 2 / sc;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function renderSphere(ctx, points, cx, cy, rotY, radius, arrowSize, mouseX, mouseY, mouseRadius = 220) {
  const perspective = 600;
  const projected = points.map((p) => {
    const r = rotateY(p.x, p.y, p.z, rotY);
    const scale = perspective / (perspective + r.z + radius);
    const px = cx + r.x * scale;
    const py = cy + r.y * scale;
    const normalizedZ = (r.z / radius + 1) / 2;
    const baseOpacity = 0.28 + normalizedZ * 0.72;
    const dx = px - mouseX;
    const dy = py - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - dist / mouseRadius);
    const opacity = baseOpacity * (1 - proximity * 0.88);
    return { px, py, scale, opacity, z: r.z };
  });

  projected.sort((a, b) => a.z - b.z);

  for (const { px, py, scale, opacity } of projected) {
    const sz = arrowSize * scale;
    const angle = rotY * 0.4;
    drawArrow(ctx, px, py, sz, opacity, angle);
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

    const largeSpherePoints = fibonacciSphere(160, 1);
    const smallSpherePoints = fibonacciSphere(80, 1);

    const anim = { rotY: 0, rotY2: 0, pentRotZ: 0 };
    const mouse = { x: -9999, y: -9999 };

    let w = 0;
    let h = 0;
    let dpr = 1;

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

      // Replicate original PNG composition:
      // large sphere lower-left, small sphere upper-right, pentagon overlapping both
      const largeR = Math.min(w * 0.40, h * 0.36);
      const smallR = largeR * 0.28;
      const pentR = largeR * 0.587;

      const largeCx = w * 0.60;
      const largeCy = h * 0.65;
      const smallCx = w * 0.84;
      const smallCy = h * 0.30;
      const pentCx = w * 0.74;
      const pentCy = h * 0.35;

      const scaledLarge = largeSpherePoints.map((p) => ({
        x: p.x * largeR,
        y: p.y * largeR,
        z: p.z * largeR,
      }));
      const scaledSmall = smallSpherePoints.map((p) => ({
        x: p.x * smallR,
        y: p.y * smallR,
        z: p.z * smallR,
      }));
      // Draw order matches original: pentagon behind, large sphere on top
      renderPentagon(ctx, pentCx, pentCy, pentR, anim.pentRotZ + 0.15, mouse.x, mouse.y, [
        { cx: largeCx, cy: largeCy, r: largeR },
        { cx: smallCx, cy: smallCy, r: smallR },
      ]);
      renderSphere(ctx, scaledLarge, largeCx, largeCy, anim.rotY, largeR, 15, mouse.x, mouse.y);
      renderSphere(ctx, scaledSmall, smallCx, smallCy, anim.rotY2, smallR, 11, mouse.x, mouse.y, 130);
    }

    gsap.to(anim, {
      rotY: Math.PI * 2,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });
    gsap.to(anim, {
      rotY2: Math.PI * 2,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
    gsap.to(anim, {
      pentRotZ: Math.PI * 2,
      duration: 65,
      ease: 'none',
      repeat: -1,
    });

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
