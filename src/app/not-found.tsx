import { TextLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container not-found">
      <p className="eyebrow">404 / A DIFFERENT ADDRESS</p>
      <h1>
        Let’s get you
        <br />
        <em>back home.</em>
      </h1>
      <p>
        We couldn’t find that page. Explore our communities to find your way.
      </p>
      <TextLink href="/projects">Explore our projects</TextLink>
    </section>
  );
}
