import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.slninfra.in"
).replace(/\/$/, "");

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/images/nidhi-palms.webp",
): Metadata {
  return {
    title: { absolute: `${title} | SLN Infra` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | SLN Infra`,
      description,
      url: path,
      type: "website",
      siteName: "SLN Infra",
      locale: "en_IN",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | SLN Infra`,
      description,
      images: [image],
    },
  };
}
