import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "../../../shared/ui/Dialog.jsx";
import { Button } from "../../../shared/ui/Button.jsx";
import {FaqsAccordion} from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";

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

const FilterBadge = ({ isActive, summary, onClick }) => {

    return (
        <div
            className="group flex items-center justify-center w-fit py-1 px-4 pr-3 rounded-full border-[0.5px] border-dark-primary cursor-pointer hover:opacity-80"
            onClick={onClick}
        >
            <p className="flex items-center text-subtitle text-dark-primary">
                {summary}
                <div className="w-[24px] h-[24px] flex items-center justify-center ml-2">
                    {isActive ? (
                        <>
                            <span className="group-hover:hidden">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="#3C3C3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="hidden group-hover:block">
                                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.8 6.2L6.2 9.8M6.2 6.2L9.8 9.8M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#3C3C3B" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </>
                    ) : null}
                </div>
            </p>
        </div>
    );
};

const FaqFilters = ({ areas, onFilterClick, activeFilterIndexes }) => {

    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
            {areas.map(({ summary }, index) => {
                const isActive = activeFilterIndexes.includes(index);

                return (
                    <FilterBadge
                        key={index}
                        isActive={isActive}
                        summary={summary}
                        onClick={() => onFilterClick(index)}
                    />
                );
            })}
        </div>
    );
};

const FaqList = ({ visibleFaqs, activeFaqIndex, onFaqClick }) => {
    return (
        <div>
            {visibleFaqs?.map(({ faqs }, areaIndex) =>
                faqs.map(({ question, answer }, faqIndex) => {
                    const accordionKey = `${areaIndex}-${faqIndex}`;
                    return (
                        <div key={accordionKey}>
                            <FaqsAccordion
                                answer={answer}
                                question={question}
                                onClick={() => {
                                    onFaqClick(accordionKey);
                                }}
                                isOpen={activeFaqIndex === accordionKey}
                            />
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
            <div className="py-30">
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
                    <div className="flex flex-row md:hidden items-center justify-between w-full self-start mb-10">
                        <FilterBadge isActive={true} isHovered={false} summary={filtersText} onClick={() => setDialogOpen(true)} />
                        {hasMultipleFilters && <ResetFiltersButton onClick={resetFilters} text={filtersClearAllText} />}
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
