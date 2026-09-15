/**
 * Runs a one-off script that needs Payload's Local API.
 *
 * `payload.config.ts` can normally only be loaded by Next's bundler: the repo is
 * CommonJS (no `"type": "module"`), so Node treats every `.ts` as CJS, while the
 * config's dependency graph is ESM with top-level await. Loading it directly —
 * with tsx, with `payload` — fails on ERR_REQUIRE_ASYNC_MODULE.
 *
 * So bundle first, then run. The heavy and native packages stay external;
 * everything else is inlined, which also fixes the extensionless relative
 * imports inside `payload-oauth2` that bare ESM cannot resolve.
 *
 * The bundle is written to the project root so `node_modules` resolution works
 * for the externals, and removed afterwards.
 *
 *   node scripts/run-payload-script.mjs scripts/upload-blog-covers.mts
 */
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = process.argv[2];
if (!entry) throw new Error('Usage: node scripts/run-payload-script.mjs <script.mts>');

const bundle = path.join(ROOT, '.payload-script.mjs');
const external = ['payload', '@payloadcms/*', 'sharp', 'pg', 'graphql', 'next', 'react', 'react-dom'];

try {
  execFileSync(
    path.join(ROOT, 'node_modules/.bin/esbuild'),
    [
      entry,
      '--bundle',
      '--format=esm',
      '--platform=node',
      '--target=node22',
      `--outfile=${bundle}`,
      '--log-level=error',
      ...external.map((name) => `--external:${name}`),
    ],
    { cwd: ROOT, stdio: 'inherit' },
  );
  execFileSync(process.execPath, [bundle], { cwd: ROOT, stdio: 'inherit' });
} finally {
  rmSync(bundle, { force: true });
}
