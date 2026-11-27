/**
 * A single, typed way to record what a visitor did.
 *
 * Events are pushed to `window.dataLayer`, which is the queue Google Tag
 * Manager drains once its container script loads. Pushing before GTM exists is
 * safe and intentional — the array simply holds the events until it does — so
 * nothing here depends on a container ID being configured yet. When SLN
 * supplies one, add it to the layout and every call below starts reporting
 * without any change to calling code.
 *
 * Nothing personally identifying is ever sent. The payload types below only
 * permit identifiers we already publish (a project slug, a page path, a
 * configuration label), never a name, phone number, email address or free-text
 * message — that data belongs in the lead store, not in analytics.
 */

export type AnalyticsEvent =
  | { event: "lead_form_view"; form: LeadFormId; project?: string }
  | { event: "lead_form_start"; form: LeadFormId; project?: string }
  | {
      event: "lead_submit";
      form: LeadFormId;
      project?: string;
      outcome: "sent" | "draft" | "error";
    }
  | { event: "project_view"; project: string; stage?: string }
  | { event: "whatsapp_click"; project?: string; placement: string }
  | { event: "brochure_download"; project: string; document: string }
  | { event: "floorplan_download"; project: string; configuration: string }
  | { event: "rera_download"; project: string }
  | { event: "virtual_tour_start"; project: string; experience: string }
  | { event: "3d_interaction"; project: string; experience: string }
  | { event: "emi_calculator_use"; project?: string }
  | { event: "career_application"; role: string };

export type LeadFormId =
  | "homepage"
  | "project"
  | "contact"
  | "channel_partner"
  | "career"
  | "popup";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Some events fire on interactions that repeat — dragging an immersive view,
 * nudging an EMI slider. Those are recorded once per page so the funnel counts
 * people rather than gestures.
 */
const fired = new Set<string>();

export function track(payload: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...payload });
}

/** Record an event at most once for the life of this page view. */
export function trackOnce(key: string, payload: AnalyticsEvent) {
  if (typeof window === "undefined" || fired.has(key)) return;
  fired.add(key);
  track(payload);
}
