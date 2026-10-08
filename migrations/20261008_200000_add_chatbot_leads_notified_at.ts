import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds `notifiedAt` to `chatbot_leads` (see collections/ChatbotLeads.ts).
//
// This collection was the only one with no way to tell a delivered
// notification from a lost one: `leads` has `notifiedAt` and
// `estimator_sessions` has `teamNotifiedAt`, but a chatbot lead left no trace
// either way. That blind spot is why a real lead (EPICSA, 2026-09-09) sat
// unread for a month while formsubmit.co silently refused every server-side
// send — nothing in the admin showed it had never been announced.
//
// Same additive, idempotent pattern as 20260909_120100_add_estimator_sessions_call_booked.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "chatbot_leads" ADD COLUMN IF NOT EXISTS "notified_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "chatbot_leads" DROP COLUMN IF EXISTS "notified_at";`)
}
