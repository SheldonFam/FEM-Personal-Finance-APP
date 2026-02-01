import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { BudgetItem } from "./BudgetItem";
import BudgetDonutChart from "@/components/Charts/BudgetDonutChart";
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
}
