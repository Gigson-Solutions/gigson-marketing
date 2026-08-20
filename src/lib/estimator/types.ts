// Shared types for the AI Project Estimator (/project-estimator).
// Mirrors the flow reverse-engineered from https://estimate.geniusee.com/,
// adapted to Gigson's brand and stack. See STRATEGY.md / plan notes for context.

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

export interface EstimatorInputs {
  hourlyRate: number;
  projectDescription: string;
  businessDomain: BusinessDomain;
  businessDomainOther?: string;
  competitors: string[];
  roles: AppRole[];
  rolesOther?: string;
  appSize: AppSize;
  platforms: Platform[];
  uiLevel: QualityLevel;
  qaLevel: QualityLevel;
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
