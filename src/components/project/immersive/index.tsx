"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import type { ImmersiveAsset } from "@/lib/content";

/**
 * The explore experience, chosen from whatever assets a project actually has.
 *
 *   ImmersiveExperience
 *    ├── ImageExperience      — a render explored at close range (built)
 *    ├── PanoramaExperience   — a real 360 capture (awaiting assets)
 *    └── Model3DExperience    — a real GLB/GLTF model (awaiting assets)
 *
 * The dispatcher exists so that adding a genuine model or panorama later is a
 * data change plus one new viewer module, not a redesign of the page. Until
 * those assets exist the corresponding branches render the supplied poster and
 * say plainly that the walkthrough is being prepared — they do not simulate a
 * model that was never built.
 *
 * The viewer is loaded on demand: none of this is in the initial bundle.
 */
const ImageExperience = dynamic(
  () => import("./image-experience").then((m) => m.ImageExperience),
  { ssr: false },
);

export function ImmersiveExperience({
  assets,
  projectSlug,
}: {
  assets: ImmersiveAsset[];
  projectSlug: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!assets.length) return null;

  const asset = assets[activeIndex] ?? assets[0];

  return (
    <div className="immersive-block">
      {assets.length > 1 && (
        <div className="immersive-nav" role="group" aria-label="Views">
          {assets.map((entry, i) => (
            <button
              key={entry.label}
              onClick={() => setActiveIndex(i)}
              aria-pressed={i === activeIndex}
            >
              {entry.label}
            </button>
          ))}
        </div>
      )}

      {asset.kind === "image" ? (
        <ImageExperience
          layers={asset.layers}
          label={asset.label}
          projectSlug={projectSlug}
        />
      ) : (
        <Pending asset={asset} />
      )}
    </div>
  );
}

/**
 * A real 360 capture or model has been supplied but its viewer is not built
 * yet. Show the poster at its own proportions and be straightforward about it.
 */
function Pending({
  asset,
}: {
  asset: Extract<ImmersiveAsset, { kind: "panorama" | "model" }>;
}) {
  return (
    <figure
      className="immersive-pending"
      style={{
        aspectRatio: `${asset.poster.width} / ${asset.poster.height}`,
      }}
    >
      <Image
        src={asset.poster.src}
        alt={asset.poster.alt}
        fill
        sizes="(max-width: 899px) 100vw, 70vw"
        loading="lazy"
      />
      <figcaption className="label">
        {asset.label} · Walkthrough in preparation
      </figcaption>
    </figure>
  );
}
