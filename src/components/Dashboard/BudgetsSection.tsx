import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { BudgetItem } from "./BudgetItem";
import { getBudgetAlertStatus } from "@/lib/budgetAlerts";

const BudgetDonutChart = dynamic(
  () => import("@/components/Charts/BudgetDonutChart"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-[240px] h-[240px] rounded-full" />
    ),
  }
);
import type { Budget, Transaction } from "@/lib/types";

interface BudgetsSectionProps {
  budgets: Budget[];
  transactions: Transaction[];
  isLoading: boolean;
}

export function BudgetsSection({
  budgets,
  transactions,
  isLoading,
}: BudgetsSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader title="Budgets" href="/budgets" linkText="See Details" />
        <div className="flex items-center gap-4 flex-col lg:flex-row">
          <Skeleton className="w-[240px] h-[240px] rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
            <Skeleton className="h-[40px]" />
          </div>
        </div>
      </Card>
    );
  }

  // Build spending index once, then look up per budget (avoids O(n*m))
  const spentByCategory = new Map<string, number>();
  for (const t of transactions) {
    if (t.amount < 0) {
      spentByCategory.set(
        t.category,
        (spentByCategory.get(t.category) ?? 0) + Math.abs(t.amount),
      );
    }
  }

  let totalSpent = 0;
  let totalLimit = 0;

  const budgetCategories = budgets.map((budget) => {
    const spent = Math.min(spentByCategory.get(budget.category) ?? 0, budget.maximum);
    totalSpent += spent;
    totalLimit += budget.maximum;

    return {
      name: budget.category,
      spent,
      limit: budget.maximum,
      color: budget.theme,
    };
  });

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
          {budgetCategories.map((category) => {
            const alert = getBudgetAlertStatus(category.spent, category.limit);
            return (
              <BudgetItem
                key={category.name}
                category={category.name}
                amount={category.limit}
                color={category.color}
                alertLevel={alert.level}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
