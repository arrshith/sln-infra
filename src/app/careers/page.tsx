import Link from "next/link";
import { ContactCTA, Arrow } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { Reveal } from "@/components/motion/primitives";
import { JOB_TYPE_LABEL, publishedJobs } from "@/lib/careers";
import { company } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Careers",
  "Build with SLN Infra. Current openings across design, site and sales in Bengaluru and Hyderabad.",
  "/careers",
);

export default function CareersPage() {
  const jobs = publishedJobs();

  return (
    <>
      <Masthead
        index="01"
        section="Careers"
        title={
          <>
            Build what
            <br />
            <em>lasts.</em>
          </>
        }
        lede={
          <>
            Architects, engineers and site teams who would rather be judged on
            what still stands in twenty years.
          </>
        }
      />

      <section className="sheet section-pad" aria-label="Current openings">
        {jobs.length > 0 ? (
          <Reveal className="job-list">
            {jobs.map((job, i) => (
              <Link
                key={job.slug}
                href={`/careers/${job.slug}`}
                className="job-row"
                data-stagger
              >
                <span className="label muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="job-title">{job.title}</span>
                <span className="label muted">{job.team}</span>
                <span className="label muted">{job.location}</span>
                <span className="label muted">{JOB_TYPE_LABEL[job.type]}</span>
                <span className="job-go">
                  <Arrow diagonal />
                </span>
              </Link>
            ))}
          </Reveal>
        ) : (
          <div className="stage-empty">
            <p className="label muted">
              Openings <span className="label-sep">/</span> None listed
            </p>
            <p className="stage-empty-line">
              We are not advertising a role right now. If you build well, write
              to us anyway — we would rather meet good people early.
            </p>
            <a className="text-link" href={`mailto:${company.email}`}>
              {company.email} <Arrow diagonal />
            </a>
          </div>
        )}
      </section>

      <ContactCTA />
    </>
  );
}
