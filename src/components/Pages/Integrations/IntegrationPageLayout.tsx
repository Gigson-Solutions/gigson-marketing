import type { IntegrationLogo } from './data/integrationLogos';
import IntegrationContactForm from './IntegrationContactForm';
import IntegrationLogosGrid from './IntegrationLogosGrid';
import IntegrationsHero from './IntegrationsHero';
import IntegrationUseCases from './IntegrationUseCases';

type IntegrationPageLayoutProps = {
  namespace: string;
  formEmail: string;
  formSubject: string;
  logoUrl?: string;
  showLogosGrid?: boolean;
  logos?: IntegrationLogo[];
  toolOptions?: string[];
};

const IntegrationPageLayout = ({
  namespace,
  formEmail,
  formSubject,
  logoUrl,
  showLogosGrid = false,
  logos = [],
  toolOptions = [],
}: IntegrationPageLayoutProps) => (
  <>
    <IntegrationsHero namespace={namespace} logoUrl={logoUrl} />
    <IntegrationUseCases namespace={namespace} />
    {showLogosGrid && <IntegrationLogosGrid namespace={namespace} logos={logos} />}
    <IntegrationContactForm
      namespace={namespace}
      formEmail={formEmail}
      formSubject={formSubject}
      toolOptions={toolOptions}
    />
  </>
);

export default IntegrationPageLayout;
