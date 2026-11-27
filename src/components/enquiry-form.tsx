"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { company, projects } from "@/lib/content";
import { validateEnquiry } from "@/lib/enquiry";
import { track, trackOnce, type LeadFormId } from "@/lib/analytics";
import { Arrow } from "./ui";

/**
 * The one enquiry form the site uses, wherever an enquiry is made.
 *
 * `source` travels with the submission so a lead can be filed by where it came
 * from — a project page, the contact page, the channel-partner page — which is
 * what the dashboard will group by. The channel-partner variant adds the firm
 * name and changes the copy; everything else about it is identical, because a
 * second form implementation is a second set of validation bugs.
 */
export function EnquiryForm({
  initialProject,
  visit,
  deliveryEnabled,
  source = "contact",
  variant = "customer",
  compact = false,
}: {
  initialProject: string;
  visit: boolean;
  deliveryEnabled: boolean;
  source?: LeadFormId;
  variant?: "customer" | "channel_partner";
  /** Drops the optional message field, for the popup. */
  compact?: boolean;
}) {
  const partner = variant === "channel_partner";
  const [state, setState] = useState<
    "idle" | "loading" | "sent" | "draft" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const feedback = useRef<HTMLDivElement>(null);

  function showFeedback() {
    requestAnimationFrame(() => feedback.current?.focus());
  }
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = validateEnquiry({
      ...Object.fromEntries(fields.entries()),
      consent: fields.get("consent") === "on",
    });
    if ("error" in result) {
      setError(result.error);
      setState("error");
      track({ event: "lead_submit", form: source, outcome: "error" });
      showFeedback();
      return;
    }
    setState("loading");
    if (!deliveryEnabled) {
      const data = result.data;
      const project =
        projects.find((p) => p.slug === data.project)?.name ||
        "Help me find a home";
      const subject = `${visit ? "Site visit" : "Enquiry"} — ${project}`;
      const body = `Hello SLN Infra,\n\n${visit ? "I would like to arrange a site visit." : "I would like to know more about your homes."}\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nProject: ${project}\n\n${data.message}\n\nI agree to being contacted about this enquiry.`;
      setDraft(
        `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
      setState("draft");
      showFeedback();
      return;
    }
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, source }),
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) throw new Error("delivery");
      setState("sent");
      track({
        event: "lead_submit",
        form: source,
        project: result.data.project || undefined,
        outcome: "sent",
      });
      form.reset();
    } catch {
      setError(
        "We couldn’t confirm delivery. Your details are still here. Please try again or contact us directly.",
      );
      setState("error");
    }
    showFeedback();
  }

  return (
    <form
      className="enquiry-form"
      method="post"
      action="/api/enquiry"
      onSubmit={submit}
      onChange={() => {
        if (state !== "loading") setState("idle");
      }}
      onFocus={() =>
        trackOnce(`form-start-${source}`, {
          event: "lead_form_start",
          form: source,
        })
      }
    >
      <h2>
        {partner
          ? "Let’s work together."
          : visit
            ? "Come see for yourself."
            : "Let’s find your home."}
      </h2>
      <p className="form-intro">
        {partner
          ? "Tell us about your firm and the buyers you work with. "
          : "Tell us a little about what you’re looking for. "}
        {deliveryEnabled
          ? "Our team will help with the next step."
          : "We’ll prepare an enquiry for you to send through your email app."}
      </p>
      <fieldset className="form-fields" disabled={state === "loading"}>
        <div className="form-grid">
          {partner && (
            <div className="form-field form-field-full">
              <label htmlFor="company">Firm name *</label>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Your firm or agency"
                required
                maxLength={120}
              />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="name">Your name *</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Full name"
              required
              minLength={2}
              maxLength={100}
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91"
              required
              minLength={8}
              maxLength={30}
            />
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </div>
          <div className="form-field form-field-full">
            <label htmlFor="project">A community on your mind?</label>
            <select id="project" name="project" defaultValue={initialProject}>
              <option value="">Help me find the right home</option>
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {p.city}
                  {p.status === "Sold out" ? " (sold out)" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Validation expects the field, so compact sends it empty. */}
          {compact && <input type="hidden" name="message" value="" />}
          {!compact && (
            <div className="form-field form-field-full">
              <label htmlFor="message">
                Tell us a little more <span>(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your ideal home, a question, or a good time to visit…"
                rows={3}
                maxLength={2000}
                defaultValue={
                  visit
                    ? "I’d like to arrange a visit. Please get in touch to find a suitable time."
                    : ""
                }
              />
            </div>
          )}
        </div>
        <div className="form-honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label className="form-consent">
          <input type="checkbox" name="consent" required />
          <span>
            I agree to SLN Infra contacting me about this enquiry. I have read
            the <Link href="/privacy">privacy notice</Link>.
          </span>
        </label>
      </fieldset>
      <button
        className="button button-dark"
        type="submit"
        disabled={state === "loading" || state === "sent"}
        aria-busy={state === "loading"}
      >
        {state === "loading"
          ? "Sending enquiry…"
          : state === "sent"
            ? "Enquiry received"
            : deliveryEnabled
              ? "Send your enquiry"
              : "Prepare your enquiry"}
        <Arrow diagonal />
      </button>
      <p className="form-help">
        {deliveryEnabled
          ? "Your details are used to respond to your enquiry."
          : "Nothing is sent until you open and send the email. Prefer to talk?"}{" "}
        {!deliveryEnabled && <a href={company.phoneHref}>{company.phone}</a>}
      </p>
      {state === "error" && (
        <div
          ref={feedback}
          className="form-feedback form-error"
          role="alert"
          tabIndex={-1}
        >
          <p>{error}</p>
          <a href={`mailto:${company.email}`}>Email our team</a>
        </div>
      )}
      {state === "draft" && (
        <div
          ref={feedback}
          className="form-feedback"
          role="status"
          tabIndex={-1}
        >
          <h3>Your enquiry is ready.</h3>
          <p>
            Open your email app to review and send it to SLN Infra. Your enquiry
            has not been sent yet.
          </p>
          <a className="text-link" href={draft}>
            Open email draft <Arrow diagonal />
          </a>
          <p className="form-help">
            If no email app opens, email {company.email} or call {company.phone}
            .
          </p>
        </div>
      )}
      {state === "sent" && (
        <div
          ref={feedback}
          className="form-feedback"
          role="status"
          tabIndex={-1}
        >
          <h3>Thank you. Let’s take the next step.</h3>
          <p>
            Your enquiry has been received. The SLN Infra team will get in touch
            using the details you shared.
          </p>
        </div>
      )}
    </form>
  );
}
