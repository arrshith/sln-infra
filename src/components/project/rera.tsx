"use client";

import { Arrow } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Rera } from "@/lib/content";

/**
 * The registration panel. This is the part of a project page a careful buyer
 * checks first, so it is set plainly and without decoration: the number in full,
 * selectable, next to the certificate and the authority's own register.
 *
 * Nothing here is ever generated. A project without a supplied registration
 * does not render this component at all.
 */
export function ReraPanel({
  rera,
  projectSlug,
}: {
  rera: Rera;
  projectSlug: string;
}) {
  return (
    <div className="rera">
      <div className="rera-number">
        <p className="label muted">Project RERA registration</p>
        {/* Buyers copy this into the authority's search. Keep it unbroken and
            selectable rather than styled into something decorative. */}
        <p className="rera-value">{rera.number}</p>
      </div>

      <div className="rera-actions">
        {rera.certificate && (
          <a
            className="text-link"
            href={rera.certificate.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ event: "rera_download", project: projectSlug })}
          >
            {rera.certificate.label} <Arrow diagonal />
          </a>
        )}
        {rera.authorityUrl && (
          <a
            className="text-link"
            href={rera.authorityUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify on the RERA register <Arrow diagonal />
          </a>
        )}
      </div>
    </div>
  );
}
