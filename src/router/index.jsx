import '../App.css';

import { createBrowserRouter } from 'react-router-dom';

import AboutHero from '../components/About/AboutHero';
import Home from '../components/Home/Home';
import Layout from '../components/Layout/Layout';
import Cases from '../components/Pages/Cases/Cases';
import Cibersecurity from '../components/Pages/Cibersecurity/Cibersecurity';
import Construction from '../components/Pages/Construction/Construction';
import ConsultoriaTec from '../components/Pages/ConsultoriaTec/ConsultoriaTec';
import Book from '../components/Pages/Book/Book';
import Contact from '../components/Pages/Contact';
import CookiesPage from '../components/Pages/CookiesPage';
import CTO from '../components/Pages/CTO/CTO';
import Faqs from '../components/Pages/Faqs/Faqs';
import Integrations from '../components/Pages/Integrations/Integrations';
import Logistics from '../components/Pages/Logistics/Logistics';
import NotFound from '../components/Pages/NotFound/NotFound';
import Notice from '../components/Pages/Notice';
import Policity from '../components/Pages/Policity';
import Retail from '../components/Pages/Retail/Retail';
import Software from '../components/Pages/Software/Software';
import Services from '../components/Services/Services';
import { DEFAULT_LANG, ROUTE_SLUGS } from './routerSlugs';

/** En el subdominio integrations.* la home es la landing de integraciones Holded. */
function HomeOrIntegrationsLanding() {
  const isIntegrations =
    typeof window !== 'undefined' &&
    window.location.hostname === 'integrations.gigsonsolutions.com';
  return isIntegrations ? <Integrations /> : <Home />;
}

const generateRoutes = (lang) => {
  const slugs = ROUTE_SLUGS[lang];
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;

  return {
    path: langPrefix || '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeOrIntegrationsLanding /> },
      { path: slugs.services, element: <Services /> },
      { path: slugs.logistics, element: <Logistics /> },
      { path: slugs.integrations, element: <Integrations /> },
      { path: slugs.CTO, element: <CTO /> },
      { path: slugs.software, element: <Software /> },
      { path: slugs.ConsultoriaTec, element: <ConsultoriaTec /> },
      { path: slugs.cibersecurity, element: <Cibersecurity /> },
      { path: slugs.retail, element: <Retail /> },
      { path: slugs.construction, element: <Construction /> },
      { path: slugs.cases, element: <Cases /> },
      { path: slugs.about, element: <AboutHero /> },
      { path: slugs.faqs, element: <Faqs /> },
      { path: slugs.book, element: <Book /> },
      { path: slugs.contact, element: <Contact /> },
      { path: slugs.policy, element: <Policity /> },
      { path: slugs.notice, element: <Notice /> },
      { path: slugs.cookies, element: <CookiesPage /> },
      { path: '*', element: <NotFound /> },
    ],
  };
};

export const router = createBrowserRouter([
  generateRoutes('en'),
  generateRoutes('es'),
  { path: '*', element: <NotFound /> },
]);
