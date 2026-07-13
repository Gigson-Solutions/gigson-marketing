import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import '../../src/components/Pages/NotFound/NotFound.css';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="div">
      <section className="not-home-services" id="homeServices">
        <div className="wrapper">
          <section className="not-div-about-hero">
            <h2 className="not-h1">
              <span>Oops...</span>
            </h2>
            <h3 className="not-h3">{t('title2')}</h3>
            <p className="not-p">{t('description')}</p>
            <Link href="/" className="not-hero-btn button-main">
              {t('cta')}
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
}
