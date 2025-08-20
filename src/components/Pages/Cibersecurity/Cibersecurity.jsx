import Hero from 'shared/Hero.jsx';

import SolutionsApplications from 'shared/SolutionsApplications.jsx';
import HowWeWork from 'shared/HowWeWork.jsx';
import DigitalProduct from 'shared/DigitalProduct.jsx';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Brand from 'shared/Brand.jsx';

const Cibersecurity = () => {
    const { t } = useTranslation();
    const { title, metadescription, hero, solutionsApplications, howWeWork, digitalProduct } = t('cibersecurity');
    
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

export default Cibersecurity;