import Link from "next/link";
import Image from "next/image";
import { company, projects, type Project } from "@/lib/content";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M3 12h17m-7-7 7 7-7 7"} />
    </svg>
  );
}

export function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`text-link${light ? " text-link-light" : ""}`} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}

export function ProjectCard({
  project,
  number,
  className = "",
}: {
  project: Project;
  number?: string;
  className?: string;
}) {
  return (
    <article className={`project-card ${className}`}>
      <Link
        href={`/projects/${project.slug}`}
        className="project-image-link"
        aria-label={`Explore ${project.name}`}
      >
        <div className="project-image">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 60vw"
          />
          <span className="image-tag">{project.city}</span>
          <span className="project-open">
            <Arrow diagonal />
          </span>
        </div>
      </Link>
      <div className="project-caption">
        <div>
          <p className="eyebrow muted">
            {project.location} <span aria-hidden="true">/</span>{" "}
            {project.category}
          </p>
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.name}</Link>
          </h3>
        </div>
        {number && <span className="project-number">{number}</span>}
      </div>
    </article>
  );
}

export function ContactCTA() {
  return (
    <section className="contact-cta section-pad" aria-labelledby="cta-title">
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2 id="cta-title">
            Find a place
            <br />
            to <em>call your own.</em>
          </h2>
        </div>
        <div className="cta-aside">
          <p>
            A home is a personal choice.
            <br />
            Let’s start with a conversation.
          </p>
          <Link
            href="/contact"
            className="circle-link"
            aria-label="Start a conversation with SLN Infra"
          >
            <Arrow diagonal />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link
            href="/"
            className="brand footer-brand"
            aria-label="SLN Infra home"
          >
            <Image src="/images/logo.webp" width={44} height={45} alt="" />
            <span>
              SLN <span className="brand-small">INFRA</span>
            </span>
          </Link>
          <p>
            Thoughtfully built.
            <br />
            Naturally yours.
          </p>
          <a className="footer-phone" href={company.phoneHref}>
            {company.phone}
            <Arrow diagonal />
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <p className="eyebrow">COME FIND US</p>
            <p className="footer-address">{company.address}</p>
            <a
              className="subtle-link"
              href={company.map}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions <Arrow diagonal />
            </a>
          </div>
          <div>
            <p className="eyebrow">EXPLORE</p>
            <Link href="/projects">Our projects</Link>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div>
            <p className="eyebrow">COMMUNITIES</p>
            {projects.slice(0, 3).map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`}>
                {project.name}
              </Link>
            ))}
          </div>
          <div>
            <p className="eyebrow">CONNECT</p>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            {company.socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.name} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SLN Infra. All rights reserved.
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <a href="#top">Back to top ↑</a>
          </div>
          <span>
            Bengaluru <span aria-hidden="true">·</span> Hyderabad
          </span>
        </div>
      </div>
    </footer>
  );
}
