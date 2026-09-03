import * as migration_20260821_090243_add_estimator_sessions from './20260821_090243_add_estimator_sessions';
import * as migration_20260828_180000_add_estimator_sessions_project_type from './20260828_180000_add_estimator_sessions_project_type';
import * as migration_20260903_100000_add_media_and_posts_category_localized_version from './20260903_100000_add_media_and_posts_category_localized_version';

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
  {
    up: migration_20260903_100000_add_media_and_posts_category_localized_version.up,
    down: migration_20260903_100000_add_media_and_posts_category_localized_version.down,
    name: '20260903_100000_add_media_and_posts_category_localized_version'
  },
];
