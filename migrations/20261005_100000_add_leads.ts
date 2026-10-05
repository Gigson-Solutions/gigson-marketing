import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the `leads` collection (collections/Leads.ts) — the site's own forms,
// which previously POSTed straight to formsubmit.co and left no record at all.
//
// Same purely additive shape as 20260821_090243_add_estimator_sessions: new
// enums, one new table, and a nullable column + FK + index on the existing
// `payload_locked_documents_rels`.
//
// Written idempotently (unlike that one), because Payload's dev-mode schema
// push will already have created this table in any database that has run
// `next dev` off this branch — re-running must be a no-op rather than an error
// that aborts the production boot.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'spam');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_leads_locale" AS ENUM('es', 'en');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"spam_reasons" varchar,
  	"name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"company" varchar,
  	"message" varchar,
  	"extra" jsonb,
  	"locale" "enum_leads_locale" DEFAULT 'es',
  	"page_path" varchar,
  	"rgpd" boolean DEFAULT false,
  	"notified_at" timestamp(3) with time zone,
  	"gclid" varchar,
  	"gbraid" varchar,
  	"wbraid" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"referrer" varchar,
  	"landing_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "leads_id" integer;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "leads_form_id_idx" ON "leads" USING btree ("form_id");
  CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "leads" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "leads_gclid_idx" ON "leads" USING btree ("gclid");
  CREATE INDEX IF NOT EXISTS "leads_utm_source_idx" ON "leads" USING btree ("utm_source");
  CREATE INDEX IF NOT EXISTS "leads_utm_campaign_idx" ON "leads" USING btree ("utm_campaign");
  CREATE INDEX IF NOT EXISTS "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_leads_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_leads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "leads_id";

  DROP TABLE IF EXISTS "leads" CASCADE;

  DROP TYPE IF EXISTS "public"."enum_leads_status";
  DROP TYPE IF EXISTS "public"."enum_leads_locale";`)
}
