import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import holdedLandingHtml from '../../../assets/holded-landing.html?raw';
import { SeoHelmet } from '../../../seo/seoHelmet';

function injectBaseHref(html) {
  return html.replace(/<head([^>]*)>/i, '<head$1><base href="/" />');
}

function injectAgentKey(html, agentKey) {
  return html.replace(
    /const _agentKey\s*=\s*\(function\(\)[\s\S]*?\}\)\(\);/,
    `const _agentKey = '${agentKey}';`
  );
}

export default function HoldedLandingStatic() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { title, metadescription } = t('integrations-holded');

  const agentKey = new URLSearchParams(search).get('agent') || 'jaume';
  const srcDoc = injectAgentKey(injectBaseHref(holdedLandingHtml), agentKey);

  return (
    <div className="fixed inset-0 z-[300] h-dvh w-full overflow-hidden bg-[#f4f3ef]">
      <SeoHelmet title={title} description={metadescription} />
      <iframe
        title="Integraciones Holded · Gigson Solutions"
        srcDoc={srcDoc}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    </div>
  );
}
