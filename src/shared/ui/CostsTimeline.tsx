'use client';

import './CostsTimeline.css';

import type { ComponentProps } from 'react';

import { Link } from '../../../i18n/navigation';

type Cta = {
  label: string;
  /** An in-page anchor (`#contacto`) or a route key from i18n/routing.ts. */
  href: string;
};

type Card = {
  eyebrow: string;
  title: string;
  items: string[];
  note: string;
  cta?: Cta;
};

export type CostsTimelineCopy = {
  title: string;
  lead?: string;
  cards: Card[];
  /** Optional cross-sell band under the cards (e.g. "Already ISO 27001?"). */
  aside?: { title: string; text: string; cta?: Cta };
};

type Href = ComponentProps<typeof Link>['href'];

const CtaLink = ({ cta, className }: { cta: Cta; className: string }) =>
  cta.href.startsWith('#') ? (
    <a className={className} href={cta.href}>
      {cta.label}
    </a>
  ) : (
    <Link className={className} href={cta.href as Href}>
      {cta.label}
    </Link>
  );

const CostsTimeline = ({ title, lead, cards, aside }: CostsTimelineCopy) => (
  <section id="costes" className="costs-timeline">
    <div className="ct-inner">
      <header className="ct-head">
        <h2>{title}</h2>
        {lead && <p className="ct-lead">{lead}</p>}
      </header>

      <div className="ct-cards">
        {cards.map((card) => (
          <article key={card.title} className="ct-card">
            <p className="ct-eyebrow">{card.eyebrow}</p>
            <h3>{card.title}</h3>
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="ct-note">{card.note}</p>
            {card.cta && <CtaLink cta={card.cta} className="ct-cta" />}
          </article>
        ))}
      </div>

      {aside && (
        <div className="ct-aside">
          <div>
            <h3>{aside.title}</h3>
            <p>{aside.text}</p>
          </div>
          {aside.cta && <CtaLink cta={aside.cta} className="ct-cta" />}
        </div>
      )}
    </div>
  </section>
);

export default CostsTimeline;
