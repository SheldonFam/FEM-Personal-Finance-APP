/**
 * Color theme mappings (SINGLE SOURCE OF TRUTH)
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

/** Reverse lookup map: hex -> theme name (built once at module load) */
const HEX_TO_THEME_NAME = new Map(
  Object.entries(COLOR_THEMES).map(([name, hex]) => [hex, name])
);

/**
 * Helper: Get theme name from hex color code
 * @param hex - The hex color code (e.g., "#277C78")
 * @returns The theme name (e.g., "Green") or undefined if not found
 */
export const getThemeNameFromHex = (hex: string): string | undefined => {
  return HEX_TO_THEME_NAME.get(hex);
};

/**
 * Helper: Get hex color code from theme name
 * @param themeName - The theme name (e.g., "Green")
 * @returns The hex color code (e.g., "#277C78") or undefined if not found
 */
export const getHexFromThemeName = (themeName: string): string | undefined => {
  return COLOR_THEMES[themeName];
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
