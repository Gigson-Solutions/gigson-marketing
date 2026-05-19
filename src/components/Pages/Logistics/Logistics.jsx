import useCasesBgGradient from 'assets/casos-de-uso-bg-gradient-1.svg';
import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import ImproveAreas from 'shared/ImproveAreas.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import UseCases from 'shared/UseCases.jsx';

import { SeoHelmet } from '../../../seo/seoHelmet';

const Logistics = () => {
  const { t } = useTranslation();
  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    useCases,
    improveAreas,
    howWeWork,
    digitalProduct,
  } = t('cases-logistics');

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <Hero {...hero} />
      <section
        style={{
          backgroundImage: `url(${useCasesBgGradient}`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
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
