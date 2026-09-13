import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

// Reconciles a schema gap that predates this migration system on `staging`:
// `collections/Media.ts` and the `category`/`localizedVersion` fields on
// `collections/Posts.ts` were added to the code after
// `20260821_090243_add_estimator_sessions` was authored (that migration's
// own snapshot has no `category`/`localized_version_id`/`media` — it only
// covers `estimator_sessions`), so they were never captured in a tracked
// migration. They only "worked" against whichever database had already
// been schema-pushed out of band in dev/preview. Production (after
// `hotfix/blog-500`'s `20260902_120000_add_posts_locale`) does NOT have
// them — deploying `staging` as-is would boot fine (no migration checks
// for these) and then error at runtime the first time anything touches
// `posts.category`, `posts.coverImage`, or the `media` collection.
//
// Every statement is defensive (`IF NOT EXISTS` / duplicate_object catch)
// because this migration's name won't be recorded as "already run" on any
// environment that picked these fields up informally via dev-mode push —
// re-running it there should be a safe no-op, not a failure.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");

  DO $$ BEGIN
    CREATE TYPE "public"."enum_posts_category" AS ENUM ('agentes-ia', 'integraciones-erp', 'ciberseguridad', 'ingenieria-software', 'consultoria-tecnologica', 'casos-exito', 'sectores');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" "public"."enum_posts_category";

  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;
  DO $$ BEGIN
    ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");

  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "localized_version_id" integer;
  DO $$ BEGIN
    ALTER TABLE "posts" ADD CONSTRAINT "posts_localized_version_id_posts_id_fk" FOREIGN KEY ("localized_version_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "posts_localized_version_idx" ON "posts" USING btree ("localized_version_id");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_id";

  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_localized_version_id_posts_id_fk";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "localized_version_id";

  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_cover_image_id_media_id_fk";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "cover_image_id";

  ALTER TABLE "posts" DROP COLUMN IF EXISTS "category";
  DROP TYPE IF EXISTS "public"."enum_posts_category";

  DROP TABLE IF EXISTS "media";`)
}
