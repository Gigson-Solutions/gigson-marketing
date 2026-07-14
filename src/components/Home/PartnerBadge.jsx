import './PartnerBadge.css';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import {
  DEFAULT_LANG,
  ROUTE_SLUGS,
  SUPPORTED_LANGS,
} from '../../router/routerSlugs';

export const PartnerBadge = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { title, body, items, cta } = t('partnerBadge');

  const segment = location.pathname.split('/').find(Boolean);
  const currentLang = SUPPORTED_LANGS.includes(segment)
    ? segment
    : DEFAULT_LANG;
  const aiAgentsPath =
    currentLang === DEFAULT_LANG
      ? `/${ROUTE_SLUGS[currentLang].aiAgents}`
      : `/${currentLang}/${ROUTE_SLUGS[currentLang].aiAgents}`;

  return (
    <div className="partner-badge">
      <div className="partner-badge__inner">
        <div className="partner-badge__content">
          <div className="partner-badge__logo">
            <img src="/anthropic-logo.svg" alt="Anthropic" />
          </div>
          <h2 className="partner-badge__title">{title}</h2>
          <p className="partner-badge__body">{body}</p>
          <ul className="partner-badge__items">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <Link to={aiAgentsPath} className="partner-badge__cta">
            {cta}
          </Link>
        </div>
        <div className="partner-badge__visual">
          <div className="partner-badge__card">
            <img src="/anthropic-logo.svg" alt="Anthropic logo" />
            <span className="partner-badge__card-label">
              Official certification
            </span>
            <span className="partner-badge__card-name">
              Claude Partner Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
