import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { TransactionItem } from "./TransactionItem";
import type { Transaction } from "@/lib/types";

interface TransactionsSectionProps {
  transactions: Transaction[];
  isLoading: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TransactionsSection({
  transactions,
  isLoading,
}: TransactionsSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader
          title="Transactions"
          href="/transactions"
          linkText="View All"
        />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[60px]" />
          ))}
        </div>
      </Card>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="p-8">
      <SectionHeader
        title="Transactions"
        href="/transactions"
        linkText="View All"
      />

      <div className="space-y-1">
        {recentTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id ?? `${transaction.name}-${transaction.date}`}
            name={transaction.name}
            amount={Math.abs(transaction.amount)}
            date={formatDate(transaction.date)}
            avatar={transaction.avatar}
            isPositive={transaction.amount > 0}
          />
        ))}
      </div>
    </Card>
  );
}
