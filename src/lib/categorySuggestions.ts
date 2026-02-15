import { TRANSACTION_CATEGORIES } from "@/lib/constants/constants";

type Category = (typeof TRANSACTION_CATEGORIES)[number];

const KEYWORD_CATEGORY_MAP: Record<string, Category> = {
  // Entertainment
  netflix: "Entertainment",
  spotify: "Entertainment",
  hulu: "Entertainment",
  disney: "Entertainment",
  hbo: "Entertainment",
  youtube: "Entertainment",
  twitch: "Entertainment",
  cinema: "Entertainment",
  theater: "Entertainment",
  concert: "Entertainment",
  gaming: "Entertainment",
  steam: "Entertainment",
  playstation: "Entertainment",
  xbox: "Entertainment",
  nintendo: "Entertainment",

  // Bills
  electric: "Bills",
  water: "Bills",
  gas: "Bills",
  internet: "Bills",
  phone: "Bills",
  insurance: "Bills",
  rent: "Bills",
  mortgage: "Bills",
  utility: "Bills",
  verizon: "Bills",
  "at&t": "Bills",
  comcast: "Bills",
  "t-mobile": "Bills",

  // Dining Out
  restaurant: "Dining Out",
  cafe: "Dining Out",
  coffee: "Dining Out",
  starbucks: "Dining Out",
  mcdonald: "Dining Out",
  pizza: "Dining Out",
  doordash: "Dining Out",
  grubhub: "Dining Out",
  "uber eats": "Dining Out",
  chipotle: "Dining Out",
  subway: "Dining Out",
  burger: "Dining Out",

  // Personal Care
  salon: "Personal Care",
  spa: "Personal Care",
  barber: "Personal Care",
  pharmacy: "Personal Care",
  dentist: "Personal Care",
  doctor: "Personal Care",
  gym: "Personal Care",
  fitness: "Personal Care",

  // Groceries
  grocery: "Groceries",
  supermarket: "Groceries",
  walmart: "Groceries",
  costco: "Groceries",
  "whole foods": "Groceries",
  trader: "Groceries",
  kroger: "Groceries",
  aldi: "Groceries",
  safeway: "Groceries",
  target: "Groceries",

  // Transportation
  uber: "Transportation",
  lyft: "Transportation",
  taxi: "Transportation",
  parking: "Transportation",
  gasoline: "Transportation",
  fuel: "Transportation",
  transit: "Transportation",
  metro: "Transportation",
  bus: "Transportation",
  airline: "Transportation",
  flight: "Transportation",

  // Shopping
  amazon: "Shopping",
  ebay: "Shopping",
  etsy: "Shopping",
  mall: "Shopping",
  clothing: "Shopping",
  "best buy": "Shopping",
  apple: "Shopping",
  nike: "Shopping",
  zara: "Shopping",

  // Education
  tuition: "Education",
  university: "Education",
  college: "Education",
  school: "Education",
  udemy: "Education",
  coursera: "Education",
  textbook: "Education",

  // Lifestyle
  subscription: "Lifestyle",
  membership: "Lifestyle",
  club: "Lifestyle",
  magazine: "Lifestyle",
  hobby: "Lifestyle",
};

/**
 * Suggests a transaction category based on the merchant name.
 * Returns null if no match is found.
 */
export function suggestCategory(merchantName: string): string | null {
  const lower = merchantName.toLowerCase();

  for (const [keyword, category] of Object.entries(KEYWORD_CATEGORY_MAP)) {
    if (lower.includes(keyword)) {
      return category;
    }
  }

  return null;
}
