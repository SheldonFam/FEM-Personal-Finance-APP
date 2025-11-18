import { useMemo } from "react";
import { RecurringBill, SortOption } from "@/lib/types";

interface UseBillFiltersProps {
  bills: RecurringBill[];
  searchQuery: string;
  sortBy: SortOption;
}

export const useBillFilters = ({
  bills,
  searchQuery,
  sortBy,
}: UseBillFiltersProps) => {
  const filteredAndSortedBills = useMemo(() => {
    let filtered = bills;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((bill) =>
        bill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "latest":
        sorted.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
        break;
      case "oldest":
        sorted.sort((a, b) => b.dayOfMonth - a.dayOfMonth);
        break;
      case "highest":
        sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "lowest":
        sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case "a-z":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return sorted;
  }, [bills, searchQuery, sortBy]);

  return filteredAndSortedBills;
};

