import { useState } from "react";
import Image from "next/image";
import { Budget, Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { normalizeImagePath } from "@/lib/utils";
import { Progress } from "@/components/ui/Progress";
import { Card } from "@/components/ui/Card";

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  transactions: Transaction[];
  onEdit: () => void;
  onDelete: () => void;
}

export const BudgetCard = ({
  budget,
  spent,
  transactions,
  onEdit,
  onDelete,
}: BudgetCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const percentage = Math.min((spent / budget.maximum) * 100, 100);
  const remaining = Math.max(0, budget.maximum - spent);

  // Get latest 3 transactions for this category
  const latestTransactions = transactions
    .filter((t) => t.category === budget.category)
    .slice(0, 3);

  return (
    <Card className="p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: budget.theme }}
          />
          <h3 className="text-xl font-bold text-gray-900">{budget.category}</h3>
        </div>
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Image
              src="/assets/images/icon-ellipsis.svg"
              alt="Options"
              width={16}
              height={4}
            />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Budget
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spending Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-4">
          Maximum of {formatCurrency(budget.maximum)}
        </p>

        {/* Progress Bar */}
        <Progress
          value={percentage}
          className="h-8 mb-3"
          color={budget.theme}
        />

        {/* Spending info below progress bar */}
        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Spent */}
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: budget.theme }}
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">Spent</p>
              <p className="text-base font-bold text-gray-900">
                {formatCurrency(spent)}
              </p>
            </div>
          </div>
          {/* Remaining */}
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-10 rounded-full flex-shrink-0 bg-gray-200"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">Remaining</p>
              <p className="text-base font-bold text-gray-900">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="pt-6 border-t border-gray-100">
        <div className="bg-[#F8F4F0] rounded-lg p-4 -mx-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">Latest Spending</h4>
            {latestTransactions.length > 0 && (
              <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                See All
                <Image
                  src="/assets/images/icon-caret-right.svg"
                  alt=""
                  width={6}
                  height={11}
                  aria-hidden="true"
                  className="h-3 w-auto"
                />
              </button>
            )}
          </div>

          {latestTransactions.length > 0 ? (
            <div className="space-y-0">
              {latestTransactions.map((transaction, index) => {
                const avatarPath = normalizeImagePath(transaction.avatar);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={avatarPath}
                          alt={transaction.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-900">
                        {transaction.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        -{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No transactions yet
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
