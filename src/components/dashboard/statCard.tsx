import { Card } from "../ui/card";

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
      className={`px-5 md:px-6 ${
        isDark ? "bg-[#201F24] text-white" : ""
      } ${className}`}
    >
      <p
        className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-500"}`}
      >
        {label}
      </p>
      <p className="text-3xl font-bold">
        $
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Card>
  );
}
