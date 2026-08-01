"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { RecurringBillCard } from "./RecurringBillCard";
import type { Transaction } from "@/lib/types";
import {
  processRecurringBills,
  summariseRecurringBills,
} from "@/lib/billing/recurringBills";
import { useCurrentDate } from "@/hooks/useCurrentDate";

interface RecurringBillsSectionProps {
  recurringBills: Transaction[];
  isLoading: boolean;
}

export function RecurringBillsSection({
  recurringBills,
  isLoading,
}: RecurringBillsSectionProps) {
  // The same rules the Recurring Bills page uses, from the same place. This
  // section previously inlined its own: it counted a bill due today as due
  // soon where the page requires the due day to be strictly ahead, and it
  // never deduped, so several transactions for one bill were totalled several
  // times over. The two surfaces reported different figures for the same data.
  //
  // Hooks first: the loading branch below returns early.
  const today = useCurrentDate();
  const summary = useMemo(
    () => summariseRecurringBills(processRecurringBills(recurringBills, today)),
    [recurringBills, today]
  );

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

  const bills = [
    {
      label: "Paid Bills",
      amount: summary.paidAmount,
      borderColor: "var(--finance-green)",
    },
    {
      label: "Total Upcoming",
      amount: summary.upcomingAmount,
      borderColor: "var(--finance-sand)",
    },
    {
      label: "Due Soon",
      amount: summary.dueSoonAmount,
      borderColor: "var(--finance-cyan)",
    },
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
