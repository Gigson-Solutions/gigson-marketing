import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CasesBg from '../../../assets/CasesBg.png';
import { Accordion } from '../../Accordion/Accordion';

import './Cases.css';

const Cases = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedNeeds, setSelectedNeeds] = useState([]);

  const { t } = useTranslation();
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

  const uniqueTags = [...new Set(cases.map(({ tags }) => tags).flat())];
  const uniqueNeeds = [...new Set(cases.map(({ need }) => need).flat())];

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
    <div className="cases">
      <div className="hero-cases">
        <img src={CasesBg} alt="" className="cases-img" />
        <section className="hero-cases">
          <h1 className="hero-cases-h1">
            <Trans i18nKey={heroH1} components={{ span: <span /> }} />
          </h1>
          <p className="hero-cases-p">{heroP}</p>
        </section>
      </div>

      <h3 className="cases-filters-title">{tagTitle}</h3>
      <div className="cases-container-filters">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagFilter(tag)}
            className={`button-main filters-btn ${selectedTags.includes(tag) && 'filter-btn-active'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <h3 className="cases-filters-title">{needTitle}</h3>
      <div className="cases-container-filters">
        {uniqueNeeds.map((need) => (
          <button
            key={need}
            onClick={() => handleNeedFilter(need)}
            className={`button-main filters-btn ${selectedNeeds.includes(need) && 'filter-btn-active'}`}
          >
            {need}
          </button>
        ))}
      </div>

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
