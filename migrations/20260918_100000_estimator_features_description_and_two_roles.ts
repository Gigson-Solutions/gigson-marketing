import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Step 5 use cases now carry a single plain-language `description` instead of
// a user story + acceptance criteria, and their hours are split between two
// roles (consulting / building) instead of five (frontend/qa/backend/uiux/
// bapm). See collections/EstimatorSessions.ts.
//
// Additive on purpose, like every other migration on this collection: the
// old columns (`user_story`, `hours_frontend`…`hours_bapm`) and the
// `estimator_sessions_features_acceptance_criteria` table stay behind,
// holding the data of sessions estimated under the old model. Payload no
// longer reads or writes them — they're all nullable, so inserts are fine —
// and dropping them would throw away historical leads' estimates.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions_features" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "estimator_sessions_features" ADD COLUMN IF NOT EXISTS "hours_consulting" numeric DEFAULT 0;
  ALTER TABLE "estimator_sessions_features" ADD COLUMN IF NOT EXISTS "hours_building" numeric DEFAULT 0;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions_features" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "estimator_sessions_features" DROP COLUMN IF EXISTS "hours_consulting";
  ALTER TABLE "estimator_sessions_features" DROP COLUMN IF EXISTS "hours_building";`)
}
