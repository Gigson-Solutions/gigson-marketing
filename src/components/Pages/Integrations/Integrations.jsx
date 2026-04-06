import { useTranslation } from 'react-i18next';

import { SeoHelmet } from '../../../seo/seoHelmet';
import IntegrationContactForm from './IntegrationContactForm';
import IntegrationLogosGrid from './IntegrationLogosGrid';
import IntegrationUseCases from './IntegrationUseCases';
import IntegrationsHero from './IntegrationsHero';

const Integrations = () => {
  const { t } = useTranslation();
  const { title, metadescription } = t('integrations-holded');

  return (
    <>
      <SeoHelmet title={title} description={metadescription} />
      <IntegrationsHero />
      <IntegrationUseCases />
      <IntegrationLogosGrid />
      <IntegrationContactForm />
    </>
  );
};

export default Integrations;
