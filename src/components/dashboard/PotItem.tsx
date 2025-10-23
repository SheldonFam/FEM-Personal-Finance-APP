interface PotItemProps {
  label: string;
  amount: number;
  color: string;
}

export function PotItem({ label, amount, color }: PotItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div 
          className="w-1 h-10 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-600">{label}</span>
      </div>
      <span className="font-bold text-sm text-gray-900">
        ${amount}
      </span>
    </div>
  );
}