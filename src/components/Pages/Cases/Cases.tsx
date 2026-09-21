'use client';

import './Cases.css';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CasesBg from '../../../assets/CasesBg.png';
import { Link } from '../../../../i18n/navigation';
import { RichText } from '../../../shared/ui/RichText';
import { Accordion } from '../../Accordion/Accordion';
import SectorSelector from '../../Home/SectorSelector';

const bgSrc = typeof CasesBg === 'string' ? CasesBg : (CasesBg as { src: string }).src;

type CaseItem = {
  title: string;
  subTitle?: string;
  challenge: string;
  features: string[];
  results?: string[];
  solution: string;
  tools: string[];
  tags: string[];
  need: string[];
  /** Present only for cases coming from Payload — the message-file copy has no
   * slug, and a case without one simply renders without a link to its page. */
  slug?: string;
};

/**
 * `items` comes from the `cases` collection. It is optional, and the component
 * falls back to the `casesDropdown` copy in the message files when the
 * collection is empty, so the page keeps working unchanged between the deploy
 * that creates the table and whoever runs the seed. Once the collection is
 * populated the fallback stops being reachable and can go.
 */
const Cases = ({ items }: { items?: CaseItem[] }) => {
  const t = useTranslations('cases');
  const tRoot = useTranslations();

  // Own key: `heroH1` is shared with the home page's cases block, so the page
  // H1 used to be the generic "¿Cómo podemos ayudarte…?" with no keywords.
  const pageH1 = t.raw('pageH1') as string;
  const heroP = t('heroP');
  const featuresTitle = t('featuresTitle');
  const tagTitle = t('tagTitle');
  const needTitle = t('needTitle');
  const resetFiltersLabel = t('resetFilters');
  const solutionTitle = t('solutionTitle');
  const toolsTitle = t('toolsTitle');
  const resultsTitle = t('resultsTitle');
  const cases = items && items.length > 0 ? items : (tRoot.raw('casesDropdown') as CaseItem[]);
  const contact = tRoot('ctas.contact');
  const readCase = t('readCase');

  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const uniqueTags = Array.from(new Set(cases.flatMap(({ tags }) => tags)));
  const uniqueNeeds = Array.from(new Set(cases.flatMap(({ need }) => need)));

  const handleTagFilter = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleNeedFilter = (need: string) =>
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );

  const filteredCases = cases.filter(
    (c) =>
      (selectedTags.length === 0 || c.tags.some((tag) => selectedTags.includes(tag))) &&
      (selectedNeeds.length === 0 || c.need.some((n) => selectedNeeds.includes(n)))
  );

  return (
    <div className="cases mt-28">
      <section className="relative py-20">
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 h-full w-auto min-w-full object-cover opacity-[0.14] -z-10"
        />
        <RichText as="h1" content={pageH1} className="hero-cases-h1" />
        <p className="hero-cases-p">{heroP}</p>
      </section>

      <SectorSelector
        title={tagTitle}
        headingAs="h2"
        sectors={uniqueTags}
        selected={selectedTags}
        onToggle={handleTagFilter}
        centered
      />

      <SectorSelector
        title={needTitle}
        headingAs="h2"
        sectors={uniqueNeeds}
        selected={selectedNeeds}
        onToggle={handleNeedFilter}
        centered
      />

      <button className="cases-reset-filters" onClick={() => { setSelectedTags([]); setSelectedNeeds([]); }}>
        {resetFiltersLabel}
      </button>

      <div className="wrapper">
        <div className="accordions-container">
          {filteredCases.map(({ title, subTitle, challenge, features, results, solution, tools, slug }, i) => (
            <div key={i}>
              <Accordion
                title={title}
                subTitle={subTitle}
                challenge={challenge}
                features={features}
                results={results}
                solution={solution}
                tools={tools}
                featuresTitle={featuresTitle}
                resultsTitle={resultsTitle}
                solutionTitle={solutionTitle}
                toolsTitle={toolsTitle}
                isOpen={activeIndex === i}
                onClick={() => setActiveIndex((prev) => (prev === i ? undefined : i))}
                classContainer="accordions-container"
              />
              {slug && (
                <Link
                  className="cases-read-case"
                  href={{ pathname: '/cases/[slug]', params: { slug } }}
                >
                  {readCase}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link className="about-button-contact button-main" href="/contact">
        {contact}
      </Link>
    </div>
  );
};

export default Cases;
