/**
 * Moves the five case studies from `messages/{en,es}.json` (`casesDropdown`)
 * into the `cases` collection, so each one gets a URL of its own.
 *
 *   PAYLOAD_MIGRATING=true node --env-file-if-exists=.env.local \
 *     scripts/run-payload-script.mjs scripts/seed-cases.mts          # dry run
 *   PAYLOAD_MIGRATING=true CASES_CONFIRM=1 node --env-file-if-exists=.env.local \
 *     scripts/run-payload-script.mjs scripts/seed-cases.mts
 *
 * For another environment, point Node at that env file instead — note
 * `vercel env pull` cannot decrypt DATABASE_URI or PAYLOAD_SECRET, so write it
 * by hand (same caveat as `upload-blog-covers.mts`).
 *
 * Re-running is safe: a case is matched by slug and updated in place, never
 * duplicated. The `localizedVersion` link is set on the ES document and the
 * collection's afterChange hook mirrors it back onto the EN one.
 *
 * Until this has run, `/casos` falls back to the message-file copy it has
 * always rendered (see `app/[locale]/(site)/cases/page.tsx`), so the site is
 * correct both before and after.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { getPayload } from 'payload';

// Relative import: `@payload-config` is a tsconfig path alias Next resolves at
// build time, and this script runs outside that pipeline.
import config from '../payload.config.ts';

const ROOT = process.cwd();
if (!existsSync(path.join(ROOT, 'package.json'))) {
  throw new Error(`Run this through scripts/run-payload-script.mjs — expected the project root as cwd, got ${ROOT}`);
}

const CONFIRM = process.env.CASES_CONFIRM === '1';

/**
 * Slugs are declared rather than derived from the titles. Slugifying would
 * produce `integracion-crm-erp` from one locale and `crm-erp-integration` from
 * the other anyway, and a generated slug silently changes the day someone
 * edits a title — which would break every link already pointing at the case.
 * Indexed by position in `casesDropdown`, which is EN/ES aligned.
 */
const SLUGS: { en: string; es: string }[] = [
  { en: 'crm-erp-integration', es: 'integracion-crm-erp' },
  { en: 'budget-configurator', es: 'configurador-de-presupuestos' },
  { en: 'ecommerce-tool-integration', es: 'integracion-herramientas-ecommerce' },
  { en: 'platform-for-creative-agencies', es: 'plataforma-agencias-creativas' },
  { en: 'ai-agent-for-operations', es: 'agente-ia-operaciones' },
];

type RawCase = {
  title: string;
  challenge: string;
  solution?: string;
  features?: string[];
  results?: string[];
  tools?: string[];
  tags?: string[];
  need?: string[];
};

const rows = (values?: string[]) => (values ?? []).map((text) => ({ text }));

function readCases(locale: 'es' | 'en'): RawCase[] {
  const file = path.join(ROOT, `messages/${locale}.json`);
  const messages = JSON.parse(readFileSync(file, 'utf8'));
  return (messages.casesDropdown ?? []) as RawCase[];
}

async function main() {
  const payload = await getPayload({ config });

  const es = readCases('es');
  const en = readCases('en');

  if (es.length !== SLUGS.length || en.length !== SLUGS.length) {
    throw new Error(
      `casesDropdown has ${es.length} ES / ${en.length} EN entries but SLUGS declares ${SLUGS.length}. ` +
        'Add the new slug(s) before seeding — positions must line up.',
    );
  }

  const created: Record<string, string | number> = {};

  for (const locale of ['en', 'es'] as const) {
    const source = locale === 'es' ? es : en;

    for (const [index, raw] of source.entries()) {
      const slug = SLUGS[index][locale];
      const data = {
        title: raw.title,
        slug,
        challenge: raw.challenge,
        solution: raw.solution,
        features: rows(raw.features),
        results: rows(raw.results),
        tools: rows(raw.tools),
        tags: rows(raw.tags),
        need: rows(raw.need),
        locale,
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        // The ES document carries the link; the afterChange hook in
        // collections/Cases.ts writes the reverse one onto the EN document.
        ...(locale === 'es' && created[SLUGS[index].en]
          ? { localizedVersion: created[SLUGS[index].en] }
          : {}),
      };

      const existing = await payload.find({
        collection: 'cases',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      });

      if (!CONFIRM) {
        console.log(`[dry run] ${existing.docs.length ? 'update' : 'create'} ${locale} ${slug} — ${raw.title}`);
        continue;
      }

      if (existing.docs.length > 0) {
        const doc = await payload.update({ collection: 'cases', id: existing.docs[0].id, data, depth: 0 });
        created[slug] = doc.id;
        console.log(`updated ${locale} ${slug}`);
      } else {
        const doc = await payload.create({ collection: 'cases', data, depth: 0 });
        created[slug] = doc.id;
        console.log(`created ${locale} ${slug}`);
      }
    }
  }

  if (!CONFIRM) {
    console.log('\nDry run — nothing was written. Re-run with CASES_CONFIRM=1 to apply.');
  }
}

await main();
process.exit(0);
