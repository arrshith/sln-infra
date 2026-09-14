import type { Metadata } from "next";
import type { Project, Seo } from "./content";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.slninfra.in"
).replace(/\/$/, "");

/**
 * One builder for every page's metadata, so titles, canonicals and social cards
 * are constructed the same way everywhere and can never drift.
 *
 * `seo` is the per-record override SLN will eventually edit — title, meta
 * description, focus keyword, social title/description/image. Anything they
 * have not set falls back to the page's own copy rather than to a placeholder,
 * so a record with no SEO fields still ships correct, meaningful metadata.
 */
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/nidhi-palms.webp",
  seo?: Seo,
): Metadata {
  const finalTitle = seo?.title ?? title;
  const finalDescription = seo?.description ?? description;
  const ogTitle = seo?.ogTitle ?? finalTitle;
  const ogDescription = seo?.ogDescription ?? finalDescription;
  const ogImage = seo?.ogImage ?? image;

  return {
    title: { absolute: `${finalTitle} | SLN Infra` },
    description: finalDescription,
    alternates: { canonical: path },
    // The focus keyword is an editorial aid for whoever writes the copy, not a
    // ranking signal — search engines ignore the keywords meta. It is carried
    // here so the eventual admin can round-trip it, and nothing more.
    keywords: seo?.focusKeyword ? [seo.focusKeyword] : undefined,
    openGraph: {
      title: `${ogTitle} | SLN Infra`,
      description: ogDescription,
      url: path,
      type: "website",
      siteName: "SLN Infra",
      locale: "en_IN",
      images: [{ url: ogImage, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${ogTitle} | SLN Infra`,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

/** A project's metadata, derived from its record and overridable via `seo`. */
export function projectMetadata(project: Project): Metadata {
  return pageMetadata(
    `${project.name} — ${project.location}`,
    project.description,
    `/projects/${project.slug}`,
    project.image,
    project.seo,
  );
}
