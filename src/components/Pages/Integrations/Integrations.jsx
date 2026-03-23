import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import IntegrationContactForm from './IntegrationContactForm';
import IntegrationLogosGrid from './IntegrationLogosGrid';
import IntegrationUseCases from './IntegrationUseCases';
import IntegrationsHero from './IntegrationsHero';

const Integrations = () => {
  const { t } = useTranslation();
  const { title, metadescription } = t('integrations-holded');

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metadescription} />
      </Helmet>
      <IntegrationsHero />
      <IntegrationUseCases />
      <IntegrationLogosGrid />
      <IntegrationContactForm />
    </>
  );
};

export default Integrations;
