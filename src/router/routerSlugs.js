const DEFAULT_LANG = 'en';

const SUPPORTED_LANGS = ['en', 'es'];

const ROUTE_SLUGS = {
  en: {
    home: '',
    services: 'services',
    industries: 'industries',
    logistics: 'logistics-technology',
    retail: 'retail-ecommerce-technology',
    construction: 'construction-technology',
    cases: 'cases',
    about: 'about',
    faqs: 'faqs',
    contact: 'contact',
    policy: 'policy',
    notice: 'notice',
    cookies: 'cookies',
    CTO: 'cto-as-service',
    ConsultoriaTec: 'technology-consulting',
    software: 'software-engineering',
    cibersecurity: 'cybersecurity',
    book: 'book',
  },
  es: {
    home: '',
    services: 'servicios',
    industries: 'industrias',
    logistics: 'tecnologia-logistica',
    retail: 'tecnologia-retail-ecommerce',
    construction: 'tecnologia-construccion',
    cases: 'casos',
    about: 'sobre-nosotros',
    faqs: 'preguntas-frecuentes',
    contact: 'contacto',
    policy: 'politica',
    notice: 'aviso-legal',
    cookies: 'cookies',
    CTO: 'cto-as-service',
    ConsultoriaTec: 'consultoria-tecnologica',
    software: 'ingenieria-software',
    cibersecurity: 'ciberseguridad',
    book: 'reservas',
  },
};

export { DEFAULT_LANG, ROUTE_SLUGS, SUPPORTED_LANGS };
