// Prompt + forced tool-use schema for the AI feature-generation step.
// Uses the plain @anthropic-ai/sdk (already a dependency, already used in
// app/api/chatbot/chat/route.ts) with tool_choice forcing structured output —
// no need for the Vercel AI SDK/Gateway here; see plan notes for rationale.
import type { EstimatorInputs } from './types';

export const GENERATE_FEATURES_TOOL = {
  name: 'submit_features',
  description: 'Submit the generated list of features for this software project estimate.',
  input_schema: {
    type: 'object' as const,
    properties: {
      features: {
        type: 'array' as const,
        minItems: 6,
        maxItems: 20,
        items: {
          type: 'object' as const,
          properties: {
            name: { type: 'string' as const, description: 'Short, specific feature name.' },
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
              description: 'Comma-separated third-party services/APIs this feature would realistically use, or "-" if none.',
            },
            hours: {
              type: 'object' as const,
              description: 'Estimated development hours this feature requires, broken down by role.',
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
        },
      },
    },
    required: ['features'],
  },
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
  poc: 'Proof of Concept (~10 screens)',
  mvp: 'MVP (~20 screens)',
  product: 'Full product (~30+ screens)',
};

const LEVEL_LABEL: Record<string, string> = {
  mvp: 'basic (MVP-level, minimal polish)',
  standard: 'standard',
  polished: 'polished / fully custom',
};

export function buildEstimatorSystemPrompt(): string {
  return [
    'You are a senior software delivery estimator working for Gigson Solutions, a software development agency.',
    'Given a prospective client\'s project brief, you decompose it into a realistic, well-scoped feature list a delivery team could build from directly.',
    'Each feature must be concrete and specific to THIS project (not generic placeholders), with a clear user story, testable acceptance criteria, plausible third-party services, and honest hour estimates per role (frontend, qa, backend, uiux, bapm — business analyst/project manager).',
    'Calibrate total hours to the requested app size and quality levels: a "polished" UI/QA level should cost meaningfully more hours than a "basic" one for the same feature.',
    'Always include foundational features implied by the project (auth, roles/permissions, core CRUD flows) even if not explicitly mentioned, plus the specific features the description calls for.',
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
    `Business domain: ${domain}`,
    `Project description: ${inputs.projectDescription}`,
    inputs.competitors.length > 0 ? `Known competitors: ${inputs.competitors.join(', ')}` : null,
    `End-user roles the app must support: ${inputs.roles.join(', ')}${inputs.rolesOther ? ` (other: ${inputs.rolesOther})` : ''}`,
    `App size: ${SIZE_LABEL[inputs.appSize] ?? inputs.appSize}`,
    `Platforms: ${inputs.platforms.join(', ')}`,
    `UI polish level: ${LEVEL_LABEL[inputs.uiLevel] ?? inputs.uiLevel}`,
    `QA rigor level: ${LEVEL_LABEL[inputs.qaLevel] ?? inputs.qaLevel}`,
    months ? `Target overall timeline: ~${months} months` : null,
    `Assumed blended hourly rate: €${inputs.hourlyRate}/hour (for context only, do not include pricing in your output).`,
  ].filter(Boolean);

  return lines.join('\n');
}
