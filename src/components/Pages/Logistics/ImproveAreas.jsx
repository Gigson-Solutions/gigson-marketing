import {useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import Dialog from "../../../shared/ui/Dialog.jsx";
import { Button } from "../../../shared/ui/Button.jsx";
import {FaqsAccordion} from "../Faqs/FaqsAccordion/FaqsAccordion.jsx";
import chevronDownIcon from "../../../assets/chevron-down.svg";
import timesCircleIcon from "../../../assets/times-circle.svg";

const useFaqVisibility = (painPoints) => {
    const defaultPainPoints = painPoints.map((point) => point.type);

    const [initialChipsState, setInitialChipsState] = useState(true)
    const [selectedPainPoints, setSelectedPainPoints] = useState(defaultPainPoints);
    const [tempSelectedPainPoints, setTempSelectedPainPoints] = useState([]);

    const toggleChipsState = (type) => {

        if(initialChipsState) {
            setSelectedPainPoints([])
        }

        setSelectedPainPoints((prevSelected) => {

            if (prevSelected.includes(type)) {
                if(prevSelected.length === 1) {
                    setInitialChipsState(true);
                    return defaultPainPoints;
                }

                return prevSelected.filter((item) => item !== type);
            } else {
                return [...prevSelected, type];
            }
        });
    };

    const toggleTempChipsState = (type) => {

        setTempSelectedPainPoints((prevSelected) => {

            if (prevSelected.includes(type)) {
                if(prevSelected.length === 1) {
                    setInitialChipsState(true);
                    return defaultPainPoints;
                }

                return prevSelected.filter((item) => item !== type);
            } else {
                return [...prevSelected, type];
            }
        });
    };

    const resetFilters = () => {
        setInitialChipsState(true)
        setSelectedPainPoints(defaultPainPoints);
        setTempSelectedPainPoints([]);
    };

    return {
        tempSelectedPainPoints,
        selectedPainPoints,
        setSelectedPainPoints,
        toggleChipsState,
        toggleTempChipsState,
        initialChipsState,
        setInitialChipsState,
        resetFilters,
        defaultPainPoints
    };
};

const Chip = ({ isActive, isMobile, name, onClick, endAdornment }) => {

    const boxBgClass = isActive ? 'bg-purple-light-b' : '';

    const boxPaddingClass = endAdornment ? 'pr-3' : '';

    const textClass = isMobile ? 'text-h5' : 'text-subtitle';

    return (
        <div
            className={`group flex items-center justify-center w-fit py-1 px-4 ${boxPaddingClass} rounded-full border-[0.5px] border-dark-primary cursor-pointer hover:opacity-80 ${boxBgClass}`}
            onClick={onClick}
        >
            <p className={`flex items-center text-dark-primary ${textClass}`}>
                {name}
                {endAdornment && (
                    <img src={endAdornment} alt="chevron" className="ml-2" />
                )}
            </p>
        </div>
    );
};

const PainPointsChips = ({  painPoints, selectedPainPoints, initialChipState, onFilterClick, isMobile, isDialog }) => {

    const boxClass = isMobile ? 'gap-2' : 'gap-4 mb-10 md:mb-12 lg:mb-16';

    return (
        <div className={`flex flex-col md:flex-row flex-wrap ${boxClass}`}>
            {painPoints.map(({ type, name }, index) => {
                const isActive = (isDialog && selectedPainPoints.includes(type)) || (!isDialog && selectedPainPoints.includes(type) && !initialChipState);

                return (
                    <Chip
                        key={index}
                        isMobile={isMobile}
                        isActive={isActive}
                        name={name}
                        onClick={() => onFilterClick(type)}
                        {...isMobile &&  { endAdornment: timesCircleIcon} }
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

const FaqList = ({ faqs, selectedPainPoints,  activeFaqIndex, onFaqClick }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleItemClick = (index) => setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

    return (
        <div>
            {faqs.map(({ question, answer, types }, faqIndex) => {
                const isVisible = types.some(type => selectedPainPoints.includes(type));
                const boxClass = isVisible ? 'block' : 'hidden';

                return (
                    <div key={faqIndex} className={boxClass}>
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
        improveAreas: { title, painPoints, faqs, filtersText, filtersClearAllText, applyFiltersText },
    } = t("cases-logistics");

    const {
        tempSelectedPainPoints,
        selectedPainPoints,
        toggleTempChipsState,
        toggleChipsState,
        setSelectedPainPoints,
        initialChipsState,
        setInitialChipsState,
        resetFilters,
        defaultPainPoints
    } = useFaqVisibility(painPoints);

    const [dialogOpen, setDialogOpen] = useState(false);

    const hasMultipleFilters = selectedPainPoints.length > 0 &&  !initialChipsState;

    return (
        <>
            <div className="pt-14 lg:pt-40 pb-6 lg:pb-20">
                <div className="max-w-8xl mx-auto px-landing flex flex-col">
                    <div className="flex flex-row items-center justify-between mb-4 md:mb-6">
                        <span className="text-bigTag uppercase text-purple-accents">{title}</span>
                        {hasMultipleFilters && (
                            <div className="hidden md:block">
                                <ResetFiltersButton onClick={resetFilters} text={filtersClearAllText} />
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <PainPointsChips
                            initialChipState={initialChipsState}
                            selectedPainPoints={selectedPainPoints}
                            painPoints={painPoints}
                            onFilterClick={(type) => {
                                setInitialChipsState(false)
                                toggleChipsState(type);
                                toggleTempChipsState(type)
                            }}
                        />
                    </div>
                    <div className="flex flex-col md:hidden items-start justify-between w-full self-start mb-10">
                        <div className="flex flex-row md:hidden items-center justify-between w-full self-start mb-4">
                            <Chip name={filtersText} endAdornment={chevronDownIcon} onClick={() => setDialogOpen(true)} />

                            {hasMultipleFilters && <ResetFiltersButton onClick={resetFilters} text={filtersClearAllText} />}
                        </div>

                        <div className={`flex flex-col md:flex-row flex-wrap gap-2`}>
                            {painPoints.filter(({type}) => selectedPainPoints.includes(type)).map(({ type, name }, index) => {

                                if(initialChipsState) return null;

                                return (
                                    <Chip
                                        key={index}
                                        isMobile
                                        isActive
                                        name={name}
                                        onClick={() =>{
                                            if(selectedPainPoints.length === 1) {
                                                resetFilters()
                                                return;
                                            }
                                            toggleChipsState(type);
                                            toggleTempChipsState(type)
                                        }}
                                        endAdornment={timesCircleIcon}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <FaqList faqs={faqs} selectedPainPoints={selectedPainPoints} activeFaqIndex={null} onFaqClick={null} />
                </div>
            </div>
            {dialogOpen && (
                <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <div className="flex flex-col">
                        <p className="text-subtitle text-dark-primary mb-4">{filtersText}</p>
                        <div className="mb-20">
                            <PainPointsChips
                                isDialog
                                initialChipState={initialChipsState}
                                selectedPainPoints={tempSelectedPainPoints}
                                painPoints={painPoints}
                                onFilterClick={(type) => {
                                    toggleTempChipsState(type);
                                }}
                            />
                        </div>
                        <Button
                            text={applyFiltersText}
                            onClick={() => {
                                if(tempSelectedPainPoints.length === 0) {
                                    setSelectedPainPoints(defaultPainPoints)
                                    setInitialChipsState(true);
                                }else {
                                    setSelectedPainPoints(tempSelectedPainPoints)
                                    setInitialChipsState(false);
                                }

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
