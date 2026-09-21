import { getPosts } from '../../lib/posts';

// Regenerate hourly instead of baking this in at build time — same reasoning
// as `app/sitemap.ts`: new blog posts should show up here without a deploy.
export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';

function formatDate(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

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

export async function GET() {
  const [esBlog, enBlog] = await Promise.all([blogSection('es'), blogSection('en')]);

  const body = `# Gigson Solutions — Certified Anthropic Claude Partner

> Gigson Solutions diseña, construye y despliega agentes de IA basados en Claude para operaciones empresariales en España. Somos Partner Certificado de Anthropic con el programa Claude Certified Architect. Ofrecemos también CTO as a Service, integraciones de sistemas, ingeniería de software a medida y ciberseguridad para PYMEs y empresas medianas.

## Páginas prioritarias (ES)

- [Inicio](${ORIGIN}/es)
- [Agentes IA](${ORIGIN}/es/agentes-ia)
- [CTO as a Service](${ORIGIN}/es/cto-as-service)
- [Precios](${ORIGIN}/es/precios)
- [Sobre Claude Partner](${ORIGIN}/es/sobre-claude-partner)
- [Tecnología para Logística](${ORIGIN}/es/tecnologia-logistica)
- [Tecnología para Retail](${ORIGIN}/es/tecnologia-retail-ecommerce)
- [Tecnología para Construcción](${ORIGIN}/es/tecnologia-construccion)
- [Tecnología para Servicios Profesionales](${ORIGIN}/es/servicios-profesionales)
- [Ingeniería de Software](${ORIGIN}/es/ingenieria-software)
- [Ciberseguridad](${ORIGIN}/es/ciberseguridad)
- [Consultoría Tecnológica](${ORIGIN}/es/consultoria-tecnologica)
- [ERP a Medida](${ORIGIN}/es/erp-a-medida)
- [Integraciones Holded](${ORIGIN}/es/integraciones-holded)
- [Casos de éxito](${ORIGIN}/es/casos)
- [Blog](${ORIGIN}/es/blog)
- [Preguntas frecuentes](${ORIGIN}/es/preguntas-frecuentes)
- [Contacto](${ORIGIN}/es/contacto)

## Priority pages (EN)

- [Home](${ORIGIN}/)
- [AI Agents](${ORIGIN}/ai-agents)
- [CTO as a Service](${ORIGIN}/cto-as-service)
- [Pricing](${ORIGIN}/pricing)
- [About Claude Partner](${ORIGIN}/about-claude-partner)
- [Logistics Technology](${ORIGIN}/logistics-technology)
- [Retail Technology](${ORIGIN}/retail-ecommerce-technology)
- [Construction Technology](${ORIGIN}/construction-technology)
- [Professional Services Technology](${ORIGIN}/professional-services-technology)
- [Software Engineering](${ORIGIN}/software-engineering)
- [Cybersecurity](${ORIGIN}/cybersecurity)
- [Custom ERP](${ORIGIN}/custom-erp)
- [Holded Integrations](${ORIGIN}/integrations-holded)
- [Cases](${ORIGIN}/cases)
- [Blog](${ORIGIN}/blog)
- [FAQs](${ORIGIN}/faqs)

${esBlog}

${enBlog}

## Acerca de Gigson Solutions

Gigson Solutions es una empresa tecnológica española especializada en inteligencia artificial empresarial y transformación digital. Somos miembros de la Claude Partner Network — el programa oficial de Anthropic para empresas que entregan soluciones basadas en Claude a clientes empresariales. Nuestro equipo tiene la certificación Claude Certified Architect y acceso directo al canal de soporte técnico de Anthropic.

Sectores que atendemos: logística, retail, construcción, servicios profesionales y legal, software, ciberseguridad.
Servicios principales: implementación de agentes IA, CTO as a Service, integraciones de sistemas, ingeniería de software a medida, consultoría tecnológica, ciberseguridad.
`.replace(/\n{3,}/g, '\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
