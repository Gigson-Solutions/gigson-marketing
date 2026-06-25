---
name: project-release-june-2026
description: Release a producción del 15-16 junio 2026 — navbar, ISO 27001, accordion, form, limpieza de páginas duplicadas
metadata:
  type: project
---

PR #79 (staging → main) mergeado el 16/06/2026. Incluye:

- **Navbar**: font-size 13px en todos los elementos desktop, gap 1rem/2rem, padding 8px 14px
- **ISO 27001**: nueva página de servicio `/iso-27001` (indexable, Schema.org) + landing noindex `/iso-27001-certification` para Google Ads
- **Accordion**: fix chevron SVG 18×18px, FaqsAccordion auto-contenido
- **Formulario**: todos los servicios actualizados en el dropdown de contacto
- **Brand section**: proporciones 1/3 — 2/3 fijas en desktop
- **Build fix**: eliminadas 23 páginas duplicadas en `app/[locale]/` sin route groups

**Why:** Acumulación de PRs validados en staging durante semanas. El merge fue limpio (staging 19 commits ahead, sin divergencia).

**How to apply:** En futuras sesiones, main y staging están en sync. Próximas features deben ir branch → staging → main.

**Workflow confirmado:** branch → PR a staging → validar en staging.gigsonsolutions.com → PR staging → main → producción.

**PRs cerrados como obsoletos:** #62 (hero-gsap-mouse-reactive, modificaba Hero.jsx que Next.js no usa), #74 (feature/hero-animations, contenido ya en main por otra vía).

**Ramas limpias pendientes de borrar:** fix/accordion-bugs, feature/hero-animations, feature/hero-gsap-mouse-reactive, fix/nav-iso27001-brand-layout, fix/contact-form-services-and-copy, feat/iso27001-lp-and-service-page, fix/seo-technical-fixes.
