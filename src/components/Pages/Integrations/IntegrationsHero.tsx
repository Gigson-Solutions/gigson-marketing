'use client';

import { useTranslations } from 'next-intl';

import { ButtonLink } from '../../../shared/ui/Button';

const HOLDED_LOGO_URL = 'https://cdn.worldvectorlogo.com/logos/holded-1.svg';

const IntegrationsHero = () => {
  const t = useTranslations('integrations-holded');
  const hero = t.raw('hero') as {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    specialists: { title: string; bullets: string[]; link: string };
  };

  return (
    <section className="px-landing mt-fixed-navbar bg-[#f4f3ef]">
      <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center pt-14 lg:pt-20 pb-14 lg:pb-20">
        <div className="flex-1 flex flex-col items-start">
          <p className="text-purple-accents text-body1 mb-4">{hero.badge}</p>
          <h1 className="text-h1 text-dark-primary mb-4">{hero.title}</h1>
          <p className="text-h3 text-dark-primary mb-4">{hero.subtitle}</p>
          <p className="text-subtitle text-dark-medium mb-8">{hero.description}</p>
          <ButtonLink link="#contacto" text={hero.cta} className="mb-12" />
          <p className="text-h3 text-dark-primary mb-6">{hero.specialists.title}</p>
          <ul className="flex flex-col gap-4 mb-6">
            {hero.specialists.bullets.map((bullet: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-subtitle text-dark-primary">
                <span className="w-2 h-2 rounded-full bg-purple-accents flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
          <a href="#casos" className="text-purple-accents text-button underline hover:opacity-70 transition">
            {hero.specialists.link}
          </a>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end">
          <img src={HOLDED_LOGO_URL} alt="Holded" className="w-full max-w-[280px] object-contain" />
        </div>
      </div>
    </section>
  );
};

export default IntegrationsHero;
