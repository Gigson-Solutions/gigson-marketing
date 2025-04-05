import {useState} from "react";
import {FaqsAccordion} from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";

const ImproveAreas = ({title, areas}) => {
    const [faqsIndex, setFaqsIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClickFilter = (index) => {
        setFaqsIndex(index);
        setActiveIndex(null);
    }

    const visibleFaqs = areas[faqsIndex].faqs;

    const handleClickFaqItem = (index) => setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

    return (
        <div className="py-30">
            <div className="max-w-8xl mx-auto px-landing flex flex-col">
                <h3 className="text-bigTag uppercase text-purple-accents mb-4 md:mb-6">
                    {title}
                </h3>

                <div className="flex flex-row flex-wrap gap-4 mb-10 md:mb-12 lg:mb-16">
                    {areas.map(({summary}, index) => {
                        return (
                            <div key={index}
                                 className="flex items-center justify-center py-1 px-4 rounded-full border cursor-pointer hover:opacity-80"
                                 onClick={() => handleClickFilter(index)}>
                                <p className="text-subtitle text-dark-primary">
                                    {summary}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <div>
                    {visibleFaqs.map(({question, answer}, index) => {
                        return (
                            <div key={index}>
                                <FaqsAccordion answer={answer} question={question} onClick={() => handleClickFaqItem(index)}
                                               isOpen={activeIndex === index}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>)
}

export default ImproveAreas
