import Image from "next/image";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { normalizeImagePath } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  const isPositive = transaction.amount > 0;
  const avatarPath = normalizeImagePath(transaction.avatar);

  return (
    <div className="py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-0">
        {/* Recipient / Sender */}
        <div className="flex gap-4 min-w-0 sm:col-span-1 items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={avatarPath}
              alt={transaction.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-gray-900 truncate">
              {transaction.name}
            </p>
            <p className="mt-1 text-xs text-gray-500 sm:hidden">
              {transaction.category}
            </p>
          </div>
          <div className="ml-auto text-right sm:hidden">
            <p
              className={`font-bold text-sm ${
                isPositive ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isPositive ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="hidden sm:block text-sm text-gray-500">
          {transaction.category}
        </div>

        {/* Transaction Date */}
        <div className="hidden sm:block text-sm text-gray-500">
          {formatDate(transaction.date)}
        </div>

        {/* Amount */}
        <div className="hidden sm:block text-right">
          <p
            className={`font-bold text-sm md:text-base ${
              isPositive ? "text-green-600" : "text-gray-900"
            }`}
          >
            {isPositive ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </div>
    </div>
  );
};
