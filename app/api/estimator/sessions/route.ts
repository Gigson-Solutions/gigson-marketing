import config from '@payload-config';
import Anthropic from '@anthropic-ai/sdk';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';

import { computeTotalBudget, sumRoleHours, totalHoursOf } from '@/lib/estimator/calc';
import { featuresToPayload } from '@/lib/estimator/payloadMapping';
import { buildEstimatorSystemPrompt, buildEstimatorUserPrompt, GENERATE_FEATURES_TOOL } from '@/lib/estimator/prompt';
import { getClientIp, isRateLimited } from '@/lib/estimator/rateLimit';
import { sanitizeFeatures, validateInputs } from '@/lib/estimator/validate';

export const runtime = 'nodejs';
export const maxDuration = 300;

const MODEL = process.env.ESTIMATOR_ANTHROPIC_MODEL ?? process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { inputs, locale, pagePath, website, skipGeneration } = body as Record<string, unknown>;
  const skip = skipGeneration === true;

  // Honeypot — silently accept bots without doing any DB/LLM work.
  if (typeof website === 'string' && website.trim().length > 0) {
    return NextResponse.json({ ok: true, token: 'noop', status: 'features_ready', features: [] });
  }

  const validated = validateInputs(inputs);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  // Only the LLM-calling path is rate limited — "skip" is free (no AI call).
  if (!skip) {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Has generado demasiadas estimaciones. Inténtalo de nuevo en un rato.' },
        { status: 429 },
      );
    }
  }

  const token = crypto.randomUUID();
  const payloadClient = await getPayload({ config });
  const inputFields = {
    publicToken: token,
    status: 'generating' as const,
    locale: locale === 'en' ? ('en' as const) : ('es' as const),
    pagePath: typeof pagePath === 'string' ? pagePath.slice(0, 256) : undefined,
    hourlyRate: validated.value.hourlyRate,
    projectDescription: validated.value.projectDescription,
    businessDomain: validated.value.businessDomain,
    businessDomainOther: validated.value.businessDomainOther,
    competitors: validated.value.competitors.map((value) => ({ value })),
    roles: validated.value.roles.join(','),
    rolesOther: validated.value.rolesOther,
    appSize: validated.value.appSize,
    platforms: validated.value.platforms.join(','),
    uiLevel: validated.value.uiLevel,
    qaLevel: validated.value.qaLevel,
    timelineMode: validated.value.timelineMode,
    timelineOverallMonths: validated.value.timelineOverallMonths,
    timelinePhaseMvpMonths: validated.value.timelinePhaseMvpMonths,
    timelinePhase2Months: validated.value.timelinePhase2Months,
    timelinePhaseFutureMonths: validated.value.timelinePhaseFutureMonths,
  };

  let docId: string | number;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = await (payloadClient as any).create({ collection: 'estimator-sessions', data: inputFields });
    docId = doc.id;
  } catch (err) {
    console.error('[estimator] failed to create session doc', err);
    return NextResponse.json({ error: 'Could not start estimate. Please try again.' }, { status: 503 });
  }

  if (skip) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payloadClient as any).update({ collection: 'estimator-sessions', id: docId, data: { status: 'features_ready', features: [] } });
    return NextResponse.json({ ok: true, token, status: 'features_ready', features: [] });
  }

  const anthropic = getClient();
  if (!anthropic) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payloadClient as any).update({ collection: 'estimator-sessions', id: docId, data: { status: 'generation_failed' } });
    return NextResponse.json({ ok: true, token, status: 'generation_failed', features: [] });
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: buildEstimatorSystemPrompt(),
      messages: [{ role: 'user', content: buildEstimatorUserPrompt(validated.value) }],
      tools: [GENERATE_FEATURES_TOOL],
      tool_choice: { type: 'tool', name: 'submit_features' },
    });

    const toolUse = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'submit_features',
    );
    if (!toolUse) throw new Error('Model did not return a tool_use block');

    const featureInput = (toolUse.input as { features?: unknown }).features;
    const features = sanitizeFeatures(featureInput, 'ai');
    if (features.length === 0) throw new Error('Model returned zero valid features');

    const roleHours = sumRoleHours(features);
    const totalHours = totalHoursOf(roleHours);
    const totalBudget = computeTotalBudget(totalHours, validated.value.hourlyRate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payloadClient as any).update({
      collection: 'estimator-sessions',
      id: docId,
      data: {
        status: 'features_ready',
        features: featuresToPayload(features),
        totalHours,
        totalBudget,
      },
    });

    return NextResponse.json({ ok: true, token, status: 'features_ready', features });
  } catch (err) {
    console.error('[estimator] feature generation failed', err);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (payloadClient as any).update({ collection: 'estimator-sessions', id: docId, data: { status: 'generation_failed' } });
    } catch {
      // best-effort — the doc already exists with status 'generating', that's fine
    }
    return NextResponse.json({ ok: true, token, status: 'generation_failed', features: [] });
  }
}
