import { NextResponse, type NextRequest } from 'next/server';
import { Client } from 'pg';

/**
 * ONE-OFF ops route — NOT part of the app, remove after use.
 *
 * Root cause of every page rendering dynamically instead of statically on
 * staging (found in node_modules/@payloadcms/drizzle/dist/migrate.js:30-46):
 * Payload's migration runner checks `payload_migrations` for a row with
 * `batch = -1` ("dev mode" marker, written whenever schema was synced via
 * dev-only push instead of a real migration). If found, it prompts
 * interactively; declining (the default, and what a non-interactive CI
 * build effectively gets) calls `process.exit(0)` — killing the build's
 * page-data-collection step mid-way, which is why unrelated, unfinished
 * pages fell back to fully dynamic rendering the moment
 * `payload.config.ts` gained `prodMigrations` (PR #135/#136).
 *
 * This just removes that stale marker row — it's bookkeeping, not schema
 * or content — so future builds skip the prompt entirely.
 */
export const runtime = 'nodejs';

const ONE_TIME_TOKEN = 'e68ef0ca238b16e88af8e51db7935386271c7c8330ccf372';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== ONE_TIME_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.DATABASE_URI) {
    return NextResponse.json({ error: 'DATABASE_URI not set' }, { status: 500 });
  }

  const apply = request.nextUrl.searchParams.get('apply') === 'true';

  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();

    const before = await client.query(`SELECT id, name, batch FROM payload_migrations WHERE batch = -1;`);

    if (apply && before.rows.length > 0) {
      await client.query(`DELETE FROM payload_migrations WHERE batch = -1;`);
    }

    const after = await client.query(`SELECT id, name, batch FROM payload_migrations WHERE batch = -1;`);

    return NextResponse.json({
      ok: true,
      applied: apply,
      devMarkerRowsBefore: before.rows,
      devMarkerRowsAfter: after.rows,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
