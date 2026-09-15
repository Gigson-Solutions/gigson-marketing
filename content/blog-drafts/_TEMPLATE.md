---
title: ""
slug: ""                     # lowercase-hyphenated, ej. "automatizacion-erp-2026"
status: draft                 # draft | reviewed | pasted-in-payload | published
author: "Gigson Solutions"
excerpt: ""                   # 150-160 caracteres — va a Payload `excerpt`, también fallback de meta description
seoTitle: ""                  # opcional, solo si difiere del title
seoDescription: ""            # opcional, solo si difiere del excerpt
coverImageBrief: ""           # concepto visual (no hay URL real todavía, no hay upload en Payload aún)
internalLink:
  targetPage: ""              # ruta interna existente, ej. /integrations-holded
  anchorTextSuggestion: ""
dateCreated: 2026-08-13
---

# Título del artículo

Cuerpo en Markdown. Reglas de voz de marca (docs/DSM_GS.md):
- Tú informal, nunca "usted".
- "gigson solutions" siempre en minúscula en el cuerpo del texto.
- Sin emojis.
- Puntuación española correcta (¿ / ¡).
- Párrafos cortos (2-3 líneas).
- Abrir con una pregunta retórica cuando encaje de forma natural.
- Cerrar con una llamada a la acción que enlace a `internalLink.targetPage`.

## Checklist antes de pasar de `draft` a `reviewed`

- [ ] `title` — bajo ~60 caracteres
- [ ] `slug` — minúsculas, con guiones
- [ ] `excerpt` — 150-160 caracteres
- [ ] `seoTitle` / `seoDescription` solo si difieren
- [ ] `coverImageBrief` — un concepto visual, no una URL real
- [ ] `internalLink.targetPage` verificado contra `i18n/routing.ts`
- [ ] Cuerpo sigue `docs/DSM_GS.md`
- [ ] El enlace interno aparece de forma natural en el cuerpo, no solo pegado al final
- [ ] Recuento de palabras (~900-1300 para estos temas)
