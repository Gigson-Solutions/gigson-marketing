import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the `authors` collection (see collections/Authors.ts) and links it
// from `posts` via a new `author_profile_id` column — additive only, the
// legacy `posts.author` text column is untouched. Every statement is
// defensive (`IF NOT EXISTS` / duplicate_object catch) following the same
// convention as `20260903_100000_add_media_and_posts_category_localized_version`,
// since this repo's migrations must tolerate a database that already picked
// up part of this schema informally via dev-mode push.
//
// NOT run against a real database as part of this PR — verified by
// inspection against the sibling migrations' generated SQL shape (array
// field child table, group field column prefixing, upload/relationship FK
// columns) rather than `npx payload migrate:create`, to avoid interfering
// with the shared local dev Postgres other worktrees/sessions are using.
// The real verification is the Vercel preview build log for this PR, which
// runs `prodMigrations` — check that first if anything about `authors`
// breaks at runtime.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"job_title_es" varchar,
  	"job_title_en" varchar,
  	"bio_es" varchar,
  	"bio_en" varchar,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "authors_photo_idx" ON "authors" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "authors_created_at_idx" ON "authors" USING btree ("created_at");
  DO $$ BEGIN
    ALTER TABLE "authors" ADD CONSTRAINT "authors_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "authors_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "authors_knows_about_order_idx" ON "authors_knows_about" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "authors_knows_about_parent_id_idx" ON "authors_knows_about" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "authors_knows_about" ADD CONSTRAINT "authors_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_profile_id" integer;
  DO $$ BEGIN
    ALTER TABLE "posts" ADD CONSTRAINT "posts_author_profile_id_authors_id_fk" FOREIGN KEY ("author_profile_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "posts_author_profile_idx" ON "posts" USING btree ("author_profile_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "authors_id" integer;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_authors_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "authors_id";

  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_author_profile_id_authors_id_fk";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "author_profile_id";

  DROP TABLE IF EXISTS "authors_knows_about" CASCADE;
  DROP TABLE IF EXISTS "authors" CASCADE;`)
}
