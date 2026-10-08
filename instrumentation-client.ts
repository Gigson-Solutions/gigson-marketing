import { initBotId } from 'botid/client/core';

/**
 * Vercel BotID — an invisible challenge, so paid traffic pays no conversion
 * cost for it (unlike a visible captcha, which matters most on the ISO 27001
 * landing page).
 *
 * Every route that calls `checkBotId()` on the server MUST be listed here: it
 * is this client that attaches the classification headers, and a route missing
 * from this list fails verification in production.
 *
 * Note this file lives at the repo root, not under src/ — Next.js only looks
 * in src/ when `app/` lives there too, and here `app/` is at the root.
 */
initBotId({
  protect: [
    { path: '/api/lead', method: 'POST' },
    { path: '/api/chatbot/email', method: 'POST' },
    { path: '/api/chatbot/chat', method: 'POST' },
    { path: '/api/estimator/sessions', method: 'POST' },
    // Wildcards expand across segments, so this covers the per-token routes:
    // /lead, /finalize, /features, /features/generate-one, /book-confirmed.
    { path: '/api/estimator/sessions/*', method: 'POST' },
  ],
});
