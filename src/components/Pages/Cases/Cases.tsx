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
  solution: string;
  tools: string[];
  tags: string[];
  need: string[];
};

const Cases = () => {
  const t = useTranslations('cases');
  const tRoot = useTranslations();

  const heroH1 = t('heroH1');
  const heroP = t('heroP');
  const featuresTitle = t('featuresTitle');
  const tagTitle = t('tagTitle');
  const needTitle = t('needTitle');
  const resetFiltersLabel = t('resetFilters');
  const solutionTitle = t('solutionTitle');
  const toolsTitle = t('toolsTitle');
  const cases = tRoot.raw('casesDropdown') as CaseItem[];
  const contact = tRoot('ctas.contact');

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
        <RichText as="h1" content={heroH1} className="hero-cases-h1" />
        <p className="hero-cases-p">{heroP}</p>
      </section>

      <SectorSelector
        title={tagTitle}
        sectors={uniqueTags}
        selected={selectedTags}
        onToggle={handleTagFilter}
        centered
      />

      <SectorSelector
        title={needTitle}
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
          {filteredCases.map(({ title, subTitle, challenge, features, solution, tools }, i) => (
            <div key={i}>
              <Accordion
                title={title}
                subTitle={subTitle}
                challenge={challenge}
                features={features}
                solution={solution}
                tools={tools}
                featuresTitle={featuresTitle}
                solutionTitle={solutionTitle}
                toolsTitle={toolsTitle}
                isOpen={activeIndex === i}
                onClick={() => setActiveIndex((prev) => (prev === i ? undefined : i))}
                classContainer="accordions-container"
              />
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
