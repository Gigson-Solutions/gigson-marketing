import holdedLandingHtml from '../../../assets/holded-landing.html?raw';

function injectBaseHref(html) {
  return html.replace(/<head([^>]*)>/i, '<head$1><base href="/" />');
}

export default function HoldedLandingStatic() {
  const srcDoc = injectBaseHref(holdedLandingHtml);

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-[#f4f3ef]">
      <iframe
        title="Integraciones Holded · Gigson Solutions"
        srcDoc={srcDoc}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    </div>
  );
}
