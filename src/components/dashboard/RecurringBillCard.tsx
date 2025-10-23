interface RecurringBillCardProps {
  label: string;
  amount: number;
  borderColor: string;
}

export function RecurringBillCard({
  label,
  amount,
  borderColor,
}: RecurringBillCardProps) {
  return (
    <div
      className="bg-gray-50 rounded-lg p-5 border-l-4 flex items-center justify-between"
      style={{ borderLeftColor: borderColor }}
    >
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-bold text-sm text-gray-900">
        ${amount.toFixed(2)}
      </span>
    </div>
  );
}
