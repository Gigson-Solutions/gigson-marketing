import Hero from "../../../shared/ui/Hero.jsx";
import UseCases from "../../../shared/ui/UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

import SolutionsApplications from "../../../shared/ui/SolutionsApplications.jsx";
import ImproveAreas from "../../../shared/ui/ImproveAreas.jsx";
import HowWeWork from "../../../shared/ui/HowWeWork.jsx";
import DigitalProduct from "../../../shared/ui/DigitalProduct.jsx";
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from "react-i18next";
const Logistics = () => {
    const { t } = useTranslation();


    const { title, metadescription, hero, solutionsApplications } = t("cases-logistics");
    const { suptitle, description, buttonText } = hero;

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
            <Hero
                title={Title}
                suptitle={suptitle}
                description={description}
                buttonText={buttonText}

            />
            <section style={{
                backgroundImage: `url(${useCasesBgGradient}`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}>
                <UseCases />
                <ImproveAreas />
            </section>
            <SolutionsApplications title={solutionsApplications.title} subTitle={solutionsApplications.subTitle} containers={solutionsApplications.containers} />
            <HowWeWork />
            <DigitalProduct />
        </>
    )
};

export default Logistics;

