"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis drives the scroll, ScrollTrigger reads from it. Kept deliberately light:
 * a short lerp so the page feels cinematic without the sluggish, disconnected
 * inertia that makes long documents tiring to read. Native scrolling is left
 * alone on touch devices and whenever reduced motion is requested.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const lenis = new Lenis({
      duration: 0.9,
      lerp: 0.11,
      // Native momentum on touch beats anything we can emulate.
      syncTouch: false,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors must go through Lenis or they fight the rAF loop.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      // Sections carry their own generous top padding, so the target's own top
      // edge is the right landing point; the header sits over padding, never
      // over content.
      lenis.scrollTo(target as HTMLElement, { duration: 1.1 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
