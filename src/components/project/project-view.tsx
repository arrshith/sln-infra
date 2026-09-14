"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

/**
 * Records that a project page was seen, once per visit to it. Renders nothing.
 *
 * It exists as a component rather than a hook inside the page because the page
 * itself is a server component — this is the smallest possible client boundary
 * for the one thing that has to happen in the browser.
 */
export function ProjectView({ slug, stage }: { slug: string; stage?: string }) {
  useEffect(() => {
    trackOnce(`project-${slug}`, { event: "project_view", project: slug, stage });
  }, [slug, stage]);

  return null;
}
