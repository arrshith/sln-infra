/**
 * Turning what someone typed into something comparable.
 *
 * People write the same phone number a dozen ways — +91 80950 44474,
 * 080950-44474, 8095044474 — and a duplicate check that compares the raw
 * strings finds nothing. These functions produce the keys that identity is
 * decided on; the original text is always kept alongside for display, because
 * showing a caller their number in the form they gave it matters.
 */

/**
 * Indian mobile numbers are ten digits. Strip everything that is not a digit,
 * then drop a leading country code or trunk zero so the three spellings above
 * all reduce to the same ten.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.slice(-10);
}

/**
 * Case and surrounding space never distinguish two addresses. Gmail's dots and
 * `+tags` are deliberately *not* collapsed: that behaviour is specific to a few
 * providers, and treating `a.b@example.com` as `ab@example.com` everywhere
 * would merge genuinely different people.
 */
export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/** Collapse runs of whitespace so names compare and display cleanly. */
export function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
