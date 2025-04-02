import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

const getCardNr = (index) => String(index).padStart(2, '0');

const Card = ({title, description, cardNr, className}) => {
    return (
        <div className={`flex flex-col border-t pb-8 ${className}`}>
            <span className="text-bigTag text-purple-accents">{cardNr}</span>
            <h4 className="text-h4 text-dark-primary mb-14">{title}</h4>
            <p className="text-body text-dark-medium">{description}</p>
        </div>
    )
}

const SolutionsApplications = ({containers, titleDark, titleColored, subTitle}) => {

    return (
        <section className="py-30" style={{
            backgroundImage: `url(${useCasesBgGradient}`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        } }>
            <div className="max-w-8xl mx-auto px-landing flex flex-col">
                <div className="mb-15 max-w-[800px]">
                    <h3 className="text-h2">
                        <span className="text-purple-accents">{titleDark} </span>
                        <span>{titleColored}</span>
                    </h3>
                    <p className="text-subtitle text-dark-primary">{subTitle}</p>
                </div>

                {containers?.map(({title, description, type, cards}, index) => {

                    const isPairContainer = (index + 1) % 2 === 0;

                    const initialTwoCards = cards.slice(0, 2);
                    const remainingCards = cards.slice(2);

                    const mainCardOrder = isPairContainer ? 'md:order-last' : 'md:order-first';

                    const cardNr = getCardNr(index + 1)

                    return (
                            <div key={index}>
                                <div className="flex flex-col md:flex-row gap-10 mb-10">
                                    <div className={`flex-3 rounded-[8px] bg-gradient-to-b from-[#6180D6] to-[#5F60D6] text-white px-4 py-8 ${mainCardOrder}`}>
                                        <p className="text-smallTag">{type}</p>
                                        <p className="text-h3">{cardNr}. {title}</p>
                                    </div>
                                    <div className="flex flex-col gap-12 flex-8">
                                        <p className="text-body1">{description}</p>
                                        <div className="flex flex-col md:flex-row gap-8">
                                            {initialTwoCards.map(({title, description}, index) => {
                                                const cardNr = getCardNr(index + 1);

                                                return (
                                                    <Card key={index} title={title} description={description} cardNr={cardNr} />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
                                    {remainingCards.map(({title, description}, index) => {
                                        const flexCardIndex = index + 3;
                                        const cardNr = getCardNr(flexCardIndex)

                                        const isLongCard = flexCardIndex % 6 === 0;

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
                        )

                    })}
            </div>
        </section>)
}

export default SolutionsApplications
