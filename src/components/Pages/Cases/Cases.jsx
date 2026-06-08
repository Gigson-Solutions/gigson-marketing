import './Cases.css';

import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import SectorSelector from '../../Home/SectorSelector';

import CasesBg from '../../../assets/CasesBg.png';
import { SeoHelmet } from '../../../seo/seoHelmet';
import { Accordion } from '../../Accordion/Accordion';

const Cases = () => {
  const [activeIndex, setActiveIndex] = useState();

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? undefined : index));
  };
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedNeeds, setSelectedNeeds] = useState([]);

  const { t } = useTranslation();
  const seo = t('pageSeo.cases');
  const {
    heroH1,
    heroP,
    featuresTitle,
    tagTitle,
    needTitle,
    resetFilters,
    solutionTitle,
    toolsTitle,
  } = t('cases');
  const cases = t('casesDropdown');
  const { contact } = t('ctas');

  const uniqueTags = [...new Set(cases.flatMap(({ tags }) => tags))];
  const uniqueNeeds = [...new Set(cases.flatMap(({ need }) => need))];

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleNeedFilter = (need) => {
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== need));
    } else {
      setSelectedNeeds([...selectedNeeds, need]);
    }
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setSelectedNeeds([]);
  };

  const filteredCases = cases.filter(
    (caseItem) =>
      (selectedTags.length === 0 ||
        caseItem.tags.some((tag) => selectedTags.includes(tag))) &&
      (selectedNeeds.length === 0 ||
        caseItem.need.some((need) => selectedNeeds.includes(need)))
  );

  return (
    <div className="cases mt-28">
      <SeoHelmet title={seo.title} description={seo.description} />
      <section className="relative py-20">
        <img 
          src={CasesBg} 
          alt="" 
          className="absolute inset-0 h-full w-auto min-w-full object-cover opacity-[0.14] -z-10" 
        />
        
          <h1 className="hero-cases-h1">
            <Trans i18nKey={heroH1} components={{ span: <span /> }} />
          </h1>
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

      <button className="cases-reset-filters" onClick={handleResetFilters}>
        {resetFilters}
      </button>

      <div className="wrapper">
        <div className="accordions-container">
          {filteredCases.map(
            ({ title, subTitle, challenge, features, solution, tools }, i) => (
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
                  onClick={() => handleItemClick(i)}
                  classContainer="accordions-container"
                />
              </div>
            )
          )}
        </div>
      </div>

      <Link className="about-button-contact button-main" to="/contact">
        {contact}
      </Link>
    </div>
  );
};

export default Cases;
