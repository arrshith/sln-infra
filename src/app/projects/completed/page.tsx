import { ContactCTA } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { ProjectListing } from "@/components/project/project-listing";
import { byStage } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Completed communities",
  "Villa communities SLN Infra has delivered in Bengaluru and Hyderabad.",
  "/projects/completed",
);

export default function CompletedProjectsPage() {
  return (
    <>
      <Masthead
        index="01"
        section="Completed communities"
        title={
          <>
            Built, handed over,
            <br />
            <em>lived in.</em>
          </>
        }
        lede={<>Communities that have made the whole journey from drawing to doorstep.</>}
      />
      <section className="portfolio-section" aria-label="Completed communities">
        <ProjectListing stage="completed" items={byStage("completed")} />
      </section>
      <ContactCTA />
    </>
  );
}
