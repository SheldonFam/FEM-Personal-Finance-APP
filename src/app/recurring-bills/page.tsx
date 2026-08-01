"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import {
  processRecurringBills,
  summariseRecurringBills,
} from "@/lib/billing/recurringBills";
import { formatCurrency } from "@/lib/formatters";
import { useBillFilters } from "@/hooks/useBillFilters";
import { BillRow } from "@/components/RecurringBills/BillRow";
import { useRecurringBills } from "@/hooks/useFinanceData";
import { useCurrentDate } from "@/hooks/useCurrentDate";
import { DataErrorAlert } from "@/components/DataErrorAlert";
import { PageLayout } from "@/components/PageLayout";
import { FilterToolbar } from "@/components/Filters/FilterToolbar";

export default function RecurringBillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest" | "a-z" | "z-a"
  >("latest");
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);

  const { data: recurringTransactions = [], isLoading, isError } = useRecurringBills();

  // Process bills. The reference date is a dependency rather than the default
  // read inside processRecurringBills, so statuses follow the calendar rather
  // than freezing at whatever the clock said when the bills last loaded.
  const today = useCurrentDate();
  const allBills = useMemo(
    () => processRecurringBills(recurringTransactions, today),
    [recurringTransactions, today]
  );

  const summary = summariseRecurringBills(allBills);

  // Filter and sort bills
  const filteredAndSortedBills = useBillFilters({
    bills: allBills,
    searchQuery,
    sortBy,
  });

  return (
    <PageLayout title="Recurring Bills">
      {isError && <DataErrorAlert />}

      <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
        <div className="space-y-6 lg:w-80 flex-shrink-0">
          {/* Total Bills Card */}
          <Card className="bg-finance-navy text-white p-6 border-0">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/assets/images/icon-recurring-bills.svg"
                alt="Recurring Bills"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Bills</p>
            <p className="text-4xl font-bold tabular-nums">
              {formatCurrency(summary.total)}
            </p>
          </Card>

          {/* Summary Card */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
            <div className="space-y-4">
              {/* Paid Bills */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-600">Paid Bills</span>
                <span className="font-bold text-sm text-gray-900 tabular-nums">
                  {summary.paidCount} ({formatCurrency(summary.paidAmount)})
                </span>
              </div>

              {/* Total Upcoming */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Upcoming</span>
                <span className="font-bold text-sm text-gray-900 tabular-nums">
                  {summary.upcomingCount} (
                  {formatCurrency(summary.upcomingAmount)})
                </span>
              </div>

              {/* Due Soon */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Due Soon</span>
                <span className="font-bold text-sm text-red-600 tabular-nums">
                  {summary.dueSoonCount} ({formatCurrency(summary.dueSoonAmount)})
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bills List */}
        <Card className="overflow-hidden flex-1 mt-6 lg:mt-0">
          {/* Search and Filter Bar */}
          <div className="p-6 bg-white">
            <FilterToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchLabel="Search bills"
              searchPlaceholder="Search bills"
              sortValue={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Table Header */}
          <div className="hidden grid-cols-3 text-xs text-gray-500 px-6 pt-2 pb-3 border-b border-gray-200 sm:grid">
            <div>Bill Title</div>
            <div>Due Date</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Bills List */}
          <div className="bg-white">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-[60px] animate-pulse bg-gray-200 rounded" />
                ))}
              </div>
            ) : filteredAndSortedBills.length > 0 ? (
              filteredAndSortedBills.map((bill) => (
                <BillRow key={bill.name} bill={bill} />
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-sm">
                  {searchQuery
                    ? "No bills found matching your search."
                    : "No recurring bills found."}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
