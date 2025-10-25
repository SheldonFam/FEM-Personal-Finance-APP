interface PotItemProps {
  label: string;
  amount: number;
  color: string;
}

export function PotItem({ label, amount, color }: PotItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-1 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="font-bold text-sm text-gray-900">${amount.toFixed(0)}</p>
      </div>
    </div>
  );
}
