import type { Lead, LeadStatus } from "./types";

/**
 * The storage boundary.
 *
 * Everything above this line — normalisation, duplicate detection, the service
 * pipeline — is written against this interface and knows nothing about where
 * leads end up. That is the whole point: when SLN chooses a database, one
 * adapter implements these five methods and nothing else changes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PRODUCTION CONFIGURATION STILL REQUIRED
 *
 * No adapter is registered. `getRepository()` returns null, the service
 * reports `persisted: false`, and the enquiry route continues to rely on the
 * external webhook exactly as it did before. Nothing pretends otherwise, and
 * no enquiry is silently dropped into a store that does not exist.
 *
 * To connect one:
 *   1. Implement `LeadRepository` (Postgres/Prisma, Supabase, Dynamo — the
 *      interface does not care).
 *   2. Register it from `getRepository()` behind an environment check.
 *   3. Index `fingerprint` — duplicate detection is a lookup on it.
 *   4. Set retention and access controls; leads are personal data.
 * ─────────────────────────────────────────────────────────────────────────
 */
export interface LeadRepository {
  create(lead: Lead, fingerprint: string): Promise<Lead>;
  /** The earliest lead sharing this fingerprint, if any. */
  findByFingerprint(fingerprint: string): Promise<Lead | null>;
  findById(id: string): Promise<Lead | null>;
  list(filter?: LeadFilter): Promise<Lead[]>;
  updateStatus(id: string, status: LeadStatus): Promise<Lead | null>;
}

export type LeadFilter = {
  project?: string;
  status?: LeadStatus;
  /** Only leads that were flagged as duplicates, or only those that were not. */
  duplicates?: boolean;
  limit?: number;
};

/**
 * Returns the configured adapter, or null when none is registered.
 *
 * Callers must treat null as "not stored" and say so — never as success.
 */
export function getRepository(): LeadRepository | null {
  return null;
}

/** Whether leads are durably stored in this deployment. */
export function hasPersistence(): boolean {
  return getRepository() !== null;
}
