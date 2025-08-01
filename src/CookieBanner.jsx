import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './CookieBanner.css'; // Añadimos estilos personalizados
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CookieBanner = () => {
   const [isVisible, setIsVisible] = useState(false);
   const { t } = useTranslation();
   const { h2, p, btnAccept, btnDenie, btnInfo } = t('cookiesBanner');
   const navigate = useNavigate();
   const handleClick = () => {
      navigate("/cookies");
   }
   
   

   useEffect(() => {
      // Verificar si el usuario ya ha aceptado o rechazado las cookies
      const cookieConsent = Cookies.get('cookieConsent');
      if (!cookieConsent) {
         setIsVisible(true);
      }
   }, []);

   const handleAccept = () => {
      // Establecer cookie de consentimiento con valor 'accepted'
      Cookies.set('cookieConsent', 'accepted', { expires: 365 });
      setIsVisible(false);
   };

   const handleReject = () => {
      // Establecer cookie de consentimiento con valor 'rejected'
      Cookies.set('cookieConsent', 'rejected', { expires: 365 });
      setIsVisible(false);
   };

   if (!isVisible) return null; // No renderizar el banner si no es visible

   return (
      <div className="cookie-banner">
         <p>{h2}</p>
         <p>{p}</p>
         <div className="cookie-buttons">
            <button onClick={handleAccept}>{btnAccept}</button>
            <button onClick={handleReject}>{btnDenie}</button>
            <button onClick={handleClick}>{btnInfo}</button>
         </div>
      </div>
   );
};

export default CookieBanner;
