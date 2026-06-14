'use client';

import '../Policity.css';
import '../Contact.css';

import { useTranslations } from 'next-intl';

const AiManifest = () => {
  const t = useTranslations('ai_manifest');

  return (
    <div className="wrapper">
      <div className="policity-main">
        <h2 className="policity-h2">{t('h2_1')}</h2>
        <p className="p-comun">{t('pc_intro')}</p>
        <h3 className="policity-h3">{t('h3_1')}</h3>
        <p className="p-comun">{t('pc_1_1')}</p>
        <h3 className="policity-h3">{t('h3_2')}</h3>
        <p className="p-comun">{t('pc_2_1')}</p>
        <h3 className="policity-h3">{t('h3_3')}</h3>
        <p className="p-sub">{t('ps_3_1')}</p>
        <p className="p-sub">{t('ps_3_2')}</p>
        <p className="p-sub">{t('ps_3_3')}</p>
        <h3 className="policity-h3">{t('h3_4')}</h3>
        <p className="p-comun">{t('pc_4_1')}</p>
        <p className="p-comun">
          <em>{t('pc_4_2')}</em>
        </p>
      </div>
    </div>
  );
};

export default AiManifest;
