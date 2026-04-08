import './WhatsappButton.css';

import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { useTranslation } from 'react-i18next';

const WhatsappButton = () => {
  const { t } = useTranslation();
  const whatsappData = t('whatsapp');

  return <FloatingWhatsApp allowClickAway avatar="/img/alfonso.jpg" {...whatsappData} />;
};

export default WhatsappButton;
