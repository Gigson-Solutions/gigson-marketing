import { ODOO_INTEGRATION_LOGOS, ODOO_TOOL_OPTIONS } from './data/integrationLogos';
import IntegrationPageLayout from './IntegrationPageLayout';

const IntegrationsOdoo = () => (
  <IntegrationPageLayout
    namespace="integrations-odoo"
    formEmail="jaume@somosgigson.com"
    formSubject="Nueva consulta de integraciones Odoo"
    logoUrl="/img/logos-negros/odoo-holded.png"
    showLogosGrid
    logos={ODOO_INTEGRATION_LOGOS}
    toolOptions={ODOO_TOOL_OPTIONS}
  />
);

export default IntegrationsOdoo;
