import { Transaction } from "./types";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTransactionsToCsv(transactions: Transaction[]): void {
  const headers = ["Date", "Name", "Category", "Amount", "Recurring"];

  const rows = transactions.map((t) => [
    escapeCsvField(new Date(t.date).toLocaleDateString("en-US")),
    escapeCsvField(t.name),
    escapeCsvField(t.category),
    t.amount.toFixed(2),
    t.recurring ? "Yes" : "No",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
