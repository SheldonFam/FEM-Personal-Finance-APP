import { Transaction, RecurringBill } from "@/lib/types";
import { getDayOfMonth } from "@/lib/formatters";

/**
 * Process recurring bills from transactions.
 *
 * @param today - the date bill status is measured against. Defaults to now;
 *   pass an explicit date to evaluate status at some other moment.
 */
export const processRecurringBills = (
  transactions: Transaction[],
  today: Date = new Date()
): RecurringBill[] => {
  const recurringTransactions = transactions
    .filter((t) => t.recurring)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const uniqueByName = Array.from(
    recurringTransactions
      .reduce((map, transaction) => {
        if (!map.has(transaction.name)) {
          map.set(transaction.name, transaction);
        }
        return map;
      }, new Map<string, Transaction>())
      .values()
  );
  const currentDay = today.getDate();

  return uniqueByName.map((transaction) => {
    const dayOfMonth = getDayOfMonth(transaction.date);
    const isPaid = dayOfMonth < currentDay;
    const daysUntilDue = dayOfMonth - currentDay;
    const isDueSoon = daysUntilDue > 0 && daysUntilDue <= 5;

    return {
      ...transaction,
      dayOfMonth,
      isPaid,
      isDueSoon,
    };
  });
};
