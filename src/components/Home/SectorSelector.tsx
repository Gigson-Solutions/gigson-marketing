'use client';

import './SectorSelector.css';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP);

type Props = {
  title: string;
  sectors: string[];
  selected: string[];
  onToggle: (sector: string) => void;
  centered?: boolean;
};

const SectorSelector = ({ title, sectors, selected, onToggle, centered = false }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!containerRef.current) return;

    for (const pill of Array.from(containerRef.current.querySelectorAll('.sector-pill'))) {
      const fill = pill.querySelector('.sector-pill__fill');
      const label = pill.querySelector('.sector-pill__label');
      const isActive = selected.includes((pill as HTMLElement).dataset.sector ?? '');

      gsap.to(fill, {
        scaleX: isActive ? 1 : 0,
        transformOrigin: isActive ? 'left center' : 'right center',
        duration: isActive ? 0.42 : 0.26,
        ease: isActive ? 'power3.out' : 'power2.in',
        overwrite: 'auto',
        onComplete: isActive ? undefined : (() => { gsap.set(fill, { transformOrigin: 'left center' }); }) as gsap.Callback,
      });
      gsap.to(label, {
        color: isActive ? '#ffffff' : '#3c3c3b',
        delay: isActive ? 0.14 : 0,
        duration: 0.1,
        overwrite: 'auto',
      });
      gsap.to(pill, {
        borderColor: isActive ? '#7874f4' : '#3c3c3b',
        duration: isActive ? 0.22 : 0.15,
        overwrite: 'auto',
      });
    }
  }, [selected]);

  const handleMouseEnter = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { y: -3, duration: 0.18, ease: 'power2.out', overwrite: 'auto' });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.22, ease: 'power2.inOut', overwrite: 'auto' });
  });

  const handlePressAnimation = contextSafe((e: React.MouseEvent) => {
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
