"use client";

import React, { Suspense, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTransactions } from "@/hooks/useFinanceData";
import { DataErrorAlert } from "@/components/DataErrorAlert";
import { PageLayout } from "@/components/PageLayout";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { usePagination } from "@/hooks/usePagination";
import { TransactionRow } from "@/components/Transactions/TransactionRow";
import { Pagination } from "@/components/ui/Pagination";
import { exportTransactionsToCsv } from "@/lib/exportCsv";
import { ImportTransactionsModal } from "@/components/Modals/ImportTransactionsModal";
import { FilterToolbar } from "@/components/Filters/FilterToolbar";
import { useTransactionUrlState } from "@/hooks/useTransactionUrlState";

/**
 * useSearchParams needs a Suspense boundary above it, so the page splits: this
 * shell stays prerenderable, and everything that depends on the URL lives in
 * TransactionsList below.
 */
export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsListFallback />}>
      <TransactionsList />
    </Suspense>
  );
}

function TransactionsListFallback() {
  return (
    <PageLayout title="Transactions">
      <Card className="p-6 sm:p-8">
        <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
      </Card>
    </PageLayout>
  );
}

function TransactionsList() {
  const {
    searchTerm,
    selectedCategory,
    sortBy,
    currentPage,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    setCurrentPage,
  } = useTransactionUrlState();

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
            <FilterToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchLabel="Search transactions"
              searchPlaceholder="Search transaction"
              sortValue={sortBy}
              onSortChange={setSortBy}
              category={{
                value: selectedCategory,
                onChange: setSelectedCategory,
              }}
            />
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
                paginatedTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
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
