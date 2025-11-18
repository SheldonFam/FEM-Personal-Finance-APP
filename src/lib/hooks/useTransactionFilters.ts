import { useMemo } from "react";
import { Transaction, SortOption } from "@/lib/types";

interface UseTransactionFiltersProps {
  transactions: Transaction[];
  searchTerm: string;
  selectedCategory: string;
  sortBy: SortOption;
}

export const useTransactionFilters = ({
  transactions,
  searchTerm,
  selectedCategory,
  sortBy,
}: UseTransactionFiltersProps) => {
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All Transactions") {
      filtered = filtered.filter(
        (transaction) => transaction.category === selectedCategory
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "latest":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      case "a-z":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return sorted;
  }, [transactions, searchTerm, selectedCategory, sortBy]);

  return filteredAndSortedTransactions;
};

