import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Hand-scoped down to ONLY the `estimator-sessions` collection (see
// collections/EstimatorSessions.ts). Generated via Payload's own
// createMigration() against a dev database that already had the full
// pre-existing schema (posts/media/users/chatbot_leads/payload_*), then
// trimmed to just the new statements — this repo has no prior migration
// history, so a "true" first migration would try to re-create every
// existing table. This migration is purely additive (new enums, new
// tables, one new nullable column + FK + index on the existing
// `payload_locked_documents_rels` table) and assumes those pre-existing
// tables already exist, which they do in every real environment (they
// were created via Payload's dev-mode schema push). It will NOT succeed
// against a truly empty database — see the "no migration system yet"
// discussion in the PR for that tradeoff.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_estimator_sessions_features_source" AS ENUM('ai', 'manual');
  CREATE TYPE "public"."enum_estimator_sessions_status" AS ENUM('draft', 'generating', 'features_ready', 'generation_failed', 'finalized', 'completed');
  CREATE TYPE "public"."enum_estimator_sessions_locale" AS ENUM('es', 'en');

  CREATE TABLE "estimator_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"public_token" varchar NOT NULL,
  	"status" "enum_estimator_sessions_status" DEFAULT 'draft',
  	"locale" "enum_estimator_sessions_locale" DEFAULT 'es',
  	"page_path" varchar,
  	"source" varchar DEFAULT 'project-estimator',
  	"hourly_rate" numeric NOT NULL,
  	"project_description" varchar NOT NULL,
  	"business_domain" varchar NOT NULL,
  	"business_domain_other" varchar,
  	"roles" varchar,
  	"roles_other" varchar,
  	"app_size" varchar,
  	"platforms" varchar,
  	"ui_level" varchar,
  	"qa_level" varchar,
  	"timeline_mode" varchar,
  	"timeline_overall_months" numeric,
  	"timeline_phase_mvp_months" numeric,
  	"timeline_phase2_months" numeric,
  	"timeline_phase_future_months" numeric,
  	"team_composition" jsonb,
  	"timeline" jsonb,
  	"total_hours" numeric,
  	"total_budget" numeric,
  	"lead_email" varchar,
  	"lead_name" varchar,
  	"lead_company" varchar,
  	"rgpd" boolean DEFAULT false,
  	"lead_captured_at" timestamp(3) with time zone,
  	"team_notified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "estimator_sessions_competitors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );

  CREATE TABLE "estimator_sessions_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client_id" varchar,
  	"name" varchar NOT NULL,
  	"user_story" varchar,
  	"third_party_services" varchar,
  	"hours_frontend" numeric DEFAULT 0,
  	"hours_qa" numeric DEFAULT 0,
  	"hours_backend" numeric DEFAULT 0,
  	"hours_uiux" numeric DEFAULT 0,
  	"hours_bapm" numeric DEFAULT 0,
  	"source" "enum_estimator_sessions_features_source" DEFAULT 'manual'
  );

  CREATE TABLE "estimator_sessions_features_acceptance_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "estimator_sessions_id" integer;

  ALTER TABLE "estimator_sessions_competitors" ADD CONSTRAINT "estimator_sessions_competitors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."estimator_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "estimator_sessions_features" ADD CONSTRAINT "estimator_sessions_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."estimator_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "estimator_sessions_features_acceptance_criteria" ADD CONSTRAINT "estimator_sessions_features_acceptance_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."estimator_sessions_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_estimator_sessions_fk" FOREIGN KEY ("estimator_sessions_id") REFERENCES "public"."estimator_sessions"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX "estimator_sessions_public_token_idx" ON "estimator_sessions" USING btree ("public_token");
  CREATE INDEX "estimator_sessions_updated_at_idx" ON "estimator_sessions" USING btree ("updated_at");
  CREATE INDEX "estimator_sessions_created_at_idx" ON "estimator_sessions" USING btree ("created_at");
  CREATE INDEX "estimator_sessions_competitors_order_idx" ON "estimator_sessions_competitors" USING btree ("_order");
  CREATE INDEX "estimator_sessions_competitors_parent_id_idx" ON "estimator_sessions_competitors" USING btree ("_parent_id");
  CREATE INDEX "estimator_sessions_features_order_idx" ON "estimator_sessions_features" USING btree ("_order");
  CREATE INDEX "estimator_sessions_features_parent_id_idx" ON "estimator_sessions_features" USING btree ("_parent_id");
  CREATE INDEX "estimator_sessions_features_acceptance_criteria_order_idx" ON "estimator_sessions_features_acceptance_criteria" USING btree ("_order");
  CREATE INDEX "estimator_sessions_features_acceptance_criteria_parent_id_idx" ON "estimator_sessions_features_acceptance_criteria" USING btree ("_parent_id");
  CREATE INDEX "payload_locked_documents_rels_estimator_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("estimator_sessions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_estimator_sessions_fk";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_estimator_sessions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "estimator_sessions_id";

  DROP TABLE IF EXISTS "estimator_sessions_features_acceptance_criteria" CASCADE;
  DROP TABLE IF EXISTS "estimator_sessions_features" CASCADE;
  DROP TABLE IF EXISTS "estimator_sessions_competitors" CASCADE;
  DROP TABLE IF EXISTS "estimator_sessions" CASCADE;

  DROP TYPE IF EXISTS "public"."enum_estimator_sessions_features_source";
  DROP TYPE IF EXISTS "public"."enum_estimator_sessions_status";
  DROP TYPE IF EXISTS "public"."enum_estimator_sessions_locale";`)
}
