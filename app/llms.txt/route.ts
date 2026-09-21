import { getPosts } from '../../lib/posts';
import { getCases } from '../../lib/cases';

// Regenerate hourly instead of baking this in at build time — same reasoning
// as `app/sitemap.ts`: new blog posts should show up here without a deploy.
export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

/**
 * Every link carries a description. The format allows `- [Title](url): what it
 * covers`, and that trailing clause is the whole point of the file: a bare list
 * of URLs tells a model nothing it couldn't get from the sitemap, so it has to
 * fetch each page to find out what is on it.
 */
type LinkSpec = { label: string; path: string; note: string };

const ES_PAGES: LinkSpec[] = [
  { label: 'Inicio', path: '/es', note: 'Qué es Gigson Solutions y qué servicios presta' },
  { label: 'Precios', path: '/es/precios', note: 'Horquillas reales: 8.000-15.000 € un agente acotado, 20.000-50.000 € con varias integraciones, plazos de 4-8 y 10-16 semanas' },
  { label: 'Agentes IA', path: '/es/agentes-ia', note: 'Diseño y despliegue de agentes basados en Claude: casos de uso, proceso de 4 pasos y stack' },
  { label: 'CTO as a Service', path: '/es/cto-as-service', note: 'Liderazgo técnico para empresas sin CTO interno: roadmap, equipos y arquitectura' },
  { label: 'Sobre Claude Partner', path: '/es/sobre-claude-partner', note: 'Qué implica ser Partner Certificado de Anthropic y la certificación Claude Certified Architect' },
  { label: 'Tecnología para Logística', path: '/es/tecnologia-logistica', note: 'Fichaje, control de inventario multicanal y optimización de reabastecimiento' },
  { label: 'Tecnología para Retail', path: '/es/tecnologia-retail-ecommerce', note: 'Integración de tienda online, marketplaces y 3PL con el ERP' },
  { label: 'Tecnología para Construcción', path: '/es/tecnologia-construccion', note: 'Integración CRM/ERP y configuradores de presupuestos' },
  { label: 'Tecnología para Servicios Profesionales', path: '/es/servicios-profesionales', note: 'Automatización documental y agentes conectados a sistemas internos' },
  { label: 'Ingeniería de Software', path: '/es/ingenieria-software', note: 'Desarrollo a medida, APIs e integraciones de sistemas' },
  { label: 'ERP a Medida', path: '/es/erp-a-medida', note: 'Cuándo un ERP a medida encaja mejor que Odoo o Holded' },
  { label: 'Integraciones Odoo', path: '/es/integraciones-odoo', note: 'Implementación de Odoo y conexión con las herramientas existentes' },
  { label: 'Integraciones Holded', path: '/es/integraciones-holded', note: 'Facturación electrónica, VeriFactu y conectores con software vertical' },
  { label: 'Ciberseguridad', path: '/es/ciberseguridad', note: 'Evaluación de vulnerabilidades, formación y transformaciones de seguridad' },
  { label: 'Consultoría Tecnológica', path: '/es/consultoria-tecnologica', note: 'Arquitectura, gestión de proyectos y evaluación tecnológica' },
  { label: 'Casos de éxito', path: '/es/casos', note: 'Proyectos reales por sector, con los sistemas usados y resultados medibles' },
  { label: 'Blog', path: '/es/blog', note: 'Artículos sobre agentes IA, ERP e integraciones' },
  { label: 'Preguntas frecuentes', path: '/es/preguntas-frecuentes', note: 'Coste, plazos, seguridad de los datos y con qué sistemas se integra un agente' },
  { label: 'Contacto', path: '/es/contacto', note: 'Formulario y llamada de discovery de 30 minutos' },
];

const EN_PAGES: LinkSpec[] = [
  { label: 'Home', path: '/', note: 'What Gigson Solutions is and what it does' },
  { label: 'Pricing', path: '/pricing', note: 'Published ranges: 8,000-15,000€ for a scoped agent, 20,000-50,000€ with several integrations, 4-8 and 10-16 week timelines' },
  { label: 'AI Agents', path: '/ai-agents', note: 'Designing and deploying Claude-based agents: use cases, the four-step process and the stack' },
  { label: 'CTO as a Service', path: '/cto-as-service', note: 'Technical leadership for companies without an in-house CTO' },
  { label: 'About Claude Partner', path: '/about-claude-partner', note: 'What being a Certified Anthropic Partner involves, and the Claude Certified Architect certification' },
  { label: 'Logistics Technology', path: '/logistics-technology', note: 'Time tracking, multichannel inventory control and replenishment optimisation' },
  { label: 'Retail Technology', path: '/retail-ecommerce-technology', note: 'Connecting an online store, marketplaces and 3PLs to the ERP' },
  { label: 'Construction Technology', path: '/construction-technology', note: 'CRM/ERP integration and budget configurators' },
  { label: 'Professional Services Technology', path: '/professional-services-technology', note: 'Document automation and agents wired into internal systems' },
  { label: 'Software Engineering', path: '/software-engineering', note: 'Custom development, APIs and systems integration' },
  { label: 'Custom ERP', path: '/custom-erp', note: 'When a custom ERP fits better than Odoo or Holded' },
  { label: 'Holded Integrations', path: '/integrations-holded', note: 'E-invoicing, VeriFactu and connectors to vertical software' },
  { label: 'Cybersecurity', path: '/cybersecurity', note: 'Vulnerability assessment, training and security transformations' },
  { label: 'Cases', path: '/cases', note: 'Real projects by sector, with the systems used and measurable results' },
  { label: 'Blog', path: '/blog', note: 'Articles on AI agents, ERP and integrations' },
  { label: 'FAQs', path: '/faqs', note: 'Cost, timelines, data security and which systems an agent integrates with' },
];

const renderLinks = (pages: LinkSpec[]): string =>
  pages.map(({ label, path, note }) => `- [${label}](${ORIGIN}${path}): ${note}`).join('\n');

async function blogSection(locale: 'es' | 'en'): Promise<string> {
  const posts = await getPosts(locale);
  if (posts.length === 0) return '';

  const heading = locale === 'es' ? '## Artículos del blog (ES)' : '## Blog posts (EN)';
  const lines = posts.map((post) => {
    const url = locale === 'es' ? `${ORIGIN}/es/blog/${post.slug}` : `${ORIGIN}/blog/${post.slug}`;
    const date = formatDate(post.publishedAt);
    const excerpt = post.excerpt ?? '';
    const dateSuffix = date ? ` (publicado ${date})` : '';
    return `- [${post.title}](${url}) — ${excerpt}${dateSuffix}`;
  });

  return `${heading}\n\n${lines.join('\n')}`;
}

/** Case studies, once the collection is populated — each one is a real project
 * with a measurable result, which is the most quotable material on the site. */
async function casesSection(locale: 'es' | 'en'): Promise<string> {
  const cases = await getCases(locale);
  if (cases.length === 0) return '';

  const heading = locale === 'es' ? '## Casos de éxito (ES)' : '## Case studies (EN)';
  const lines = cases.map((caseStudy) => {
    const url =
      locale === 'es'
        ? `${ORIGIN}/es/casos/${caseStudy.slug}`
        : `${ORIGIN}/cases/${caseStudy.slug}`;
    const result = (caseStudy.results ?? []).map((r) => r.text)[0] ?? caseStudy.challenge;
    return `- [${caseStudy.title}](${url}): ${result}`;
  });

  return `${heading}\n\n${lines.join('\n')}`;
}

export async function GET() {
  const [esBlog, enBlog, esCases, enCases] = await Promise.all([
    blogSection('es'),
    blogSection('en'),
    casesSection('es'),
    casesSection('en'),
  ]);

  const body = `# Gigson Solutions — Certified Anthropic Claude Partner

> Gigson Solutions diseña, construye y despliega agentes de IA basados en Claude para operaciones empresariales en España. Somos Partner Certificado de Anthropic con el programa Claude Certified Architect. Ofrecemos también CTO as a Service, integraciones de sistemas, ingeniería de software a medida y ciberseguridad para PYMEs y empresas medianas.

Última actualización: ${formatDate(new Date().toISOString())}
Corpus completo: ${ORIGIN}/llms-full.txt

## Páginas prioritarias (ES)

${renderLinks(ES_PAGES)}

## Priority pages (EN)

${renderLinks(EN_PAGES)}

${esCases}

${enCases}

${esBlog}

${enBlog}

## Acerca de Gigson Solutions

Gigson Solutions es una empresa tecnológica española especializada en inteligencia artificial empresarial y transformación digital. Somos miembros de la Claude Partner Network — el programa oficial de Anthropic para empresas que entregan soluciones basadas en Claude a clientes empresariales. Nuestro equipo tiene la certificación Claude Certified Architect y acceso directo al canal de soporte técnico de Anthropic.

Sectores que atendemos: logística, retail, construcción, servicios profesionales y legal, software, ciberseguridad.
Servicios principales: implementación de agentes IA, CTO as a Service, integraciones de sistemas, ingeniería de software a medida, consultoría tecnológica, ciberseguridad.
Contacto: info@gigsonsolutions.com · +34 630 840 225 · C/ Lepant 270, 08013 Barcelona, España.
`.replace(/\n{3,}/g, '\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
