import type { AlertLevel } from "@/lib/budgetAlerts";

interface BudgetItemProps {
  category: string;
  amount: number;
  color: string;
  alertLevel?: AlertLevel;
}

export function BudgetItem({ category, amount, color, alertLevel }: BudgetItemProps) {
  return (
    <div className="flex items-start gap-4 min-w-0">
      <div
        className="w-1 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-finance-grey truncate">{category}</span>
          {alertLevel === "exceeded" && (
            <span
              className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
              role="img"
              aria-label="Budget exceeded"
              title="Budget exceeded"
            />
          )}
          {alertLevel === "warning" && (
            <span
              className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"
              role="img"
              aria-label="Approaching budget limit"
              title="Approaching budget limit"
            />
          )}
        </div>
        <span className="font-bold text-sm text-finance-navy tabular-nums">
          ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
