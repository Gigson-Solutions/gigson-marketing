import { FloatingWhatsApp } from 'react-floating-whatsapp';
import avatar from '../../assets/avatar.jpg';
import { useTranslation } from 'react-i18next';

const WhatsappButton = () => {
    const { t } = useTranslation();
    const whatsappData = t('whatsapp');

    return (
      <FloatingWhatsApp
        allowClickAway
        avatar={avatar}
        {...whatsappData}
        style={{
          '.floating-whatsapp-button::after': {
            animation: 'none',
            boxShadow: 'none',
            content: ''
          }
        }}
      />
  );
};

export default WhatsappButton;