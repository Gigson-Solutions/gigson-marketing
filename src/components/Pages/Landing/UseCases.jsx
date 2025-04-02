import logoSmallCard from '../../../assets/casos-de-uso-img-1.svg';
import logoBigCard from '../../../assets/casos-de-uso-img-1-big.svg';
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

const buttonHref = '#';

const UseCases = ({title, description, cards}) => {

    return (
        <section className="py-30" style={ {
            backgroundImage: `url(${useCasesBgGradient}`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        } }>
                <div className="max-w-8xl mx-auto px-landing flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-6">
                    <div className="flex flex-col gap-4 text-right">
                        <h3 className="text-bigTag uppercase text-purple-accents">{title}</h3>
                        <p className="text-body text-dark-primary">{description}</p>
                    </div>

                    {cards?.map(({title, supTitle, description, buttonText}, index) => {

                        const isLastCard = index === cards.length - 1;

                        const logoSrc = isLastCard ? logoBigCard : logoSmallCard;

                        return (
                            <div key={index}
                                 className="flex flex-col gap-11 last:col-span-2 bg-white rounded-lg p-6 pb-14">
                                <img src={logoSrc} className="max-h-[141px] ml-auto" alt={`${title}-img`}/>
                                <h3 className="text-h4 flex-auto">{title}</h3>
                                <div className="flex flex-row flex-wrap items-end gap-8">
                                    <div className={`flex-1 ${isLastCard ? 'pr-20' : ''}`}>
                                        <div className="flex items-center gap-2 justify-between">
                                            <p className="text-bigTag text-purple-accents">{supTitle}</p>
                                            {!isLastCard && (
                                                <a href={buttonHref} className="bg-purple-accents rounded-full p-3">
                                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 9H12.001M12.001 1L17.7634 9L12.001 17"
                                                              stroke="white"
                                                              strokeWidth="2" strokeLinecap="round"
                                                              strokeLinejoin="round"/>
                                                    </svg>
                                                </a>)}
                                        </div>
                                        <p className="text-body text-dark-medium">{description}</p>
                                    </div>
                                    {isLastCard && (
                                        <a href={buttonHref}
                                           className="text-button text-white border bg-purple-accents rounded-full py-3 px-6 hover:opacity-80">
                                            {buttonText}
                                        </a>
                                    )
                                    }
                                </div>
                            </div>)

                    })}
                </div>
        </section>)
}

export default UseCases
