# Gigson Solutions — Design System

> **Brand:** gigson solutions — bespoke software consultancy.
> **Tagline (ES):** *"Transformamos tu negocio creando soluciones de software a medida."*
> **Tagline (EN):** *"Building tailored software solutions."*
> **Locale:** Spanish-first, English variant on every surface.

A boutique Spanish software-engineering consultancy. The brand reads like a design studio more than a tech vendor: warm cream backgrounds, a single electric-purple accent (`#7874F4`), one type family (DM Sans), and a recurring set of rendered 3D primitives (sphere, cone, cube, plane) layered over the page with `color-burn` / `hard-light` blends that tint them violet.

Everything is rounded — buttons and tags are full pills, content cards take a generous 30 px radius. Hairlines are real `0.5 px` strokes. The system is **flat**: there are no drop shadows in the source. Depth comes from gradient washes and blended 3D forms, not elevation.

## Sources

- **Figma file** (mounted, read-only): *"Gigson solutions - web (original).fig"*
  - `/Diseño` — 49 frames, the live website (HOME, SERVICIOS, NOSOTROS, CASOS, FAQs, CONTACTO + ES/EN + Mobile variants)
  - `/Librería-recursos-de-marca` — 10 frames, the brand library (COLORES, DEGRADADOS, FORMAS-3D, FORMAS-PLANAS, FORMAS-ALAMBRE-3D, FORMAS-3D-PLANAS)
  - `/DRAFTS` — 14 frames, work-in-progress
- **Uploaded SVGs** (`uploads/`): `solutions.svg` (wordmark), `Vector.svg` (arrow-mark icon), `Group 33742.svg` (large wordmark)

## Products / Surfaces

A single surface: the **marketing website**. Pages: HOME, SERVICIOS, NOSOTROS, CASOS (with desplegables), FAQs (accordion), CONTACTO, Páginas-legales, 404. Every page ships in two languages and has a Mobile variant. There is no app, no docs site, no dashboard. The UI kit therefore covers exactly that: the website.

---

## CONTENT FUNDAMENTALS

**Voice.** Conversational, warm, *tú* (informal). Reads like talking to a smart friend who happens to ship software. Sentences open with rhetorical questions a lot:

- *"¿Qué puede hacer gigson solutions por tu negocio?"*
- *"¿Cómo podemos ayudarte a alcanzar tus objetivos?"*
- *"¿Hablamos?"*

**Casing.** Body copy is sentence case. **Buttons, eyebrows, and nav are UPPERCASE** with light tracking — `DESCUBRE NUESTROS SERVICIOS`, `VER CASOS`, `CONTÁCTANOS`, `BUILDING TAILORED SOFTWARE SOLUTIONS`. The brand name itself stays **lowercase always** — *"gigson solutions"*, never "Gigson Solutions" in running copy.

**Pronouns.** "Nosotros" / "tú" — first-person plural for the company, second-person singular for the reader. Never *usted*.

**Tone notes.**
- Confident-but-modest. The hero brags ("**8 años de experiencia**") but the rest pivots to enabling: *"la tecnología debería impulsar tu negocio, no limitarlo."*
- Self-aware humor in role names: *"PICACÓDIGO A LA VISTA"* (Frontend), *"DIRECTOR DE ORQUESTA"* (PM), *"VALIDACIÓN"* (QA).
- Verbs of motion and shape: *transformar, simplificar, conectar, impulsar, crear*.
- Occasional ellipses for warmth: *"Y si lo que necesitas aún no existe... lo creamos para ti."*

**Punctuation.** Spanish-correct: opening `¿` / `¡`, regular curly quotes, en-dashes for asides. Numerical budgets use the `<` glyph: `< 25k€`, `< 50k€`, plus a deadpan `no idea` option.

**No emoji. No exclamation-pile-ons.** The whole site has zero emoji and no clip-art icons. Even the FAQ accordions are pure type + a thin caret.

**Length.** Marketing copy is short — most paragraphs are 2 lines. Long-form copy (terms, FAQs answers) keeps the same 20 px / 28 lh size as body — there is no shrunken "fine print" register.

**Bilingual.** Every screen has a 1:1 EN twin. The header carries an `ES / EN` toggle. Translations are direct, not localized: *Construcción* → *Construction*, *Logística* → *Logistics*.

---

## VISUAL FOUNDATIONS

### Color
- **Background.** The cream `#F4F3EF` is the canvas of the entire site. Pure white is **only** used inside form inputs and isolated cards.
- **Ink.** Body copy and almost every UI border is `#3C3C3B` (near-black, never `#000`). True black `#000` appears on form input borders only.
- **Accent.** A single electric purple `#7874F4`. Used for: button strokes, button labels, active tag/chip strokes, "elegir gigson" lavender section, the brand mark, gradient washes. There is no second accent.
- **Lavender washes.** `#E3E1EE` for full-width section blocks ("¿Por qué elegir gigson?"), `#EEEDF0` for the contact form region. Both are 1-color, no pattern.

### Type
- **One family: DM Sans** at Regular 400 (~95% of usage) and Medium 500 (rare, only for some large display sizes).
- A real type-scale: 16 / 17 / 20 / 30 / 35 / 45 / 55 / 70 / 150 px. The 150 px occurs once (NOSOTROS hero number).
- Line-height runs tight on display (60/55 ≈ 1.10) and standard on body (28/20 = 1.40).
- Headings sit on a soft tracking (-0.01 em) so the rounded letterforms don't drift.

### Backgrounds & imagery
- **No photography.** The brand never uses photos. Instead:
- **3D primitives** rendered as PNGs — sphere, cone, cube, plane — drifted across pages at 0.6–1× scale.
- **Blend tricks.** Each 3D shape sits inside a `mix-blend-mode: color-burn` wrapper, with a `mix-blend-mode: hard-light` purple overlay, which tints the original render violet while keeping the highlights crisp. This is the brand's "thing."
- **Wireframe geometry.** Pyramid, pentagon, cube outlines drawn in `0.5 px` purple stroke — flat, vector, often at 30–40° rotation, 70 × 70 to 200 × 200.
- **Mesh gradient PNGs.** Two large soft mesh-gradient pngs (one cream, one violet) used full-bleed under hero copy.
- **Linear gradients.** Three signature gradients:
  - Hero pull-quote: `linear-gradient(rgba(120,116,244,0.7) 0%, rgba(120,116,244,0) 100%)` — purple fades down to nothing, on a 30 px radius card with cream type on top.
  - Footer: `linear-gradient(rgba(120,116,244,0.3) 0%, rgba(244,243,239,0.3) 100%)` — same direction, but watered down 70%.
  - Sphere protection: `linear-gradient(#E9E8F1 0%, rgba(233,232,241,0) 100%)` — circular gradient under the bigger sphere.

### Borders, radii, hairlines
- Buttons: pill shape (`border-radius: 110px`), `0.5 px` solid purple stroke. *No fill, ever.*
- Tags / chips: pill shape (`border-radius: 78px`), `0.5 px` solid ink stroke when inactive.
- Content cards: `30 px` radius. Stroked `1 px` purple in the SERVICIOS tarjetas; otherwise unstroked.
- Footer wrapper: `5 px` radius (almost nothing, the gradient does the work).
- Form inputs: no boxes — single `1 px` underline `#3C3C3B`.
- Avatar / form-checkbox indicator: `1 px` ink stroke, fully circular (`border-radius: 391 px`).

### Elevation
**There is no shadow system.** Searched the entire 2,602-node Figma file — zero drop shadows. Depth comes from blend modes and gradient washes. Treat any shadow you add as off-system. (Tokens exposed in CSS as a courtesy: `--gs-shadow-soft`, `--gs-shadow-card`.)

### Animation
The Figma file is static — animation isn't expressed in the source. Inferred from interaction "prototypeInteractions" markers on hover/active states:
- **Hover (button).** Stroke + label flip from `#7874F4` → `#9747FF` (the deep purple). No fill change, no scale.
- **Active tag.** Switches from `0.5 px` ink stroke → solid purple stroke + purple label.
- **Press.** No press state in source; recommended: 96% scale + same color (avoid darken).
- **Page transitions.** None. Use 200 ms fade for in-app changes; 360 ms for big section reveals.
- Easing: `cubic-bezier(0.22, 0.61, 0.36, 1)` (out-cubic) for almost everything.

### Hover, press, focus
- Hover = recolor (purple → deep-purple).
- Press = subtle scale (96%) — recommended, not in source.
- Focus = `2px` deep-purple outline at `2px` offset.

### Layout rules
- 1440 × N marketing canvas. 71 px page gutter on the left, 1298 px content max.
- Most sections are 478, 644, 680, or 773 px tall — the rhythm is generous, not dense.
- Long form pages stack 5–8 modules, separated by full-bleed lavender or gradient blocks.
- The header is a fixed 103 px tall bar with `rgba(244,243,239,0.8)` translucent fill — the only blur-adjacent surface in the system.
- Hairline rule under the header: `1 px` solid ink, full-content-width.

### Transparency & blur
- Header uses `0.8` cream — a translucent panel without backdrop-blur (the cream behind it is solid, so it reads as soft).
- Gradients use 0.3 / 0.7 opacity stops on the brand purple. No glassmorphism, no real blurs.

### Imagery vibe
Not applicable — the brand uses no photography. The 3D renders are warm-neutral with a violet wash; even when the source PNG is achromatic, the hard-light overlay tints it electric purple. Net feeling: **cool-warm**, optimistic, geometric.

### Cards
Two card species:
1. **Big content card** (`SERVICIOS - Tarjetas`): 1292 × 773, `30 px` radius, `1 px` purple stroke, cream **or** lavender fill, generous 47 px inner padding, type-only — no icons.
2. **Pull-quote card** (`Simplificando un mundo innecesariamente complejo`): 1299 × 295, `30 px` radius, purple-fade gradient fill, cream type, contains a button.

---

## ICONOGRAPHY

**There is no icon set.** This is unusual for a software brand and worth saying out loud: gigson solutions does not use Lucide, Heroicons, Feather, FontAwesome, Material, or any sprite. They do not use emoji. They do not use unicode glyphs.

What they use instead:
- **A single brand mark** — `assets/icon-arrow-mark.svg`. A flat, monochromatic arrow that doubles as the "g" in *gigson*. Appears in the footer near the wordmark and rendered alone in some accent slots.
- **Two small chrome SVGs** — `Flecha.svg` (a 22 × 11 px down-arrow chevron used on hover affordances) and `Flecha-2.svg` (a 17 × 9 px form-arrow). Both rendered as `1 px` strokes, color either purple `#7874F4` or graphite `#868685`.
- **Wireframe shape outlines** — pentagon, pyramid, cube — drawn in `0.5 px` purple stroke, used as decorative section markers (NOSOTROS "Descubre lo que nos mueve" features them with `Vector.svg` / `Vector2.svg` per shape).
- **3D primitive renders** — sphere, cone, cube, plane (`assets/3d-*.png`) — these are the brand's signature. Not icons exactly, but they fill the role iconography would: every section has one floating in the background.

If the design system needs a UI icon (cart, search, menu, close, etc.), **substitute Lucide** at `1.5 px` stroke, color `var(--gs-ink)`. **Flag the substitution** to the user — Lucide is *not* in the source.

For the mobile menu: the source uses a **typed** `MENÚ` label, no hamburger. Same rule for "Close": typed `CERRAR`. No icons.

---

## File index

```
README.md                       — this file
SKILL.md                        — Claude Skills entry point
colors_and_type.css             — design tokens (CSS variables) + base styles
fonts/                          — empty; using Google Fonts CDN (DM Sans)

assets/
  logo-gigson-solutions.svg            — primary wordmark (ink)
  logo-gigson-solutions-large.svg      — large wordmark (footer/hero)
  icon-arrow-mark.svg                  — brand mark (the "g" arrow)
  arrow-down.svg                       — small chevron, body affordance
  3d-sphere.png                        — sphere primitive
  3d-cone.png                          — cone primitive
  3d-plane.png                         — flat-plane primitive
  mesh-gradient.png                    — cream mesh wash (hero)
  mesh-gradient-purple.png             — violet mesh wash
  pentagon.svg / pentagon-outline.svg
  square.svg / triangle.svg
  wireframe-piramid.svg / wireframe-piramid-base.svg

preview/                        — design-system review cards (rendered into the DS tab)

ui_kits/
  website/                      — the Gigson marketing website UI kit
    README.md
    index.html                  — clickable click-thru of HOME → SERVICIOS → NOSOTROS → CASOS → FAQs
    Header.jsx, Footer.jsx, Button.jsx, Tag.jsx, ServiceCard.jsx,
    FAQItem.jsx, FilterRow.jsx, Hero3DScene.jsx, BrandMark.jsx
```

---

## Caveats / known gaps

- **DM Sans is now self-hosted.** Brand-supplied `.ttf`s live in `fonts/` (Thin → Black, plus 18 / 24 / 36 pt optical-size cuts). `colors_and_type.css` declares all weights via `@font-face`. Default `--gs-font-sans` resolves to "DM Sans"; opt into an optical cut explicitly via `"DM Sans 18pt"` etc.
- **Animation spec is inferred.** The Figma file is static — only `prototypeInteractions` markers indicate hover/active. Hover-color flip is documented in source; press / focus are recommendations.
- **No icon library.** The brand has none. Any UI icon you add (cart, search, etc.) is off-system; flag the substitution.
- **3D primitives are pre-rendered PNGs**, not vectors. Replacing them requires re-rendering in the same blend stack.
