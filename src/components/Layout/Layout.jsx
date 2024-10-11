import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollTop from "../../hooks/ScrollTop";
import CookieBanner from "../../CookieBanner"; // Importamos el nuevo componente

const Layout = () => {
   return (
      <ScrollTop>
         <Navbar />
         <main>
            <Outlet />
         </main>
         <Footer />
         <CookieBanner /> {/* Incluimos el banner de cookies */}
      </ScrollTop>
   );
};

export default Layout;
// dda