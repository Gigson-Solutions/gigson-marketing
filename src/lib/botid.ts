import { checkBotId } from 'botid/server';

/**
 * Whether a BotID verdict actually blocks the request.
 *
 * During the rollout this stays false: a flagged request is logged (and, for
 * leads, stored and marked) rather than rejected, so a wrong verdict about a
 * real visitor is visible in the admin instead of silently costing a lead.
 * Flip `BOTID_ENFORCE=true` once the flagged rows have been reviewed.
 */
export const BOTID_ENFORCE = process.env.BOTID_ENFORCE === 'true';

/**
 * Runs the BotID check and says whether the caller should reject.
 *
 * Returns false while enforcement is off, so callers keep serving the request
 * — but the verdict is logged either way, which is what makes the observation
 * period useful.
 *
 * Note `checkBotId()` always reports `isBot: false` in local development, so
 * this can only be exercised for real on a Vercel deployment.
 */
export async function shouldBlockAsBot(route: string): Promise<boolean> {
  const { isBot } = await checkBotId();
  if (!isBot) return false;

  console.warn(`[botid] flagged ${route}${BOTID_ENFORCE ? ' — blocked' : ' — allowed (observe mode)'}`);
  return BOTID_ENFORCE;
}
