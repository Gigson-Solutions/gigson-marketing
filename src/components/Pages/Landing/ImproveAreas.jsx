import { useState } from "react";
import { FaqsAccordion } from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";
import { useTranslation } from "react-i18next";

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
                if (visibleFaqs.length === 1 && visibleFaqs[0].summary === areas[index].summary) {
                    return prevIndexes;
                }
                return prevIndexes.filter((i) => i !== index);
            } else {
                return [...prevIndexes, index];
            }
        });
    };

    const toggleActiveFaqIndex = (index) => setActiveFaqIndex((prevIndex) => (prevIndex === index ? null : index));

    return { visibleFaqs, activeFilterIndexes, toggleFaqVisibility, toggleActiveFilterIndex, activeFaqIndex, toggleActiveFaqIndex };
};


const FaqFilters = ({ areas, onFilterClick, activeFilterIndexes }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="flex flex-row flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
            {areas.map(({ summary }, index) => {
                
                const isActive = activeFilterIndexes.includes(index);
                const isHovered = hoveredIndex === index;

                return (
                    <div
                        key={index}
                        className="flex items-center justify-center py-1 px-4 pr-3 rounded-full border cursor-pointer hover:opacity-80"
                        onClick={() => onFilterClick(index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <p className="flex items-center text-subtitle text-dark-primary">
                            {summary}
                            <div className="w-[24px] h-[24px] flex items-center justify-center ml-2">
                                {isActive && isHovered ? (
                                    <span id="remove-faq">
                                        <svg width="24" height="24" viewBox="0 0 16 16" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.8 6.2L6.2 9.8M6.2 6.2L9.8 9.8M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                                                stroke="#3C3C3B" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                ) : isActive ? (
                                    <span id="arrow-down">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="#3C3C3B" strokeWidth="1.5"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                ) : null}
                            </div>
                        </p>
                    </div>
                );
            })}
        </div>
    );
};


const FaqList = ({ visibleFaqs, activeFaqIndex, onFaqClick }) => {
    return (
        <div>
            {visibleFaqs.map(({ faqs }, areaIndex) =>
                faqs.map(({ question, answer }, faqIndex) => {
                    const accordionKey = `${areaIndex}-${faqIndex}`;
                    return (
                        <div key={accordionKey}>
                            <FaqsAccordion
                                answer={answer}
                                question={question}
                                onClick={() => {
                                    console.log("clicked", activeFaqIndex);
                                    onFaqClick(accordionKey)
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

const ImproveAreas = () => {
    const { t } = useTranslation();
    const {
        improveAreas: { title, areas },
    } = t("services_v2");

    const { visibleFaqs, activeFilterIndexes, toggleActiveFilterIndex, toggleFaqVisibility,  activeFaqIndex, toggleActiveFaqIndex } = useFaqVisibility(areas);

    return (
        <div className="py-30">
            <div className="max-w-8xl mx-auto px-landing flex flex-col">
                <h3 className="text-bigTag uppercase text-purple-accents mb-4 md:mb-6">{title}</h3>
                <FaqFilters areas={areas} onFilterClick={(index) => {
                    toggleFaqVisibility(index);
                    toggleActiveFilterIndex(index)
                }} activeFilterIndexes={activeFilterIndexes} onFilterCick={toggleActiveFilterIndex} />
                <FaqList visibleFaqs={visibleFaqs} activeFaqIndex={activeFaqIndex} onFaqClick={toggleActiveFaqIndex} />
            </div>
        </div>
    );
};

export default ImproveAreas;
