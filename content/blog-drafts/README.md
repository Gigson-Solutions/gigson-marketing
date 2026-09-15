# Blog drafts — seguimiento

Borradores generados para el lanzamiento del blog de Gigson Solutions. Formato y workflow completo
en el plan `/Users/jaumetorrespous/.claude/plans/quiero-empezar-el-blog-eager-puppy.md`.

**Flujo:** `draft` (este archivo) → `reviewed` (editado/aprobado por el usuario) → `pasted-in-payload`
(copiado al admin de Payload como borrador) → `published` (publicado a mano desde `/admin`).

Ninguno de estos archivos ha sido escrito ni publicado directamente en Payload/Postgres — son
solo texto en el repo, listos para copiar y pegar.

## Estado de los borradores

| Título | Slug | Estado | Enlace destino | Palabras (aprox.) | Creado | Preview HTML |
|---|---|---|---|---|---|---|
| Automatiza tu Holded con IA: qué puedes conectar sin tocar tu ERP | `automatiza-tu-holded-con-ia` | draft | `/integrations-holded` | ~950 | 2026-08-13 | `preview/automatiza-tu-holded-con-ia.html` |
| Odoo + IA: 3 casos reales de automatización (fichajes, logística y presupuestos) | `odoo-ia-casos-reales-automatizacion` | draft | `/integrations-odoo` | ~900 | 2026-08-13 | `preview/odoo-ia-casos-reales-automatizacion.html` |
| Agentes de IA conectados a tu ERP: cómo automatizar sin reescribir Holded u Odoo | `agentes-ia-conectados-erp-holded-odoo` | draft | `/ai-agents` | ~1000 | 2026-08-13 | `preview/agentes-ia-conectados-erp-holded-odoo.html` |
| Odoo vs Holded vs ERP a medida: ¿cuál elegir? | `odoo-vs-holded-vs-erp-a-medida` | draft | `/custom-erp` | ~950 | 2026-08-20 | _pendiente_ |

## Cómo revisar

1. Abre el `.html` correspondiente en `preview/` directamente en el navegador (doble clic) para ver
   el contenido maquetado con los colores/tipografía reales de la marca (incluye una simulación de
   imagen inline, un bloque de cita destacada y un bloque de CTA — estos bloques de Payload todavía
   no existen en el CMS, se añaden en la Fase 2 del plan técnico).
2. Da el visto bueno o pide cambios sobre el `.html` — se itera ahí antes de tocar Payload.
3. Cuando el contenido esté aprobado, copia el cuerpo del `.md` correspondiente al editor Lexical
   de `/admin`, rellena `excerpt`/`seoTitle`/`seoDescription`, y actualiza el estado en esta tabla
   a `pasted-in-payload`.
4. Publica manualmente cuando esté listo y actualiza el estado a `published`.

## Pilares cubiertos en esta pasada

Priorizados por petición explícita del usuario: **automatizaciones, integraciones de ERP (Holded y
Odoo) e IA** — por delante de los pilares de compliance (NIS2/ISO 27001) y sectoriales (logística/
retail/construcción) ya investigados, que quedan documentados en el plan para una pasada futura.
