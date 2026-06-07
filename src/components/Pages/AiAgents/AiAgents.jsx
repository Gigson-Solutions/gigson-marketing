import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import ProcessSteps from 'shared/ProcessSteps.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import { SeoHelmet } from '../../../seo/seoHelmet';

const AiAgents = () => {
  const { t } = useTranslation();
  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    howWeWork,
    digitalProduct,
  } = t('aiAgents');

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <ProcessSteps {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      <Brand />
    </>
  );
};

export default AiAgents;
