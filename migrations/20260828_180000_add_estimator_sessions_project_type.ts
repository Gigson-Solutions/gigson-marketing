import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds the `projectType`/`projectTypeOther` fields (see
// collections/EstimatorSessions.ts) — plain nullable text columns, matching
// the pattern already used for businessDomain/appSize/uiLevel/qaLevel on
// this collection, so this migration is a minimal, purely additive
// ALTER TABLE (no new enum type, no FK, no index needed).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "project_type" varchar;
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "project_type_other" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "project_type_other";
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "project_type";`)
}
