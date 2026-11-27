"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EnquiryForm } from "./enquiry-form";
import { track } from "@/lib/analytics";
import { projects } from "@/lib/content";

const DELAY = 8000;
const KEY = "sln-enquiry-popup";
const QUIET = 7 * 24 * 60 * 60 * 1000;
// Pages that already are an enquiry, or are not about finding a home.
const SKIP = [
  "/contact",
  "/channel-partners",
  "/careers",
  "/privacy",
  "/disclaimer",
];

function seenRecently() {
  try {
    return Date.now() - Number(localStorage.getItem(KEY)) < QUIET;
  } catch {
    return false;
  }
}

/**
 * The enquiry, offered once: eight seconds after the visit begins, then not
 * again for a week. Mounted in the layout, so the clock runs from arrival on
 * the site rather than restarting on every page.
 */
export function EnquiryPopup({
  deliveryEnabled,
}: {
  deliveryEnabled: boolean;
}) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const arrived = useRef(0);
  const shown = useRef(false);
  const [open, setOpen] = useState(false);

  // On a project page the popup is about that project.
  const segment = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : "";
  const project = projects.find(
    (p) => p.slug === segment && p.status !== "Sold out",
  );
  const image = project?.image ?? "/images/nidhi-palms.webp";

  useEffect(() => {
    arrived.current ||= Date.now();
  }, []);

  // Following a link out of it (the privacy notice) should not leave it open.
  useEffect(() => dialog.current?.close(), [pathname]);

  useEffect(() => {
    if (shown.current || SKIP.some((p) => pathname.startsWith(p))) return;
    if (seenRecently()) return;
    let timer = 0;
    const show = () => {
      // Never stack on the menu or the gallery; wait for them to close.
      if (document.querySelector("dialog[open]")) {
        timer = window.setTimeout(show, 3000);
        return;
      }
      shown.current = true;
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
      setOpen(true);
      dialog.current?.showModal();
      // Unasked-for, so focus the dialog itself: no ring on Close, no keyboard
      // springing up on a phone. Tab still lands on Close first.
      dialog.current?.focus();
      document.body.style.overflow = "hidden";
      track({ event: "lead_form_view", form: "popup", project: project?.slug });
    };
    timer = window.setTimeout(
      show,
      Math.max(0, DELAY - (Date.now() - arrived.current)),
    );
    return () => window.clearTimeout(timer);
  }, [pathname, project?.slug]);

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      className="enquiry-popup"
      aria-label="Enquire with SLN Infra"
      tabIndex={-1}
      data-lenis-prevent
      onClose={() => {
        setOpen(false);
        document.body.style.overflow = "";
      }}
      // A click on the dialog itself, not its panel, is a click on the backdrop.
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className="popup-panel">
        <figure className="popup-image">
          {open && <Image src={image} alt="" fill sizes="380px" />}
          <figcaption>
            <span className="label">
              {project
                ? `${project.location} / ${project.city}`
                : "Bengaluru / Hyderabad"}
            </span>
            <p>
              Space to live.
              <br />
              <em>Room to belong.</em>
            </p>
          </figcaption>
        </figure>
        <div className="popup-body">
          <div className="popup-top">
            <span className="label">
              {project ? project.name : "Private visits"}
            </span>
            <button
              type="button"
              className="menu-close popup-close"
              onClick={close}
              aria-label="Close enquiry"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          {open && (
            <EnquiryForm
              initialProject={project?.slug ?? ""}
              visit={false}
              source="popup"
              deliveryEnabled={deliveryEnabled}
              compact
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
