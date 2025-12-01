"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import transactionsData from "@/../data.json";
import { Transaction, RecurringBill } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants/constants";
import { formatCurrency } from "@/lib/formatters";
import { processRecurringBills } from "@/lib/billing/recurringBills";
import { useBillFilters } from "@/lib/hooks/useBillFilters";
import { BillRow } from "@/components/recurring-bills/billRow";

export default function RecurringBillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest" | "a-z" | "z-a"
  >("latest");
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);

  // Process bills (static data, no need for memoization)
  const allBills = processRecurringBills(
    transactionsData.transactions as Transaction[]
  );

  // Calculate summary (static data, no need for memoization)
  const paidBills = allBills.filter((b) => b.isPaid);
  const upcomingBills = allBills.filter((b) => !b.isPaid);
  const dueSoonBills = allBills.filter((b) => b.isDueSoon);

  const summary = {
    total: Math.abs(allBills.reduce((sum, b) => sum + b.amount, 0)),
    paidCount: paidBills.length,
    paidAmount: Math.abs(paidBills.reduce((sum, b) => sum + b.amount, 0)),
    upcomingCount: upcomingBills.length,
    upcomingAmount: Math.abs(
      upcomingBills.reduce((sum, b) => sum + b.amount, 0)
    ),
    dueSoonCount: dueSoonBills.length,
    dueSoonAmount: Math.abs(dueSoonBills.reduce((sum, b) => sum + b.amount, 0)),
  };

  // Filter and sort bills
  const filteredAndSortedBills = useBillFilters({
    bills: allBills,
    searchQuery,
    sortBy,
  });

  return (
    <div className="min-h-screen bg-[#F8F4F0] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Recurring Bills
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
          <div className="space-y-6 lg:w-80 flex-shrink-0">
            {/* Total Bills Card */}
            <Card className="bg-[#201F24] text-white p-6 border-0">
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
              <p className="text-4xl font-bold">${summary.total.toFixed(2)}</p>
            </Card>

            {/* Summary Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
              <div className="space-y-4">
                {/* Paid Bills */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Paid Bills</span>
                  <span className="font-bold text-sm text-gray-900">
                    {summary.paidCount} (${summary.paidAmount.toFixed(2)})
                  </span>
                </div>

                {/* Total Upcoming */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Upcoming</span>
                  <span className="font-bold text-sm text-gray-900">
                    {summary.upcomingCount} ($
                    {summary.upcomingAmount.toFixed(2)})
                  </span>
                </div>

                {/* Due Soon */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">Due Soon</span>
                  <span className="font-bold text-sm text-red-600">
                    {summary.dueSoonCount} (${summary.dueSoonAmount.toFixed(2)})
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Bills List */}
          <Card className="overflow-hidden flex-1 mt-6 lg:mt-0">
            {/* Search and Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 p-6 bg-white sm:flex-nowrap sm:justify-between">
              <div className="flex-1 min-w-[200px] sm:max-w-[320px]">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search bills"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[45px] pr-12"
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

              <div className="flex flex-row items-center gap-3 md:gap-6">
                <div className="relative flex flex-row items-center gap-2">
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
                    <SelectTrigger className="absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-[45px] sm:w-[150px] sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300">
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

            {/* Table Header */}
            <div className="hidden grid-cols-3 text-xs text-gray-500 px-6 pt-2 pb-3 border-b border-gray-200 sm:grid">
              <div>Bill Title</div>
              <div>Due Date</div>
              <div className="text-right">Amount</div>
            </div>

            {/* Bills List */}
            <div className="bg-white">
              {filteredAndSortedBills.length > 0 ? (
                filteredAndSortedBills.map((bill, index) => (
                  <BillRow key={`${bill.name}-${index}`} bill={bill} />
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
      </div>
    </div>
  );
}
