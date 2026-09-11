import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, ContactCTA, ProjectCard } from "@/components/ui";
import { Gallery } from "@/components/gallery";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return p
    ? pageMetadata(
        `${p.name} — ${p.location}`,
        p.description,
        `/projects/${slug}`,
        p.image,
      )
    : {};
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = projects
    .filter((other) => other.slug !== p.slug && other.city === p.city)
    .slice(0, 2);
  if (related.length < 2)
    related.push(
      ...projects
        .filter((other) => other.slug !== p.slug && !related.includes(other))
        .slice(0, 2 - related.length),
    );
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.name,
        item: `${siteUrl}/projects/${p.slug}`,
      },
    ],
  };
  return (
    <>
      <section className={`project-hero project-hero-${p.slug}`}>
        <Image
          src={p.image}
          alt={p.imageAlt}
          fill
          sizes="(max-width: 767px) 130svh, 100vw"
          preload
        />
        <div className="project-hero-shade" />
        <div className="container project-hero-content">
          <Link href="/projects" className="project-back">
            ← All communities
          </Link>
          <p className="eyebrow">
            {p.location} / {p.city}
          </p>
          <h1>{p.name}</h1>
          <div className="project-hero-bottom">
            <p>
              {p.category}
              <span aria-hidden="true"> · </span>
              {p.status}
            </p>
            <Link
              className="button button-ivory"
              href={
                p.status === "Sold out"
                  ? "/projects"
                  : `/contact?project=${p.slug}&intent=visit`
              }
            >
              {p.status === "Sold out"
                ? "Discover other homes"
                : "Arrange a private visit"}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <div className="project-subnav">
        <div className="container">
          <nav aria-label="Project sections">
            <a href="#overview">Overview</a>
            {p.gallery.length > 0 && <a href="#gallery">Gallery</a>}
            {p.amenities.length > 0 && <a href="#details">The details</a>}
            <a href="#location">Location</a>
          </nav>
          <span className="eyebrow muted">ARCHITECTURAL VISUALISATION</span>
        </div>
      </div>
      <section id="overview" className="container section-pad">
        <Reveal>
          <div className="detail-intro">
            <p className="eyebrow">A PLACE TO BELONG</p>
            <div>
              <h2>{p.headline}</h2>
              <p>{p.description}</p>
            </div>
          </div>
          <dl className="project-facts">
            {p.facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow muted">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          {p.rera && (
            <p className="rera-note">
              Project RERA registration:{" "}
              <a
                href="https://rera.karnataka.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.rera} ↗
              </a>
            </p>
          )}
        </Reveal>
      </section>
      {p.gallery.length > 0 && (
        <section id="gallery" className="gallery-section section-pad">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">TAKE A CLOSER LOOK</p>
                <h2>
                  A sense of <em>place.</em>
                </h2>
              </div>
              <span className="eyebrow muted">
                ARCHITECTURAL VISUALISATIONS
              </span>
            </div>
            <Gallery images={p.gallery} title={p.name} />
          </div>
        </section>
      )}
      {p.amenities.length > 0 && (
        <section id="details" className="container section-pad">
          <div className="detail-intro">
            <div>
              <p className="eyebrow">CONSIDERED FOR EVERYDAY LIFE</p>
              <h2>
                Life, with
                <br />
                <em>room for more.</em>
              </h2>
            </div>
            <div className="amenities-list">
              {p.amenities.map((a, i) => (
                <div key={a}>
                  <span className="eyebrow muted">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {p.masterplan && (
        <section className="masterplan-section container">
          <div>
            <p className="eyebrow">THE BIGGER PICTURE</p>
            <h2>
              Thoughtfully
              <br />
              <em>planned.</em>
            </h2>
            <p>Explore the layout of the community.</p>
            <a
              className="text-link"
              href={p.masterplan}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full master plan <Arrow diagonal />
            </a>
          </div>
          <a
            href={p.masterplan}
            target="_blank"
            rel="noopener noreferrer"
            className="masterplan-image"
            aria-label={`View full ${p.name} master plan`}
          >
            <Image
              src={p.masterplan}
              alt={`${p.name} master plan showing villa plots, internal roads and shared spaces`}
              width={1005}
              height={705}
              sizes="(max-width: 767px) 100vw, 65vw"
            />
          </a>
        </section>
      )}
      <section id="location" className="location-section">
        <div className="container location-grid">
          <div>
            <p className="eyebrow">YOUR CORNER OF THE CITY</p>
            <h2>
              {p.location}
              <br />
              <em>{p.city}.</em>
            </h2>
          </div>
          <div>
            <p>
              Come and get a feel for the neighbourhood.
              <br />
              Our team can help you plan your visit.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.location} ${p.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Explore the location <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>
      <section className="container section-pad">
        <div className="section-heading">
          <h2>
            More places.
            <br />
            <em>More possibilities.</em>
          </h2>
          <Link href="/projects" className="text-link">
            All communities <Arrow />
          </Link>
        </div>
        <div className="related-grid">
          {related.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        <p className="image-disclaimer">
          Images are architectural visualisations supplied by the developer.
          Specifications and availability should be confirmed with the SLN Infra
          team.
        </p>
      </section>
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
