'use client';

import './PartnerBadge.css';
import '../Button.css';

import { useTranslations } from 'next-intl';

import { Link } from '../../../i18n/navigation';

export const PartnerBadge = () => {
  const t = useTranslations('partnerBadge');
  const items = t.raw('items') as string[];

  return (
    <div className="partner-badge">
      <div className="partner-badge__inner">
        <div className="partner-badge__content">
          <div className="partner-badge__logo">
            <img src="/anthropic-logo.svg" alt="Anthropic" />
          </div>
          <h2 className="partner-badge__title">{t('title')}</h2>
          <p className="partner-badge__body">{t('body')}</p>
          <ul className="partner-badge__items">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="partner-badge__ctas">
            <Link href="/ai-agents" className="button-main partner-badge__cta-btn">
              {t('cta')}
            </Link>
            <Link href="/about-claude-partner" className="partner-badge__cta-secondary">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
        <div className="partner-badge__visual">
          <div className="partner-badge__card">
            <img src="/claude-logo.png" alt="Claude" className="partner-badge__card-claude" />
            <img src="/anthropic-logo.svg" alt="Anthropic" className="partner-badge__card-anthropic" />
            <span className="partner-badge__card-label">Official certification</span>
            <span className="partner-badge__card-name">Claude Partner Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
