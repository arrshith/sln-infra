"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Configuration } from "@/lib/content";

/**
 * Floor plans, which are drawings and therefore useless when shrunk. The plate
 * is shown as large as the column allows, and opens into a full-screen viewer
 * that shows the file at its own size inside a scrollable frame — so a phone
 * can pinch and pan around a plan rather than squint at the whole sheet.
 *
 * Configurations come from the data. A project that has published one plan
 * shows one; a project that has published none does not reach this component.
 */
export function FloorPlans({
  configurations,
  projectName,
  projectSlug,
}: {
  configurations: Configuration[];
  projectName: string;
  projectSlug: string;
}) {
  const withPlans = configurations.filter((config) => config.floorPlan);
  const [activeId, setActiveId] = useState(withPlans[0]?.id);
  const dialog = useRef<HTMLDialogElement>(null);
  const [actualSize, setActualSize] = useState(false);

  const active =
    withPlans.find((config) => config.id === activeId) ?? withPlans[0];
  if (!active?.floorPlan) return null;
  const plan = active.floorPlan;

  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
    setActualSize(false);
  }

  return (
    <div className="plans">
      {withPlans.length > 1 && (
        <div
          className="plans-nav"
          role="group"
          aria-label={`${projectName} configurations`}
        >
          {withPlans.map((config) => (
            <button
              key={config.id}
              onClick={() => setActiveId(config.id)}
              aria-pressed={config.id === active.id}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}

      <div className="plans-body">
        <figure className="plans-plate">
          <button
            className="plans-open"
            aria-label={`View ${active.label} floor plan full screen`}
            onClick={() => {
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <Image
              src={plan.src}
              alt={plan.alt}
              width={plan.width}
              height={plan.height}
              sizes="(max-width: 899px) 100vw, 58vw"
              loading="lazy"
            />
            <span className="plans-zoom label">Zoom</span>
          </button>
        </figure>

        <div className="plans-meta">
          <p className="label muted">{active.label}</p>
          <dl>
            {active.builtUpArea && (
              <div>
                <dt className="label muted">Built-up area</dt>
                <dd>{active.builtUpArea}</dd>
              </div>
            )}
            {active.plotArea && (
              <div>
                <dt className="label muted">Plot area</dt>
                <dd>{active.plotArea}</dd>
              </div>
            )}
            {active.bedrooms && (
              <div>
                <dt className="label muted">Bedrooms</dt>
                <dd>{active.bedrooms}</dd>
              </div>
            )}
            {active.priceFrom && (
              <div>
                <dt className="label muted">From</dt>
                <dd>{active.priceFrom.display}</dd>
              </div>
            )}
          </dl>

          <a
            className="text-link"
            href={plan.src}
            download
            onClick={() =>
              track({
                event: "floorplan_download",
                project: projectSlug,
                configuration: active.label,
              })
            }
          >
            Download plan <Arrow diagonal />
          </a>

          {active.brochure && (
            <a
              className="text-link"
              href={active.brochure.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track({
                  event: "brochure_download",
                  project: projectSlug,
                  document: active.brochure!.label,
                })
              }
            >
              {active.brochure.label} <Arrow diagonal />
            </a>
          )}
        </div>
      </div>

      <dialog
        ref={dialog}
        className="plan-viewer"
        aria-label={`${projectName} ${active.label} floor plan`}
        onClose={close}
        onCancel={close}
      >
        <div className="lightbox-top">
          <span>
            {projectName} · {active.label}
          </span>
          <div className="plan-viewer-tools">
            <button
              onClick={() => setActualSize((v) => !v)}
              aria-pressed={actualSize}
            >
              {actualSize ? "Fit to screen" : "Actual size"}
            </button>
            <button
              onClick={close}
              className="menu-close"
              aria-label="Close floor plan"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div className="plan-viewer-frame" data-actual={actualSize}>
          <Image
            src={plan.src}
            alt={plan.alt}
            width={plan.width}
            height={plan.height}
            sizes="100vw"
          />
        </div>
      </dialog>
    </div>
  );
}
