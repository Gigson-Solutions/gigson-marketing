'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import imgOne from '../../assets/digital-product-img-1.png';
import imgTwo from '../../assets/digital-product-img-2.png';
import imgThree from '../../assets/digital-product-img-3.png';
import { ButtonLink } from './Button';
import { RichText } from './RichText';

const buttonLink = '/contact';

const cardsAttributes = [
  { imgSrc: imgOne },
  { imgSrc: imgTwo },
  { imgSrc: imgThree },
];

const getCardNr = (index: number) => String(index).padStart(2, '0');

type CardData = { title: string; description: string };

const Card = ({ title, imgSrc, description, cardNr }: CardData & { imgSrc: string; cardNr: string }) => (
  <div className="h-full md:h-auto md:flex-1 flex flex-col gap-6 bg-purple-light-a rounded-lg p-4">
    <p className="text-bigTag text-purple-accents mb-10">{cardNr}</p>
    <div className="flex flex-col gap-4 lg:gap-x-20">
      <div className="w-full lg:w-auto">
        <img
          src={imgSrc}
          className="!block max-h-[89px] max-w-[89px] lg:max-h-[120px] lg:max-w-[120px] object-contain opacity-40"
          alt={title}
        />
      </div>
      <p className="flex items-center text-h4 text-dark-primary min-h-[72px]">{title}</p>
    </div>
    <p className="text-body text-dark-medium">{description}</p>
  </div>
);

type DigitalProductProps = {
  title: string;
  buttonText: string;
  description: string;
  cards: CardData[];
};

const DigitalProduct = ({ title, buttonText, description, cards }: DigitalProductProps) => {
  const getImgSrc = (img: { src: string } | string) =>
    typeof img === 'string' ? img : img.src;

  return (
    <section className="px-landing py-14 lg:py-40">
      <div className="max-w-[88.875rem] mx-auto">
        <div className="mb-15 flex items-baseline flex-col md:flex-row flex-wrap gap-6">
          <RichText
            as="p"
            content={title}
            className="max-w-[800px] text-h2 text-dark-primary md:order-1 md:mr-auto"
          />
          <p className="text-subtitle text-dark-primary md:order-3">{description}</p>
          <ButtonLink link={buttonLink} className="md:order-2" text={buttonText} outlined />
        </div>
        <div className="hidden md:flex flex-row flex-wrap gap-x-4 gap-y-6">
          {cards?.map(({ title: t, description: d }, index) => (
            <Card
              key={index}
              title={t}
              description={d}
              imgSrc={getImgSrc(cardsAttributes[index]?.imgSrc ?? '')}
              cardNr={getCardNr(index + 1)}
            />
          ))}
        </div>
        <div className="md:hidden">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={1}>
            {cards?.map(({ title: t, description: d }, index) => (
              <SwiperSlide key={index}>
                <Card
                  title={t}
                  description={d}
                  imgSrc={getImgSrc(cardsAttributes[index]?.imgSrc ?? '')}
                  cardNr={getCardNr(index + 1)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default DigitalProduct;
