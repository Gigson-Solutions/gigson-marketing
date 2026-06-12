'use client';

import { useTranslations } from 'next-intl';

import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';
import Brand from '../../../shared/ui/Brand';
import DigitalProduct from '../../../shared/ui/DigitalProduct';
import Hero from '../../../shared/ui/Hero';
import HowWeWork from '../../../shared/ui/HowWeWork';
import ImproveAreas from '../../../shared/ui/ImproveAreas';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq';
import SolutionsApplications from '../../../shared/ui/SolutionsApplications';
import UseCases from '../../../shared/ui/UseCases';

const bgSrc = typeof useCasesBgGradient === 'string' ? useCasesBgGradient : (useCasesBgGradient as { src: string }).src;

const bgStyle = {
  backgroundImage: `url(${bgSrc})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const Logistics = () => {
  const t = useTranslations('cases-logistics');

  const hero = t.raw('hero') as Parameters<typeof Hero>[0];
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<typeof SolutionsApplications>[0];
  const useCases = t.raw('useCases') as Parameters<typeof UseCases>[0];
  const improveAreas = t.raw('improveAreas') as Parameters<typeof ImproveAreas>[0];
  const howWeWork = t.raw('howWeWork') as Parameters<typeof HowWeWork>[0];
  const digitalProduct = t.raw('digitalProduct') as Parameters<typeof DigitalProduct>[0];

  return (
    <>
      <Hero {...hero} />
      <section style={bgStyle}>
        <UseCases {...useCases} />
        <ImproveAreas {...improveAreas} />
      </section>
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      <Brand />
    </>
  );
};

export default Logistics;
