import Link from "next/link";
import { Arrow } from "@/components/ui";
import { RevealText, ScrollWords } from "@/components/motion/text";
import {
  Counter,
  ImageReveal,
  Parallax,
  Reveal,
} from "@/components/motion/primitives";

/**
 * After the dark hero the sheet turns to paper. This section is deliberately
 * quiet and text-led: one statement, written in as you read it, with the
 * architecture pushed out to the margin where it interrupts the measure rather
 * than illustrating it.
 */
export function Manifesto() {
  return (
    <section className="manifesto" id="manifesto" aria-labelledby="manifesto-title">
      <div className="sheet manifesto-sheet">
        <p className="sheet-index label">
          <span className="label-num">01</span>
          <span className="label-sep">/</span> The SLN way
        </p>

        <div className="manifesto-body">
          <RevealText as="h2" id="manifesto-title" mode="lines" className="manifesto-title">
            A home is more than
            <br />
            where you live.
            <br />
            <em>It&rsquo;s how you feel.</em>
          </RevealText>

          <ScrollWords
            className="manifesto-statement"
            accent={[7, 8, 9, 26, 27]}
          >
            {
              "Morning light through an open window. A garden that grows with you. Neighbours who become friends. We bring thoughtful architecture and natural surroundings together to make villa communities in Bengaluru and Hyderabad — places designed for life, in all its detail."
            }
          </ScrollWords>

          <Reveal className="manifesto-link">
            <Link href="/about" className="text-link">
              Get to know SLN Infra <Arrow />
            </Link>
          </Reveal>
        </div>

        <div className="manifesto-plate">
          <Parallax speed={0.1} scale={1.16}>
            <ImageReveal
              src="/images/aura-5.webp"
              alt="Architectural visualisation of an SLN Nidhi Aura villa, its balconies opening onto planted gardens"
              sizes="(max-width: 767px) 86vw, 32vw"
              from="bottom"
              caption="Nidhi Aura / Varthur"
            />
          </Parallax>
        </div>
      </div>

      <div className="sheet measure-row">
        <Reveal className="measures">
          <div data-stagger>
            <span className="measure-value">
              <Counter value="2018" />
            </span>
            <span className="measure-label">The beginning of our story</span>
          </div>
          <div data-stagger>
            <span className="measure-value">
              <Counter value="02" />
            </span>
            <span className="measure-label">Cities. One considered approach.</span>
          </div>
          <div data-stagger>
            <span className="measure-value">
              <Counter value="06" />
            </span>
            <span className="measure-label">Distinct villa communities</span>
          </div>
          <p className="measure-note" data-stagger>
            Different addresses.
            <br />
            The same attention to what matters.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
