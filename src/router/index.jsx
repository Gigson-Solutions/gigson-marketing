import Layout from "../components/Layout/Layout";
import Home from "../components/Home/Home";
import AboutHero from "../components/About/AboutHero";
import Services from "../components/Services/Services";
import Cases from "../components/Pages/Cases/Cases";
import Faqs from "../components/Pages/Faqs/Faqs";
import Contact from "../components/Pages/Contact";
import CasesLogistics from "../components/Pages/Cases-logistics/Logistics";
import NotFound from "../components/Pages/NotFound/NotFound";
import Policity from "../components/Pages/Policity";
import CookiesPage from "../components/Pages/CookiesPage";

import {createBrowserRouter, Outlet} from "react-router-dom";
import "../App.css";
import Notice from "../components/Pages/Notice";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Layout />, // Aquí ya se utiliza Layout
      errorElement: <NotFound />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "services",
            element: <Services />,
         },
         {
            path: "cases",
            element: <Outlet />,
            children: [
               {
                  index: true,
                  element: <Cases />,
               },
               {
                  path: "logistics-technology",
                  element: <CasesLogistics />,
               }
            ]
         },
         {
            path: "about",
            element: <AboutHero />,
         },
         {
            path: "faqs",
            element: <Faqs />,
         },
         {
            path: "contact",
            element: <Contact />,
         },
         {
            path: "policy",
            element: <Policity />,
         },
         {
            path: "notice",
            element: <Notice />,
         },
         {
            path: "cookies",
            element: <CookiesPage />,
         },
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },
]);
