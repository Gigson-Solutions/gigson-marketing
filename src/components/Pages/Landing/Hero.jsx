import {Link} from "react-router-dom";
import {ButtonLink} from "../../../shared/ui/Button.jsx";
import {Trans, useTranslation} from "react-i18next";

const buttonLink = '/contact'

const Hero = () => {

    const {t} = useTranslation();
    const {
        hero: { title, suptitle,  description, buttonText}
    } = t("services_v2");

    return (
        <section className="mt-fixed-navbar pt-25 pb-30">
            <div className="max-w-8xl mx-auto px-landing flex flex-col items-center">
                <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{suptitle}</p>
                <h1 className="text-h1 text-dark-primary mb-4 md:mb-6">
                    <Trans
                        i18nKey={title}
                        components={{
                            span: <span className="block text-purple-accents" />
                        }}
                    />
                </h1>
                <p className="text-dark-primary text-subtitle max-w-contained mb-6 md:mb-10">{description}</p>
                <ButtonLink link={buttonLink} text={buttonText} outlined/>
            </div>
        </section>
    )
}

export default Hero
