"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  DUR,
  EASE,
  STAGGER,
  alreadyOnScreen,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

/**
 * The closing frame, animated.
 *
 * Nothing decorative is added here — the footer already holds the only place on
 * the site where the mark is set at full height and filled with the night
 * aerial. The sequence simply uncovers it: the rule draws across, the letters
 * are wiped up from the baseline while the photograph inside them settles
 * downward, and the directory rises underneath.
 *
 * It is the same architectural wipe `ImageReveal` uses, applied to type instead
 * of a frame, so the last thing on the page moves the way everything above it
 * moved.
 *
 * Wrapper rather than markup: `Footer` stays a server component, and the only
 * client code is this orchestrator.
 */
export function FooterMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || alreadyOnScreen(el)) return;
    // Hydration can land after someone has already tabbed into the footer. The
    // sequence must never take back something that is already being used.
    if (el.contains(document.activeElement)) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const rules = q(".footer-rule");
      const wordmark = q(".footer-wordmark");
      const strap = q(".footer-strap");
      const columns = q(".footer-col");
      const bottom = q(".footer-bottom > *");

      gsap.set(rules, { scaleX: 0 });
      gsap.set(wordmark, {
        clipPath: "inset(100% 0 0 0)",
        backgroundPosition: "50% 58%",
      });
      gsap.set([strap, columns, bottom], { y: 26, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(rules[0], {
        scaleX: 1,
        duration: DUR.slow,
        ease: EASE.inOut,
      })
        .to(
          wordmark,
          {
            clipPath: "inset(0% 0 0 0)",
            duration: DUR.cinematic,
            ease: EASE.inOut,
          },
          0.1,
        )
        // The aerial drifts down as the letters fill, so the mark reads as a
        // window onto something moving rather than a stencil over a still.
        .to(
          wordmark,
          {
            backgroundPosition: "50% 44%",
            duration: 1.9,
            ease: EASE.inOut,
          },
          0.1,
        )
        .to(
          strap,
          { y: 0, opacity: 1, duration: DUR.base, ease: EASE.out },
          0.45,
        )
        .to(
          columns,
          {
            y: 0,
            opacity: 1,
            duration: DUR.slow,
            ease: EASE.out,
            stagger: STAGGER.block,
          },
          0.6,
        )
        .to(rules[1], { scaleX: 1, duration: DUR.base, ease: EASE.inOut }, 0.9)
        .to(
          bottom,
          {
            y: 0,
            opacity: 1,
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.block / 2,
          },
          1,
        );

      /**
       * Tabbing into the footer scrolls it into view, which starts the
       * sequence — but the links themselves are still transparent for another
       * second. Nobody should be asked to keep their place on a link they
       * cannot see, so focus lands the whole thing at once.
       */
      const onFocusIn = () => tl.progress(1);
      el.addEventListener("focusin", onFocusIn);

      const trigger = ScrollTrigger.create({
        trigger: el,
        // Deliberately the same 95% threshold `alreadyOnScreen` bails on, which
        // is what guarantees this always fires. If we got here the footer's top
        // started below 95% of the viewport; because the footer is the last
        // thing in the document, its top at maximum scroll is `vh - footerH`,
        // and the footer is always more than 5% of a viewport tall. Set this
        // start any lower than the bail threshold and a page only a little
        // taller than the viewport could hide the footer and never restore it.
        start: "top 95%",
        once: true,
        onEnter: () => tl.play(),
      });

      return () => {
        el.removeEventListener("focusin", onFocusIn);
        trigger.kill();
        tl.kill();
        gsap.set(rules, { clearProps: "transform" });
        gsap.set([wordmark, strap, columns, bottom], {
          clearProps: "transform,opacity,clipPath,backgroundPosition",
        });
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="footer-motion" ref={root}>
      {children}
    </div>
  );
}
