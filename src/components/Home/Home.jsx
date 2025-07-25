import React from 'react';
import Hero from './Hero';
import HomeServices from './HomeServices';
import Form from '../Form';
import HomeCases from './HomeCases';
import { CtaServices } from './CtaServices';

const Home = () => {
   return (
      <div className="home-content">
         <Hero />
         <HomeServices />
         <HomeCases />
         <CtaServices />
         <div className="wrapper">
            <Form customClass="home-form" />
         </div>
      </div>
   );
};

export default Home;
