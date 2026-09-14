"use client";

import { useEffect, useRef, type JSX, type ReactNode } from "react";

import {
  DUR,
  EASE,
  STAGGER,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

/** Reveals wrap real elements, never other components — the ref has to land on
 *  a DOM node for GSAP to measure and split it. */
type Tag = keyof JSX.IntrinsicElements;

type Mode = "lines" | "words" | "chars" | "rise" | "clip";

/**
 * The site's typographic reveal system. Five distinct behaviours instead of one
 * fade-up, chosen per moment:
 *
 * - `lines`  editorial statements — each line rises out of its own mask
 * - `words`  supporting copy — words drift up in a loose stagger
 * - `chars`  reserved for the single largest headline on a page
 * - `rise`   a whole block lifts and settles (labels, small print)
 * - `clip`   the block is wiped open by an architectural edge
 */
export function RevealText({
  children,
  as = "p",
  mode = "lines",
  delay = 0,
  start = "top 85%",
  once = true,
  play = "scroll",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: Tag;
  mode?: Mode;
  delay?: number;
  start?: string;
  once?: boolean;
  /** `load` runs immediately (hero choreography), `scroll` waits for the viewport. */
  play?: "scroll" | "load";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = "1";
      return;
    }
    const { gsap, ScrollTrigger, SplitText } = registerGsap();

    let split: InstanceType<typeof SplitText> | null = null;
    let tween: gsap.core.Tween | null = null;
    let trigger: ScrollTrigger | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled || !el) return;
      el.style.opacity = "1";

      // Already on screen when the page arrived: no entrance to make.
      if (play === "scroll" && el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        return;
      }

      const run = (animate: () => gsap.core.Tween) => {
        if (play === "load") {
          tween = animate();
          return;
        }
        trigger = ScrollTrigger.create({
          trigger: el,
          start,
          once,
          onEnter: () => {
            tween = animate();
          },
        });
      };

      if (mode === "rise" || mode === "clip") {
        const from =
          mode === "rise"
            ? { y: 26, opacity: 0 }
            : { clipPath: "inset(0 100% 0 0)", opacity: 1 };
        const to =
          mode === "rise"
            ? { y: 0, opacity: 1 }
            : { clipPath: "inset(0 0% 0 0)", opacity: 1 };
        gsap.set(el, from);
        run(() =>
          gsap.to(el, {
            ...to,
            duration: mode === "clip" ? DUR.slow : DUR.base,
            ease: mode === "clip" ? EASE.inOut : EASE.out,
            delay,
          }),
        );
        return;
      }

      split = new SplitText(el, {
        type: mode === "chars" ? "chars,words,lines" : mode,
        mask: mode === "lines" ? "lines" : undefined,
        linesClass: "reveal-line",
        autoSplit: true,
      });

      const targets =
        mode === "lines"
          ? split.lines
          : mode === "words"
            ? split.words
            : split.chars;

      if (!targets?.length) return;

      const fromVars: gsap.TweenVars =
        mode === "lines"
          ? { yPercent: 108, opacity: 1 }
          : mode === "words"
            ? { y: "0.5em", opacity: 0 }
            : { yPercent: 60, opacity: 0 };

      gsap.set(targets, fromVars);

      run(() =>
        gsap.to(targets, {
          yPercent: 0,
          y: 0,
          opacity: 1,
          duration: mode === "chars" ? DUR.slow : DUR.slow,
          ease: EASE.out,
          delay,
          stagger:
            mode === "lines"
              ? STAGGER.line
              : mode === "words"
                ? STAGGER.word
                : STAGGER.char,
        }),
      );
    };

    // Splitting before webfonts land produces wrong line breaks.
    if (document.fonts?.status === "loaded") build();
    else document.fonts?.ready.then(build).catch(build);

    return () => {
      cancelled = true;
      tween?.kill();
      trigger?.kill();
      split?.revert();
    };
  }, [mode, delay, start, once, play]);

  const Element = as as "p";
  return (
    <Element ref={ref} id={id} className={`reveal-text ${className}`.trim()}>
      {children}
    </Element>
  );
}

/**
 * A long statement that writes itself in as you scroll: words start at a muted
 * stone and resolve to ink, word by word, tied to scroll position rather than a
 * one-shot trigger. Reserved for the two or three places on the site where a
 * paragraph is the subject rather than support.
 *
 * `accent` marks words (1-indexed) that resolve to amber instead of ink.
 */
export function ScrollWords({
  children,
  as = "p",
  className = "",
  accent = [],
}: {
  children: string;
  as?: Tag;
  className?: string;
  accent?: number[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = registerGsap();
    const words = Array.from(el.querySelectorAll<HTMLElement>(".scroll-word"));
    if (!words.length) return;

    // Resolve the palette from the cascade so the tween always matches whatever
    // colour mode the surrounding section is painted in.
    const styles = getComputedStyle(el);
    const resolved = (name: string, fallback: string) =>
      styles.getPropertyValue(name).trim() || fallback;
    const settled = resolved("--words-to", "#16170F");
    const accentColor = resolved("--words-accent", "#C07723");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 0.7,
      },
    });
    tl.to(words, {
      color: (i: number, target: Element) =>
        target.classList.contains("scroll-word-accent") ? accentColor : settled,
      ease: "none",
      stagger: 0.5,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const words = children.split(" ");
  const Element = as as "p";
  return (
    <Element ref={ref} className={`scroll-words ${className}`.trim()}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={`scroll-word${accent.includes(i + 1) ? " scroll-word-accent" : ""}`}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Element>
  );
}
