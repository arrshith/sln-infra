"use client";

import { useEffect, useRef } from "react";
import { EASE, MQ, registerGsap } from "@/lib/motion";

/**
 * A two-part cursor: a precise dot that tracks the pointer exactly, and a ring
 * that trails behind it. The ring is the part that reacts — it opens into a
 * labelled disc over anything carrying `data-cursor`, so the pointer tells you
 * what a thing does before you click it.
 *
 * Pointer-device only. Never shown on touch, never shown to anyone who asked
 * for reduced motion, and purely decorative — every state it communicates is
 * also carried by the underlying element.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = registerGsap();

    const mm = gsap.matchMedia();
    mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOk}`, () => {
      const dot = el.querySelector<HTMLElement>(".cursor-dot");
      const ring = el.querySelector<HTMLElement>(".cursor-ring");
      const label = el.querySelector<HTMLElement>(".cursor-label");
      if (!dot || !ring || !label) return;

      el.dataset.enabled = "true";
      document.documentElement.classList.add("has-custom-cursor");

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: EASE.lerp });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: EASE.lerp });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: EASE.lerp });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: EASE.lerp });

      let visible = false;
      const show = () => {
        if (visible) return;
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      };

      const onMove = (event: PointerEvent) => {
        show();
        dotX(event.clientX);
        dotY(event.clientY);
        ringX(event.clientX);
        ringY(event.clientY);
      };

      const onLeave = () => {
        visible = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      };

      const setState = (state: string, text: string) => {
        el.dataset.state = state;
        if (text) label.textContent = text;
      };

      const onOver = (event: PointerEvent) => {
        const target = (event.target as HTMLElement)?.closest?.(
          "[data-cursor], a, button",
        ) as HTMLElement | null;
        if (!target) {
          setState("default", "");
          return;
        }
        const custom = target.getAttribute("data-cursor");
        if (custom) setState("label", custom);
        else setState("link", "");
      };

      const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.2 });
      const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      document.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointerleave", onLeave);
        document.documentElement.classList.remove("has-custom-cursor");
        delete el.dataset.enabled;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="cursor" ref={root} data-state="default" aria-hidden="true">
      <div className="cursor-ring">
        <span className="cursor-label" />
      </div>
      <div className="cursor-dot" />
    </div>
  );
}
