# SLN Infra

A Next.js website for SLN Infra’s villa communities in Bengaluru and Hyderabad, using TypeScript, React, Tailwind, local fonts and original developer imagery.

## Local setup

Node.js 22+ and npm:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. For production:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Content and source material

- `src/lib/content.ts`: project facts, company details and shared copy.
- `src/app/globals.css`: design tokens, layouts and motion.
- `public/images`: optimized original assets.
- `public/fonts`: local WOFF2 fonts and licenses.
- `docs/discovery.md`: research, factual inventory and unresolved source content.
- `docs/assets.json`: original URL for each retained image.
- `docs/validation.md`: browser coverage, measured Lighthouse scores and launch limitations.

Routes: `/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`, `/privacy`, `/disclaimer`. Legacy about/contact/project URLs redirect to the corresponding pages.

The requested `.in` domain contains only an under-construction page. The `.com` site named in the brief supplied the business content. New canonicals default to `.in`; configure the actual production domain before building.

## Enquiries

Without credentials, the form validates input and prepares a real email draft to SLN Infra. It clearly states that the enquiry has **not** been sent and requires the visitor to open and send it from their email application. Phone and email links remain available.

To enable direct submission, set both server-only variables:

```dotenv
ENQUIRY_WEBHOOK_URL=https://your-service.example/enquiries
ENQUIRY_WEBHOOK_SECRET=your-secret
```

The receiver gets JSON using `Authorization: Bearer <secret>`:

```json
{
  "name": "Visitor name",
  "phone": "+91 …",
  "email": "visitor@example.com",
  "project": "nidhi-aura",
  "message": "Optional message",
  "consent": true,
  "website": "",
  "receivedAt": "ISO timestamp",
  "source": "sln-infra-website"
}
```

The project may be empty. The receiver must durably store the enquiry before returning 2xx. Failures preserve the form's input and display an error with direct contact options. The route logs no personal data, rejects redirects and times out after 8 seconds. Use HTTPS in production.

The route enforces same-origin requests, JSON content type, a 16 KiB size cap, field validation, project allowlisting, consent and a honeypot. Configure edge rate limiting for `/api/enquiry` and retention/access controls in the receiving service when enabling delivery. Reverse proxies must preserve the public host and scheme. Network failures can make delivery ambiguous; check the receiving service before retrying where necessary.

## Deployment

1. Deploy to a Node.js host that supports Next.js, or a compatible managed platform.
2. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin before building. Optionally set the enquiry webhook credentials.
3. Build with `npm ci` and `npm run build`; serve with `npm start`. `PORT` is supported. Use an HTTPS reverse proxy for self-managed hosting.
4. Verify domain ownership and TLS: the current `.in` site has a certificate mismatch. Review the content gaps and company legal copy described in discovery.
5. If direct delivery is enabled, perform an authorized test against the actual receiver. Automated checks use mocks and never send business enquiries.

This is a server deployment, not a static export: contact, enquiries and image optimization use Next.js. Informational and project pages are prerendered. The site includes canonicals, social metadata, sitemap, robots, organization schema and project breadcrumbs.

## Checks

```sh
npx playwright install chromium firefox webkit
# Minimal Linux machines also need Playwright's documented browser dependencies.
npm run build
npm test
```

Tests start production servers on ports 3100 and 3101. The second uses an invalid test-only webhook URL; browser tests intercept delivery and send nothing externally. They cover all 12 content routes at 1440, 1280, 1024, 768, 390 and 375 pixels, filtering, project intent, keyboard menus and gallery, enquiry states, server validation, delivery outcomes, SEO, assets, redirects and automated WCAG A/AA checks. Leave delivery credentials unset for the browser fallback tests. Server delivery tests mock the receiver.

Optional tests using installed Chrome or Edge:

```sh
CHROME_EXECUTABLE=/path/to/google-chrome npm test -- --project=chromium
EDGE_EXECUTABLE=/path/to/msedge npm test -- --project=edge
```

WebKit tests exercise Safari's engine but do not replace a real Safari/iOS device check. Automated accessibility checks supplement keyboard and visual review. No Lighthouse score is claimed without a recorded measurement.
