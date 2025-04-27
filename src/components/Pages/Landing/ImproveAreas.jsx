import { useState } from "react";
import {Trans, useTranslation} from "react-i18next";
import Dialog from "../../../shared/ui/Dialog.jsx";
import { Button } from "../../../shared/ui/Button.jsx";
import {FaqsAccordion} from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";
import chevronDownIcon from "../../../assets/chevron-down.svg";
import timesCircleIcon from "../../../assets/times-circle.svg";

const useFaqVisibility = (areas) => {
    const [visibleFaqs, setVisibleFaqs] = useState([areas[0]]);
    const [activeFilterIndexes, setActiveFilterIndexes] = useState([0]);
    const [activeFaqIndex, setActiveFaqIndex] = useState();

    const toggleFaqVisibility = (index) => {
        setVisibleFaqs((prevVisibleFaqs) => {
            const selectedArea = areas[index];
            const areaIndex = prevVisibleFaqs.findIndex((area) => area.summary === selectedArea.summary);

            if (areaIndex !== -1) {
                if (prevVisibleFaqs.length > 1) {
                    const updatedFaqs = [...prevVisibleFaqs];
                    updatedFaqs.splice(areaIndex, 1);
                    return updatedFaqs;
                }
                return prevVisibleFaqs;
            } else {
                return [...prevVisibleFaqs, selectedArea];
            }
        });
    };

    const toggleActiveFilterIndex = (index) => {
        setActiveFilterIndexes((prevIndexes) => {
            if (prevIndexes.includes(index)) {
                if (prevIndexes.length > 1) {
                    return prevIndexes.filter((i) => i !== index);
                }
                    return prevIndexes;
            } else {
                return [...prevIndexes, index];
            }
        });
    };

    const toggleActiveFaqIndex = (index) => setActiveFaqIndex((prevIndex) => (prevIndex === index ? null : index));

    const applyFaqVisibilityFilter = () => {
        setVisibleFaqs(activeFilterIndexes.map((filterIndex) => areas[filterIndex]));
    };

    const resetFilters = () => {
        setVisibleFaqs([areas[0]]);
        setActiveFilterIndexes([0]);
    };

    return {
        visibleFaqs,
        activeFilterIndexes,
        toggleFaqVisibility,
        toggleActiveFilterIndex,
        activeFaqIndex,
        toggleActiveFaqIndex,
        applyFaqVisibilityFilter,
        resetFilters,
    };
};

const FilterBadge = ({ isActive, isMobile, summary, onClick, endAdornment }) => {

    const boxBgClass = isActive ? 'bg-purple-light-b' : '';

    const boxPaddingClass = endAdornment ? 'pr-3' : '';

    const textClass = isMobile ? 'text-h5' : 'text-subtitle';

    return (
        <div
            className={`group flex items-center justify-center w-fit py-1 px-4 ${boxPaddingClass} rounded-full border-[0.5px] border-dark-primary cursor-pointer hover:opacity-80 ${boxBgClass}`}
            onClick={onClick}
        >
            <p className={`flex items-center text-dark-primary ${textClass}`}>
                {summary}
                {endAdornment && (
                    <img src={endAdornment} alt="chevron" className="ml-2" />
                )}
            </p>
        </div>
    );
};

const FaqFilters = ({ areas, onFilterClick, activeFilterIndexes, isMobile }) => {

    const boxClass = isMobile ? 'gap-2' : 'gap-4 mb-10 md:mb-12 lg:mb-16';

    return (
        <div className={`flex flex-col md:flex-row flex-wrap ${boxClass}`}>
            {areas.map(({ summary }, index) => {
                const isActive = activeFilterIndexes.includes(index);
                const hasMultipleActiveItems = activeFilterIndexes.length > 1 ;

                if(isMobile && !isActive) return null;

                return (
                    <FilterBadge
                        key={index}
                        isMobile={isMobile}
                        isActive={isActive}
                        summary={summary}
                        onClick={() => onFilterClick(index)}
                        {...isMobile && hasMultipleActiveItems && { endAdornment: timesCircleIcon} }
                    />
                );
            })}
        </div>
    );
};

const AccordionContent = ({ challengeDescription, technologiesText, technologies, functionalitiesText, functionalities, solutionText, solutionDescription}) => {

    return (
        <div className="flex flex-col pt-6 pb-10 md:px-6 text-dark-medium">
            <p className="text-body mb-6 md:mb-10">{challengeDescription}</p>

            <div className="mb-6 md:mb-10">
                <p className="text-purple-accents text-subtitle mb-1">{functionalitiesText}</p>
                <ul className="ml-6">
                    {functionalities.map(({title, description}, index) => (
                            <li key={index} className="text-body text-dark-primary !list-disc">
                                <p className="text-body text-dark-medium">
                                    <span className="font-bold text-dark-primary mr-2">{title}</span>
                                    <span>
                                        <Trans
                                            i18nKey={description}
                                            components={{
                                                span: <span className="font-bold text-dark-primary" />
                                            }}
                                        />
                                    </span>
                                </p>
                            </li>
                        )
                    )}
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
                        {technologies.map(({title, description}, index) => (
                                <li key={index} className="text-body text-dark-primary !list-disc">
                                    <p className="text-body text-dark-medium">
                                        <span className="font-bold text-dark-primary mr-2">{title}</span>
                                        <span>{description}</span>
                                    </p>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>

        </div>
    )
}

const FaqList = ({ visibleFaqs, activeFaqIndex, onFaqClick }) => {
    return (
        <div>
            {visibleFaqs?.map(({ faqs }, areaIndex) =>
                faqs.map(({ question, answer }, faqIndex) => {

                    const accordionKey = `${areaIndex}-${faqIndex}`;
                    return (
                        <div key={accordionKey}>
                            <FaqsAccordion
                                question={question}
                                onClick={() => {
                                    onFaqClick(accordionKey);
                                }}
                                isOpen={activeFaqIndex === accordionKey}>
                                <AccordionContent {...answer} />
                            </FaqsAccordion>
                        </div>
                    );
                })
            )}
        </div>
    );
};

const ResetFiltersButton = ({ onClick, text }) => {
    return (
        <span role="button" className="text-button text-[#A0A09F] cursor-pointer hover:opacity-80" onClick={onClick}>
            {text}
        </span>
    );
};

const ImproveAreas = () => {
    const { t } = useTranslation();
    const {
        improveAreas: { title, areas, filtersText, filtersClearAllText, applyFiltersText },
    } = t("services_v2");

    const {
        visibleFaqs,
        activeFilterIndexes,
        toggleActiveFilterIndex,
        toggleFaqVisibility,
        activeFaqIndex,
        toggleActiveFaqIndex,
        applyFaqVisibilityFilter,
        resetFilters,
    } = useFaqVisibility(areas);

    const [dialogOpen, setDialogOpen] = useState(false);

    const hasMultipleFilters = activeFilterIndexes.length > 1;

    return (
        <>
            <div className="pt-14 lg:pt-40 pb-6 lg:pb-20">
                <div className="max-w-8xl mx-auto px-landing flex flex-col">
                    <div className="flex flex-row items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-bigTag uppercase text-purple-accents">{title}</h3>
                        {hasMultipleFilters && (
                            <div className="hidden md:block">
                                <ResetFiltersButton onClick={resetFilters} text={filtersClearAllText} />
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <FaqFilters
                            areas={areas}
                            onFilterClick={(index) => {
                                toggleFaqVisibility(index);
                                toggleActiveFilterIndex(index);
                            }}
                            activeFilterIndexes={activeFilterIndexes}
                        />
                    </div>
                    <div className="flex flex-col md:hidden items-start justify-between w-full self-start mb-10">
                        <div className="flex flex-row md:hidden items-center justify-between w-full self-start mb-4">
                            <FilterBadge summary={filtersText} endAdornment={chevronDownIcon} onClick={() => setDialogOpen(true)} />

                            {hasMultipleFilters && <ResetFiltersButton onClick={resetFilters} text={filtersClearAllText} />}
                        </div>
                        <FaqFilters
                            isMobile
                            areas={areas}
                            onFilterClick={(index) => {
                                toggleFaqVisibility(index);
                                toggleActiveFilterIndex(index);
                            }}
                            activeFilterIndexes={activeFilterIndexes}
                        />
                    </div>

                    <FaqList visibleFaqs={visibleFaqs} activeFaqIndex={activeFaqIndex} onFaqClick={toggleActiveFaqIndex} />
                </div>
            </div>
            {dialogOpen && (
                <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <div className="flex flex-col">
                        <p className="text-subtitle text-dark-primary mb-4">{filtersText}</p>
                        <div className="mb-20">
                            <FaqFilters
                                areas={areas}
                                onFilterClick={(index) => {
                                    toggleActiveFilterIndex(index);
                                }}
                                activeFilterIndexes={activeFilterIndexes}
                            />
                        </div>
                        <Button
                            text={applyFiltersText}
                            onClick={() => {
                                applyFaqVisibilityFilter();
                                setDialogOpen(false);
                            }}
                        />
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default ImproveAreas;
