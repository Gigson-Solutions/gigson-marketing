import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import './CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { h2, p, btnAccept, btnDenie, btnInfo } = t('cookiesBanner');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/cookies');
  };

  useEffect(() => {
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
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
      <p>{h2}</p>
      <p className="hidden md:block">{p}</p>
      <div className="cookie-buttons">
        <button onClick={handleAccept}>{btnAccept}</button>
        <button onClick={handleReject}>{btnDenie}</button>
        <button onClick={handleClick} className="md:hidden">
          {btnInfo}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
