import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, ContactCTA, ProjectCard } from "@/components/ui";
import { Gallery } from "@/components/project/gallery";
import { Amenities } from "@/components/project/amenities";
import { Connectivity } from "@/components/project/connectivity";
import { FloorPlans } from "@/components/project/floor-plans";
import { ReraPanel } from "@/components/project/rera";
import { EmiCalculator } from "@/components/project/emi-calculator";
import { ImmersiveExperience } from "@/components/project/immersive";
import { ProjectView } from "@/components/project/project-view";
import { RevealText } from "@/components/motion/text";
import { Magnetic, Parallax, Reveal } from "@/components/motion/primitives";
import { projects } from "@/lib/content";
import { related as relatedProjects } from "@/lib/projects";
import { projectMetadata, siteUrl } from "@/lib/metadata";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? projectMetadata(project) : {};
}

/**
 * A project page assembles itself from whatever SLN has published.
 *
 * Every section is conditional on its own data, and the numbering is computed
 * rather than written in, so a community with three sections is still numbered
 * 01, 02, 03 — never 01, 04, 07. That matters because SLN will fill these in
 * over time: the page has to look deliberate at every stage of being filled,
 * not like a template with holes in it.
 *
 * Nothing here invents content. A missing gallery means no gallery section; a
 * missing price means the calculator runs on the visitor's own figures and says
 * so plainly.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = relatedProjects(project);
  const soldOut = project.status === "Sold out";

  const galleries = project.galleries.filter((g) => g.items.length > 0);
  const plans = (project.configurations ?? []).filter((c) => c.floorPlan);

  // Reading order. Each entry survives only if it has something to show.
  const sections = [
    { id: "overview", label: "Overview", show: true },
    {
      id: "explore",
      label: "Explore",
      show: Boolean(project.immersive?.length),
    },
    { id: "gallery", label: "Gallery", show: galleries.length > 0 },
    { id: "amenities", label: "Amenities", show: project.amenities.length > 0 },
    { id: "plans", label: "Floor plans", show: plans.length > 0 },
    {
      id: "masterplan",
      label: "Master plan",
      show: Boolean(project.masterPlan),
    },
    { id: "emi", label: "EMI", show: true },
    {
      id: "connectivity",
      label: "Connectivity",
      show: Boolean(project.connectivity?.length),
    },
    { id: "rera", label: "RERA", show: Boolean(project.rera) },
    { id: "location", label: "Location", show: true },
  ].filter((section) => section.show);

  const number = (id: string) =>
    String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

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
        name: project.name,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <ProjectView slug={project.slug} stage={project.stage} />

      <section className={`project-hero project-hero-${project.slug}`}>
        <Parallax speed={0.1} scale={1.14}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </Parallax>
        <div className="project-hero-shade" />
        <div className="project-hero-content">
          <Link href="/projects" className="project-back">
            <span aria-hidden="true">←</span> All communities
          </Link>
          <p className="label label-light">
            {project.location} <span className="label-sep">/</span>{" "}
            {project.city}
          </p>
          <RevealText as="h1" mode="lines" play="load" delay={0.15}>
            {project.name}
          </RevealText>
          <div className="project-hero-bottom">
            <p>
              {project.category}
              <span aria-hidden="true"> · </span>
              {project.status}
            </p>
            <Magnetic>
              <Link
                className="button button-amber"
                href={
                  soldOut
                    ? "/projects"
                    : `/contact?project=${project.slug}&intent=visit`
                }
              >
                <span>
                  {soldOut ? "Discover other homes" : "Arrange a private visit"}
                </span>
                <Arrow diagonal />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <div className="project-subnav">
        <div>
          <nav aria-label="Project sections">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
          <span className="label muted">Architectural visualisation</span>
        </div>
      </div>

      <section id="overview" className="sheet section-pad">
        <div className="detail-intro">
          <p className="sheet-index label">
            <span className="label-num">{number("overview")}</span>
            <span className="label-sep">/</span> A place to belong
          </p>
          <div>
            <RevealText as="h2" mode="lines">
              {project.headline}
            </RevealText>
            <p>{project.description}</p>
          </div>
        </div>

        <Reveal>
          <dl className="project-facts">
            {project.facts.map((fact) => (
              <div key={fact.label} data-stagger>
                <dt className="label muted">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {project.immersive && project.immersive.length > 0 && (
        <section id="explore" className="explore-section section-pad">
          <div className="sheet">
            <div className="section-heading">
              <div>
                <p className="label muted">
                  <span className="label-num">{number("explore")}</span>
                  <span className="label-sep">/</span> Look closer
                </p>
                <RevealText as="h2" mode="lines">
                  Move around <em>the drawing.</em>
                </RevealText>
              </div>
              <p className="explore-note">
                An architectural visualisation explored at close range — not a
                surveyed model. A 360° walkthrough replaces this once SLN
                supplies the capture.
              </p>
            </div>
            <ImmersiveExperience
              assets={project.immersive}
              projectSlug={project.slug}
            />
          </div>
        </section>
      )}

      {galleries.length > 0 && (
        <section id="gallery" className="gallery-section section-pad">
          <div>
            <div className="section-heading">
              <div>
                <p className="label muted">
                  <span className="label-num">{number("gallery")}</span>
                  <span className="label-sep">/</span> Take a closer look
                </p>
                <RevealText as="h2" mode="lines">
                  A sense of <em>place.</em>
                </RevealText>
              </div>
              <span className="label muted">Architectural visualisations</span>
            </div>
            <Gallery categories={galleries} title={project.name} />
          </div>
        </section>
      )}

      {project.amenities.length > 0 && (
        <section id="amenities" className="sheet section-pad">
          <div className="section-heading">
            <div>
              <p className="label muted">
                <span className="label-num">{number("amenities")}</span>
                <span className="label-sep">/</span> Considered for everyday
                life
              </p>
              <RevealText as="h2" mode="lines">
                Life, with
                <br />
                <em>room for more.</em>
              </RevealText>
            </div>
          </div>
          <Amenities items={project.amenities} />
        </section>
      )}

      {plans.length > 0 && (
        <section id="plans" className="plans-section section-pad">
          <div className="sheet">
            <div className="section-heading">
              <div>
                <p className="label muted">
                  <span className="label-num">{number("plans")}</span>
                  <span className="label-sep">/</span> The plan
                </p>
                <RevealText as="h2" mode="lines">
                  Drawn to <em>live in.</em>
                </RevealText>
              </div>
            </div>
            <FloorPlans
              configurations={project.configurations ?? []}
              projectName={project.name}
              projectSlug={project.slug}
            />
          </div>
        </section>
      )}

      {project.masterPlan && (
        <section id="masterplan" className="masterplan-section">
          <div>
            <p className="label muted">
              <span className="label-num">{number("masterplan")}</span>
              <span className="label-sep">/</span> The bigger picture
            </p>
            <RevealText as="h2" mode="lines">
              Thoughtfully
              <br />
              <em>planned.</em>
            </RevealText>
            <p>Explore the layout of the community.</p>
            <a
              className="text-link"
              href={project.masterPlan.src}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full master plan <Arrow diagonal />
            </a>
          </div>
          <a
            href={project.masterPlan.src}
            target="_blank"
            rel="noopener noreferrer"
            className="masterplan-image"
            aria-label={`View full ${project.name} master plan`}
            data-cursor="Open"
          >
            <Image
              src={project.masterPlan.src}
              alt={project.masterPlan.alt}
              width={project.masterPlan.width}
              height={project.masterPlan.height}
              sizes="(max-width: 1100px) 100vw, 62vw"
              loading="lazy"
            />
          </a>
        </section>
      )}

      <section id="emi" className="emi-section section-pad">
        <div className="sheet">
          <div className="section-heading">
            <div>
              <p className="label muted">
                <span className="label-num">{number("emi")}</span>
                <span className="label-sep">/</span> What it costs monthly
              </p>
              <RevealText as="h2" mode="lines">
                Work out the <em>monthly.</em>
              </RevealText>
            </div>
          </div>
          <EmiCalculator
            priceFrom={project.priceFrom}
            projectSlug={project.slug}
          />
        </div>
      </section>

      {project.connectivity && project.connectivity.length > 0 && (
        <section id="connectivity" className="sheet section-pad">
          <div className="section-heading">
            <div>
              <p className="label muted">
                <span className="label-num">{number("connectivity")}</span>
                <span className="label-sep">/</span> What is near
              </p>
              <RevealText as="h2" mode="lines">
                The neighbourhood, <em>measured.</em>
              </RevealText>
            </div>
          </div>
          <Connectivity items={project.connectivity} />
        </section>
      )}

      {project.rera && (
        <section id="rera" className="rera-section section-pad">
          <div className="sheet">
            <div className="section-heading">
              <div>
                <p className="label muted">
                  <span className="label-num">{number("rera")}</span>
                  <span className="label-sep">/</span> On the record
                </p>
                <RevealText as="h2" mode="lines">
                  Registered and <em>verifiable.</em>
                </RevealText>
              </div>
            </div>
            <ReraPanel rera={project.rera} projectSlug={project.slug} />
          </div>
        </section>
      )}

      <section id="location" className="location-section">
        <div className="location-grid">
          <div>
            <p className="label label-light">
              <span className="label-num">{number("location")}</span>
              <span className="label-sep">/</span> Your corner of the city
            </p>
            <RevealText as="h2" mode="lines">
              {project.location}
              <br />
              <em>{project.city}.</em>
            </RevealText>
          </div>
          <div>
            <p>
              Come and get a feel for the neighbourhood. Our team can help you
              plan your visit.
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${project.name} ${project.location} ${project.city}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link text-link-light"
            >
              Explore the location <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>

      <section className="sheet section-pad">
        <div className="section-heading">
          <RevealText as="h2" mode="lines">
            More places.
            <br />
            <em>More possibilities.</em>
          </RevealText>
          <Link href="/projects" className="text-link">
            All communities <Arrow />
          </Link>
        </div>
        <div className="related-grid">
          {related.map((other) => (
            <ProjectCard key={other.slug} project={other} />
          ))}
        </div>
        <p className="image-disclaimer">
          Images are architectural visualisations supplied by the developer.
          Specifications, pricing and availability should be confirmed with the
          SLN Infra team.
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
