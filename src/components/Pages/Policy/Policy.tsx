'use client';

import '../Policity.css';

import { useTranslations } from 'next-intl';

const Policy = () => {
  const t = useTranslations('policity');

  return (
    <div className="wrapper">
      <div className="policity-main">
        <h2 className="policity-h2">{t('h2_1')}</h2>
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
        <h3 className="policity-h3">{t('h3_5')}</h3>
        <p className="p-comun">{t('pc_5_1')}</p>
        <h3 className="policity-h3">{t('h3_6')}</h3>
        <p className="p-comun">{t('pc_6_1')}</p>
        <h3 className="policity-h3">{t('h3_7')}</h3>
        <p className="p-comun">{t('pc_7_1')}</p>
        <h3 className="policity-h3">{t('h3_8')}</h3>
        <p className="p-comun">{t('pc_8_1')}</p>
      </div>
    </div>
  );
};

export default Policy;
