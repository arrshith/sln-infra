"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import { projects } from "@/lib/content";
import { EASE, MQ, registerGsap } from "@/lib/motion";

/**
 * The portfolio as an exhibition index rather than a grid of cards. The list is
 * typographic — number, name, place, scale — and the architecture appears only
 * when you reach for it, floating with the pointer and wiping open from the
 * bottom edge. Hovering one line recedes the others, so the page always has a
 * single subject.
 *
 * Phones get the same information as a stacked set of image-led rows: the
 * pointer choreography simply has nothing to hang on there.
 */
export function ProjectIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Preload the hover plates once the section is close and we know there is a
  // real pointer — never on phones, where the plates are not used.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !armed) return;
    const { gsap } = registerGsap();

    const mm = gsap.matchMedia();
    mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOk}`, () => {
      const plate = el.querySelector<HTMLElement>(".index-plate");
      if (!plate) return;
      const xTo = gsap.quickTo(plate, "x", { duration: 0.9, ease: EASE.lerp });
      const yTo = gsap.quickTo(plate, "y", { duration: 0.9, ease: EASE.lerp });

      // The plate is centred on the pointer, so near an edge it would hang off
      // the section and get cut by the page's overflow clip. Keeping it inside
      // the list's own bounds means it always reads as a drawing being held up,
      // never as a half-loaded image.
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const halfW = plate.offsetWidth / 2;
        const halfH = plate.offsetHeight / 2;
        xTo(
          gsap.utils.clamp(halfW, rect.width - halfW, event.clientX - rect.left),
        );
        yTo(
          gsap.utils.clamp(halfH, rect.height - halfH, event.clientY - rect.top),
        );
      };
      el.addEventListener("pointermove", onMove);
      return () => el.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, [armed]);

  return (
    <section className="index-section" id="communities" aria-labelledby="index-title">
      <div className="sheet index-head">
        <p className="sheet-index label">
          <span className="label-num">03</span>
          <span className="label-sep">/</span> Selected communities
        </p>
        <h2 id="index-title" className="index-title">
          Find your <em>kind of home.</em>
        </h2>
        <p className="index-lede">
          Six addresses across two cities. Each one a different expression of the
          same idea.
        </p>
      </div>

      <div
        className="index-rows"
        ref={root}
        onPointerLeave={() => setActive(null)}
        data-active={active !== null ? "true" : "false"}
      >
        {armed && (
          <div className="index-plate" aria-hidden="true">
            {projects.map((project, i) => (
              <div
                key={project.slug}
                className="index-plate-item"
                data-visible={active === i ? "true" : "false"}
              >
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="30vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <ol className="index-list">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="index-row"
                data-cursor="Explore"
                data-dim={active !== null && active !== i ? "true" : "false"}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <span className="index-num label">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="index-name">{project.name}</span>
                <span className="index-place label">
                  {project.location} <span className="label-sep">/</span>{" "}
                  {project.city}
                </span>
                <span className="index-scale label">
                  {project.facts[0]?.value ?? project.category}
                </span>
                <span className="index-go">
                  <Arrow diagonal />
                </span>
                <span className="index-thumb">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    // This thumbnail only exists below 900px, where it spans
                    // the row; above that the element is `display: none`. The
                    // second clause says so, otherwise the browser is told a
                    // hidden element wants a full-width picture and is free to
                    // fetch a 1920px file nothing will ever show.
                    sizes="(max-width: 899px) 92vw, 1px"
                    loading="lazy"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="index-foot">
          <span className="label">
            01 <span className="label-sep">—</span>{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
          <Link href="/projects" className="text-link text-link-light">
            View the full portfolio <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
