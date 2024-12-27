import { Service } from "@/types/subscription";

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "netflix",
    name: "Netflix",
    imageUrl: "/images/subscriptions/netflix.png",
    defaultPrice: 199,
  },
  {
    id: "spotify",
    name: "Spotify",
    imageUrl: "/images/subscriptions/spotify.png",
    defaultPrice: 119,
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    imageUrl: "/images/subscriptions/prime.png",
    defaultPrice: 179,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    imageUrl: "/images/subscriptions/youtube.png",
    defaultPrice: 129,
  },
  {
    id: "hotstar",
    name: "Disney+ Hotstar",
    imageUrl: "/images/subscriptions/disney.png",
    defaultPrice: 299,
  },
];

export const popularServices = [
  {
    name: "Netflix",
    imageUrl: "/images/subscriptions/netflix.png",
  },
  {
    name: "Spotify",
    imageUrl: "/images/subscriptions/spotify.png",
  },
  {
    name: "Amazon Prime",
    imageUrl: "/images/subscriptions/prime.png",
  },
  {
    name: "Disney+",
    imageUrl: "/images/subscriptions/disney.png",
  },
  {
    name: "YouTube Premium",
    imageUrl: "/images/subscriptions/youtube.png",
  },
];
