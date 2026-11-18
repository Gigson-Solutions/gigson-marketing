'use client';

import './SelfAssessment.css';

import { useId, useState } from 'react';

type Item = {
  question: string;
  /** Short label listed under "points to strengthen" when the answer isn't "yes". */
  gap: string;
};

export type SelfAssessmentCopy = {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Labels for the three answers, worth 2, 1 and 0 points respectively. */
  options: [string, string, string];
  items: Item[];
  /** `{done}` and `{total}` are replaced. */
  count: string;
  empty: string;
  low: string;
  mid: string;
  high: string;
  gapsTitle: string;
  cta: string;
  note: string;
};

export type SelfAssessmentResult = {
  score: number;
  gaps: string[];
};

type SelfAssessmentProps = SelfAssessmentCopy & {
  /** Where the CTA scrolls to: the lead form on the same page. */
  ctaHref?: string;
  /** Fired once every question is answered, and again on every later change. */
  onComplete?: (result: SelfAssessmentResult) => void;
};

const POINTS = [2, 1, 0] as const;
const MAX_GAPS = 5;

/**
 * Client-side readiness quiz. Nothing is sent anywhere: the score lives in the
 * browser until the visitor submits the page's lead form, which carries it
 * along via `onComplete`. That keeps a single conversion point per page.
 */
const SelfAssessment = ({
  eyebrow,
  title,
  lead,
  options,
  items,
  count,
  empty,
  low,
  mid,
  high,
  gapsTitle,
  cta,
  note,
  ctaHref = '#contacto',
  onComplete,
}: SelfAssessmentProps) => {
  const uid = useId();
  const [answers, setAnswers] = useState<(number | undefined)[]>(() =>
    items.map(() => undefined)
  );

  const answered = answers.filter((a) => a !== undefined) as number[];
  const done = answered.length;
  const total = items.length;
  const complete = done === total;
  const score = done
    ? Math.round((answered.reduce((s, a) => s + a, 0) / (done * 2)) * 100)
    : 0;
  const gaps = items
    .filter((_, i) => answers[i] !== undefined && answers[i] !== 2)
    .map((it) => it.gap);
  const verdict = !done ? empty : score < 40 ? low : score < 75 ? mid : high;

  const answer = (index: number, points: number) => {
    const next = [...answers];
    next[index] = points;
    setAnswers(next);
    if (onComplete && next.every((a) => a !== undefined)) {
      const nextScore = Math.round(
        ((next as number[]).reduce((s, a) => s + a, 0) / (total * 2)) * 100
      );
      onComplete({
        score: nextScore,
        gaps: items.filter((_, i) => next[i] !== 2).map((it) => it.gap),
      });
    }
  };

  return (
    <section id="autodiagnostico" className="self-assessment">
      <div className="sa-inner">
        <header className="sa-head">
          {eyebrow && <p className="sa-eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {lead && <p className="sa-lead">{lead}</p>}
        </header>

        <div className="sa-card">
          <form
            className="sa-questions"
            aria-label={title}
            onSubmit={(e) => e.preventDefault()}
          >
            {items.map((item, i) => (
              <fieldset key={i} className="sa-question">
                <legend>
                  <span className="sa-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.question}
                </legend>
                <div className="sa-options">
                  {options.map((label, o) => {
                    const id = `${uid}-q${i}-${o}`;
                    return (
                      <span key={o} className="sa-option">
                        <input
                          type="radio"
                          id={id}
                          name={`${uid}-q${i}`}
                          value={POINTS[o]}
                          checked={answers[i] === POINTS[o]}
                          onChange={() => answer(i, POINTS[o])}
                        />
                        <label htmlFor={id}>{label}</label>
                      </span>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </form>

          <aside className="sa-result" aria-live="polite">
            <span className="sa-count">
              {count
                .replace('{done}', String(done))
                .replace('{total}', String(total))}
            </span>
            <span className="sa-score">{done ? `${score}%` : '–'}</span>
            <div className="sa-bar" aria-hidden="true">
              <i style={{ width: `${done ? score : 0}%` }} />
            </div>
            <p className="sa-verdict">{verdict}</p>
            {gaps.length > 0 && (
              <div className="sa-gaps">
                <p>{gapsTitle}</p>
                <ul>
                  {gaps.slice(0, MAX_GAPS).map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
            {complete && (
              <a className="sa-cta" href={ctaHref}>
                {cta}
              </a>
            )}
            <small className="sa-note">{note}</small>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default SelfAssessment;
