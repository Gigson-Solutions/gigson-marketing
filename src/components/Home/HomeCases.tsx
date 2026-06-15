'use client';

import '../Pages/Cases/Cases.css';
import './Homecases.css';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Accordion } from '../Accordion/Accordion';
import { Link } from '../../../i18n/navigation';
import { RichText } from '../../shared/ui/RichText';
import SectorSelector from './SectorSelector';

type CaseItem = {
  title: string;
  challenge: string;
  features: string[];
  solution: string;
  tools: string[];
  tags: string[];
  need: string[];
};

const HomeCases = () => {
  const t = useTranslations();
  const tw = useTranslations('caseswhygigson');
  const tc = useTranslations('cases');

  const casesData = t.raw('casesDropdown') as CaseItem[];

  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const uniqueTags = Array.from(new Set(casesData.flatMap(({ tags }) => tags)));
  const uniqueNeeds = Array.from(new Set(casesData.flatMap(({ need }) => need)));

  const handleItemClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  const handleTagFilter = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleNeedFilter = (need: string) =>
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );

  const filteredCases = casesData.filter(
    (c) =>
      (selectedTags.length === 0 || c.tags.some((tag) => selectedTags.includes(tag))) &&
      (selectedNeeds.length === 0 || c.need.some((n) => selectedNeeds.includes(n)))
  );

  return (
    <div className="wrapper cases">
      <section className="cases-why-gigson">
        <h2>{tw('wth2')}</h2>
        <div>
          <p>{tw('wp1')}</p>
          <p>{tw('wp2')}</p>
          <Link href="/cases" className="button-main why-gigson-btn">
            {tw('wlink')}
          </Link>
        </div>
      </section>

      <section>
        <div className="home-case-flex">
          <div className="home-hero-cases">
            <section className="home-hero-cases">
              <RichText as="h1" content={tc.raw('heroH1') as string} className="home-hero-cases-h1" />
              <p className="home-hero-cases-p">{tc('heroP')}</p>
            </section>
          </div>
          <div className="case-selector-flex">
            <SectorSelector
              title={tc('tagTitle')}
              sectors={uniqueTags}
              selected={selectedTags}
              onToggle={handleTagFilter}
            />
            <SectorSelector
              title={tc('needTitle')}
              sectors={uniqueNeeds}
              selected={selectedNeeds}
              onToggle={handleNeedFilter}
            />
            <button
              className="cases-reset-filters home"
              onClick={() => { setSelectedTags([]); setSelectedNeeds([]); }}
            >
              {tc('resetFilters')}
            </button>
          </div>
        </div>

        <div className="accordions-ct">
          {filteredCases.map(({ title, challenge, features, solution, tools }, i) => (
            <div key={i}>
              <Accordion
                title={title}
                challenge={challenge}
                features={features}
                solution={solution}
                tools={tools}
                featuresTitle={tc('featuresTitle')}
                solutionTitle={tc('solutionTitle')}
                toolsTitle={tc('toolsTitle')}
                isOpen={activeIndex === i}
                onClick={() => handleItemClick(i)}
                classContainer="accordions-ct"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeCases;
