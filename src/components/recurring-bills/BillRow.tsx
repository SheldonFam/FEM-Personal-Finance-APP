import Image from "next/image";
import { RecurringBill } from "@/lib/types";
import { formatCurrency, getOrdinalSuffix } from "@/lib/formatters";
import { normalizeImagePath } from "@/lib/utils";

interface BillRowProps {
  bill: RecurringBill;
}

export const BillRow = ({ bill }: BillRowProps) => {
  const avatarPath = normalizeImagePath(bill.avatar);
  const dueLabel = `Monthly - ${bill.dayOfMonth}${getOrdinalSuffix(
    bill.dayOfMonth
  )}`;
  const dueDateColor = bill.isPaid ? "text-[#277C78]" : "text-[#696868]";

  return (
    <div className="px-4 sm:px-6 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={bill.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-sm text-gray-900 truncate">
            {bill.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-xs ${dueDateColor}`}>
            <span>{dueLabel}</span>
            {bill.isPaid && (
              <Image
                src="/assets/images/icon-bill-paid.svg"
                alt="Bill paid"
                width={12}
                height={12}
                className="shrink-0"
              />
            )}
            {!bill.isPaid && bill.isDueSoon && (
              <Image
                src="/assets/images/icon-bill-due.svg"
                alt="Bill due soon"
                width={12}
                height={12}
                className="shrink-0"
              />
            )}
          </div>
          <span
            className={`font-bold text-sm ${
              bill.isDueSoon && !bill.isPaid
                ? "text-[#C94736]"
                : "text-gray-900"
            }`}
          >
            {formatCurrency(bill.amount)}
          </span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={bill.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-sm text-gray-900 truncate">
            {bill.name}
          </p>
        </div>
        <div
          className={`flex items-center justify-center gap-2 text-sm ${dueDateColor}`}
        >
          <span className="whitespace-nowrap">{dueLabel}</span>
          {bill.isPaid && (
            <Image
              src="/assets/images/icon-bill-paid.svg"
              alt="Bill paid"
              width={14}
              height={14}
              className="shrink-0"
            />
          )}
          {bill.isDueSoon && !bill.isPaid && (
            <Image
              src="/assets/images/icon-bill-due.svg"
              alt="Bill due soon"
              width={14}
              height={14}
              className="shrink-0"
            />
          )}
        </div>
        <div className="text-right">
          <span
            className={`font-bold text-sm ${
              bill.isDueSoon && !bill.isPaid
                ? "text-[#C94736]"
                : "text-gray-900"
            }`}
          >
            {formatCurrency(bill.amount)}
          </span>
        </div>
      </div>
    </div>
  );
};
