import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import avatar from "../../assets/avatar.webp"
import { useTranslation } from 'react-i18next';


const WhatsappButton = () => { 
    const { t } = useTranslation();
     
    const Number = "623783507"; 
    const message = "¡Hola! Quisiera más información."; 
    const {number , accountName, placeholder, statusmessage, chatMessage} = t("whatsapp");
    
    return (
       <FloatingWhatsApp allowClickAway = "true"
                         avatar = {avatar}
                         number = {number}
                         accountName = {accountName}
                         placeholder = {placeholder}
                         statusMessage= {statusmessage}
                         chatMessage= {chatMessage} />

    )



}

export default WhatsappButton