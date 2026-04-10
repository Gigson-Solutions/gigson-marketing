import './SectorSelector.css';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const SectorSelector = ({ title, sectors, selected, onToggle, centered = false }) => {
  const containerRef = useRef(null);
  const isFirstRender = useRef(true);

  // ── Entry stagger animation ──
  const { contextSafe } = useGSAP(
    () => {
      gsap.from('.sector-pill', {
        y: 20,
        autoAlpha: 0,
        duration: 0.5,
        stagger: { amount: 0.45, from: 'start' },
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  // ── Sync fill + colors with `selected` prop (handles click AND reset) ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!containerRef.current) return;

    containerRef.current.querySelectorAll('.sector-pill').forEach((pill) => {
      const fill = pill.querySelector('.sector-pill__fill');
      const label = pill.querySelector('.sector-pill__label');
      const isActive = selected.includes(pill.dataset.sector);

      // Sweep fill in/out
      gsap.to(fill, {
        scaleX: isActive ? 1 : 0,
        transformOrigin: isActive ? 'left center' : 'right center',
        duration: isActive ? 0.42 : 0.26,
        ease: isActive ? 'power3.out' : 'power2.in',
        overwrite: 'auto',
        onComplete: isActive
          ? undefined
          : () => gsap.set(fill, { transformOrigin: 'left center' }),
      });

      // Text color — delay on activate so fill covers text first
      gsap.to(label, {
        color: isActive ? '#ffffff' : '#3c3c3b',
        delay: isActive ? 0.14 : 0,
        duration: 0.1,
        overwrite: 'auto',
      });

      // Border color
      gsap.to(pill, {
        borderColor: isActive ? '#7874f4' : '#3c3c3b',
        duration: isActive ? 0.22 : 0.15,
        overwrite: 'auto',
      });
    });
  }, [selected]);

  // ── Hover lift ──
  const handleMouseEnter = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      y: -3,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  const handleMouseLeave = contextSafe((e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      duration: 0.22,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  });

  // ── Click press feedback (GSAP only — state update is in JSX onClick) ──
  const handlePressAnimation = contextSafe((e) => {
    gsap.fromTo(
      e.currentTarget,
      { scale: 1 },
      { scale: 0.93, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.in' }
    );
  });

  return (
    <div
      ref={containerRef}
      className={`sector-selector${centered ? ' sector-selector--centered' : ''}`}
    >
      <h3 className="sector-selector__title">{title}</h3>
      <div className="sector-selector__grid">
        {sectors.map((sector) => (
          <button
            key={sector}
            data-sector={sector}
            className="sector-pill"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              handlePressAnimation(e);
              onToggle(sector);
            }}
          >
            <span className="sector-pill__fill" />
            <span className="sector-pill__label">{sector}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectorSelector;
