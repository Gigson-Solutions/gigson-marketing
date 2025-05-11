import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import imgOne from '../../../assets/digital-product-img-1.png';
import imgTwo from '../../../assets/digital-product-img-2.png';
import imgThree from '../../../assets/digital-product-img-3.png';

import {ButtonIconLink} from "../../../shared/ui/ButtonIcon.jsx";
import {ButtonLink} from "../../../shared/ui/Button.jsx";
import {Trans, useTranslation} from "react-i18next";

const buttonLink = '/contact';

const cardsAttributes = [
    { imgSrc: imgOne },
    { imgSrc: imgTwo },
    { imgSrc: imgThree }
]


const Card = ({title, imgSrc, description}) => {
    return (<div className="h-full md:h-auto md:flex-1 flex flex-col gap-6 h-hull bg-purple-light-a rounded-lg p-4">
        <div className="flex flex-wrap lg:flex-nowrap items-end justify-between gap-4 lg:gap-x-20">
            <div className="w-full lg:w-auto">
                <img src={imgSrc}
                     className="!block max-h-[89px] max-w-[89px] lg:max-h-[120px] lg:max-w-[120px] object-contain opacity-40"
                     alt={`${title}-img`}/>
            </div>
            <h3 className="text-h5 text-purple-accents">{title}</h3>
        </div>
        <p className="text-body text-[#737272]">{description}</p>
    </div>)
}


const DigitalProduct = () => {

    const {t} = useTranslation();
    const {
        digitalProduct: {
            title, buttonText, description, cards
        },
    } = t("cases-logistics");

    return (<section className="py-14 lg:py-40">
        <div
            className="max-w-8xl mx-auto px-landing">
            <div className="mb-15 flex items-baseline flex-col md:flex-row flex-wrap gap-6">
                <h3 className="max-w-[800px] text-h2 text-dark-primary md:order-1 md:mr-auto">
                    <Trans
                        i18nKey={title}
                        components={{
                            span: <span className="text-purple-accents"/>
                        }}
                    />
                </h3>
                <p className="text-subtitle text-dark-primary md:order-3">{description}</p>
                <ButtonLink link={buttonLink} className="md:order-2" text={buttonText} outlined/>
            </div>
            <div className="hidden md:flex flex-row flex-wrap gap-x-4 gap-y-6">
                {cards?.map(({title, description}, index) => {

                    const { imgSrc} = cardsAttributes[index];

                    return (<Card key={index} title={title} description={description} imgSrc={imgSrc}/>)

                })}
            </div>
            <div className="md:hidden">
                <Swiper
                    modules={[Pagination]}
                    pagination={{clickable: true}}
                    slidesPerView={1}
                >
                    {cards?.map(({title, supTitle, description, buttonText}, index) => {
                        const {imgSrc} = cardsAttributes[index];

                        return (
                            <SwiperSlide key={index}>
                                <Card key={index} title={title} description={description} imgSrc={imgSrc}/>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    </section>)
}

export default DigitalProduct
