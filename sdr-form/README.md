# SDR application form

Formulario estático de candidatura para el rol **SDR — Software & IA** de gigson solutions.

- **Bundle web:** [`public/apply-sdr/`](../public/apply-sdr/) → servido en **`www.gigsonsolutions.com/apply-sdr`**.
- **Backend:** `Code.gs` (Google Apps Script) — gestiona los envíos. No forma parte del deploy web.

Las candidaturas se quedan dentro de vuestro Google Workspace — sin servicios de formularios de
terceros. Las respuestas se añaden a un Google Sheet; los CVs subidos se guardan en una carpeta de
Drive (ambos dentro de la carpeta de **Ventas** de Gigson), y el Sheet guarda el enlace a cada CV.

---

## Archivos
| Archivo | Qué es |
|---------|--------|
| `../public/apply-sdr/index.html` | El formulario (autocontenido: logo SVG inline, fuentes DM Sans + Inter vía Google Fonts). |
| `Code.gs` | Backend de Google Apps Script — se pega en Apps Script, NO se despliega con la web. |

---

## Identidad gráfica

Adaptado a la marca gigson solutions: morado `#7874F4` (acento), tinta `#3C3C3B`, fondo crema
`#F4F3EF`, lavandas `#E3E1EE` / `#EEEDF0`, tipografías **DM Sans** (display) + **Inter** (cuerpo),
botones tipo pill y tarjetas planas sin sombra. Wordmark inline (gigson + solutions).

---

## Hosting — @jaume

Vive en `public/apply-sdr/`, así que el build de Vite lo sirve en `www.gigsonsolutions.com/apply-sdr`.
`public/apply-sdr/index.html` resuelve en `/apply-sdr/`; si quieres que la URL limpia sin barra
final `/apply-sdr` también resuelva, añade una redirección/rewrite.

**Mantenlo sin indexar (accesible solo por el enlace directo):**
- La página ya envía `<meta name="robots" content="noindex, nofollow, noarchive">`.
- **NO** lo enlaces desde la nav, el footer ni el **sitemap**, y **NO** añadas
  `Disallow: /apply-sdr` al `robots.txt` — bloquear el rastreo impediría a los buscadores leer la
  etiqueta `noindex`. La etiqueta meta + no estar enlazado es lo que lo mantiene fuera de búsquedas.

---

## Estado

- ✅ **Sheet creado**: `SDR_aplicantes` (ID `1nKvzZqRZ7Kp6rktfFYfDtCkmgcscMY7TxeOprNlMh7U`) en la carpeta de destino.
- ✅ **Carpeta de CVs creada**: `SDR_aplicantes_CVs` (ID `1cVbP56ad8MMWgpsmxUJ-lSCBElsvDJN1`).
- ✅ **IDs cableados** en `Code.gs`.
- ✅ **Aviso legal (RGPD)** relleno en `index.html`: responsable Awesomely, S.L. (CIF B22482137, C/ Lepant 270, 08013 Barcelona), contacto legal@awesomelygroup.com.

## Pendiente (manual, ~3 min — no automatizable vía API)

1. Abrir el Sheet `SDR_aplicantes` → **Extensiones ▸ Apps Script** → pegar `Code.gs` → guardar.
2. Ejecutar **`setupHeaders()`** una vez (autorizar cuando lo pida) — escribe la cabecera.
3. **Implementar ▸ Nueva implementación ▸ Aplicación web** (Ejecutar como: Yo · Acceso: Cualquiera) → copiar la URL.
4. Pegar esa URL en `SCRIPT_URL` dentro de `public/apply-sdr/index.html` (sustituye `[PEGAR_URL_DEL_APPS_SCRIPT]`).
5. (Opcional) Rewrite para que la URL sin barra final `/apply-sdr` también resuelva.
