import React from 'react';
import Form from '../Form';
import './Contact.css';
import '../Form.css';

import Bgcont from '../../assets/Group 33770.svg';

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
