# Landing Holded, integrations y staging

Guía para que cualquier persona del equipo entienda **dónde vive el código**, **cómo desplegar** y **por qué a veces “no se ven los cambios”** en un subdominio.

---

## 1. Dos capas: código y infraestructura

| Capa | Qué es | Si falla… |
|------|--------|-----------|
| **Código** (este repo) | React + Vite, HTML embebido, imágenes en `public/` | Arreglar con commits, PR y merge a `main` / `staging`. |
| **Infra** (AWS) | CloudFront + S3 + DNS (Route 53) | Ningún commit “arregla” solo: el dominio debe apuntar al **mismo** sitio que sirve el SPA. |

**¿Se arregla si Alfonso (o cualquiera) hace commit otra vez?**

- **Si el problema es el diseño o el texto** y ya está todo desplegado en el bucket correcto → sí, nuevos commits + deploy ayudan.
- **Si el subdominio `integrations.gigsonsolutions.com` sigue apuntando a otro origen** (otra distribución CloudFront, otro bucket o un `index.html` estático viejo) → **no**: hace falta en AWS añadir el CNAME `integrations.gigsonsolutions.com` a la **misma** distribución CloudFront que `www.gigsonsolutions.com` y el DNS (alias) correspondiente. Hasta entonces el navegador **no descarga el SPA** de este repo en ese host.

---

## 2. Qué es cada “landing” en el código

Todo es **un solo proyecto** (`npm run build` genera un solo `dist/`).

### A) Landing Holded “estática” (HTML grande en iframe)

- **Archivo HTML:** `src/assets/holded-landing.html` (se importa como texto en React).
- **Componente:** `src/components/Pages/HoldedLandingStatic/HoldedLandingStatic.jsx`.
- **Imágenes** referenciadas en el HTML como `img/...` → deben estar en **`public/img/`** (Vite las sirve en la raíz del sitio con `<base href="/">`).

### B) Página React “Integraciones Holded” (componentes + i18n)

- **Componentes:** `src/components/Pages/Integrations/`.
- **Textos:** `src/locales/en/translation.json` y `src/locales/es/translation.json`, clave `integrations-holded`.

### C) Router (quién ve qué según URL y host)

Archivo: `src/router/index.jsx`.

- **`/landing-holded` y `/landing-holded.html`:** siempre la landing estática (iframe), sin layout corporativo.
- **`integrations.gigsonsolutions.com`** y **`staging.gigsonsolutions.com`** en la raíz `/` y `/es`:** misma landing estática que arriba, y el **Layout** no muestra navbar/footer para que coincida con `/landing-holded`.
- **Rutas tipo `/holded-integrations` (slug por idioma):** siguen siendo la página React `Integrations` si alguien enlaza ahí.

---

## 3. Cómo trabajar bien con Git (recomendado)

1. Partir de **`staging`** o **`main`** actualizado:  
   `git fetch && git checkout staging && git pull`.
2. Crear rama: `git checkout -b feature/nombre-claro`.
3. **Solo tocar las rutas que usa la app:**
   - Cambios en la landing Holded “de Alfonso” → `src/assets/holded-landing.html` + `public/img/`.
   - Cambios en la versión React de integraciones → componentes + `translation.json`.
4. Probar en local: `npm run dev` →  
   - `http://localhost:5173/landing-holded`  
   - (opcional) simular host con extensión o `/etc/hosts` si hace falta.
5. Abrir **PR hacia `staging`** para validar en **staging** (workflow `deploy-staging.yml`).
6. Cuando esté OK, **merge a `main`** para producción (`deploy.yml` → bucket principal).

### Qué evitar

- **Ramas con historial huérfano** (un commit sin padre respecto a `main`) con solo `landing-holded.html` + `img/` en la **raíz del repo**: no coinciden con la estructura Vite (`public/`, `src/assets/`) y generan confusión en los merges.
- **Subir solo un HTML gigante a S3** en otro bucket o distribución para `integrations`: deja de ser el mismo SPA; el router de React no se ejecuta.

---

## 4. URLs útiles

| Entorno | URL | Notas |
|---------|-----|--------|
| Local | `http://localhost:5173/landing-holded` | Misma landing estática que en prod si el código es el mismo. |
| Staging | `https://staging.gigsonsolutions.com/` | Deploy desde rama `staging`. |
| Producción (principal) | `https://www.gigsonsolutions.com/` | Deploy desde `main`. |
| Producción (integrations) | `https://integrations.gigsonsolutions.com/` | Debe servir el **mismo** `index.html` del SPA (~2 KB) que www; si ves un HTML enorme y antiguo, el fallo es **DNS/CloudFront**, no Git. |

---

## 5. Checklist rápido si “no se ven cambios” en integrations

1. **GitHub Actions** → workflow **Build and Deploy** en `main` → ¿último run en verde?
2. **Navegador** → probar ventana privada (caché).
3. **CloudFront (distribución de www)** → **Alternate domain names** incluye `integrations.gigsonsolutions.com` y el certificado ACM (región **us-east-1**) lo cubre.
4. **Route 53** → registro `integrations` → alias a **esa** distribución.
5. **Comprobación técnica:** `curl -sI https://integrations.gigsonsolutions.com/` → `content-length` del orden de **~2 KB** como en www, no decenas de KB de HTML estático suelto.

---

## 6. Workflows de deploy (referencia)

- **`.github/workflows/deploy.yml`** — push a **`main`**: build → S3 (secret `BUCKET_NAME`) → invalidación CloudFront (`DISTRIBUTION_ID`).
- **`.github/workflows/deploy-staging.yml`** — push a **`staging`**: bucket y distribución de staging (variables en el propio YAML).

Los secretos y IDs concretos están en GitHub → **Settings → Secrets and variables** y en la consola AWS; no los commitees en el repo.

---

*Última actualización del documento: alineado con router + Layout full-bleed en integrations/staging y con el diagnóstico de subdominio en CloudFront.*
