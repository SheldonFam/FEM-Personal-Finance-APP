import { Card } from "../ui/Card";
import { formatCurrency } from "@/lib/formatters";

interface StatCardProps {
  label: string;
  amount: number;
  variant?: "dark" | "light";
  className?: string;
}

export function StatCard({
  label,
  amount,
  variant = "light",
  className = "",
}: StatCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={`p-5 md:p-6 min-w-0 ${
        isDark ? "bg-finance-navy text-white" : ""
      } ${className}`}
    >
      <p
        className={`text-xs sm:text-sm mb-2 md:mb-3 ${isDark ? "text-gray-300" : "text-gray-500"}`}
      >
        {label}
      </p>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold truncate tabular-nums">
        {/* Sign preserved: Current Balance can legitimately be negative, and
            an overdrawn account must not read as a positive one. */}
        {formatCurrency(amount, false)}
      </p>
    </Card>
  );
}
