'use client';

import './Contact.css';

import { useTranslations } from 'next-intl';

import Bgcont from '../../assets/Group 33770.svg';
import Form from '../Form';

const Contact = () => {
  const t = useTranslations('pageSeo');
  const seo = t.raw('contact') as { h1: string };
  const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;
  return (
    <div className="contact-content">
      <div className="wrapper">
        <div className="contact-img">
          <img className="Bgcont" src={bgSrc} alt="" />
        </div>
        {/* The page had no <h1> at all — its outline started at the form's <h2>. */}
        <Form formId="contact" titleAs="h1" title={seo.h1} />
      </div>
    </div>
  );
};

export default Contact;
