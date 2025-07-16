const DEFAULT_LANG = 'en';

const SUPPORTED_LANGS = ["en", "es"];

const ROUTE_SLUGS = {
  en: {
    home: '',
    services: 'services',
    industries: 'industries',
    logistics: 'logistics-technology',
    construction: 'construction-technology',
    cases: 'cases',
    about: 'about',
    faqs: 'faqs',
    contact: 'contact',
    policy: 'policy',
    notice: 'notice',
    cookies: 'cookies',
  },
  es: {
    home: '',
    services: 'servicios',
    industries: 'industrias',
    logistics: 'tecnologia-logistica',
    construction: 'tecnologia-construccion',
    cases: 'casos',
    about: 'sobre-nosotros',
    faqs: 'preguntas-frecuentes',
    contact: 'contacto',
    policy: 'politica',
    notice: 'aviso-legal',
    cookies: 'cookies',
  },
};

export { ROUTE_SLUGS, DEFAULT_LANG, SUPPORTED_LANGS }