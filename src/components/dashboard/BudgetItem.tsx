interface BudgetItemProps {
  category: string;
  amount: number;
  color: string;
}

export function BudgetItem({ category, amount, color }: BudgetItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-10 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-600">{category}</span>
      </div>
      <span className="font-bold text-sm text-gray-900">
        ${amount.toFixed(2)}
      </span>
    </div>
  );
}
