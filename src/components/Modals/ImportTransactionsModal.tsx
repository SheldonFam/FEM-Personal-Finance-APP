"use client";

import React, { useState, useCallback } from "react";
import { BaseModal } from "./shared/BaseModal";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { parseTransactionsCsv, type ParsedRow } from "@/lib/csvParser";
import { useBulkCreateTransactions } from "@/hooks/useBulkCreateTransactions";
import { TRANSACTION_CATEGORIES } from "@/lib/constants/constants";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface ImportTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "upload" | "preview" | "done";

const VALID_CATEGORIES = TRANSACTION_CATEGORIES.filter(
  (c) => c !== "All Transactions",
);

export function ImportTransactionsModal({
  open,
  onOpenChange,
}: ImportTransactionsModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importCount, setImportCount] = useState(0);

  const bulkCreate = useBulkCreateTransactions();

  const reset = useCallback(() => {
    setStep("upload");
    setRows([]);
    setErrors([]);
    setImportCount(0);
    bulkCreate.reset();
  }, [bulkCreate]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const result = parseTransactionsCsv(text);
      setRows(result.data);
      setErrors(result.errors);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleCategoryChange = (rowIndex: number, category: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.rowIndex === rowIndex
          ? { ...r, category, suggestedCategory: false }
          : r,
      ),
    );
  };

  const handleImport = () => {
    const transactions = rows.map((r) => ({
      name: r.name,
      category: r.category,
      date: r.date,
      amount: r.amount,
      recurring: r.recurring,
      avatar: "/assets/images/avatars/bytewise.jpg",
    }));

    bulkCreate.mutate(transactions, {
      onSuccess: () => {
        setImportCount(transactions.length);
        setStep("done");
      },
    });
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={handleOpenChange}
      title={
        step === "done"
          ? "Import Complete"
          : step === "preview"
            ? "Preview Import"
            : "Import Transactions"
      }
      description={
        step === "done"
          ? `Successfully imported ${importCount} transactions.`
          : step === "preview"
            ? `${rows.length} transaction${rows.length !== 1 ? "s" : ""} ready to import.`
            : "Upload a CSV file with your transactions. Required columns: Date, Name, Amount."
      }
      maxWidth="sm:max-w-[700px]"
    >
      {step === "upload" && (
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <p className="text-sm text-gray-600">Click to select a CSV file</p>
              <p className="text-xs text-gray-400 mt-1">
                Columns: Date, Name, Category (optional), Amount, Recurring (optional)
              </p>
            </div>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <p className="font-medium mb-1">
                  {errors.length} issue{errors.length !== 1 ? "s" : ""} found:
                </p>
                <ul className="list-disc list-inside text-xs space-y-0.5 max-h-24 overflow-y-auto">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {rows.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Name
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Category
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row) => (
                      <tr key={row.rowIndex}>
                        <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-900 truncate max-w-[140px]">
                          {row.name}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <Select
                              value={row.category}
                              onValueChange={(val) =>
                                handleCategoryChange(row.rowIndex, val)
                              }
                            >
                              <SelectTrigger className="h-7 text-xs w-[130px] border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VALID_CATEGORIES.map((cat) => (
                                  <SelectItem
                                    key={cat}
                                    value={cat}
                                    className="text-xs"
                                  >
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {row.suggestedCategory && (
                              <span
                                className="inline-block w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"
                                title="Auto-suggested category"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                          {formatCurrency(row.amount, false)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {bulkCreate.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Import failed. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={reset}>
              Back
            </Button>
            <Button
              onClick={handleImport}
              disabled={rows.length === 0 || bulkCreate.isPending}
            >
              {bulkCreate.isPending
                ? "Importing..."
                : `Import ${rows.length} Transaction${rows.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <Alert variant="success">
            <AlertDescription>
              {importCount} transaction{importCount !== 1 ? "s" : ""} imported
              successfully.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        </div>
      )}
    </BaseModal>
  );
}
