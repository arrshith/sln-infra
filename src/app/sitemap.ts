import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { publishedJobs } from "@/lib/careers";
import { publishedPosts } from "@/lib/blog";
import { STAGES } from "@/lib/projects";
import { siteUrl } from "@/lib/metadata";

/**
 * Every indexable route. Listings that are currently empty — careers, the
 * journal — are still listed: the page itself is a real destination, and it is
 * where search engines should come back to once SLN publishes into it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/projects",
    ...STAGES.map((stage) => `/projects/${stage}`),
    "/about",
    "/contact",
    "/careers",
    "/channel-partners",
    "/blog",
    "/privacy",
    "/disclaimer",
    ...projects.map((p) => `/projects/${p.slug}`),
    ...publishedJobs().map((job) => `/careers/${job.slug}`),
    ...publishedPosts().map((post) => `/blog/${post.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path.startsWith("/projects") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/projects") ? 0.8 : 0.5,
  }));
}
