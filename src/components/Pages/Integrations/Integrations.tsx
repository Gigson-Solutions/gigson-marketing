import { HOLDED_INTEGRATION_LOGOS, HOLDED_TOOL_OPTIONS } from './data/integrationLogos';
import IntegrationPageLayout from './IntegrationPageLayout';

const Integrations = () => (
  <IntegrationPageLayout
    namespace="integrations-holded"
    formEmail="jaume@somosgigson.com"
    formSubject="Nueva consulta de integraciones Holded"
    showLogosGrid
    logos={HOLDED_INTEGRATION_LOGOS}
    toolOptions={HOLDED_TOOL_OPTIONS}
  />
);

export default Integrations;
