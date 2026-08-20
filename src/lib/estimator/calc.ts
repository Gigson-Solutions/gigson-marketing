// Deterministic math for the estimator's step 6 (team composition, timeline,
// totals). Nothing here calls an LLM — only the feature list (step 5) is
// AI-generated; everything downstream of it is plain arithmetic so the
// numbers stay reproducible and auditable.
import { ROLE_KEYS, type EstimatorFeature, type RoleKey, type TeamComposition, type TimelineData } from './types';

const HOURS_PER_WEEK_FTE = 40;
const WEEKS_PER_MONTH = 4.33;

export function sumRoleHours(features: EstimatorFeature[]): Record<RoleKey, number> {
  const totals: Record<RoleKey, number> = { frontend: 0, qa: 0, backend: 0, uiux: 0, bapm: 0 };
  for (const feature of features) {
    for (const role of ROLE_KEYS) {
      const value = feature.hours?.[role];
      if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
        totals[role] += value;
      }
    }
  }
  return totals;
}

export function totalHoursOf(roleHours: Record<RoleKey, number>): number {
  return ROLE_KEYS.reduce((sum, role) => sum + roleHours[role], 0);
}

export function resolveTotalMonths(inputs: {
  timelineMode: 'overall' | 'phased';
  timelineOverallMonths?: number;
  timelinePhaseMvpMonths?: number;
  timelinePhase2Months?: number;
  timelinePhaseFutureMonths?: number;
}): number {
  if (inputs.timelineMode === 'phased') {
    const phases = [
      inputs.timelinePhaseMvpMonths ?? 0,
      inputs.timelinePhase2Months ?? 0,
      inputs.timelinePhaseFutureMonths ?? 0,
    ].filter((n) => n > 0);
    const sum = phases.reduce((a, b) => a + b, 0);
    return sum > 0 ? sum : 1;
  }
  return inputs.timelineOverallMonths && inputs.timelineOverallMonths > 0
    ? inputs.timelineOverallMonths
    : 1;
}

/**
 * FTE(role) = roleHours / (totalProjectWeeks * 40h)
 * i.e. "how much of a full-time team member this role represents" —
 * matches the reference tool's own framing ("0.75x team member").
 */
export function computeTeamComposition(
  roleHours: Record<RoleKey, number>,
  totalMonths: number,
): TeamComposition {
  const totalWeeks = Math.max(1, totalMonths * WEEKS_PER_MONTH);
  const availableHours = totalWeeks * HOURS_PER_WEEK_FTE;
  const composition = {} as TeamComposition;
  for (const role of ROLE_KEYS) {
    const fte = availableHours > 0 ? roleHours[role] / availableHours : 0;
    // Round to the nearest 0.25 FTE step for a clean, presentable number.
    composition[role] = Math.max(0, Math.round(fte * 4) / 4);
  }
  return composition;
}

/**
 * v1 approximation of a Gantt chart: each role's bar starts at week 1 and
 * runs for ceil(FTE * totalWeeks) weeks (min 1 week if the role has any
 * hours at all). This does not model a realistic staffing curve (e.g.
 * BA/PM-first, QA-last) — flagged as a v1.1 candidate once real project
 * data validates the FTE numbers.
 */
export function computeTimeline(composition: TeamComposition, totalMonths: number): TimelineData {
  const totalWeeks = Math.max(1, Math.round(totalMonths * WEEKS_PER_MONTH));
  const bars = ROLE_KEYS.filter((role) => composition[role] > 0).map((role) => {
    const span = Math.max(1, Math.min(totalWeeks, Math.ceil(composition[role] * totalWeeks)));
    return { role, startWeek: 1, endWeek: span };
  });
  return { totalWeeks, bars };
}

export function computeTotalBudget(totalHours: number, hourlyRate: number): number {
  const rate = Number.isFinite(hourlyRate) && hourlyRate > 0 ? hourlyRate : 0;
  return Math.round(totalHours * rate);
}
