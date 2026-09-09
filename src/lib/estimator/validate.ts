// Server-side validation for everything the estimator accepts from the
// public internet. Never trust the client for enums, lengths, or numeric
// ranges — this both protects LLM prompt quality and bounds cost/abuse.
import {
  APP_ROLES,
  APP_SIZES,
  BUSINESS_DOMAINS,
  CONSULTING_ENGAGEMENTS,
  CONSULTING_SCOPE_ITEMS,
  ERP_MODULES,
  ERP_SYSTEMS,
  INTEGRATION_DIRECTIONS,
  INTEGRATION_FREQUENCIES,
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
const MAX_MONTHS = 36;
const MAX_INTEGRATION_SYSTEMS = 10;
const MAX_INTEGRATION_SYSTEM_LENGTH = 80;
const MAX_ERP_USERS = 100000;

export function validateInputs(raw: unknown): { ok: true; value: EstimatorInputs } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Missing inputs' };
  const r = raw as Record<string, unknown>;

  const projectType = r.projectType;
  if (typeof projectType !== 'string' || !PROJECT_TYPES.includes(projectType as never)) {
    return { ok: false, error: 'Invalid projectType' };
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

  // Steps 1-3 branch by projectType — see types.ts for which fields belong
  // to which type. `software_development` and the `other` fallback keep the
  // original competitors/roles (Step 1) and appSize/platforms/uiLevel(/qaLevel)
  // (Steps 2-3) questions; erp/integrations/consulting skip competitors/roles
  // entirely (no end-user concept for an ERP config, integration or
  // consulting engagement) and get their own Step 2/3 fields instead.
  const usesGenericAppFields = projectType === 'software_development' || projectType === 'other';

  const rolesRaw = Array.isArray(r.roles) ? r.roles : [];
  const roles = rolesRaw.filter((rr): rr is string => typeof rr === 'string' && APP_ROLES.includes(rr as never));
  if (usesGenericAppFields && roles.length === 0) return { ok: false, error: 'Invalid roles' };

  let appSize: EstimatorInputs['appSize'];
  let platforms: EstimatorInputs['platforms'];
  let uiLevel: EstimatorInputs['uiLevel'];
  if (usesGenericAppFields) {
    if (typeof r.appSize !== 'string' || !APP_SIZES.includes(r.appSize as never)) {
      return { ok: false, error: 'Invalid appSize' };
    }
    appSize = r.appSize as EstimatorInputs['appSize'];

    const platformsRaw = Array.isArray(r.platforms) ? r.platforms : [];
    const platformsValue = platformsRaw.filter(
      (p): p is string => typeof p === 'string' && PLATFORMS.includes(p as never),
    );
    if (platformsValue.length === 0) return { ok: false, error: 'Invalid platforms' };
    platforms = platformsValue as EstimatorInputs['platforms'];

    if (typeof r.uiLevel !== 'string' || !QUALITY_LEVELS.includes(r.uiLevel as never)) {
      return { ok: false, error: 'Invalid uiLevel' };
    }
    uiLevel = r.uiLevel as EstimatorInputs['uiLevel'];
  }

  // qaLevel is shared by software_development/other AND erp_implementation/
  // integrations (test rigor matters for all four) — only consulting skips it.
  let qaLevel: EstimatorInputs['qaLevel'];
  if (projectType !== 'consulting') {
    if (typeof r.qaLevel !== 'string' || !QUALITY_LEVELS.includes(r.qaLevel as never)) {
      return { ok: false, error: 'Invalid qaLevel' };
    }
    qaLevel = r.qaLevel as EstimatorInputs['qaLevel'];
  }

  let erpSystem: EstimatorInputs['erpSystem'];
  let erpModules: EstimatorInputs['erpModules'];
  let erpUsers: EstimatorInputs['erpUsers'];
  let migrationNeeded: EstimatorInputs['migrationNeeded'];
  if (projectType === 'erp_implementation') {
    if (typeof r.erpSystem !== 'string' || !ERP_SYSTEMS.includes(r.erpSystem as never)) {
      return { ok: false, error: 'Invalid erpSystem' };
    }
    erpSystem = r.erpSystem as EstimatorInputs['erpSystem'];

    const erpModulesRaw = Array.isArray(r.erpModules) ? r.erpModules : [];
    const erpModulesValue = erpModulesRaw.filter(
      (m): m is string => typeof m === 'string' && ERP_MODULES.includes(m as never),
    );
    if (erpModulesValue.length === 0) return { ok: false, error: 'Invalid erpModules' };
    erpModules = erpModulesValue as EstimatorInputs['erpModules'];

    const erpUsersNum = Number(r.erpUsers);
    erpUsers = Number.isFinite(erpUsersNum) && erpUsersNum > 0 ? Math.min(erpUsersNum, MAX_ERP_USERS) : undefined;
    migrationNeeded = r.migrationNeeded === true;
  }

  let integrationSystems: EstimatorInputs['integrationSystems'];
  let integrationDirection: EstimatorInputs['integrationDirection'];
  let integrationFrequency: EstimatorInputs['integrationFrequency'];
  if (projectType === 'integrations') {
    const systemsRaw = Array.isArray(r.integrationSystems) ? r.integrationSystems : [];
    integrationSystems = systemsRaw
      .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
      .slice(0, MAX_INTEGRATION_SYSTEMS)
      .map((s) => s.trim().slice(0, MAX_INTEGRATION_SYSTEM_LENGTH));
    if (integrationSystems.length === 0) return { ok: false, error: 'Invalid integrationSystems' };

    if (typeof r.integrationDirection !== 'string' || !INTEGRATION_DIRECTIONS.includes(r.integrationDirection as never)) {
      return { ok: false, error: 'Invalid integrationDirection' };
    }
    integrationDirection = r.integrationDirection as EstimatorInputs['integrationDirection'];

    if (typeof r.integrationFrequency !== 'string' || !INTEGRATION_FREQUENCIES.includes(r.integrationFrequency as never)) {
      return { ok: false, error: 'Invalid integrationFrequency' };
    }
    integrationFrequency = r.integrationFrequency as EstimatorInputs['integrationFrequency'];
  }

  let consultingScope: EstimatorInputs['consultingScope'];
  let consultingEngagement: EstimatorInputs['consultingEngagement'];
  if (projectType === 'consulting') {
    const scopeRaw = Array.isArray(r.consultingScope) ? r.consultingScope : [];
    const scopeValue = scopeRaw.filter(
      (s): s is string => typeof s === 'string' && CONSULTING_SCOPE_ITEMS.includes(s as never),
    );
    if (scopeValue.length === 0) return { ok: false, error: 'Invalid consultingScope' };
    consultingScope = scopeValue as EstimatorInputs['consultingScope'];

    if (typeof r.consultingEngagement !== 'string' || !CONSULTING_ENGAGEMENTS.includes(r.consultingEngagement as never)) {
      return { ok: false, error: 'Invalid consultingEngagement' };
    }
    consultingEngagement = r.consultingEngagement as EstimatorInputs['consultingEngagement'];
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
      appSize,
      platforms,
      uiLevel,
      qaLevel,
      erpSystem,
      erpModules,
      erpUsers,
      migrationNeeded,
      integrationSystems,
      integrationDirection,
      integrationFrequency,
      consultingScope,
      consultingEngagement,
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
