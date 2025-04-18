import logo from '../../../assets/FormasServices.png';
import {useTranslation} from "react-i18next";


const Method = ({ title, description, isInnerMethod, isFirstCard}) => {
    const boxClass = `${isInnerMethod ? 'flex lg:hidden border-dark-primary self-start' : 'border-white'} ${isFirstCard ? 'hidden lg:flex' : 'flex'}`;

    return (
        <div className={`${boxClass} flex-col border-b gap-y-10 px-4 py-10 md:p-4 md:pb-6`}>
            {isInnerMethod ? (
                <>
                    <h4 className="text-h4 text-purple-accents">{title}</h4>
                    <div className="flex items-start justify-between gap-x-10">
                        <p className="text-body text-purple-accents">{description}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <h4 className="text-h4 text-white">{title}</h4>
                    </div>
                    <p className="hidden lg:block text-body text-white">{description}</p>
                </>
            )}
        </div>
    )
}

const HowWeWork = () => {

    const {t} = useTranslation();
    const {
        howWeWork: {title, methods},
    } = t("services_v2");

    const firstMethod = methods.slice(0, 1);

    return (
        <section className="py-14 lg:py-40 bg-gradient-to-br from-[#6d6ff6] via-[#6d6ff6] to-[#e4e5ff]">
            <div className="max-w-8xl mx-auto px-landing flex flex-col">
                <h3 className="text-h2 text-white mb-6 md:mb-8 lg:mb-16">
                    {title}
                </h3>

                <div className="flex flex-col lg:flex-row flex-wrap gap-10">
                    <div className="bg-purple-light flex flex-col items-center justify-center flex-8 lg:order-2">
                        <div className="flex justify-center items-center w-full h-full p-6">
                            <img className="lg:max-w-[50%]" src={logo} alt="discover logo"/>
                        </div>

                        {firstMethod.map(({title, description}, index) => {
                            return (
                                <Method key={index} isInnerMethod title={title} description={description}/>
                            )
                        })}
                    </div>
                    <div className="flex flex-col gap-y-6 flex-4 md:order-1">
                        {methods.map(({title, description}, index) => {
                            const isFirstCard = index === 0;

                            return (
                                <Method key={index} title={title} description={description} isFirstCard={isFirstCard}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>)
}

export default HowWeWork
