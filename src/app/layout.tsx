import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/ui";
import { Cursor } from "@/components/cursor";
import { PageTransition } from "@/components/page-transition";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { WhatsAppCta } from "@/components/whatsapp";
import { EnquiryPopup } from "@/components/enquiry-popup";
import { Analytics } from "@/components/analytics";
import { company } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";
import "./globals.css";

const sans = localFont({
  src: "../../public/fonts/manrope.woff2",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
});
const serif = localFont({
  src: [
    {
      path: "../../public/fonts/instrument-serif.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/instrument-serif-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SLN Infra | Thoughtfully built. Naturally yours.",
    template: "%s | SLN Infra",
  },
  description:
    "Discover nature-inspired villa communities by SLN Infra in Bengaluru and Hyderabad. Thoughtful architecture, green surroundings and space to belong.",
  applicationName: "SLN Infra",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.webp`,
    foundingDate: "2018",
    telephone: "+918095044474",
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "6, 2nd floor, Ganesh Chambers, Vijaya Bank Colony, Dodda Banaswadi",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560043",
      addressCountry: "IN",
    },
    sameAs: company.socials.map((s) => s.url),
  };
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`}>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Navigation />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <PageTransition />
        <Cursor />
        <WhatsAppCta />
        <EnquiryPopup
          deliveryEnabled={Boolean(
            process.env.ENQUIRY_WEBHOOK_URL &&
            process.env.ENQUIRY_WEBHOOK_SECRET,
          )}
        />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
