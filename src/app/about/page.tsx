import { ContactCTA, TextLink } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { RevealText, ScrollWords } from "@/components/motion/text";
import { ImageReveal, Parallax, Reveal } from "@/components/motion/primitives";
import { principles } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Our story — building with care since 2018",
  "Get to know SLN Infra. Since 2018, we have brought thoughtful planning, quality construction and a connection to nature to villa communities in Bengaluru and Hyderabad.",
  "/about",
  "/images/aura-6.webp",
);

export default function AboutPage() {
  return (
    <>
      <Masthead
        index="01"
        section="Our story, since 2018"
        title={
          <>
            Good homes begin
            <br />
            with <em>good intentions.</em>
          </>
        }
        lede={
          <>
            Thoughtful planning. Careful construction. An enduring connection to
            the people who call our communities home.
          </>
        }
      />

      {/* A gentler overscale than the inset plates use: every percent of scale
          here is another slice off the top and bottom of a full-width
          elevation, and the roofline is the first thing to go. */}
      <div className="about-banner">
        <Parallax speed={0.09} scale={1.08}>
          <ImageReveal
            src="/images/aura-6.webp"
            alt="SLN Nidhi Aura architectural visualisation, with contemporary villas and landscaped gardens"
            sizes="100vw"
            priority
            from="bottom"
          />
        </Parallax>
        <span className="media-caption">
          SLN Nidhi Aura / Architectural visualisation
        </span>
      </div>

      <section id="our-story" className="manifesto">
        <div className="sheet manifesto-sheet">
          <p className="sheet-index label">
            <span className="label-num">02</span>
            <span className="label-sep">/</span> From an idea to an address
          </p>
          <div className="manifesto-body">
            <RevealText as="h2" mode="lines" className="manifesto-title">
              Built on care.
              <br />
              <em>Made for life.</em>
            </RevealText>
            <ScrollWords className="manifesto-statement" accent={[4, 5]}>
              {
                "SLN Infra began in 2018 with a focus on premium villa communities. Today our work spans Bengaluru and Hyderabad, bringing together architecture, construction and a considered approach to community living."
              }
            </ScrollWords>
            <Reveal className="manifesto-link">
              <p className="lede">
                Our team of architects, engineers and construction professionals
                shares a simple ambition: homes that combine quality, thoughtful
                planning and lasting value. Led by founder Gowni Sridhar Goud, we
                believe trust is built through transparency, accountability and
                attention to the people we build for.
              </p>
              <TextLink href="/projects">Explore our communities</TextLink>
            </Reveal>
          </div>
          <div className="manifesto-plate">
            <Parallax speed={0.1} scale={1.16}>
              <ImageReveal
                src="/images/palazzo.webp"
                alt="Architectural visualisation of SLN Palazzo triplex villas with planted terraces and stone and timber finishes"
                sizes="(max-width: 767px) 86vw, 32vw"
                caption="Palazzo / Whitefield"
              />
            </Parallax>
          </div>
        </div>
      </section>

      <section className="values-section" aria-labelledby="values-title">
        <div>
          <div className="section-heading">
            <div>
              <p className="label muted">
                <span className="label-num">03</span>
                <span className="label-sep">/</span> What guides us
              </p>
              <RevealText as="h2" mode="lines" id="values-title">
                The things we build
                <br />
                <em>into every home.</em>
              </RevealText>
            </div>
          </div>
          <div className="values-grid">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.08}>
                <span className="value-number">{`0${i + 1}`}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="story-bottom">
        <p className="label muted">
          <span className="label-num">04</span>
          <span className="label-sep">/</span> Two cities, one philosophy
        </p>
        <RevealText as="h2" mode="lines">
          Rooted in Bengaluru.
          <br />
          Growing in Hyderabad.
          <br />
          <em>Always built around you.</em>
        </RevealText>
        <p>
          From the privacy of your own garden to the shared life of a
          neighbourhood, our communities are shaped by the belief that a home
          should offer more than an address.
        </p>
        <TextLink href="/contact">Let&rsquo;s start a conversation</TextLink>
      </section>

      <ContactCTA />
    </>
  );
}
