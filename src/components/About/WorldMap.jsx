import './WorldMap.css';

import createGlobe from 'cobe';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MARKERS = [
  { role: 'CTO',                 city: 'Madrid',    lat: 40.4168,  lng: -3.7038  },
  { role: 'Founders',            city: 'Barcelona', lat: 41.7,     lng: 2.0      },
  { role: 'Full Stack',          city: 'Barcelona', lat: 41.0,     lng: 2.5      },
  { role: 'Solutions Architect', city: 'México',    lat: 19.4326,  lng: -99.1332 },
  { role: 'UX/UI',               city: 'Perú',      lat: -12.0464, lng: -77.0428 },
  { role: 'Product Manager',     city: 'Valencia',  lat: 39.4699,  lng: -0.3763  },
  { role: 'DevOps',              city: 'Argentina', lat: -34.6037, lng: -58.3816 },
];

const INITIAL_PHI   = -0.4;
const INITIAL_THETA = 0.25;
const SPEED         = 0.0022;
const THETA_LIMIT   = Math.PI / 2;

// Cobe v2 lat/lng → unit 3D vector (matches cobe's internal U function)
function latLngToVec3(lat, lng) {
  const latR   = lat * Math.PI / 180;
  const lngR   = lng * Math.PI / 180 - Math.PI;
  const cosLat = Math.cos(latR);
  return [-cosLat * Math.cos(lngR), Math.sin(latR), cosLat * Math.sin(lngR)];
}

// Project 3D point to screen fraction [0-1] — matches cobe v2's O function
function projectVec3(vec, phi, theta) {
  const cp = Math.cos(phi), sp = Math.sin(phi);
  const ct = Math.cos(theta), st = Math.sin(theta);
  const x1 = cp * vec[0] + sp * vec[2];
  const y1 = sp * st * vec[0] + ct * vec[1] - cp * st * vec[2];
  const z1 = -sp * ct * vec[0] + st * vec[1] + cp * ct * vec[2];
  return { x: (x1 + 1) / 2, y: (-y1 + 1) / 2, visible: z1 >= 0.05 };
}

const WorldMap = () => {
  const canvasRef  = useRef(null);
  const wrapRef    = useRef(null);
  const labelRefs  = useRef([]);
  const sectionRef = useRef(null);
  const phiRef     = useRef(INITIAL_PHI);
  const thetaRef   = useRef(INITIAL_THETA);
  const dragRef    = useRef(null); // { x, y, phi, theta, lastPhi, lastTheta }
  const velRef     = useRef({ phi: 0, theta: 0 });
  const globeRef   = useRef(null);
  const rafRef     = useRef(null);

  const markerVecs = MARKERS.map(m => latLngToVec3(m.lat, m.lng));

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const raf0 = requestAnimationFrame(() => {
      const size = wrap.offsetWidth;
      if (!size || globeRef.current) return;

      const dpr = Math.min(window.devicePixelRatio, 2);

      globeRef.current = createGlobe(canvas, {
        devicePixelRatio : dpr,
        width            : size * dpr,
        height           : size * dpr,
        phi              : INITIAL_PHI,
        theta            : INITIAL_THETA,
        dark             : 1,
        diffuse          : 1.4,
        scale            : 1,
        mapSamples       : 20000,
        mapBrightness    : 7,
        baseColor        : [0.18, 0.18, 0.3],
        markerColor      : [0.471, 0.455, 0.957],
        glowColor        : [0.3, 0.27, 0.72],
        markers          : MARKERS.map(m => ({ location: [m.lat, m.lng], size: 0.07 })),
      });

      function animate() {
        if (dragRef.current) {
          velRef.current.phi   = phiRef.current   - dragRef.current.lastPhi;
          velRef.current.theta = thetaRef.current - dragRef.current.lastTheta;
          dragRef.current.lastPhi   = phiRef.current;
          dragRef.current.lastTheta = thetaRef.current;
        } else {
          velRef.current.phi   *= 0.92;
          velRef.current.theta *= 0.92;
          if (Math.abs(velRef.current.phi)   < SPEED) velRef.current.phi   = 0;
          if (Math.abs(velRef.current.theta) < 0.001) velRef.current.theta = 0;
          phiRef.current   += velRef.current.phi || SPEED;
          thetaRef.current  = Math.max(-THETA_LIMIT, Math.min(THETA_LIMIT,
            thetaRef.current + velRef.current.theta,
          ));
        }

        globeRef.current?.update({ phi: phiRef.current, theta: thetaRef.current });

        // 1 — raw label positions
        const s   = wrap.offsetWidth;
        const cx  = s / 2;
        const cy  = s / 2;
        const PAD = 6;

        const pins = markerVecs.map((vec, i) => {
          const el = labelRefs.current[i];
          if (!el) return null;
          const p   = projectVec3(vec, phiRef.current, thetaRef.current);
          const pw  = el.offsetWidth  || 122;
          const ph  = el.offsetHeight || 40;
          const px  = p.x * s;
          const py  = p.y * s;
          const dx  = px - cx, dy = py - cy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          return { el, lx: px + (dx / len) * 28 - pw / 2, ly: py + (dy / len) * 28 - ph / 2, pw, ph, visible: p.visible };
        });

        // 2 — resolve collisions
        for (let iter = 0; iter < 5; iter++) {
          for (let i = 0; i < pins.length; i++) {
            for (let j = i + 1; j < pins.length; j++) {
              const a = pins[i], b = pins[j];
              if (!a || !b || !a.visible || !b.visible) continue;
              const acx = a.lx + a.pw / 2, acy = a.ly + a.ph / 2;
              const bcx = b.lx + b.pw / 2, bcy = b.ly + b.ph / 2;
              const ovX = (a.pw + b.pw) / 2 + PAD - Math.abs(bcx - acx);
              const ovY = (a.ph + b.ph) / 2 + PAD - Math.abs(bcy - acy);
              if (ovX > 0 && ovY > 0) {
                if (ovY <= ovX) {
                  const push = ovY / 2;
                  if (bcy >= acy) { a.ly -= push; b.ly += push; } else { a.ly += push; b.ly -= push; }
                } else {
                  const push = ovX / 2;
                  if (bcx >= acx) { a.lx -= push; b.lx += push; } else { a.lx += push; b.lx -= push; }
                }
              }
            }
          }
        }

        // 3 — apply
        pins.forEach(pin => {
          if (!pin) return;
          pin.el.style.transform = `translate(${pin.lx}px,${pin.ly}px)`;
          pin.el.style.opacity   = pin.visible ? '1' : '0';
        });

        rafRef.current = requestAnimationFrame(animate);
      }
      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(raf0);
      cancelAnimationFrame(rafRef.current);
      if (globeRef.current) { globeRef.current.destroy(); globeRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e) => {
    velRef.current = { phi: 0, theta: 0 };
    dragRef.current = {
      x: e.clientX, y: e.clientY,
      phi: phiRef.current, theta: thetaRef.current,
      lastPhi: phiRef.current, lastTheta: thetaRef.current,
    };
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const s = wrapRef.current?.offsetWidth || 640;
    phiRef.current   = dragRef.current.phi + ((e.clientX - dragRef.current.x) / s) * Math.PI * 2;
    thetaRef.current = Math.max(-THETA_LIMIT, Math.min(THETA_LIMIT,
      dragRef.current.theta + ((e.clientY - dragRef.current.y) / s) * Math.PI,
    ));
  };

  const onPointerUp = () => { dragRef.current = null; };

  useGSAP(
    () => {
      gsap.set(canvasRef.current, { opacity: 0, scale: 0.88 });
      ScrollTrigger.create({
        trigger : sectionRef.current,
        start   : 'top 82%',
        once    : true,
        onEnter : () =>
          gsap.to(canvasRef.current, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="world-map-section" ref={sectionRef}>
      <div className="world-map-globe-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="world-map-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: 'grab' }}
        />
        {MARKERS.map((marker, i) => (
          <div
            key={i}
            ref={(el) => (labelRefs.current[i] = el)}
            className="world-map-pin"
          >
            <span className="pin-role">{marker.role}</span>
            <span className="pin-city">{marker.city}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorldMap;
