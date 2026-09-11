"use client";

import { useState } from "react";
import { projects } from "@/lib/content";
import { ProjectCard } from "./ui";

const filters = ["All communities", "Bengaluru", "Hyderabad"] as const;

export function ProjectFilter() {
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All communities");
  const visible = projects.filter(
    (p) => filter === "All communities" || p.city === filter,
  );
  return (
    <>
      <div className="project-toolbar">
        <div
          className="filter-buttons"
          role="group"
          aria-label="Filter projects by city"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
              <span>
                {f === "All communities"
                  ? projects.length.toString().padStart(2, "0")
                  : projects
                      .filter((p) => p.city === f)
                      .length.toString()
                      .padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <p className="eyebrow muted" role="status">
          {visible.length} {visible.length === 1 ? "COMMUNITY" : "COMMUNITIES"}
        </p>
      </div>
      <div className="projects-grid">
        {visible.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            number={(projects.indexOf(p) + 1).toString().padStart(2, "0")}
          />
        ))}
      </div>
    </>
  );
}
