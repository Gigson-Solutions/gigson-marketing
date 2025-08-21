import { Trans, useTranslation } from 'react-i18next';

import { ButtonLink } from './Button.jsx';

const buttonLink = '/contact';

const Hero = ({title, suptitle, description , buttonText }) => {

    const Title = <Trans
        i18nKey={title}
        components={{
            span: <span className="text-purple-accents" />,
            br: <br />
        }}
    />;
     const Description = <Trans
        i18nKey={description}
        components={{
            span: <span className="text-purple-accents" />,
            br: <br />
        }}
    />;

    return (
        <section className="mt-fixed-navbar pt-14 lg:pt-23 pb-36 lg:pb-23">
            <div className="max-w-8xl mx-auto px-landing flex flex-col items-center">
                <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{suptitle}</p>
                <h1 className="text-h1 text-dark-primary text-center mb-4 md:mb-6">
                   {Title}
                </h1>
                <p className="text-dark-primary  text-subtitle max-w-contained text-left mb-6 md:mb-10">{Description}</p>
                <ButtonLink link={buttonLink} text={buttonText} outlined/>
            </div>
        </section>
    );
};

export default Hero;