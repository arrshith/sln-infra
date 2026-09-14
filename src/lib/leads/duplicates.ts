import type { Lead } from "./types";

/**
 * Deciding whether two enquiries are the same person.
 *
 * There is no single right answer here — it depends on how SLN works. Someone
 * enquiring about two different communities is two leads to one sales team and
 * one lead to another. So the rule is configuration, not a decision baked into
 * the code, and it is stated in one place.
 *
 * Whatever the rule, a match never deletes anything: the later lead is stored
 * and linked to the earlier one. A second enquiry is a signal of interest, and
 * throwing it away would hide that.
 */
export type DuplicateRule =
  | "phone"
  | "email"
  | "phone_and_project"
  | "email_and_project";

export const DEFAULT_RULE: DuplicateRule = "phone_and_project";

/**
 * Read from `LEAD_DUPLICATE_RULE`. Falls back to matching on phone plus
 * project, which treats the same person enquiring about a different community
 * as a new lead — the more conservative reading, since it never hides an
 * enquiry from the team.
 */
export function configuredRule(): DuplicateRule {
  const value = process.env.LEAD_DUPLICATE_RULE;
  const allowed: DuplicateRule[] = [
    "phone",
    "email",
    "phone_and_project",
    "email_and_project",
  ];
  return allowed.includes(value as DuplicateRule)
    ? (value as DuplicateRule)
    : DEFAULT_RULE;
}

/**
 * The comparable identity of a lead under a given rule. Storage indexes this,
 * so finding duplicates is a lookup rather than a scan.
 */
export function fingerprint(
  lead: Pick<Lead, "phoneKey" | "emailKey" | "project">,
  rule: DuplicateRule = configuredRule(),
): string {
  const project = lead.project ?? "-";
  switch (rule) {
    case "phone":
      return `phone:${lead.phoneKey}`;
    case "email":
      return `email:${lead.emailKey}`;
    case "email_and_project":
      return `email:${lead.emailKey}|project:${project}`;
    case "phone_and_project":
    default:
      return `phone:${lead.phoneKey}|project:${project}`;
  }
}
