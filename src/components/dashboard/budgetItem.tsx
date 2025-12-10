interface BudgetItemProps {
  category: string;
  amount: number;
  color: string;
}

export function BudgetItem({ category, amount, color }: BudgetItemProps) {
  return (
    <div className="flex items-start gap-4 min-w-0">
      <div
        className="w-1 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-sm text-[#696868] truncate">{category}</span>
        <span className="font-bold text-sm text-[#201F24]">
          ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
