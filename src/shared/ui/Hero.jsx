import {Link} from "react-router-dom";
import {ButtonLink} from "./Button.jsx";
import {Trans, useTranslation} from "react-i18next";

const buttonLink = '/contact'

const Hero = ({Title, Suptitle, Description , ButtonText }) => {


    return (
        <section className="mt-fixed-navbar pt-14 lg:pt-40 pb-36 lg:pb-23">
            <div className="max-w-8xl mx-auto px-landing flex flex-col items-center">
                <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{Suptitle}</p>
                <h1 className="text-h1 text-dark-primary text-center mb-4 md:mb-6">
                    <Trans
                        i18nKey={Title}
                        components={{
                            span: <span className="block text-purple-accents" />
                        }}
                    />
                </h1>
                <p className="text-dark-primary text-subtitle max-w-contained text-center mb-6 md:mb-10">{Description}</p>
                <ButtonLink link={buttonLink} text={ButtonText} outlined/>
            </div>
        </section>
    )
}

export default Hero
