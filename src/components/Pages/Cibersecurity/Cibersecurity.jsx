import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import { ServiceFaq } from 'shared/ServiceFaq.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';

import { ServiceSchema } from '../../../seo/SchemaOrg';
import { SeoHelmet } from '../../../seo/seoHelmet';

const Cibersecurity = () => {
  const { t, i18n } = useTranslation();
  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    howWeWork,
    digitalProduct,
    faq,
  } = t('cibersecurity');

  const lang = i18n.language || 'en';
  const serviceUrl = lang === 'es' ? '/es/ciberseguridad' : '/cybersecurity';

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <ServiceSchema
        name={title}
        description={metadescription}
        url={serviceUrl}
        serviceType="Cybersecurity"
      />
      <Hero {...hero} />
      <SolutionsApplications {...solutionsApplications} />
      <HowWeWork {...howWeWork} />
      <DigitalProduct {...digitalProduct} />
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Cibersecurity;
