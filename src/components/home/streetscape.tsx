"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/content";
import { MQ, registerGsap } from "@/lib/motion";

/**
 * An elevation sheet: SLN's communities drawn side by side and seen head on,
 * travelling past as you scroll.
 *
 * Every plate is sized from its own source dimensions, so each facade is shown
 * whole — roofline to plinth — rather than cropped to fit a box it was never
 * shot for. That is also what gives the row its rhythm: the landscape
 * elevations run wide, Vogue's portrait dusk view cuts in narrow between them.
 * The pan distance is the sum of the plates, not a stretched single image.
 *
 * Desktop pins and drives the pan from vertical scroll. Below that breakpoint
 * it is a real horizontal scroller: pinning long sequences on a phone is
 * miserable.
 */
const plates = projects.filter((project) => project.elevation);

export function Streetscape() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
        const track = el.querySelector<HTMLElement>(".street-track");
        if (!track) return;
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth);

        // Plate widths come from the plate height, which comes from the
        // viewport height — so on a wide, short screen the row can already fit
        // and there is nothing to pan. Pinning a whole section to animate a
        // handful of pixels reads as a broken scroll, so we only pin when the
        // travel is worth it. Below that the strip stays a native horizontal
        // scroller, which still scrolls.
        if (distance() < 240) return;
        el.dataset.pan = "pinned";

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.max(1, distance())}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // The progress rule under the caption fills as the sheet passes.
        const progress = gsap.to(el.querySelector(".street-progress-bar"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.max(1, distance())}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          delete el.dataset.pan;
          tween.scrollTrigger?.kill();
          tween.kill();
          progress.scrollTrigger?.kill();
          progress.kill();
        };
      });

      return () => mm.revert();
    }, el);

    // Plate widths derive from `svh`, so the pan distance changes when a mobile
    // browser's chrome collapses. Recalculate once the page has settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="street"
      id="elevation"
      ref={root}
      aria-labelledby="street-title"
    >
      <div className="street-head sheet">
        <p className="sheet-index label">
          <span className="label-num">02</span>
          <span className="label-sep">/</span> Elevation
        </p>
        <h2 id="street-title" className="street-title">
          Seen from the <em>street.</em>
        </h2>
      </div>

      {/* Below the pin breakpoint this is a real scroll container, so it has to
          be reachable and operable from the keyboard like any other. */}
      <div
        className="street-viewport"
        tabIndex={0}
        role="region"
        aria-label="SLN elevations, scroll horizontally"
      >
        <ol className="street-track">
          {plates.map((project, i) => {
            const plate = project.elevation!;
            return (
              <li
                key={project.slug}
                className="street-plate"
                // The one piece of geometry that has to come from the data: the
                // plate is as wide as this particular facade needs to be.
                style={{ aspectRatio: `${plate.width} / ${plate.height}` }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="street-plate-link"
                  data-cursor="Explore"
                >
                  <Image
                    src={plate.src}
                    alt={plate.alt}
                    fill
                    sizes="(max-width: 767px) 70vw, (max-width: 1023px) 55vw, 45vw"
                    loading="lazy"
                  />
                </Link>
                <div className="street-note">
                  <span className="street-note-rule" />
                  <span className="label">
                    <span className="label-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="label-sep">/</span> {project.name}
                  </span>
                  {/* Place only. The configuration is carried by the project
                      index below and by the project's own page; repeating it
                      here would wrap unpredictably on the narrow portrait
                      plate and say nothing new. */}
                  <p>
                    {project.location}, {project.city}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="street-foot sheet">
        <span className="label muted">
          Architectural visualisations <span className="label-sep">/</span>{" "}
          Bengaluru &amp; Hyderabad
        </span>
        <span className="street-progress" aria-hidden="true">
          <span className="street-progress-bar" />
        </span>
      </div>
    </section>
  );
}
