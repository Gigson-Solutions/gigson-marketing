# SEO — Fase 0 (línea base) y Fase 1 (entregado en código)

## Inventario de URLs indexables

Fuente única en código: `src/router/publicRoutes.js` (`getAllMarketingPathnames`, `MARKETING_PAGE_KEYS`).

Incluye:

- **Inglés (idioma por defecto):** `/` y una URL por cada clave de página (p. ej. `/services`, `/holded-integrations`, …).
- **Español:** `/es` y `/es/<slug-es>` (p. ej. `/es/servicios`).
- **Landings Holded:** `/landing-holded`, `/landing-holded.html`.

Al añadir rutas en `src/router/index.jsx`, actualizar `MARKETING_PAGE_KEYS` y los slugs en `routerSlugs.js` si aplica.

## Comprobación “sin JavaScript” (línea base)

Tras cada despliegue relevante:

```bash
curl -sS -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "https://gigsonsolutions.com/" | head -n 60
```

Sustituir la URL por rutas internas (`/services`, `/es/contacto`, etc.). **Fase 2 (prerender/SSR)** es la que debe hacer que el cuerpo deje de ir vacío en `#root`.

## Sitemap y robots

- Tras `npm run build`, se genera **`dist/sitemap.xml`** (no está en `public/`).
- **`public/robots.txt`** se copia a `dist/` y enlaza el sitemap de producción.
- Variable de entorno **`SITE_URL`:** en GitHub Actions producción va fijada a `https://gigsonsolutions.com`. Para otro dominio de prueba: `SITE_URL=https://… npm run build`.

## Google Search Console (manual)

1. Confirmar propiedad del dominio (ya existe verificación `public/googlec3d3ef12e8ed4583.html` si la usáis).
2. Tras publicar: **Sitemaps** → añadir `https://gigsonsolutions.com/sitemap.xml`.
3. **Inspección de URL** en home, una página de servicio y una en `/es/`.
4. Revisar **Páginas** / cobertura a los pocos días.

## CloudFront / S3 (comportamiento SPA)

Confirmar en la consola AWS que las rutas “limpias” (p. ej. `/services`) devuelven el documento de la SPA (suele ser redirección al `index.html` o equivalente). Si una ruta devuelve 403 en lugar del HTML de la app, hay que ajustar error pages del bucket o del distribution.

## Metadatos por defecto (Fase 1)

`index.html` incluye `title`, `meta description`, `canonical` (home), Open Graph, Twitter Card y JSON-LD (`Corporation` + `WebSite` en `@graph`, `sameAs` como array).

## Fase 2 — Prerender (HTML con contenido para crawlers)

Tras `npm run build`, **Playwright** abre cada URL del sitio en `vite preview`, captura el HTML y lo escribe en `dist/` con la misma estructura de claves S3 que usará el despliegue (p. ej. `about`, `es/contacto`, `es/index.html` para la home en español).

- **CI:** GitHub Actions y Bitbucket instalan Chromium con `npx playwright install --with-deps chromium` (imagen **Node 20**, no Alpine).
- **Content-Type:** Tras `aws s3 sync`, se ejecuta `dist/patch-content-types.sh` para poner `text/html; charset=utf-8` en objetos **sin extensión** (el sync solo acierta el tipo en `.html`).

### Home en español (`/es`) y CloudFront/S3

La home en ES se guarda como **`es/index.html`** (no puede ser el fichero `es` en disco si existen rutas `es/...`). Con origen S3 tipo **REST API**, la petición `GET /es` a veces busca el objeto `es` y **no** `es/index.html`. Si en producción `/es` no sirve HTML o devuelve el fallback del SPA, en CloudFront hay que o bien usar el **endpoint de sitio web estático** de S3 como origen (con documento índice), o bien una **función/regla** que redirija `/es` → `/es/` o que resuelva `es/index.html`. Comprueba `curl -sS -A Googlebot https://gigsonsolutions.com/es` tras el despliegue.

### Comprobar que el prerender funciona

Descarga la página y busca texto visible (títulos, párrafos) dentro del HTML, no solo `<div id="root"></div>` vacío:

```bash
curl -sS "https://gigsonsolutions.com/services" | head -c 12000
```

Las rutas concretas en `<head>` (título y meta por página) siguen pudiendo ampliarse con **react-helmet-async** en cliente; el HTML prerenderizado ya incluye lo que React pintó en el primer render (incluido Helmet si se aplicó antes del snapshot).
