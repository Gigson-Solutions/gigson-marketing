'use client';

import './Contact.css';

import Bgcont from '../../assets/Group 33770.svg';
import Form from '../Form';

const Contact = () => {
  const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;
  return (
    <div className="contact-content">
      <div className="wrapper">
        <div className="contact-img">
          <img className="Bgcont" src={bgSrc} alt="" />
        </div>
        <Form formId="contact" />
      </div>
    </div>
  );
};

export default Contact;
