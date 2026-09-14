import { ContactCTA } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { ProjectListing } from "@/components/project/project-listing";
import { byStage } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Upcoming communities",
  "Villa communities SLN Infra is preparing to launch in Bengaluru and Hyderabad.",
  "/projects/upcoming",
);

export default function UpcomingProjectsPage() {
  return (
    <>
      <Masthead
        index="01"
        section="Upcoming communities"
        title={
          <>
            Drawn, and
            <br />
            <em>almost here.</em>
          </>
        }
        lede={<>The next addresses. Register early to hear before they are announced.</>}
      />
      <section className="portfolio-section" aria-label="Upcoming communities">
        <ProjectListing stage="upcoming" items={byStage("upcoming")} />
      </section>
      <ContactCTA />
    </>
  );
}
