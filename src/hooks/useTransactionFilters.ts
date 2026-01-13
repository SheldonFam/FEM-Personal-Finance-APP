import { Transaction, SortOption } from "@/lib/types";
import { useFilteredItems } from "./useFilteredItems";

interface UseTransactionFiltersProps {
  transactions: Transaction[];
  searchTerm: string;
  selectedCategory: string;
  sortBy: SortOption;
}

/**
 * Custom hook for filtering and sorting transactions
 * Uses the generic useFilteredItems hook with transaction-specific configuration
 */
export const useTransactionFilters = ({
  transactions,
  searchTerm,
  selectedCategory,
  sortBy,
}: UseTransactionFiltersProps) => {
  return useFilteredItems({
    items: transactions,
    search: {
      searchTerm,
      getSearchableText: (transaction) => transaction.name,
    },
    category: {
      selectedCategory,
      allCategoriesValue: "All Transactions",
      getCategory: (transaction) => transaction.category,
    },
    sort: {
      sortBy,
      getDate: (transaction) => transaction.date,
      getAmount: (transaction) => transaction.amount,
      getName: (transaction) => transaction.name,
    },
  });
};

