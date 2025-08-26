import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { useTranslation } from 'react-i18next';

import avatar from '../../assets/avatar.jpg';

import './WhatsappButton.css';

const WhatsappButton = () => {
  const { t } = useTranslation();
  const whatsappData = t('whatsapp');

  return <FloatingWhatsApp allowClickAway avatar={avatar} {...whatsappData} />;
};

export default WhatsappButton;
