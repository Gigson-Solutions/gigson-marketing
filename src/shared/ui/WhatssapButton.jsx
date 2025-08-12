import { FloatingWhatsApp } from 'react-floating-whatsapp';
import avatar from '../../assets/avatar.jpg';
import { useTranslation } from 'react-i18next';

const WhatsappButton = () => {
    const { t } = useTranslation();
    const whatsappData = t('whatsapp');

    return (
    <>
      <style>{`
        
        .floating-whatsapp-button::after {
          animation: none !important;
          box-shadow: none !important;
          content: '' !important; 
        }
      `}</style>

      <FloatingWhatsApp
        allowClickAway
        avatar={avatar}
        {...whatsappData}
       
      />
    </>
  );
};

export default WhatsappButton;