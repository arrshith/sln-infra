import type { MediaItem, Seo } from "./content";

/**
 * The journal.
 *
 * Empty for the same reason as careers: SLN has not supplied articles, and
 * inventing some — even as filler — would put writing in their voice that they
 * never approved. The routes, listing, detail page and metadata all work from
 * this array the moment a post is added.
 */

export type PostCategory = {
  slug: string;
  label: string;
};

export type Post = {
  slug: string;
  title: string;
  /** One-line standfirst, used on the listing and as the meta description. */
  excerpt: string;
  author: string;
  /** ISO date. */
  publishedAt: string;
  category: PostCategory;
  tags: string[];
  featuredImage?: MediaItem;
  /** Paragraphs and headings, in order. */
  body: PostBlock[];
  seo?: Seo;
  published: boolean;
};

export type PostBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "image"; media: MediaItem };

/** Awaiting SLN. */
export const posts: Post[] = [];

export function publishedPosts(): Post[] {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function postBySlug(slug: string): Post | undefined {
  return publishedPosts().find((post) => post.slug === slug);
}

export function categories(): PostCategory[] {
  const seen = new Map<string, PostCategory>();
  for (const post of publishedPosts()) seen.set(post.category.slug, post.category);
  return [...seen.values()];
}

/** Same category first, most recent first, excluding the post itself. */
export function relatedPosts(post: Post, count = 3): Post[] {
  const others = publishedPosts().filter((entry) => entry.slug !== post.slug);
  const sameCategory = others.filter(
    (entry) => entry.category.slug === post.category.slug,
  );
  const rest = others.filter(
    (entry) => entry.category.slug !== post.category.slug,
  );
  return [...sameCategory, ...rest].slice(0, count);
}
