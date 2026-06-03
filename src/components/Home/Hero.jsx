import './Hero.css';
import '../Button.css';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PENTAGON_PATH =
  'M60.9883 1.24196L0.826521 86.6989L63.4534 170.484L162.333 136.808L160.803 32.2151L60.9883 1.24196Z';

const ACCENT_DOTS = [
  { cx: 120, cy: 140, r: 5.5, opacity: 0.55 },
  { cx: 945, cy: 545, r: 4, opacity: 0.65 },
  { cx: 770, cy: 905, r: 6.5, opacity: 0.5 },
  { cx: 60, cy: 720, r: 3.2, opacity: 0.7 },
  { cx: 700, cy: 110, r: 3.5, opacity: 0.55 },
];

function Hero() {
  const { t } = useTranslation();
  const { heroH1, heroSubhead, heroBtn, heroScroll } = t('home');

  const shapesRef = useRef(null);
  const pentTiltRef = useRef(null);
  const pentSpinRef = useRef(null);
  const pentAltTiltRef = useRef(null);
  const pentAltSpinRef = useRef(null);
  const largeSphereRef = useRef(null);
  const smallSphereRef = useRef(null);
  const largeGradRef = useRef(null);
  const smallGradRef = useRef(null);
  const ringRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const tweens = [];
    const wanderTweens = [];

    tweens.push(
      gsap.to(pentSpinRef.current, {
        rotation: 360,
        duration: 42,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })
    );
    tweens.push(
      gsap.to(pentAltSpinRef.current, {
        rotation: -360,
        duration: 58,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })
    );
    tweens.push(
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 70,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%',
      })
    );

    tweens.push(
      gsap.to(largeSphereRef.current, {
        y: 10,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    );
    tweens.push(
      gsap.to(largeSphereRef.current, {
        scale: 1.025,
        transformOrigin: '50% 50%',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    );
    tweens.push(
      gsap.to(smallSphereRef.current, {
        y: -12,
        x: 4,
        duration: 5.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    );
    tweens.push(
      gsap.to(smallSphereRef.current, {
        scale: 0.96,
        transformOrigin: '50% 50%',
        duration: 7.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    );

    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      tweens.push(
        gsap.to(dot, {
          y: i % 2 === 0 ? 14 : -12,
          x: i % 2 === 0 ? -8 : 6,
          duration: 4 + i * 0.7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      );
    });

    const largeAuto = { fx: 0.32, fy: 0.28 };
    const smallAuto = { fx: 0.32, fy: 0.28 };

    function wanderLight(state, baseFx, baseFy, delay) {
      function next() {
        const tw = gsap.to(state, {
          fx: baseFx + (Math.random() - 0.5) * 0.35,
          fy: baseFy + (Math.random() - 0.5) * 0.35,
          duration: 7 + Math.random() * 6,
          ease: 'sine.inOut',
          onComplete: next,
        });
        wanderTweens.push(tw);
      }
      gsap.delayedCall(delay, next);
    }
    wanderLight(largeAuto, 0.32, 0.28, 0);
    wanderLight(smallAuto, 0.32, 0.28, 4);

    const largeTarget = { fx: 0.32, fy: 0.28, w: 0 };
    const smallTarget = { fx: 0.32, fy: 0.28, w: 0 };
    const largeBlend = { fx: 0.32, fy: 0.28, w: 0 };
    const smallBlend = { fx: 0.32, fy: 0.28, w: 0 };

    let handleMove;
    let handleLeave;
    let tickerFn;
    let pentTiltSet;
    let pentAltTiltSet;

    if (!prefersReduced) {
      pentTiltSet = gsap.quickTo(pentTiltRef.current, 'rotation', {
        duration: 1.0,
        ease: 'power3.out',
      });
      pentAltTiltSet = gsap.quickTo(pentAltTiltRef.current, 'rotation', {
        duration: 1.0,
        ease: 'power3.out',
      });

      const REACH = 320;

      function shapeCenters() {
        const r = shapesRef.current.getBoundingClientRect();
        const sx = r.width / 1000;
        const sy = r.height / 1000;
        return {
          rect: r,
          large: {
            x: r.left + 450 * sx,
            y: r.top + 575 * sy,
            radius: 235 * Math.min(sx, sy),
          },
          small: {
            x: r.left + 820 * sx,
            y: r.top + 315 * sy,
            radius: 75 * Math.min(sx, sy),
          },
          pent: {
            x: r.left + 644 * sx,
            y: r.top + 374 * sy,
            radius: 300 * Math.min(sx, sy),
          },
          pentAlt: {
            x: r.left + 644 * sx,
            y: r.top + 374 * sy,
            radius: 230 * Math.min(sx, sy),
          },
        };
      }

      function tiltAngle(center, cx, cy, maxDeg) {
        const dx = cx - center.x;
        const dy = cy - center.y;
        const dist = Math.hypot(dx, dy);
        const reach = REACH + center.radius;
        const proximity = gsap.utils.clamp(0, 1, 1 - dist / reach);
        const nx = gsap.utils.clamp(-1, 1, dx / reach);
        const ny = gsap.utils.clamp(-1, 1, dy / reach);
        return (nx - ny) * 0.5 * maxDeg * proximity;
      }

      function lightFor(center, cx, cy) {
        const dx = cx - center.x;
        const dy = cy - center.y;
        const dist = Math.hypot(dx, dy);
        const reach = REACH + center.radius;
        const proximity = gsap.utils.clamp(0, 1, 1 - dist / reach);
        const fx = gsap.utils.clamp(
          0.05,
          0.95,
          0.5 + (dx / (center.radius * 1.6)) * 0.5
        );
        const fy = gsap.utils.clamp(
          0.05,
          0.95,
          0.5 + (dy / (center.radius * 1.6)) * 0.5
        );
        return { fx, fy, w: proximity };
      }

      handleMove = (e) => {
        const c = shapeCenters();
        const cx = e.clientX;
        const cy = e.clientY;

        pentTiltSet(tiltAngle(c.pent, cx, cy, 22));
        pentAltTiltSet(tiltAngle(c.pentAlt, cx, cy, -28));

        Object.assign(largeTarget, lightFor(c.large, cx, cy));
        Object.assign(smallTarget, lightFor(c.small, cx, cy));
      };

      handleLeave = () => {
        pentTiltSet(0);
        pentAltTiltSet(0);
        largeTarget.w = 0;
        smallTarget.w = 0;
      };

      tickerFn = () => {
        const k = 0.08;
        largeBlend.fx += (largeTarget.fx - largeBlend.fx) * k;
        largeBlend.fy += (largeTarget.fy - largeBlend.fy) * k;
        largeBlend.w += (largeTarget.w - largeBlend.w) * k;
        smallBlend.fx += (smallTarget.fx - smallBlend.fx) * k;
        smallBlend.fy += (smallTarget.fy - smallBlend.fy) * k;
        smallBlend.w += (smallTarget.w - smallBlend.w) * k;

        if (largeGradRef.current) {
          const fx =
            largeAuto.fx * (1 - largeBlend.w) + largeBlend.fx * largeBlend.w;
          const fy =
            largeAuto.fy * (1 - largeBlend.w) + largeBlend.fy * largeBlend.w;
          largeGradRef.current.setAttribute('fx', fx.toFixed(3));
          largeGradRef.current.setAttribute('fy', fy.toFixed(3));
        }
        if (smallGradRef.current) {
          const fx =
            smallAuto.fx * (1 - smallBlend.w) + smallBlend.fx * smallBlend.w;
          const fy =
            smallAuto.fy * (1 - smallBlend.w) + smallBlend.fy * smallBlend.w;
          smallGradRef.current.setAttribute('fx', fx.toFixed(3));
          smallGradRef.current.setAttribute('fy', fy.toFixed(3));
        }
      };
      gsap.ticker.add(tickerFn);

      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerleave', handleLeave);
    } else {
      tickerFn = () => {
        if (largeGradRef.current) {
          largeGradRef.current.setAttribute('fx', largeAuto.fx.toFixed(3));
          largeGradRef.current.setAttribute('fy', largeAuto.fy.toFixed(3));
        }
        if (smallGradRef.current) {
          smallGradRef.current.setAttribute('fx', smallAuto.fx.toFixed(3));
          smallGradRef.current.setAttribute('fy', smallAuto.fy.toFixed(3));
        }
      };
      gsap.ticker.add(tickerFn);
    }

    return () => {
      tweens.forEach((tw) => tw.kill());
      wanderTweens.forEach((tw) => tw.kill());
      if (tickerFn) gsap.ticker.remove(tickerFn);
      if (handleMove) window.removeEventListener('pointermove', handleMove);
      if (handleLeave) window.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <div className="wrapper">
      <section className="hero-section">
        <header className="hero-top-content">
          <div className="hero-shapes" aria-hidden="true" ref={shapesRef}>
            <svg
              className="hero-svg"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient
                  id="hero-large-grad"
                  ref={largeGradRef}
                  cx="0.5"
                  cy="0.5"
                  r="0.65"
                  fx="0.32"
                  fy="0.28"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="22%" stopColor="#f0effc" />
                  <stop offset="50%" stopColor="#dddcf8" />
                  <stop offset="78%" stopColor="#aaa6e8" />
                  <stop offset="100%" stopColor="#918de0" />
                </radialGradient>
                <radialGradient
                  id="hero-small-grad"
                  ref={smallGradRef}
                  cx="0.5"
                  cy="0.5"
                  r="0.65"
                  fx="0.32"
                  fy="0.28"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
                  <stop offset="22%" stopColor="#f0effc" />
                  <stop offset="50%" stopColor="#dddcf8" />
                  <stop offset="78%" stopColor="#aaa6e8" />
                  <stop offset="100%" stopColor="#918de0" />
                </radialGradient>
              </defs>

              <g ref={ringRef}>
                <ellipse
                  cx="450"
                  cy="575"
                  rx="280"
                  ry="100"
                  stroke="#7874F4"
                  strokeWidth="0.6"
                  opacity="0.22"
                  fill="none"
                  transform="rotate(-16 450 575)"
                />
              </g>

              <g ref={pentAltTiltRef}>
                <g ref={pentAltSpinRef}>
                  <g transform="translate(386 138) scale(2.6)">
                    <path
                      d={PENTAGON_PATH}
                      stroke="#7874F4"
                      strokeWidth="0.5"
                      strokeMiterlimit="10"
                      opacity="0.32"
                      fill="none"
                    />
                  </g>
                </g>
              </g>

              <g ref={pentTiltRef}>
                <g ref={pentSpinRef}>
                  <g transform="translate(320 65) scale(3.62)">
                    <path
                      d={PENTAGON_PATH}
                      stroke="#7874F4"
                      strokeWidth="0.55"
                      strokeMiterlimit="10"
                      fill="none"
                    />
                  </g>
                </g>
              </g>

              <g ref={largeSphereRef}>
                <circle
                  cx="450"
                  cy="575"
                  r="235"
                  fill="url(#hero-large-grad)"
                />
              </g>

              <g ref={smallSphereRef}>
                <circle
                  cx="820"
                  cy="315"
                  r="75"
                  fill="url(#hero-small-grad)"
                />
              </g>

              {ACCENT_DOTS.map((dot, i) => (
                <circle
                  key={i}
                  ref={(el) => (dotsRef.current[i] = el)}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  fill="#7874F4"
                  opacity={dot.opacity}
                />
              ))}
            </svg>
          </div>
          <div className="hero-text">
            <div className="hero-partner-badge">
              <img
                className="hero-anthropic-logo"
                src="/claude-logo.png"
                alt="Claude"
              />
              <span className="hero-badge-sep">·</span>
              <span className="hero-badge-label">CERTIFIED CLAUDE PARTNER</span>
            </div>
            <h1 className="hero-h1">
              <Trans i18nKey={heroH1} components={{ span: <span /> }} />
            </h1>
            <p className="hero-subhead">{heroSubhead}</p>
            <Link to="/contact" className="hero-btn button-main">
              {heroBtn}
            </Link>
          </div>
        </header>
        <footer className="hero-godown">
          <div
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector('#homeServices');
              el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <p className="hero-godown-a">{heroScroll}</p>
            <svg
              className="icon-godown"
              viewBox="0 0 19 8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.999999L8.92332 6.59293C9.26904 6.83697 9.73096 6.83697 10.0767 6.59293L18 1"
                stroke="#7874f4"
              />
            </svg>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default Hero;
