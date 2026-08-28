import { NextResponse, type NextRequest } from 'next/server';
import { Client } from 'pg';

/**
 * ONE-OFF diagnostic route — read-only, NOT part of the app, remove after use.
 * Same pattern/reasoning as the earlier `ops-migrate-blog-category` route
 * (see its commit history on this branch): DATABASE_URI is a Sensitive
 * Vercel env var, unreadable outside Vercel's own runtime, so schema
 * introspection has to run from inside a deployed route.
 *
 * Checks `payload_locked_documents_rels` for the columns Payload's admin
 * dashboard query needs (one per lockable collection) — the admin login
 * was failing with a Postgres error referencing this exact query.
 */
export const runtime = 'nodejs';

const ONE_TIME_TOKEN = '73aaf9cdd86704bcdfab55c2c57a3ed3a36232731444f353';

const EXPECTED_COLUMNS = ['posts_id', 'media_id', 'chatbot_leads_id', 'users_id', 'estimator_sessions_id'];

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== ONE_TIME_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!process.env.DATABASE_URI) {
    return NextResponse.json({ error: 'DATABASE_URI not set in this environment' }, { status: 500 });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URI });
  try {
    await client.connect();
    const result = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'payload_locked_documents_rels';`
    );
    const actual = result.rows.map((r) => r.column_name as string);
    const missing = EXPECTED_COLUMNS.filter((c) => !actual.includes(c));

    return NextResponse.json({ ok: true, actual, missing });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
