import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // `next dev` refuses its scripts to any origin but localhost, so a phone on
  // the LAN got the HTML with no JavaScript: no menu, no popup. Dev-only.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/founder", destination: "/about#our-story", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      {
        source: "/properties-listing/:path*",
        destination: "/projects",
        permanent: true,
      },
      ...[
        [
          "sln-nidhi-palms-property-for-sale-in-budigere-cross-bangalore-1",
          "nidhi-palms",
        ],
        [
          "sln-sundaram-palms-property-for-sale-in-bonguloor-hyderabad-2",
          "sundaram-palms",
        ],
        ["sln-palazzo-property-for-sale-in-whitefield-bangalore-3", "palazzo"],
        ["sln-vogue-property-for-sale-in-varthur-bangalore-4", "vogue"],
        [
          "sln-nidhi-aura-property-for-sale-in-varthur-bangalore-5",
          "nidhi-aura",
        ],
      ].map(([source, slug]) => ({
        source: `/properties/${source}`,
        destination: `/projects/${slug}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
