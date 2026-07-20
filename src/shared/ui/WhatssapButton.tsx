'use client';

import './WhatsappButton.css';

import { useTranslations } from 'next-intl';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

const WhatsappButton = () => {
  const t = useTranslations();
  const whatsappData = t.raw('whatsapp') as Record<string, unknown>;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <FloatingWhatsApp
      allowClickAway
      avatar="/img/jaume.jpg"
      phoneNumber={(whatsappData as any).phoneNumber ?? ''}
      accountName={(whatsappData as any).accountName ?? 'Gigson Solutions'}
      {...(whatsappData as any)}
    />
  );
};

export default WhatsappButton;
