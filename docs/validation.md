# Validation

## Platform upgrade — 13 September 2026

### Still required from SLN

Nothing below is invented in the meantime; each has a modelled field and a
designed empty state, so supplying it is a data change.

| Needed | Blocks |
| --- | --- |
| Stage for each project (completed / ongoing / upcoming) | `/projects/completed\|ongoing\|upcoming` listings |
| Pricing per project and configuration | EMI seeding, price display |
| Floor plans | Floor-plan viewer |
| Interior / amenity / lifestyle photography | Gallery categories, image-led amenities |
| Connectivity distances (measured) | Connectivity section |
| RERA certificates (numbers held for Nidhi Aura only) | Certificate download |
| 3D (GLB/GLTF) or 360 panorama assets | Model/panorama viewers |
| Testimonials (from Google reviews) | Homepage testimonials |
| WhatsApp number confirmation | Floating WhatsApp CTA |
| GTM container ID | Analytics reporting |
| Office photos, founder message, company statistics | Contact and About |
| Job openings | Careers listings |
| Journal articles | Blog |
| Database and authentication decision | Lead persistence, admin |

### Production configuration still required

- **Lead storage.** `src/lib/leads/repository.ts` defines the boundary;
  `getRepository()` returns null, so `recordLead` reports `persisted: false`
  and the enquiry route continues to depend on the external webhook exactly as
  before. Implement `LeadRepository`, register it, index `fingerprint`, and set
  retention and access controls.
- **`LEAD_DUPLICATE_RULE`** — `phone`, `email`, `phone_and_project` (default) or
  `email_and_project`. Confirm which matches SLN's sales process.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — the CTA renders nothing until set.
- **`NEXT_PUBLIC_GTM_ID`** — the container is not loaded until set; `track()`
  calls queue to `window.dataLayer` regardless.
- Both `NEXT_PUBLIC_*` values are **inlined at build time**, not read at
  runtime. Setting them on the process that runs `next start` has no effect —
  they must be present for `next build`. Verified by observing the WhatsApp CTA
  stay hidden when the variable was supplied only at start, then render once the
  build carried it.
- **`ENQUIRY_WEBHOOK_URL` / `ENQUIRY_WEBHOOK_SECRET`** — unchanged.



### Phase 1 — elevation crop (fixed)

**Symptom.** In the homepage `02 / ELEVATION` section the architecture looked
guillotined: no roofline, no ground, just a band of middle storey.

**Root cause.** The plate's width and height were set independently of the
picture. `.street-plate` was `width: 190vw; height: clamp(300px, 50vh, 600px)`,
which at 1280×860 measured **2433 × 430 px — an aspect of 5.656 : 1**. The
source, `aura-6.webp`, is **2400 × 1660 — 1.446 : 1**. With `object-fit: cover`
the image scaled to fill the width, standing 1683 px tall inside a 430 px box,
so **only 25.6% of its height survived** and `object-position: 50% 50%` took
that slice from the middle. GSAP, the pin, transforms and overflow were not
involved: the same crop occurs with scripting disabled. Mobile had the same
fault at 210vw × 42svh (≈37% discarded).

Underneath it was a content problem. The section's premise is a pan along a long
street elevation, but `aura-6` is a 3:2 view of a few villas, not a panorama.
Any honest aspect ratio makes one plate about a viewport wide, leaving nothing
to pan — which is why it had been stretched.

**Fix.** The track is now a sequence of elevations rather than one stretched
image. Each plate's width comes from `aspect-ratio`, set per plate from the
source file's own dimensions in the content layer, so `cover` has nothing left
to crop. Measured after the change at 1280×860: four plates at **0% cropped**,
pan distance 1291 px (previously 1216 px). The portrait Vogue view cuts in
narrow between the landscape plates, which gives the row its rhythm.

Fixing it exposed a second, pre-existing fault: the pinned section was 1090 px
tall in an 860 px viewport, so the annotations clipped and the progress rule was
never visible at all. `.street` is now exactly `100svh` with the plate strip
flexing to fill what is left after the heading, annotations and foot, and the
strip reserves the space its annotations hang into. Measured: section height
equals the viewport, 118 px clearance below the annotations, 77 px below the
foot. Below the pin breakpoint the section returns to `height: auto` and a
native horizontal scroller.

Verified visually at 1280×860 and 375×812 on the production build: full facades,
sky above the roofline, ground below, on both.

### Elevation pan on wide screens (fixed)

**Symptom.** On a wide desktop the elevation strip did not move when scrolled.

**Root cause.** Plate width derives from plate height, which derives from the
viewport height. On a wide, short viewport the plates shrink until the row
already fits, so `trackWidth − viewportWidth` collapses toward zero and the
pinned section animates nothing. Measured at 1536×730: pan distance 218px for a
full pinned section — effectively motionless. Wider or shorter still, it reaches
zero.

**Fix.** Three parts. A fifth plate (Palazzo) widens the track. The section's
own padding, margins and foot spacing are trimmed below 860px of height, which
hands that height back to the plates — at 1536×730 the plates went from 289px to
474px tall. And the strip is now a native horizontal scroller by default, with
`overflow: hidden` applied only while a pin is actually active, so the row can
always be scrolled by hand even where pinning is not worth it; the pin itself is
skipped below 240px of travel, and the progress rule hides with it.

Measured after, on fresh loads: 1280×860 → pan 3034px; 1536×730 → 2038px;
1920×620 → 953px. Section height equals the viewport at all three, annotations
and foot clear, and all five plates remain 0% cropped.

### Phase 2 — project data model

`MediaItem` (`src`/`width`/`height`/`alt`/`caption`) is now the shape of every
image in the content layer, so a frame can always be sized from the picture's
own proportions — the class of bug fixed in Phase 1 cannot recur silently.
Projects gained `imageWidth`/`imageHeight`, an optional `elevation` plate, and
`masterplan: string` became `masterPlan: MediaItem`. `ProjectStage`
(completed/ongoing/upcoming) and `featured` were added but deliberately left
unset — see "still required from SLN" below. `src/lib/projects.ts` holds the
selectors (`bySlug`, `byStage`, `featured`, `related`) so pages cannot drift
apart on what those mean.

Build, typecheck, lint, Playwright (9/9, Chromium) and axe all pass after both
phases.

## Redesign — 12 September 2026

The site was rebuilt visually and re-verified. The records below supersede the
11 September entry, which is kept at the end for reference; every figure in that
earlier section was measured against the previous design and no longer describes
this build.

### Build and functional checks

- Production build (Turbopack), strict TypeScript and ESLint pass.
- Playwright, Chromium: 9 of 9 tests pass. That covers all 12 content routes at
  1440, 1280, 1024, 768, 390 and 375 pixels with no horizontal overflow and no
  page JavaScript errors; city filters and project-to-enquiry context; the
  native dialog mobile menu including Tab containment, Escape and focus
  restoration; gallery keyboard browsing and focus return; enquiry validation,
  input preservation and the email-draft path; server-side origin, field, size,
  project, consent and honeypot rejection plus receiver success and failure; and
  sitemap, legacy redirects, real image bytes and unknown-project 404s.
- Automated axe WCAG A/AA checks pass on the five main page types at desktop and
  mobile sizes. Two violations introduced by the redesign were found and fixed:
  insufficient contrast on the secondary text scale, and a horizontally
  scrollable region that could not be reached from the keyboard.
- Direct-delivery tests intercept requests or mock the receiver. No enquiries
  were sent to SLN Infra.

Only Chromium was exercised in this session; Firefox and WebKit binaries could
not be installed on this machine. The previous entry's Firefox, Edge and WebKit
results describe the earlier design and should not be read as coverage of this
one. Re-run `npm test` with all projects before publication.

### Motion, WebGL and progressive enhancement

Verified in a production build in a real browser:

- `three` is absent from the initial bundle. The chunk containing the renderer
  is not referenced by the homepage HTML and is fetched only when the night
  section is approached on a widescreen pointer device.
- At 375px no WebGL canvas is created, no custom cursor is enabled, the project
  index's floating plate is never mounted, and the streetscape is a native
  horizontal scroller rather than a pinned pan.
- With `prefers-reduced-motion: reduce` — the mode the whole Playwright suite
  runs in — Lenis, the cursor, the pins and every scroll sequence are disabled
  and all content renders in its finished state.
- `.reveal-text` is hidden only inside `@media (scripting: enabled)`, so the
  served HTML is readable without JavaScript.

### Mobile Lighthouse

Measured on the production homepage at `http://localhost:3120`, Lighthouse
13.4.1, simulated mobile throttling, using system Chrome.

| Category | Score |
| --- | --- |
| Performance | 87 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Result |
| --- | --- |
| First contentful paint | 0.8 s |
| Largest contentful paint | 4.1 s |
| Total blocking time | 70 ms |
| Cumulative layout shift | 0 |
| Speed index | 2.5 s |

Total transferred on the mobile homepage: approximately 652 KB.

Three regressions found by the first measurement and fixed:

1. The footer wordmark is filled with the night aerial via `background-clip`. It
   was pointing at the full 388 KB plate, which downloaded on every page and on
   every device and competed with the hero for bandwidth. It now uses
   `sln-villas-mark.webp`, a 560px crop of 36 KB.
2. The hero uses `<picture>` art direction. `preload` on the `next/image` inside
   it emits a preload link that cannot carry the `<source>` media condition, so
   phones downloaded the landscape crop they would never paint in addition to
   the portrait one. Replaced with `loading="eager"` and `fetchPriority="high"`,
   as the Next.js 16 image documentation recommends.
3. The streetscape plate requested a 1920px source on phones for a decorative
   panorama; its `sizes` now resolves to 1080px there.

Together these took performance from 83 to 87, total blocking time from 120 ms
to 70 ms and the transferred payload from roughly 1,040 KB to 652 KB.

Largest contentful paint is 4.1 s against 3.9 s recorded for the previous, much
lighter design; blocking time improved over the same comparison (160 ms to
70 ms) and layout shift remains zero. Lighthouse again warned that this
machine's CPU is slower than expected. These are local lab results under
simulated throttling, not production field metrics. Re-measure LCP, caching and
font delivery on the deployed domain; field INP requires live traffic.
Accessibility scores do not establish complete WCAG conformance.

Reproduce against a running production server:

```sh
CHROME_PATH=/path/to/google-chrome npx lighthouse@13.4.1 http://localhost:3120 --chrome-flags="--headless" --output=html --output-path=lighthouse.html
```

### Visual review

Reviewed in a real browser against the production build at 1280×860 and
375×812: homepage through every section, portfolio, Nidhi Aura detail, about and
contact. The hero entrance and its pinned exit, the project index hover
choreography, the night shader, the clay field expansion and the in-page scroll
cue were each exercised directly.

Two limitations to note. The embedded browser used for review could not reliably
capture screenshots while a section was pinned (`position: fixed`); those states
were verified from the live DOM geometry and computed styles instead, and from
the captures that did succeed. A final check on real Safari/iOS hardware and on
a physical Android device remains outstanding.

### Fixed during review

- The supplied logo is white artwork on transparency. The header now knocks it
  back to ink on every light ground and leaves it alone over the dark heroes.
- A scrubbed exit timeline shared targets with the hero's entrance timeline;
  because a scrubbed tween renders its start values as soon as it is built, the
  entrance was frozen at its first frame. Scrubbed timelines now animate
  containers of animated elements, never the same elements.
- `scroll-behavior: smooth` on the root element fought Lenis's per-frame scroll
  writes, so in-page anchors intermittently went nowhere. Removed; smooth anchor
  travel is Lenis's job, and an instant jump is correct when Lenis is off.
- A section grid was inherited by a following block that was not meant to be in
  it, collapsing the statistics row to 16px columns.
- `max-width` in `ch` on a wrapper measured against the body size, crushing the
  display type sharing that column.
- Line masks sheared the descenders off the display faces, which are set tighter
  than their glyph boxes.
- The condensing logo and the menu-trigger hover animated `width`. Both now
  express the same movement as `transform: scale`, so neither triggers layout.
  The header bar's own `padding` transition is kept: it is the condensation
  itself, it fires once per threshold crossing rather than per frame, and its
  layout is contained to a fixed element with six children.

## Superseded — 11 September 2026

The measurements below describe the previous design.

### Build and functional checks

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

### Mobile Lighthouse

Measured on the production homepage at `http://localhost:3120`, Lighthouse 13.4.1, simulated mobile throttling, with parallel browser tests stopped.

| Category | Score |
| --- | --- |
| Performance | 85 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

| Metric | Result |
| --- | --- |
| First contentful paint | 0.8 s |
| Largest contentful paint | 3.9 s |
| Total blocking time | 160 ms |
| Cumulative layout shift | 0 |

The mobile hero uses a portrait crop of the original asset: approximately 123 KB transferred in the measured mobile viewport instead of 367 KB for the earlier landscape request.

## Before publication

The site is built locally and has not been published. Confirm the production hostname and TLS certificate, the source-content gaps in `discovery.md`, and the company privacy/disclaimer copy. For direct enquiries, configure an authenticated durable receiver and edge rate limiting, then perform an authorized end-to-end delivery check. The email-draft workflow works without a receiver.

Run the full browser matrix (`npm test`) once Firefox and WebKit are installable
on the build machine. WebKit is a Safari-engine test, not a real Safari/iPhone
device: a final check on actual Safari/iOS hardware remains. The website
contains no video or audio dependency.
