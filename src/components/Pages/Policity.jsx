import React from 'react';

import { Trans, useTranslation } from 'react-i18next';
import './Contact.css';
import '../Form.css';
import './Policity.css';

const Policity = () => {
   const { t } = useTranslation();
   const {
      h2_1,
      h3_1,
      pc_1_1,
      pc_1_2,
      pc_1_3,
      h3_2,
      pc_2_1,
      pc_2_2,
      pc_2_3,
      pc_2_4,
      pc_2_5,
      pc_2_6,
      pc_2_7,
      pc_2_8,
      h3_3,
      pc_3_1,
      pc_3_2,
      pc_3_3,
      ps_3_1,
      ps_3_2,
      ps_3_3,
      ps_3_4,
      ps_3_5,
      ps_3_6,
      ps_3_7,
      pc_3_4,
      pc_3_5,
      pc_3_6,
      pc_3_7,
      pc_3_8,
      pc_3_9,
      pc_3_10,
      h3_4,
      pc_4_1,
      pc_4_2,
      pc_4_3,
      pc_4_4,
      ps_4_1,
      ps_4_2,
      ps_4_3,
      ps_4_4,
      pc_4_5,
      pc_4_6,
   } = t('policity');
   return (
      <div className="wrapper">
         <div className="policity-main">
            <h2 className="policity-h2">
               <Trans i18nKey={h2_1} />
            </h2>
            <h3 className="policity-h3">
               <Trans i18nKey={h3_1} />
            </h3>
            <p className="p-comun">
               <Trans i18nKey={pc_1_1} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_1_2} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_1_3} />
            </p>
            <h3 className="policity-h3">
               <Trans i18nKey={h3_2} />
            </h3>
            <p className="p-comun">
               <Trans i18nKey={pc_2_1} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_2} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_3} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_4} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_5} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_6} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_7} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_2_8} />
            </p>
            <h3 className="policity-h3">
               <Trans i18nKey={h3_3} />
            </h3>
            <p className="p-comun">
               <Trans i18nKey={pc_3_1} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_2} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_3} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_1} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_2} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_3} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_4} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_5} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_6} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_3_7} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_4} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_5} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_6} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_7} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_8} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_9} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_3_10} />
            </p>
            <h3 className="policity-h3">
               <Trans i18nKey={h3_4} />
            </h3>
            <p className="p-comun">
               <Trans i18nKey={pc_4_1} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_4_2} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_4_3} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_4_4} />
            </p>

            <p className="p-sub">
               <Trans i18nKey={ps_4_1} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_4_2} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_4_3} />
            </p>
            <p className="p-sub">
               <Trans i18nKey={ps_4_4} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_4_5} />
            </p>
            <p className="p-comun">
               <Trans i18nKey={pc_4_6} />
            </p>
            <p className="p-comun"></p>
         </div>
      </div>
   );
};

export default Policity;
