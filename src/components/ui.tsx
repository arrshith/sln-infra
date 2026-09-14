import Link from "next/link";
import Image from "next/image";
import { company, projects, type Project } from "@/lib/content";
import { Magnetic, Parallax } from "@/components/motion/primitives";
import { RevealText } from "@/components/motion/text";
import { FooterMotion } from "@/components/footer-motion";

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

/**
 * The frame a card's picture is given. It comes from the picture, not from the
 * grid: a fixed 4/3 window turned Vogue's portrait dusk elevation into a band of
 * wall with the roofline and the ground cropped off it. The ratio is held inside
 * a narrow band so a row of cards still reads as a set — wide streetscapes give
 * up a little at the sides, portrait elevations a little at top and bottom, and
 * nothing is guillotined to fit a shape it was never drawn in.
 */
const PORTRAIT_LIMIT = 4 / 5;
const LANDSCAPE_LIMIT = 3 / 2;
const cardRatio = (width: number, height: number) => {
  const ratio = width / height;
  if (!Number.isFinite(ratio) || ratio <= 0) return "4 / 3";
  return String(Math.min(LANDSCAPE_LIMIT, Math.max(PORTRAIT_LIMIT, ratio)));
};

/**
 * The card used wherever projects appear in a grid. It is drawn, not boxed: a
 * hairline rule above the caption, the number set as a sheet reference, and the
 * image sized from its own proportions so a row of them reads as a set of
 * elevations rather than a set of identical windows.
 */
export function ProjectCard({
  project,
  number,
  className = "",
}: {
  project: Project;
  number?: string;
  className?: string;
}) {
  const soldOut = project.status === "Sold out";
  return (
    <article className={`project-card ${className}`.trim()}>
      <Link
        href={`/projects/${project.slug}`}
        className="project-image-link"
        aria-label={`Explore ${project.name}`}
        data-cursor="Explore"
      >
        <div
          className="project-image"
          style={{
            aspectRatio: cardRatio(project.imageWidth, project.imageHeight),
          }}
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 40vw"
            loading="lazy"
          />
          <span className="image-tag label">{project.city}</span>
          {soldOut && <span className="image-status label">Sold out</span>}
        </div>
      </Link>
      <div className="project-caption">
        <div>
          <h3>
            <Link href={`/projects/${project.slug}`}>{project.name}</Link>
          </h3>
          <p className="label muted">
            {project.location} <span className="label-sep">/</span>{" "}
            {project.category}
          </p>
        </div>
        {number && <span className="project-number label">{number}</span>}
      </div>
    </article>
  );
}

/**
 * The close of the experience. Full-bleed dusk, the largest type on the page,
 * and a single thing to do.
 *
 * Nidhi Palms is used rather than Vogue. Both are dusk views with lit windows,
 * which is the feeling the page should end on — but Vogue is a 2:3 portrait
 * elevation, and this band is close to 2:1. Cropped into it, the villa stopped
 * being a villa: no roofline, no ground, just a storey of stone behind the
 * headline. Palms is shot landscape, so the same band holds the whole house,
 * the jacaranda and the wet street it stands on.
 */
export function ContactCTA() {
  return (
    <section className="cta" id="enquire" aria-labelledby="cta-title">
      <Parallax className="cta-media" speed={0.12} scale={1.18}>
        <Image
          src="/images/nidhi-palms.webp"
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
        />
      </Parallax>
      <div className="cta-grade" />
      <div className="sheet cta-inner">
        <p className="label label-light">
          <span className="label-tick" />
          Your next chapter
        </p>
        <RevealText as="h2" mode="lines" className="cta-title" id="cta-title">
          Let&rsquo;s build
          <br />
          <em>what comes next.</em>
        </RevealText>
        <div className="cta-foot">
          <p>
            A home is a personal choice.
            <br />
            Start with a conversation.
          </p>
          <Magnetic>
            <Link href="/contact?intent=visit" className="button button-amber">
              <span>Schedule a visit</span>
              <Arrow diagonal />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <FooterMotion>
        <div className="sheet">
          <div className="footer-mark" aria-hidden="true">
            <span className="footer-wordmark">SLN</span>
            <span className="footer-strap">
              Thoughtfully built. Naturally yours.
            </span>
          </div>
          <div className="rule footer-rule" aria-hidden="true" />

          <div className="footer-grid">
            <div className="footer-col footer-col-wide">
              <p className="label muted">Come find us</p>
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
            <div className="footer-col">
              <p className="label muted">Explore</p>
              <Link href="/projects">Our projects</Link>
              <Link href="/about">Our story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/channel-partners">Channel partners</Link>
              <Link href="/contact">Get in touch</Link>
            </div>
            <div className="footer-col">
              <p className="label muted">Communities</p>
              {/* All of them. The same page counts six communities in three
                  other places; listing four here read as a truncated list
                  rather than an edited one. */}
              {projects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`}>
                  {project.name}
                </Link>
              ))}
            </div>
            <div className="footer-col">
              <p className="label muted">Connect</p>
              <a href={company.phoneHref}>{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              {company.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rule footer-rule" aria-hidden="true" />
          <div className="footer-bottom">
            <span className="label muted">
              © {new Date().getFullYear()} SLN Infra
            </span>
            <div className="footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/disclaimer">Disclaimer</Link>
              <a href="#top">Back to top ↑</a>
            </div>
            <span className="label muted">
              Bengaluru <span className="label-sep">·</span> Hyderabad
            </span>
          </div>
        </div>
      </FooterMotion>
    </footer>
  );
}
