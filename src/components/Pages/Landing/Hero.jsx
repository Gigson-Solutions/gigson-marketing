import { Link } from "react-router-dom";
import ButtonLink from "../../../shared/ui/ButtonLink";

const Hero = ({suptitle, titleDark, titleColored, description, subTitle}) => {
    return (
        <section className="wrapper mt-fixed-navbar flex flex-col gap-10 justify-center items-center text-center pt-25 pb-30">
            <p className="text-purple-accents text-body1">{suptitle}</p>
            <h1 className="text-title1">
                <span className="block text-dark-primary mb-4">{titleDark}</span>
                <span className="block text-purple-accents">{titleColored}</span>
            </h1>
            <p className="text-dark-primary text-[20px] leading-[26px] max-w-contained">{description}</p>
            <ButtonLink link="/" text={suptitle} />
        </section>
    )
}

export default Hero
