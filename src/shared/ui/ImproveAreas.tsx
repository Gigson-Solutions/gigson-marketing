'use client';

import { useState } from 'react';

import chevronDownIcon from '../../assets/chevron-down.svg';
import timesCircleIcon from '../../assets/times-circle.svg';
import { FaqsAccordion } from '../../components/Pages/Faqs/FaqsAccordion/FaqsAccordion';
import { Button } from './Button';
import Dialog from './Dialog';

const getImgSrc = (img: { src: string } | string) => (typeof img === 'string' ? img : img.src);

type PainPoint = { type: string; name: string };
type Technology = { title: string; description: string };
type Functionality = { title: string; description: string };
type FaqAnswer = {
  challengeDescription: string;
  technologiesText: string;
  technologies: Technology[];
  functionalitiesText: string;
  functionalities: Functionality[];
  solutionText: string;
  solutionDescription: string;
};
type Faq = { question: string; answer: FaqAnswer; types: string[] };

type Props = {
  title: string;
  painPoints: PainPoint[];
  faqs: Faq[];
  filtersText: string;
  filtersClearAllText: string;
  applyFiltersText: string;
};

const useFaqVisibility = (painPoints: PainPoint[]) => {
  const defaultPainPoints = painPoints.map((p) => p.type);
  const [initialChipsState, setInitialChipsState] = useState(true);
  const [selectedPainPoints, setSelectedPainPoints] = useState(defaultPainPoints);
  const [tempSelectedPainPoints, setTempSelectedPainPoints] = useState<string[]>([]);

  const toggleChipsState = (type: string) => {
    if (initialChipsState) setSelectedPainPoints([]);
    setSelectedPainPoints((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) { setInitialChipsState(true); return defaultPainPoints; }
        return prev.filter((i) => i !== type);
      }
      return [...prev, type];
    });
  };

  const toggleTempChipsState = (type: string) => {
    setTempSelectedPainPoints((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) { setInitialChipsState(true); return defaultPainPoints; }
        return prev.filter((i) => i !== type);
      }
      return [...prev, type];
    });
  };

  const resetFilters = () => {
    setInitialChipsState(true);
    setSelectedPainPoints(defaultPainPoints);
    setTempSelectedPainPoints([]);
  };

  return { tempSelectedPainPoints, selectedPainPoints, setSelectedPainPoints, toggleChipsState, toggleTempChipsState, initialChipsState, setInitialChipsState, resetFilters, defaultPainPoints };
};

const Chip = ({ isActive, isMobile, isDialog, name, onClick, endAdornment }: { isActive?: boolean; isMobile?: boolean; isDialog?: boolean; name: string; onClick: () => void; endAdornment?: string }) => (
  <div
    className={`group flex items-center justify-center w-fit py-1 px-4 ${endAdornment ? 'pr-3' : ''} rounded-full border-[0.5px] border-dark-primary cursor-pointer hover:opacity-80 ${isActive ? 'bg-purple-light-b' : ''}`}
    onClick={onClick}
  >
    <p className={`flex items-center text-dark-primary ${isMobile ? 'text-h5' : 'text-subtitle'}`}>
      {name}
      {endAdornment && <img src={getImgSrc(endAdornment as unknown as { src: string } | string)} alt="chevron" className="ml-2" />}
    </p>
  </div>
);

const AccordionContent = ({ challengeDescription, technologiesText, technologies, functionalitiesText, functionalities, solutionText, solutionDescription }: FaqAnswer) => (
  <div className="flex flex-col pt-6 pb-10 md:px-6 text-dark-medium">
    <p className="text-body mb-6 md:mb-10">{challengeDescription}</p>
    <div className="mb-6 md:mb-10">
      <p className="text-purple-accents text-subtitle mb-1">{functionalitiesText}</p>
      <ul className="ml-6">
        {functionalities.map(({ title, description }, index) => (
          <li key={index} className="text-body text-dark-primary !list-disc">
            <p className="text-body text-dark-medium">
              <span className="font-bold text-dark-primary mr-2">{title}</span>
              <span>{description}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col md:flex-row gap-10">
      <div className="flex-1">
        <p className="text-subtitle text-purple-accents">{solutionText}</p>
        <p className="text-body text-dark-medium">{solutionDescription}</p>
      </div>
      <div className="flex-1">
        <p className="text-purple-accents text-subtitle mb-1">{technologiesText}</p>
        <ul className="ml-6">
          {technologies.map(({ title, description }, index) => (
            <li key={index} className="text-body text-dark-primary !list-disc">
              <p className="text-body text-dark-medium">
                <span className="font-bold text-dark-primary mr-2">{title}</span>
                <span>{description}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const FaqList = ({ faqs, selectedPainPoints }: { faqs: Faq[]; selectedPainPoints: string[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const handleItemClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  return (
    <div className="improve-areas-faq">
      {faqs.map(({ question, answer, types }, faqIndex) => {
        const isVisible = types.some((t) => selectedPainPoints.includes(t));
        return (
          <div key={faqIndex} className={isVisible ? 'block' : 'hidden'}>
            <FaqsAccordion
              question={question}
              isOpen={activeIndex === faqIndex}
              onClick={() => handleItemClick(faqIndex)}
            >
              <AccordionContent {...answer} />
            </FaqsAccordion>
          </div>
        );
      })}
    </div>
  );
};

const ImproveAreas = ({ title, painPoints, faqs, filtersText, filtersClearAllText, applyFiltersText }: Props) => {
  const { tempSelectedPainPoints, selectedPainPoints, setSelectedPainPoints, toggleChipsState, toggleTempChipsState, initialChipsState, setInitialChipsState, resetFilters, defaultPainPoints } = useFaqVisibility(painPoints);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasMultipleFilters = selectedPainPoints.length > 0 && !initialChipsState;
  const chevronSrc = getImgSrc(chevronDownIcon as unknown as { src: string } | string);
  const timesSrc = getImgSrc(timesCircleIcon as unknown as { src: string } | string);

  return (
    <>
      <div className="px-landing pt-14 lg:pt-40 pb-6 lg:pb-20">
        <div className="max-w-[88.875rem] mx-auto flex flex-col">
          <div className="flex flex-row items-center justify-between mb-4 md:mb-6">
            <span className="text-bigTag uppercase text-purple-accents">{title}</span>
            {hasMultipleFilters && (
              <div className="hidden md:block">
                <span role="button" className="text-button text-[#A0A09F] cursor-pointer hover:opacity-80" onClick={resetFilters}>{filtersClearAllText}</span>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
              {painPoints.map(({ type, name }, index) => (
                <Chip
                  key={index}
                  isActive={selectedPainPoints.includes(type) && !initialChipsState}
                  name={name}
                  onClick={() => { setInitialChipsState(false); toggleChipsState(type); toggleTempChipsState(type); }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col md:hidden items-start justify-between w-full self-start mb-10">
            <div className="flex flex-row md:hidden items-center justify-between w-full self-start mb-4">
              <Chip name={filtersText} endAdornment={chevronSrc} onClick={() => setDialogOpen(true)} />
              {hasMultipleFilters && (
                <span role="button" className="text-button text-[#A0A09F] cursor-pointer hover:opacity-80" onClick={resetFilters}>{filtersClearAllText}</span>
              )}
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-2">
              {painPoints.filter(({ type }) => selectedPainPoints.includes(type)).map(({ type, name }, index) => {
                if (initialChipsState) return null;
                return (
                  <Chip key={index} isMobile isActive name={name} endAdornment={timesSrc}
                    onClick={() => {
                      if (selectedPainPoints.length === 1) { resetFilters(); return; }
                      toggleChipsState(type); toggleTempChipsState(type);
                    }}
                  />
                );
              })}
            </div>
          </div>

          <FaqList faqs={faqs} selectedPainPoints={selectedPainPoints} />
        </div>
      </div>

      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div className="flex flex-col">
            <p className="text-subtitle text-dark-primary mb-4">{filtersText}</p>
            <div className="mb-20">
              <div className="flex flex-col md:flex-row flex-wrap gap-2">
                {painPoints.map(({ type, name }, index) => (
                  <Chip key={index} isDialog isActive={tempSelectedPainPoints.includes(type)} name={name} onClick={() => toggleTempChipsState(type)} />
                ))}
              </div>
            </div>
            <Button text={applyFiltersText} onClick={() => {
              if (tempSelectedPainPoints.length === 0) {
                setSelectedPainPoints(defaultPainPoints);
                setInitialChipsState(true);
              } else {
                setSelectedPainPoints(tempSelectedPainPoints);
                setInitialChipsState(false);
              }
              setDialogOpen(false);
            }} />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ImproveAreas;
