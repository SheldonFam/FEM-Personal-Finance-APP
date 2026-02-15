import type { Transaction } from "@/lib/types";

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export function calculateCategorySpending(
  transactions: Transaction[],
): CategorySpending[] {
  const expenses = transactions.filter((t) => t.amount < 0);

  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const t of expenses) {
    const existing = categoryMap.get(t.category) ?? { amount: 0, count: 0 };
    existing.amount += Math.abs(t.amount);
    existing.count += 1;
    categoryMap.set(t.category, existing);
  }

  const totalSpending = Array.from(categoryMap.values()).reduce(
    (sum, v) => sum + v.amount,
    0,
  );

  if (totalSpending === 0) return [];

  return Array.from(categoryMap.entries())
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      percentage: (amount / totalSpending) * 100,
      transactionCount: count,
    }))
    .sort((a, b) => b.amount - a.amount);
}
