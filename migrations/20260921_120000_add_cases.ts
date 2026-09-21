import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the `cases` collection (see collections/Cases.ts): the main table, one
// child table per array field, the two select enums, the self-referencing
// `localized_version_id` FK, and the `payload_locked_documents_rels` column
// the admin needs to lock a document.
//
// Every statement is defensive (`IF NOT EXISTS` / duplicate_object catch),
// following the convention the sibling migrations already set, since this
// repo's migrations must tolerate a database that picked up part of the
// schema informally via dev-mode push.
//
// NOT run against a real database as part of this PR — the schema shape is
// mirrored from `20260918_130000_add_authors` (array child tables, upload and
// relationship FK columns, locked-documents wiring) and
// `20260902_120000_add_posts_locale` (select enums) rather than generated with
// `npx payload migrate:create`. The real verification is the Vercel preview
// build log, which runs `prodMigrations`; check that first if anything about
// `cases` breaks at runtime.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_cases_locale" AS ENUM ('en', 'es');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_cases_status" AS ENUM ('draft', 'published');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"challenge" varchar NOT NULL,
  	"solution" varchar,
  	"cover_image_id" integer,
  	"locale" "public"."enum_cases_locale" DEFAULT 'es' NOT NULL,
  	"localized_version_id" integer,
  	"status" "public"."enum_cases_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "cases_slug_idx" ON "cases" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "cases_cover_image_idx" ON "cases" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "cases_localized_version_idx" ON "cases" USING btree ("localized_version_id");
  CREATE INDEX IF NOT EXISTS "cases_updated_at_idx" ON "cases" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "cases_created_at_idx" ON "cases" USING btree ("created_at");
  DO $$ BEGIN
    ALTER TABLE "cases" ADD CONSTRAINT "cases_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "cases" ADD CONSTRAINT "cases_localized_version_id_cases_id_fk" FOREIGN KEY ("localized_version_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "cases_features_order_idx" ON "cases_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_features_parent_id_idx" ON "cases_features" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "cases_features" ADD CONSTRAINT "cases_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "cases_results_order_idx" ON "cases_results" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_results_parent_id_idx" ON "cases_results" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "cases_results" ADD CONSTRAINT "cases_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "cases_tools_order_idx" ON "cases_tools" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_tools_parent_id_idx" ON "cases_tools" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "cases_tools" ADD CONSTRAINT "cases_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "cases_tags_order_idx" ON "cases_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_tags_parent_id_idx" ON "cases_tags" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "cases_tags" ADD CONSTRAINT "cases_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "cases_need" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  CREATE INDEX IF NOT EXISTS "cases_need_order_idx" ON "cases_need" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "cases_need_parent_id_idx" ON "cases_need" USING btree ("_parent_id");
  DO $$ BEGIN
    ALTER TABLE "cases_need" ADD CONSTRAINT "cases_need_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "cases_id" integer;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cases_fk" FOREIGN KEY ("cases_id") REFERENCES "public"."cases"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("cases_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_cases_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_cases_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "cases_id";

  DROP TABLE IF EXISTS "cases_need" CASCADE;
  DROP TABLE IF EXISTS "cases_tags" CASCADE;
  DROP TABLE IF EXISTS "cases_tools" CASCADE;
  DROP TABLE IF EXISTS "cases_results" CASCADE;
  DROP TABLE IF EXISTS "cases_features" CASCADE;
  DROP TABLE IF EXISTS "cases" CASCADE;

  DROP TYPE IF EXISTS "public"."enum_cases_status";
  DROP TYPE IF EXISTS "public"."enum_cases_locale";`)
}
