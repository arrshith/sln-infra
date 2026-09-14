/**
 * The lead domain.
 *
 * A lead is the record of someone asking SLN a question. It is deliberately
 * separate from the enquiry *form* that produced it: the same shape has to hold
 * a homepage enquiry, a project enquiry, a channel-partner application and a
 * career application, and it has to survive being read months later by someone
 * deciding who to call back.
 */

export type LeadSource =
  | "homepage"
  | "project"
  | "contact"
  | "channel_partner"
  | "career"
  | "whatsapp";

/**
 * Where a lead has reached in SLN's pipeline. Kept as a plain union so the set
 * can be changed in one place — these are a reasonable starting set, not a
 * claim about how SLN actually works. Confirm before the admin is built.
 */
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site_visit"
  | "negotiation"
  | "booked"
  | "lost"
  | "duplicate";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "site_visit",
  "negotiation",
  "booked",
  "lost",
  "duplicate",
];

export type Lead = {
  id: string;
  name: string;
  /** As typed, for display. */
  phone: string;
  email: string;
  /** Digits only, +country code stripped to a comparable form. */
  phoneKey: string;
  /** Lowercased and trimmed. */
  emailKey: string;
  /** Project slug, when the enquiry carried one. */
  project?: string;
  source: LeadSource;
  status: LeadStatus;
  message?: string;
  consent: boolean;
  createdAt: string;
  /**
   * Set when this lead matches one already stored. The earlier lead's id — the
   * duplicate is kept and linked, never discarded, because a second enquiry is
   * itself information about how interested someone is.
   */
  duplicateOf?: string;
  /**
   * Anything the form knew that is not a field of its own: campaign, referrer,
   * the page it came from. Never used for identity.
   */
  metadata?: Record<string, string>;
};

/** What the service returns, so callers can report honestly. */
export type LeadOutcome = {
  lead: Lead;
  /** False when no storage adapter is configured — see repository.ts. */
  persisted: boolean;
  /** True when an existing lead matched under the configured rule. */
  duplicate: boolean;
  /** True when the external enquiry webhook accepted it. */
  forwarded: boolean;
};
