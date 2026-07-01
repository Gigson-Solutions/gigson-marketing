/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';

import { getWelcomeMessage, type Locale } from '@/lib/gigson';

import './chatbot.css';

type Role = 'bot' | 'user';
type Msg = { id: string; role: Role; text: string; suggestions?: string[] };

type LeadFormState = 'hidden' | 'open' | 'submitting' | 'ok' | 'error';

const CHAT_ENDPOINT = '/api/chatbot/chat';
const EMAIL_ENDPOINT = '/api/chatbot/email';
const AVATAR_SRC = '/img/alfonso.jpg';
const ANTHROPIC_LOGO_SRC = '/img/anthropic-logo.svg';

const SESSION_KEY = 'gigson-chat-session';
const LAST_ACTIVE_KEY = 'gigson-chat-last-active';
const INACTIVITY_RESET_MS = 30 * 60 * 1000;

function detectLocale(override?: Locale): Locale {
  if (override === 'es' || override === 'en') return override;
  if (typeof window === 'undefined') return 'es';
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  if (seg === 'es' || seg === 'en') return seg;
  const nav = (window.navigator.language || 'es').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
}

function detectPagePath(override?: string): string | undefined {
  if (typeof override === 'string') return override;
  if (typeof window === 'undefined') return undefined;
  return window.location.pathname;
}

const STRINGS: Record<Locale, Record<string, string>> = {
  es: {
    available: 'Disponible ahora',
    newConversation: 'Empezar nueva conversación',
    typing: 'Alfonso está escribiendo',
    placeholder: 'Escribe tu mensaje…',
    rateLimit:
      'Has enviado muchos mensajes en poco tiempo. Espera un momento o escríbenos a info@gigsonsolutions.com.',
    networkError:
      'Disculpa, no puedo responder ahora. Escríbenos a info@gigsonsolutions.com y te contactamos pronto.',
    leadTitle: 'Te contactamos',
    leadName: 'Tu nombre',
    leadEmail: 'Email',
    leadCompany: 'Empresa (opcional)',
    leadMessage: '¿En qué quieres que te ayudemos?',
    leadDraftNote: 'Hemos rellenado un resumen. Edítalo si quieres.',
    leadSubmit: 'Enviar',
    leadSubmitting: 'Enviando…',
    leadSuccess:
      'Gracias. Te contactamos en menos de 24 horas. Si quieres, sigue contándome lo que necesitas mientras tanto.',
    leadError: 'No se ha podido enviar. Vuelve a intentarlo.',
    leadRgpd: 'He leído y acepto la',
    leadRgpdLink: 'Política de Privacidad',
    leadRgpdRequired: 'Debes aceptar la política de privacidad para continuar.',
    closeForm: 'Cerrar formulario',
  },
  en: {
    available: 'Available now',
    newConversation: 'Start a new conversation',
    typing: 'Alfonso is typing',
    placeholder: 'Type your message…',
    rateLimit:
      "You've sent too many messages in a short time. Wait a moment or email us at info@gigsonsolutions.com.",
    networkError:
      "Sorry, I can't reply right now. Email us at info@gigsonsolutions.com and we'll get back to you soon.",
    leadTitle: "We'll contact you",
    leadName: 'Your name',
    leadEmail: 'Email',
    leadCompany: 'Company (optional)',
    leadMessage: 'What can we help you with?',
    leadDraftNote: "We've pre-filled a summary. Edit it if you like.",
    leadSubmit: 'Send',
    leadSubmitting: 'Sending…',
    leadSuccess:
      "Thanks. We'll be in touch within 24 hours. Meanwhile, feel free to keep telling me what you need.",
    leadError: "Couldn't send. Please try again.",
    leadRgpd: 'I have read and accept the',
    leadRgpdLink: 'Privacy Policy',
    leadRgpdRequired: 'You must accept the privacy policy to continue.',
    closeForm: 'Close form',
  },
};

/**
 * Parses `[OPTIONS: A | B | C]` out of a bot reply.
 * Returns the clean text (marker removed) and the option labels.
 */
function parseOptions(reply: string): { text: string; options: string[] } {
  const match = reply.match(/\[OPTIONS:\s*([^\]]+)\]/i);
  if (!match) return { text: reply, options: [] };
  const options = match[1]
    .split('|')
    .map((o) => o.trim())
    .filter(Boolean);
  const text = reply.replace(match[0], '').trim();
  return { text, options };
}

function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `gigson-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadOrCreateSessionId(): string {
  if (typeof window === 'undefined') return newId();
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  const lastActiveRaw = window.sessionStorage.getItem(LAST_ACTIVE_KEY);
  const lastActive = lastActiveRaw ? Number.parseInt(lastActiveRaw, 10) : Number.NaN;
  const isStale = Number.isFinite(lastActive) && Date.now() - lastActive > INACTIVITY_RESET_MS;
  if (existing && !isStale) return existing;
  const next = newId();
  window.sessionStorage.setItem(SESSION_KEY, next);
  window.sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  return next;
}

function touchActivity() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
  }
}

function makeWelcome(locale: Locale): Msg {
  const w = getWelcomeMessage(locale);
  return { id: 'welcome', role: 'bot', text: w.text, suggestions: w.suggestions };
}

export function GigsonChatbotWidget({
  locale: localeProp,
  pagePath: pagePathProp,
}: {
  /** Force a locale; otherwise auto-detected from URL/browser. */
  locale?: Locale;
  /** Force the page path used for context; otherwise window.location.pathname. */
  pagePath?: string;
} = {}) {
  const [hydrated, setHydrated] = useState(false);
  const [locale] = useState<Locale>(() => detectLocale(localeProp));
  const [pagePath] = useState<string | undefined>(() => detectPagePath(pagePathProp));
  const t = STRINGS[locale];
  const [messages, setMessages] = useState<Msg[]>(() => [makeWelcome(locale)]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadFormState>('hidden');
  const [sessionId, setSessionId] = useState(loadOrCreateSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, leadForm]);

  function resetConversation() {
    const fresh = newId();
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, fresh);
      window.sessionStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    }
    setSessionId(fresh);
    setMessages([makeWelcome(locale)]);
    setInput('');
    setLeadForm('hidden');
    inputRef.current?.focus();
  }

  function pushMsg(msg: Omit<Msg, 'id'>) {
    setMessages((prev) => [...prev, { ...msg, id: newId() }]);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    pushMsg({ role: 'user', text });
    setInput('');
    setSending(true);
    touchActivity();
    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, locale, pagePath }),
      });
      if (res.status === 429) {
        pushMsg({ role: 'bot', text: t.rateLimit });
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply: string; shouldOpenLeadForm?: boolean };
      const { text: botText, options: botOptions } = parseOptions(data.reply);
      pushMsg({ role: 'bot', text: botText, suggestions: botOptions.length > 0 ? botOptions : undefined });
      if (data.shouldOpenLeadForm) setLeadForm('open');
      touchActivity();
    } catch {
      pushMsg({ role: 'bot', text: t.networkError });
    } finally {
      setSending(false);
    }
  }

  async function submitLead(form: HTMLFormElement) {
    setLeadForm('submitting');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // Full conversation (minus the static welcome) so the email carries context.
    const transcript = messages
      .filter((m) => m.id !== 'welcome' && m.text.trim().length > 0)
      .slice(-40)
      .map((m) => ({ role: m.role, text: m.text }));
    try {
      const res = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'gigson-chatbot',
          sessionId,
          locale,
          pagePath,
          transcript,
          rgpd: formData.get('rgpd') === 'on',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLeadForm('ok');
      pushMsg({ role: 'bot', text: t.leadSuccess });
    } catch {
      setLeadForm('error');
    }
  }

  if (!hydrated) {
    return <CardShell />;
  }

  return (
    <div className="w-full max-w-[440px]">
      <article className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(120,116,244,0.35)] ring-1 ring-black/5">
        {/* Header */}
        <header className="flex items-center gap-3 bg-[#2a2a2a] px-4 py-3.5 text-white">
          <img
            src={AVATAR_SRC}
            alt="Alfonso"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#7874F4]/40"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold leading-tight text-white">Alfonso de Gigson Solutions</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              {t.available}
            </p>
          </div>
          <button
            type="button"
            aria-label={t.newConversation}
            title={t.newConversation}
            onClick={resetConversation}
            className="rounded p-1 text-white/60 transition hover:text-white"
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
        </header>

        {/* Body */}
        <div ref={scrollRef} className="h-[360px] space-y-3 overflow-y-auto bg-white px-4 py-4">
          {messages.map((m) => (
            <Bubble key={m.id} message={m} onSuggestion={(s) => void sendMessage(s)} />
          ))}
          {sending && (
            <div className="flex items-center gap-1.5 text-xs text-[#868685]">
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#7874F4] [animation-delay:-0.3s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#7874F4] [animation-delay:-0.15s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#7874F4]" />
              <span className="ml-1">{t.typing}</span>
            </div>
          )}
          {leadForm !== 'hidden' && leadForm !== 'ok' && (
            <LeadFormCard
              state={leadForm}
              strings={t}
              messageDraft={computeMessageDraft(messages)}
              onSubmit={(form) => void submitLead(form)}
              onClose={() => setLeadForm('hidden')}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E3E1EE] bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={sending}
              className="flex-1 rounded-lg border border-[#E3E1EE] bg-white px-3 py-2.5 text-sm text-[#3C3C3B] placeholder:text-[#868685] focus:border-[#7874F4] focus:outline-none focus:ring-2 focus:ring-[#7874F4]/25 disabled:bg-[#EEECF0]"
            />
            <button
              type="submit"
              aria-label={t.leadSubmit}
              disabled={sending || !input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#7874F4] text-white transition hover:bg-[#5E5BC6] disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </footer>
      </article>

      {/* Partner badge */}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#E3E1EE] bg-white/70 px-4 py-2.5 text-xs text-[#868685] backdrop-blur">
        <img src={ANTHROPIC_LOGO_SRC} alt="" className="h-3.5 w-auto opacity-80" />
        <span className="font-medium text-[#3C3C3B]">Certified Anthropic Claude Partner</span>
      </div>
    </div>
  );
}

function CardShell() {
  return (
    <div className="w-full max-w-[440px]">
      <div className="h-[480px] rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(120,116,244,0.35)] ring-1 ring-black/5" />
    </div>
  );
}

function Bubble({ message, onSuggestion }: { message: Msg; onSuggestion: (s: string) => void }) {
  const isBot = message.role === 'bot';
  return (
    <div className={isBot ? '' : 'text-right'}>
      <div
        className={`inline-block max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isBot ? 'rounded-tl-md bg-[#EEECF0] text-[#3C3C3B]' : 'rounded-tr-md bg-[#7874F4] text-white'
        }`}
      >
        {message.text}
      </div>
      {message.suggestions && (
        <div className="mt-2 flex flex-wrap gap-2">
          {message.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggestion(s)}
              className="rounded-full border border-[#E3E1EE] bg-white px-3 py-1 text-xs font-medium text-[#3C3C3B] transition hover:border-[#7874F4] hover:text-[#5E5BC6]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function computeMessageDraft(messages: Msg[]): string {
  const userMsgs = messages
    .filter((m) => m.role === 'user' && m.text.trim().length >= 10)
    .map((m) => m.text.trim());
  if (userMsgs.length === 0) return '';
  const recent = userMsgs.slice(-2).join(' · ');
  return recent.length > 240 ? recent.slice(0, 240).trimEnd() + '…' : recent;
}

function LeadFormCard({
  state,
  strings,
  messageDraft,
  onSubmit,
  onClose,
}: {
  state: Exclude<LeadFormState, 'ok' | 'hidden'>;
  strings: Record<string, string>;
  messageDraft: string;
  onSubmit: (form: HTMLFormElement) => void;
  onClose: () => void;
}) {
  const t = strings;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="gcb-fade-in rounded-xl border border-[#7874F4]/30 bg-[#7874F4]/5 p-3 text-sm"
    >
      <div className="mb-2 flex items-center justify-between">
        <strong className="text-[#3C3C3B]">{t.leadTitle}</strong>
        <button
          type="button"
          aria-label={t.closeForm}
          onClick={onClose}
          className="text-[#868685] hover:text-[#3C3C3B]"
        >
          ✕
        </button>
      </div>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />
      <input
        name="name"
        required
        placeholder={t.leadName}
        autoComplete="name"
        className="mt-1 w-full rounded-md border border-[#E3E1EE] bg-white px-2 py-1.5 text-sm text-[#3C3C3B] focus:border-[#7874F4] focus:outline-none"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={t.leadEmail}
        autoComplete="email"
        className="mt-2 w-full rounded-md border border-[#E3E1EE] bg-white px-2 py-1.5 text-sm text-[#3C3C3B] focus:border-[#7874F4] focus:outline-none"
      />
      <input
        name="company"
        placeholder={t.leadCompany}
        autoComplete="organization"
        className="mt-2 w-full rounded-md border border-[#E3E1EE] bg-white px-2 py-1.5 text-sm text-[#3C3C3B] focus:border-[#7874F4] focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={3}
        defaultValue={messageDraft}
        placeholder={t.leadMessage}
        className="mt-2 w-full rounded-md border border-[#E3E1EE] bg-white px-2 py-1.5 text-sm text-[#3C3C3B] focus:border-[#7874F4] focus:outline-none"
      />
      {messageDraft && <p className="mt-1 text-[11px] text-[#868685]">{t.leadDraftNote}</p>}

      {/* LOPD / RGPD consent */}
      <label className="mt-3 flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="rgpd"
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#7874F4]"
        />
        <span className="text-[11px] text-[#868685] leading-tight">
          {t.leadRgpd}{' '}
          <a
            href="/policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#7874F4] hover:text-[#5E5BC6]"
          >
            {t.leadRgpdLink}
          </a>
          . {t.leadRgpdRequired}
        </span>
      </label>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="mt-3 w-full rounded-md bg-[#7874F4] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#5E5BC6] disabled:opacity-60"
      >
        {state === 'submitting' ? t.leadSubmitting : t.leadSubmit}
      </button>
      {state === 'error' && (
        <p className="mt-2 text-xs text-red-500">{t.leadError}</p>
      )}
    </form>
  );
}

function SendIcon({ className }: { className?: string }) {
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
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
