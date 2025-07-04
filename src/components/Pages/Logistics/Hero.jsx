import {Link} from "react-router-dom";
import {ButtonLink} from "../../../shared/ui/Button.jsx";
import {Trans, useTranslation} from "react-i18next";

const buttonLink = '/contact'

const Hero = () => {

    const {t} = useTranslation();
    const {
        hero: { title, suptitle,  description, buttonText}
    } = t("cases-logistics");

    return (
        <section className="mt-fixed-navbar pt-14 lg:pt-23 pb-36 lg:pb-23">
            <div className="max-w-8xl mx-auto px-landing flex flex-col items-center">
                <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{suptitle}</p>
                <h1 className="text-6xl text-dark-primary text-center mb-4 md:mb-6">
                    <Trans
                        i18nKey={title}
                        components={{
                            span: <span className="text-purple-accents" />,
                            br: <br />
                        }}
                    />
                </h1>
                <p className="text-dark-primary text-subtitle max-w-contained text-center mb-6 md:mb-10">{description}</p>
                <ButtonLink link={buttonLink} text={buttonText} outlined/>
            </div>
        </section>
    )
}

export default Hero
