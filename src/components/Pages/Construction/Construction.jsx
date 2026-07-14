import { useTranslation } from 'react-i18next';

import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';
import { SeoHelmet } from '../../../seo/seoHelmet';
import DigitalProduct from '../../../shared/ui/DigitalProduct.jsx';
import Hero from '../../../shared/ui/Hero.jsx';
import HowWeWork from '../../../shared/ui/HowWeWork.jsx';
import ImproveAreas from '../../../shared/ui/ImproveAreas.jsx';
import SolutionsApplications from '../../../shared/ui/SolutionsApplications.jsx';
import UseCases from '../../../shared/ui/UseCases.jsx';

const Construction = () => {
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
  } = t('cases-construction');

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
    </>
  );
};

export default Construction;
