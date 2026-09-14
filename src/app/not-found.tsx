import { TextLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="label muted">404 / A different address</p>
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
