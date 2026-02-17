import { Card } from "../ui/Card";

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
      <p className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
        $
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Card>
  );
}
