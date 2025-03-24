
import Hero from "./Hero.jsx";
import UseCases from "./UseCases.jsx";

import {useTranslation} from "react-i18next";

const Landing = () => {
    const { t } = useTranslation();
    const {
        hero: { suptitle, titleDark, titleColored, description, subTitle },
        useCases: { cards, title: useCasesTitle, description: useCasesDescription }
    } = t("services_v2");

        return(
            <div className="">
                <Hero suptitle={suptitle} titleDark={titleDark} titleColored={titleColored} description={description} subTitle={subTitle} />
                <UseCases title={useCasesTitle} description={useCasesDescription}  cards={cards} />
            </div>
        )
}

export default Landing;
