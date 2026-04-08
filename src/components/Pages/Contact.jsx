import './Contact.css';
import '../Form.css';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Bgcont from '../../assets/Group 33770.svg';
import { SeoHelmet } from '../../seo/seoHelmet';
import Form from '../Form';

const Contact = () => {
  const { t } = useTranslation();
  const seo = t('pageSeo.contact');

  return (
    <div className="contact-content">
      <SeoHelmet title={seo.title} description={seo.description} />
      <div className="wrapper">
        <div className="contact-img">
          <img className="Bgcont" src={Bgcont} alt="Bgcont" />
        </div>
        <Form />
      </div>
    </div>
  );
};

export default Contact;
