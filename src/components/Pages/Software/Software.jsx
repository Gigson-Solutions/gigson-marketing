import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import { SeoHelmet } from '../../../seo/seoHelmet';

const Software = () => {
  const { t } = useTranslation();
  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    howWeWork,
    digitalProduct,
  } = t('software');

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      <Brand />
    </>
  );
};

export default Software;
