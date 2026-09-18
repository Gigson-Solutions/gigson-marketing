import * as migration_20260821_090243_add_estimator_sessions from './20260821_090243_add_estimator_sessions';
import * as migration_20260828_180000_add_estimator_sessions_project_type from './20260828_180000_add_estimator_sessions_project_type';
import * as migration_20260902_120000_add_posts_locale from './20260902_120000_add_posts_locale';
import * as migration_20260903_100000_add_media_and_posts_category_localized_version from './20260903_100000_add_media_and_posts_category_localized_version';
import * as migration_20260909_120000_add_estimator_sessions_type_specific_fields from './20260909_120000_add_estimator_sessions_type_specific_fields';
import * as migration_20260909_120100_add_estimator_sessions_call_booked from './20260909_120100_add_estimator_sessions_call_booked';
import * as migration_20260918_100000_estimator_features_description_and_two_roles from './20260918_100000_estimator_features_description_and_two_roles';
import * as migration_20260918_130000_add_authors from './20260918_130000_add_authors';

export const migrations = [
  {
    up: migration_20260821_090243_add_estimator_sessions.up,
    down: migration_20260821_090243_add_estimator_sessions.down,
    name: '20260821_090243_add_estimator_sessions'
  },
  {
    up: migration_20260828_180000_add_estimator_sessions_project_type.up,
    down: migration_20260828_180000_add_estimator_sessions_project_type.down,
    name: '20260828_180000_add_estimator_sessions_project_type'
  },
  // Both of these live(d) only on branches that were deployed by alias and never
  // merged (`hotfix/blog-500`, `fix/reconcile-media-posts-schema`), so the schema
  // they describe reached the shared database out of band — the first via a real
  // migration, the second via one-off `/api/ops-*` routes. Listing them here in
  // chronological order is what lets `prodMigrations` reason about this database
  // correctly. Both are written defensively, so re-running is a no-op.
  {
    up: migration_20260902_120000_add_posts_locale.up,
    down: migration_20260902_120000_add_posts_locale.down,
    name: '20260902_120000_add_posts_locale'
  },
  {
    up: migration_20260903_100000_add_media_and_posts_category_localized_version.up,
    down: migration_20260903_100000_add_media_and_posts_category_localized_version.down,
    name: '20260903_100000_add_media_and_posts_category_localized_version'
  },
  {
    up: migration_20260909_120000_add_estimator_sessions_type_specific_fields.up,
    down: migration_20260909_120000_add_estimator_sessions_type_specific_fields.down,
    name: '20260909_120000_add_estimator_sessions_type_specific_fields'
  },
  {
    up: migration_20260909_120100_add_estimator_sessions_call_booked.up,
    down: migration_20260909_120100_add_estimator_sessions_call_booked.down,
    name: '20260909_120100_add_estimator_sessions_call_booked'
  },
  {
    up: migration_20260918_100000_estimator_features_description_and_two_roles.up,
    down: migration_20260918_100000_estimator_features_description_and_two_roles.down,
    name: '20260918_100000_estimator_features_description_and_two_roles'
  },
  {
    up: migration_20260918_130000_add_authors.up,
    down: migration_20260918_130000_add_authors.down,
    name: '20260918_130000_add_authors'
  },
];
