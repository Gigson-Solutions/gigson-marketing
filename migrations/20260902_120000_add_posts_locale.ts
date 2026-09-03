import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the `locale` field (see collections/Posts.ts) that `/blog` and
// `/blog/[slug]` need to serve the correct language per post. `main` had
// never run a Payload migration against production before this one — the
// `posts` table already exists with real rows (created before this field
// existed), so this is a purely additive ALTER TABLE with a NOT NULL
// DEFAULT 'es' (backfills existing rows automatically), followed by a
// one-time data fix to correct the two posts that are actually in English
// (identified by slug — verified against the live site before writing this).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_posts_locale" AS ENUM ('en', 'es');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "locale" "public"."enum_posts_locale" NOT NULL DEFAULT 'es';
  UPDATE "posts" SET "locale" = 'en' WHERE "slug" IN ('automate-holded-with-ai', 'ai-agents-connected-to-your-erp');`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "locale";
  DROP TYPE IF EXISTS "public"."enum_posts_locale";`)
}
