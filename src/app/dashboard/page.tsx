"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/Dashboard/StatCard";
import { TransactionItem } from "@/components/Dashboard/TransactionItem";
import { PotItem } from "@/components/Dashboard/PotItem";
import { BudgetItem } from "@/components/Dashboard/BudgetItem";
import { RecurringBillCard } from "@/components/Dashboard/RecurringBillCard";
import { SectionHeader } from "@/components/Dashboard/SectionHeader";
import BudgetDonutChart from "@/components/Charts/BudgetDonutChart";
import Image from "next/image";
import { useFinanceData, useRecurringBills } from "@/hooks/useFinanceData";
import type { Transaction, Budget, Pot } from "@/lib/types";

// Loading Skeleton Component
const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Summary Cards Component
const SummaryCards = ({
  current,
  income,
  expenses,
  isLoading,
}: {
  current: number;
  income: number;
  expenses: number;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <LoadingSkeleton className="h-[120px]" />
        <LoadingSkeleton className="h-[120px]" />
        <LoadingSkeleton className="h-[120px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <StatCard label="Current Balance" amount={current} variant="dark" />
      <StatCard label="Income" amount={income} variant="light" />
      <StatCard label="Expenses" amount={expenses} variant="light" />
    </div>
  );
};

// Pots Component
const PotsSection = ({
  pots,
  isLoading,
}: {
  pots: Pot[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader title="Pots" href="/pots" linkText="See Details" />
        <div className="flex items-start gap-5 flex-col lg:flex-row">
          <LoadingSkeleton className="h-[100px] w-full lg:flex-1" />
          <div className="w-full lg:flex-1 grid grid-cols-2 gap-4">
            <LoadingSkeleton className="h-[50px]" />
            <LoadingSkeleton className="h-[50px]" />
            <LoadingSkeleton className="h-[50px]" />
            <LoadingSkeleton className="h-[50px]" />
          </div>
        </div>
      </Card>
    );
  }

  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);
  const displayPots = pots.slice(0, 4);

  return (
    <Card className="p-8">
      <SectionHeader title="Pots" href="/pots" linkText="See Details" />

      <div className="flex items-start gap-5 flex-col lg:flex-row">
        {/* Total Saved */}
        <div className="bg-[#F8F4F0] rounded-xl p-5 flex items-center gap-4 w-full lg:flex-1">
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
              ${totalSaved.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Individual Pots */}
        <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPots.map((pot, index) => (
            <PotItem
              key={index}
              label={pot.name}
              amount={pot.total}
              color={pot.theme}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

// Transactions Component
const TransactionsSection = ({
  transactions,
  isLoading,
}: {
  transactions: Transaction[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader
          title="Transactions"
          href="/transactions"
          linkText="View All"
        />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} className="h-[60px]" />
          ))}
        </div>
      </Card>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="p-8">
      <SectionHeader
        title="Transactions"
        href="/transactions"
        linkText="View All"
      />

      <div className="space-y-1">
        {recentTransactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            name={transaction.name}
            amount={Math.abs(transaction.amount)}
            date={formatDate(transaction.date)}
            avatar={transaction.avatar}
            isPositive={transaction.amount > 0}
          />
        ))}
      </div>
    </Card>
  );
};

// Budgets Component
const BudgetsSection = ({
  budgets,
  transactions,
  isLoading,
}: {
  budgets: Budget[];
  transactions: Transaction[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader title="Budgets" href="/budgets" linkText="See Details" />
        <div className="flex items-center gap-4 flex-col lg:flex-row">
          <LoadingSkeleton className="w-[240px] h-[240px] rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <LoadingSkeleton className="h-[40px]" />
            <LoadingSkeleton className="h-[40px]" />
            <LoadingSkeleton className="h-[40px]" />
            <LoadingSkeleton className="h-[40px]" />
          </div>
        </div>
      </Card>
    );
  }

  // Calculate spent amount for each budget category
  const budgetCategories = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      name: budget.category,
      spent: Math.min(spent, budget.maximum),
      limit: budget.maximum,
      color: budget.theme,
    };
  });

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLimit = budgetCategories.reduce((sum, cat) => sum + cat.limit, 0);

  return (
    <Card className="p-8">
      <SectionHeader title="Budgets" href="/budgets" linkText="See Details" />

      <div className="flex items-center gap-4 flex-col lg:flex-row">
        {/* Donut Chart */}
        <div className="flex-shrink-0 w-full sm:w-[240px] lg:w-[200px] xl:w-[240px]">
          <BudgetDonutChart
            categories={budgetCategories}
            totalSpent={totalSpent}
            totalLimit={totalLimit}
          />
        </div>

        {/* Budget Categories */}
        <div className="flex-1 py-2 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full h-full">
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
const RecurringBillsSection = ({
  recurringBills,
  isLoading,
}: {
  recurringBills: Transaction[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="h-full p-8">
        <SectionHeader
          title="Recurring Bills"
          href="/recurring-bills"
          linkText="See Details"
        />
        <div className="space-y-3">
          <LoadingSkeleton className="h-[60px]" />
          <LoadingSkeleton className="h-[60px]" />
          <LoadingSkeleton className="h-[60px]" />
        </div>
      </Card>
    );
  }

  // Calculate bill summaries
  const now = new Date();
  const currentDay = now.getDate();

  const paidBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    return billDate.getDate() < currentDay;
  });

  const upcomingBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    return billDate.getDate() >= currentDay;
  });

  const dueSoonBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    const dayOfMonth = billDate.getDate();
    return dayOfMonth >= currentDay && dayOfMonth <= currentDay + 5;
  });

  const paidAmount = paidBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );
  const upcomingAmount = upcomingBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );
  const dueSoonAmount = dueSoonBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );

  const bills = [
    { label: "Paid Bills", amount: paidAmount, borderColor: "#277C78" },
    { label: "Total Upcoming", amount: upcomingAmount, borderColor: "#F2CDAC" },
    { label: "Due Soon", amount: dueSoonAmount, borderColor: "#82C9D7" },
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
  const { balance, transactions, budgets, pots, isLoading } = useFinanceData();
  const { data: recurringBills, isLoading: isLoadingBills } =
    useRecurringBills();

  return (
    <div className="bg-[#F8F4F0] p-4 md:p-8 pb-[68px] sm:pb-[90px] md:pb-8">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
          Overview
        </h1>

        {/* Summary Cards */}
        <SummaryCards
          current={balance.data?.current ?? 0}
          income={balance.data?.income ?? 0}
          expenses={balance.data?.expenses ?? 0}
          isLoading={balance.isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[minmax(500px,1fr)_minmax(400px,600px)] gap-6">
          {/* Left Column - Flexible width */}
          <div className="flex flex-col gap-4 md:gap-6">
            <PotsSection pots={pots.data ?? []} isLoading={pots.isLoading} />
            <TransactionsSection
              transactions={transactions.data ?? []}
              isLoading={transactions.isLoading}
            />
          </div>

          {/* Right Column - Flexible width */}
          <div className="flex flex-col gap-4 md:gap-6">
            <BudgetsSection
              budgets={budgets.data ?? []}
              transactions={transactions.data ?? []}
              isLoading={isLoading}
            />
            <RecurringBillsSection
              recurringBills={recurringBills ?? []}
              isLoading={isLoadingBills}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
