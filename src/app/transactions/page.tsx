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

// Transaction Item Component (4-column grid layout)
const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const isPositive = transaction.amount > 0;
  const avatarPath = normalizeImagePath(transaction.avatar);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-0">
        {/* Recipient / Sender */}
        <div className="flex items-start gap-4 min-w-0 sm:col-span-1">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={transaction.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-gray-900 truncate">
              {transaction.name}
            </p>
            <p className="mt-1 text-xs text-gray-500 sm:hidden">
              {transaction.category}
            </p>
          </div>
          <div className="ml-auto text-right sm:hidden">
            <p
              className={`font-bold text-sm ${
                isPositive ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isPositive ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="hidden sm:block text-sm text-gray-500">
          {transaction.category}
        </div>

        {/* Transaction Date */}
        <div className="hidden sm:block text-sm text-gray-500">
          {formatDate(transaction.date)}
        </div>

        {/* Amount */}
        <div className="hidden sm:block text-right">
          <p
            className={`font-bold text-sm md:text-base ${
              isPositive ? "text-green-600" : "text-gray-900"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
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
        className="h-full px-4 py-[9.5px]  gap-4"
      >
        <Image
          src="/assets/images/icon-caret-left.svg"
          alt="Previous"
          width={6}
          height={6}
        />
        <p className="hidden md:block text-sm leading-[150%]">Prev</p>
      </Button>

      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                w-10 h-10 rounded-md text-sm font-medium transition-colors cursor-pointer 
                flex items-center justify-center
                ${
                  isActive
                    ? "bg-[#282828] text-[#E0E0E0]"
                    : "bg-[#F8F8F8] text-[#404040] border border-[#D0D0D0] hover:bg-[#F0F0F0]"
                }
              `}
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
        className="h-full px-4 py-[9.5px] gap-4"
      >
        <p className="hidden md:block text-sm leading-[150%]">Next</p>
        <Image
          src="/assets/images/icon-caret-right.svg"
          alt="Next"
          width={6}
          height={6}
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
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);

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
        <div className="mb-6 w-full">
          <div className="w-full flex flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="w-full lg:w-[320px]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search transaction"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-[45px]"
                />
                <Image
                  src="/assets/images/icon-search.svg"
                  alt="Search"
                  width={14}
                  height={14}
                  className="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
                />
              </div>
            </div>

            {/* Category Filter and Sort */}
            <div className="flex gap-6 flex-row w-auto md:w-full lg:justify-end">
              <div className="relative flex flex-row gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="sm:hidden size-[45px] rounded-lg bg-transparent p-0 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Open sort options"
                  aria-haspopup="listbox"
                  aria-expanded={isSortSelectOpen}
                  onClick={() => setIsSortSelectOpen(true)}
                >
                  <Image
                    src="/assets/images/icon-sort-mobile.svg"
                    alt=""
                    width={16}
                    height={15}
                    className="shrink-0"
                  />
                </Button>
                <span className="hidden sm:inline text-xs font-medium text-gray-500">
                  Category
                </span>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setIsCategorySelectOpen(false);
                  }}
                  open={isCategorySelectOpen}
                  onOpenChange={setIsCategorySelectOpen}
                >
                  <SelectTrigger
                    aria-label="Category"
                    className="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-[45px] sm:w-[180px] sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        showIndicator={false}
                        className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200 last:border-b-0 data-[state=checked]:font-semibold data-[state=checked]:text-gray-900 data-[highlighted]:bg-gray-100"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="relative flex flex-row gap-2 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="sm:hidden size-[45px] rounded-lg bg-transparent p-0 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Open category filter"
                  aria-haspopup="listbox"
                  aria-expanded={isCategorySelectOpen}
                  onClick={() => setIsCategorySelectOpen(true)}
                >
                  <Image
                    src="/assets/images/icon-filter-mobile.svg"
                    alt=""
                    width={18}
                    height={16}
                    className="shrink-0"
                  />
                </Button>

                <span className="hidden sm:inline text-xs font-medium text-gray-500">
                  Sort by
                </span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    setIsSortSelectOpen(false);
                  }}
                  open={isSortSelectOpen}
                  onOpenChange={setIsSortSelectOpen}
                >
                  <SelectTrigger
                    aria-label="Sort by"
                    className="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-[45px] sm:w-[150px] sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    align="end"
                    className="min-w-[164px] rounded-2xl border border-gray-200 bg-white py-1 shadow-[0px_16px_40px_rgba(15,23,42,0.15)]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        showIndicator={false}
                        className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200 last:border-b-0 data-[state=checked]:font-semibold data-[state=checked]:text-gray-900 data-[highlighted]:bg-gray-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Table Header */}
          <div className="hidden grid-cols-4 text-xs text-gray-500 px-0 pt-2 pb-3 border-b border-gray-200 sm:grid">
            <div>Recipient / Sender</div>
            <div>Category</div>
            <div>Transaction Date</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Transactions List */}
          <div>
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
        </div>
      </Card>
    </div>
  );
}
