import * as migration_20260821_090243_add_estimator_sessions from './20260821_090243_add_estimator_sessions';
import * as migration_20260828_180000_add_estimator_sessions_project_type from './20260828_180000_add_estimator_sessions_project_type';
import * as migration_20260909_120000_add_estimator_sessions_type_specific_fields from './20260909_120000_add_estimator_sessions_type_specific_fields';
import * as migration_20260909_120100_add_estimator_sessions_call_booked from './20260909_120100_add_estimator_sessions_call_booked';

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
    up: migration_20260909_120000_add_estimator_sessions_type_specific_fields.up,
    down: migration_20260909_120000_add_estimator_sessions_type_specific_fields.down,
    name: '20260909_120000_add_estimator_sessions_type_specific_fields'
  },
  {
    up: migration_20260909_120100_add_estimator_sessions_call_booked.up,
    down: migration_20260909_120100_add_estimator_sessions_call_booked.down,
    name: '20260909_120100_add_estimator_sessions_call_booked'
  },
];
