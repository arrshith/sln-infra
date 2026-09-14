import { randomUUID } from "node:crypto";
import type { Enquiry } from "../enquiry";
import { configuredRule, fingerprint } from "./duplicates";
import { normalizeEmail, normalizeName, normalizePhone } from "./normalize";
import { getRepository } from "./repository";
import type { Lead, LeadOutcome, LeadSource } from "./types";

export * from "./types";
export * from "./duplicates";
export * from "./repository";
export { normalizeEmail, normalizePhone, normalizeName };

/**
 * The pipeline a validated enquiry travels:
 *
 *   normalise → associate with a project → detect duplicates → persist → forward
 *
 * Each step is separable and none of them assumes the next one exists. In
 * particular, persistence is optional: with no storage adapter registered the
 * lead is still built, still normalised and still forwarded to the configured
 * webhook, and the outcome reports `persisted: false` so the caller can be
 * honest about what happened to it.
 */
export async function recordLead(
  enquiry: Enquiry,
  context: { source: LeadSource; metadata?: Record<string, string> },
): Promise<LeadOutcome> {
  const phoneKey = normalizePhone(enquiry.phone);
  const emailKey = normalizeEmail(enquiry.email);

  const lead: Lead = {
    id: randomUUID(),
    name: normalizeName(enquiry.name),
    phone: enquiry.phone,
    email: enquiry.email,
    phoneKey,
    emailKey,
    project: enquiry.project || undefined,
    source: context.source,
    status: "new",
    message: enquiry.message || undefined,
    consent: enquiry.consent,
    createdAt: new Date().toISOString(),
    metadata: context.metadata,
  };

  const repository = getRepository();
  if (!repository) {
    // No store configured. Say so rather than implying the lead was kept.
    return { lead, persisted: false, duplicate: false, forwarded: false };
  }

  const key = fingerprint(lead, configuredRule());
  const existing = await repository.findByFingerprint(key);
  if (existing) {
    // Linked, not discarded — and flagged so the team can segregate it.
    lead.duplicateOf = existing.id;
    lead.status = "duplicate";
  }

  const stored = await repository.create(lead, key);
  return {
    lead: stored,
    persisted: true,
    duplicate: Boolean(existing),
    forwarded: false,
  };
}
