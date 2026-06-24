'use client';

import { useTranslations } from 'next-intl';

import { ButtonLink } from '../../../shared/ui/Button';

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
        {/* Left column */}
        <div className="flex-1 flex flex-col items-start">
          <span className="inline-block text-purple-accents text-smallTag uppercase tracking-widest border border-purple-accents rounded-full px-4 py-1 mb-6">
            {hero.badge}
          </span>
          <h1 className="text-h1 text-dark-primary mb-4">{hero.title}</h1>
          <p className="text-h3 text-dark-primary mb-4">{hero.subtitle}</p>
          <p className="text-subtitle text-dark-medium mb-8">{hero.description}</p>
          <ButtonLink link="#contacto" text={hero.cta} className="mb-12" />

          <p className="text-h3 text-dark-primary mb-6">{hero.specialists.title}</p>
          <ul className="flex flex-col gap-4 mb-6">
            {hero.specialists.bullets.map((bullet: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-subtitle text-dark-primary">
                <span className="mt-[6px] w-2 h-2 rounded-full bg-purple-accents flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href="#casos"
            className="text-purple-accents text-button underline hover:opacity-70 transition"
          >
            {hero.specialists.link}
          </a>
        </div>

        {/* Right column */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px]">
            <img
              src="/img/conectar-holded.png"
              alt="Integraciones Holded"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsHero;
