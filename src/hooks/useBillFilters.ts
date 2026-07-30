import { RecurringBill, SortOption } from "@/lib/types";
import { useFilteredItems, type FilterAccessors } from "./useFilteredItems";

interface UseBillFiltersProps {
  bills: RecurringBill[];
  searchQuery: string;
  sortBy: SortOption;
}

/**
 * Module scope, so its identity is stable across renders and the memo inside
 * useFilteredItems actually holds.
 *
 * Bills sort by day of month rather than by date, and compare amounts by
 * magnitude, so they override every handler except the name ones.
 */
const BILL_ACCESSORS: FilterAccessors<RecurringBill> = {
  getSearchableText: (bill) => bill.name,
  getName: (bill) => bill.name,
  sortHandlers: {
    latest: (a, b) => a.dayOfMonth - b.dayOfMonth,
    oldest: (a, b) => b.dayOfMonth - a.dayOfMonth,
    highest: (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
    lowest: (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
  },
};

/**
 * Filters and sorts recurring bills.
 */
export const useBillFilters = ({
  bills,
  searchQuery,
  sortBy,
}: UseBillFiltersProps) =>
  useFilteredItems(bills, BILL_ACCESSORS, {
    searchTerm: searchQuery,
    sortBy,
  });
