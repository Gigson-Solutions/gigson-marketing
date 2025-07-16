import Hero from "../../../shared/ui/Hero.jsx";
import UseCases from "../../../shared/ui/UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

import SolutionsApplications from "../../../shared/ui/SolutionsApplications.jsx";
import ImproveAreas from "../../../shared/ui/ImproveAreas.jsx";
import HowWeWork from "../../../shared/ui/HowWeWork.jsx";
import DigitalProduct from "../../../shared/ui/DigitalProduct.jsx";
import { Helmet } from 'react-helmet-async'
import { useTranslation } from "react-i18next";
const Construction = () => {
    const { t } = useTranslation();

    const { title, metadescription, hero, solutionsApplications, useCases, improveAreas, howWeWork, digitalProduct } = t("cases-construction");

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
          
        </>
    )
};

export default Construction;

