// Shared types for the AI Project Estimator (/project-estimator).
// Mirrors the flow reverse-engineered from https://estimate.geniusee.com/,
// adapted to Gigson's brand and stack. See STRATEGY.md / plan notes for context.

// What kind of engagement this is — Gigson does more than custom app
// development (ERP implementation/configuration, integrations/connectors,
// technical consulting), and this drives both the AI prompt and the
// wording of later steps.
export type ProjectType =
  | 'software_development'
  | 'erp_implementation'
  | 'integrations'
  | 'consulting'
  | 'other';

export const PROJECT_TYPES: ProjectType[] = [
  'software_development',
  'erp_implementation',
  'integrations',
  'consulting',
  'other',
];

export type BusinessDomain =
  | 'fintech'
  | 'edtech'
  | 'retail'
  | 'healthcare'
  | 'iot'
  | 'blockchain'
  | 'agriculture'
  | 'ecommerce'
  | 'other';

export const BUSINESS_DOMAINS: BusinessDomain[] = [
  'fintech',
  'edtech',
  'retail',
  'healthcare',
  'iot',
  'blockchain',
  'agriculture',
  'ecommerce',
  'other',
];

export type AppRole = 'user' | 'admin' | 'other';
export const APP_ROLES: AppRole[] = ['user', 'admin', 'other'];

export type AppSize = 'poc' | 'mvp' | 'product';
export const APP_SIZES: AppSize[] = ['poc', 'mvp', 'product'];

export type Platform = 'web' | 'ios' | 'android' | 'hybrid';
export const PLATFORMS: Platform[] = ['web', 'ios', 'android', 'hybrid'];

export type QualityLevel = 'mvp' | 'standard' | 'polished';
export const QUALITY_LEVELS: QualityLevel[] = ['mvp', 'standard', 'polished'];

export type TimelineMode = 'overall' | 'phased';

// ── Type-specific fields (Step 2 / Step 3) ──────────────────────────────
// Steps 2-3 used to ask the same appSize/platforms/uiLevel/qaLevel
// questions to every project type. Only software_development (and the
// "other" fallback) still do — erp_implementation/integrations/consulting
// each ask their own, more relevant set instead. See validate.ts for which
// fields are required per projectType.
export type ErpSystem = 'odoo' | 'holded' | 'other';
export const ERP_SYSTEMS: ErpSystem[] = ['odoo', 'holded', 'other'];

export type ErpModule =
  | 'accounting'
  | 'inventory'
  | 'manufacturing'
  | 'crm'
  | 'purchasing'
  | 'hr'
  | 'pos'
  | 'other';
export const ERP_MODULES: ErpModule[] = [
  'accounting',
  'inventory',
  'manufacturing',
  'crm',
  'purchasing',
  'hr',
  'pos',
  'other',
];

export type IntegrationDirection = 'one_way' | 'bidirectional';
export const INTEGRATION_DIRECTIONS: IntegrationDirection[] = ['one_way', 'bidirectional'];

export type IntegrationFrequency = 'real_time' | 'batch';
export const INTEGRATION_FREQUENCIES: IntegrationFrequency[] = ['real_time', 'batch'];

export type ConsultingScopeItem = 'audit' | 'strategy' | 'architecture' | 'team_augmentation' | 'other';
export const CONSULTING_SCOPE_ITEMS: ConsultingScopeItem[] = [
  'audit',
  'strategy',
  'architecture',
  'team_augmentation',
  'other',
];

export type ConsultingEngagement = 'one_off' | 'ongoing';
export const CONSULTING_ENGAGEMENTS: ConsultingEngagement[] = ['one_off', 'ongoing'];

export interface EstimatorInputs {
  projectType: ProjectType;
  projectTypeOther?: string;
  projectDescription: string;
  businessDomain: BusinessDomain;
  businessDomainOther?: string;
  competitors: string[];
  roles: AppRole[];
  rolesOther?: string;

  // software_development / other
  appSize?: AppSize;
  platforms?: Platform[];
  uiLevel?: QualityLevel;

  // erp_implementation / integrations (shared)
  qaLevel?: QualityLevel;

  // erp_implementation only
  erpSystem?: ErpSystem;
  erpModules?: ErpModule[];
  erpUsers?: number;
  migrationNeeded?: boolean;

  // integrations only
  integrationSystems?: string[];
  integrationDirection?: IntegrationDirection;
  integrationFrequency?: IntegrationFrequency;

  // consulting only
  consultingScope?: ConsultingScopeItem[];
  consultingEngagement?: ConsultingEngagement;

  timelineMode: TimelineMode;
  timelineOverallMonths?: number;
  timelinePhaseMvpMonths?: number;
  timelinePhase2Months?: number;
  timelinePhaseFutureMonths?: number;
}

// The five delivery roles used throughout the estimator (hours columns,
// team composition, timeline bars). Order matters for display.
export const ROLE_KEYS = ['frontend', 'qa', 'backend', 'uiux', 'bapm'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export type FeatureHours = Record<RoleKey, number>;

export interface EstimatorFeature {
  clientId: string;
  name: string;
  userStory: string;
  acceptanceCriteria: string[];
  thirdPartyServices: string;
  hours: FeatureHours;
  source: 'ai' | 'manual';
}

export type TeamComposition = Record<RoleKey, number>; // FTE multiplier per role, e.g. 0.75

export interface TimelineBar {
  role: RoleKey;
  startWeek: number; // 1-indexed
  endWeek: number; // inclusive
}

export interface TimelineData {
  totalWeeks: number;
  bars: TimelineBar[];
}

export interface EstimatorTotals {
  totalHours: number;
  totalBudget: number;
}

export type EstimatorStatus =
  | 'draft'
  | 'generating'
  | 'features_ready'
  | 'generation_failed'
  | 'finalized'
  | 'completed';
