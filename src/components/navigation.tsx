"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./ui";
import { company } from "@/lib/content";

const links = [
  { href: "/projects", label: "Our projects" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const darkHero = pathname === "/" || pathname.startsWith("/projects/");

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function closeMenu() {
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.setAttribute("aria-expanded", "false");
  }

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (query.matches) closeMenu();
    };
    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <header
        className={`site-header ${darkHero && !scrolled ? "header-transparent" : "header-solid"}`}
      >
        <Link className="brand" href="/" aria-label="SLN Infra home">
          <Image
            src="/images/logo.webp"
            width={42}
            height={43}
            alt=""
            preload
          />
          <span>
            SLN <span className="brand-small">INFRA</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact?intent=visit" className="nav-enquire">
          Schedule a visit <Arrow diagonal />
        </Link>
        <button
          ref={trigger}
          className="menu-trigger"
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          aria-expanded="false"
          onClick={() => {
            dialog.current?.showModal();
            document.body.style.overflow = "hidden";
            trigger.current?.setAttribute("aria-expanded", "true");
          }}
        >
          <span />
          <span />
        </button>
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
          <span className="eyebrow">SLN INFRA</span>
          <button
            className="menu-close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[{ href: "/", label: "Home" }, ...links].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              <span className="eyebrow">0{i + 1}</span>
              {l.label}
              <Arrow diagonal />
            </Link>
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
