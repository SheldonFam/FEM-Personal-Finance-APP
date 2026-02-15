import { TRANSACTION_CATEGORIES } from "@/lib/constants/constants";
import { suggestCategory } from "@/lib/categorySuggestions";

export interface ParsedRow {
  date: string;
  name: string;
  category: string;
  amount: number;
  recurring: boolean;
  suggestedCategory: boolean;
  rowIndex: number;
}

export interface CsvParseResult {
  data: ParsedRow[];
  errors: string[];
}

const REQUIRED_COLUMNS = ["date", "name", "amount"];
const VALID_CATEGORIES = TRANSACTION_CATEGORIES.filter(
  (c) => c !== "All Transactions",
);

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z]/g, "");
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isValidAmount(amountStr: string): boolean {
  const cleaned = amountStr.replace(/[$,]/g, "");
  return !isNaN(parseFloat(cleaned)) && isFinite(Number(cleaned));
}

export function parseTransactionsCsv(csvText: string): CsvParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return { data: [], errors: ["CSV must have a header row and at least one data row."] };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const errors: string[] = [];
  const data: ParsedRow[] = [];

  // Check required columns
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push(`Missing required column: "${col}"`);
    }
  }
  if (errors.length > 0) {
    return { data: [], errors };
  }

  const dateIdx = headers.indexOf("date");
  const nameIdx = headers.indexOf("name");
  const categoryIdx = headers.indexOf("category");
  const amountIdx = headers.indexOf("amount");
  const recurringIdx = headers.indexOf("recurring");

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const rowNum = i + 1;

    const dateStr = fields[dateIdx] ?? "";
    const name = fields[nameIdx] ?? "";
    const rawCategory = categoryIdx >= 0 ? (fields[categoryIdx] ?? "") : "";
    const amountStr = fields[amountIdx] ?? "";
    const recurringStr = recurringIdx >= 0 ? (fields[recurringIdx] ?? "") : "";

    // Validate
    if (!name) {
      errors.push(`Row ${rowNum}: Missing name`);
      continue;
    }
    if (!isValidDate(dateStr)) {
      errors.push(`Row ${rowNum}: Invalid date "${dateStr}"`);
      continue;
    }
    if (!isValidAmount(amountStr)) {
      errors.push(`Row ${rowNum}: Invalid amount "${amountStr}"`);
      continue;
    }

    // Resolve category
    let category = rawCategory;
    let suggestedCat = false;

    if (category && !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      errors.push(`Row ${rowNum}: Unknown category "${category}", defaulting to suggestion or "General"`);
      category = "";
    }

    if (!category) {
      const suggestion = suggestCategory(name);
      if (suggestion) {
        category = suggestion;
        suggestedCat = true;
      } else {
        category = "General";
        suggestedCat = true;
      }
    }

    const amount = parseFloat(amountStr.replace(/[$,]/g, ""));
    const recurring =
      recurringStr.toLowerCase() === "yes" ||
      recurringStr.toLowerCase() === "true";

    data.push({
      date: new Date(dateStr).toISOString(),
      name,
      category,
      amount,
      recurring,
      suggestedCategory: suggestedCat,
      rowIndex: rowNum,
    });
  }

  return { data, errors };
}
