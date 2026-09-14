/**
 * Puts the generated covers into Payload's `media` library and points each
 * post's `coverImage` at one.
 *
 * The blog already draws these compositions inline, so this is about the CMS:
 * an editor sees a real image, and Payload's derived sizes feed the OG tag.
 *
 *   npm run covers:generate                               # first, the PNGs
 *   PAYLOAD_MIGRATING=true npm run covers:upload          # dry run — prints the target
 *   PAYLOAD_MIGRATING=true COVERS_CONFIRM=1 npm run covers:upload
 *
 * Re-running is safe: media is matched by filename and updated in place, and a
 * post whose cover is already correct is skipped.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { getPayload } from 'payload';

// Relative import: `@payload-config` is a tsconfig path alias that Next resolves
// at build time, and this script runs outside that pipeline.
import config from '../payload.config.ts';

// `import.meta.url` is unreliable here: the runner bundles this file to the
// project root, so a path relative to the module would resolve one level up.
// The runner always sets cwd to the project root instead.
const ROOT = process.cwd();
if (!existsSync(path.join(ROOT, 'package.json'))) {
  throw new Error(`Run this through \`npm run covers:upload\` — expected the project root as cwd, got ${ROOT}`);
}
const COVERS_DIR = path.join(ROOT, 'public/img/blog-covers');

/**
 * One media document per post, not per image.
 *
 * `Media.alt` is a plain text field — the project does not use Payload
 * localisation — so a single shared document would force one language's alt
 * text onto both translations. Two extra rows is a cheap price for correct
 * alt text and OG metadata in each language.
 */
type Spec = { postSlug: string; png: string; mediaFilename: string; alt: string };

const SPECS: Spec[] = [
  {
    postSlug: 'agentes-ia-conectados-erp-holded-odoo',
    png: 'agentes.png',
    mediaFilename: 'blog-agentes-ia-conectados-erp-holded-odoo.png',
    alt: 'Ilustración abstracta: un bocadillo morado y un hexágono verde azulado se solapan sobre fondo crema, con destellos ámbar.',
  },
  {
    postSlug: 'ai-agents-connected-to-your-erp',
    png: 'agentes.png',
    mediaFilename: 'blog-ai-agents-connected-to-your-erp.png',
    alt: 'Abstract illustration: a purple speech bubble and a teal hexagon overlap on a cream background, with amber sparkles.',
  },
  {
    postSlug: 'automatiza-tu-holded-con-ia',
    png: 'automatizar.png',
    mediaFilename: 'blog-automatiza-tu-holded-con-ia.png',
    alt: 'Ilustración abstracta: un arco morado junto a una retícula verde azulada y círculos ámbar sobre fondo crema.',
  },
  {
    postSlug: 'automate-holded-with-ai',
    png: 'automatizar.png',
    mediaFilename: 'blog-automate-holded-with-ai.png',
    alt: 'Abstract illustration: a purple arch beside a teal grid and amber circles on a cream background.',
  },
];

// `@payloadcms/db-postgres` runs `pushDevSchema` on connect whenever NODE_ENV is
// not production and this flag is unset — it would diff payload.config.ts
// against the live database and alter it, silently when drizzle has no warnings.
// Never connect to a shared database without it.
if (process.env.PAYLOAD_MIGRATING !== 'true') {
  throw new Error(
    'Refusing to run: set PAYLOAD_MIGRATING=true so Payload does not push schema changes ' +
      '(see @payloadcms/db-postgres/dist/connect.js).',
  );
}

const payload = await getPayload({ config });

// Say out loud which database is about to be written to. Staging and production
// have shared one before now, and the covers are user-visible content.
const { host } = new URL(process.env.DATABASE_URI ?? '');
const { rows } = await payload.db.pool.query(
  'SELECT current_database() AS db, (SELECT count(*) FROM posts) AS posts, (SELECT count(*) FROM media) AS media',
);
console.log(`TARGET  host=${host}  db=${rows[0].db}  posts=${rows[0].posts}  media=${rows[0].media}`);

if (!process.env.COVERS_CONFIRM) {
  console.log('\nDry run. Re-run with COVERS_CONFIRM=1 to write.');
  process.exit(0);
}

for (const spec of SPECS) {
  // Find the post first, so a wrong slug can never leave orphaned media behind.
  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: spec.postSlug } },
    depth: 0,
    limit: 2,
  });
  if (posts.totalDocs !== 1) {
    throw new Error(`Expected exactly 1 post for slug "${spec.postSlug}", found ${posts.totalDocs}`);
  }
  const post = posts.docs[0];

  const data = await readFile(path.join(COVERS_DIR, spec.png));
  const file = { name: spec.mediaFilename, data, mimetype: 'image/png', size: data.length };

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: spec.mediaFilename } },
    depth: 0,
    limit: 2,
  });
  if (existing.totalDocs > 1) {
    throw new Error(`Duplicate media rows for ${spec.mediaFilename} — clean them up in /admin first`);
  }

  // `overwriteExistingFiles` is implicit for `filePath` but not for `file`, and
  // without it a re-run would add a suffixed copy instead of replacing.
  const media =
    existing.totalDocs === 1
      ? await payload.update({
          collection: 'media',
          id: existing.docs[0].id,
          data: { alt: spec.alt },
          file,
          overwriteExistingFiles: true,
        })
      : await payload.create({
          collection: 'media',
          data: { alt: spec.alt },
          file,
          overwriteExistingFiles: true,
        });

  const current = typeof post.coverImage === 'object' ? post.coverImage?.id : post.coverImage;
  if (current === media.id) {
    console.log(`=  ${spec.postSlug} already points at media ${media.id}`);
    continue;
  }

  await payload.update({ collection: 'posts', id: post.id, data: { coverImage: media.id }, depth: 0 });
  console.log(`OK ${spec.postSlug} -> media ${media.id} (${spec.mediaFilename})`);
}

// Payload holds the pg pool open otherwise.
process.exit(0);
