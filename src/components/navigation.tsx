"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { Magnetic } from "@/components/motion/primitives";
import { company, projects } from "@/lib/content";
import { DUR, EASE, STAGGER, prefersReducedMotion, registerGsap } from "@/lib/motion";

const links = [
  { href: "/projects", label: "Our projects" },
  { href: "/about", label: "Our story" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

/**
 * Three states rather than two. Over a dark hero the bar is drawn in light and
 * carries no background at all; once past it the bar condenses onto paper with a
 * hairline beneath; and while you are reading downward it gets out of the way
 * entirely, returning the moment you scroll back.
 */
export function Navigation() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Only the homepage and a project's own page open on a full-bleed dark hero.
  // Matching on the "/projects/" prefix instead would sweep in the stage
  // listings — /projects/ongoing and friends — which open on paper, and draw
  // the whole header in white on a near-white ground.
  const segment = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : undefined;
  const overDarkHero =
    pathname === "/" || projects.some((project) => project.slug === segment);

  useEffect(() => {
    const el = header.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      const simple = () => {
        el.dataset.condensed = window.scrollY > 60 ? "true" : "false";
      };
      simple();
      window.addEventListener("scroll", simple, { passive: true });
      return () => window.removeEventListener("scroll", simple);
    }

    const { gsap } = registerGsap();
    const yTo = gsap.quickTo(el, "yPercent", {
      duration: 0.55,
      ease: EASE.inOut,
    });

    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      el.dataset.condensed = y > 60 ? "true" : "false";
      const hidden = y > 420 && y > last && !el.dataset.menuOpen;
      yTo(hidden ? -100 : 0);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    const el = dialog.current;
    setOpen(false);
    document.body.style.overflow = "";
    if (header.current) delete header.current.dataset.menuOpen;
    trigger.current?.setAttribute("aria-expanded", "false");
    if (!el) return;

    /**
     * Closing a <dialog> is specified to return focus to whatever opened it,
     * and Chrome and Firefox do. WebKit does not, which leaves focus on the
     * document after Escape and strands keyboard users at the top of the page
     * with no way back into the menu. Restoring it by hand costs nothing in
     * the browsers that already behave, and is the only thing that works in
     * the one that does not.
     */
    const close = () => {
      el.close();
      trigger.current?.focus();
    };

    if (prefersReducedMotion()) {
      close();
      return;
    }
    const { gsap } = registerGsap();
    gsap.to(el, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.5,
      ease: EASE.inOut,
      onComplete: close,
    });
  }, []);

  const openMenu = useCallback(() => {
    const el = dialog.current;
    if (!el) return;
    el.showModal();
    setOpen(true);
    document.body.style.overflow = "hidden";
    if (header.current) header.current.dataset.menuOpen = "true";
    trigger.current?.setAttribute("aria-expanded", "true");
    if (prefersReducedMotion()) return;

    const { gsap } = registerGsap();
    gsap
      .timeline()
      .fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: EASE.inOut },
      )
      .fromTo(
        el.querySelectorAll(".menu-link"),
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.line,
        },
        0.22,
      )
      .fromTo(
        el.querySelectorAll(".mobile-menu-bottom > *"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: 0.06 },
        0.45,
      );
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      if (query.matches && dialog.current?.open) closeMenu();
    };
    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, [closeMenu]);

  return (
    <>
      <header
        ref={header}
        className="site-header"
        data-dark={overDarkHero ? "true" : "false"}
        data-condensed="false"
      >
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="SLN Infra home">
            <Image
              src="/images/logo.webp"
              width={42}
              height={43}
              alt=""
              loading="eager"
              fetchPriority="high"
            />
            <span className="brand-type">
              SLN <span className="brand-small">Infra</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={
                  pathname.startsWith(link.href) ? "page" : undefined
                }
              >
                <span className="nav-link-inner">
                  <span>{link.label}</span>
                  <span aria-hidden="true">{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>

          <Magnetic className="nav-cta-wrap" strength={0.2}>
            <Link href="/contact?intent=visit" className="nav-cta">
              <span>Schedule a visit</span>
              <Arrow diagonal />
            </Link>
          </Magnetic>

          <button
            ref={trigger}
            className="menu-trigger"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            aria-expanded="false"
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <dialog
        id="mobile-navigation"
        className="mobile-menu"
        ref={dialog}
        onClose={closeMenu}
        onCancel={closeMenu}
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-top">
          <span className="label">SLN Infra</span>
          <button
            className="menu-close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[{ href: "/", label: "Home" }, ...links].map((link, i) => (
            <span className="menu-link-mask" key={link.href}>
              <Link
                href={link.href}
                className="menu-link"
                onClick={closeMenu}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <span className="label">{`0${i + 1}`}</span>
                {link.label}
                <Arrow diagonal />
              </Link>
            </span>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          <p>Space to live. Room to belong.</p>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>
      </dialog>
    </>
  );
}
