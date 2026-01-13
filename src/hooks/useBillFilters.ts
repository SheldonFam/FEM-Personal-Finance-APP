import { RecurringBill, SortOption } from "@/lib/types";
import { useFilteredItems } from "./useFilteredItems";

interface UseBillFiltersProps {
  bills: RecurringBill[];
  searchQuery: string;
  sortBy: SortOption;
}

/**
 * Custom hook for filtering and sorting recurring bills
 * Uses the generic useFilteredItems hook with bill-specific configuration
 * Note: For bills, "latest" sorts by earliest day of month, "oldest" by latest day
 */
export const useBillFilters = ({
  bills,
  searchQuery,
  sortBy,
}: UseBillFiltersProps) => {
  return useFilteredItems({
    items: bills,
    search: {
      searchTerm: searchQuery,
      getSearchableText: (bill) => bill.name,
    },
    sort: {
      sortBy,
      getName: (bill) => bill.name,
      // Custom sort handlers for bills (amounts use absolute values)
      sortHandlers: {
        latest: (a, b) => a.dayOfMonth - b.dayOfMonth,
        oldest: (a, b) => b.dayOfMonth - a.dayOfMonth,
        highest: (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
        lowest: (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
      },
    },
  });
};

