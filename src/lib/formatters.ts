/**
 * Currency formatting utilities
 */
export const formatCurrency = (amount: number, useAbsoluteValue = true): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(useAbsoluteValue ? Math.abs(amount) : amount);
};

/**
 * Currency without cents, for the one place the layout cannot afford them.
 *
 * Prefer formatCurrency everywhere else -- money reads with cents in this app.
 * This exists for the budget donut's centre figure, which sits inside a ring
 * whose hole is about 150px wide at text-4xl. Measured in the browser against
 * real data, "$2,689.06" needs 154px against 132px available and renders as
 * "$2,689...". The same figure without cents needs 127px and fits.
 */
export const formatCurrencyWhole = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Date formatting utilities
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Get ordinal suffix for day of month (1st, 2nd, 3rd, etc.)
 */
export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

/**
 * Get day of month from date string
 */
export const getDayOfMonth = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getDate();
};

