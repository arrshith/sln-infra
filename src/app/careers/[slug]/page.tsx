import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, ContactCTA } from "@/components/ui";
import { RevealText } from "@/components/motion/text";
import { JOB_TYPE_LABEL, jobBySlug, publishedJobs } from "@/lib/careers";
import { company } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return publishedJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = jobBySlug(slug);
  return job
    ? pageMetadata(job.title, job.summary, `/careers/${slug}`, undefined, job.seo)
    : {};
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = jobBySlug(slug);
  if (!job) notFound();

  return (
    <>
      <header className="masthead">
        <div className="sheet masthead-inner">
          <div className="masthead-lead">
            <p className="sheet-index label">
              <span className="label-num">01</span>
              <span className="label-sep">/</span> {job.team}
            </p>
            <RevealText as="h1" mode="lines" play="load" delay={0.1}>
              {job.title}
            </RevealText>
          </div>
          <p className="masthead-lede">
            {job.location} · {JOB_TYPE_LABEL[job.type]}
            {job.experience ? ` · ${job.experience}` : ""}
          </p>
        </div>
        <div className="masthead-rule" />
      </header>

      <section className="sheet section-pad">
        <div className="detail-intro">
          <p className="sheet-index label">
            <span className="label-num">02</span>
            <span className="label-sep">/</span> The role
          </p>
          <div>
            <p className="lede">{job.summary}</p>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <>
                <h2 className="job-heading">What you would do</h2>
                <ul className="job-points">
                  {job.responsibilities.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="job-heading">What we are looking for</h2>
                <ul className="job-points">
                  {job.requirements.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </>
            )}

            {job.closed ? (
              <p className="job-closed">
                This role is closed. Other openings are listed on the{" "}
                <Link href="/careers">careers page</Link>.
              </p>
            ) : (
              <a
                className="button button-amber job-apply"
                href={`mailto:${company.email}?subject=${encodeURIComponent(
                  `Application — ${job.title}`,
                )}`}
              >
                <span>Apply for this role</span>
                <Arrow diagonal />
              </a>
            )}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
