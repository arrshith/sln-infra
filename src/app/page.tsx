import { ContactCTA } from "@/components/ui";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { Streetscape } from "@/components/home/streetscape";
import { ProjectIndex } from "@/components/home/project-index";
import { AfterDark } from "@/components/home/after-dark";
import { Principles } from "@/components/home/principles";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Nature-inspired villas in Bengaluru & Hyderabad",
  "Discover thoughtfully designed villa communities by SLN Infra. Explore homes in Bengaluru and Hyderabad, where architecture and nature come together.",
  "/",
);

/**
 * The homepage is written as a sequence of visual worlds rather than a stack of
 * components: dusk, paper, street, ink, night, clay, dusk again. No two
 * consecutive sections share a background, a layout or a way of moving, which is
 * what keeps a long scroll feeling composed instead of repetitive.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Streetscape />
      <ProjectIndex />
      <AfterDark />
      <Principles />
      <ContactCTA />
    </>
  );
}
