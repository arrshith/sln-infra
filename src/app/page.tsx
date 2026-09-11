import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Arrow, ContactCTA, ProjectCard, TextLink } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { principles, projects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Nature-inspired villas in Bengaluru & Hyderabad",
  "Discover thoughtfully designed villa communities by SLN Infra. Explore homes in Bengaluru and Hyderabad, where architecture and nature come together.",
  "/",
);

export default function Home() {
  const mobileHero = getImageProps({
    src: "/images/nidhi-palms-mobile.webp",
    alt: "",
    width: 822,
    height: 1644,
    sizes: "100vw",
  }).props;
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-media">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={mobileHero.srcSet}
              sizes="100vw"
            />
            <Image
              src="/images/nidhi-palms.webp"
              alt="Architectural visualisation of SLN Nidhi Palms, a contemporary villa framed by greenery"
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="hero-image"
            />
          </picture>
        </div>
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow hero-eyebrow">
            <span className="tiny-line" />
            THOUGHTFULLY BUILT. NATURALLY YOURS.
          </p>
          <h1 id="hero-title">
            Space to live.
            <br />
            Room to <em>belong.</em>
          </h1>
          <p className="hero-description">
            Considered homes. Connected communities.
            <br />A more meaningful way to live.
          </p>
          <Link className="button button-ivory" href="/projects">
            Explore our projects <Arrow diagonal />
          </Link>
        </div>
        <div className="container hero-bottom">
          <a href="#our-philosophy" className="hero-scroll">
            <span className="scroll-line" />
            DISCOVER THE SLN WAY <span aria-hidden="true">↓</span>
          </a>
          <Link href="/projects/nidhi-palms" className="hero-project">
            <span>
              <span className="eyebrow">IN FOCUS / BENGALURU</span>
              <span className="hero-project-name">SLN Nidhi Palms</span>
            </span>
            <span className="hero-project-arrow">
              <Arrow diagonal />
            </span>
          </Link>
        </div>
      </section>

      <section id="our-philosophy" className="intro-section section-pad">
        <div className="container">
          <Reveal>
            <div className="section-kicker">
              <span className="eyebrow">01 / THE SLN WAY</span>
              <span className="eyebrow muted">
                ROOTED IN THOUGHT. BUILT WITH CARE.
              </span>
            </div>
            <div className="intro-grid">
              <h2>
                A home is more
                <br />
                than where you live.
                <br />
                <em>It’s how you feel.</em>
              </h2>
              <div className="intro-copy">
                <p>
                  Morning light through an open window. A garden that grows with
                  you. Neighbours who become friends.
                </p>
                <p>
                  At SLN Infra, we bring thoughtful architecture and natural
                  surroundings together to create villa communities in Bengaluru
                  and Hyderabad. Places designed for life, in all its detail.
                </p>
                <TextLink href="/about">Get to know SLN Infra</TextLink>
              </div>
            </div>
            <div className="stats-row">
              <div>
                <span className="stat-value">2018</span>
                <span className="stat-label">The beginning of our story</span>
              </div>
              <div>
                <span className="stat-value">02</span>
                <span className="stat-label">
                  Cities. One considered approach.
                </span>
              </div>
              <div>
                <span className="stat-value">06</span>
                <span className="stat-label">Distinct villa communities</span>
              </div>
              <p className="stats-note">
                Different addresses.
                <br />
                The same attention to what matters.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="featured-section section-pad"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <Reveal>
            <div className="section-kicker">
              <span className="eyebrow">02 / SELECTED COMMUNITIES</span>
              <span className="eyebrow muted">BENGALURU & HYDERABAD</span>
            </div>
            <div className="section-heading">
              <h2 id="featured-title">
                Find your
                <br />
                <em>kind of home.</em>
              </h2>
              <div>
                <p>
                  Each address, a different expression
                  <br />
                  of a life well lived.
                </p>
                <TextLink href="/projects">View all projects</TextLink>
              </div>
            </div>
          </Reveal>
          <div className="featured-grid">
            <Reveal>
              <ProjectCard project={projects[0]} number="01" />
            </Reveal>
            <Reveal className="offset-project">
              <ProjectCard project={projects[1]} number="02" />
            </Reveal>
          </div>
          <Reveal>
            <article className="feature-wide">
              <Link
                href="/projects/sundaram-palms"
                className="wide-project-image"
              >
                <Image
                  src={projects[2].image}
                  alt={projects[2].imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, 65vw"
                />
                <span className="image-tag">HYDERABAD</span>
              </Link>
              <div className="wide-project-copy">
                <span className="eyebrow muted">03 / BONGLOOR, HYDERABAD</span>
                <h3>
                  A closer-knit
                  <br />
                  <em>kind of living.</em>
                </h3>
                <p>
                  Forty villas. One thoughtful community.
                  <br />
                  Discover SLN Sundaram Palms.
                </p>
                <TextLink href="/projects/sundaram-palms">
                  Explore Sundaram Palms
                </TextLink>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="living-section" aria-labelledby="living-title">
        <div className="living-image">
          <Image
            src="/images/aura-6.webp"
            alt="SLN Nidhi Aura architectural visualisation showing homes opening onto a green streetscape"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <span className="media-caption">
            SLN NIDHI AURA / ARCHITECTURAL VISUALISATION
          </span>
        </div>
        <div className="living-copy">
          <p className="eyebrow">03 / CONSIDERED IN EVERY DETAIL</p>
          <h2 id="living-title">
            Built around
            <br />
            what <em>matters.</em>
          </h2>
          <p className="living-intro">
            Good design goes beyond a beautiful facade.
            <br />
            It makes everyday life feel better.
          </p>
          <div className="principles-list">
            {principles.map((p, i) => (
              <div key={p.title}>
                <span className="eyebrow">0{i + 1}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
          <TextLink href="/about" light>
            Our approach to building
          </TextLink>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
