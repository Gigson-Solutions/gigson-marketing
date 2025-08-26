import { useState } from 'react';
import { Trans } from 'react-i18next';

import chevronDownIcon from '../../assets/chevron-down.svg';
import solutionsApplicationsBgGradient from '../../assets/solutions-applications-bg-gradients-1.svg';

import { useBreakpoint } from './hooks/useBreakpoint';

const getCardNr = (index) => String(index).padStart(2, '0');

const Card = ({ title, description, cardNr, className }) => {
  return (
    <div
      className={`hidden flex-1 md:flex flex-col border-t-[0.5px] border-t-dark-primary pb-4 md:pb-12 ${className}`}
    >
      <span className="text-bigTag text-purple-accents">{cardNr}</span>
      <h4 className="text-h4 text-dark-primary md:mb-6">{title}</h4>
      <p className="block text-body text-dark-medium">{description}</p>
    </div>
  );
};

const CardMobile = ({ title, description, cardNr, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`md:hidden flex-1 flex flex-col border-t-[0.5px] border-t-dark-primary pb-4 md:pb-12 ${className}`}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer flex"
      >
        <div className="flex flex-col gap-2 text-left">
          <span className="text-bigTag text-purple-accents">{cardNr}</span>
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-h4 text-dark-primary">{title}</h4>
            <img
              src={chevronDownIcon}
              alt="chevron down icon"
              className={`h-7 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </div>
          <p
            className={`${open ? 'block' : 'hidden'} text-body text-dark-medium`}
          >
            {description}
          </p>
        </div>
      </button>
    </div>
  );
};

const SolutionsApplications = ({ title, subTitle, containers }) => {
  const { isMobile } = useBreakpoint();

  return (
    <section
      className="py-10 lg:py-25"
      style={{
        backgroundImage: `url(${solutionsApplicationsBgGradient}`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-8xl mx-auto px-landing flex flex-col text-dark-primary">
        <div className="mb-6 lg:mb-10">
          <h2 className="text-h2 text-dark-primary mb-4">
            <Trans
              i18nKey={title}
              components={{
                span: <span className="text-purple-accents" />,
              }}
            />
          </h2>
          <p className="text-subtitle text-dark-primary">{subTitle}</p>
        </div>

        <div className="flex flex-col gap-y-10">
          {containers?.map(({ title, description, type, cards }, index) => {
            const isPairContainer = (index + 1) % 2 === 0;

            const initialTwoCards = cards.slice(0, 2);
            const remainingCards = cards.slice(2);

            const mainCardClass = isPairContainer
              ? 'md:order-last md:rounded-tr-4xl md:rounded-tl-lg lg:ml-14'
              : 'md:order-first md:rounded-tl-4xl md:rounded-tr-lg lg:mr-14';

            const cardNr = getCardNr(index + 1);

            return (
              <div key={index}>
                <div className="flex flex-col md:grid md:grid-cols-3 gap-6 mb-10">
                  <div
                    className={`bg-gradient-to-b from-[#7874F4] to-[#5E5BC6] text-white px-2 md:px-4 py-8 rounded-t-4xl rounded-b-lg mb-6 md:mb-0  ${mainCardClass}`}
                  >
                    <p className="text-smallTag uppercase">{type}</p>
                    <h3 className="text-h3 mb-4 md:mb-0">
                      {cardNr}. {title}
                    </h3>
                    <p className="md:hidden px-2 text-bigTag md:mt-10">
                      {description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-12 col-span-2">
                    <p className="hidden md:block text-bigTag md:mt-10">
                      {description}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6">
                      {initialTwoCards.map(({ title, description }, index) => {
                        const cardNr = getCardNr(index + 1);

                        return (
                          <div key={index}>
                            {isMobile ? (
                              <CardMobile
                                title={title}
                                description={description}
                                cardNr={cardNr}
                              />
                            ) : (
                              <Card
                                title={title}
                                description={description}
                                cardNr={cardNr}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className={`flex flex-col md:grid ${remainingCards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}  gap-6`}
                >
                  {remainingCards.map(({ title, description }, index) => {
                    const flexCardIndex = index + 3;
                    const cardNr = getCardNr(flexCardIndex);

                    const isLongCard =
                      flexCardIndex % 6 === 0 || remainingCards.length === 1;

                    return (
                      <Card
                        key={index}
                        title={title}
                        description={description}
                        cardNr={cardNr}
                        className={`${isLongCard ? 'col-span-3' : ''}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsApplications;
