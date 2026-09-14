"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import { RevealText } from "@/components/motion/text";
import { MQ, registerGsap } from "@/lib/motion";

const NightScene = dynamic(() => import("@/components/webgl/night-scene"), {
  ssr: false,
});

/**
 * The turn into darkness. The night aerial arrives as a narrow band across an
 * ink field and opens to fill the viewport as you scroll — the section builds
 * itself rather than appearing. Once open, the lights start to breathe.
 *
 * The shader is a progressive enhancement laid over the real photograph: if it
 * never loads, or the device is too small to earn it, what remains is the image
 * itself, correctly cropped and captioned.
 */
export function AfterDark() {
  const root = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // The opening band. Vertical only — a horizontal wipe here would read as a
      // slide transition rather than a shutter.
      mm.add(MQ.motionOk, () => {
        const media = el.querySelector(".dark-media");
        const open = gsap.fromTo(
          media,
          { clipPath: "inset(38% 0% 38% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "top 12%",
              scrub: 0.8,
            },
          },
        );
        return () => {
          open.scrollTrigger?.kill();
          open.kill();
        };
      });

      // WebGL is a widescreen, pointer-device, motion-allowed enhancement only.
      mm.add(
        `${MQ.desktop} and (hover: hover) and (pointer: fine) and ${MQ.motionOk}`,
        () => {
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setGl(true);
                io.disconnect();
              }
            },
            { rootMargin: "400px" },
          );
          io.observe(el);
          return () => io.disconnect();
        },
      );

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dark-section" id="after-dark" ref={root} aria-labelledby="dark-title">
      <div className="dark-media">
        <Image
          src="/images/sln-villas.webp"
          alt="Aerial concept visualisation of an SLN villa community at night, its avenues and homes picked out in warm light against dark planting"
          fill
          sizes="100vw"
          loading="lazy"
          className="dark-still"
          data-gl={gl ? "true" : "false"}
        />
        {gl && <NightScene src="/images/sln-villas.webp" />}
        <div className="dark-grade" />
      </div>

      <div className="dark-copy sheet">
        <p className="sheet-index label label-light">
          <span className="label-num">04</span>
          <span className="label-sep">/</span> After dark
        </p>
        <RevealText as="h2" mode="lines" className="dark-title" id="dark-title">
          A community is
          <br />
          <em>what you see</em>
          <br />
          when the lights
          <br />
          come on.
        </RevealText>
      </div>

      <div className="dark-foot sheet">
        <p className="dark-note">
          Avenues, gardens, gates and gathering places are drawn at the same time
          as the houses — so that a street of villas becomes somewhere to live
          rather than somewhere to park.
        </p>
        <Link
          href="/projects/sln-villas"
          className="text-link text-link-light"
          data-cursor="Explore"
        >
          (Code Name) SLN, off Whitefield <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
