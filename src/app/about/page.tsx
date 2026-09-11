import Image from "next/image";
import { ContactCTA, TextLink } from "@/components/ui";
import { Reveal } from "@/components/reveal";
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
      <section className="page-intro container">
        <p className="eyebrow">OUR STORY / SINCE 2018</p>
        <div className="page-intro-grid">
          <h1>
            Good homes begin
            <br />
            with <em>good intentions.</em>
          </h1>
          <p>
            Thoughtful planning. Careful construction.
            <br />
            An enduring connection to the people
            <br />
            who call our communities home.
          </p>
        </div>
      </section>
      <div className="about-banner">
        <Image
          src="/images/aura-6.webp"
          alt="SLN Nidhi Aura architectural visualisation, with contemporary villas and landscaped gardens"
          fill
          sizes="100vw"
          preload
        />
        <span className="media-caption">
          SLN NIDHI AURA / ARCHITECTURAL VISUALISATION
        </span>
      </div>
      <section id="our-story" className="container section-pad">
        <Reveal>
          <div className="detail-intro">
            <p className="eyebrow">FROM AN IDEA TO AN ADDRESS</p>
            <div>
              <h2>
                Built on care.
                <br />
                <em>Made for life.</em>
              </h2>
              <p>
                SLN Infra’s story began in 2018 with a focus on premium villa
                communities. Today, our work spans Bengaluru and Hyderabad,
                bringing together architecture, construction and a considered
                approach to community living.
              </p>
              <p>
                Our team of architects, engineers and construction professionals
                shares a simple ambition: to create homes that combine quality,
                thoughtful planning and lasting value.
              </p>
              <p>
                Led by founder Gowni Sridhar Goud, we believe that trust is
                built through transparency, accountability and attention to the
                people we build for.
              </p>
              <TextLink href="/projects">Explore our communities</TextLink>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="values-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT GUIDES US</p>
              <h2>
                The things we
                <br />
                <em>build into every home.</em>
              </h2>
            </div>
          </div>
          <div className="values-grid">
            {principles.map((p, i) => (
              <Reveal key={p.title}>
                <span className="value-number">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="container section-pad story-bottom">
        <p className="eyebrow">TWO CITIES. A SHARED PHILOSOPHY.</p>
        <h2>
          Rooted in Bengaluru.
          <br />
          Growing in Hyderabad.
          <br />
          <em>Always built around you.</em>
        </h2>
        <p>
          From the privacy of your own garden to the shared life of a
          neighbourhood, our communities are shaped by the belief that a home
          should offer more than an address.
        </p>
        <TextLink href="/contact">Let’s start a conversation</TextLink>
      </section>
      <ContactCTA />
    </>
  );
}
