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
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
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
          <p className="text-[32px] leading-none font-bold text-[#201F24]">
            ${totalSpent.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-[#696868] mt-2">
            of ${totalLimit.toLocaleString("en-US")} limit
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
    <div className="space-y-3 mt-6">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-600">{category.name}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm text-gray-900">
              ${category.spent.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
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
