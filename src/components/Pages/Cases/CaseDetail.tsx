import { getTranslations } from 'next-intl/server';

import { Link } from '../../../../i18n/navigation';
import { textRows, type CaseStudy } from '../../../../lib/cases';

type SectionProps = { title: string; items: string[] };

const ListSection = ({ title, items }: SectionProps) => {
  if (items.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-h3 text-dark-primary mb-4">{title}</h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="text-body1 text-dark-primary flex gap-3">
            <span aria-hidden="true" className="text-purple-accents">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * One case study, on a URL of its own. A case is the most citable thing a B2B
 * site has — a named sector, a concrete problem, the systems involved and a
 * measurable result — and until now all five shared `/casos` behind a filter
 * widget, so none of them could be linked to or answer a query on its own.
 *
 * Results are rendered before features deliberately: the measurable outcome is
 * the part worth quoting, and burying it under a feature list is what makes a
 * case read like a brochure.
 */
const CaseDetail = async ({ caseStudy, locale }: { caseStudy: CaseStudy; locale: string }) => {
  const t = await getTranslations({ locale, namespace: 'cases' });

  const sectors = textRows(caseStudy.tags);

  return (
    <article className="px-landing mt-fixed-navbar pt-14 lg:pt-23 pb-20">
      <div className="max-w-contained mx-auto">
        {sectors.length > 0 && (
          <p className="text-smallTag uppercase tracking-widest text-purple-accents mb-4">
            {sectors.join(' · ')}
          </p>
        )}
        <h1 className="text-h1 text-dark-primary mb-8">{caseStudy.title}</h1>

        <section className="mb-10">
          <h2 className="text-h3 text-dark-primary mb-4">{t('challengeTitle')}</h2>
          <p className="text-body1 text-dark-primary">{caseStudy.challenge}</p>
        </section>

        <ListSection title={t('resultsTitle')} items={textRows(caseStudy.results)} />

        {caseStudy.solution && (
          <section className="mb-10">
            <h2 className="text-h3 text-dark-primary mb-4">{t('solutionTitle')}</h2>
            <p className="text-body1 text-dark-primary">{caseStudy.solution}</p>
          </section>
        )}

        <ListSection title={t('featuresTitle')} items={textRows(caseStudy.features)} />
        <ListSection title={t('toolsTitle')} items={textRows(caseStudy.tools)} />

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-dark-medium/30">
          <Link href="/contact" className="about-hero-btn button-main">
            {t('detailCta')}
          </Link>
          <Link href="/cases" className="underline text-body1">
            {t('backToCases')}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseDetail;
