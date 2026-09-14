import { RevealText } from "@/components/motion/text";
import type { ReactNode } from "react";

/**
 * The title block every inner page opens with — sheet reference, statement,
 * summary, and a rule that draws itself across the page. It is the piece that
 * tells you these pages belong to the same set as the homepage.
 */
export function Masthead({
  index,
  section,
  title,
  lede,
}: {
  index: string;
  section: string;
  title: ReactNode;
  lede: ReactNode;
}) {
  return (
    <header className="masthead">
      <div className="sheet masthead-inner">
        <div className="masthead-lead">
          <p className="sheet-index label">
            <span className="label-num">{index}</span>
            <span className="label-sep">/</span> {section}
          </p>
          <RevealText as="h1" mode="lines" play="load" delay={0.1}>
            {title}
          </RevealText>
        </div>
        <RevealText
          as="p"
          mode="words"
          play="load"
          delay={0.35}
          className="masthead-lede"
        >
          {lede}
        </RevealText>
      </div>
      <div className="masthead-rule" />
    </header>
  );
}
