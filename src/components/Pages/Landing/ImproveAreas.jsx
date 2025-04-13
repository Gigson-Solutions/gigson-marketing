import { useState } from "react";
import { FaqsAccordion } from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";
import { useTranslation } from "react-i18next";


const useFaqVisibility = (areas) => {
    const [visibleFaqs, setVisibleFaqs] = useState([areas[0]]);
    const [activeIndex, setActiveIndex] = useState(null);

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

        setActiveIndex(null);
    };

    const toggleActiveIndex = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return { visibleFaqs, activeIndex, toggleFaqVisibility, toggleActiveIndex };
};


const FaqFilters = ({ areas, onFilterClick, activeIndex }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    console.log(activeIndex)
    return (
        <div className="flex flex-row flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
            {areas.map(({ summary }, index) => (
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
                            {hoveredIndex === index ? (
                                <span id="remove-faq">
                                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.8 6.2L6.2 9.8M6.2 6.2L9.8 9.8M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#3C3C3B" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            ) : activeIndex === index ? (
                                <span id="arrow-down">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9L12 15L18 9" stroke="#3C3C3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            ) : null}
                        </div>
                    </p>
                </div>
            ))}
        </div>
    );
};

const FaqList = ({ visibleFaqs, activeIndex, onFaqClick }) => {
    return (
        <div>
            {visibleFaqs.map(({ faqs }, areaIndex) =>
                faqs.map(({ question, answer }, faqIndex) => (
                    <div key={`${areaIndex}-${faqIndex}`}>
                        <FaqsAccordion
                            answer={answer}
                            question={question}
                            onClick={() => onFaqClick(areaIndex)}
                            isOpen={activeIndex === areaIndex}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

const ImproveAreas = () => {
    const { t } = useTranslation();
    const {
        improveAreas: { title, areas },
    } = t("services_v2");

    const { visibleFaqs, activeIndex, toggleFaqVisibility, toggleActiveIndex } = useFaqVisibility(areas);

    return (
        <div className="py-30">
            <div className="max-w-8xl mx-auto px-landing flex flex-col">
                <h3 className="text-bigTag uppercase text-purple-accents mb-4 md:mb-6">{title}</h3>
                <FaqFilters areas={areas} onFilterClick={toggleFaqVisibility} activeIndex={activeIndex} />
                <FaqList visibleFaqs={visibleFaqs} activeIndex={activeIndex} onFaqClick={toggleActiveIndex} />
            </div>
        </div>
    );
};

export default ImproveAreas;
