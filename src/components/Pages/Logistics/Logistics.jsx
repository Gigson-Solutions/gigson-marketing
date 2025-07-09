
import UseCases from "../../../shared/ui/UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';
import Hero from "../../../shared/ui/Hero.jsx";

import SolutionsApplications from "../../../shared/ui/SolutionsApplications.jsx";
import ImproveAreas from "../../../shared/ui/ImproveAreas.jsx";
import HowWeWork from "../../../shared/ui/HowWeWork.jsx";
import DigitalProduct from "../../../shared/ui/DigitalProduct.jsx";
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from "react-i18next";

const Logistics = () => {
    const { t } = useTranslation();

    const { title, metadescription, hero } = t("cases-logistics");

    const Title = <Trans
        i18nKey={hero.title}
        components={{
            span: <span className="text-purple-accents" />,
            br: <br />
        }}
    />

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={metadescription} />
            </Helmet>
            <Hero title={Title} description={hero.description} suptitle={hero.suptitle} buttonText={hero.buttonText}/>
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
