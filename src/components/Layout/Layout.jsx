import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ScrollTop from '../../hooks/ScrollTop';
import CookieBanner from '../../CookieBanner'; 
import Whatsapp from '../../shared/ui/WhatssapButton';

const Layout = () => {
   return (
      <ScrollTop>
         <Navbar />
         <main>
            <Outlet />
         </main>
         <Footer />
         <CookieBanner /> {/* Incluimos el banner de cookies */}
         <Whatsapp />
      </ScrollTop>
   );
};

export default Layout;
// dda