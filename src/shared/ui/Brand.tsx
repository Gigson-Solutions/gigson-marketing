'use client';

import { useTranslations } from 'next-intl';

const logos = [
  { src: '/brands/Caritas.svg', alt: 'Cáritas' },
  { src: '/brands/Viko.svg', alt: 'Viko' },
  { src: '/brands/EuropcarGroup.svg', alt: 'Europcar Mobility Group' },
  { src: '/brands/Logo.svg', alt: 'MU DAN ZA' },
  { src: '/brands/A6.svg', alt: 'A6' },
  { src: '/brands/KMM.svg', alt: 'KMM' },
  { src: '/brands/Elogia.svg', alt: 'Elogia' },
  { src: '/brands/STK.svg', alt: 'STK' },
  { src: '/brands/Adock.svg', alt: 'Adock' },
  { src: '/brands/Modare.svg', alt: 'Modare' },
  { src: '/brands/SpainRevealed_Gisgson.svg', alt: 'Spain Revealed' },
  { src: '/brands/Brandtia.svg', alt: 'Brandtia' },
  { src: '/brands/Tarboz.svg', alt: 'Tarboz' },
  { src: '/brands/colvin.svg', alt: 'Colvin' },
  { src: '/brands/unavets.svg', alt: 'UNAVETS' },
  { src: '/brands/quicksmile.svg', alt: 'QuickSmile' },
];

const LogoGrid = () => (
  <div className="w-full flex flex-wrap gap-x-8 gap-y-6 items-center">
    {logos.map(({ src, alt }) => (
      <img
        key={src}
        src={src}
        alt={alt}
        className="max-w-full h-[30px] lg:h-[55px] object-contain lg:p-2"
      />
    ))}
  </div>
);

const Brand = () => {
  const t = useTranslations('brand');

  return (
    <section className="px-landing py-14 lg:py-40">
      <div className="max-w-[88.875rem] mx-auto">
        <div className="flex flex-col lg:flex-row w-full gap-15">
          <div className="flex flex-col lg:w-1/3 shrink-0">
            <p className="gs-small uppercase tracking-widest text-graphite mb-3">
              {t('brand_eyebrow')}
            </p>
            <p className="text-h2 text-purple-accents mb-4 md:mb-6">
              {t('brand_title')}
            </p>
            <p className="text-dark-primary text-left text-subtitle mb-6 md:mb-10">
              {t('brand_description')}
            </p>
          </div>
          <div className="flex items-center justify-start lg:w-2/3">
            <LogoGrid />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brand;
