import Hero from 'shared/Hero.jsx';
import UseCases from 'shared/UseCases.jsx';
import useCasesBgGradient from 'assets/casos-de-uso-bg-gradient-1.svg';

import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import ImproveAreas from 'shared/ImproveAreas.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import Whatsapp from 'shared/WhatssapButton.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
const Logistics = () => {
    const { t } = useTranslation();

    const { title, metadescription, hero, solutionsApplications, useCases, improveAreas, howWeWork, digitalProduct } = t('cases-logistics');

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={metadescription} />
            </Helmet>
            <Hero {...hero}/>
            <section style={{
                backgroundImage: `url(${useCasesBgGradient}`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}>
                <UseCases {...useCases} />
                <ImproveAreas {...improveAreas} />
            </section>
            <SolutionsApplications {...solutionsApplications} />
            <HowWeWork {...howWeWork} />
            <DigitalProduct {...digitalProduct}/>
            <Whatsapp/>
        </>
    );
};

export default Logistics;

