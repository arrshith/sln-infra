import { EnquiryForm } from "@/components/enquiry-form";
import { Arrow } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { company, projects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Get in touch",
  "Talk to SLN Infra about your next home. Explore villa communities, ask a question or arrange a visit in Bengaluru or Hyderabad.",
  "/contact",
);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; intent?: string }>;
}) {
  const query = await searchParams;
  const initialProject = projects.some((p) => p.slug === query.project)
    ? query.project!
    : "";
  return (
    <div className="contact-page">
      <Masthead
        index="01"
        section="Let’s start a conversation"
        title={
          <>
            Your next chapter
            <br />
            <em>starts here.</em>
          </>
        }
        lede={
          <>
            A question. A conversation. A visit. However you’d like to begin,
            we’re here to help.
          </>
        }
      />
      <div className="contact-grid">
        <section
          className="contact-details"
          aria-label="SLN Infra contact information"
        >
          <div>
            <p className="label">Give us a call</p>
            <a className="contact-large-link" href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
          <div>
            <p className="label">Write to us</p>
            <a className="contact-large-link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <div>
            <p className="label">Visit our office</p>
            <p>{company.address}</p>
            <a
              className="text-link"
              href={company.map}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions <Arrow diagonal />
            </a>
          </div>
          <div>
            <p className="label">Channel partners</p>
            <p>
              Firms representing buyers can register with our sales team.
            </p>
            <a className="text-link" href="/channel-partners">
              Partner with SLN Infra <Arrow diagonal />
            </a>
          </div>
          <div className="contact-map">
            <iframe
              title="SLN Infra office location in Dodda Banaswadi, Bengaluru"
              src="https://maps.google.com/maps?q=SLN%20Infra%20Builders%20Dodda%20Banaswadi%20Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <p className="form-help">Map provided by Google Maps.</p>
          </div>
        </section>
        <noscript>
          <style>{".enquiry-form { display: none; }"}</style>
          <p>
            To enquire, please call{" "}
            <a href={company.phoneHref}>{company.phone}</a> or email{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </noscript>
        <EnquiryForm
          initialProject={initialProject}
          visit={query.intent === "visit"}
          source="contact"
          deliveryEnabled={Boolean(
            process.env.ENQUIRY_WEBHOOK_URL &&
            process.env.ENQUIRY_WEBHOOK_SECRET,
          )}
        />
      </div>
    </div>
  );
}
