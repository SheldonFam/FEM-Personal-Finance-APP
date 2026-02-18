interface PotItemProps {
  label: string;
  amount: number;
  color: string;
}

export function PotItem({ label, amount, color }: PotItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-1 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
        <p className="text-xs text-finance-grey truncate">{label}</p>
        <p className="font-bold text-sm text-finance-navy whitespace-nowrap tabular-nums">${amount.toFixed(0)}</p>
      </div>
    </div>
  );
}
