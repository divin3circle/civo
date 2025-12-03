import { badge100kg, badge500kg, badgeHero } from "@/assets";

export interface BadgeType {
  id: string;
  name: string;
  description: string;
  image: string;
  nftTokenId: string;
  rarity: string;
  hbarPrice: string;
}

export interface NavLinkType {
  label: string;
  href: string;
}

export const BADGES = [
  {
    id: "badge500kg",
    name: "Alchemist",
    description: "Saved 500kg of CO2 in your first year on Civo",
    image: badge500kg,
    nftTokenId: "0.0.78569",
    rarity: "Ultra Rare",
    hbarPrice: "1000",
  },
  {
    id: "badge100kg",
    name: "Green Print",
    description: "Saved 100kg of CO2 in your first month on Civo",
    image: badge100kg,
    nftTokenId: "0.0.77584",
    rarity: "Rare",
    hbarPrice: "100",
  },
  {
    id: "badgeHero",
    name: "Hero of the Forest",
    description: "Logged carbon data for 30 Days straight",
    image: badgeHero,
    nftTokenId: "0.0.78569",
    rarity: "Legendary",
    hbarPrice: "10",
  },
];

export const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "AI Coach",
    href: "/coach",
  },
  {
    label: "Ledger",
    href: "/ledger",
  },
];
