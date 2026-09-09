---
name: project-seo-professional-services-sprint
description: 2026-08-13 SEO sprint that reinforced the AI Agents page and added a new Professional Services/Legal sector vertical
metadata:
  type: project
---

On 2026-08-13, following a request to grow the "agentes IA" side of gigsonsolutions.com
(leads were coming in asking about it), an SEO audit + implementation sprint covered:

- Enriched the "Agente de IA para Operaciones" case study with a `results` block
  (illustrative ranges, not fabricated exact figures — see
  [[feedback_no_fabricated_case_study_data]]).
- Added an "Agentes IA" FAQ category to the general `/faqs` page.
- Wired up `ServiceFaq` + `FAQPage` JSON-LD on the 3 existing sector pages (logistics,
  retail, construction) — the content already existed in `messages/*.json` but was
  never rendered nor marked up with schema (dead `ServiceFaq` import). This was the
  highest-leverage fix of the sprint.
- Added cross-linking: sector pages → `/ai-agents` (new `aiAgentsCta` block) and
  `/ai-agents` → all 4 sector pages (new `sectorsCta` block).
- Added AI-agent content parity to Construction (was the only vertical with none).
- **Added a 4th sector vertical: Professional Services/Legal & Consultancy**
  (`/professional-services-technology`, `/es/tecnologia-servicios-profesionales`) —
  chosen after market research showed it's the fastest-adopting, least-publicized,
  lowest-competition segment for AI agents in Spain 2026, and Gigson already had
  partial portfolio evidence (the AI agent case study's "Servicios profesionales" tag).
  This required touching: `i18n/routing.ts` (new pathname), `Navbar.tsx` (Industries
  dropdown), `app/sitemap.ts`, `public/llms.txt`, and the chatbot system prompt
  `src/lib/gigson.ts` (URL list + sector-qualification question options) — all of
  which hardcoded the previous 3 sectors and needed a 4th entry.

**Why:** direct response to inbound lead interest in AI agents; the professional
services vertical was picked over plain "eCommerce" (already covered by the existing
Retail & eCommerce page) after comparing market demand data.

**How to apply:** future sector/vertical work on this site should check these same 5
files (routing.ts, Navbar.tsx, sitemap.ts, llms.txt, gigson.ts) for hardcoded
sector/service lists — they are not derived dynamically from any single source of
truth.

**Backlog not executed this sprint** (deferred, documented as content ideas only):
5 blog post ideas for organic long-tail traffic (the blog collection exists in Payload
CMS but had zero published posts as of this sprint): cost of AI agent implementation
in Spain, AI agents vs RPA/n8n automation, AI agent sector use cases (logistics/retail),
AI agents + GDPR compliance, why Gigson chose Claude/Anthropic. Revisit when the user
wants to start populating the blog.
