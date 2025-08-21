import React from 'react';
import { Outlet } from 'react-router-dom';

import CookieBanner from '../../CookieBanner'; 
import ScrollTop from '../../hooks/ScrollTop';
import Whatsapp from '../../shared/ui/WhatssapButton';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

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