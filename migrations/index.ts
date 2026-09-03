import * as migration_20260902_120000_add_posts_locale from './20260902_120000_add_posts_locale';

export const migrations = [
  {
    up: migration_20260902_120000_add_posts_locale.up,
    down: migration_20260902_120000_add_posts_locale.down,
    name: '20260902_120000_add_posts_locale',
  },
];
