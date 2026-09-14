import { projects, type Project, type ProjectStage } from "./content";

/**
 * One place that knows how to pick projects out of the content layer, so a
 * listing page, the homepage index and the sitemap can never drift apart on
 * what "featured" or "ongoing" means.
 */

export const STAGES: ProjectStage[] = ["completed", "ongoing", "upcoming"];

/** Human-readable stage names, for headings and filters. */
export const STAGE_LABEL: Record<ProjectStage, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

export function bySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function byStage(stage: ProjectStage): Project[] {
  return projects.filter((project) => project.stage === stage);
}

/**
 * Projects SLN has not yet assigned a stage to. They still appear in the full
 * portfolio — they are simply absent from the stage-specific listings rather
 * than being filed under a guess.
 */
export function withoutStage(): Project[] {
  return projects.filter((project) => !project.stage);
}

/** Whether any stage has been supplied yet, so listings can say so honestly. */
export const hasStageData = projects.some((project) => project.stage);

export function featured(limit = 3): Project[] {
  const marked = projects.filter((project) => project.featured);
  return (marked.length ? marked : projects).slice(0, limit);
}

/**
 * Projects in the same city first, topped up from the rest — used for "more
 * places" at the foot of a project page.
 */
export function related(project: Project, count = 2): Project[] {
  const sameCity = projects.filter(
    (other) => other.slug !== project.slug && other.city === project.city,
  );
  const rest = projects.filter(
    (other) => other.slug !== project.slug && other.city !== project.city,
  );
  return [...sameCity, ...rest].slice(0, count);
}
