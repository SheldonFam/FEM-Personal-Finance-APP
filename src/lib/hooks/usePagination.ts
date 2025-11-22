import { useMemo } from "react";
import { ITEMS_PER_PAGE } from "@/lib/constants";

interface UsePaginationProps<T> {
  items: T[];
  currentPage: number;
  itemsPerPage?: number;
}

export const usePagination = <T,>({
  items,
  currentPage,
  itemsPerPage = ITEMS_PER_PAGE,
}: UsePaginationProps<T>) => {
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      paginatedItems,
      totalPages,
      startIndex,
      endIndex: startIndex + paginatedItems.length,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [items, currentPage, itemsPerPage]);

  return paginationData;
};

