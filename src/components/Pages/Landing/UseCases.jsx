import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import logoSmallCard from '../../../assets/casos-de-uso-img-1.svg';
import logoBigCard from '../../../assets/casos-de-uso-img-1-big.svg';
import ButtonIconLink from "../../../shared/ui/ButtonIconLink.jsx";
import ButtonLink from "../../../shared/ui/ButtonLink.jsx";
import {useTranslation} from "react-i18next";

const buttonHref = '#';

const TitleBox = ({title, description}) => {
    return (
        <div className="md:flex-auto flex flex-col gap-4 text-right">
            <h3 className="text-bigTag uppercase text-purple-accents">{title}</h3>
            <p className="text-body text-dark-primary">{description}</p>
        </div>
    )
}

const Card = ({title, logoSrc, isLastCard, supTitle, description, buttonText, buttonHref}) => {

    return (
        <div
            className="md:flex-1 flex flex-col gap-11 last:col-span-2 bg-white rounded-lg p-6 pb-14">
            <img src={logoSrc} className="max-h-[141px] ml-auto" alt={`${title}-img`}/>
            <h3 className="text-h4 flex-auto">{title}</h3>
            <div className="flex flex-row flex-wrap items-end gap-8">
                <div className={`flex-1 ${isLastCard ? 'pr-20' : ''}`}>
                    <div className="flex items-center gap-2 justify-between">
                        <p className="text-bigTag text-purple-accents">{supTitle}</p>
                        {!isLastCard && (
                            <ButtonIconLink href={buttonHref}/>
                        )}
                    </div>
                    <p className="text-body text-dark-medium">{description}</p>
                </div>
                {isLastCard && (
                    <ButtonLink link={buttonHref} text={buttonText}/>
                )
                }
            </div>
        </div>
    )
}

const UseCases = () => {

    const {t} = useTranslation();
    const {
        useCases: {cards, title, description},
    } = t("services_v2");

    return (
        <div className="pt-30 pb-0 md:py-30">
            <div
                className="max-w-8xl mx-auto px-landing hidden md:flex flex-col flex-wrap md:flex-row lg:grid md:grid-cols-3 gap-x-4 gap-y-6">
                <TitleBox title={title} description={description}/>

                {cards?.map(({title, supTitle, description, buttonText}, index) => {

                    const isLastCard = index === cards.length - 1;

                    const logoSrc = isLastCard ? logoBigCard : logoSmallCard;

                    return (
                        <Card key={index} isLastCard={isLastCard} description={description} buttonText={buttonText}
                              title={title} buttonHref={buttonHref} logoSrc={logoSrc} supTitle={supTitle}/>
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
                    {cards?.map(({title, supTitle, description, buttonText}, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <Card isLastCard={false} description={description} buttonText={buttonText}
                                      title={title} buttonHref={buttonHref} logoSrc={logoSmallCard}
                                      supTitle={supTitle}/>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    )
}

export default UseCases
