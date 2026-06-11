'use client';

import './ClaudePartner.css';

import { useTranslations } from 'next-intl';

import solutionsBg from '../../../assets/solutions-applications-bg-gradients-1.svg';
import { Link } from '../../../../i18n/navigation';
import { RichText } from '../../../shared/ui/RichText';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';

type BenefitItem = { num: string; title: string; description: string };
type VsRow = { feature: string; partner: string; standard: string };
type FaqItem = { question: string; answer: string };

const ClaudePartner = () => {
  const t = useTranslations('claudePartner');

  const hero = t.raw('hero') as { eyebrow: string; h1: string; sub: string; cta: string };
  const what = t.raw('what') as { eyebrow: string; h2: string; p1: string; p2: string };
  const network = t.raw('network') as { eyebrow: string; h2: string; p1: string; p2: string };
  const benefits = t.raw('benefits') as { h2: string; lead: string; items: BenefitItem[] };
  const vs = t.raw('vs') as { h2: string; headers: string[]; rows: VsRow[] };
  const cert = t.raw('cert') as { eyebrow?: string; h2: string; p1: string; p2: string; items: string[] };
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;
  const ctaBottom = t.raw('ctaBottom') as { h2: string; p: string; cta: string };

  const bgSrc = typeof solutionsBg === 'string' ? solutionsBg : (solutionsBg as { src: string }).src;
  const bgStyle = {
    backgroundImage: `url(${bgSrc})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <div className="claude-partner">
      {/* HERO */}
      <section className="cp-hero">
        <p className="cp-eyebrow">{hero.eyebrow}</p>
        <RichText as="h1" content={hero.h1} />
        <p className="cp-hero-sub">{hero.sub}</p>
        <Link href="/contact" className="button-main">
          {hero.cta}
        </Link>
      </section>

      {/* WHAT IS + NETWORK */}
      <section className="cp-section cp-section--cream" style={bgStyle}>
        <div className="cp-inner cp-two-col wrapper">
          <div>
            <p className="cp-eyebrow">{what.eyebrow}</p>
            <h2>{what.h2}</h2>
            <p className="cp-lead">{what.p1}</p>
            <p className="cp-lead">{what.p2}</p>
          </div>
          <div>
            <p className="cp-eyebrow">{network.eyebrow}</p>
            <h2>{network.h2}</h2>
            <p className="cp-lead">{network.p1}</p>
            <p className="cp-lead">{network.p2}</p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="cp-section">
        <div className="cp-inner wrapper">
          <h2>{benefits.h2}</h2>
          <p className="cp-lead">{benefits.lead}</p>
          <div className="cp-grid">
            {benefits.items.map(({ num, title, description }) => (
              <div key={num} className="cp-card">
                <div className="cp-card-num">{num}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VS TABLE */}
      <section className="cp-section cp-section--cream" style={bgStyle}>
        <div className="cp-inner wrapper">
          <h2>{vs.h2}</h2>
          <table className="cp-table">
            <thead>
              <tr>
                {vs.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vs.rows.map(({ feature, partner, standard }, i) => (
                <tr key={i}>
                  <td>{feature}</td>
                  <td>{partner}</td>
                  <td>{standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CERTIFICATION */}
      <section className="cp-section">
        <div className="cp-inner wrapper">
          <div className="cp-cert-box">
            <p className="cp-eyebrow">{cert.eyebrow ?? 'CERTIFICACIÓN'}</p>
            <h2>{cert.h2}</h2>
            <p className="cp-lead">{cert.p1}</p>
            <p className="cp-lead">{cert.p2}</p>
            <ul className="cp-cert-items">
              {cert.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}

      {/* CTA BOTTOM */}
      <section className="cp-cta-bottom">
        <h2>{ctaBottom.h2}</h2>
        <p className="cp-lead">{ctaBottom.p}</p>
        <Link href="/contact" className="button-main">
          {ctaBottom.cta}
        </Link>
      </section>
    </div>
  );
};

export default ClaudePartner;
