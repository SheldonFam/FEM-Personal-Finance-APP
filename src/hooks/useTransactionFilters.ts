import { Transaction, SortOption } from "@/lib/types";
import { ALL_CATEGORIES_FILTER } from "@/lib/constants/constants";
import { useFilteredItems, type FilterAccessors } from "./useFilteredItems";

interface UseTransactionFiltersProps {
  transactions: Transaction[];
  searchTerm: string;
  selectedCategory: string;
  sortBy: SortOption;
}

/**
 * Module scope, so its identity is stable across renders and the memo inside
 * useFilteredItems actually holds.
 */
const TRANSACTION_ACCESSORS: FilterAccessors<Transaction> = {
  getSearchableText: (transaction) => transaction.name,
  getCategory: (transaction) => transaction.category,
  getDate: (transaction) => transaction.date,
  getAmount: (transaction) => transaction.amount,
  getName: (transaction) => transaction.name,
};

/**
 * Filters and sorts transactions.
 */
export const useTransactionFilters = ({
  transactions,
  searchTerm,
  selectedCategory,
  sortBy,
}: UseTransactionFiltersProps) =>
  useFilteredItems(transactions, TRANSACTION_ACCESSORS, {
    searchTerm,
    selectedCategory,
    allCategoriesValue: ALL_CATEGORIES_FILTER,
    sortBy,
  });
