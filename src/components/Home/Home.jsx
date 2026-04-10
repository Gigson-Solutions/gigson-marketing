import React from 'react';
import { useTranslation } from 'react-i18next';

import { SeoHelmet } from '../../seo/seoHelmet';
import Form from '../Form';
import { CtaServices } from './CtaServices';
import Hero from './Hero';
import HomeCases from './HomeCases';
import HomeServices from './HomeServices';

const Home = () => {
  const { t } = useTranslation();
  const { title, metadescription } = t('home');

  return (
    <div className="home-content">
      <SeoHelmet title={title} description={metadescription} />
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
