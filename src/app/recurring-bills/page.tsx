"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
const processRecurringBills = (
  transactions: Transaction[]
): RecurringBill[] => {
  const recurringTransactions = transactions.filter((t) => t.recurring);
  const today = new Date();
  const currentDay = today.getDate();

  return recurringTransactions.map((transaction) => {
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

  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-6">
      {/* Bill Title with Avatar */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={avatarPath}
            alt={bill.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-bold text-sm text-gray-900 truncate">{bill.name}</p>
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-3 flex-1 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Monthly - {bill.dayOfMonth}
            {getOrdinalSuffix(bill.dayOfMonth)}
          </span>
          {bill.isPaid && (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {bill.isDueSoon && !bill.isPaid && (
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="flex-1 text-right">
        <span
          className={`font-bold text-sm ${
            bill.isDueSoon && !bill.isPaid ? "text-red-600" : "text-gray-900"
          }`}
        >
          {formatCurrency(bill.amount)}
        </span>
      </div>
    </div>
  );
};

// Main Component
export default function RecurringBillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

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
        sorted.sort((a, b) => b.dayOfMonth - a.dayOfMonth);
        break;
      case "oldest":
        sorted.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Bills Card */}
          <Card className="bg-[#201F24] text-white p-6 border-0 lg:col-span-1">
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
          <Card className="p-6 lg:col-span-2">
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
                  {summary.upcomingCount} (${summary.upcomingAmount.toFixed(2)})
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
        <Card className="overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-6 border-b border-gray-200 bg-white">
            <div className="relative flex-1 max-w-md">
              <Image
                src="/assets/images/icon-search.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search bills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sort by
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-white border border-gray-300 rounded-lg">
                  <SelectValue />
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

          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
              Bill Title
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wider text-center">
              Due Date
            </div>
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wider text-right">
              Amount
            </div>
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
  );
}
