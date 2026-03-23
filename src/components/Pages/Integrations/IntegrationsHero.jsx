import { useTranslation } from 'react-i18next';

import heroImg from 'assets/integrations/conectar-holded.png';

const IntegrationsHero = () => {
  const { t } = useTranslation();
  const hero = t('integrations-holded.hero');

  return (
    <section className="px-landing mt-fixed-navbar bg-[#f4f3ef]">
      {/* Hero principal — 2 columnas */}
      <div className="max-w-[88.875rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center pt-14 lg:pt-20 pb-14 lg:pb-20">
        {/* Columna izquierda — texto */}
        <div className="flex-1 flex flex-col items-start">
          <p className="text-purple-accents text-body1 mb-4">
            {hero.badge}
          </p>
          <h1 className="text-h1 text-dark-primary mb-4">
            {hero.title}
          </h1>
          <p className="text-h3 text-dark-primary mb-4">
            {hero.subtitle}
          </p>
          <p className="text-subtitle text-dark-medium mb-8">
            {hero.description}
          </p>
          <a
            href="#contacto"
            className="inline-block bg-purple-accents text-white text-button rounded-full py-3 px-8 hover:opacity-80 transition duration-200 ease-linear mb-12"
          >
            {hero.cta}
          </a>

          {/* Especialistas — dentro del mismo bloque izquierdo */}
          <p className="text-h3 text-dark-primary mb-6">
            {hero.specialists.title}
          </p>
          <ul className="flex flex-col gap-4 mb-6">
            {hero.specialists.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-subtitle text-dark-primary">
                <span className="mt-1 w-2 h-2 rounded-full bg-purple-accents flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href="#casos"
            className="text-purple-accents text-button underline hover:opacity-70 transition"
          >
            {hero.specialists.link}
          </a>
        </div>

        {/* Columna derecha — imagen */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src={heroImg}
            alt="Conectar Holded con tu software"
            className="w-full max-w-[520px] object-contain"
          />
        </div>
      </div>

      {/* WhatsApp CTA — franja inferior */}
      <div className="border-t border-[#dddbd5]">
        <div className="max-w-[88.875rem] mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-h4 text-dark-primary">{hero.whatsapp.title}</p>
          <a
            href="https://wa.me/34623783507"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white text-button rounded-full py-3 px-6 hover:opacity-90 transition flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.478 2.027 7.789L0 32l8.418-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 01-6.784-1.855l-.486-.29-5.003 1.195 1.22-4.872-.317-.5A13.282 13.282 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.354-1.162-2.719-1.294-.365-.132-.631-.199-.898.199-.266.397-1.03 1.294-1.264 1.56-.232.265-.465.298-.863.099-.398-.199-1.68-.619-3.2-1.977-1.183-1.056-1.981-2.36-2.214-2.758-.232-.398-.025-.613.175-.81.179-.177.398-.464.598-.696.2-.232.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.898-2.165-1.23-2.962-.323-.778-.652-.673-.898-.686-.232-.012-.498-.015-.764-.015-.266 0-.697.1-.1063.498-.365.398-1.396 1.362-1.396 3.32s1.43 3.85 1.629 4.116c.199.265 2.814 4.298 6.82 6.029.954.412 1.698.658 2.279.842.957.305 1.83.262 2.518.159.768-.115 2.354-.962 2.686-1.892.332-.93.332-1.726.232-1.892-.099-.165-.365-.265-.763-.464z"/>
            </svg>
            {hero.whatsapp.cta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsHero;
