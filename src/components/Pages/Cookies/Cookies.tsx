'use client';

import '../Policity.css';

import { useTranslations } from 'next-intl';

import { resetConsent } from '../../../lib/cookieConsent';

const Cookies = () => {
  const t = useTranslations('cookies');

  const handleManagePreference = () => {
    resetConsent();
    window.location.reload();
  };

  return (
    <div className="wrapper">
      <div className="policity-main">
        <h2 className="policity-h2">{t('h2_1')}</h2>
        <h3 className="policity-h3">{t('h3_1')}</h3>
        <p className="p-comun">{t('pc_1_1')}</p>
        <h3 className="policity-h3">{t('h3_2')}</h3>
        <p className="p-comun">{t('pc_2_1')}</p>
        <p className="p-sub">{t('ps_2_1')}</p>
        <p className="p-sub">{t('ps_2_2')}</p>
        <p className="p-sub">{t('ps_2_3')}</p>
        <p className="p-sub">{t('ps_2_4')}</p>
        <p className="p-sub">{t('ps_2_5')}</p>
        <p className="p-sub">{t('ps_2_6')}</p>
        <p className="p-comun">{t('pc_2_2')}</p>
        <button type="button" className="underline text-sm font-semibold" onClick={handleManagePreference}>
          {t('manageBtn')}
        </button>
        <h3 className="policity-h3">{t('h3_3')}</h3>
        <p className="p-comun">{t('pc_3_1')}</p>
        <p className="p-comun">{t('pc_3_2')}</p>
        <h3 className="policity-h3">{t('h3_4')}</h3>
        <p className="p-comun">{t('pc_4_1')}</p>
      </div>
    </div>
  );
};

export default Cookies;
