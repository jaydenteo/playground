import loungeImage from "./lounge.jpg";
import liveImage from "./live.jpg";
import instruments from "./instruments.jpg";
import stage from "./stage.jpg";
import hiphop from "./hiphop.jpg";

export type PosterFormat =
  | "image-feature"
  | "text-statement"
  | "promo"
  | "image-grid";

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
    title: "LIVE LOUNGE SESSIONS",
    credit: "LOCAL JAZZ & INDIE ARTISTS",
    image: loungeImage,
    tag: "#LIVELOUNGE",
    venue: "PERTH MUSIC HALL",
    date: "12–14 FEBRUARY 2026",
    theme: "blue",
  },
  {
    id: 2,
    format: "text-statement",
    title: "YOUR WEEKENDS JUST GOT BETTER",
    venue: "AMPLFY PERTH",
    date: "EVERY FRIDAY & SATURDAY",
    theme: "purple",
  },
  {
    id: 3,
    format: "promo",
    title: "DISCOVER NEW ARTISTS\nAMPLFY 2026",
    venue: "PERTH MUSIC HALL",
    date: "1–15 MARCH 2026",
    theme: "green",
  },
  {
    id: 4,
    format: "image-feature",
    acronym: "AMPLFY",
    title: "ELECTRO BEATS NIGHT",
    credit: "DJ TONE | DJ LUX | GUEST DJs",
    image: liveImage,
    tag: "#ELECTRO",
    venue: "URBAN LOUNGE PERTH",
    date: "20–21 MARCH 2026",
    theme: "orange",
  },
  {
    id: 5,
    format: "image-feature",
    title: "ACOUSTIC EVENINGS",
    credit: "SOLO GUITARISTS & VOCALISTS",
    image: stage,
    tag: "#ACOUSTIC",
    venue: "AMPLFY LOUNGE",
    date: "5–12 APRIL 2026",
    theme: "yellow",
  },
  {
    id: 6,
    format: "text-statement",
    title: "AMPLIFY YOUR MUSIC EXPERIENCE",
    venue: "PERTH MUSIC HALL",
    date: "ONGOING",
    theme: "blue",
  },
  {
    id: 7,
    format: "image-feature",
    acronym: "AMPLFY",
    title: "HIP HOP & R&B NIGHT",
    credit: "LOCAL & INTERNATIONAL ARTISTS",
    image: hiphop,
    tag: "#HIPHOP",
    venue: "PERTH URBAN LOUNGE",
    date: "10–15 MAY 2026",
    theme: "green",
  },
  {
    id: 8,
    format: "promo",
    title: "UPCOMING FESTIVAL\nAMPLFY 2026",
    venue: "PERTH MUSIC HALL",
    date: "JUNE 2026",
    theme: "purple",
  },
  {
    id: 9,
    format: "image-feature",
    title: "ROCK & INDIE NIGHT",
    credit: "THE VINYLS | NIGHT OWLS | THE WANDERS",
    image: instruments,
    tag: "#ROCKINDIE",
    venue: "AMPLFY PERTH",
    date: "20–25 JUNE 2026",
    theme: "orange",
  },
  {
    id: 10,
    format: "text-statement",
    title: "WHERE MUSIC MEETS VIBES",
    venue: "PERTH MUSIC HALL",
    date: "ONGOING",
    theme: "yellow",
  },
];
