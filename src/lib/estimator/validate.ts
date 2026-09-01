// Server-side validation for everything the estimator accepts from the
// public internet. Never trust the client for enums, lengths, or numeric
// ranges — this both protects LLM prompt quality and bounds cost/abuse.
import {
  APP_ROLES,
  APP_SIZES,
  BUSINESS_DOMAINS,
  PLATFORMS,
  PROJECT_TYPES,
  QUALITY_LEVELS,
  ROLE_KEYS,
  type EstimatorFeature,
  type EstimatorInputs,
} from './types';

const MAX_DESCRIPTION_LENGTH = 10000;
const MAX_COMPETITORS = 10;
const MAX_COMPETITOR_LENGTH = 80;
const MAX_FEATURES = 30;
const MAX_HOURS_PER_ROLE = 400;
const MIN_HOURLY_RATE = 5;
const MAX_HOURLY_RATE = 500;
const MAX_MONTHS = 36;

export function validateInputs(raw: unknown): { ok: true; value: EstimatorInputs } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Missing inputs' };
  const r = raw as Record<string, unknown>;

  const projectType = r.projectType;
  if (typeof projectType !== 'string' || !PROJECT_TYPES.includes(projectType as never)) {
    return { ok: false, error: 'Invalid projectType' };
  }

  const hourlyRate = Number(r.hourlyRate);
  if (!Number.isFinite(hourlyRate) || hourlyRate < MIN_HOURLY_RATE || hourlyRate > MAX_HOURLY_RATE) {
    return { ok: false, error: 'Invalid hourlyRate' };
  }

  const projectDescription = typeof r.projectDescription === 'string' ? r.projectDescription.trim() : '';
  if (!projectDescription || projectDescription.length > MAX_DESCRIPTION_LENGTH) {
    return { ok: false, error: 'Invalid projectDescription' };
  }

  const businessDomain = r.businessDomain;
  if (typeof businessDomain !== 'string' || !BUSINESS_DOMAINS.includes(businessDomain as never)) {
    return { ok: false, error: 'Invalid businessDomain' };
  }

  const competitorsRaw = Array.isArray(r.competitors) ? r.competitors : [];
  const competitors = competitorsRaw
    .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    .slice(0, MAX_COMPETITORS)
    .map((c) => c.trim().slice(0, MAX_COMPETITOR_LENGTH));

  const rolesRaw = Array.isArray(r.roles) ? r.roles : [];
  const roles = rolesRaw.filter((rr): rr is string => typeof rr === 'string' && APP_ROLES.includes(rr as never));
  if (roles.length === 0) return { ok: false, error: 'Invalid roles' };

  const appSize = r.appSize;
  if (typeof appSize !== 'string' || !APP_SIZES.includes(appSize as never)) {
    return { ok: false, error: 'Invalid appSize' };
  }

  const platformsRaw = Array.isArray(r.platforms) ? r.platforms : [];
  const platforms = platformsRaw.filter((p): p is string => typeof p === 'string' && PLATFORMS.includes(p as never));
  if (platforms.length === 0) return { ok: false, error: 'Invalid platforms' };

  const uiLevel = r.uiLevel;
  if (typeof uiLevel !== 'string' || !QUALITY_LEVELS.includes(uiLevel as never)) {
    return { ok: false, error: 'Invalid uiLevel' };
  }
  const qaLevel = r.qaLevel;
  if (typeof qaLevel !== 'string' || !QUALITY_LEVELS.includes(qaLevel as never)) {
    return { ok: false, error: 'Invalid qaLevel' };
  }

  const timelineMode = r.timelineMode === 'phased' ? 'phased' : 'overall';
  const clampMonths = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(n, MAX_MONTHS) : undefined;
  };

  return {
    ok: true,
    value: {
      projectType: projectType as EstimatorInputs['projectType'],
      projectTypeOther:
        projectType === 'other' && typeof r.projectTypeOther === 'string'
          ? r.projectTypeOther.trim().slice(0, 80)
          : undefined,
      hourlyRate,
      projectDescription,
      businessDomain: businessDomain as EstimatorInputs['businessDomain'],
      businessDomainOther:
        businessDomain === 'other' && typeof r.businessDomainOther === 'string'
          ? r.businessDomainOther.trim().slice(0, 80)
          : undefined,
      competitors,
      roles: roles as EstimatorInputs['roles'],
      rolesOther:
        roles.includes('other') && typeof r.rolesOther === 'string'
          ? r.rolesOther.trim().slice(0, 80)
          : undefined,
      appSize: appSize as EstimatorInputs['appSize'],
      platforms: platforms as EstimatorInputs['platforms'],
      uiLevel: uiLevel as EstimatorInputs['uiLevel'],
      qaLevel: qaLevel as EstimatorInputs['qaLevel'],
      timelineMode,
      timelineOverallMonths: clampMonths(r.timelineOverallMonths),
      timelinePhaseMvpMonths: clampMonths(r.timelinePhaseMvpMonths),
      timelinePhase2Months: clampMonths(r.timelinePhase2Months),
      timelinePhaseFutureMonths: clampMonths(r.timelinePhaseFutureMonths),
    },
  };
}

/** Validates + clamps a features array, whether it came from the LLM or from a client PATCH (manual edits). */
export function sanitizeFeatures(raw: unknown, source: 'ai' | 'manual'): EstimatorFeature[] {
  if (!Array.isArray(raw)) return [];
  const out: EstimatorFeature[] = [];
  for (const item of raw.slice(0, MAX_FEATURES)) {
    if (!item || typeof item !== 'object') continue;
    const f = item as Record<string, unknown>;
    const name = typeof f.name === 'string' ? f.name.trim().slice(0, 200) : '';
    if (!name) continue;
    const userStory = typeof f.userStory === 'string' ? f.userStory.trim().slice(0, 500) : '';
    const acceptanceCriteria = Array.isArray(f.acceptanceCriteria)
      ? f.acceptanceCriteria
          .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
          .slice(0, 10)
          .map((c) => c.trim().slice(0, 300))
      : [];
    const thirdPartyServices =
      typeof f.thirdPartyServices === 'string' ? f.thirdPartyServices.trim().slice(0, 200) || '-' : '-';

    const hoursRaw = (f.hours && typeof f.hours === 'object' ? f.hours : {}) as Record<string, unknown>;
    const hours = {} as EstimatorFeature['hours'];
    for (const role of ROLE_KEYS) {
      const v = Number(hoursRaw[role]);
      hours[role] = Number.isFinite(v) && v > 0 ? Math.min(v, MAX_HOURS_PER_ROLE) : 0;
    }

    const clientId =
      typeof f.clientId === 'string' && f.clientId ? f.clientId.slice(0, 100) : `feat-${out.length}-${Date.now()}`;
    const featureSource = f.source === 'manual' || f.source === 'ai' ? f.source : source;

    out.push({ clientId, name, userStory, acceptanceCriteria, thirdPartyServices, hours, source: featureSource });
  }
  return out;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
