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

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== ONE_TIME_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.DATABASE_URI) {
    return NextResponse.json({ error: 'DATABASE_URI not set' }, { status: 500 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    const cols = await client.query(
      `SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'posts' ORDER BY ordinal_position;`
    );
    const actual = cols.rows.map((r) => r.column_name as string);
    const missing = EXPECTED_COLUMNS.filter((c) => !actual.includes(c));

    const enums = await client.query(
      `SELECT t.typname, e.enumlabel FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname LIKE 'enum_posts_%' ORDER BY t.typname, e.enumsortorder;`
    );

    return NextResponse.json({
      ok: true,
      columns: cols.rows,
      missing,
      enums: enums.rows,
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
