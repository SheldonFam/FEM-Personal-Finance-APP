"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import transactionsData from "@/../data.json";
import { normalizeImagePath } from "@/lib/utils";

// Types
interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

// Constants
const ITEMS_PER_PAGE = 10;

const CATEGORIES = [
  "All Transactions",
  "Entertainment",
  "Bills",
  "Dining Out",
  "Personal Care",
  "General",
  "Groceries",
  "Transportation",
  "Lifestyle",
  "Shopping",
  "Education",
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
];

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Transaction Item Component
const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const isPositive = transaction.amount > 0;
  const avatarPath = normalizeImagePath(transaction.avatar);

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-transparent group-hover:ring-gray-200 transition-all">
          <Image
            src={avatarPath}
            alt={transaction.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-gray-900 truncate">
              {transaction.name}
            </p>
            {transaction.recurring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium flex-shrink-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3.5L9 1L11.5 3.5L9 6L9 3.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3 8.5L3 11L0.5 8.5L3 6L3 8.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9 3.5C9 5.433 7.433 7 5.5 7C3.567 7 2 5.433 2 3.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 8.5C3 6.567 4.567 5 6.5 5C8.433 5 10 6.567 10 8.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
                Recurring
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{transaction.category}</p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-4">
        <p
          className={`font-bold text-sm md:text-base ${
            isPositive ? "text-green-600" : "text-gray-900"
          }`}
        >
          {isPositive ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(transaction.date)}
        </p>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Always show first page
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push(-1); // Ellipsis
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(-2); // Ellipsis
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image
          src="/assets/images/icon-caret-left.svg"
          alt="Previous"
          width={12}
          height={12}
        />
        Prev
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <Image
          src="/assets/images/icon-caret-right.svg"
          alt="Next"
          width={12}
          height={12}
        />
      </Button>
    </div>
  );
};

// Main Transactions Page Component
export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Transactions");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactionsData.transactions as Transaction[];

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
  }, [searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
        Transactions
      </h1>

      {/* Transactions Card */}
      <Card className="p-5 md:p-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Image
                  src="/assets/images/icon-search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search transaction"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            {/* Category Filter and Sort */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[150px] h-12 bg-white">
                  <div className="flex items-center gap-2 justify-start">
                    <span className="text-gray-500 text-sm">Sort by</span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-600">
              {filteredAndSortedTransactions.length} transaction
              {filteredAndSortedTransactions.length !== 1 ? "s" : ""} found
            </p>
            {(searchTerm || selectedCategory !== "All Transactions") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Transactions");
                  setSortBy("latest");
                }}
                className="text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-1">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction, index) => (
              <TransactionRow key={index} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Transactions");
                }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
}
