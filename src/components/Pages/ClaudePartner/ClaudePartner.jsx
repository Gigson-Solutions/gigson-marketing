import './ClaudePartner.css';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import solutionsBg from '../../../assets/solutions-applications-bg-gradients-1.svg';
import { OrganizationSchema, ServiceSchema } from '../../../seo/SchemaOrg';
import { SeoHelmet } from '../../../seo/seoHelmet';
import { ServiceFaq } from 'shared/ServiceFaq.jsx';
import { DEFAULT_LANG, ROUTE_SLUGS } from '../../../router/routerSlugs';

const ClaudePartner = () => {
  const { t, i18n } = useTranslation();
  const cp = t('claudePartner');
  const lang = ROUTE_SLUGS[i18n.language] ? i18n.language : DEFAULT_LANG;
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
  const contactPath = `${langPrefix}/${ROUTE_SLUGS[lang].contact}`;
  const serviceUrl =
    lang === 'es' ? '/es/sobre-claude-partner' : '/about-claude-partner';

  return (
    <div className="claude-partner">
      <SeoHelmet title={cp.seo.title} description={cp.seo.description} />
      <OrganizationSchema />
      <ServiceSchema
        name={cp.seo.title}
        description={cp.seo.description}
        url={serviceUrl}
        serviceType="AI Consulting"
      />

      {/* HERO */}
      <section className="cp-hero">
        <p className="cp-eyebrow">{cp.hero.eyebrow}</p>
        <h1 dangerouslySetInnerHTML={{ __html: cp.hero.h1 }} />
        <p className="cp-hero-sub">{cp.hero.sub}</p>
        <Link to={contactPath} className="button-main">
          {cp.hero.cta}
        </Link>
      </section>

      {/* WHAT IS + NETWORK */}
      <section
        className="cp-section cp-section--cream"
        style={{
          backgroundImage: `url(${solutionsBg})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="cp-inner cp-two-col wrapper">
          <div>
            <p className="cp-eyebrow">{cp.what.eyebrow}</p>
            <h2>{cp.what.h2}</h2>
            <p className="cp-lead">{cp.what.p1}</p>
            <p className="cp-lead">{cp.what.p2}</p>
          </div>
          <div>
            <p className="cp-eyebrow">{cp.network.eyebrow}</p>
            <h2>{cp.network.h2}</h2>
            <p className="cp-lead">{cp.network.p1}</p>
            <p className="cp-lead">{cp.network.p2}</p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="cp-section">
        <div className="cp-inner wrapper">
          <h2>{cp.benefits.h2}</h2>
          <p className="cp-lead">{cp.benefits.lead}</p>
          <div className="cp-grid">
            {cp.benefits.items.map(({ num, title, description }) => (
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
      <section
        className="cp-section cp-section--cream"
        style={{
          backgroundImage: `url(${solutionsBg})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="cp-inner wrapper">
          <h2>{cp.vs.h2}</h2>
          <table className="cp-table">
            <thead>
              <tr>
                {cp.vs.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cp.vs.rows.map(({ feature, partner, standard }, i) => (
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
            <p className="cp-eyebrow">{cp.cert.eyebrow ?? 'CERTIFICACIÓN'}</p>
            <h2>{cp.cert.h2}</h2>
            <p className="cp-lead">{cp.cert.p1}</p>
            <p className="cp-lead">{cp.cert.p2}</p>
            <ul className="cp-cert-items">
              {cp.cert.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {cp.faq && <ServiceFaq title={cp.faq.title} faqs={cp.faq.items} />}

      {/* CTA BOTTOM */}
      <section className="cp-cta-bottom">
        <h2>{cp.ctaBottom.h2}</h2>
        <p className="cp-lead">{cp.ctaBottom.p}</p>
        <Link to={contactPath} className="button-main">
          {cp.ctaBottom.cta}
        </Link>
      </section>
    </div>
  );
};

export default ClaudePartner;
