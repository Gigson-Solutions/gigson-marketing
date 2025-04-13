import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import iconOne from '../../../assets/use-cases-icon-1.svg';
import iconTwo from '../../../assets/use-cases-icon-2.svg';
import iconThree from '../../../assets/use-cases-icon-3.svg';
import iconFour from '../../../assets/use-cases-icon-4.svg';

import {ButtonIcon} from "../../../shared/ui/ButtonIcon.jsx";
import {Button} from "../../../shared/ui/Button.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import Dialog from "../../../shared/ui/Dialog.jsx";

const cardsIcons = [iconOne, iconTwo, iconThree, iconFour];

const getCardNr = (index) => String(index).padStart(2, '0');

const Arrow = () => {
    return (
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.5L1.76978 9.72701C1.35194 9.33239 1.35194 8.66761 1.76978 8.27299L10 0.499999" stroke="#868685" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    )
}

const TitleBox = ({title, description}) => {
    return (
        <div className="md:flex-auto flex flex-col gap-4 text-right">
            <h3 className="text-bigTag uppercase text-purple-accents">{title}</h3>
            <p className="text-body text-dark-primary">{description}</p>
        </div>
    )
}

const Card = ({title, logoSrc, isLastCard, supTitle, description, buttonText, dialog, onClickDialog}) => {

    const dialogHandleClick = () =>{
        onClickDialog(dialog)
    }

    return (
        <div
            className="md:flex-1 flex flex-col gap-11 last:col-span-2 bg-white rounded-lg p-6 pb-14">
            <img src={logoSrc} className="max-h-[141px] ml-auto" alt={`${title}-img`}/>
            <h3 className="text-h4 flex-auto">{title}</h3>
            <div className="flex flex-row flex-wrap items-end gap-8">
                <div className={`flex-1 ${isLastCard ? 'pr-20' : ''}`}>
                    <div className="flex items-center gap-2 justify-between">
                        <p className="text-bigTag text-purple-accents">{supTitle}</p>
                        {!isLastCard && <ButtonIcon onClick={dialogHandleClick}/>}
                    </div>
                    <p className="text-body text-dark-medium">{description}</p>
                </div>
                {isLastCard && <Button text={buttonText} onClick={dialogHandleClick}/>}
            </div>
        </div>
    )
}


const DialogContent = ({backButtonText, title, subtitle, description, quote, cardsBoxTitle, cards, footerTitle, footerDescription, onClose}) => {

    return (
        <div className="flex flex-col pt-6 pb-10 md:px-6">
            <div className="flex flex-col mb-6 md:mb-20">
                <div className="md:flex md:flex-row md:gap-x-10 mb-6 md:mb-15">
                    <div className="flex flex-col">
                        <p className="flex items-center gap-2 text-body text-dark-medium uppercase cursor-pointer hover:opacity-80 mb-6 md:mb-15" onClick={onClose}>
                            <span><Arrow /></span>
                            {backButtonText}
                        </p>
                        <h4 className="text-h3 text-dark-primary">{title}</h4>
                    </div>
                    <p className="hidden lg:block text-purple-accents text-[48px] leading-[50px] text-right">
                        {quote}
                    </p>
                </div>
                <p className="text-purple-accents text-subtitle uppercase">{subtitle}</p>
                <p className="text-body text-dark-primary">{description}</p>
            </div>

            <div className="flex flex-col mb-6 md:mb-12">
                <p className="text-body text-purple-accents uppercase mb-6">{cardsBoxTitle}</p>
                <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4">
                    {cards.map(({title, description}, index) => {
                        const cardNr = getCardNr(index + 1);

                        return (
                            <div className="flex flex-col border-t pb-8">
                                <span className="text-bigTag text-purple-accents">{cardNr}</span>
                                <h4 className="text-h4 text-dark-primary mb-6">{title}</h4>
                                <p className="hidden md:block text-body text-dark-medium">{description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center md:gap-x-10 border-t-2 border-t-purple-accents pt-6 md:pt-10">
                <img src={iconOne} className="max-h-[141px] ml-auto" alt={`${title}-img`}/>
                <div className="flex flex-col gap-4">
                    <p className="text-subtitle text-purple-accents">{footerTitle}</p>
                    <p className="text-body text-dark-primary">{footerDescription}</p>
                </div>
            </div>

        </div>
    )
}

const UseCases = () => {

    const {t} = useTranslation();
    const {
        useCases: {cards, title, description},
    } = t("services_v2");

    const [showDialog, setShowDialog] = useState(null);

    const handleOnCloseDialog = () => setShowDialog(null);

    useEffect(() => {
        if (showDialog) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [showDialog]);

    return (
            <>
                <div className="pt-30 pb-0 md:py-30">
                    <div
                        className="max-w-8xl mx-auto px-landing hidden md:flex flex-col flex-wrap md:flex-row lg:grid md:grid-cols-3 gap-x-4 gap-y-6">
                        <TitleBox title={title} description={description}/>

                        {cards?.map((cardProps, index) => {

                            const isLastCard = index === cards.length - 1;

                            const logoSrc = cardsIcons[index];

                            return (
                                <Card key={index} {...cardProps} isLastCard={isLastCard} logoSrc={logoSrc} onClickDialog={setShowDialog} />
                            )

                        })}
                    </div>

                    <div className="md:hidden max-w-8xl mx-auto px-landing">
                        <div className="mb-10">
                            <TitleBox title={title} description={description}/>
                        </div>
                        <Swiper
                            modules={[Pagination]}
                            pagination={{clickable: true}}
                            spaceBetween={16}
                            slidesPerView={1}
                        >
                            {cards?.map((cardProps, index) => {
                                const logoSrc = cardsIcons[index];
                                return (
                                    <SwiperSlide key={index}>
                                        <Card {...cardProps} isLastCard={false} logoSrc={logoSrc} onClickDialog={setShowDialog}/>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                </div>
                { showDialog && (
                    <Dialog
                        isOpen={showDialog}
                        onClose={handleOnCloseDialog}
                        title={showDialog.title}
                    >
                        <DialogContent {...showDialog} onClose={handleOnCloseDialog} />
                    </Dialog>
                )}
            </>
    )
}

export default UseCases
