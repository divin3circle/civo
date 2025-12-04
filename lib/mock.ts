import { EmissionLog } from "./constants";

export const mockEmissionLogs: EmissionLog[] = [
  {
    id: "log-1",
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "car",
      distance: 25.5,
      co2e: 5.8,
      price: 12.5,
    },
    food: {
      meals: ["chicken curry", "rice", "vegetables"],
      price: 8.5,
      co2e: 2.3,
    },
    energy: {
      units: 15.2,
      price: 3.8,
      co2e: 4.1,
    },
    totalEmission: 12.2,
    totalSpending: 24.8,
    aiAdvice:
      "Consider using public transport for shorter distances to reduce your transport emissions by 30%.",
    aiScore: 72,
  },
  {
    id: "log-2",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "bus",
      distance: 18.0,
      co2e: 2.1,
      price: 2.5,
    },
    food: {
      meals: ["vegetarian pasta", "salad", "bread"],
      price: 6.2,
      co2e: 1.1,
    },
    energy: {
      units: 12.8,
      price: 3.2,
      co2e: 3.5,
    },
    totalEmission: 6.7,
    totalSpending: 11.9,
    aiAdvice:
      "Great job using public transport! Your emissions are 45% lower than average.",
    aiScore: 88,
  },
  {
    id: "log-3",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "bicycle",
      distance: 5.0,
      co2e: 0.0,
      price: 0.0,
    },
    food: {
      meals: ["beef burger", "fries", "soda"],
      price: 12.0,
      co2e: 4.2,
    },
    energy: {
      units: 18.5,
      price: 4.6,
      co2e: 5.0,
    },
    totalEmission: 9.2,
    totalSpending: 16.6,
    aiAdvice:
      "Excellent choice using a bicycle! However, consider reducing red meat consumption to lower food emissions.",
    aiScore: 75,
  },
  {
    id: "log-4",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "car",
      distance: 45.0,
      co2e: 10.2,
      price: 22.0,
    },
    food: {
      meals: ["fish tacos", "beans", "avocado"],
      price: 9.5,
      co2e: 1.8,
    },
    energy: {
      units: 14.3,
      price: 3.6,
      co2e: 3.9,
    },
    totalEmission: 15.9,
    totalSpending: 35.1,
    aiAdvice:
      "Long car trips significantly increase emissions. Consider carpooling or planning trips more efficiently.",
    aiScore: 65,
  },
  {
    id: "log-5",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "walking",
      distance: 2.5,
      co2e: 0.0,
      price: 0.0,
    },
    food: {
      meals: ["vegetable stir-fry", "tofu", "quinoa"],
      price: 7.8,
      co2e: 0.9,
    },
    energy: {
      units: 11.2,
      price: 2.8,
      co2e: 3.0,
    },
    totalEmission: 3.9,
    totalSpending: 10.6,
    aiAdvice:
      "Outstanding! Your plant-based meals and walking have resulted in minimal emissions. Keep it up!",
    aiScore: 95,
  },
  {
    id: "log-6",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "motorcycle",
      distance: 30.0,
      co2e: 3.5,
      price: 5.0,
    },
    food: {
      meals: ["pizza", "chicken wings", "soda"],
      price: 15.5,
      co2e: 3.8,
    },
    energy: {
      units: 16.8,
      price: 4.2,
      co2e: 4.5,
    },
    totalEmission: 11.8,
    totalSpending: 24.7,
    aiAdvice:
      "Motorcycle is better than a car, but processed foods increase your carbon footprint. Try homemade meals.",
    aiScore: 68,
  },
  {
    id: "log-7",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "train",
      distance: 60.0,
      co2e: 1.8,
      price: 8.5,
    },
    food: {
      meals: ["sushi", "miso soup", "salad"],
      price: 18.0,
      co2e: 2.1,
    },
    energy: {
      units: 13.5,
      price: 3.4,
      co2e: 3.7,
    },
    totalEmission: 7.6,
    totalSpending: 29.9,
    aiAdvice:
      "Train travel is excellent for long distances! Your transport emissions are very low.",
    aiScore: 82,
  },
  {
    id: "log-8",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "car",
      distance: 15.0,
      co2e: 3.4,
      price: 7.5,
    },
    food: {
      meals: ["lentil soup", "whole grain bread", "vegetables"],
      price: 5.5,
      co2e: 0.6,
    },
    energy: {
      units: 10.5,
      price: 2.6,
      co2e: 2.8,
    },
    totalEmission: 6.8,
    totalSpending: 15.6,
    aiAdvice:
      "Your food choices are excellent! Consider using an electric vehicle or public transport for short trips.",
    aiScore: 79,
  },
  {
    id: "log-9",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    transport: {
      mode: "bus",
      distance: 22.0,
      co2e: 2.6,
      price: 3.0,
    },
    food: {
      meals: ["chicken salad", "fruit", "yogurt"],
      price: 9.0,
      co2e: 1.5,
    },
    energy: {
      units: 12.0,
      price: 3.0,
      co2e: 3.2,
    },
    totalEmission: 7.3,
    totalSpending: 15.0,
    aiAdvice:
      "Good balance across all categories! Your daily emissions are below average.",
    aiScore: 81,
  },
  {
    id: "log-10",
    date: new Date().toISOString(),
    transport: {
      mode: "bicycle",
      distance: 8.0,
      co2e: 0.0,
      price: 0.0,
    },
    food: {
      meals: ["vegetable curry", "rice", "lentils"],
      price: 6.5,
      co2e: 0.8,
    },
    energy: {
      units: 9.8,
      price: 2.5,
      co2e: 2.7,
    },
    totalEmission: 3.5,
    totalSpending: 9.0,
    aiAdvice:
      "Perfect day! Zero transport emissions and plant-based meals. You're setting a great example!",
    aiScore: 98,
  },
];
