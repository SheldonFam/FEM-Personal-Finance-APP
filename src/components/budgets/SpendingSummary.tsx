import { Budget, Transaction } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { BudgetChartWithLegend } from "@/components/charts/budgetDonutChart";

interface SpendingSummaryProps {
  budgetsWithSpending: Array<{
    budget: Budget;
    spent: number;
    transactions: Transaction[];
  }>;
}

export const SpendingSummary = ({
  budgetsWithSpending,
}: SpendingSummaryProps) => {
  const totalBudget = budgetsWithSpending.reduce(
    (sum, { budget }) => sum + budget.maximum,
    0
  );
  const totalSpent = budgetsWithSpending.reduce(
    (sum, { spent }) => sum + spent,
    0
  );

  // Transform data for the chart component
  const categories = budgetsWithSpending.map(({ budget, spent }) => ({
    name: budget.category,
    spent: spent,
    limit: budget.maximum,
    color: budget.theme,
  }));

  return (
    <Card className="p-6 xl:sticky xl:top-8 border-b border-gray-200 bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Spending Summary</h2>
      <BudgetChartWithLegend
        categories={categories}
        totalSpent={totalSpent}
        totalLimit={totalBudget}
      />
    </Card>
  );
};
