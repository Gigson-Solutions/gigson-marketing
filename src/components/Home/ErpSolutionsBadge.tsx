'use client';

import './ErpSolutionsBadge.css';

import { useTranslations } from 'next-intl';

import { Link } from '../../../i18n/navigation';

export const ErpSolutionsBadge = () => {
  const t = useTranslations('erpSolutionsBadge');

  return (
    <div className="erp-solutions-badge">
      <div className="erp-solutions-badge__inner">
        <p className="erp-solutions-badge__eyebrow">{t('eyebrow')}</p>
        <h2 className="erp-solutions-badge__title">{t('title')}</h2>

        <div className="erp-solutions-badge__cards">
          <Link href="/integrations-odoo" className="erp-solutions-badge__card">
            <img src="/img/logos-negros/odoo-holded.png" alt="Odoo" className="erp-solutions-badge__card-logo" />
            <span className="erp-solutions-badge__card-label">{t('odooLabel')}</span>
            <span className="erp-solutions-badge__card-cta">{t('cta')}</span>
          </Link>

          <Link href="/integrations-holded" className="erp-solutions-badge__card">
            <img src="/img/conectar-holded.png" alt="Holded" className="erp-solutions-badge__card-logo" />
            <span className="erp-solutions-badge__card-label">{t('holdedLabel')}</span>
            <span className="erp-solutions-badge__card-cta">{t('cta')}</span>
          </Link>

          <Link href="/custom-erp" className="erp-solutions-badge__card erp-solutions-badge__card--custom">
            <span className="erp-solutions-badge__card-label">{t('customLabel')}</span>
            <span className="erp-solutions-badge__card-cta">{t('customCta')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
