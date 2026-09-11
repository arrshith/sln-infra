import { company } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Privacy notice",
  "How this website handles information you choose to share with SLN Infra.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">YOUR INFORMATION</p>
      <h1>
        Privacy <em>notice.</em>
      </h1>
      <p>
        This notice describes the information handled by this website when you
        explore our communities or make an enquiry.
      </p>
      <h2>Information you choose to share</h2>
      <p>
        The enquiry form asks for your name, phone number and email address,
        with an optional project preference and message. These details are
        intended to help SLN Infra respond to your enquiry. Please do not
        include sensitive personal information in your message.
      </p>
      <h2>How your enquiry is sent</h2>
      <p>
        When the form offers to prepare an enquiry, your information stays in
        the form until you open an email draft. Your email application handles
        sending the message. If direct submission is enabled, your details are
        sent to SLN Infra’s configured enquiry service. The form only confirms
        receipt after that service accepts the enquiry.
      </p>
      <h2>Website services</h2>
      <p>
        This website does not set advertising cookies or include advertising
        trackers. The hosting provider may process technical request information
        to deliver and secure the site. The contact page embeds Google Maps,
        which receives technical information when the map loads. External social
        platforms and your email provider have their own privacy practices.
      </p>
      <h2>Contact about your information</h2>
      <p>
        For questions about information you have shared, or to request a
        correction or deletion, contact{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>. Our office is
        at {company.address}.
      </p>
    </article>
  );
}
