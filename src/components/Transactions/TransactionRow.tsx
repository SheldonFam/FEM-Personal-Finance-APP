import { TransactionAvatar } from "@/components/TransactionAvatar";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  const isPositive = transaction.amount > 0;

  return (
    <div className="py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-4 sm:items-center sm:gap-0">
        {/* Recipient / Sender */}
        <div className="flex gap-4 min-w-0 sm:col-span-1 items-center">
          <TransactionAvatar
            src={transaction.avatar}
            name={transaction.name}
          />
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
              className={`font-bold text-sm tabular-nums ${
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
            className={`font-bold text-sm md:text-base tabular-nums ${
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
