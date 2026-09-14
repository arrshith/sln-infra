import { ContactCTA } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { ProjectListing } from "@/components/project/project-listing";
import { projects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Our villa communities",
  "Explore SLN Infra’s villa communities in Bengaluru and Hyderabad. Discover Nidhi Aura, Nidhi Palms, Sundaram Palms, Palazzo, Vogue and Code Name SLN.",
  "/projects",
);

export default function ProjectsPage() {
  return (
    <>
      <Masthead
        index="01"
        section="Portfolio"
        title={
          <>
            Different places.
            <br />
            The same <em>feeling.</em>
          </>
        }
        lede={
          <>
            Places with a sense of purpose. Homes with a sense of belonging.
            Find the community that feels like you.
          </>
        }
      />
      <section className="portfolio-section" aria-label="Project portfolio">
        <ProjectListing items={projects} />
        <p className="image-disclaimer">
          Project imagery includes architectural visualisations. Contact our team
          for current availability and specifications.
        </p>
      </section>
      <ContactCTA />
    </>
  );
}
