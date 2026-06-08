import useCasesBgGradient from 'assets/casos-de-uso-bg-gradient-1.svg';
import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import ImproveAreas from 'shared/ImproveAreas.jsx';
import { ServiceFaq } from 'shared/ServiceFaq.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import UseCases from 'shared/UseCases.jsx';
import { ServiceSchema } from '../../../seo/SchemaOrg';
import { SeoHelmet } from '../../../seo/seoHelmet';

const Logistics = () => {
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
  } = t('cases-logistics');

  const lang = i18n.language || 'en';
  const serviceUrl = lang === 'es' ? '/es/tecnologia-logistica' : '/logistics-technology';

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <ServiceSchema
        name={title}
        description={metadescription}
        url={serviceUrl}
        serviceType="Logistics Technology"
      />
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
      <Brand />
    </>
  );
};

export default Logistics;
