import blahImage from "./blah.jpg";

export type PosterFormat =
  | "image-feature"
  | "text-statement"
  | "image-grid"
  | "promo";

export type Event = {
  id: number;
  format: PosterFormat;
  acronym?: string;
  title?: string;
  description?: string;
  credit?: string;
  image?: string;
  tag?: string;
  venue?: string;
  date?: string;
  theme: "blue" | "orange" | "green" | "purple" | "yellow";
};

export const events: Event[] = [
  {
    id: 1,
    format: "image-feature",
    acronym: "AMPLFY",
    title: "ENZO",
    credit: "ROBIN CAMPILLO | A FILM BY LAURENT CANTET",
    image: blahImage,
    tag: "#PERTHSESSIONS",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "blue",
  },
  {
    id: 2,
    format: "text-statement",
    title: "IF ANYONE ASKS,\nTHIS IS WHERE I'LL BE IN JUNE",
    acronym: "AMPLFY",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "purple",
  },
  {
    id: 3,
    format: "promo",
    title: "CHECK OUT MY\nPERTH SESSIONS\nWATCHLIST",
    acronym: "AMPLFY",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "green",
  },
  {
    id: 4,
    format: "image-feature",
    acronym: "AMPLFY",
    title: "MIDNIGHT RAVES",
    credit: "FEATURING APHEX TWIN | FLYING LOTUS | FOUR TET",
    image: blahImage,
    tag: "#ELECTRONIC",
    venue: "PERTH SESSIONS",
    date: "10–20 JULY 2026",
    theme: "orange",
  },
  {
    id: 5,
    format: "image-feature",
    title: "INDIE NIGHTS",
    credit: "ARCADE FIRE | THE NATIONAL | PHOENIX",
    image: blahImage,
    tag: "#INDIE",
    venue: "PERTH SESSIONS",
    date: "15–25 AUGUST 2026",
    theme: "yellow",
  },
  {
    id: 6,
    format: "text-statement",
    title: "AMPLIFY YOUR\nMUSIC EXPERIENCE",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "blue",
  },
  {
    id: 7,
    format: "image-feature",
    acronym: "AMPLFY",
    title: "HIP HOP SUMMIT",
    credit: "KENDRICK LAMAR | J. COLE | TYLER THE CREATOR",
    image: blahImage,
    tag: "#HIPHOP",
    venue: "PERTH SESSIONS",
    date: "1–10 SEPTEMBER 2026",
    theme: "green",
  },
  {
    id: 8,
    format: "promo",
    title: "DISCOVER\nNEW SOUNDS\nAMPLFY 2026",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "purple",
  },
  {
    id: 9,
    format: "image-feature",
    title: "ROCK LEGENDS",
    credit: "THE STROKES | THE WHITE STRIPES | QUEENS OF THE STONE AGE",
    image: blahImage,
    tag: "#ROCK",
    venue: "PERTH SESSIONS",
    date: "20–30 SEPTEMBER 2026",
    theme: "orange",
  },
  {
    id: 10,
    format: "text-statement",
    title: "WHERE MUSIC\nMEETS SOUL",
    acronym: "AMPLFY",
    venue: "PERTH SESSIONS",
    date: "4–15 JUNE 2026",
    theme: "yellow",
  },
];
