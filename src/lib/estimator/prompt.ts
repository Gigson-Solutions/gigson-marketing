// Prompt + forced tool-use schema for the AI use-case-generation step.
// Uses the plain @anthropic-ai/sdk (already a dependency, already used in
// app/api/chatbot/chat/route.ts) with tool_choice forcing structured output —
// no need for the Vercel AI SDK/Gateway here; see plan notes for rationale.
import type { EstimatorInputs } from './types';

const FEATURE_ITEM_SCHEMA = {
  type: 'object' as const,
  properties: {
    name: { type: 'string' as const, description: 'Short, specific use case name.' },
    userStory: {
      type: 'string' as const,
      description: 'Format: "As a [role], I want to [action] so that [benefit]."',
    },
    acceptanceCriteria: {
      type: 'array' as const,
      items: { type: 'string' as const },
      minItems: 3,
      maxItems: 6,
      description: 'Numbered, testable acceptance criteria (without the leading number).',
    },
    thirdPartyServices: {
      type: 'string' as const,
      description: 'Comma-separated third-party services/systems/APIs this use case would realistically involve (e.g. Odoo, Holded, a specific bank API), or "-" if none.',
    },
    hours: {
      type: 'object' as const,
      description: 'Estimated delivery hours this use case requires, broken down by role.',
      properties: {
        frontend: { type: 'number' as const },
        qa: { type: 'number' as const },
        backend: { type: 'number' as const },
        uiux: { type: 'number' as const },
        bapm: { type: 'number' as const },
      },
      required: ['frontend', 'qa', 'backend', 'uiux', 'bapm'],
    },
  },
  required: ['name', 'userStory', 'acceptanceCriteria', 'thirdPartyServices', 'hours'],
};

export const GENERATE_FEATURES_TOOL = {
  name: 'submit_features',
  description: 'Submit the generated list of use cases for this project estimate.',
  input_schema: {
    type: 'object' as const,
    properties: {
      features: {
        type: 'array' as const,
        minItems: 6,
        maxItems: 20,
        items: FEATURE_ITEM_SCHEMA,
      },
    },
    required: ['features'],
  },
};

export const GENERATE_SINGLE_FEATURE_TOOL = {
  name: 'submit_feature',
  description: 'Submit the rewritten, properly scoped use case.',
  input_schema: {
    type: 'object' as const,
    properties: { feature: FEATURE_ITEM_SCHEMA },
    required: ['feature'],
  },
};

const PROJECT_TYPE_LABEL: Record<string, string> = {
  software_development: 'Custom software development (a new app, product, or feature set to be built from scratch)',
  erp_implementation: 'ERP implementation or configuration (e.g. Odoo, Holded) — configuring/customizing an existing ERP for the client\'s processes, not building an app from scratch',
  integrations: 'Integrations/connectors between existing systems (e.g. syncing an ERP with a CRM, a bank, an e-commerce platform, or another internal tool)',
  consulting: 'Technology consulting (audits, architecture/roadmap definition, technical due diligence) — the deliverable is expertise/analysis/documentation, not necessarily new code',
  other: 'Other kind of engagement',
};

const DOMAIN_LABEL: Record<string, string> = {
  fintech: 'Fintech',
  edtech: 'Edtech',
  retail: 'Retail',
  healthcare: 'Healthcare',
  iot: 'IoT',
  blockchain: 'Blockchain',
  agriculture: 'Agriculture',
  ecommerce: 'E-Commerce',
  other: 'Other',
};

const SIZE_LABEL: Record<string, string> = {
  poc: 'Pilot / proof of concept (small scope)',
  mvp: 'Medium scope (covers the essentials to go live)',
  product: 'Full scope (the whole project, all phases)',
};

const LEVEL_LABEL: Record<string, string> = {
  mvp: 'basic (MVP-level, minimal polish)',
  standard: 'standard',
  polished: 'polished / fully custom',
};

function projectTypeLine(inputs: EstimatorInputs): string {
  const label = inputs.projectType === 'other' && inputs.projectTypeOther
    ? inputs.projectTypeOther
    : PROJECT_TYPE_LABEL[inputs.projectType] ?? inputs.projectType;
  return `Project type: ${label}`;
}

export function buildEstimatorSystemPrompt(): string {
  return [
    'You are a senior delivery estimator working for Gigson Solutions, a technology consultancy that does custom software development, ERP implementation/configuration (Odoo, Holded), integrations/connectors between systems, and technical consulting — not just app development.',
    'Given a prospective client\'s project brief AND its project type, you decompose it into a realistic, well-scoped list of use cases a delivery team could work from directly.',
    'Scope each use case appropriately to the project type: for custom software, a use case might be a screen or user flow ("user login", "checkout flow"); for an ERP implementation, a use case might be a configuration or process ("set up multi-currency invoicing in Odoo", "configure approval workflows"); for integrations, a use case might be a specific sync or data flow ("sync invoices from Holded to the internal ERP nightly"); for consulting, a use case might be a deliverable ("technology stack audit report", "12-month architecture roadmap").',
    'Each use case must be concrete and specific to THIS project (not generic placeholders), with a clear user story, testable acceptance criteria, plausible third-party systems/services involved, and honest hour estimates per role (frontend, qa, backend, uiux, bapm — business analyst/project manager). For non-development-heavy project types (ERP configuration, consulting), it is normal and expected for backend/frontend/uiux hours to be low or zero and for bapm/qa hours to dominate instead — do not force a software-development-shaped hour split onto a project that isn\'t one.',
    'Calibrate total hours to the requested scope and quality levels: a "polished"/full-scope project should cost meaningfully more hours than a basic/pilot one for the same kind of use case.',
    'Always include foundational use cases implied by the project type (e.g. auth/permissions for software, data migration/testing for ERP or integration work, discovery/stakeholder interviews for consulting) even if not explicitly mentioned, plus the specific use cases the description calls for.',
    'Respond ONLY by calling the submit_features tool — no prose.',
  ].join(' ');
}

export function buildEstimatorUserPrompt(inputs: EstimatorInputs): string {
  const domain = inputs.businessDomain === 'other' && inputs.businessDomainOther
    ? inputs.businessDomainOther
    : DOMAIN_LABEL[inputs.businessDomain] ?? inputs.businessDomain;

  const months =
    inputs.timelineMode === 'phased'
      ? [inputs.timelinePhaseMvpMonths, inputs.timelinePhase2Months, inputs.timelinePhaseFutureMonths]
          .filter((n): n is number => Boolean(n))
          .reduce((a, b) => a + b, 0)
      : inputs.timelineOverallMonths;

  const lines = [
    projectTypeLine(inputs),
    `Business domain: ${domain}`,
    `Project description: ${inputs.projectDescription}`,
    inputs.competitors.length > 0 ? `Known competitors: ${inputs.competitors.join(', ')}` : null,
    `Who will use or benefit from the result: ${inputs.roles.join(', ')}${inputs.rolesOther ? ` (other: ${inputs.rolesOther})` : ''}`,
    `Project scope: ${SIZE_LABEL[inputs.appSize] ?? inputs.appSize}`,
    `Delivery format / where it will be used: ${inputs.platforms.join(', ')}`,
    `UI polish level: ${LEVEL_LABEL[inputs.uiLevel] ?? inputs.uiLevel}`,
    `QA rigor level: ${LEVEL_LABEL[inputs.qaLevel] ?? inputs.qaLevel}`,
    months ? `Target overall timeline: ~${months} months` : null,
    `Assumed blended hourly rate: €${inputs.hourlyRate}/hour (for context only, do not include pricing in your output).`,
  ].filter(Boolean);

  return lines.join('\n');
}

export function buildSingleFeatureSystemPrompt(): string {
  return [
    'You are a senior delivery estimator working for Gigson Solutions, a technology consultancy that does custom software development, ERP implementation/configuration (Odoo, Holded), integrations/connectors between systems, and technical consulting.',
    "A prospective client is adding ONE more use case to their project estimate, described in their own plain words — they are not a developer and don't know about story points, acceptance criteria, or per-role hour breakdowns.",
    'Rewrite their description into a single, properly scoped use case, matching the project type you are given (a software screen/flow, an ERP configuration item, an integration/sync, or a consulting deliverable — whichever fits): a clear user story, testable acceptance criteria, plausible third-party systems/services, and honest hour estimates per role (frontend, qa, backend, uiux, bapm), calibrated to the overall project context you are given (scope, quality levels). It is normal for non-development project types to have low/zero frontend or backend hours.',
    'If their description is vague, make reasonable, conservative assumptions rather than asking questions — this is a one-shot, non-interactive tool.',
    'Do not duplicate a use case that (by name or clear intent) already exists in the project — if the description matches an existing one, scope it as the smallest sensible addition/variation instead.',
    'Respond ONLY by calling the submit_feature tool — no prose.',
  ].join(' ');
}

export function buildSingleFeatureUserPrompt(
  inputs: EstimatorInputs,
  description: string,
  existingFeatureNames: string[],
): string {
  const domain = inputs.businessDomain === 'other' && inputs.businessDomainOther
    ? inputs.businessDomainOther
    : DOMAIN_LABEL[inputs.businessDomain] ?? inputs.businessDomain;

  const lines = [
    projectTypeLine(inputs),
    `Project domain: ${domain}`,
    `Project description: ${inputs.projectDescription}`,
    `Project scope: ${SIZE_LABEL[inputs.appSize] ?? inputs.appSize}`,
    `Delivery format / where it will be used: ${inputs.platforms.join(', ')}`,
    `UI polish level: ${LEVEL_LABEL[inputs.uiLevel] ?? inputs.uiLevel}`,
    `QA rigor level: ${LEVEL_LABEL[inputs.qaLevel] ?? inputs.qaLevel}`,
    existingFeatureNames.length > 0
      ? `Use cases already in the estimate (avoid duplicating): ${existingFeatureNames.join(', ')}`
      : null,
    '',
    `The client wants to add this use case, in their own words: "${description}"`,
  ].filter((line) => line !== null);

  return lines.join('\n');
}
