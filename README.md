# gigson-marketing

Web de [Gigson Solutions](https://gigsonsolutions.com) — Next.js (App Router) + Payload CMS, desplegada en Vercel.

- **Framework:** Next.js 16 (App Router, Turbopack)
- **CMS:** Payload 3 con adaptador Postgres, montado en `/admin`
- **i18n:** `next-intl`, rutas traducidas en [`i18n/routing.ts`](i18n/routing.ts) (`en` por defecto, `es` bajo `/es`)
- **Despliegue:** ver [`docs/DEPLOY.md`](docs/DEPLOY.md)

## Ramas

| Rama | Despliega en |
|---|---|
| `staging` | `staging.gigsonsolutions.com` — **es la rama de trabajo**; los PR van aquí |
| `main` | producción |

`main` y `staging` divergen. Antes de empezar, compara con la rama correcta:

```bash
git fetch && git rev-list --count origin/main..origin/staging
```

## Desarrollo local

### 1. Dependencias

```bash
npm ci
```

### 2. Base de datos

El blog, los casos y el panel de Payload no funcionan sin Postgres.

Postgres 16 en Docker, publicado en el puerto **5546**:

```bash
docker run -d --name gigson-marketing-dev-postgres -p 5546:5432 -e POSTGRES_PASSWORD=<tu-password> -e POSTGRES_DB=gigson_marketing_dev -v gigson-marketing-dev-postgres-data:/var/lib/postgresql/data postgres:16-alpine
```

Si el contenedor ya existe de antes, basta con arrancarlo:

```bash
docker start gigson-marketing-dev-postgres
```

Comprobar que responde antes de seguir:

```bash
nc -z 127.0.0.1 5546 && echo "postgres OK"
```

### 3. Variables de entorno

Copia [`.env.example`](.env.example) a `.env.local` y rellénalo, o tira de Vercel:

```bash
vercel env pull .env.local
```

`DATABASE_URI` debe apuntar al contenedor anterior y su contraseña coincidir con la
que le pasaste: `postgres://postgres:<tu-password>@127.0.0.1:5546/gigson_marketing_dev`

### 4. Arrancar

```bash
npm run dev
```

- Web: http://localhost:5173 (redirige a `/en`; el castellano vive en `/es`)
- Panel de Payload: http://localhost:5173/admin

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (ver el aviso de abajo) |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint con `--fix` |
| `npx tsc --noEmit` | Comprobación de tipos |

### `npm run build` no funciona en local (y es esperado)

**Usa `npm run dev` para trabajar, y verifica los builds en el preview de Vercel del
PR.** Un `next build` en local no sale adelante contra ninguna base de datos, y el
motivo merece conocerse porque el síntoma más común no da ningún error.

[`payload.config.ts`](payload.config.ts) declara `prodMigrations`, que Payload aplica
automáticamente cuando `NODE_ENV=production`. `next build` pone `NODE_ENV=production`,
así que siempre intenta migrar. A partir de ahí, las dos salidas posibles:

**Contra la BD de desarrollo** — su esquema es el que le empujó el push automático de
`next dev`, que diverge de las migraciones. Payload pregunta **por stdin y sin
timeout**:

> *It looks like you've run Payload in dev mode... If you'd like to run migrations,
> data loss will occur. Would you like to proceed? (y/N)*

El build se queda ahí parado indefinidamente, sin error y sin pista. Si un build parece
colgado, es esto. **No respondas `y`**: avisa de pérdida de datos. Para descartarlo de
un vistazo, lanza el build con `< /dev/null` y fallará en vez de colgarse.

**Contra una BD vacía** — falla con `relation "payload_locked_documents_rels" does not
exist`. No hay migración base: las de [`migrations/`](migrations) son puramente
incrementales y dan por hecho un esquema previo creado por el push de Payload. Es un
compromiso deliberado, documentado en la cabecera de
[`20260821_090243_add_estimator_sessions.ts`](migrations/20260821_090243_add_estimator_sessions.ts):
*"It will NOT succeed against a truly empty database"*.

En Vercel sí funciona porque esas bases de datos ya tienen el esquema base y las
migraciones solo aplican los deltas.

## Trabajar en un git worktree

Los worktrees viven bajo `.claude/worktrees/`, **dentro** del repo principal. Eso trae
dos trampas:

1. Next detecta dos `package-lock.json` y elige como raíz la del repo principal. Sale
   como aviso en cada build; es inofensivo mientras ejecutes los comandos desde el
   worktree.
2. Cada worktree necesita su propio `npm ci` y su propio `.env.local` — no los hereda.

Ejecuta siempre los comandos desde el directorio del worktree, no desde el repo
principal, o estarás verificando el código equivocado.

## Notas

- El blog y los casos se sirven desde Payload: sin base de datos local esas páginas
  fallan aunque el resto del sitio compile.
- Las migraciones de Payload viven en [`migrations/`](migrations) y se registran en
  `migrations/index.ts`.
- Las landings de campaña (route group `(landing)`) llevan `noindex` a propósito y no
  comparten el layout del sitio. No las unifiques con las páginas de servicio.
