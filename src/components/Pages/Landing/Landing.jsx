import Hero from "./Hero.jsx";
import UseCases from "./UseCases.jsx";
import useCasesBgGradient from '../../../assets/casos-de-uso-bg-gradient-1.svg';

import {useTranslation} from "react-i18next";
import SolutionsApplications from "./SolutionsApplications.jsx";
import ImproveAreas from "./ImproveAreas.jsx";
import HowWeWork from "./HowWeWork.jsx";
import DigitalProduct from "./DigitalProduct.jsx";

const Landing = () => {

    return (
        <>
            <Hero/>
            <section style={{
                backgroundImage: `url(${useCasesBgGradient}`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}>
                <UseCases/>
                <ImproveAreas/>
            </section>
            <SolutionsApplications/>
            <HowWeWork/>
            <DigitalProduct/>
        </>
    )
}

export default Landing;
