import { NextResponse, type NextRequest } from 'next/server';
import { Client } from 'pg';

/**
 * ONE-OFF ops route — NOT part of the app, remove after use.
 * Adds the `localized_version_id` column (PR #141) to staging's `posts`
 * table — same drift pattern as `category`/`locale`/`cover_image_id`
 * before it: no auto-push in production, no migration for this field yet.
 * Mirrors the exact DDL Payload generated locally for this relationship.
 */
export const runtime = 'nodejs';

const ONE_TIME_TOKEN = 'adec5d4d576217dd362d3de270e1f083a85868becf0ee73b';

const FIX_SQL = `
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "localized_version_id" integer;
DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_localized_version_id_posts_id_fk"
    FOREIGN KEY ("localized_version_id") REFERENCES "posts"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS "posts_localized_version_idx" ON "posts" ("localized_version_id");
`;

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
    if (apply) {
      await client.query(FIX_SQL);
    }
    const cols = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'localized_version_id';`
    );
    return NextResponse.json({ ok: true, applied: apply, exists: cols.rows.length > 0 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
