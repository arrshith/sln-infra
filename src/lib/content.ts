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

export type Project = {
  slug: string;
  name: string;
  city: "Bengaluru" | "Hyderabad";
  location: string;
  category: string;
  status: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  facts: { label: string; value: string }[];
  amenities: string[];
  gallery: { src: string; alt: string; caption: string }[];
  source: string;
  rera?: string;
  masterplan?: string;
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
    imageAlt:
      "Architectural visualisation of SLN Nidhi Aura, with a contemporary villa framed by palms and gardens",
    facts: [
      { label: "Community", value: "88 villas" },
      { label: "Land area", value: "4.7 acres" },
      { label: "Homes", value: "3 & 4 bedrooms" },
      { label: "Location", value: "Varthur, Bengaluru" },
    ],
    amenities: [
      "Swimming pool",
      "Clubhouse",
      "Fitness centre",
      "Yoga lawn",
      "Children’s play area",
      "Jogging track",
      "Landscaped gardens",
      "Multipurpose play courts",
      "Community hall",
      "24-hour security",
    ],
    gallery: [
      {
        src: "/images/aura-6.webp",
        alt: "Visualisation of the Nidhi Aura villa streetscape and landscaped front gardens",
        caption: "A considered streetscape",
      },
      {
        src: "/images/aura-5.webp",
        alt: "Visualisation of the Nidhi Aura villa facade, balconies and garden",
        caption: "Room for light and greenery",
      },
    ],
    source:
      "https://slninfra.com/properties/sln-nidhi-aura-property-for-sale-in-varthur-bangalore-5",
    rera: "PRM/KA/RERA/1250/304/PR/060825/007973",
    masterplan: "/images/aura-4.webp",
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
    imageAlt:
      "Architectural visualisation of an SLN Nidhi Palms villa with a stone facade, planted balconies and a flowering tree",
    facts: [
      { label: "Community", value: "81 villas" },
      { label: "Land area", value: "5 acres" },
      { label: "Homes", value: "3 & 4 bedrooms" },
      { label: "Location", value: "Budigere Cross, Bengaluru" },
    ],
    amenities: [
      "Private gardens",
      "Smart-home provisions",
      "Vaastu-compliant layouts",
      "Branded fittings and fixtures",
    ],
    gallery: [],
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
    imageAlt:
      "Architectural visualisation of an SLN Sundaram Palms villa with a textured stone facade and generous balconies",
    facts: [
      { label: "Community", value: "40 villas" },
      { label: "Land area", value: "2 acres" },
      { label: "Homes", value: "4 bedrooms" },
      { label: "Location", value: "Bongloor, Hyderabad" },
    ],
    amenities: [
      "Spacious layouts",
      "Premium finishes",
      "Branded specifications",
      "Green surroundings",
    ],
    gallery: [],
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
    imageAlt:
      "Architectural visualisation of SLN Palazzo triplex villas with planted terraces and stone and timber finishes",
    facts: [
      { label: "Community", value: "52 villas" },
      { label: "Homes", value: "4 bedroom triplex" },
      { label: "Location", value: "Whitefield, Bengaluru" },
      { label: "Availability", value: "Sold out" },
    ],
    amenities: [
      "Clubhouse",
      "Fitness centre",
      "Children’s play area",
      "Community hall",
      "Landscaped gardens",
    ],
    gallery: [],
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
    imageAlt:
      "Developer-supplied visualisation of a contemporary SLN Vogue villa at dusk",
    facts: [
      { label: "Community", value: "58 villas" },
      { label: "Land area", value: "3.7 acres" },
      { label: "Homes", value: "4 bedrooms" },
      { label: "Clubhouse", value: "8,000 sq. ft." },
    ],
    amenities: [
      "Clubhouse",
      "Fitness spaces",
      "Leisure and gathering spaces",
      "Gated community",
    ],
    gallery: [],
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
    facts: [
      { label: "Homes", value: "4 & 5 bedrooms" },
      { label: "Location", value: "Naganayakanakote, Bengaluru" },
    ],
    amenities: [],
    gallery: [],
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
