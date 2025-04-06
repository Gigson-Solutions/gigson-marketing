import Hero from "./Hero.jsx";
import UseCases from "./UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

import {useTranslation} from "react-i18next";
import SolutionsApplications from "./SolutionsApplications.jsx";
import ImproveAreas from "./ImproveAreas.jsx";
import HowWeWork from "./HowWeWork.jsx";
import DigitalProduct from "./DigitalProduct.jsx";

const Landing = () => {
    const {t} = useTranslation();
    const {
        hero: {suptitle, titleDark, titleColored, description, subTitle},
        useCases: {cards, title: useCasesTitle, description: useCasesDescription},
        solutionsApplications: {
            containers,
            titleDark: solutionsApplicationsTitleDark,
            titleColored: solutionsApplicationsTitleColored,
            subTitle: solutionsApplicationsSubtitle
        },
        improveAreas: {title: improveAresTitle, areas: improveAreasAreas},
        howWeWork: {title: howWeWorkTitle, methods: howWeWorkMethods},
        digitalProduct: {
            titleDark: digitalProductTitleDark,
            titleColored: digitalProductTitleColored,
            buttonText: digitalProductButtonText,
            description: digitalProductDescription,
            cards: digitalProductCards
        },
    } = t("services_v2");

    return (
        <>
            <Hero suptitle={suptitle} titleDark={titleDark} titleColored={titleColored} description={description}
                  subTitle={subTitle}/>
            <section style={{
                backgroundImage: `url(${useCasesBgGradient}`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}>
                <UseCases title={useCasesTitle} description={useCasesDescription} cards={cards}/>
                <ImproveAreas areas={improveAreasAreas} title={improveAresTitle}/>
            </section>
            <SolutionsApplications titleDark={solutionsApplicationsTitleDark}
                                   titleColored={solutionsApplicationsTitleColored}
                                   subTitle={solutionsApplicationsSubtitle} containers={containers}/>
            <HowWeWork title={howWeWorkTitle} methods={howWeWorkMethods}/>
            <DigitalProduct titleDark={digitalProductTitleDark} titleColored={digitalProductTitleColored}
                            buttonText={digitalProductButtonText} description={digitalProductDescription}
                            cards={digitalProductCards}/>
        </>
    )
}

export default Landing;
