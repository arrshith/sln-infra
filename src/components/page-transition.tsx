"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { EASE, prefersReducedMotion, registerGsap } from "@/lib/motion";

/**
 * Between pages the site closes like a set of shutters and opens again on the
 * new one: five panels lift in sequence off an ink field. It runs on arrival
 * only — nothing waits on an animation before navigating, so the transition can
 * never hold a link hostage.
 *
 * It also does the housekeeping a pinned, scroll-driven site needs on every
 * route change: recalculate every trigger once the new page has laid out.
 */
export function PageTransition() {
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const settle = () => requestAnimationFrame(() => ScrollTrigger.refresh());

    // The first paint is the hero's job, not the shutter's.
    if (first.current) {
      first.current = false;
      settle();
      return;
    }

    if (prefersReducedMotion()) {
      settle();
      return;
    }

    const panels = el.querySelectorAll(".transition-panel");
    const tl = gsap.timeline({ onComplete: settle });

    tl.set(el, { pointerEvents: "auto", autoAlpha: 1 })
      .set(panels, { scaleY: 1, transformOrigin: "bottom" })
      .to(panels, {
        scaleY: 0,
        duration: 0.72,
        ease: EASE.inOut,
        stagger: 0.055,
      })
      .set(el, { pointerEvents: "none", autoAlpha: 0 });

    return () => {
      tl.kill();
      gsap.set(el, { autoAlpha: 0, pointerEvents: "none" });
    };
  }, [pathname]);

  return (
    <div className="page-transition" ref={overlay} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span className="transition-panel" key={i} />
      ))}
    </div>
  );
}
