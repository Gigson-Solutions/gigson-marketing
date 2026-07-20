'use client';

import './CookieBanner.css';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useRouter } from '../i18n/navigation';
import { COOKIE_CONSENT_EVENT, getConsent, setConsent } from './lib/cookieConsent';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('cookiesBanner');
  const router = useRouter();

  useEffect(() => {
    const syncVisibility = () => setIsVisible(!getConsent());

    syncVisibility();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncVisibility);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncVisibility);
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    setConsent('rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <p>{t('h2')}</p>
      <p className="hidden md:block">{t('p')}</p>
      <div className="cookie-buttons">
        <button onClick={handleAccept}>{t('btnAccept')}</button>
        <button onClick={handleReject}>{t('btnDenie')}</button>
        <button onClick={() => router.push('/cookies')} className="md:hidden">
          {t('btnInfo')}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
