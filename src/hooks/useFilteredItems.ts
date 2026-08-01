import { useMemo } from "react";
import { SortOption } from "@/lib/types";

/**
 * How to read the sortable/searchable fields off an item.
 *
 * These never vary at runtime, so callers declare them ONCE at module scope.
 * That stable identity is what lets the memo below actually hold — passing a
 * fresh object literal per render would defeat it.
 */
export interface FilterAccessors<T> {
  /** Text the search term is matched against. Omit to disable search. */
  getSearchableText?: (item: T) => string;
  /** Category the filter is matched against. Omit to disable category filtering. */
  getCategory?: (item: T) => string;
  /** Date string, for latest/oldest. */
  getDate?: (item: T) => string;
  /** Numeric value, for highest/lowest. */
  getAmount?: (item: T) => number;
  /** Name, for a-z/z-a. */
  getName?: (item: T) => string;
  /** Per-entity overrides, taking precedence over the defaults above. */
  sortHandlers?: Partial<Record<SortOption, (a: T, b: T) => number>>;
}

/** What the user has actually selected. All primitives, so they compare by value. */
export interface FilterCriteria {
  searchTerm?: string;
  selectedCategory?: string;
  /** Sentinel meaning "no category filter" — see ALL_CATEGORIES_FILTER. */
  allCategoriesValue?: string;
  sortBy: SortOption;
}

/**
 * Filter then sort. Pure — no hooks, no state.
 */
export function filterAndSortItems<T>(
  items: T[],
  accessors: FilterAccessors<T>,
  criteria: FilterCriteria
): T[] {
  const { getSearchableText, getCategory, getDate, getAmount, getName } =
    accessors;
  const { searchTerm, selectedCategory, allCategoriesValue, sortBy } = criteria;

  // Each active criterion becomes a predicate first, so the pass below walks
  // the list once and tests only what is actually selected. Two chained
  // .filter() calls read the same array twice and allocate an intermediate
  // that nothing else ever sees.
  const needle = searchTerm?.toLowerCase();

  const matchesSearch =
    getSearchableText && needle
      ? (item: T) => getSearchableText(item).toLowerCase().includes(needle)
      : null;

  const matchesCategory =
    getCategory && selectedCategory && selectedCategory !== allCategoriesValue
      ? (item: T) => getCategory(item) === selectedCategory
      : null;

  // With nothing selected the original array is passed straight through,
  // rather than copied by a filter that would keep every element.
  const filtered =
    matchesSearch || matchesCategory
      ? items.filter(
          (item) =>
            (!matchesSearch || matchesSearch(item)) &&
            (!matchesCategory || matchesCategory(item))
        )
      : items;

  const sorted = [...filtered];

  // An entity-specific handler wins over the defaults.
  const override = accessors.sortHandlers?.[sortBy];
  if (override) {
    sorted.sort(override);
    return sorted;
  }

  switch (sortBy) {
    case "latest":
      if (getDate) {
        sorted.sort(
          (a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()
        );
      }
      break;
    case "oldest":
      if (getDate) {
        sorted.sort(
          (a, b) => new Date(getDate(a)).getTime() - new Date(getDate(b)).getTime()
        );
      }
      break;
    case "highest":
      if (getAmount) {
        sorted.sort((a, b) => getAmount(b) - getAmount(a));
      }
      break;
    case "lowest":
      if (getAmount) {
        sorted.sort((a, b) => getAmount(a) - getAmount(b));
      }
      break;
    case "a-z":
      if (getName) {
        sorted.sort((a, b) => getName(a).localeCompare(getName(b)));
      }
      break;
    case "z-a":
      if (getName) {
        sorted.sort((a, b) => getName(b).localeCompare(getName(a)));
      }
      break;
  }

  return sorted;
}

/**
 * Memoised filter + sort.
 *
 * Recomputes only when the items, the accessors, or one of the primitive
 * criteria actually changes.
 *
 * @example
 * // Declared once, at module scope — NOT inline in the component.
 * const TRANSACTION_ACCESSORS: FilterAccessors<Transaction> = {
 *   getSearchableText: (t) => t.name,
 *   getCategory: (t) => t.category,
 * };
 *
 * const filtered = useFilteredItems(transactions, TRANSACTION_ACCESSORS, {
 *   searchTerm,
 *   selectedCategory,
 *   allCategoriesValue: ALL_CATEGORIES_FILTER,
 *   sortBy,
 * });
 */
export const useFilteredItems = <T>(
  items: T[],
  accessors: FilterAccessors<T>,
  criteria: FilterCriteria
): T[] => {
  const { searchTerm, selectedCategory, allCategoriesValue, sortBy } = criteria;

  // Deps are the item array, the stable accessor object, and primitives only.
  // `criteria` itself is deliberately NOT a dependency: callers build it inline
  // per render, so depending on it would defeat the memo entirely.
  return useMemo(
    () =>
      filterAndSortItems(items, accessors, {
        searchTerm,
        selectedCategory,
        allCategoriesValue,
        sortBy,
      }),
    [items, accessors, searchTerm, selectedCategory, allCategoriesValue, sortBy]
  );
};
