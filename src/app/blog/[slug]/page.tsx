import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Arrow, ContactCTA } from "@/components/ui";
import { RevealText } from "@/components/motion/text";
import { ImageReveal } from "@/components/motion/primitives";
import { postBySlug, publishedPosts, relatedPosts } from "@/lib/blog";
import { pageMetadata, siteUrl } from "@/lib/metadata";

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  return post
    ? pageMetadata(
        post.title,
        post.excerpt,
        `/blog/${slug}`,
        post.featuredImage?.src,
        post.seo,
      )
    : {};
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const related = relatedPosts(post);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    publisher: { "@type": "Organization", name: "SLN Infra" },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    ...(post.featuredImage ? { image: `${siteUrl}${post.featuredImage.src}` } : {}),
  };

  return (
    <>
      <header className="masthead">
        <div className="sheet masthead-inner">
          <div className="masthead-lead">
            <p className="sheet-index label">
              <span className="label-num">01</span>
              <span className="label-sep">/</span> {post.category.label}
            </p>
            <RevealText as="h1" mode="lines" play="load" delay={0.1}>
              {post.title}
            </RevealText>
          </div>
          <p className="masthead-lede">
            {post.author}
            <br />
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
        </div>
        <div className="masthead-rule" />
      </header>

      {post.featuredImage && (
        <div className="post-banner sheet">
          <ImageReveal
            src={post.featuredImage.src}
            alt={post.featuredImage.alt}
            sizes="(max-width: 1100px) 100vw, 80vw"
            className="post-banner-frame"
          />
        </div>
      )}

      <article className="post-body sheet section-pad">
        {post.body.map((block, i) => {
          if (block.kind === "heading")
            return <h2 key={i}>{block.text}</h2>;
          if (block.kind === "quote")
            return (
              <blockquote key={i}>
                <p>{block.text}</p>
                {block.attribution && <cite>{block.attribution}</cite>}
              </blockquote>
            );
          if (block.kind === "image")
            return (
              <figure
                key={i}
                style={{
                  aspectRatio: `${block.media.width} / ${block.media.height}`,
                }}
              >
                <Image
                  src={block.media.src}
                  alt={block.media.alt}
                  fill
                  sizes="(max-width: 1100px) 100vw, 70vw"
                  loading="lazy"
                />
                {block.media.caption && (
                  <figcaption>{block.media.caption}</figcaption>
                )}
              </figure>
            );
          return <p key={i}>{block.text}</p>;
        })}

        {post.tags.length > 0 && (
          <p className="post-tags label muted">
            {post.tags.join(" · ")}
          </p>
        )}
      </article>

      {related.length > 0 && (
        <section className="sheet section-pad">
          <div className="section-heading">
            <RevealText as="h2" mode="lines">
              More from <em>the journal.</em>
            </RevealText>
            <Link href="/blog" className="text-link">
              All pieces <Arrow />
            </Link>
          </div>
          <div className="post-related">
            {related.map((entry) => (
              <article key={entry.slug}>
                <p className="label muted">{entry.category.label}</p>
                <h3>
                  <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      )}

      <ContactCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
