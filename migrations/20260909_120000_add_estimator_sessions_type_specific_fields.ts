import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the type-specific Step 2/3 fields (see collections/EstimatorSessions.ts)
// introduced when appSize/platforms/uiLevel/qaLevel stopped being asked to
// every project type. Same pattern as the projectType migration: plain
// nullable text/number/checkbox columns, purely additive, no enum type, no
// FK, no index.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "erp_system" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "erp_modules" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "erp_users" numeric;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "migration_needed" boolean;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "integration_direction" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "integration_frequency" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "consulting_scope" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "consulting_engagement" varchar;

  CREATE TABLE IF NOT EXISTS "estimator_sessions_integration_systems" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  DO $$ BEGIN
   ALTER TABLE "estimator_sessions_integration_systems" ADD CONSTRAINT "estimator_sessions_integration_systems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."estimator_sessions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "estimator_sessions_integration_systems_order_idx" ON "estimator_sessions_integration_systems" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "estimator_sessions_integration_systems_parent_id_idx" ON "estimator_sessions_integration_systems" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "estimator_sessions_integration_systems" CASCADE;
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "consulting_engagement";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "consulting_scope";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "integration_frequency";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "integration_direction";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "migration_needed";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "erp_users";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "erp_modules";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "erp_system";`)
}
