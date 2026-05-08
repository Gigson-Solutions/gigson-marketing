import './Contact.css';
import '../Form.css';
import './Policity.css';

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { SeoHelmet } from '../../seo/seoHelmet';

const AiManifest = () => {
  const { t } = useTranslation();
  const seo = t('pageSeo.ai_manifest');
  const {
    h2_1,
    pc_intro,
    h3_1,
    pc_1_1,
    h3_2,
    pc_2_1,
    h3_3,
    ps_3_1,
    ps_3_2,
    ps_3_3,
    h3_4,
    pc_4_1,
    pc_4_2,
  } = t('ai_manifest');
  return (
    <div className="wrapper">
      <SeoHelmet title={seo.title} description={seo.description} />
      <div className="policity-main">
        <h2 className="policity-h2">
          <Trans i18nKey={h2_1} />
        </h2>
        <p className="p-comun">
          <Trans i18nKey={pc_intro} />
        </p>
        <h3 className="policity-h3">
          <Trans i18nKey={h3_1} />
        </h3>
        <p className="p-comun">
          <Trans i18nKey={pc_1_1} />
        </p>
        <h3 className="policity-h3">
          <Trans i18nKey={h3_2} />
        </h3>
        <p className="p-comun">
          <Trans i18nKey={pc_2_1} />
        </p>
        <h3 className="policity-h3">
          <Trans i18nKey={h3_3} />
        </h3>
        <p className="p-sub">
          <Trans i18nKey={ps_3_1} />
        </p>
        <p className="p-sub">
          <Trans i18nKey={ps_3_2} />
        </p>
        <p className="p-sub">
          <Trans i18nKey={ps_3_3} />
        </p>
        <h3 className="policity-h3">
          <Trans i18nKey={h3_4} />
        </h3>
        <p className="p-comun">
          <Trans i18nKey={pc_4_1} />
        </p>
        <p className="p-comun">
          <em>
            <Trans i18nKey={pc_4_2} />
          </em>
        </p>
      </div>
    </div>
  );
};

export default AiManifest;
