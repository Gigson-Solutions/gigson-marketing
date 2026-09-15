---
name: feedback-no-fabricated-case-study-data
description: Never fabricate named clients or hyper-precise verifiable metrics in gigsonsolutions.com marketing copy (case studies, sector pages) when no real client/data exists
metadata:
  type: feedback
---

When writing case-study-style content for gigsonsolutions.com (case studies on `/cases`,
sector landing pages like `/logistics-technology`, `/professional-services-technology`,
etc.) and there is no real, verified client behind the example:

- **Never invent a named client** (real or fictitious-sounding, e.g. "Martínez Marcos"
  style) presented as if it were a real project.
- **Never fabricate hyper-specific metrics** ("32% reduction", "100% compliance") that
  read as verified facts about a real business.
- **Do** use anonymized, generic framing ("un despacho con varias sedes", "una
  consultora de tamaño medio") and **realistic ranges** grounded in cited market
  research (e.g. "reducción de 20-30%", "ROI en 3-6 meses") — same level of technical
  detail (functionalities, tech stack) as real cases, just without a false factual
  attribution.

**Why:** existing real case studies on the site (e.g. `cases-logistics.useCases` /
`improveAreas`) use real anonymized-but-specific client data with exact quantified
results. When asked to add a new sector page for a vertical with no real project yet
(Professional Services/Legal, added 2026-08-13), the user explicitly confirmed this
approach ("opción B") rather than inventing a fake client — inventing one would risk a
false, verifiable advertising claim about a real-sounding business.

**How to apply:** any time new case-study/testimonial-style content is generated for a
sector or service page and no real client data is supplied, default to this
illustrative-but-honest framing and flag it to the user as such, rather than asking
each time. See [[project_seo_professional_services_sprint]] for the sprint where this
was established.
