import Link from "next/link";
import Image from "next/image";
import { Arrow, ContactCTA } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { Reveal } from "@/components/motion/primitives";
import { publishedPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Journal",
  "Notes on architecture, construction and villa living from the SLN Infra team.",
  "/blog",
);

export default function BlogPage() {
  const posts = publishedPosts();

  return (
    <>
      <Masthead
        index="01"
        section="Journal"
        title={
          <>
            Notes from
            <br />
            <em>the drawing board.</em>
          </>
        }
        lede={
          <>
            How we think about sites, materials and the way a community comes
            together.
          </>
        }
      />

      <section className="sheet section-pad" aria-label="Articles">
        {posts.length > 0 ? (
          <Reveal className="post-list">
            {posts.map((post) => (
              <article key={post.slug} className="post-row" data-stagger>
                <p className="label muted">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span className="label-sep">/</span> {post.category.label}
                </p>
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="post-excerpt">{post.excerpt}</p>
                {post.featuredImage && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="post-image"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      aspectRatio: `${post.featuredImage.width} / ${post.featuredImage.height}`,
                    }}
                  >
                    <Image
                      src={post.featuredImage.src}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 40vw"
                      loading="lazy"
                    />
                  </Link>
                )}
                <Link href={`/blog/${post.slug}`} className="text-link">
                  Read the piece <Arrow />
                </Link>
              </article>
            ))}
          </Reveal>
        ) : (
          <div className="stage-empty">
            <p className="label muted">
              Journal <span className="label-sep">/</span> Nothing published yet
            </p>
            <p className="stage-empty-line">
              The first pieces are being written. In the meantime, the
              communities themselves are the better read.
            </p>
            <Link href="/projects" className="text-link">
              View all projects <Arrow />
            </Link>
          </div>
        )}
      </section>

      <ContactCTA />
    </>
  );
}
