# Validation — 11 September 2026

## Build and functional checks

- Production build, strict TypeScript, ESLint and whitespace checks pass.
- All 12 content routes were checked at 1440, 1280, 1024, 768, 390 and 375 pixels. No horizontal overflow was found.
- Google Chrome 152.0.7977.64, Firefox 155, Microsoft Edge 153.0.4234.32 and WebKit 26.6 were exercised. Bundled Chromium 153 also passed the initial suite.
- City filters, project-to-enquiry context, native dialog keyboard navigation, Escape and focus restoration, gallery controls, form validation, email draft generation, loading, failure and successful submission states pass.
- Direct-delivery tests intercept requests or mock the receiver. No enquiries were sent to SLN Infra.
- Server checks cover origin rejection, malformed fields, size limits, unknown projects, consent, honeypot, missing configuration and receiver success/failure.
- Sitemap, robots, project assets, canonical metadata, legacy redirects and unknown-project 404 responses pass.
- Automated axe WCAG A/AA checks found no violations in the five main page types at desktop and mobile sizes across the tested engines.
- Production visual review covered home, portfolio, about, Nidhi Aura detail and contact. Every image decoded successfully and no page JavaScript errors occurred.
- Without JavaScript, the contact form is hidden and direct contact links remain available. The form uses POST to prevent an unhydrated form from placing personal information in a query string.

The route-matrix check waits for network idle between full page navigations: rapid forced navigations caused WebKit to report cancelled Next.js prefetch requests as access-control errors. The settled-navigation check passes without suppressing page errors.

## Mobile Lighthouse

Measured on the production homepage at `http://localhost:3120`, Lighthouse 13.4.1, simulated mobile throttling, with parallel browser tests stopped.

| Category | Score |
| --- | --- |
| Performance | 85 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Result |
| --- | --- |
| First contentful paint | 0.8 s |
| Largest contentful paint | 3.9 s |
| Total blocking time | 160 ms |
| Cumulative layout shift | 0 |

The mobile hero now uses a portrait crop of the original asset: approximately 123 KB transferred in the measured mobile viewport instead of 367 KB for the earlier landscape request. Above-the-fold headline animation was removed to avoid delaying first paint; below-the-fold reveals and native media motion remain.

The performance score is below the 90+ target. Lighthouse warned that this machine's CPU was slower than expected. These are local lab results, not production field metrics or a guarantee of scores on another host. Recheck LCP, caching and font delivery on the deployed domain; field INP requires live traffic. Accessibility scores do not establish complete WCAG conformance.

Reproduce against a running production server:

```sh
CHROME_PATH=/path/to/google-chrome npx lighthouse@13.4.1 http://localhost:3120 --chrome-flags="--headless" --output=html --output-path=lighthouse.html
```

## Before publication

The site is built locally and has not been published. Confirm the production hostname and TLS certificate, the source-content gaps in `discovery.md`, and the company privacy/disclaimer copy. For direct enquiries, configure an authenticated durable receiver and edge rate limiting, then perform an authorized end-to-end delivery check. The email-draft workflow works without a receiver.

WebKit is a Safari-engine test, not a real Safari/iPhone device. A final check on actual Safari/iOS hardware remains. Optional media codec libraries were absent in this Linux environment; WebKit was tested with temporary runtime libraries. The website contains no video or audio dependency.
