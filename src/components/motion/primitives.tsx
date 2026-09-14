"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DUR,
  EASE,
  MQ,
  STAGGER,
  alreadyOnScreen,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

/**
 * A block reveal for groups of elements. Children marked `data-stagger` move as
 * a sequence; everything else moves as one. Used sparingly — most reveals on the
 * site belong to the type or the image, not to a generic wrapper.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  start = "top 86%",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || alreadyOnScreen(el)) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const staggered = el.querySelectorAll<HTMLElement>("[data-stagger]");
    const targets = staggered.length ? staggered : [el];

    gsap.set(targets, { y: 30, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () =>
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: DUR.slow,
          ease: EASE.out,
          delay,
          stagger: staggered.length ? STAGGER.block : 0,
        }),
    });

    return () => {
      trigger.kill();
      gsap.set(targets, { clearProps: "transform,opacity" });
    };
  }, [delay, start]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

/**
 * The site's standard image entrance: an architectural wipe. The frame opens
 * from one edge while the photograph inside counter-scales, so the picture looks
 * like it is being uncovered rather than faded in.
 */
export function ImageReveal({
  src,
  alt,
  className = "",
  sizes = "100vw",
  from = "bottom",
  priority = false,
  caption,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  from?: "bottom" | "left" | "right" | "top";
  priority?: boolean;
  caption?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || alreadyOnScreen(el)) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const img = el.querySelector<HTMLElement>(".image-reveal-inner");
    if (!img) return;

    const closed = {
      bottom: "inset(100% 0 0 0)",
      top: "inset(0 0 100% 0)",
      left: "inset(0 100% 0 0)",
      right: "inset(0 0 0 100%)",
    }[from];

    gsap.set(el, { clipPath: closed });
    gsap.set(img, { scale: 1.22 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap
          .timeline()
          .to(el, {
            clipPath: "inset(0% 0 0 0)",
            duration: DUR.cinematic,
            ease: EASE.inOut,
          })
          .to(img, { scale: 1, duration: 1.9, ease: EASE.inOut }, 0);
      },
    });

    return () => trigger.kill();
  }, [from]);

  return (
    <figure className={`image-reveal ${className}`.trim()} ref={ref}>
      <div className="image-reveal-inner">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      {caption && <figcaption className="frame-caption">{caption}</figcaption>}
      {children}
    </figure>
  );
}

/**
 * Depth. Foreground and background move at different rates so full-bleed
 * compositions read as space rather than wallpaper. Halved on tablet, off on
 * phones where the viewport is too short for the effect to register.
 */
export function Parallax({
  children,
  className = "",
  speed = 0.16,
  scale = 1.14,
}: {
  children: ReactNode;
  className?: string;
  /** Fraction of the element's height it travels across the scroll. */
  speed?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap } = registerGsap();
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: `${MQ.desktop} and ${MQ.motionOk}`,
        tablet: `${MQ.tablet} and ${MQ.motionOk}`,
      },
      (ctx) => {
        const factor = ctx.conditions?.desktop ? 1 : 0.5;
        gsap.set(inner, { scale });
        const tween = gsap.fromTo(
          inner,
          { yPercent: -speed * 100 * factor },
          {
            yPercent: speed * 100 * factor,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      },
    );

    return () => mm.revert();
  }, [speed, scale]);

  return (
    <div className={`parallax ${className}`.trim()} ref={ref}>
      {children}
    </div>
  );
}

/**
 * Pointer attraction for the site's primary calls to action. Desktop only — on
 * touch there is no cursor to attract, and the transform only gets in the way.
 */
export function Magnetic({
  children,
  className = "",
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { gsap } = registerGsap();

    const mm = gsap.matchMedia();
    mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOk}`, () => {
      const target = el.firstElementChild as HTMLElement | null;
      if (!target) return;
      const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: EASE.lerp });
      const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: EASE.lerp });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set(target, { x: 0, y: 0 });
      };
    });

    return () => mm.revert();
  }, [strength]);

  return (
    <span className={`magnetic ${className}`.trim()} ref={ref}>
      {children}
    </span>
  );
}

/**
 * Counts a figure up as it enters the viewport. Keeps the literal string in the
 * DOM for anyone who never sees the animation.
 */
export function Counter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pad] = useState(() =>
    value.replace(/\d/g, "").length === 0 ? value.length : 0,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const target = Number(value);
    if (!Number.isFinite(target)) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const counter = { n: Math.max(0, target - Math.min(target, 40)) };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          n: target,
          duration: 1.4,
          ease: EASE.out,
          onUpdate: () => {
            el.textContent = String(Math.round(counter.n)).padStart(pad, "0");
          },
        }),
    });

    return () => trigger.kill();
  }, [value, pad]);

  return (
    <span className={className} ref={ref}>
      {value}
    </span>
  );
}
