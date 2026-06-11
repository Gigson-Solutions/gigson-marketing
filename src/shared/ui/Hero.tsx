import { ButtonLink } from './Button';
import { RichText } from './RichText';

type HeroProps = {
  title: string;
  suptitle?: string;
  description?: string;
  buttonText?: string;
  heroLink?: string;
};

const Hero = ({ title, suptitle, description, buttonText, heroLink = '/contact' }: HeroProps) => {
  return (
    <section className="px-landing mt-fixed-navbar pt-14 lg:pt-23 pb-36 lg:pb-23">
      <div className="max-w-[88.875rem] mx-auto flex flex-col items-center">
        {suptitle && (
          <p className="text-purple-accents text-body1 uppercase mb-4 md:mb-6">{suptitle}</p>
        )}
        <RichText
          as="h1"
          content={title}
          className="text-h1 text-dark-primary text-center mb-4 md:mb-6"
        />
        {description && (
          <RichText
            as="p"
            content={description}
            className="text-dark-primary text-subtitle max-w-contained text-left mb-6 md:mb-10"
          />
        )}
        {buttonText && <ButtonLink link={heroLink} text={buttonText} outlined />}
      </div>
    </section>
  );
};

export default Hero;
