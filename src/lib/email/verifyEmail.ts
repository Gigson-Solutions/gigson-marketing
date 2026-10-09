// "Is this email real?" — as far as can be told without sending a message.
//
// Three cheap checks, server-side only (node:dns is not available in the
// browser), in increasing order of cost:
//
//   1. syntax      — a stricter regex than the `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
//                    the forms use, mostly to reject things like "a@b.c".
//   2. disposable  — a short list of throwaway-inbox providers. Deliberately
//                    short: the aim is to stop the obvious "I just want the
//                    number" cases, not to chase every domain on the internet.
//   3. deliverable — the domain must publish MX records (or, failing that, an
//                    A/AAAA record, which RFC 5321 also allows for delivery).
//
// What this does NOT do is confirm the mailbox exists. SMTP callouts are
// slow, blocked by most providers and often wrong; that would need a paid
// verification service, which was explicitly ruled out.
//
// DNS failure policy: if the lookup errors for a reason other than "this
// domain does not exist" (timeout, SERVFAIL, our resolver being down) the
// check returns `unknown` and the caller lets the lead through. A lead with a
// typo in it is recoverable; a lead we refused because our DNS hiccupped is
// not.
import { promises as dns } from 'node:dns';

export type EmailVerdict =
  | { ok: true; deliverability: 'verified' | 'unknown' }
  | { ok: false; reason: 'syntax' | 'disposable' | 'no_mx' };

// RFC 5322-ish local part, then a hostname whose labels are alphanumeric with
// inner hyphens, at least one dot, no trailing dot.
const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const MAX_EMAIL_LENGTH = 254;
const MX_TIMEOUT_MS = 3000;

const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '1secmail.com',
  '1secmail.net',
  '1secmail.org',
  '33mail.com',
  'burnermail.io',
  'discard.email',
  'dispostable.com',
  'emailondeck.com',
  'fakeinbox.com',
  'getnada.com',
  'grr.la',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'inboxkitten.com',
  'jetable.org',
  'mail-temp.com',
  'mailcatch.com',
  'maildrop.cc',
  'mailinator.com',
  'mailnesia.com',
  'mailsac.com',
  'mintemail.com',
  'moakt.com',
  'mohmal.com',
  'mytemp.email',
  'pokemail.net',
  'sharklasers.com',
  'spam4.me',
  'spamgourmet.com',
  'temp-mail.org',
  'tempinbox.com',
  'tempmail.com',
  'tempmail.net',
  'tempr.email',
  'throwawaymail.com',
  'tmpmail.net',
  'tmpmail.org',
  'trashmail.com',
  'trashmail.me',
  'yopmail.com',
  'yopmail.fr',
  // Reserved documentation domains — never a real inbox.
  'example.com',
  'example.net',
  'example.org',
]);

/** True for the domain itself or any subdomain of a listed provider. */
export function isDisposableDomain(domain: string): boolean {
  const labels = domain.toLowerCase().split('.');
  for (let i = 0; i < labels.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(labels.slice(i).join('.'))) return true;
  }
  return false;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('DNS_TIMEOUT')), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// Node's resolver reports "no such name" / "name exists but no records of
// this type" with these codes. Anything else is our problem, not the user's.
const DEFINITE_MISS = new Set(['ENOTFOUND', 'ENODATA', 'NXDOMAIN']);

function isDefiniteMiss(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return typeof code === 'string' && DEFINITE_MISS.has(code);
}

/**
 * `true`  — MX (or A/AAAA fallback) found.
 * `false` — DNS positively says the domain cannot receive mail.
 * `null`  — could not tell (timeout / resolver error); treat as unknown.
 */
export async function domainAcceptsMail(
  domain: string
): Promise<boolean | null> {
  try {
    const mx = await withTimeout(dns.resolveMx(domain), MX_TIMEOUT_MS);
    if (mx.length > 0) return true;
  } catch (error) {
    if (!isDefiniteMiss(error)) return null;
  }
  // No MX. RFC 5321 §5.1 falls back to the address record.
  try {
    const a = await withTimeout(dns.resolve4(domain), MX_TIMEOUT_MS);
    if (a.length > 0) return true;
  } catch (error) {
    if (!isDefiniteMiss(error)) return null;
  }
  try {
    const aaaa = await withTimeout(dns.resolve6(domain), MX_TIMEOUT_MS);
    if (aaaa.length > 0) return true;
  } catch (error) {
    if (!isDefiniteMiss(error)) return null;
  }
  return false;
}

export async function verifyEmail(email: string): Promise<EmailVerdict> {
  const trimmed = email.trim();
  if (trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(trimmed)) {
    return { ok: false, reason: 'syntax' };
  }
  const domain = trimmed.slice(trimmed.lastIndexOf('@') + 1).toLowerCase();
  if (isDisposableDomain(domain)) return { ok: false, reason: 'disposable' };

  const accepts = await domainAcceptsMail(domain);
  if (accepts === false) return { ok: false, reason: 'no_mx' };
  if (accepts === null) {
    console.warn(
      `[verifyEmail] DNS lookup inconclusive for ${domain}; letting it through`
    );
    return { ok: true, deliverability: 'unknown' };
  }
  return { ok: true, deliverability: 'verified' };
}
