"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import Image from "next/image";
import { useTransactions } from "@/hooks/useFinanceData";
import { DataErrorAlert } from "@/components/DataErrorAlert";
import { PageLayout } from "@/components/PageLayout";
import {
  TRANSACTION_CATEGORIES,
  SORT_OPTIONS,
} from "@/lib/constants/constants";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { usePagination } from "@/hooks/usePagination";
import { TransactionRow } from "@/components/Transactions/TransactionRow";
import { Pagination } from "@/components/ui/Pagination";
import { exportTransactionsToCsv } from "@/lib/exportCsv";
import { ImportTransactionsModal } from "@/components/Modals/ImportTransactionsModal";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Transactions");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest" | "a-z" | "z-a"
  >("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data: transactions = [], isLoading, isError } = useTransactions();

  // Filter and sort transactions
  const filteredAndSortedTransactions = useTransactionFilters({
    transactions,
    searchTerm,
    selectedCategory,
    sortBy,
  });

  // Pagination
  const { paginatedItems: paginatedTransactions, totalPages } = usePagination({
    items: filteredAndSortedTransactions,
    currentPage,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <PageLayout
      title="Transactions"
      action={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportTransactionsToCsv(filteredAndSortedTransactions)}
            disabled={isLoading || filteredAndSortedTransactions.length === 0}
          >
            Export CSV
          </Button>
        </div>
      }
    >
      {isError && <DataErrorAlert />}

      {/* Transactions Card */}
      <Card className="p-5 md:p-8">
          {/* Search and Filters */}
          <div className="mb-6 w-full overflow-hidden">
            <div className="w-full flex flex-row items-stretch sm:items-center gap-4 justify-between">
              {/* Search Input */}
              <div className="w-full sm:flex-1 lg:max-w-[320px]">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search transaction"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-11"
                    aria-label="Search transactions"
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
              <div className="flex gap-3 sm:gap-6 flex-row flex-shrink-0 min-w-0">
                {/* Sort By */}
                <div className="relative flex flex-row gap-2 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="sm:hidden size-11 rounded-lg bg-transparent p-0 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      aria-hidden="true"
                    />
                  </Button>

                  <span className="hidden sm:inline text-xs font-medium text-gray-500">
                    Sort by
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value as typeof sortBy);
                      setIsSortSelectOpen(false);
                    }}
                    open={isSortSelectOpen}
                    onOpenChange={setIsSortSelectOpen}
                  >
                    <SelectTrigger
                      aria-label="Sort by"
                      className="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-11 sm:w-[115px] md:w-[130px] lg:w-[150px] sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300"
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
                <div className="relative flex flex-row gap-2 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="sm:hidden size-11 rounded-lg bg-transparent p-0 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      aria-hidden="true"
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
                      className="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-11 sm:w-[140px] md:w-[160px] lg:w-[180px] sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_CATEGORIES.map((category) => (
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
              {isLoading ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse h-[60px] bg-gray-200 rounded"
                    />
                  ))}
                </div>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <TransactionRow key={index} transaction={transaction} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No transactions found</p>
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

      <ImportTransactionsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
      />
    </PageLayout>
  );
}
