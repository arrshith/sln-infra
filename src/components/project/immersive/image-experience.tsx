"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { EASE, MQ, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { trackOnce } from "@/lib/analytics";
import type { MediaItem } from "@/lib/content";

/**
 * Exploring a visualisation at close range.
 *
 * This is not a 3D model and does not pretend to be one. The render is held at
 * a scale larger than its frame and the visitor moves the view around it — a
 * camera panning across a facade — which is what lets someone actually examine
 * the stonework, the balcony returns and the entrance rather than squinting at
 * a thumbnail. The control is stated on the frame ("Drag to explore") so nobody
 * has to guess.
 *
 * Where more than one layer is supplied they are drawn back to front and move
 * at different rates, giving real parallax. With a single render — all SLN has
 * published so far — it pans as one plane, honestly.
 */
export function ImageExperience({
  layers,
  label,
  projectSlug,
}: {
  layers: MediaItem[];
  label: string;
  projectSlug: string;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const { gsap } = registerGsap();

    const planes = Array.from(
      el.querySelectorAll<HTMLElement>(".immersive-plane"),
    );
    if (!planes.length) return;

    if (prefersReducedMotion()) {
      el.dataset.ready = "true";
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motionOk, () => {
        // Each plane is given its own follow, so a foreground layer can travel
        // further than the one behind it.
        const movers = planes.map((plane, depth) => ({
          x: gsap.quickTo(plane, "xPercent", { duration: 0.9, ease: EASE.lerp }),
          y: gsap.quickTo(plane, "yPercent", { duration: 0.9, ease: EASE.lerp }),
          rate: 1 + depth * 0.6,
        }));

        // How far the view may travel before the frame would show an edge.
        const range = 6;
        let px = 0;
        let py = 0;

        const apply = () => {
          for (const mover of movers) {
            mover.x(gsap.utils.clamp(-range, range, px * mover.rate));
            mover.y(gsap.utils.clamp(-range, range, py * mover.rate));
          }
        };

        const fromPointer = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          px = ((event.clientX - rect.left) / rect.width - 0.5) * -range;
          py = ((event.clientY - rect.top) / rect.height - 0.5) * -range;
          apply();
        };

        let dragging = false;
        const onDown = (event: PointerEvent) => {
          dragging = true;
          el.setPointerCapture(event.pointerId);
          el.dataset.dragging = "true";
          trackOnce(`tour-${projectSlug}`, {
            event: "virtual_tour_start",
            project: projectSlug,
            experience: label,
          });
        };
        const onMove = (event: PointerEvent) => {
          // A pointer that can hover explores on hover; a finger has to drag.
          if (!dragging && event.pointerType === "touch") return;
          fromPointer(event);
          trackOnce(`interact-${projectSlug}`, {
            event: "3d_interaction",
            project: projectSlug,
            experience: label,
          });
        };
        const onUp = (event: PointerEvent) => {
          dragging = false;
          delete el.dataset.dragging;
          if (el.hasPointerCapture(event.pointerId))
            el.releasePointerCapture(event.pointerId);
        };
        const onLeave = () => {
          px = 0;
          py = 0;
          apply();
        };

        // Keyboard users move the view in steps — the same exploration, without
        // requiring a pointer.
        const onKey = (event: KeyboardEvent) => {
          const step = 1.2;
          if (event.key === "ArrowLeft") px = Math.min(range, px + step);
          else if (event.key === "ArrowRight") px = Math.max(-range, px - step);
          else if (event.key === "ArrowUp") py = Math.min(range, py + step);
          else if (event.key === "ArrowDown") py = Math.max(-range, py - step);
          else return;
          event.preventDefault();
          apply();
        };

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("keydown", onKey);
        el.dataset.ready = "true";

        return () => {
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("keydown", onKey);
        };
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [label, projectSlug]);

  const base = layers[0];
  if (!base) return null;

  return (
    <div
      className="immersive"
      ref={frame}
      tabIndex={0}
      role="group"
      aria-label={`${label}. Drag, or use the arrow keys, to move the view.`}
      style={{ aspectRatio: `${base.width} / ${base.height}` }}
    >
      {layers.map((layer, depth) => (
        <div className="immersive-plane" key={layer.src} data-depth={depth}>
          <Image
            src={layer.src}
            alt={depth === 0 ? layer.alt : ""}
            fill
            sizes="(max-width: 899px) 100vw, 70vw"
            loading="lazy"
          />
        </div>
      ))}
      <p className="immersive-hint label" aria-hidden="true">
        <span className="immersive-hint-dot" />
        Drag to explore
      </p>
    </div>
  );
}
