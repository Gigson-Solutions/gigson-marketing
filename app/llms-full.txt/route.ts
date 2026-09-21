import { getCases } from '../../lib/cases';

export const revalidate = 3600;

const ORIGIN = 'https://gigsonsolutions.com';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * The long-form corpus: services, prices, timelines, process, stack and sector
 * work, in one plain-text document.
 *
 * All of this was already written down — it is the knowledge base behind the
 * site's chatbot (`src/lib/gigson.ts`) — but it lived in a server-side system
 * prompt, so the densest, most specific material the company has was the one
 * thing no crawler could reach. This is that content, restated as facts.
 *
 * Deliberately NOT a dump of the prompt itself: that file also carries voice
 * and tone rules, conversation flows, refusal rules and a `[OPEN_LEAD_FORM]`
 * control marker, none of which are facts about the company and all of which
 * would read as instructions to whatever ingests this file. Keep this document
 * declarative — if a line would only make sense as an instruction to an
 * assistant, it does not belong here.
 */
function corpus(caseLines: string): string {
  return `# Gigson Solutions — corpus completo

Última actualización: ${today()}
Índice de páginas: ${ORIGIN}/llms.txt

## Identidad

Gigson Solutions es una empresa tecnológica española especializada en inteligencia
artificial empresarial y transformación digital, con sede en Barcelona.

- Partner Certificado de Anthropic (Claude Partner Network), uno de los pocos en España.
  Acceso directo al canal de soporte técnico de Anthropic y a los últimos modelos Claude.
  El equipo tiene la certificación Claude Certified Architect.
- Más de 11 años de experiencia en el sector.
- Desarrollo in-house: no se externaliza.
- RGPD compliant. Los datos de cliente no se usan para entrenar modelos.
  Despliegue posible on-premise o en cloud privado.

Contacto: info@gigsonsolutions.com · +34 630 840 225
Dirección: C/ Lepant 270, 08013 Barcelona, España.

## Servicios

### Agentes de IA (servicio principal)

Diseño, construcción y despliegue de agentes basados en Claude, integrados con los
sistemas que el cliente ya usa (ERP, CRM, email, repositorios de documentos).

Casos de uso habituales:
- Procesamiento de documentos: extraer, clasificar y enrutar PDFs, emails y formularios.
- Q&A interno sobre la base de conocimiento del cliente.
- Automatización de operaciones: flujos multi-paso por eventos, con aprobaciones y escaladas.
- Atención al cliente de nivel 1, con escalada a humano.
- Extracción de datos no estructurados hacia ERP, CRM o base de datos.

Proceso, en cuatro pasos:
1. Discovery: una sesión, mapeo de flujos e identificación del caso de mayor valor.
2. Diseño y prototipo funcional conectado a los sistemas reales del cliente (1-2 semanas).
3. Despliegue en producción con monitorización, logging y puntos de control humano.
4. Retainer mensual de iteración y actualizaciones de modelo.

Stack: Claude API (Anthropic), n8n u orquestación personalizada, REST APIs,
cloud (AWS, GCP, Hetzner).

### CTO as a Service

Liderazgo técnico y de negocio para empresas sin CTO interno: roadmap tecnológico,
gestión de proyectos y equipos técnicos, análisis de riesgos, gestión de proveedores,
consultoría de arquitectura e infraestructura. Dirigido a PYMEs y medianas en
crecimiento que necesitan dirección senior sin el coste de un CTO a tiempo completo.

### Ingeniería de software a medida

Desde integrar herramientas existentes hasta desarrollar productos completos.

Capacidades: cloud (AWS, Azure, GCP); contenedores y orquestación (Docker, Kubernetes);
CI/CD (Jenkins, GitLab, GitHub, Git); bases de datos (Oracle, MySQL, MongoDB,
PostgreSQL, MS SQL, Redis); mensajería y streaming (RabbitMQ, Kafka, ELK);
monitorización (Prometheus, Datadog, Grafana, CloudWatch, Zabbix);
frontend (React, Next.js); backend (Node.js, Python/FastAPI).

### Consultoría tecnológica

Consultas sobre lenguajes, arquitecturas y soluciones; gestión de proyectos (riesgos,
proveedores); gestión de producto (visión extremo a extremo, SLAs); consultoría UX/UI;
evaluación del estado actual y futuro de la tecnología de la empresa.

### Ciberseguridad y compliance

Evaluación de seguridad (análisis de vulnerabilidades, informe de remediación,
evaluaciones de seguridad de aplicaciones); formación en phishing y seguridad de la
información; transformaciones de seguridad. Acompañamiento en certificación ISO 27001,
y certificación de productos siguiendo GDPR, SOC 2 o HIPAA.

### ERP e integraciones

Implementación de Odoo y de Holded, o construcción de un ERP a medida cuando ningún
estándar encaja (puede ser un WMS o cualquier otro sistema de gestión, no solo
facturación). Partner oficial de Odoo y de Holded.

## Precios

Rangos orientativos para un proyecto cerrado, publicados en ${ORIGIN}/es/precios:

- Agente básico (procesamiento de documentos o Q&A interno): 8.000-15.000 €.
- Proyecto con varias integraciones: 20.000-50.000 €.
- Retainer mensual: según alcance, dimensionado una vez el agente está en producción.

El precio final depende de la complejidad del caso y de cuántos sistemas haya que
integrar. Tras la sesión de discovery se da una cifra cerrada.

## Plazos

- Proyecto estándar: 4-8 semanas de kickoff a producción.
- Proyecto complejo: 10-16 semanas.
- Primeros resultados visibles: semana 2-3, cuando el prototipo ya está conectado.

## Qué incluye siempre

- Sesión de discovery para mapear flujos y elegir el caso de mayor valor.
- Prototipo funcional conectado a los sistemas reales del cliente.
- Despliegue en producción con monitorización y registro de auditoría.
- Puntos de aprobación humana en las acciones críticas.
- Cumplimiento RGPD; los datos no se usan para entrenar modelos.
- Opción de despliegue on-premise o en cloud privado.

## Diferenciadores

1. Partner Certificado de Anthropic, con acceso anticipado a nuevas versiones del modelo.
2. Entrega en producción, no demos ni pruebas de concepto abandonadas: agentes
   funcionando, con trazabilidad y logging de auditoría.
3. Safety-first: cada agente incluye puntos de control humano y registro de auditoría;
   el cliente mantiene el control.
4. Consultores de negocio con capacidad técnica, no solo desarrollo.
5. De la primera conversación a un agente en producción en menos de cuatro semanas.
6. Cumplimiento y privacidad: RGPD, datos no usados para entrenar, despliegue
   on-premise o cloud privado.

## Sectores y trabajo real

### Logística e intralogística

Retos habituales: fichaje manual sin integración con nóminas, falta de control de
inventario multicanal, reabastecimiento reactivo, desconexión entre ERP, ventas y logística.

- Fichaje por WhatsApp: bot con reconocimiento de ubicación integrado con nóminas y ERP
  (Holded u Odoo). Resultado: cumplimiento de fichajes del 100%, fin de los errores manuales.
- Control multicanal de ventas e inventario: integración de tienda online, Amazon y otros
  marketplaces (Shopify, Amazon SP-API, Mirakl) y puntos físicos con el ERP; sincronización
  bidireccional de stock y pedidos en tiempo real; panel centralizado.
- Optimización de reabastecimiento en materiales de construcción: planificación por reglas
  de negocio, matriz ABC dinámica y alertas semanales de compra.

### Retail y eCommerce

Retos habituales: inventario desconectado en marketplaces, pedidos y devoluciones manuales,
falta de visibilidad por canal, conectar la tienda online con el ERP y los 3PL.

- Integración extremo a extremo para dropshipping y logística: orquestador de API unificado
  conectando Odoo (ERP), Prestashop (CMS), Huboo (3PL) y Amazon.

### Construcción y arquitectura

Retos habituales: CRM y ERP desconectados, presupuestación manual sin catálogos de
proveedores, falta de visibilidad en tiempo real de las obras.

- Integración CRM y ERP: HubSpot, Asana y Holded, con visión completa del ciclo de vida del
  cliente y automatización de facturación y cuentas por cobrar.
- Configurador de presupuestos: WebApp integrada con Odoo, presupuestos dinámicos con
  variables (materiales, mano de obra, maquinaria, logística), catálogos en tiempo real y
  simulación de escenarios.

### Agencias creativas y estudios de diseño

- Plataforma integrada: Adobe Creative Cloud, Trello, Slack, Salesforce, Zapier y Google
  Analytics; gestión centralizada de proyectos, clientes y campañas.

### Servicios profesionales e industria general

- Agente de IA para operaciones: agente conversacional conectado a sistemas internos vía API,
  con ingesta de documentos, extracción de datos estructurados, automatización por
  razonamiento del agente, puntos de aprobación humana y registro de auditoría.
${caseLines}
## Preguntas frecuentes

**¿Qué es un agente de IA y en qué se diferencia de una automatización?**
Un agente percibe el contexto, razona y actúa: se conecta a las herramientas del cliente,
procesa sus datos y ejecuta tareas sin intervención manual. Una automatización clásica sigue
reglas fijas; un agente gestiona la ambigüedad y las decisiones de varios pasos.

**¿Cuánto cuesta un agente de IA?**
Desde 8.000-15.000 € en casos básicos y 20.000-50.000 € en proyectos con varias integraciones.

**¿Cuánto se tarda?**
4-8 semanas en un proyecto estándar, 10-16 en uno complejo, con resultados visibles desde la
semana 2-3.

**¿Hay que invertir en infraestructura para empezar?**
No. Los agentes se conectan por API a las herramientas existentes.

**¿Qué pasa con los datos?**
No se usan para entrenar modelos. Es posible desplegar on-premise o en cloud privado, y todo
el tratamiento cumple el RGPD.

**¿Qué pasa si el agente se equivoca?**
Cada agente incluye puntos de aprobación humana en las acciones críticas y registro de
auditoría de todo lo que hace.

**¿Con qué sistemas se integra?**
ERPs (Odoo, Holded), CRMs (HubSpot), gestores de proyecto (Asana), marketplaces (Amazon,
Shopify), operadores logísticos 3PL, correo y repositorios de documentos.
`;
}

export async function GET() {
  const cases = await getCases('es');
  const caseLines =
    cases.length > 0
      ? `\n### Casos publicados\n\n${cases
          .map((c) => `- ${c.title} (${ORIGIN}/es/casos/${c.slug}): ${c.challenge}`)
          .join('\n')}\n`
      : '';

  return new Response(corpus(caseLines), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
