# Source discovery — 11 September 2026

## Business and domain

The requested `https://www.slninfra.in` was visited first. It serves a Rediff “Site Under Construction” page with a hostname certificate mismatch. It contains no usable business content.

The supplied build brief explicitly names `https://www.slninfra.com`. That site is live and was fetched directly, including navigation, metadata, images, contact, founder and accessible project pages. It describes a developer of nature-inspired villa communities in Bengaluru and Hyderabad. This rebuild uses that business, not the similarly named construction firm at `slninfra.co.in`.

The default new canonical is `.in`, following the user's latest message. Change `NEXT_PUBLIC_SITE_URL` before building if another production domain is intended. No DNS, live-site or hosting changes were made.

## Sources

| Page                                                                                                   | Findings                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Homepage](https://slninfra.com/)                                                                      | Six projects, original images, two cities, brand position, contact information and social links.                                                                               |
| [Founder / legacy](https://slninfra.com/founder)                                                       | Since 2018. Founder: Gowni Sridhar Goud. Quality, customer focus, transparency and future-ready communities. Its “founder” image depicts chess pieces, not a person; excluded. |
| [Contact](https://slninfra.com/contact-us)                                                             | `sales@slninfra.net`, displayed number `+91 80950 44474`, Ganesh Chambers office in Dodda Banaswadi.                                                                           |
| [Nidhi Aura](https://slninfra.com/properties/sln-nidhi-aura-property-for-sale-in-varthur-bangalore-5)  | 88 villas, 4.7 acres, 3/4-bedroom floor-plan options, amenities, gallery, master plan and published RERA identifier.                                                           |
| [Palazzo](https://www.slninfra.com/properties/sln-palazzo-property-for-sale-in-whitefield-bangalore-3) | 52 four-bedroom triplex villas, Whitefield, amenities, explicitly sold out.                                                                                                    |
| About, blog, city listings, Palms, Sundaram and Vogue details                                          | HTTP 500, including www retries. Clear homepage facts used instead.                                                                                                            |
| Code Name SLN                                                                                          | Homepage listing; malformed detail URL returns HTTP 500. Only homepage facts retained.                                                                                         |

An older site at `slninfra.net` links to `.com` but reports different project counts and contact information. It was consulted for context, not used to override the current `.com` source.

## Project inventory

| Project            | Place                            | Facts retained                                                                                      |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| SLN Nidhi Aura     | Varthur, Bengaluru               | 88 villas; 4.7 acres; 3/4 bedrooms; original gallery, master plan and published amenities.          |
| SLN Nidhi Palms    | Budigere Cross, Bengaluru        | 81 villas; 5 acres; 3/4 bedrooms; private gardens; smart-home provisions; Vaastu-compliant layouts. |
| SLN Sundaram Palms | Bongloor, Hyderabad              | 40 villas; 2 acres; 4 bedrooms; spacious layouts and premium finishes.                              |
| SLN Palazzo        | Whitefield, Bengaluru            | 52 triplex villas; 4 bedrooms; sold out; clubhouse, fitness, play, community hall and gardens.      |
| SLN Vogue          | Varthur, Bengaluru               | 58 villas; 3.7 acres; 4 bedrooms; 8,000 sq. ft. clubhouse.                                          |
| (Code Name) SLN    | Naganayakanakote, off Whitefield | 4/5 bedrooms; developer-supplied aerial concept visualisation.                                      |

The homepage's “06 communities” counts its six listings; it is not a delivery claim. “2018” comes from the legacy page. Availability is not inferred: other than Palazzo's explicit sold-out status, visitors are invited to enquire.

## Gaps and decisions

- Source telephone links sometimes dial `+91 97316 64718` while displaying `+91 80950 44474`. This site consistently uses the latter, also present in the source WhatsApp destination and footer.
- Palazzo's RERA field contains `X` placeholders: omitted. Aura's complete published identifier is retained with a regulator link; independent regulatory verification was not performed.
- Plot and floor area fields mix units, blanks, dashes and zeroes. Ambiguous areas and prices are omitted; clear total acreage and unit counts remain.
- Certification claims, on-time delivery, saved-tree statistics and testimonials were not evidenced with supporting documents. They are not presented as verified claims.
- Some source image filenames reference generated images. All project imagery is identified as visualisation rather than completed-site photography. No new AI or stock assets were introduced.
- No reliable blog, hiring or standalone sustainability programme content was available. No empty news, careers or sustainability pages were created.
- Founder identity comes from the legacy page; no portrait, quote or extra biography was invented.
- The legal pages describe this implementation and are draft website copy. The company should review them before publication; unprovided company-wide retention policies were not invented.

## Existing site and new architecture

The current site uses server-rendered HTML, Bootstrap, jQuery, Swiper and Slick, with duplicated script imports and desktop/mobile markup. Fonts include Lufga, Chronicle, Butler and Katibeh. Gold decoration, repeated cards, carousels, sticky enquiry controls and modal forms dominate; several images wait for interaction before loading. Google advertising tags are included.

The rebuild retains the architectural logo and real project assets, using ivory and olive, Instrument Serif and Manrope, generous editorial layouts and native dialogs. CSS handles motion without an animation library. No advertising scripts, CMS or stock-photo dependency were added.

Routes cover home, projects, six static project details, about, contact, privacy, disclaimer, 404 and error states. Structured facts live in `src/lib/content.ts`. Images are converted to WebP and capped at 2400 × 1800; `docs/assets.json` records their source URLs. The supplied logo is also used for favicons. Fonts are self-hosted with licenses.

No connection to the old forms, CRM or admin panel was attempted. No enquiries were sent to the business. The contact form provides an explicit email-draft workflow plus an optional authenticated server webhook; the README describes activation and delivery requirements.
