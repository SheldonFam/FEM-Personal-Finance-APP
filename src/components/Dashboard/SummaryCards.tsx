import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "./StatCard";

interface SummaryCardsProps {
  current: number;
  income: number;
  expenses: number;
  isLoading: boolean;
}

export function SummaryCards({
  current,
  income,
  expenses,
  isLoading,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
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
}
