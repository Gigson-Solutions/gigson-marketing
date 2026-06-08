import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import ProcessSteps from 'shared/ProcessSteps.jsx';
import { ServiceFaq } from 'shared/ServiceFaq.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import { ServiceSchema } from '../../../seo/SchemaOrg';
import { SeoHelmet } from '../../../seo/seoHelmet';

const Software = () => {
  const { t, i18n } = useTranslation();
  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    howWeWork,
    digitalProduct,
    faq,
  } = t('software');

  const lang = i18n.language || 'en';
  const serviceUrl = lang === 'es' ? '/es/ingenieria-software' : '/software-engineering';

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <ServiceSchema name={title} description={metadescription} url={serviceUrl} serviceType="Software Engineering" />
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <ProcessSteps {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Software;
