import React from "react";

import Icon from "../../assets/WhatsApp.svg"

const WhatsappButton = () => {
    const phoneNumber = "34623783507"; 
    const message = "¡Hola! Quisiera más información."; 
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    return (
      <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-9000"
    >
      <img
        src={Icon}
        alt="WhatsApp"
        className="w-14 h-14 hover:scale-110 transition-transform duration-300"
      />
    </a>

    )



}

export default WhatsappButton