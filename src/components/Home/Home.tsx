'use client';

import Bgcont from '../../assets/Group 33770.svg';
import Form from '../Form';
import { CtaServices } from './CtaServices';
import Hero from './Hero';
import HomeCases from './HomeCases';
import HomeServices from './HomeServices';
import { PartnerBadge } from './PartnerBadge';

const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;

const Home = () => {
  return (
    <div className="home-content">
      <Hero />
      <HomeServices />
      <PartnerBadge />
      <HomeCases />
      <CtaServices />
      <div className="wrapper">
        <div className="contact-img">
          <img className="Bgcont" src={bgSrc} alt="" />
        </div>
        <Form customClass="home-form" formId="home" />
      </div>
    </div>
  );
};

export default Home;
