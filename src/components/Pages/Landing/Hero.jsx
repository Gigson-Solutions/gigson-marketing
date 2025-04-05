import { Link } from "react-router-dom";
import ButtonLink from "../../../shared/ui/ButtonLink";

const Hero = ({suptitle, titleDark, titleColored, description, subTitle}) => {
    return (
        <section className="mt-fixed-navbar pt-25 pb-30">
            <div className="max-w-8xl mx-auto px-landing flex flex-col items-center">
                <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{suptitle}</p>
                <h1 className="text-h1 mb-4 md:mb-6">
                    <span className="block text-dark-primary mb-4">{titleDark}</span>
                    <span className="block text-purple-accents">{titleColored}</span>
                </h1>
                <p className="text-dark-primary text-subtitle max-w-contained mb-6 md:mb-10">{description}</p>
                <ButtonLink link="/" text={suptitle} outlined/>
            </div>
        </section>
    )
}

export default Hero
