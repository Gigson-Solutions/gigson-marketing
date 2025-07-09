import Hero from "./Hero.jsx";
import UseCases from "./UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

import SolutionsApplications from "../../../shared/ui/SolutionsApplications.jsx";
import ImproveAreas from "../../../shared/ui/ImproveAreas.jsx";
import HowWeWork from "../../../shared/ui/HowWeWork.jsx";
import DigitalProduct from "../../../shared/ui/DigitalProduct.jsx";
import { Helmet } from 'react-helmet-async'
import { useTranslation } from "react-i18next";

const Logistics = () => {
    const { t } = useTranslation();

    const { title, metadescription} = t("cases-logistics");

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={metadescription} />
            </Helmet>
            <Hero />
            <section style={{
                backgroundImage: `url(${useCasesBgGradient}`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}>
                <UseCases />
                <ImproveAreas />
            </section>
            <SolutionsApplications />
            <HowWeWork />
            <DigitalProduct />
        </>
    )
};

export default Logistics;
