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
};

const IntegrationPageLayout = ({
  namespace,
  formEmail,
  formSubject,
  logoUrl,
  showLogosGrid = false,
}: IntegrationPageLayoutProps) => (
  <>
    <IntegrationsHero namespace={namespace} logoUrl={logoUrl} />
    <IntegrationUseCases namespace={namespace} />
    {showLogosGrid && <IntegrationLogosGrid />}
    <IntegrationContactForm namespace={namespace} formEmail={formEmail} formSubject={formSubject} />
  </>
);

export default IntegrationPageLayout;
