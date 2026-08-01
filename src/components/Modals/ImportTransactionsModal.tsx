"use client";

import React, { useState } from "react";
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
import {
  parseTransactionsCsv,
  type CsvMessage,
  type CsvParseResult,
} from "@/lib/csvParser";
import { useBulkCreateTransactions } from "@/hooks/useBulkCreateTransactions";
import { TRANSACTION_CATEGORIES } from "@/lib/constants/constants";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface ImportTransactionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "upload" | "preview" | "done";

/** "1 row", "3 rows" -- the count and its noun, agreeing. */
const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

/**
 * No file read yet. Hoisted so that resetting is one assignment rather than
 * three that could drift apart.
 */
const EMPTY_PARSE: CsvParseResult = { data: [], errors: [], warnings: [] };

/**
 * A malformed file produces one message per row, and a big one could produce
 * thousands. Past this many the list stops rendering rows and says how many it
 * held back -- scrolling a thousand of them tells you nothing the count doesn't.
 */
const MAX_MESSAGES_SHOWN = 50;

/**
 * One list of parse messages. Errors and warnings differ only in colour and
 * wording, so they render from here rather than from two copies of the same
 * markup that have to be kept in step by hand.
 *
 * The heading is built here rather than passed in: it is derived entirely from
 * the messages, so computing it at the call site meant scanning them on every
 * render, including the renders where this returns nothing.
 */
function CsvMessageList({
  kind,
  messages,
}: {
  kind: "error" | "warning";
  messages: readonly CsvMessage[];
}) {
  if (messages.length === 0) return null;

  // A file-level message is about the file, not a row, so it must not be
  // counted as one. Checked for both kinds -- only errors can be file-scoped
  // today, but nothing in the type says a warning cannot be.
  const aboutTheFile = messages.some((message) => message.scope === "file");

  const heading = aboutTheFile
    ? kind === "error"
      ? "This file could not be read:"
      : "This file needed adjusting:"
    : kind === "error"
      ? `${plural(messages.length, "row")} could not be read and will not be imported:`
      : `${plural(messages.length, "row")} needed adjusting, and will still be imported:`;

  const shown = messages.slice(0, MAX_MESSAGES_SHOWN);
  const withheld = messages.length - shown.length;

  return (
    <Alert variant={kind === "error" ? "destructive" : "warning"}>
      <AlertDescription>
        <p className="font-medium mb-1">{heading}</p>
        <ul className="list-disc list-inside text-xs space-y-0.5 max-h-24 overflow-y-auto">
          {shown.map((message) => (
            <li key={message.id}>{message.text}</li>
          ))}
          {withheld > 0 ? (
            <li className="italic">and {withheld} more</li>
          ) : null}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export function ImportTransactionsModal({
  open,
  onOpenChange,
}: ImportTransactionsModalProps) {
  const [step, setStep] = useState<Step>("upload");
  // One parse, held whole. Rows, errors and warnings all come from the same
  // file and are only ever set or cleared together, so splitting them across
  // three states only created ways for them to disagree.
  const [parse, setParse] = useState<CsvParseResult>(EMPTY_PARSE);
  const [importCount, setImportCount] = useState(0);

  const { data: rows, errors, warnings } = parse;

  const bulkCreate = useBulkCreateTransactions();

  const reset = () => {
    setStep("upload");
    setParse(EMPTY_PARSE);
    setImportCount(0);
    bulkCreate.reset();
  };

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
      setParse(parseTransactionsCsv(text));
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleCategoryChange = (rowIndex: number, category: string) => {
    setParse((prev) => ({
      ...prev,
      data: prev.data.map((r) =>
        r.rowIndex === rowIndex
          ? { ...r, category, suggestedCategory: false }
          : r,
      ),
    }));
  };

  const handleImport = () => {
    const transactions = rows.map((r) => ({
      name: r.name,
      category: r.category,
      date: r.date,
      amount: r.amount,
      recurring: r.recurring,
      // No image of its own. TransactionAvatar shows the merchant's initials
      // rather than borrowing some other business's logo, which is what this
      // used to do -- every imported row wore the same one.
      avatar: "",
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
          ? `Successfully imported ${plural(importCount, "transaction")}.`
          : step === "preview"
            ? `${plural(rows.length, "transaction")} ready to import.`
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
          <CsvMessageList kind="error" messages={errors} />
          <CsvMessageList kind="warning" messages={warnings} />

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
                                {TRANSACTION_CATEGORIES.map((cat) => (
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
                                role="img"
                                aria-label="Auto-suggested category"
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
                : `Import ${plural(rows.length, "Transaction")}`}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <Alert variant="success">
            <AlertDescription>
              {plural(importCount, "transaction")} imported
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
