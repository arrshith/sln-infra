import { ContactCTA } from "@/components/ui";
import { ProjectFilter } from "@/components/project-filter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Our villa communities",
  "Explore SLN Infra’s villa communities in Bengaluru and Hyderabad. Discover Nidhi Aura, Nidhi Palms, Sundaram Palms, Palazzo, Vogue and Code Name SLN.",
  "/projects",
);

export default function ProjectsPage() {
  return (
    <>
      <section className="page-intro container">
        <p className="eyebrow">OUR PORTFOLIO / BENGALURU & HYDERABAD</p>
        <div className="page-intro-grid">
          <h1>
            Different places.
            <br />
            The same <em>feeling.</em>
          </h1>
          <p>
            Places with a sense of purpose.
            <br />
            Homes with a sense of belonging.
            <br />
            Find the community that feels like you.
          </p>
        </div>
      </section>
      <section
        className="container portfolio-section"
        aria-label="Project portfolio"
      >
        <ProjectFilter />
        <p className="image-disclaimer">
          Project imagery includes architectural visualisations. Contact our
          team for current availability and specifications.
        </p>
      </section>
      <ContactCTA />
    </>
  );
}
