import config from '@payload-config';
import Anthropic from '@anthropic-ai/sdk';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { buildSingleFeatureSystemPrompt, buildSingleFeatureUserPrompt, GENERATE_SINGLE_FEATURE_TOOL } from '@/lib/estimator/prompt';
import { getClientIp, isFeatureGenRateLimited } from '@/lib/estimator/rateLimit';
import { sanitizeFeatures } from '@/lib/estimator/validate';
import { getSessionByToken } from '@/lib/estimator/session';
import type { EstimatorInputs } from '@/lib/estimator/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MODEL = process.env.ESTIMATOR_ANTHROPIC_MODEL ?? process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';
const MAX_DESCRIPTION_LENGTH = 2000;

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

// Step 5's "add feature" flow, AI-first: the lead describes what they want
// in plain language and this endpoint asks Claude to rewrite it into one
// properly scoped feature (see FeatureModal.tsx). Reuses the session's
// stored step 1-4 inputs as context so the estimate stays calibrated
// (app size / UI-QA level) to the rest of the project.
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { description, existingFeatureNames } = (body as Record<string, unknown>) ?? {};
  const trimmedDescription = typeof description === 'string' ? description.trim().slice(0, MAX_DESCRIPTION_LENGTH) : '';
  if (!trimmedDescription) {
    return NextResponse.json({ error: 'Missing description' }, { status: 400 });
  }
  const names = Array.isArray(existingFeatureNames)
    ? existingFeatureNames.filter((n): n is string => typeof n === 'string').slice(0, 30)
    : [];

  const ip = getClientIp(req);
  if (isFeatureGenRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Has generado demasiadas funcionalidades. Inténtalo de nuevo en un rato.' },
      { status: 429 },
    );
  }

  const payloadClient = await getPayload({ config });
  const session = await getSessionByToken(payloadClient, token);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const anthropic = getClient();
  if (!anthropic) {
    return NextResponse.json({ error: 'Estimator AI is not configured' }, { status: 503 });
  }

  const inputs: EstimatorInputs = {
    projectType: (session.projectType ?? 'software_development') as EstimatorInputs['projectType'],
    projectTypeOther: session.projectTypeOther ?? undefined,
    hourlyRate: session.hourlyRate ?? 0,
    projectDescription: session.projectDescription ?? '',
    businessDomain: (session.businessDomain ?? 'other') as EstimatorInputs['businessDomain'],
    businessDomainOther: session.businessDomainOther ?? undefined,
    competitors: (session.competitors ?? []).map((c) => c.value ?? '').filter(Boolean),
    roles: (session.roles ?? '').split(',').filter(Boolean) as EstimatorInputs['roles'],
    rolesOther: session.rolesOther ?? undefined,
    appSize: (session.appSize ?? 'mvp') as EstimatorInputs['appSize'],
    platforms: (session.platforms ?? '').split(',').filter(Boolean) as EstimatorInputs['platforms'],
    uiLevel: (session.uiLevel ?? 'standard') as EstimatorInputs['uiLevel'],
    qaLevel: (session.qaLevel ?? 'standard') as EstimatorInputs['qaLevel'],
    timelineMode: session.timelineMode === 'phased' ? 'phased' : 'overall',
    timelineOverallMonths: session.timelineOverallMonths ?? undefined,
  };

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: buildSingleFeatureSystemPrompt(),
      messages: [{ role: 'user', content: buildSingleFeatureUserPrompt(inputs, trimmedDescription, names) }],
      tools: [GENERATE_SINGLE_FEATURE_TOOL],
      tool_choice: { type: 'tool', name: 'submit_feature' },
    });

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'submit_feature',
    );
    if (!toolUse) throw new Error('Model did not return a tool_use block');

    const featureInput = (toolUse.input as { feature?: unknown }).feature;
    const [feature] = sanitizeFeatures([featureInput], 'ai');
    if (!feature) throw new Error('Model returned an invalid feature');

    return NextResponse.json({ ok: true, feature });
  } catch (err) {
    console.error('[estimator] single feature generation failed', err);
    return NextResponse.json({ error: 'Could not generate this feature. Please try again.' }, { status: 503 });
  }
}
