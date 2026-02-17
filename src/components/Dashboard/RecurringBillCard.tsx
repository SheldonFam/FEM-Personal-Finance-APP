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
      className="bg-finance-beige rounded-lg p-4 flex items-center justify-between border-l-4"
      style={{ borderLeftColor: borderColor }}
    >
      <span className="text-sm text-finance-navy font-normal">{label}</span>
      <span className="text-sm text-finance-navy font-bold">
        ${amount.toFixed(2)}
      </span>
    </div>
  );
}
