import { ContactCTA, Arrow } from "@/components/ui";
import { Masthead } from "@/components/masthead";
import { EnquiryForm } from "@/components/enquiry-form";
import { company } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata(
  "Channel partners",
  "Work with SLN Infra. Register your firm to represent our villa communities in Bengaluru and Hyderabad.",
  "/channel-partners",
);

/**
 * Channel partners.
 *
 * The page exists so these enquiries arrive tagged as their own source rather
 * than mixed in with buyers — the lead pipeline files them under
 * `channel_partner`, which is what the eventual dashboard separates on.
 *
 * It deliberately makes no claims about commission, slabs, payout terms or
 * eligibility: none of that has been supplied, and inventing commercial terms
 * would be inventing a contract. What it says is only what is true — that SLN
 * works with partners, and that this is how to start the conversation.
 */
export default function ChannelPartnersPage() {
  return (
    <div className="contact-page">
      <Masthead
        index="01"
        section="Channel partners"
        title={
          <>
            Represent
            <br />
            <em>what we build.</em>
          </>
        }
        lede={
          <>
            We work with firms who know their buyers and take the same care with
            them that we take with the houses.
          </>
        }
      />

      <div className="contact-grid">
        <section className="contact-details" aria-label="Partnership contact">
          <div>
            <p className="label">How it starts</p>
            <p>
              Register your firm using the form. Our sales team confirms the
              details with you directly, including terms — those are agreed in
              conversation, not published here.
            </p>
          </div>
          <div>
            <p className="label">Prefer to call</p>
            <a className="contact-large-link" href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
          <div>
            <p className="label">Or write</p>
            <a className="contact-large-link" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <div>
            <p className="label">Looking for a home instead?</p>
            <a className="text-link" href="/contact">
              Talk to us about our communities <Arrow />
            </a>
          </div>
        </section>

        <noscript>
          <p>
            To register, please call{" "}
            <a href={company.phoneHref}>{company.phone}</a> or email{" "}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </noscript>

        <EnquiryForm
          initialProject=""
          visit={false}
          source="channel_partner"
          variant="channel_partner"
          deliveryEnabled={Boolean(
            process.env.ENQUIRY_WEBHOOK_URL && process.env.ENQUIRY_WEBHOOK_SECRET,
          )}
        />
      </div>

      <ContactCTA />
    </div>
  );
}
