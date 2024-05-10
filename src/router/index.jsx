import AboutHero from "../components/About/AboutHero"
import Cases from "../components/Pages/Cases"
import { createBrowserRouter } from "react-router-dom"
import Contact from "../components/Pages/Contact"
import Faqs from "../components/Pages/Faqs"
import Home from "../components/Home/Home"
import Layout from "../components/Layout/Layout"
import Services from "../components/Services/Services"
import '../App.css'
import NotFound from "../components/Pages/NotFound"

export const router = createBrowserRouter([
   {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: 'about',
            element: <AboutHero />,
        },
        {
            path: 'services',
            element: <Services />,
        },
        {
            path: 'cases',
            element: <Cases />,
        },
        {
            path: 'faqs',
            element: <Faqs />,
        },
        {
            path: 'contact',
            element: <Contact />,
        },
    ]}
])