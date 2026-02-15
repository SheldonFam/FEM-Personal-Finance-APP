import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { formatCurrency } from "@/lib/formatters";
import {
  calculateCategorySpending,
  type CategorySpending,
} from "@/lib/spendingAnalytics";
import type { Transaction } from "@/lib/types";

interface SpendingInsightsSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#277C78",
  Bills: "#82C9D7",
  "Dining Out": "#F2CDAC",
  "Personal Care": "#626B7F",
  General: "#98908B",
  Groceries: "#826CB0",
  Transportation: "#AF81BA",
  Lifestyle: "#597C7C",
  Shopping: "#C94736",
  Education: "#CAB361",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#98908B";
}

export function SpendingInsightsSection({
  transactions,
  isLoading,
}: SpendingInsightsSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader title="Spending Insights" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[48px]" />
          ))}
        </div>
      </Card>
    );
  }

  const categories = calculateCategorySpending(transactions);
  const top5 = categories.slice(0, 5);

  if (top5.length === 0) {
    return (
      <Card className="p-8">
        <SectionHeader title="Spending Insights" />
        <p className="text-sm text-gray-500 text-center py-4">
          No spending data available
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <SectionHeader
        title="Spending Insights"
        href="/transactions"
        linkText="See Details"
      />

      <div className="space-y-4">
        {top5.map((item: CategorySpending) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium">
                {item.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-bold">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-gray-400">
                  {item.transactionCount} txn{item.transactionCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: getCategoryColor(item.category),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
