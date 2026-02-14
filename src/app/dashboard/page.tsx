"use client";

import { useFinanceData, useRecurringBills } from "@/hooks/useFinanceData";
import { SummaryCards } from "@/components/Dashboard/SummaryCards";
import { PotsSection } from "@/components/Dashboard/PotsSection";
import { TransactionsSection } from "@/components/Dashboard/TransactionsSection";
import { BudgetsSection } from "@/components/Dashboard/BudgetsSection";
import { RecurringBillsSection } from "@/components/Dashboard/RecurringBillsSection";
import { DataErrorAlert } from "@/components/DataErrorAlert";
import { PageLayout } from "@/components/PageLayout";

export default function DashboardPage() {
  const { balance, transactions, budgets, pots, isLoading, isError } =
    useFinanceData();
  const {
    data: recurringBills,
    isLoading: isLoadingBills,
    isError: isBillsError,
  } = useRecurringBills();

  return (
    <PageLayout title="Overview">
      {(isError || isBillsError) && <DataErrorAlert />}

        {/* Summary Cards */}
        <SummaryCards
          current={balance.data?.current ?? 0}
          income={balance.data?.income ?? 0}
          expenses={balance.data?.expenses ?? 0}
          isLoading={balance.isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-[minmax(500px,1fr)_minmax(400px,600px)] gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4 md:gap-6">
            <PotsSection pots={pots.data ?? []} isLoading={pots.isLoading} />
            <TransactionsSection
              transactions={transactions.data ?? []}
              isLoading={transactions.isLoading}
            />
          </div>

          {/* Right Column */}
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
    </PageLayout>
  );
}
