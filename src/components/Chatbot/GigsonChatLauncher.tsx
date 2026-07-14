'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';

import type { Locale } from '@/lib/gigson';

import './chatbot.css';
import { GigsonChatbotWidget } from './GigsonChatbotWidget';

/**
 * Floating launcher that toggles the Gigson chatbot panel. Sits bottom-right
 * (replacing the old FloatingWhatsApp button). The locale comes from next-intl
 * so the bot speaks the language the page is rendered in.
 */
const LAUNCHER_STRINGS: Record<Locale, { open: string; close: string }> = {
  es: { open: 'Abrir chat con Jaume', close: 'Cerrar chat' },
  en: { open: 'Open chat with Jaume', close: 'Close chat' },
};

export default function GigsonChatLauncher() {
  const activeLocale = useLocale();
  const locale: Locale = activeLocale === 'es' ? 'es' : 'en';
  const [open, setOpen] = useState(false);
  const t = LAUNCHER_STRINGS[locale];

  return (
    <div className="gcb-root">
      {open && (
        <div className="gcb-pop-in fixed bottom-24 right-4 z-[1000] w-[calc(100vw-2rem)] max-w-[440px] sm:right-6">
          <GigsonChatbotWidget locale={locale} />
        </div>
      )}

      <button
        type="button"
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[1000] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#7874F4] text-white shadow-[0_10px_30px_-6px_rgba(120,116,244,0.6)] transition hover:bg-[#5E5BC6]"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>
    </div>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
