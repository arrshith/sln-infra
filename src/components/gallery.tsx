"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { Arrow } from "./ui";

export function Gallery({
  images,
  title,
}: {
  images: Project["gallery"];
  title: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
  }
  function move(direction: number) {
    setActive((i) => (i + direction + images.length) % images.length);
  }
  return (
    <>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <figure key={img.src}>
            <button
              className="gallery-image"
              aria-label={`Enlarge ${img.caption}`}
              onClick={() => {
                setActive(i);
                dialog.current?.showModal();
                document.body.style.overflow = "hidden";
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <span className="project-open">
                <Arrow diagonal />
              </span>
            </button>
            <figcaption>
              <span>{img.caption}</span>
              <span>0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={`${title} image gallery`}
        onClose={close}
        onCancel={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="lightbox-top">
          <span>{title}</span>
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
            {active + 1} / {images.length} — {images[active].caption}
          </p>
          <button onClick={() => move(1)} aria-label="Next image">
            →
          </button>
        </div>
      </dialog>
    </>
  );
}
