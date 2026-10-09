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
 *
 * Montada solo con las utilidades Tailwind del tema (text-h1, text-subtitle,
 * px-landing…) y las clases de los botones compartidos (shared/ui/Button), para
 * que herede tipografía, colores y espaciado del sistema de diseño.
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

// Mismas clases que ButtonLink (shared/ui/Button), que no se puede usar aquí
// porque enlaza con next/link y estos destinos necesitan el Link localizado.
const BTN = 'text-center text-button rounded-full py-3 px-6 hover:opacity-80 uppercase';
const BTN_SOLID = `${BTN} text-white bg-purple-accents`;
const BTN_OUTLINED = `${BTN} text-purple-accents border border-purple-accents transition duration-200 ease-linear hover:bg-[#e3e1ee] hover:text-purple-accents`;

export default async function ThankYouPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'thankYou' });
  const steps = t.raw('steps') as Step[];

  return (
    <section className="px-landing mt-fixed-navbar bg-[#f4f3ef]">
      <div className="max-w-[88.875rem] mx-auto pt-14 lg:pt-20 pb-14 lg:pb-20">
        <div
          className="max-w-[45rem] mx-auto bg-white rounded-[30px] p-8 lg:p-14 flex flex-col gap-6"
          role="status"
          aria-live="polite"
        >
          <span className="inline-block self-start text-purple-accents text-smallTag uppercase tracking-widest border border-purple-accents rounded-full px-4 py-1">
            {t('badge')}
          </span>
          <h1 className="text-h2 text-dark-primary">{t('title')}</h1>
          <p className="text-subtitle text-dark-medium">{t('intro')}</p>

          <ol className="flex flex-col m-0 p-0">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex items-start gap-4 py-4 border-t border-[rgba(60,60,59,0.3)]"
              >
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f4f3ef] border border-purple-accents text-purple-accents flex items-center justify-center text-body"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-body text-dark-primary">{step.title}</span>
                  <span className="text-body text-dark-medium">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="text-body text-dark-medium">{t('bookHint')}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className={BTN_SOLID}>
              {t('bookCta')}
            </Link>
            <Link href="/cases" className={BTN_OUTLINED}>
              {t('casesCta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
