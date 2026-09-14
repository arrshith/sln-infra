"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui";
import type { GalleryCategory } from "@/lib/content";

/**
 * The project gallery. Categories are only offered when they hold pictures, so
 * a buyer is never given an "Interior" tab that opens on nothing.
 *
 * Every frame is sized from the image's own dimensions rather than a fixed
 * aspect ratio — the rule the elevation crop taught us — and the grid alternates
 * a full-width plate with a pair so a set of photographs reads as a spread
 * rather than a contact sheet.
 */
export function Gallery({
  categories,
  title,
}: {
  categories: GalleryCategory[];
  title: string;
}) {
  const available = categories.filter((category) => category.items.length > 0);
  const [activeId, setActiveId] = useState(available[0]?.id);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const openedFrom = useRef<HTMLButtonElement | null>(null);

  const category =
    available.find((entry) => entry.id === activeId) ?? available[0];

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  if (!category) return null;
  const images = category.items;

  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
  }

  function move(direction: number) {
    setActive((i) => (i + direction + images.length) % images.length);
  }

  return (
    <>
      {available.length > 1 && (
        <div
          className="gallery-nav"
          role="group"
          aria-label={`${title} gallery categories`}
        >
          {available.map((entry) => (
            <button
              key={entry.id}
              onClick={() => {
                setActiveId(entry.id);
                setActive(0);
              }}
              aria-pressed={entry.id === category.id}
            >
              {entry.label}
              <span>{String(entry.items.length).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}

      <div className="gallery-grid">
        {images.map((image, i) => (
          <figure
            key={image.src}
            // A wide picture takes the full measure; taller ones pair up.
            data-span={image.width / image.height > 1.9 ? "full" : "half"}
          >
            <button
              className="gallery-image"
              aria-label={`Enlarge ${image.caption ?? image.alt}`}
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
              onClick={(event) => {
                openedFrom.current = event.currentTarget;
                setActive(i);
                dialog.current?.showModal();
                document.body.style.overflow = "hidden";
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                loading="lazy"
              />
              <span className="project-open">
                <Arrow diagonal />
              </span>
            </button>
            <figcaption>
              <span>{image.caption ?? image.alt}</span>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} image gallery`}
        onClose={() => {
          close();
          openedFrom.current?.focus();
        }}
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="lightbox-top">
          <span>
            {title}
            {available.length > 1 ? ` · ${category.label}` : ""}
          </span>
          <button
            onClick={close}
            className="menu-close"
            aria-label="Close image gallery"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="lightbox-image">
          <Image
            src={images[active].src}
            alt={images[active].alt}
            fill
            sizes="95vw"
          />
        </div>
        <div className="lightbox-controls">
          <button onClick={() => move(-1)} aria-label="Previous image">
            ←
          </button>
          <p aria-live="polite">
            {active + 1} / {images.length} —{" "}
            {images[active].caption ?? images[active].alt}
          </p>
          <button onClick={() => move(1)} aria-label="Next image">
            →
          </button>
        </div>
      </dialog>
    </>
  );
}
