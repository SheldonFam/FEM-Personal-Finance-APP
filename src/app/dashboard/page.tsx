"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { useSearchParams } from "next/navigation";
import { StatCard } from "@/components/Dashboard/StatCard";
import { TransactionItem } from "@/components/Dashboard/TransactionItem";
import { PotItem } from "@/components/Dashboard/PotItem";
import { BudgetItem } from "@/components/Dashboard/BudgetItem";
import { RecurringBillCard } from "@/components/Dashboard/RecurringBillCard";
import { SectionHeader } from "@/components/Dashboard/SectionHeader";
import BudgetDonutChart from "@/components/Charts/BudgetDonutChart";
import Image from "next/image";

// Global sidebar is provided in root layout; this page renders content only

// Summary Cards Component
const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <StatCard label="Current Balance" amount={4836.0} variant="dark" />
      <StatCard label="Income" amount={3814.25} variant="light" />
      <StatCard label="Expenses" amount={1700.5} variant="light" />
    </div>
  );
};

// Pots Component
const PotsSection = () => {
  const pots = [
    { name: "Savings", amount: 159, color: "#277C78" },
    { name: "Gift", amount: 40, color: "#82C9D7" },
    { name: "Concert Ticket", amount: 110, color: "#626070" },
    { name: "New Laptop", amount: 10, color: "#F2CDAC" },
  ];

  return (
    <Card className="p-8">
      <SectionHeader title="Pots" href="/pots" linkText="See Details" />

      <div className="flex items-start gap-5 flex-col md:flex-row">
        {/* Total Saved */}
        <div className="bg-[#F8F4F0] rounded-xl p-5 flex items-center gap-4 w-full md:flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Image
              src="/assets/images/icon-pot.svg"
              alt="Pot"
              width={20}
              height={20}
            />
          </div>
          <div>
            <p className="text-sm text-[#696868] mb-1">Total Saved</p>
            <p className="text-[32px] leading-[1.2] font-bold text-[#201F24]">
              $850
            </p>
          </div>
        </div>

        {/* Individual Pots */}
        <div className="w-full md:flex-1 grid grid-cols-2 gap-4">
          {pots.map((pot, index) => (
            <PotItem
              key={index}
              label={pot.name}
              amount={pot.amount}
              color={pot.color}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Transactions Component
const TransactionsSection = () => {
  const transactions = [
    {
      name: "Emma Richardson",
      amount: 75.5,
      date: "19 Aug 2024",
      avatar: "./assets/images/avatars/emma-richardson.jpg",
      isPositive: true,
    },
    {
      name: "Savory Bites Bistro",
      amount: 55.5,
      date: "19 Aug 2024",
      avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
      isPositive: false,
    },
    {
      name: "Daniel Carter",
      amount: 42.3,
      date: "18 Aug 2024",
      avatar: "./assets/images/avatars/daniel-carter.jpg",
      isPositive: false,
    },
    {
      name: "Sun Park",
      amount: 120.0,
      date: "17 Aug 2024",
      avatar: "./assets/images/avatars/sun-park.jpg",
      isPositive: true,
    },
    {
      name: "Urban Services Hub",
      amount: 65.0,
      date: "17 Aug 2024",
      avatar: "./assets/images/avatars/urban-services-hub.jpg",
      isPositive: false,
    },
  ];

  return (
    <Card className="p-8">
      <SectionHeader
        title="Transactions"
        href="/transactions"
        linkText="View All"
      />

      <div className="space-y-1">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            name={transaction.name}
            amount={transaction.amount}
            date={transaction.date}
            avatar={transaction.avatar}
            isPositive={transaction.isPositive}
          />
        ))}
      </div>
    </Card>
  );
};

// Budgets Component
const BudgetsSection = () => {
  const budgetCategories = [
    { name: "Entertainment", spent: 50.0, limit: 50.0, color: "#277C78" },
    { name: "Bills", spent: 750.0, limit: 750.0, color: "#82C9D7" },
    { name: "Dining Out", spent: 75.0, limit: 75.0, color: "#F2CDAC" },
    { name: "Personal Care", spent: 100.0, limit: 100.0, color: "#626070" },
  ];

  const totalSpent = 338;
  const totalLimit = 975;

  return (
    <Card className="p-8">
      <SectionHeader title="Budgets" href="/budgets" linkText="See Details" />

      <div className="flex items-center gap-4 flex-col md:flex-row">
        {/* Donut Chart */}
        <div className="flex-shrink-0 w-[240px]">
          <BudgetDonutChart
            categories={budgetCategories}
            totalSpent={totalSpent}
            totalLimit={totalLimit}
          />
        </div>

        {/* Budget Categories */}
        <div className="flex-1 py-2 min-w-0 grid grid-cols-2 md:grid-cols-1 gap-4 w-full h-full">
          {budgetCategories.map((category, index) => (
            <BudgetItem
              key={index}
              category={category.name}
              amount={category.limit}
              color={category.color}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Recurring Bills Component
const RecurringBillsSection = () => {
  const bills = [
    { label: "Paid Bills", amount: 190.0, borderColor: "#277C78" },
    { label: "Total Upcoming", amount: 194.98, borderColor: "#F2CDAC" },
    { label: "Due Soon", amount: 59.98, borderColor: "#82C9D7" },
  ];

  return (
    <Card className="h-full p-8">
      <SectionHeader
        title="Recurring Bills"
        href="/recurring-bills"
        linkText="See Details"
      />

      <div className="space-y-3">
        {bills.map((bill, index) => (
          <RecurringBillCard
            key={index}
            label={bill.label}
            amount={bill.amount}
            borderColor={bill.borderColor}
          />
        ))}
      </div>
    </Card>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";
  const titleMap: Record<string, string> = {
    overview: "Overview",
    transactions: "Transactions",
    budgets: "Budgets",
    pots: "Pots",
    bills: "Recurring Bills",
  };
  const pageTitle = titleMap[activeTab] ?? "Overview";

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
        {pageTitle}
      </h1>

      {/* Summary Cards */}
      <div className="w-full">
        <SummaryCards />
      </div>

      {/* Main Content Grid */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Column - 608px */}
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <PotsSection />
            <div className="flex-1">
              <TransactionsSection />
            </div>
          </div>

          {/* Right Column - 428px */}
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <BudgetsSection />
            <div className="flex-1">
              <RecurringBillsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
