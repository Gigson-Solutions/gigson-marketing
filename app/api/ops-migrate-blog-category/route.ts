import { NextResponse, type NextRequest } from 'next/server';
import { Client } from 'pg';

/**
 * ONE-OFF ops migration — NOT part of the app, remove after use.
 *
 * `DATABASE_URI` on Vercel is a "Sensitive" env var: its value cannot be
 * read back by anyone (dashboard or CLI) once set, so it's impossible to
 * pull it locally and run Payload's normal dev-only schema push against
 * staging (`pushDevSchema` also only runs when NODE_ENV !== 'production',
 * which is never true on Vercel). This route runs the exact DDL that
 * `collections/Posts.ts`'s new `category` select field requires — verified
 * locally beforehand against an identical schema — from *inside* Vercel's
 * runtime, where the real value is injected but never exposed to a human
 * or to this code's own response. Idempotent: safe to call more than once.
 *
 * Gated by a one-time random token generated for this commit (not an env
 * var — `PAYLOAD_PREVIEW_SECRET` turned out not to be set on staging) so
 * it isn't a publicly open endpoint during the short window it's live.
 * This whole route is deleted in the very next commit after use.
 */
export const runtime = 'nodejs';

const ONE_TIME_TOKEN = '534e1970da04cfa4b02ae63e79de8fa52f8cf7d67e0faf42';

const CHECK_SQL = `SELECT column_name FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'category';`;

const UP_SQL = `
DO $$ BEGIN
  CREATE TYPE "public"."enum_posts_category" AS ENUM(
    'agentes-ia', 'integraciones-erp', 'ciberseguridad', 'ingenieria-software',
    'consultoria-tecnologica', 'casos-exito', 'sectores'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" "public"."enum_posts_category";
`;

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
    const before = await client.query(CHECK_SQL);
    const alreadyExisted = before.rows.length > 0;

    if (!alreadyExisted) {
      await client.query(UP_SQL);
    }

    const after = await client.query(CHECK_SQL);
    return NextResponse.json({ ok: true, alreadyExisted, existsNow: after.rows.length > 0 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    await client.end().catch(() => {});
  }
}
