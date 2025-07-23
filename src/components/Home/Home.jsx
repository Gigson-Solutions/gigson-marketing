import React from "react";
import Hero from "./Hero";
import HomeServices from "./HomeServices";
import Form from "../Form";
import HomeCases from "./HomeCases";
import { CtaServices } from "./CtaServices";
import { Helmet } from 'react-helmet-async'
import { useTranslation } from "react-i18next";

const Home = () => {
   const { t } = useTranslation();
   const {title , metadescription} = t("home")

   return (
      <div className="home-content">
         <Helmet>
                <title>{title}</title>
                <meta name="description" content={metadescription} />
            </Helmet>
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
