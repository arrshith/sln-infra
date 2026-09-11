import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Website disclaimer",
  "Information about SLN Infra project visualisations, specifications and availability.",
  "/disclaimer",
);

export default function DisclaimerPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">PROJECT INFORMATION</p>
      <h1>
        A note on
        <br />
        <em>the details.</em>
      </h1>
      <h2>Images and visualisations</h2>
      <p>
        Project images on this website include architectural and concept
        visualisations supplied by the developer. They illustrate the design
        intent and may include indicative landscaping, finishes, furnishings or
        surroundings. They should not be treated as photographs of completed
        work.
      </p>
      <h2>Specifications and availability</h2>
      <p>
        Project information is provided for general reference. Layouts,
        amenities, specifications and availability should be confirmed with the
        SLN Infra team using current project documents. A website enquiry or
        visit request does not constitute a booking or an offer of sale.
      </p>
      <h2>Registration and documents</h2>
      <p>
        Where a project registration number is displayed, consult the relevant
        regulator and the project’s current documents for the authoritative
        record. Ask our team for information that is not shown on the website.
      </p>
      <h2>Let’s clarify</h2>
      <p>
        If you have a question about a specific home or a detail that matters to
        you, <Link href="/contact">contact our team</Link> before making a
        decision.
      </p>
    </article>
  );
}
