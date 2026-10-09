// Phone normalisation shared by the client (so the visitor gets an inline
// error) and the API routes (so a direct POST can't skip it). Deliberately
// permissive about formatting — "+34 600 00 00 00", "600-000-000",
// "(+34) 600000000" all pass — and only strict about the thing that matters:
// enough digits to actually be dialled.
//
// 9 digits is the Spanish national length; 15 is the E.164 maximum.

const MIN_DIGITS = 9;
const MAX_DIGITS = 15;

/** Strips spaces, dots, dashes and parentheses; keeps a leading `+`. */
export function normalizePhone(raw: string): string {
  // Strip formatting first so "(+34) 600 000 000" keeps its country code.
  const compact = raw.trim().replaceAll(/[\s().-]/g, '');
  const plus = compact.startsWith('+') ? '+' : '';
  return plus + compact.replace(/^\+/, '');
}

export function isValidPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  const digits = normalized.replace(/^\+/, '');
  return (
    /^\d+$/.test(digits) &&
    digits.length >= MIN_DIGITS &&
    digits.length <= MAX_DIGITS
  );
}
