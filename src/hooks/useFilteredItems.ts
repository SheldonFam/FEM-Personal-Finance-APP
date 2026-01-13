import { useMemo } from "react";
import { SortOption } from "@/lib/types";

/**
 * Configuration for filtering items by search term
 */
interface SearchConfig<T> {
  /** Function to extract searchable text from an item */
  getSearchableText: (item: T) => string;
  /** Search term to filter by */
  searchTerm: string;
}

/**
 * Configuration for filtering items by category
 */
interface CategoryConfig<T> {
  /** Function to extract category from an item */
  getCategory: (item: T) => string;
  /** Selected category to filter by */
  selectedCategory: string;
  /** Value representing "all categories" (e.g., "All Transactions") */
  allCategoriesValue: string;
}

/**
 * Configuration for sorting items
 */
interface SortConfig<T> {
  /** Sort option selected by user */
  sortBy: SortOption;
  /** Custom sort handlers for different sort options */
  sortHandlers?: Partial<Record<SortOption, (a: T, b: T) => number>>;
  /** Function to extract date string from item (for latest/oldest sorting) */
  getDate?: (item: T) => string;
  /** Function to extract numeric value from item (for highest/lowest sorting) */
  getAmount?: (item: T) => number;
  /** Function to extract name from item (for a-z/z-a sorting) */
  getName?: (item: T) => string;
}

interface UseFilteredItemsProps<T> {
  items: T[];
  search?: SearchConfig<T>;
  category?: CategoryConfig<T>;
  sort: SortConfig<T>;
}

/**
 * Generic hook for filtering and sorting items with memoization
 *
 * @example
 * // Simple usage with transactions
 * const filtered = useFilteredItems({
 *   items: transactions,
 *   search: {
 *     searchTerm,
 *     getSearchableText: (t) => t.name
 *   },
 *   category: {
 *     selectedCategory,
 *     allCategoriesValue: "All Transactions",
 *     getCategory: (t) => t.category
 *   },
 *   sort: {
 *     sortBy,
 *     getDate: (t) => t.date,
 *     getAmount: (t) => t.amount,
 *     getName: (t) => t.name
 *   }
 * });
 */
export const useFilteredItems = <T>({
  items,
  search,
  category,
  sort,
}: UseFilteredItemsProps<T>): T[] => {
  return useMemo(() => {
    let filtered = items;

    // Apply search filter
    if (search && search.searchTerm) {
      filtered = filtered.filter((item) =>
        search
          .getSearchableText(item)
          .toLowerCase()
          .includes(search.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (category && category.selectedCategory !== category.allCategoriesValue) {
      filtered = filtered.filter(
        (item) => category.getCategory(item) === category.selectedCategory
      );
    }

    // Apply sorting
    const sorted = [...filtered];

    // Check for custom sort handler first
    if (sort.sortHandlers?.[sort.sortBy]) {
      sorted.sort(sort.sortHandlers[sort.sortBy]!);
      return sorted;
    }

    // Default sort handlers
    switch (sort.sortBy) {
      case "latest":
        if (sort.getDate) {
          sorted.sort(
            (a, b) =>
              new Date(sort.getDate!(b)).getTime() -
              new Date(sort.getDate!(a)).getTime()
          );
        }
        break;
      case "oldest":
        if (sort.getDate) {
          sorted.sort(
            (a, b) =>
              new Date(sort.getDate!(a)).getTime() -
              new Date(sort.getDate!(b)).getTime()
          );
        }
        break;
      case "highest":
        if (sort.getAmount) {
          sorted.sort((a, b) => sort.getAmount!(b) - sort.getAmount!(a));
        }
        break;
      case "lowest":
        if (sort.getAmount) {
          sorted.sort((a, b) => sort.getAmount!(a) - sort.getAmount!(b));
        }
        break;
      case "a-z":
        if (sort.getName) {
          sorted.sort((a, b) =>
            sort.getName!(a).localeCompare(sort.getName!(b))
          );
        }
        break;
      case "z-a":
        if (sort.getName) {
          sorted.sort((a, b) =>
            sort.getName!(b).localeCompare(sort.getName!(a))
          );
        }
        break;
    }

    return sorted;
  }, [items, search, category, sort]);
};
