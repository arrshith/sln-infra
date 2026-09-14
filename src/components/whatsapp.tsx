"use client";

import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { projects } from "@/lib/content";

/**
 * The floating WhatsApp CTA.
 *
 * The number is never hardcoded: it comes from `NEXT_PUBLIC_WHATSAPP_NUMBER`.
 * Until SLN confirms which line is WhatsApp-enabled, the component renders
 * nothing at all — a button that opens a chat with the wrong number is worse
 * than no button.
 *
 * On a project page the prefilled message names that project, so the sales team
 * knows what the enquiry is about before they reply.
 *
 * Icon only, by design: the glyph is unambiguous, and `aria-label` carries the
 * destination — including which project — for anyone who cannot see it.
 */
export function WhatsAppCta() {
  const pathname = usePathname();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (!number) return null;

  const slug = pathname.startsWith("/projects/")
    ? pathname.split("/")[2]
    : undefined;
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;

  const message = project
    ? `Hi SLN Infra, I'm interested in ${project.name} at ${project.location}.`
    : "Hi SLN Infra, I'd like to know more about your villa communities.";

  const label = project
    ? `Message SLN Infra on WhatsApp about ${project.name}`
    : "Message SLN Infra on WhatsApp";

  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={() =>
        track({
          event: "whatsapp_click",
          project: project?.slug,
          placement: "floating",
        })
      }
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9a9.8 9.8 0 0 0 1.35 4.96L2 22l5.3-1.38a9.9 9.9 0 0 0 4.74 1.2h.01a9.9 9.9 0 0 0 9.93-9.9A9.9 9.9 0 0 0 12.04 2m0 1.67a8.2 8.2 0 0 1 8.26 8.24 8.22 8.22 0 0 1-12.4 7.08l-.37-.22-3.13.82.83-3.05-.24-.39a8.2 8.2 0 0 1 7.05-12.48m-2.5 4.3c-.18 0-.46.07-.7.33s-.92.9-.92 2.2.94 2.55 1.07 2.72c.13.18 1.84 2.8 4.46 3.93.62.27 1.1.43 1.48.55.62.2 1.19.17 1.64.1.5-.07 1.54-.63 1.76-1.24s.22-1.13.15-1.24-.24-.18-.5-.31-1.54-.76-1.78-.85-.41-.13-.59.13-.67.85-.82 1.03-.3.2-.55.07a7.3 7.3 0 0 1-2.15-1.33 8.1 8.1 0 0 1-1.5-1.86c-.15-.26-.01-.4.12-.53.12-.12.26-.3.4-.46.12-.15.16-.26.25-.44s.04-.33-.02-.46-.58-1.42-.8-1.94c-.2-.5-.4-.44-.55-.44z"
        />
      </svg>
    </a>
  );
}
