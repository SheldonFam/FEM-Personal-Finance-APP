"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ALL_CATEGORIES_FILTER,
  CATEGORY_FILTER_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constants/constants";
import type { CategoryFilter, SortOption } from "@/lib/types";

const PARAM = {
  search: "q",
  category: "category",
  sort: "sort",
  page: "page",
} as const;

const DEFAULT_CATEGORY: CategoryFilter = ALL_CATEGORIES_FILTER;
const DEFAULT_SORT: SortOption = "latest";

/** Built once; the URL is untrusted input and is checked against these. */
const VALID_CATEGORIES: ReadonlySet<string> = new Set(CATEGORY_FILTER_OPTIONS);
const VALID_SORTS: ReadonlySet<string> = new Set(
  SORT_OPTIONS.map((option) => option.value)
);

interface Filters {
  searchTerm: string;
  selectedCategory: CategoryFilter;
  sortBy: SortOption;
  currentPage: number;
}

/**
 * The transactions list's filters, sort and page, held in the URL.
 *
 * Keeping them here rather than in component state is what makes the view
 * shareable and survive a reload -- CLAUDE.md asks for it directly under
 * "URLs should reflect state" and "Deep-link stateful UI via URL params".
 *
 * Three rules the callers depend on:
 *
 * - **A value equal to its default is removed from the URL**, so a plain
 *   /transactions stays plain rather than accumulating ?q=&sort=latest&page=1.
 * - **Changing any filter returns to the first page.** The page you were on
 *   may not exist once the list narrows, and that decision belongs here rather
 *   than repeated at each call site.
 * - **Search replaces, everything else pushes.** Typing is continuous, so
 *   pushing would bury the previous view under one history entry per
 *   keystroke; picking a category or a page is a discrete act worth going back
 *   to.
 *
 * Anything unrecognised in the URL falls back to its default rather than
 * being trusted, so a hand-edited ?sort=drop-table renders the default view
 * instead of an empty or broken one.
 */
export function useTransactionUrlState(): Filters & {
  setSearchTerm: (value: string) => void;
  setSelectedCategory: (value: CategoryFilter) => void;
  setSortBy: (value: SortOption) => void;
  setCurrentPage: (value: number) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawCategory = searchParams.get(PARAM.category);
  const rawSort = searchParams.get(PARAM.sort);
  const rawPage = Number(searchParams.get(PARAM.page));

  const searchTerm = searchParams.get(PARAM.search) ?? "";
  const selectedCategory =
    rawCategory && VALID_CATEGORIES.has(rawCategory)
      ? (rawCategory as CategoryFilter)
      : DEFAULT_CATEGORY;
  const sortBy =
    rawSort && VALID_SORTS.has(rawSort) ? (rawSort as SortOption) : DEFAULT_SORT;
  const currentPage =
    Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const commit = useCallback(
    (changes: Partial<Record<keyof typeof PARAM, string>>, push: boolean) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(PARAM[key as keyof typeof PARAM], value);
        else next.delete(PARAM[key as keyof typeof PARAM]);
      }

      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      // scroll: false -- the list stays where it is; changing a filter should
      // not throw the reader back to the top of the page.
      if (push) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Each filter clears the page alongside itself, in one place, so a fourth
  // filter cannot be added that forgets to.
  const setSearchTerm = useCallback(
    (value: string) => commit({ search: value, page: "" }, false),
    [commit]
  );

  const setSelectedCategory = useCallback(
    (value: CategoryFilter) =>
      commit(
        { category: value === DEFAULT_CATEGORY ? "" : value, page: "" },
        true
      ),
    [commit]
  );

  const setSortBy = useCallback(
    (value: SortOption) =>
      commit({ sort: value === DEFAULT_SORT ? "" : value, page: "" }, true),
    [commit]
  );

  const setCurrentPage = useCallback(
    (value: number) => commit({ page: value <= 1 ? "" : String(value) }, true),
    [commit]
  );

  return {
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
  };
}
