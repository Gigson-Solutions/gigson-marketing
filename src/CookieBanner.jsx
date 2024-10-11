import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './CookieBanner.css'; // Añadimos estilos personalizados

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

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
      <h2>TAMBIÉN TENEMOS COOKIES</h2>
      <p>
        Utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarte publicidad relacionada con tus preferencias en base a un perfil elaborado a partir de tus hábitos de navegación (por ejemplo, páginas visitadas). Puedes aceptarlas o rechazarlas en los siguientes botones.
      </p>
      <div className="cookie-buttons">
        <button onClick={handleAccept}>ACEPTAR</button>
        <button onClick={handleReject}>RECHAZAR</button>
      </div>
    </div>
  );
};

export default CookieBanner;
