import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * One registration point for the whole site. Components call `registerGsap()`
 * inside an effect so the plugins never touch the server render.
 */
let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined")
    return { gsap, ScrollTrigger, SplitText };
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
  return { gsap, ScrollTrigger, SplitText };
}

/**
 * Motion constants. Every timeline on the site pulls its easing and timing from
 * here, which is what makes separate sections feel like one choreography rather
 * than a pile of animations.
 */
export const EASE = {
  /** Reveals: fast departure, long graceful settle. The site's signature. */
  out: "expo.out",
  /** Softer reveal for large masses of type and image. */
  soft: "power3.out",
  /** Two-sided moves: section transitions, menus, page transitions. */
  inOut: "power3.inOut",
  /** Cursor / pointer follow. */
  lerp: "power2.out",
} as const;

export const DUR = {
  fast: 0.45,
  base: 0.8,
  slow: 1.15,
  cinematic: 1.6,
} as const;

/** Stagger presets, so line/word rhythm is identical everywhere. */
export const STAGGER = {
  line: 0.09,
  word: 0.035,
  char: 0.018,
  block: 0.12,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(hover: none)").matches || navigator.maxTouchPoints > 0);

/** Breakpoints shared by CSS and gsap.matchMedia(). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  mobile: "(max-width: 767px)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  motionReduced: "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, SplitText };

/**
 * Anything already on screen when the page loads has no entrance to make — it
 * is simply there. Animating it would mean hiding content the visitor can
 * already see, then bringing it back.
 */
export const alreadyOnScreen = (el: Element) =>
  el.getBoundingClientRect().top < window.innerHeight * 0.95;
