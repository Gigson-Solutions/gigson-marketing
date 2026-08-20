import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/services': { en: '/services', es: '/servicios' },
    '/logistics-technology': { en: '/logistics-technology', es: '/tecnologia-logistica' },
    '/retail-ecommerce-technology': {
      en: '/retail-ecommerce-technology',
      es: '/tecnologia-retail-ecommerce',
    },
    '/construction-technology': {
      en: '/construction-technology',
      es: '/tecnologia-construccion',
    },
    '/professional-services-technology': {
      en: '/professional-services-technology',
      es: '/servicios-profesionales',
    },
    '/cases': { en: '/cases', es: '/casos' },
    '/about': { en: '/about', es: '/sobre-nosotros' },
    '/faqs': { en: '/faqs', es: '/preguntas-frecuentes' },
    '/contact': { en: '/contact', es: '/contacto' },
    '/policy': { en: '/policy', es: '/politica' },
    '/notice': { en: '/notice', es: '/aviso-legal' },
    '/cookies': '/cookies',
    '/cto-as-service': '/cto-as-service',
    '/technology-consulting': {
      en: '/technology-consulting',
      es: '/consultoria-tecnologica',
    },
    '/software-engineering': { en: '/software-engineering', es: '/ingenieria-software' },
    '/cybersecurity': { en: '/cybersecurity', es: '/ciberseguridad' },
    '/book': { en: '/book', es: '/reservas' },
    '/ai-agents': { en: '/ai-agents', es: '/agentes-ia' },
    '/ai-manifest': { en: '/ai-manifest', es: '/manifiesto-ia' },
    '/iso-27001': '/iso-27001',
    '/iso-27001-certification': {
      en: '/iso-27001-certification',
      es: '/certificacion-iso-27001',
    },
    '/gracias-iso27001': '/gracias-iso27001',
    '/about-claude-partner': { en: '/about-claude-partner', es: '/sobre-claude-partner' },
    '/integrations-holded': { en: '/integrations-holded', es: '/integraciones-holded' },
    '/project-estimator': { en: '/project-estimator', es: '/estimador-de-proyecto' },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
