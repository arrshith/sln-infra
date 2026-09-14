/**
 * Careers.
 *
 * The list is empty because SLN has not supplied any openings — not because
 * the feature is unfinished. Everything a job needs is modelled here, the pages
 * render from this array, and adding a role is a data change. The eventual
 * admin writes to exactly this shape.
 */

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship";

export const JOB_TYPE_LABEL: Record<JobType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  internship: "Internship",
};

export type Job = {
  slug: string;
  title: string;
  /** e.g. "Design", "Site", "Sales" */
  team: string;
  location: string;
  type: JobType;
  /** Hidden from the site without being deleted. */
  published: boolean;
  /** Closed roles stay readable but stop accepting applications. */
  closed?: boolean;
  postedAt?: string;
  summary: string;
  responsibilities?: string[];
  requirements?: string[];
  experience?: string;
  seo?: { title?: string; description?: string };
};

/** Awaiting SLN. See docs/validation.md for the outstanding content list. */
export const jobs: Job[] = [];

export function publishedJobs(): Job[] {
  return jobs.filter((job) => job.published);
}

export function jobBySlug(slug: string): Job | undefined {
  return publishedJobs().find((job) => job.slug === slug);
}
