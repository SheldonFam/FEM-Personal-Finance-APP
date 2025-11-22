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

