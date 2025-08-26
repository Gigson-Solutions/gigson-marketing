import './Contact.css';
import '../Form.css';

import React from 'react';

import Bgcont from '../../assets/Group 33770.svg';
import Form from '../Form';

const Contact = () => {
  return (
    <div className="contact-content">
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
