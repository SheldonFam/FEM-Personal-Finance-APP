import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { RecurringBillCard } from "./RecurringBillCard";
import type { Transaction } from "@/lib/types";

interface RecurringBillsSectionProps {
  recurringBills: Transaction[];
  isLoading: boolean;
}

export function RecurringBillsSection({
  recurringBills,
  isLoading,
}: RecurringBillsSectionProps) {
  if (isLoading) {
    return (
      <Card className="h-full p-8">
        <SectionHeader
          title="Recurring Bills"
          href="/recurring-bills"
          linkText="See Details"
        />
        <div className="space-y-3">
          <Skeleton className="h-[60px]" />
          <Skeleton className="h-[60px]" />
          <Skeleton className="h-[60px]" />
        </div>
      </Card>
    );
  }

  // Calculate bill summaries
  const now = new Date();
  const currentDay = now.getDate();

  const paidBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    return billDate.getDate() < currentDay;
  });

  const upcomingBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    return billDate.getDate() >= currentDay;
  });

  const dueSoonBills = recurringBills.filter((bill) => {
    const billDate = new Date(bill.date);
    const dayOfMonth = billDate.getDate();
    return dayOfMonth >= currentDay && dayOfMonth <= currentDay + 5;
  });

  const paidAmount = paidBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );
  const upcomingAmount = upcomingBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );
  const dueSoonAmount = dueSoonBills.reduce(
    (sum, bill) => sum + Math.abs(bill.amount),
    0
  );

  const bills = [
    { label: "Paid Bills", amount: paidAmount, borderColor: "#277C78" },
    { label: "Total Upcoming", amount: upcomingAmount, borderColor: "#F2CDAC" },
    { label: "Due Soon", amount: dueSoonAmount, borderColor: "#82C9D7" },
  ];

  return (
    <Card className="h-full p-8">
      <SectionHeader
        title="Recurring Bills"
        href="/recurring-bills"
        linkText="See Details"
      />

      <div className="space-y-3">
        {bills.map((bill) => (
          <RecurringBillCard
            key={bill.label}
            label={bill.label}
            amount={bill.amount}
            borderColor={bill.borderColor}
          />
        ))}
      </div>
    </Card>
  );
}
