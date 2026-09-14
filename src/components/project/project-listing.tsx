"use client";

import Link from "next/link";
import { useState } from "react";
import { Arrow, ProjectCard } from "@/components/ui";
import { STAGE_LABEL, STAGES } from "@/lib/projects";
import { projects, type Project, type ProjectStage } from "@/lib/content";

/**
 * Project discovery. Stage is the route — /projects/ongoing and so on — while
 * city stays a control on the page, because a visitor narrowing by city is
 * browsing, not navigating to a different subject.
 *
 * Stage counts are shown next to each tab so the state of the portfolio is
 * legible before you click. A stage SLN has not yet assigned reads "—" rather
 * than "0", which would imply they have nothing under way.
 */
const CITIES = ["All cities", "Bengaluru", "Hyderabad"] as const;

export function ProjectListing({
  stage,
  items,
}: {
  /** Absent on /projects, which shows the whole portfolio. */
  stage?: ProjectStage;
  items: Project[];
}) {
  const [city, setCity] = useState<(typeof CITIES)[number]>("All cities");
  const visible = items.filter(
    (project) => city === "All cities" || project.city === city,
  );

  const stagedCount = (value: ProjectStage) =>
    projects.filter((project) => project.stage === value).length;
  const anyStaged = projects.some((project) => project.stage);

  return (
    <>
      <nav className="stage-nav" aria-label="Project stages">
        <Link href="/projects" aria-current={!stage ? "page" : undefined}>
          All projects
          <span>{String(projects.length).padStart(2, "0")}</span>
        </Link>
        {STAGES.map((value) => (
          <Link
            key={value}
            href={`/projects/${value}`}
            aria-current={stage === value ? "page" : undefined}
          >
            {STAGE_LABEL[value]}
            <span>
              {anyStaged ? String(stagedCount(value)).padStart(2, "0") : "—"}
            </span>
          </Link>
        ))}
      </nav>

      {/* A city switch with nothing to switch between is furniture, not a
          control: three chips all reading "00" over an empty grid is the single
          loudest way to make a stage that SLN has not filled in yet look
          broken. It appears once there is something to filter. */}
      {items.length > 0 && (
        <div className="project-toolbar">
          <div
            className="filter-buttons"
            role="group"
            aria-label="Filter projects by city"
          >
            {CITIES.map((option) => (
              <button
                key={option}
                onClick={() => setCity(option)}
                aria-pressed={city === option}
              >
                {option === "All cities" ? "All communities" : option}
                <span>
                  {String(
                    option === "All cities"
                      ? items.length
                      : items.filter((project) => project.city === option)
                          .length,
                  ).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          <p className="label muted" role="status">
            {visible.length}{" "}
            {visible.length === 1 ? "COMMUNITY" : "COMMUNITIES"}
          </p>
        </div>
      )}

      {visible.length > 0 ? (
        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              // Matched on the slug, not on object identity: `items` crosses
              // the server/client boundary and arrives as fresh objects, so
              // `indexOf` would miss every one of them and number the whole
              // portfolio "00".
              number={String(
                projects.findIndex((p) => p.slug === project.slug) + 1,
              ).padStart(2, "0")}
            />
          ))}
        </div>
      ) : (
        <EmptyStage stage={stage} city={city} />
      )}
    </>
  );
}

/**
 * Nothing to show. Which is a real state worth designing, not an error: either
 * SLN has not yet told us which communities sit at this stage, or the city
 * filter has excluded them all.
 */
function EmptyStage({
  stage,
  city,
}: {
  stage?: ProjectStage;
  city: string;
}) {
  const unassigned = stage && !projects.some((project) => project.stage);

  return (
    <div className="stage-empty">
      <p className="label muted">
        {stage ? STAGE_LABEL[stage] : "Portfolio"}
        <span className="label-sep">/</span> Nothing listed
      </p>
      <p className="stage-empty-line">
        {unassigned
          ? "We are confirming which communities sit at this stage. In the meantime, the full portfolio is here."
          : city !== "All cities"
            ? `No communities at this stage in ${city} right now.`
            : "No communities at this stage right now."}
      </p>
      <Link href="/projects" className="text-link">
        View all projects <Arrow />
      </Link>
    </div>
  );
}
