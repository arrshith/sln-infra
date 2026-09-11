import { EnquiryForm } from "@/components/enquiry-form";
import { Arrow } from "@/components/ui";
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
      <section className="page-intro container">
        <p className="eyebrow">LET’S START A CONVERSATION</p>
        <div className="page-intro-grid">
          <h1>
            Your next chapter
            <br />
            <em>starts here.</em>
          </h1>
          <p>
            A question. A conversation. A visit.
            <br />
            However you’d like to begin,
            <br />
            we’re here to help.
          </p>
        </div>
      </section>
      <div className="container contact-grid">
        <section
          className="contact-details"
          aria-label="SLN Infra contact information"
        >
          <div>
            <p className="eyebrow">GIVE US A CALL</p>
            <a className="contact-large-link" href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
          <div>
            <p className="eyebrow">WRITE TO US</p>
            <a className="contact-large-link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <div>
            <p className="eyebrow">VISIT OUR OFFICE</p>
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
          deliveryEnabled={Boolean(
            process.env.ENQUIRY_WEBHOOK_URL &&
            process.env.ENQUIRY_WEBHOOK_SECRET,
          )}
        />
      </div>
    </div>
  );
}
