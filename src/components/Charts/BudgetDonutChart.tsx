"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Budget category type
export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

interface BudgetDonutChartProps {
  categories: BudgetCategory[];
  totalSpent: number;
  totalLimit: number;
  className?: string;
}

export default function BudgetDonutChart({
  categories,
  totalSpent,
  totalLimit,
  className = "",
}: BudgetDonutChartProps) {
  // Prepare data for the chart (only show spent amounts for each category)
  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.spent,
    color: cat.color,
  }));

  return (
    <div className={`relative ${className}`}>
      {/* Donut Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={95}
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
            startAngle={90} // <- Rotate starting point
            endAngle={-270} // <- Makes it go clockwise visually
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-4xl leading-none font-bold text-gray-900 tabular-nums">
            ${Math.round(totalSpent).toLocaleString("en-US")}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            of ${Math.round(totalLimit).toLocaleString("en-US")} limit
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Legend Component (Optional)
// ============================================
interface BudgetLegendProps {
  categories: BudgetCategory[];
}

export function BudgetLegend({ categories }: BudgetLegendProps) {
  return (
    <div className="space-y-0 mt-6">
      {categories.map((category, index) => (
        <div
          key={category.name}
          className={`flex items-center justify-between ${
            index < categories.length - 1
              ? "pb-3 mb-3 border-b border-gray-200"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-600">{category.name}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm text-gray-900 tabular-nums">
              ${category.spent.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 tabular-nums">
              of ${category.limit.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Combined Component (Chart + Legend)
// ============================================
interface BudgetChartWithLegendProps {
  categories: BudgetCategory[];
  totalSpent: number;
  totalLimit: number;
  className?: string;
}

export function BudgetChartWithLegend({
  categories,
  totalSpent,
  totalLimit,
  className = "",
}: BudgetChartWithLegendProps) {
  return (
    <div className={className}>
      <BudgetDonutChart
        categories={categories}
        totalSpent={totalSpent}
        totalLimit={totalLimit}
      />
      <BudgetLegend categories={categories} />
    </div>
  );
}
