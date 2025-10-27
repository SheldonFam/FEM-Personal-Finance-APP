interface BudgetItemProps {
  category: string;
  amount: number;
  color: string;
}

export function BudgetItem({ category, amount, color }: BudgetItemProps) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div
          className="w-1 h-10 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-[#696868]">{category}</span>
      </div>
      <span className="font-bold text-sm text-[#201F24]">
        ${amount.toFixed(2)}
      </span>
    </div>
  );
}
