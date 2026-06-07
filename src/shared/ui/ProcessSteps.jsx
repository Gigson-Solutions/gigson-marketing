import './ProcessSteps.css';
import { useEffect, useRef, useState } from 'react';

const ProcessSteps = ({ eyebrow, h2a, h2b, lead, steps }) => {
  const [revealed, setRevealed] = useState(false);
  const stepsRef = useRef(null);

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
        <div className="ps-head">
          <span className="ps-eyebrow ps-eyebrow--purple">{eyebrow}</span>
          <h2>
            {h2a}
            <br />
            {h2b}
          </h2>
          {lead && (
            <p className="ps-lead" style={{ maxWidth: '38ch' }}>
              {lead}
            </p>
          )}
        </div>

        <div
          className={`ps-steps${revealed ? ' is-revealed' : ''}`}
          ref={stepsRef}
        >
          {steps?.map(({ title, description }, i) => (
            <div className="ps-step" key={i}>
              <div className="ps-step-num">
                {String(i + 1).padStart(2, '0')}
              </div>
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
