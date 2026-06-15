'use client';

import './ProcessSteps.css';

import { useEffect, useRef, useState } from 'react';

type Step = {
  title: string;
  description: string;
};

type ProcessStepsProps = {
  eyebrow?: string;
  h2a: string;
  h2b?: string;
  lead?: string;
  steps: Step[];
};

const ProcessSteps = ({ eyebrow, h2a, h2b, lead, steps }: ProcessStepsProps) => {
  const [revealed, setRevealed] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in globalThis)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="process-steps">
      <div className="ps-inner">
        <header className="ps-head">
          {eyebrow && <p className="ps-eyebrow">{eyebrow}</p>}
          <h2>
            {h2a}
            {h2b && <span className="text-purple-accents"> {h2b}</span>}
          </h2>
          {lead && <p className="ps-lead">{lead}</p>}
        </header>
        <div
          ref={stepsRef}
          className={`ps-steps${revealed ? ' is-revealed' : ''}`}
        >
          {steps.map(({ title, description }, i) => (
            <div key={i} className="ps-step">
              <span className="ps-step-num">{String(i + 1).padStart(2, '0')}</span>
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
