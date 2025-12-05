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

interface TransportEmission {
  mode: string;
  distance: number;
  co2e: number;
  price: number;
}
export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
}

interface FoodEmission {
  meals: string[];
  price: number;
  co2e: number;
}

interface EnergyEmission {
  units: number;
  price: number;
  co2e: number;
}

export interface EmissionLog {
  id: string;
  transport: TransportEmission;
  food: FoodEmission;
  energy: EnergyEmission;
  totalEmission: number;
  totalSpending: number;
  aiAdvice: string;
  aiScore: number;
  date: string;
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

export const formatLogsForContext = (logs: EmissionLog[]): string => {
  if (!logs || logs.length === 0) return "No prior carbon logs available.";

  let context = "User's Recent Carbon Activity Log:\n";
  logs.forEach((log) => {
    context += `- Date: ${log.date} | Transport: ${
      log.transport.mode
    } | Distance: ${log.transport.distance}km | CO2: ${
      log.transport.co2e
    }kg | Food: ${log.food.meals.join(", ")} | Energy: ${
      log.energy.units
    }kWh | Total Emissions: ${log.totalEmission}kg | Total Spending: ${
      log.totalSpending
    } | Previous Advice: "${log.aiAdvice}"\n`;
  });
  return context;
};
