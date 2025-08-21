
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import Hero from 'shared/Hero.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import SolutionsApplications from 'shared/SolutionsApplications.jsx';


const Software = () => {
    const { t } = useTranslation();
    const { title, metadescription, hero, solutionsApplications, howWeWork, digitalProduct } = t('software');
    
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={metadescription} />
            </Helmet>
            <Hero {...hero}/>
            <SolutionsApplications {...solutionsApplications} />
            <HowWeWork {...howWeWork} />
            <DigitalProduct {...digitalProduct}/>
            <Brand />         
        </>
    );
};

export default Software;