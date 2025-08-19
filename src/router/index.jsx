import Layout from '../components/Layout/Layout';
import Home from '../components/Home/Home';
import AboutHero from '../components/About/AboutHero';
import Services from '../components/Services/Services';
import Cases from '../components/Pages/Cases/Cases';
import Faqs from '../components/Pages/Faqs/Faqs';
import Contact from '../components/Pages/Contact';
import Logistics from '../components/Pages/Logistics/Logistics';
import NotFound from '../components/Pages/NotFound/NotFound';
import Policity from '../components/Pages/Policity';
import CookiesPage from '../components/Pages/CookiesPage';
import CTO from '../components/Pages/CTO/CTO';
import ConsultoriaTec from '../components/Pages/ConsultoriaTec/ConsultoriaTec';
import Software from '../components/Pages/Software/Software';

import {Navigate, Outlet, createBrowserRouter} from 'react-router-dom';
import '../App.css';
import Notice from '../components/Pages/Notice';
import { DEFAULT_LANG, ROUTE_SLUGS } from './routerSlugs';

const generateRoutes = (lang) => {
  const slugs = ROUTE_SLUGS[lang];
  const langPrefix = lang === DEFAULT_LANG ? '' : `/${lang}`;

  return {
    path: langPrefix || '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: slugs.services, element: <Services /> },
      { path: slugs.logistics,element: <Logistics /> },
      { path: slugs.CTO,element: <CTO/> },
      {path: slugs.software, element: <Software/>},
      { path: slugs.ConsultoriaTec,element: <ConsultoriaTec/> },
      { path: slugs.cases, element: <Cases /> },
      { path: slugs.about, element: <AboutHero /> },
      { path: slugs.faqs, element: <Faqs /> },
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
