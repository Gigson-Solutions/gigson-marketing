'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import '../../components/slider.css';

import { useState } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import iconBlockquote from '../../assets/usecases-blockquote-icon.svg';
import iconOne from '../../assets/use-cases-icon-1.svg';
import iconTwo from '../../assets/use-cases-icon-2.svg';
import iconThree from '../../assets/use-cases-icon-3.svg';
import iconFour from '../../assets/use-cases-icon-4.svg';
import { Button } from './Button';
import { ButtonIcon } from './ButtonIcon';
import Dialog from './Dialog';

const cardsIcons = [iconOne, iconTwo, iconThree, iconFour];
const getIconSrc = (img: { src: string } | string) => (typeof img === 'string' ? img : img.src);
const getCardNr = (index: number) => String(index).padStart(2, '0');

const Arrow = () => (
  <svg className="!block" width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5L1.76978 9.72701C1.35194 9.33239 1.35194 8.66761 1.76978 8.27299L10 0.499999" stroke="#868685" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Technology = { title: string; description: string };
type Functionality = { title: string; description: string };
type DialogData = {
  backButtonText: string;
  title: string;
  challengeDescription: string;
  quote?: string;
  technologiesText: string;
  technologies: Technology[];
  functionalitiesText: string;
  functionalities: Functionality[];
  solutionText: string;
  solutionDescription: string;
};

type CardData = {
  title: string;
  supTitle: string;
  description: string;
  buttonText: string;
  dialog: DialogData;
};

const TitleBox = ({ title, description }: { title: string; description: string }) => (
  <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-4 text-right">
    <p className="text-bigTag uppercase text-purple-accents">{title}</p>
    <p className="text-body text-dark-primary">{description}</p>
  </div>
);

const Card = ({
  title, logoSrc, isLastCard, supTitle, description, buttonText, dialog, onClickDialog,
}: CardData & { logoSrc: string; isLastCard: boolean; onClickDialog: (d: DialogData) => void }) => (
  <div className="h-full md:h-auto md:flex-1 flex flex-col gap-11 lg:last:col-span-2 bg-white rounded-lg p-6 lg:last:[&_h3]:min-h-[126px]">
    <img src={logoSrc} className="!block max-h-[141px] ml-auto" alt={`${title}-img`} />
    <span className="text-h4 text-[28px] min-h-[126px] text-dark-primary">{title}</span>
    <div className="flex flex-row flex-wrap items-start gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-2 justify-between mb-2">
          <p className="text-bigTag text-purple-accents">{supTitle}</p>
          {!isLastCard && <ButtonIcon onClick={() => onClickDialog(dialog)} />}
          {isLastCard && <Button text={buttonText} onClick={() => onClickDialog(dialog)} />}
        </div>
        <p className="text-body text-dark-medium">{description}</p>
      </div>
    </div>
  </div>
);

const DialogContent = ({
  backButtonText, title, challengeDescription, quote, technologiesText, technologies,
  functionalitiesText, functionalities, solutionText, solutionDescription, onClose,
}: DialogData & { onClose: () => void }) => (
  <div className="flex flex-col pt-6 pb-10 md:px-6 text-dark-primary">
    <div className="flex flex-col mb-6 md:mb-20">
      <div className="flex flex-row flex-wrap items-start justify-between gap-x-10 mb-6 md:mb-16">
        <p className="flex items-center gap-2 text-body text-dark-medium uppercase cursor-pointer hover:opacity-80" onClick={onClose}>
          <span><Arrow /></span>
          {backButtonText}
        </p>
        {!!quote && (
          <p className="hidden md:block max-w-[600px] text-purple-accents text-h3 text-right">
            <span className="inline-block mr-6"><img className="!block" src={getIconSrc(iconBlockquote)} alt="blockquote" /></span>
            <span>{quote}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-8/12 flex flex-col">
          <h4 className="flex-auto text-h3 text-dark-primary max-w-[600px] mb-6 md:mb-16">{title}</h4>
          <div>
            <p className="text-purple-accents text-subtitle uppercase mb-2">{challengeDescription}</p>
          </div>
        </div>
        <div className="flex-4/12 justify-self-end flex flex-col justify-end">
          <p className="text-purple-accents text-subtitle mb-1">{technologiesText}</p>
          <ul className="ml-6">
            {technologies.map(({ title, description }, index) => (
              <li key={index} className="text-body text-dark-primary !list-disc">
                <p className="text-body text-dark-medium">
                  <span className="font-bold text-dark-primary mr-2">{title}</span>
                  <span>{description}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="flex flex-col mb-6 md:mb-12">
      <p className="text-body text-purple-accents uppercase mb-6">{functionalitiesText}</p>
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4">
        {functionalities.map(({ title, description }, index) => (
          <div key={index} className="flex flex-col border-t pb-8">
            <span className="text-bigTag text-purple-accents">{getCardNr(index + 1)}</span>
            <h4 className="text-h4 text-dark-primary mb-6 md:min-h-[120px]">{title}</h4>
            <p className="hidden md:block text-body text-dark-medium">{description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-center md:gap-x-10 border-t-2 border-t-purple-accents pt-6 md:pt-10">
      <img src={getIconSrc(iconOne)} className="max-h-[141px] ml-auto" alt={`${title}-img`} />
      <div className="flex flex-col gap-4">
        <p className="text-subtitle text-purple-accents">{solutionText}</p>
        <p className="text-body text-dark-primary">{solutionDescription}</p>
      </div>
    </div>
  </div>
);

type Props = { cards: CardData[]; title: string; description: string };

const UseCases = ({ cards, title, description }: Props) => {
  const [showDialog, setShowDialog] = useState<DialogData | undefined>();

  return (
    <>
      <div className="px-landing pt-12 lg:pt-40 pb-14 lg:pb-0">
        <div className="max-w-[88.875rem] mx-auto hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
          <TitleBox title={title} description={description} />
          {cards?.map((cardProps, index) => (
            <Card
              key={index}
              {...cardProps}
              isLastCard={index === cards.length - 1}
              logoSrc={getIconSrc(cardsIcons[index] as { src: string } | string)}
              onClickDialog={setShowDialog}
            />
          ))}
        </div>

        <div className="md:hidden max-w-[88.875rem] mx-auto">
          <div className="mb-10">
            <TitleBox title={title} description={description} />
          </div>
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16} slidesPerView={1}>
            {cards?.map((cardProps, index) => (
              <SwiperSlide key={index}>
                <Card
                  {...cardProps}
                  isLastCard={false}
                  logoSrc={getIconSrc(cardsIcons[index] as { src: string } | string)}
                  onClickDialog={setShowDialog}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {showDialog && (
        <Dialog isOpen={!!showDialog} onClose={() => setShowDialog(undefined)} title={showDialog.title}>
          <DialogContent {...showDialog} onClose={() => setShowDialog(undefined)} />
        </Dialog>
      )}
    </>
  );
};

export default UseCases;
