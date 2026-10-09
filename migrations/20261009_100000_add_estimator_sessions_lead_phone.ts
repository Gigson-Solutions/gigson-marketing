import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds `leadPhone` to `estimator_sessions` (see collections/EstimatorSessions.ts).
//
// The step-6 lead modal now asks for a phone number alongside name, company
// and email, so the team can call a lead back instead of waiting on email.
// `varchar` with no length to match the existing lead_* columns Payload
// generated for this table.
//
// Same additive, idempotent pattern as 20261008_200000_add_chatbot_leads_notified_at.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "lead_phone" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "lead_phone";`)
}
