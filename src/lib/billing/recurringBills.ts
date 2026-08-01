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

export interface RecurringBillSummary {
  total: number;
  paidCount: number;
  paidAmount: number;
  upcomingCount: number;
  upcomingAmount: number;
  dueSoonCount: number;
  dueSoonAmount: number;
}

/**
 * Totals for a set of processed bills, in one pass.
 *
 * Takes bills rather than transactions, deliberately: the input must already
 * have been through processRecurringBills, which decides what is paid and what
 * is due soon and dedupes several transactions for the same bill down to one.
 * The dashboard used to total raw transactions against its own inlined rules,
 * and reported figures several times larger than the recurring bills page for
 * the same data.
 *
 * Amounts are absolute. A bill is an outgoing, stored negative, and these are
 * read as "how much is upcoming" rather than as signed movements.
 */
export const summariseRecurringBills = (
  bills: RecurringBill[]
): RecurringBillSummary =>
  bills.reduce<RecurringBillSummary>(
    (acc, bill) => {
      const amount = Math.abs(bill.amount);
      acc.total += amount;

      if (bill.isPaid) {
        acc.paidCount++;
        acc.paidAmount += amount;
      } else {
        acc.upcomingCount++;
        acc.upcomingAmount += amount;
      }

      if (bill.isDueSoon) {
        acc.dueSoonCount++;
        acc.dueSoonAmount += amount;
      }

      return acc;
    },
    {
      total: 0,
      paidCount: 0,
      paidAmount: 0,
      upcomingCount: 0,
      upcomingAmount: 0,
      dueSoonCount: 0,
      dueSoonAmount: 0,
    }
  );
