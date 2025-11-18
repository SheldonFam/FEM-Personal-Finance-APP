/**
 * Theme color mappings
 * Maps hex color codes to theme names
 */
export const THEME_COLORS: Record<string, string> = {
  "#277C78": "Green",
  "#F2CDAC": "Yellow",
  "#82C9D7": "Cyan",
  "#626070": "Navy",
  "#C94736": "Red",
  "#826CB0": "Purple",
  "#597C7C": "Turquoise",
  "#93674F": "Brown",
  "#934F6F": "Magenta",
  "#3F82B2": "Blue",
  "#97A0AC": "Navy Grey",
  "#7F9161": "Army Green",
  "#AF81BA": "Pink",
  "#CAB361": "Gold",
  "#BE6C49": "Orange",
};

/**
 * Color theme mappings
 * Maps theme names to hex color codes
 */
export const COLOR_THEMES: Record<string, string> = {
  Green: "#277C78",
  Yellow: "#F2CDAC",
  Cyan: "#82C9D7",
  Navy: "#626070",
  Red: "#C94736",
  Purple: "#826CB0",
  Turquoise: "#597C7C",
  Brown: "#93674F",
  Magenta: "#934F6F",
  Blue: "#3F82B2",
  "Navy Grey": "#97A0AC",
  "Army Green": "#7F9161",
  Pink: "#AF81BA",
  Gold: "#CAB361",
  Orange: "#BE6C49",
};

/**
 * Sort options for transactions and bills
 */
export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
] as const;

/**
 * Transaction categories
 */
export const TRANSACTION_CATEGORIES = [
  "All Transactions",
  "Entertainment",
  "Bills",
  "Dining Out",
  "Personal Care",
  "General",
  "Groceries",
  "Transportation",
  "Lifestyle",
  "Shopping",
  "Education",
] as const;

/**
 * Pagination constants
 */
export const ITEMS_PER_PAGE = 10;

