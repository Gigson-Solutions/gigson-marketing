import holdedLandingHtml from '../../../assets/holded-landing.html?raw';
import { useTranslation } from 'react-i18next';

import { SeoHelmet } from '../../../seo/seoHelmet';

function injectBaseHref(html) {
  return html.replace(/<head([^>]*)>/i, '<head$1><base href="/" />');
}

export default function HoldedLandingStatic() {
  const { t } = useTranslation();
  const { title, metadescription } = t('integrations-holded');
  const srcDoc = injectBaseHref(holdedLandingHtml);

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
