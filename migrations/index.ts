import * as migration_20260821_090243_add_estimator_sessions from './20260821_090243_add_estimator_sessions';

export const migrations = [
  {
    up: migration_20260821_090243_add_estimator_sessions.up,
    down: migration_20260821_090243_add_estimator_sessions.down,
    name: '20260821_090243_add_estimator_sessions'
  },
];
