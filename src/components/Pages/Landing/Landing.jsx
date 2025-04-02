
import Hero from "./Hero.jsx";
import UseCases from "./UseCases.jsx";

import {useTranslation} from "react-i18next";
import SolutionsApplications from "./SolutionsApplications.jsx";
import ImproveAreas from "./ImproveAreas.jsx";

const Landing = () => {
    const { t } = useTranslation();
    const {
        hero: { suptitle, titleDark, titleColored, description, subTitle },
        useCases: { cards, title: useCasesTitle, description: useCasesDescription },
        solutionsApplications: { containers, titleDark: solutionsApplicationsTitleDark, titleColored: solutionsApplicationsTitleColored, subTitle: solutionsApplicationsSubtitle },
        improveAreas: { title: improveAresTitle, areas: improveAreasAreas}
    } = t("services_v2");

        return(
            <>
                <Hero suptitle={suptitle} titleDark={titleDark} titleColored={titleColored} description={description} subTitle={subTitle} />
                <UseCases title={useCasesTitle} description={useCasesDescription}  cards={cards} />
                <ImproveAreas areas={improveAreasAreas} title={improveAresTitle} />
                <SolutionsApplications titleDark={solutionsApplicationsTitleDark} titleColored={solutionsApplicationsTitleColored}  subTitle={solutionsApplicationsSubtitle} containers={containers} />
            </>
        )
}

export default Landing;
