import { useTranslation } from 'react-i18next';

import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';
import { SeoHelmet } from '../../../seo/seoHelmet';
import DigitalProduct from '../../../shared/ui/DigitalProduct.jsx';
import Hero from '../../../shared/ui/Hero.jsx';
import HowWeWork from '../../../shared/ui/HowWeWork.jsx';
import ImproveAreas from '../../../shared/ui/ImproveAreas.jsx';
import { ServiceFaq } from '../../../shared/ui/ServiceFaq.jsx';
import SolutionsApplications from '../../../shared/ui/SolutionsApplications.jsx';
import UseCases from '../../../shared/ui/UseCases.jsx';
import { ServiceSchema } from '../../../seo/SchemaOrg';

const Construction = () => {
  const { t, i18n } = useTranslation();

  const {
    title,
    metadescription,
    hero,
    solutionsApplications,
    useCases,
    improveAreas,
    howWeWork,
    digitalProduct,
    faq,
  } = t('cases-construction');

  const lang = i18n.language || 'en';
  const serviceUrl = lang === 'es' ? '/es/tecnologia-construccion' : '/construction-technology';

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <ServiceSchema name={title} description={metadescription} url={serviceUrl} serviceType="Construction Technology" />
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
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
    </>
  );
};

export default Construction;
