import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Adds `callBookedAt` (see collections/EstimatorSessions.ts) — set once the
// user completes a booking via the Step 6 Cal.com embed. Same additive
// pattern as every other column added to this collection so far.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" ADD COLUMN IF NOT EXISTS "call_booked_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "estimator_sessions" DROP COLUMN IF EXISTS "call_booked_at";`)
}
