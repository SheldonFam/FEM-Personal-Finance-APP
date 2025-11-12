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

interface RecurringBill extends Transaction {
  dayOfMonth: number;
  isPaid: boolean;
  isDueSoon: boolean;
}

// Constants
const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
];

// Helper Functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
};

const getDayOfMonth = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getDate();
};

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Process recurring bills from transactions
const REFERENCE_DATE = new Date("2024-08-18T00:00:00Z");

const processRecurringBills = (
  transactions: Transaction[]
): RecurringBill[] => {
  const recurringTransactions = transactions
    .filter((t) => t.recurring)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const uniqueByName = Array.from(
    recurringTransactions
      .reduce((map, transaction) => {
        if (!map.has(transaction.name)) {
          map.set(transaction.name, transaction);
        }
        return map;
      }, new Map<string, Transaction>())
      .values()
  );
  const today = REFERENCE_DATE;
  const currentDay = today.getDate();

  return uniqueByName.map((transaction) => {
    const dayOfMonth = getDayOfMonth(transaction.date);
    const isPaid = dayOfMonth < currentDay;
    const daysUntilDue = dayOfMonth - currentDay;
    const isDueSoon = daysUntilDue > 0 && daysUntilDue <= 5;

    return {
      ...transaction,
      dayOfMonth,
      isPaid,
      isDueSoon,
    };
  });
};

// Bill Row Component
const BillRow = ({ bill }: { bill: RecurringBill }) => {
  const avatarPath = normalizeImagePath(bill.avatar);
  const dueLabel = `Monthly - ${bill.dayOfMonth}${getOrdinalSuffix(
    bill.dayOfMonth
  )}`;
  const dueDateColor = bill.isPaid ? "text-[#277C78]" : "text-[#696868]";

  return (
    <div className="px-4 sm:px-6 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={bill.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-sm text-gray-900 truncate">
            {bill.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-xs ${dueDateColor}`}>
            <span>{dueLabel}</span>
            {bill.isPaid && (
              <Image
                src="/assets/images/icon-bill-paid.svg"
                alt="Bill paid"
                width={12}
                height={12}
                className="shrink-0"
              />
            )}
            {!bill.isPaid && bill.isDueSoon && (
              <Image
                src="/assets/images/icon-bill-due.svg"
                alt="Bill due soon"
                width={12}
                height={12}
                className="shrink-0"
              />
            )}
          </div>
          <span
            className={`font-bold text-sm ${
              bill.isDueSoon && !bill.isPaid
                ? "text-[#C94736]"
                : "text-gray-900"
            }`}
          >
            {formatCurrency(bill.amount)}
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={bill.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-sm text-gray-900 truncate">
            {bill.name}
          </p>
        </div>
        <div
          className={`flex items-center justify-center gap-2 text-sm ${dueDateColor}`}
        >
          <span className="whitespace-nowrap">{dueLabel}</span>
          {bill.isPaid && (
            <Image
              src="/assets/images/icon-bill-paid.svg"
              alt="Bill paid"
              width={14}
              height={14}
              className="shrink-0"
            />
          )}
          {bill.isDueSoon && !bill.isPaid && (
            <Image
              src="/assets/images/icon-bill-due.svg"
              alt="Bill due soon"
              width={14}
              height={14}
              className="shrink-0"
            />
          )}
        </div>
        <div className="text-right">
          <span
            className={`font-bold text-sm ${
              bill.isDueSoon && !bill.isPaid
                ? "text-[#C94736]"
                : "text-gray-900"
            }`}
          >
            {formatCurrency(bill.amount)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function RecurringBillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);

  // Process bills
  const allBills = useMemo(
    () => processRecurringBills(transactionsData.transactions),
    []
  );

  // Calculate summary
  const summary = useMemo(() => {
    const paidBills = allBills.filter((b) => b.isPaid);
    const upcomingBills = allBills.filter((b) => !b.isPaid);
    const dueSoonBills = allBills.filter((b) => b.isDueSoon);

    return {
      total: Math.abs(allBills.reduce((sum, b) => sum + b.amount, 0)),
      paidCount: paidBills.length,
      paidAmount: Math.abs(paidBills.reduce((sum, b) => sum + b.amount, 0)),
      upcomingCount: upcomingBills.length,
      upcomingAmount: Math.abs(
        upcomingBills.reduce((sum, b) => sum + b.amount, 0)
      ),
      dueSoonCount: dueSoonBills.length,
      dueSoonAmount: Math.abs(
        dueSoonBills.reduce((sum, b) => sum + b.amount, 0)
      ),
    };
  }, [allBills]);

  // Filter and sort bills
  const filteredAndSortedBills = useMemo(() => {
    let filtered = allBills;

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
  }, [allBills, searchQuery, sortBy]);

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
                      setSortBy(value);
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
