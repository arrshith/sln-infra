import Image from "next/image";
import { RevealText } from "@/components/motion/text";
import { Reveal } from "@/components/motion/primitives";
import type { Amenity } from "@/lib/content";

/**
 * Amenities, in whichever of two registers the data can support.
 *
 * When SLN has supplied photography the section runs image-led: large plates
 * alternating side to side with the description set against them, each frame
 * sized from the picture's own dimensions. When all we have is the names — as
 * today — it becomes a numbered index instead. That is a deliberate second
 * design, not a degraded first one: a list of real amenities set as an
 * architectural schedule reads better than the same list in grey icon cards
 * pretending to be photographs.
 */
export function Amenities({ items }: { items: Amenity[] }) {
  if (!items.length) return null;
  const illustrated = items.filter((item) => item.image);

  if (illustrated.length) {
    return (
      <div className="amenity-plates">
        {illustrated.map((item, i) => (
          <article key={item.title} className="amenity-plate" data-side={i % 2 ? "right" : "left"}>
            <figure
              style={{
                aspectRatio: `${item.image!.width} / ${item.image!.height}`,
              }}
            >
              <Image
                src={item.image!.src}
                alt={item.image!.alt}
                fill
                sizes="(max-width: 899px) 100vw, 52vw"
                loading="lazy"
              />
            </figure>
            <div className="amenity-copy">
              <span className="label muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <RevealText as="h3" mode="lines">
                {item.title}
              </RevealText>
              {item.description && <p>{item.description}</p>}
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <Reveal className="amenity-schedule">
      {items.map((item, i) => (
        <div key={item.title} data-stagger>
          <span className="label muted">{String(i + 1).padStart(2, "0")}</span>
          <span className="amenity-name">{item.title}</span>
          {item.description && <p>{item.description}</p>}
        </div>
      ))}
    </Reveal>
  );
}
