'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import type { IntegrationLogo } from './data/integrationLogos';

type Props = { namespace: string; logos: IntegrationLogo[] };

// ─── Logo badge — clickable card ──────────────────────────────────────────────
const LogoBadge = ({ name, img }: IntegrationLogo) => (
  <a
    href="#contacto"
    title={`Conectar ${name}`}
    className="group flex items-center justify-center bg-white rounded-xl border border-transparent hover:border-purple-accents transition duration-200 cursor-pointer"
    style={{ padding: '12px 10px', minHeight: '60px' }}
  >
    <img
      src={img}
      alt={name}
      className="max-h-[30px] max-w-[80px] lg:max-h-[40px] lg:max-w-[110px] object-contain opacity-70 group-hover:opacity-100 transition duration-200"
    />
  </a>
);

// ─── Grid component ───────────────────────────────────────────────────────────
const IntegrationLogosGrid = ({ namespace, logos }: Props) => {
  const t = useTranslations(namespace);
  const logosCopy = t.raw('logos') as { title: string; subtitle: string; mainCta: string };

  const industries = ['Todos', ...Array.from(new Set(logos.flatMap((l) => l.industries)))];

  const [activeIndustry, setActiveIndustry] = useState('Todos');
  const [collapsed, setCollapsed] = useState(true);

  const filtered =
    activeIndustry === 'Todos'
      ? logos
      : logos.filter((l) => l.industries.includes(activeIndustry));

  // Reset collapse when filter changes
  const handleIndustryChange = (ind: string) => {
    setActiveIndustry(ind);
    setCollapsed(true);
  };

  return (
    <section className="px-landing py-14 lg:py-20 bg-[#f4f3ef]">
      <div className="max-w-[88.875rem] mx-auto">
        <h2 className="text-h2 text-dark-primary mb-4">{logosCopy.title}</h2>
        <p className="text-subtitle text-dark-medium mb-10">{logosCopy.subtitle}</p>

        {/* Industry filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => handleIndustryChange(ind)}
              className={`text-smallTag rounded-full px-4 py-2 border transition duration-200 ${
                activeIndustry === ind
                  ? 'bg-purple-accents text-white border-purple-accents'
                  : 'bg-white text-dark-primary border-[#E0DFDF] hover:border-purple-accents hover:text-purple-accents'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Logo grid with mobile collapse */}
        <div className="relative mb-6">
          <div
            className={`grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:gap-4 ${
              collapsed ? 'max-h-[260px] overflow-hidden lg:max-h-none lg:overflow-visible' : ''
            }`}
          >
            {filtered.map((logo) => (
              <LogoBadge key={logo.name} {...logo} />
            ))}
          </div>

          {/* Gradient fade + "Mostrar más" — mobile only */}
          {collapsed && (
            <div className="lg:hidden">
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent, #f4f3ef)',
                }}
              />
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setCollapsed(false)}
                  className="text-purple-accents text-button underline hover:opacity-70 transition"
                >
                  Mostrar más
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main CTA */}
        <div className="flex justify-center mt-8">
          <a
            href="#contacto"
            className="inline-block bg-purple-accents text-white text-button rounded-full py-3 px-8 hover:opacity-80 transition duration-200 ease-linear uppercase"
          >
            {logosCopy.mainCta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationLogosGrid;
