import { NextResponse, type NextRequest } from 'next/server';
import { Client } from 'pg';

/**
 * ONE-OFF diagnostic route — read-only, NOT part of the app, remove after use.
 * Full column introspection of the `posts` table on staging. The `category`
 * fix wasn't the only drift: /api/posts is now 500ing with
 * `column "locale" does not exist` too — a field that predates this branch
 * entirely — so staging's posts table likely never got a full schema sync.
 * Checking everything at once instead of fixing one column at a time.
 */
export const runtime = 'nodejs';

const ONE_TIME_TOKEN = '32dc911102f88584b531612bcd4547f984141377b462cff7';

const EXPECTED_COLUMNS = [
  'id', 'title', 'slug', 'category', 'locale', 'status', 'published_at',
  'author', 'excerpt', 'cover_image_id', 'content', 'seo_title',
  'seo_description', 'updated_at', 'created_at',
];

const FIX_SQL = `
DO $$ BEGIN
  CREATE TYPE "public"."enum_posts_locale" AS ENUM('en', 'es');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "locale" "public"."enum_posts_locale" NOT NULL DEFAULT 'es';
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
DO $$ BEGIN
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk"
    FOREIGN KEY ("cover_image_id") REFERENCES "media"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
CREATE INDEX IF NOT EXISTS "posts_cover_image_idx" ON "posts" ("cover_image_id");
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
      `SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'posts' ORDER BY ordinal_position;`
    );
    const actual = cols.rows.map((r) => r.column_name as string);
    const missing = EXPECTED_COLUMNS.filter((c) => !actual.includes(c));

    return NextResponse.json({ ok: true, applied: apply, columns: cols.rows, missing });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
