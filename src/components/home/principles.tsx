"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/ui";
import { principles } from "@/lib/content";
import { RevealText } from "@/components/motion/text";
import { ImageReveal, Parallax, Reveal } from "@/components/motion/primitives";
import { MQ, registerGsap } from "@/lib/motion";

/**
 * The one section painted in colour. Clay is taken straight from the stone
 * cladding in the Sundaram Palms visualisation that sits beside it, and the
 * plate is cut as an arch — a doorway, the smallest piece of architecture there
 * is. Three ideas, three rules, nothing else competing for attention.
 *
 * The colour arrives as a field wiping down the page rather than an edge you
 * cross, which is what stops the change of world reading as a seam between two
 * blocks.
 */
export function Principles() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const field = el.querySelector(".clay-field");
        // Vertical only. Insetting the sides as well meant that for the whole
        // length of the scrub the colour sat as a panel a few dozen pixels
        // narrower than the page, with paper showing down both edges and the
        // copy almost touching them — a mis-sized block rather than a world
        // arriving. Wiping straight down keeps it full-bleed at every frame.
        const open = gsap.fromTo(
          field,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 30%",
              scrub: 0.7,
            },
          },
        );
        return () => {
          open.scrollTrigger?.kill();
          open.kill();
        };
      });
      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="clay-section"
      id="principles"
      ref={root}
      aria-labelledby="clay-title"
    >
      <div className="clay-field" aria-hidden="true" />
      <div className="sheet clay-grid">
        <div className="clay-copy">
          <p className="sheet-index label">
            <span className="label-num">05</span>
            <span className="label-sep">/</span> What we build in
          </p>
          <RevealText as="h2" mode="lines" className="clay-title" id="clay-title">
            Good design goes
            <br />
            beyond a beautiful
            <br />
            <em>facade.</em>
          </RevealText>
          <p className="clay-lede">
            It decides how a Tuesday morning feels. These are the three things we
            will not trade away.
          </p>

          <ol className="clay-list">
            {principles.map((principle, i) => (
              <li key={principle.title}>
                <Reveal>
                  <span className="clay-num">{`0${i + 1}`}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Link href="/about" className="text-link">
            Our approach to building <Arrow />
          </Link>
        </div>

        <div className="clay-plate">
          <Parallax speed={0.09} scale={1.18}>
            <ImageReveal
              src="/images/sundaram-palms.webp"
              alt="Architectural visualisation of an SLN Sundaram Palms villa, its stone-clad upper floor framed by mature trees"
              sizes="(max-width: 1100px) 80vw, 36vw"
              className="plate-arch"
              from="bottom"
              caption="Sundaram Palms / Bongloor"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
