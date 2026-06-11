'use client';

import './CookieBanner.css';

import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useRouter } from '../i18n/navigation';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('cookiesBanner');
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setIsVisible(false);
  };

  const handleReject = () => {
    Cookies.set('cookieConsent', 'rejected', { expires: 365 });
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
