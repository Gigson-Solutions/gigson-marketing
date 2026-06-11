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
    <section className="process-steps-section wrapper">
      <header className="process-steps-header">
        {eyebrow && <p className="process-steps-eyebrow">{eyebrow}</p>}
        <h2 className="process-steps-h2">
          {h2a}
          {h2b && <span className="text-purple-accents"> {h2b}</span>}
        </h2>
        {lead && <p className="process-steps-lead">{lead}</p>}
      </header>
      <div
        ref={stepsRef}
        className={`process-steps-list ${revealed ? 'process-steps-list--revealed' : ''}`}
      >
        {steps.map(({ title, description }, i) => (
          <div key={i} className="process-step">
            <span className="process-step-nr">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="process-step-title">{title}</h3>
            <p className="process-step-desc">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
