export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export type Experience = {
  slug: string;
  name: string;
  type: string;
  location: string;
  image: string;
  description: string;
  activities: string[];
  relatedDestinations: string[];
};

export const experiences: Experience[] = [
  {
    slug: slugify("Halong Bay Cruise"),
    name: "Halong Bay Cruise",
    type: "Day tour",
    location: "Halong Bay, Vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
    description:
      "Sail through emerald waters dotted with thousands of limestone karsts on an unforgettable cruise through one of Asia's most iconic UNESCO sites.",
    activities: ["Kayaking through caves", "Sunset deck dinner", "Floating village visit", "Pearl farm tour"],
    relatedDestinations: ["Hanoi", "Da Nang"],
  },
  {
    slug: slugify("Street Food Walking Tour"),
    name: "Street Food Walking Tour",
    type: "Local experience",
    location: "Bangkok, Thailand",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    description:
      "Taste your way through bustling night markets with a local guide who knows every legendary stall, hidden alley, and family recipe.",
    activities: ["Pad Thai tasting", "Mango sticky rice stop", "Local market tour", "Thai tea workshop"],
    relatedDestinations: ["Bangkok", "Chiang Mai"],
  },
  {
    slug: slugify("Sunset Sailing"),
    name: "Sunset Sailing",
    type: "Adventure",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
    description:
      "Glide along the caldera aboard a private catamaran as the Aegean sun melts behind whitewashed cliffs.",
    activities: ["Caldera swim stop", "Onboard BBQ dinner", "Red Beach visit", "Champagne sunset toast"],
    relatedDestinations: ["Santorini", "Mykonos"],
  },
  {
    slug: slugify("Cooking Class"),
    name: "Cooking Class",
    type: "Culture",
    location: "Hoi An, Vietnam",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    description:
      "Shop at a riverside market, then learn to cook five authentic Vietnamese dishes in a traditional garden kitchen.",
    activities: ["Market shopping tour", "Hands-on cooking", "Herb garden visit", "Family-style dinner"],
    relatedDestinations: ["Hoi An", "Da Nang"],
  },
];

export type Guide = {
  slug: string;
  title: string;
  category: string;
  read: string;
  image: string;
  intro: string;
  tips: string[];
  recommendedPlaces: string[];
  notes: string[];
};

export const guides: Guide[] = [
  {
    slug: slugify("10 hidden gems in Vietnam you must visit"),
    title: "10 hidden gems in Vietnam you must visit",
    category: "Destination guide",
    read: "5 min read",
    image: "https://images.unsplash.com/photo-1509923936021-c9bf38940dd2?w=1600&q=80",
    intro:
      "Beyond Hanoi and Ho Chi Minh City, Vietnam hides quiet bays, mountain villages, and timeless fishing towns. Here's where to go off-script.",
    tips: [
      "Travel mid-week to skip local tourist crowds",
      "Carry small VND notes for street vendors",
      "Download offline maps before rural trips",
      "Rent a scooter only with an international permit",
    ],
    recommendedPlaces: ["Ha Giang Loop", "Phong Nha caves", "Con Dao Islands", "Mu Cang Chai rice terraces"],
    notes: [
      "Best season: October – April for the north",
      "Currency: Vietnamese Dong (VND)",
      "Visa: e-visa available for most nationalities",
    ],
  },
  {
    slug: slugify("How to pack smart for a 2-week trip"),
    title: "How to pack smart for a 2-week trip",
    category: "Travel tips",
    read: "4 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80",
    intro:
      "Two weeks, one carry-on, zero stress. A capsule wardrobe and a few smart tools are all you really need.",
    tips: [
      "Roll clothes instead of folding",
      "Use packing cubes to stay organized",
      "Pack one outfit in your carry-on",
      "Bring a universal travel adapter",
    ],
    recommendedPlaces: ["Anywhere — these tips travel with you"],
    notes: [
      "Aim for ≤ 8kg cabin baggage",
      "Wear your heaviest shoes on the plane",
      "Leave 20% empty for souvenirs",
    ],
  },
  {
    slug: slugify("Best street food cities in Southeast Asia"),
    title: "Best street food cities in Southeast Asia",
    category: "Food & culture",
    read: "6 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    intro:
      "From smoky satay grills to slurp-worthy noodle stalls, these cities turn the sidewalk into a Michelin-grade dining room.",
    tips: [
      "Eat where the locals queue",
      "Carry hand sanitizer and tissues",
      "Try regional specialties first",
      "Go hungry — pace yourself across stalls",
    ],
    recommendedPlaces: ["Bangkok", "Penang", "Hanoi", "Ho Chi Minh City", "Jakarta"],
    notes: [
      "Cash is king at street stalls",
      "Most markets are best after sunset",
      "Spice levels are real — ask for 'mai phet' in Thailand",
    ],
  },
];
