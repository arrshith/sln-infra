import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/projects",
    "/about",
    "/contact",
    "/privacy",
    "/disclaimer",
    ...projects.map((p) => `/projects/${p.slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path.startsWith("/projects") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/projects") ? 0.8 : 0.5,
  }));
}
