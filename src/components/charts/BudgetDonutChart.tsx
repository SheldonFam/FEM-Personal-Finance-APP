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
  // Calculate remaining budget (shown as gray)
  const remaining = Math.max(0, totalLimit - totalSpent);

  // Prepare data for the chart
  const chartData = [
    ...categories.map((cat) => ({
      name: cat.name,
      value: cat.spent,
      color: cat.color,
    })),
    // Add remaining budget as gray segment if there's any left
    ...(remaining > 0
      ? [{ name: "Remaining", value: remaining, color: "#F2F2F2" }]
      : []),
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Donut Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
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
          <p className="text-3xl font-bold text-gray-900">
            ${totalSpent.toLocaleString("en-US")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
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

// ============================================
// USAGE EXAMPLE
// ============================================
/*
// In your page/component:
import BudgetDonutChart, { BudgetChartWithLegend } from "@/components/charts/BudgetDonutChart";

const budgetData = [
  {
    name: "Entertainment",
    spent: 50.00,
    limit: 50.00,
    color: "#277C78",
  },
  {
    name: "Bills",
    spent: 750.00,
    limit: 750.00,
    color: "#82C9D7",
  },
  {
    name: "Dining Out",
    spent: 75.00,
    limit: 75.00,
    color: "#F2CDAC",
  },
  {
    name: "Personal Care",
    spent: 100.00,
    limit: 100.00,
    color: "#626070",
  },
];

const totalSpent = budgetData.reduce((sum, cat) => sum + cat.spent, 0);
const totalLimit = budgetData.reduce((sum, cat) => sum + cat.limit, 0);

// Option 1: Chart only
<BudgetDonutChart
  categories={budgetData}
  totalSpent={totalSpent}
  totalLimit={totalLimit}
/>

// Option 2: Chart with legend (like in your design)
<BudgetChartWithLegend
  categories={budgetData}
  totalSpent={338}
  totalLimit={975}
/>
*/
