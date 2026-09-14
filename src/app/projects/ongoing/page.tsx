import { ContactCTA } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { ProjectListing } from "@/components/project/project-listing";
import { byStage } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Ongoing communities",
  "Villa communities SLN Infra currently has under construction in Bengaluru and Hyderabad.",
  "/projects/ongoing",
);

export default function OngoingProjectsPage() {
  return (
    <>
      <Masthead
        index="01"
        section="Ongoing communities"
        title={
          <>
            Under way
            <br />
            <em>right now.</em>
          </>
        }
        lede={<>Communities taking shape on site today. Come and watch them rise.</>}
      />
      <section className="portfolio-section" aria-label="Ongoing communities">
        <ProjectListing stage="ongoing" items={byStage("ongoing")} />
      </section>
      <ContactCTA />
    </>
  );
}
