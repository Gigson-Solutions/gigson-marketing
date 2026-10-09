import '../../../../src/components/Pages/ThankYou/ThankYou.css';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Link } from '../../../../i18n/navigation';
import { localizedUrl } from '../../../../lib/schema';

type Props = { params: Promise<{ locale: string }> };

type Step = { title: string; text: string };

/*
 * Página de gracias común a todos los formularios de leads (home, contacto,
 * integraciones, ERP a medida, ISO 27001, consultoría Odoo). Los formularios
 * redirigen aquí solo cuando /api/lead ha aceptado el lead, así que una visita
 * a esta URL sirve como conversión en Google Ads. Llegan con `?form=<form_id>`
 * (p. ej. /es/gracias?form=iso27001), para poder contar cada formulario por
 * separado con una regla "la URL contiene". noindex: no debe aparecer en
 * buscadores ni en el sitemap; el canonical va sin parámetros.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'thankYou' });

  return {
    title: { absolute: t('seo.title') },
    description: t('seo.description'),
    robots: { index: false, follow: false },
    alternates: { canonical: localizedUrl('/thank-you', locale) },
  };
}

export default async function ThankYouPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'thankYou' });
  const steps = t.raw('steps') as Step[];

  return (
    <div className="thankyou">
      <div className="thankyou-card" role="status" aria-live="polite">
        <div className="thankyou-mark" aria-hidden="true">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5E5BC6"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <span className="thankyou-badge">{t('badge')}</span>
        <h1>{t('title')}</h1>
        <p className="thankyou-intro">{t('intro')}</p>
        <ol className="thankyou-steps">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="thankyou-step-n">{i + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="thankyou-hint">{t('bookHint')}</p>
        <div className="thankyou-actions">
          <Link href="/book" className="thankyou-btn">
            {t('bookCta')}
          </Link>
          <Link href="/cases" className="thankyou-btn thankyou-btn--ghost">
            {t('casesCta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
