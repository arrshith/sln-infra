export const company = {
  name: "SLN Infra",
  since: 2018,
  phone: "+91 80950 44474",
  phoneHref: "tel:+918095044474",
  email: "sales@slninfra.net",
  address:
    "6, 2nd floor, Ganesh Chambers, above City Union Bank, Vijaya Bank Colony, Dodda Banaswadi, Bengaluru, Karnataka 560043",
  map: "https://www.google.com/maps/search/?api=1&query=SLN+Infra+Builders+Dodda+Banaswadi+Bengaluru",
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/sln_infra_official" },
    { name: "YouTube", url: "https://www.youtube.com/@SLNInfra" },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/sln-infra-522006331/",
    },
  ],
};

/**
 * Every image in the content layer carries the dimensions of the file itself.
 * Layout can then size a frame from the picture's own proportions instead of
 * guessing at one — which is what previously chopped the roofline and the
 * ground off the elevation strip.
 */
export type MediaItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

/**
 * Where a community is in its life. SLN supplies this; it is deliberately
 * optional, because guessing that a sold-out project is "completed" — or that
 * one without a launch date is "upcoming" — would put invented facts in front
 * of buyers. Anything without a stage is simply not listed under one.
 */
export type ProjectStage = "completed" | "ongoing" | "upcoming";

export type Project = {
  slug: string;
  name: string;
  city: "Bengaluru" | "Hyderabad";
  location: string;
  category: string;
  /** The availability line shown to visitors, in SLN's own words. */
  status: string;
  /** The lifecycle stage the listing routes group by. Awaiting SLN. */
  stage?: ProjectStage;
  /** Surfaced ahead of the others on the homepage. Awaiting SLN. */
  featured?: boolean;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  /**
   * The view of this project that reads as a street elevation. Layouts that
   * place elevations side by side size each plate from these dimensions, so no
   * facade is ever cropped to fit a box it was never shot for.
   */
  elevation?: MediaItem;
  facts: { label: string; value: string }[];
  amenities: Amenity[];
  /**
   * Pictures grouped the way a buyer looks for them. Absent categories are
   * simply not offered — an empty "Interior" tab would promise photography
   * that does not exist.
   */
  galleries: GalleryCategory[];
  /** Homes available in this community, each with its own plan and figures. */
  configurations?: Configuration[];
  /** Starting price, in SLN's own words. Seeds the EMI calculator. */
  priceFrom?: Money;
  connectivity?: ConnectivityItem[];
  rera?: Rera;
  masterPlan?: MediaItem;
  /** Brochures, specification sheets, approvals. */
  documents?: DocumentRef[];
  /**
   * What an "explore" experience for this project can be built from. The viewer
   * takes the richest asset available and falls back through the list, so a real
   * model or panorama can be added later without touching the page.
   */
  immersive?: ImmersiveAsset[];
  seo?: Seo;
  source: string;
};

/** An amenity as SLN describes it. Only the title is ever required. */
export type Amenity = {
  title: string;
  description?: string;
  image?: MediaItem;
};

export type GalleryCategoryId =
  | "exterior"
  | "interior"
  | "amenities"
  | "lifestyle";

export type GalleryCategory = {
  id: GalleryCategoryId;
  label: string;
  items: MediaItem[];
};

/**
 * Money is the amount plus the words SLN uses for it, never a bare number we
 * might format into a claim they did not make. `display` always wins on screen;
 * `amount` exists only so the EMI calculator has somewhere to start.
 */
export type Money = {
  amount: number;
  display: string;
};

export type Configuration = {
  id: string;
  /** e.g. "4 BHK Triplex" */
  label: string;
  bedrooms?: number;
  builtUpArea?: string;
  plotArea?: string;
  priceFrom?: Money;
  floorPlan?: MediaItem;
  brochure?: DocumentRef;
};

export type DocumentRef = {
  label: string;
  href: string;
  kind: "pdf" | "image";
};

export type ConnectivityCategory =
  | "schools"
  | "hospitals"
  | "retail"
  | "transport"
  | "highways"
  | "business"
  | "other";

export type ConnectivityItem = {
  category: ConnectivityCategory;
  name: string;
  /** Kilometres, as measured and supplied by SLN. Never estimated here. */
  distanceKm?: number;
  travelTime?: string;
};

export type Rera = {
  number: string;
  authorityUrl?: string;
  certificate?: DocumentRef;
};

/**
 * The three kinds of immersive asset, richest first. Only `image` can be built
 * from what SLN has supplied so far; the other two are the extension points for
 * real assets, so adding them later is a data change rather than a rewrite.
 */
export type ImmersiveAsset =
  | {
      kind: "model";
      label: string;
      /** GLB/GLTF, Draco-compressed. */
      src: string;
      poster: MediaItem;
    }
  | {
      kind: "panorama";
      label: string;
      src: string;
      space: "interior" | "exterior";
      poster: MediaItem;
    }
  | {
      kind: "image";
      label: string;
      space: "interior" | "exterior";
      /** Drawn back to front, each layer moving at its own rate. */
      layers: MediaItem[];
    };

export type Seo = {
  title?: string;
  description?: string;
  focusKeyword?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

// Source inventory and unresolved fields: docs/discovery.md.
export const projects: Project[] = [
  {
    slug: "nidhi-aura",
    name: "SLN Nidhi Aura",
    city: "Bengaluru",
    location: "Varthur",
    category: "3 & 4 bedroom villas",
    status: "Enquire for availability",
    headline: "A quieter rhythm. A richer everyday.",
    description:
      "A community of 88 villas across 4.7 acres in Varthur. Contemporary architecture, landscaped gardens and spaces for recreation come together in homes designed around everyday life.",
    image: "/images/aura-5.webp",
    elevation: {
      src: "/images/aura-6.webp",
      width: 2400,
      height: 1660,
      alt: "Street elevation of SLN Nidhi Aura — a row of villas with stone-clad facades, planted forecourts and a shared street",
    },
    imageAlt:
      "Architectural visualisation of SLN Nidhi Aura, with a contemporary villa framed by palms and gardens",
    imageWidth: 2400,
    imageHeight: 1660,
    facts: [
      { label: "Community", value: "88 villas" },
      { label: "Land area", value: "4.7 acres" },
      { label: "Homes", value: "3 & 4 bedrooms" },
      { label: "Location", value: "Varthur, Bengaluru" },
    ],
    amenities: [
      { title: "Swimming pool" },
      { title: "Clubhouse" },
      { title: "Fitness centre" },
      { title: "Yoga lawn" },
      { title: "Children’s play area" },
      { title: "Jogging track" },
      { title: "Landscaped gardens" },
      { title: "Multipurpose play courts" },
      { title: "Community hall" },
      { title: "24-hour security" },
    ],
    galleries: [
      {
        id: "exterior",
        label: "Exterior",
        items: [
          {
            src: "/images/aura-6.webp",
            width: 2400,
            height: 1660,
            alt: "Visualisation of the Nidhi Aura villa streetscape and landscaped front gardens",
            caption: "A considered streetscape",
          },
          {
            src: "/images/aura-5.webp",
            width: 2400,
            height: 1660,
            alt: "Visualisation of the Nidhi Aura villa facade, balconies and garden",
            caption: "Room for light and greenery",
          },
        ],
      },
    ],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/aura-5.webp",
            width: 2400,
            height: 1660,
            alt: "Architectural visualisation of SLN Nidhi Aura, with a contemporary villa framed by palms and gardens",
          },
        ],
      },
      {
        kind: "image",
        label: "Streetscape",
        space: "exterior",
        layers: [
          {
            src: "/images/aura-6.webp",
            width: 2400,
            height: 1660,
            alt: "Street elevation of SLN Nidhi Aura — a row of villas with stone-clad facades, planted forecourts and a shared street",
          },
        ],
      },
    ],
    source:
      "https://slninfra.com/properties/sln-nidhi-aura-property-for-sale-in-varthur-bangalore-5",
    rera: {
      number: "PRM/KA/RERA/1250/304/PR/060825/007973",
      authorityUrl: "https://rera.karnataka.gov.in/",
    },
    masterPlan: {
      src: "/images/aura-4.webp",
      width: 1005,
      height: 705,
      alt: "SLN Nidhi Aura master plan showing villa plots, internal roads and shared spaces",
    },
  },
  {
    slug: "nidhi-palms",
    name: "SLN Nidhi Palms",
    city: "Bengaluru",
    location: "Budigere Cross",
    category: "3 & 4 bedroom villas",
    status: "Enquire for availability",
    headline: "Modern living, naturally at home.",
    description:
      "At Budigere Cross in East Bengaluru, 81 villas are set within a five-acre community. Private gardens, smart-home provisions and Vaastu-compliant plans bring a thoughtful balance of comfort, greenery and contemporary design.",
    image: "/images/nidhi-palms.webp",
    elevation: {
      src: "/images/nidhi-palms.webp",
      width: 2400,
      height: 1644,
      alt: "Street elevation of an SLN Nidhi Palms villa at dusk, its stone facade and planted balconies lit from within",
    },
    imageAlt:
      "Architectural visualisation of an SLN Nidhi Palms villa with a stone facade, planted balconies and a flowering tree",
    imageWidth: 2400,
    imageHeight: 1644,
    facts: [
      { label: "Community", value: "81 villas" },
      { label: "Land area", value: "5 acres" },
      { label: "Homes", value: "3 & 4 bedrooms" },
      { label: "Location", value: "Budigere Cross, Bengaluru" },
    ],
    amenities: [
      { title: "Private gardens" },
      { title: "Smart-home provisions" },
      { title: "Vaastu-compliant layouts" },
      { title: "Branded fittings and fixtures" },
    ],
    galleries: [],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/nidhi-palms.webp",
            width: 2400,
            height: 1644,
            alt: "Architectural visualisation of an SLN Nidhi Palms villa with a stone facade, planted balconies and a flowering tree",
          },
        ],
      },
      {
        kind: "image",
        label: "Streetscape",
        space: "exterior",
        layers: [
          {
            src: "/images/nidhi-palms.webp",
            width: 2400,
            height: 1644,
            alt: "Street elevation of an SLN Nidhi Palms villa at dusk, its stone facade and planted balconies lit from within",
          },
        ],
      },
    ],
    source: "https://slninfra.com/",
  },
  {
    slug: "sundaram-palms",
    name: "SLN Sundaram Palms",
    city: "Hyderabad",
    location: "Bongloor",
    category: "4 bedroom villas",
    status: "Enquire for availability",
    headline: "A little more space. A little closer together.",
    description:
      "A two-acre villa community for just 40 families in Bongloor, Hyderabad. Generous four-bedroom layouts, premium finishes and a green setting create space for both privacy and a sense of belonging.",
    image: "/images/sundaram-palms.webp",
    elevation: {
      src: "/images/sundaram-palms.webp",
      width: 2400,
      height: 1623,
      alt: "Street elevation of an SLN Sundaram Palms villa, its stone-clad upper floor framed by mature trees",
    },
    imageAlt:
      "Architectural visualisation of an SLN Sundaram Palms villa with a textured stone facade and generous balconies",
    imageWidth: 2400,
    imageHeight: 1623,
    facts: [
      { label: "Community", value: "40 villas" },
      { label: "Land area", value: "2 acres" },
      { label: "Homes", value: "4 bedrooms" },
      { label: "Location", value: "Bongloor, Hyderabad" },
    ],
    amenities: [
      { title: "Spacious layouts" },
      { title: "Premium finishes" },
      { title: "Branded specifications" },
      { title: "Green surroundings" },
    ],
    galleries: [],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/sundaram-palms.webp",
            width: 2400,
            height: 1623,
            alt: "Architectural visualisation of an SLN Sundaram Palms villa with a textured stone facade and generous balconies",
          },
        ],
      },
      {
        kind: "image",
        label: "Streetscape",
        space: "exterior",
        layers: [
          {
            src: "/images/sundaram-palms.webp",
            width: 2400,
            height: 1623,
            alt: "Street elevation of an SLN Sundaram Palms villa, its stone-clad upper floor framed by mature trees",
          },
        ],
      },
    ],
    source: "https://slninfra.com/",
  },
  {
    slug: "palazzo",
    name: "SLN Palazzo",
    city: "Bengaluru",
    location: "Whitefield",
    category: "4 bedroom triplex villas",
    status: "Sold out",
    headline: "Three levels of considered living.",
    description:
      "A community of 52 triplex villas in the Whitefield area. Expansive interiors and thoughtfully planned shared spaces bring together the convenience of the city and the comforts of villa living.",
    image: "/images/palazzo.webp",
    elevation: {
      src: "/images/palazzo.webp",
      width: 1280,
      height: 720,
      alt: "Street elevation of SLN Palazzo — triplex villas with planted terraces, stone and timber finishes",
    },
    imageAlt:
      "Architectural visualisation of SLN Palazzo triplex villas with planted terraces and stone and timber finishes",
    imageWidth: 1280,
    imageHeight: 720,
    facts: [
      { label: "Community", value: "52 villas" },
      { label: "Homes", value: "4 bedroom triplex" },
      { label: "Location", value: "Whitefield, Bengaluru" },
      { label: "Availability", value: "Sold out" },
    ],
    amenities: [
      { title: "Clubhouse" },
      { title: "Fitness centre" },
      { title: "Children’s play area" },
      { title: "Community hall" },
      { title: "Landscaped gardens" },
    ],
    galleries: [],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/palazzo.webp",
            width: 1280,
            height: 720,
            alt: "Architectural visualisation of SLN Palazzo triplex villas with planted terraces and stone and timber finishes",
          },
        ],
      },
    ],
    source:
      "https://www.slninfra.com/properties/sln-palazzo-property-for-sale-in-whitefield-bangalore-3",
  },
  {
    slug: "vogue",
    name: "SLN Vogue",
    city: "Bengaluru",
    location: "Varthur",
    category: "4 bedroom villas",
    status: "Enquire for availability",
    headline: "Everyday life, with a resort sensibility.",
    description:
      "Set across 3.7 acres in Varthur, SLN Vogue brings together 58 villas with spacious layouts and refined finishes. An 8,000 sq. ft. clubhouse anchors the community, with spaces for fitness, leisure and gathering.",
    image: "/images/vogue.webp",
    elevation: {
      src: "/images/vogue.webp",
      width: 1024,
      height: 1536,
      alt: "Street elevation of an SLN Vogue villa at dusk, with ochre columns, dark stone and warmly lit windows",
    },
    imageAlt:
      "Developer-supplied visualisation of a contemporary SLN Vogue villa at dusk",
    imageWidth: 1024,
    imageHeight: 1536,
    facts: [
      { label: "Community", value: "58 villas" },
      { label: "Land area", value: "3.7 acres" },
      { label: "Homes", value: "4 bedrooms" },
      { label: "Clubhouse", value: "8,000 sq. ft." },
    ],
    amenities: [
      { title: "Clubhouse" },
      { title: "Fitness spaces" },
      { title: "Leisure and gathering spaces" },
      { title: "Gated community" },
    ],
    galleries: [],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/vogue.webp",
            width: 1024,
            height: 1536,
            alt: "Developer-supplied visualisation of a contemporary SLN Vogue villa at dusk",
          },
        ],
      },
      {
        kind: "image",
        label: "Streetscape",
        space: "exterior",
        layers: [
          {
            src: "/images/vogue.webp",
            width: 1024,
            height: 1536,
            alt: "Street elevation of an SLN Vogue villa at dusk, with ochre columns, dark stone and warmly lit windows",
          },
        ],
      },
    ],
    source: "https://slninfra.com/",
  },
  {
    slug: "sln-villas",
    name: "(Code Name) SLN",
    city: "Bengaluru",
    location: "Naganayakanakote, off Whitefield",
    category: "4 & 5 bedroom villas",
    status: "Enquire for details",
    headline: "A new chapter, off Whitefield.",
    description:
      "A villa development in Naganayakanakote, off Whitefield, planned for modern living with connections to Bengaluru’s IT hubs and key city destinations. Speak with our team for the latest project information.",
    image: "/images/sln-villas.webp",
    imageAlt:
      "Developer-supplied aerial concept visualisation for the Code Name SLN villa development at night",
    imageWidth: 1535,
    imageHeight: 1024,
    facts: [
      { label: "Homes", value: "4 & 5 bedrooms" },
      { label: "Location", value: "Naganayakanakote, Bengaluru" },
    ],
    amenities: [],
    galleries: [],
    immersive: [
      {
        kind: "image",
        label: "Facade",
        space: "exterior",
        layers: [
          {
            src: "/images/sln-villas.webp",
            width: 1535,
            height: 1024,
            alt: "Developer-supplied aerial concept visualisation for the Code Name SLN villa development at night",
          },
        ],
      },
    ],
    source: "https://slninfra.com/",
  },
];

export const principles = [
  {
    title: "Thoughtful by design",
    text: "Spaces that make room for real life. From the way a home opens to its garden to the places a community comes together.",
  },
  {
    title: "Quality in the detail",
    text: "Careful planning, considered materials and skilled construction. The details you see, and the ones you live with.",
  },
  {
    title: "A connection to nature",
    text: "Green surroundings and outdoor spaces are part of the way we think about a home, from the very beginning.",
  },
];
