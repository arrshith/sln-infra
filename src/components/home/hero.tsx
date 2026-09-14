"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Arrow } from "@/components/ui";
import { Magnetic } from "@/components/motion/primitives";
import {
  DUR,
  EASE,
  MQ,
  STAGGER,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

/**
 * The hero is staged as an architect's elevation: the drawing sheet opens from a
 * horizontal band, the building is revealed inside it, and the annotation rail
 * draws itself down the left margin. Dusk was chosen because it is the one light
 * every SLN render shares — warm rooms against a cooling sky.
 *
 * On the way out the composition behaves like a gate: the two headline lines
 * separate vertically and the next section arrives through the gap, so the first
 * transition on the site is a move rather than a fade.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const q = gsap.utils.selector(el);
    const frame = q(".hero-frame");
    const media = q(".hero-media");
    const rail = q(".hero-rail-line");
    const lineOne = q(".hero-line-1");
    const lineTwo = q(".hero-line-2");

    // Skip the entrance only when playing it would actually be wrong — the
    // visitor has already scrolled past the hero and animating it in would
    // yank a composition they have left.
    //
    // This used to be a time threshold ("hydrated later than 2.5s"), which was
    // a mistake: on any real cold load — big bundle, cold cache, mid-range
    // machine — hydration runs past it and the hero's whole entrance was
    // silently dropped. It looked like the animation simply did not work,
    // while a warm dev machine sailed under the limit and looked fine.
    const alreadyScrolledPast = window.scrollY > 40;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion() || alreadyScrolledPast) {
        gsap.set([frame, media, rail], { clearProps: "all", opacity: 1 });
        el.dataset.ready = "true";
        return;
      }

      /* ---- entrance ------------------------------------------------------ */
      const intro = gsap.timeline({
        defaults: { ease: EASE.out },
        onStart: () => {
          el.dataset.ready = "true";
        },
      });

      intro
        .fromTo(
          frame,
          { clipPath: "inset(42% 0% 42% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: EASE.inOut,
          },
          0.1,
        )
        .fromTo(
          media,
          { scale: 1.24, yPercent: 3 },
          { scale: 1, yPercent: 0, duration: 2.1, ease: EASE.inOut },
          0.1,
        )
        .fromTo(
          rail,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.1, ease: EASE.inOut },
          0.75,
        )
        .fromTo(
          q(".hero-eyebrow"),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: DUR.base },
          0.7,
        )
        .fromTo(
          q(".hero-headline .hero-line span"),
          { yPercent: 112 },
          { yPercent: 0, duration: 1.35, stagger: STAGGER.line },
          0.8,
        )
        .fromTo(
          q(".hero-sub"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: DUR.slow },
          1.25,
        )
        .fromTo(
          q(".hero-actions"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: DUR.slow },
          1.4,
        )
        .fromTo(
          q(".hero-foot > *"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: DUR.slow, stagger: 0.1 },
          1.5,
        );

      /* ---- pointer depth -------------------------------------------------- */
      const mm = gsap.matchMedia();

      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOk}`, () => {
        const mediaX = gsap.quickTo(media, "xPercent", {
          duration: 1.2,
          ease: EASE.lerp,
        });
        const mediaY = gsap.quickTo(media, "yPercent", {
          duration: 1.2,
          ease: EASE.lerp,
        });
        const copyX = gsap.quickTo(q(".hero-copy"), "x", {
          duration: 1.4,
          ease: EASE.lerp,
        });

        const onMove = (event: PointerEvent) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          // Building and type drift against each other: parallax, not tilt.
          mediaX(x * -1.6);
          mediaY(y * -1.2);
          copyX(x * 14);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      /* ---- exit ----------------------------------------------------------- */
      mm.add(
        {
          full: `${MQ.desktop} and ${MQ.motionOk}`,
          compact: `(max-width: 1023px) and ${MQ.motionOk}`,
        },
        (context) => {
          const full = context.conditions?.full;

          // Pinned without spacing: the hero is held while the next sheet
          // travels up over it. That overlap is the transition — the page never
          // cuts between two sections, one passes in front of the other.
          const exit = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              pin: full,
              pinSpacing: false,
              anticipatePin: 1,
            },
          });

          // Every target here is a *container* of something the intro animates,
          // never the same element. A scrubbed tween renders its start values
          // the moment it is built, so sharing a target with the entrance
          // timeline would freeze the entrance at frame one.
          exit
            .to(media, { scale: 1.18, ease: "none" }, 0)
            .to(q(".hero-veil"), { opacity: 0.92, ease: "none" }, 0)
            // Supporting copy and annotation clear out first, quickly, so the
            // frame is left holding nothing but the headline.
            .to(
              [
                q(".hero-copy-top"),
                q(".hero-copy-bottom"),
                q(".hero-foot"),
                q(".hero-rail"),
              ],
              { opacity: 0, y: -24, ease: "none", duration: 0.3 },
              0,
            )
            // Then the two lines part like a gate, and the next section
            // arrives through the gap.
            .to(lineOne, { yPercent: -62, ease: "none" }, 0)
            .to(lineTwo, { yPercent: 62, ease: "none" }, 0)
            .to(
              q(".hero-headline"),
              { opacity: 0, ease: "none", duration: 0.42 },
              0.5,
            );

          return () => {
            exit.scrollTrigger?.kill();
            exit.kill();
          };
        },
      );

      return () => mm.revert();
    }, el);

    // Pinning changes document height; let ScrollTrigger settle after images.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  const mobileHero = getImageProps({
    src: "/images/nidhi-palms-mobile.webp",
    alt: "",
    width: 822,
    height: 1644,
    sizes: "100vw",
  }).props;

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero-frame">
        <div className="hero-media">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={mobileHero.srcSet}
              sizes="100vw"
            />
            {/* No `preload` here: a preload link cannot carry the <source>
                media condition, so it fetches the landscape crop on phones that
                will only ever paint the portrait one — and it competes with the
                real LCP image for bandwidth. `loading`/`fetchPriority` do the
                job correctly for both. */}
            <Image
              src="/images/nidhi-palms.webp"
              alt="Architectural visualisation of SLN Nidhi Palms at dusk — a contemporary villa with warm lit interiors, framed by jacaranda and bamboo"
              fill
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="hero-shade" />
        <div className="hero-veil" />
      </div>

      {/* Drawing-sheet annotation: the vertical rail that runs the left margin
          of every full-bleed frame on the site. */}
      <div className="hero-rail" aria-hidden="true">
        <span className="hero-rail-line" />
        <span className="rail-text">SLN INFRA — VILLA COMMUNITIES</span>
      </div>

      <div className="hero-copy">
        <div className="hero-copy-top">
          <p className="hero-eyebrow label">
            <span className="label-tick" />
            Est. 2018 <span className="label-sep">/</span> Bengaluru &amp;
            Hyderabad
          </p>
        </div>
        <h1 id="hero-title" className="hero-headline">
          <span className="hero-line hero-line-1">
            <span>Space to live.</span>
          </span>
          <span className="hero-line hero-line-2">
            <span>
              Room to <em>belong.</em>
            </span>
          </span>
        </h1>
        <div className="hero-copy-bottom">
          <p className="hero-sub">
            Considered homes. Connected communities.
            <br />A more meaningful way to live.
          </p>
          <div className="hero-actions">
            <Magnetic>
              <Link className="button button-amber" href="/projects">
                <span>Explore our projects</span>
                <Arrow diagonal />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-foot">
        <a href="#manifesto" className="hero-scroll">
          <span className="scroll-rule" />
          <span>Discover the SLN way</span>
        </a>
        <Link
          href="/projects/nidhi-palms"
          className="hero-focus"
          data-cursor="View"
        >
          <span className="hero-focus-meta label">
            In focus <span className="label-sep">/</span> Bengaluru
          </span>
          <span className="hero-focus-name">SLN Nidhi Palms</span>
          <span className="hero-focus-arrow">
            <Arrow diagonal />
          </span>
        </Link>
      </div>
    </section>
  );
}
