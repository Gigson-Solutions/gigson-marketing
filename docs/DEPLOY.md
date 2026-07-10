# Despliegue (Vercel)

Tras la migración de Vite a **Next.js + Payload CMS**, la web dejó de ser un sitio
estático: tiene rutas API server-side (chatbot Alfonso, formularios de leads), panel de
administración de Payload y base de datos Postgres. Por eso **ya no se despliega en
S3/CloudFront**, sino en **Vercel**.

## Cómo se despliega

El deploy lo gestiona la **integración nativa de Vercel con GitHub** (no hay workflow de
GitHub Actions para desplegar). Al hacer push, Vercel construye y publica solo:

| Rama / evento     | Resultado en Vercel                                      |
| ----------------- | -------------------------------------------------------- |
| push a `main`     | Deploy a **producción** → `gigsonsolutions.com`          |
| push a `staging`  | Deploy a **staging** → `staging.gigsonsolutions.com`     |
| PRs               | Deploy **preview** con URL propia                        |

> El workflow antiguo `aws s3 sync dist/ ...` era de la era Vite y se eliminó: fallaba con
> `dist/ does not exist` (Next.js genera `.next/`, no `dist/`) y además era redundante,
> porque Vercel ya publicaba por su cuenta.

`.github/workflows/ci.yml` se mantiene: valida **lint + build** en cada PR a `main`/`staging`.

## Variables de entorno (Project → Settings → Environment Variables en Vercel)

Se configuran en Vercel, en los scopes **Production** y **Preview** (los valores pueden
diferir, p.ej. una BD distinta para staging):

| Variable             | Notas                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| `PAYLOAD_SECRET`     | Cadena aleatoria larga (`openssl rand -hex 32`)                       |
| `DATABASE_URI`       | Postgres (Neon). **Necesaria ya en build** (el blog prerenderiza).    |
| `PAYLOAD_API_URL`    | `https://gigsonsolutions.com/api` (prod) / URL de staging en preview  |
| `ANTHROPIC_API_KEY`  | Clave de Claude para el chatbot Alfonso                               |
| `ANTHROPIC_MODEL`    | p.ej. `claude-sonnet-4-6` (o `claude-haiku-4-5` para abaratar)        |
| `LEAD_EMAIL_TO`      | Destinatario de los leads (chatbot + formularios)                    |
| `LEAD_EMAIL_CC`      | CC de los leads                                                       |
| `LEAD_EMAIL_DISABLE` | `false` en prod; `true` para no enviar email (solo log)               |

## Notas

- **FormSubmit (una vez):** la primera sumisión del formulario de la landing ISO 27001
  dispara un email de verificación a `hello@gigsonsolutions.com`. Hay que probar el
  formulario en staging y clicar el link de confirmación; después los leads llegan solos.
- El build tolera no tener BD (`getPostSlugs()` cae a `[]` y el blog usa ISR con
  `revalidate = 3600`), así que un fallo de BD no rompe el deploy — pero el blog no
  prerenderizará hasta que la BD esté disponible.
- Restos de la era Vite pendientes de limpiar (no afectan al deploy): `scripts/prerender.mjs`,
  `scripts/generate-sitemap.mjs`, `bitbucket-pipelines.yml` y `deploy.yml` de la raíz.
