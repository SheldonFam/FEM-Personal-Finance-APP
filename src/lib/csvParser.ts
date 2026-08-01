import { isTransactionCategory } from "@/lib/constants/constants";
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

/**
 * One thing worth telling the user about a parse.
 *
 * Carries its own id so a list of these can be keyed by identity. Ids are
 * unique within a parse: a row contributes at most one error, because the
 * first one drops it, and at most one warning.
 */
export interface CsvMessage {
  id: string;
  text: string;
  /**
   * Whether this is about one row or about the file as a whole. A missing
   * header column is not a bad row, and must not be counted as one.
   */
  scope: "file" | "row";
}

export interface CsvParseResult {
  data: ParsedRow[];
  /** Fatal. The file was rejected, or these rows were dropped. */
  errors: CsvMessage[];
  /** Non-fatal. These rows imported, with something adjusted on the way. */
  warnings: CsvMessage[];
}

const REQUIRED_COLUMNS = ["date", "name", "amount"];

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
    return {
      data: [],
      errors: [
        {
          id: "file-too-short",
          text: "CSV must have a header row and at least one data row.",
          scope: "file",
        },
      ],
      warnings: [],
    };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const errors: CsvMessage[] = [];
  const warnings: CsvMessage[] = [];
  const data: ParsedRow[] = [];

  // Check required columns
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push({
        id: `file-missing-${col}`,
        text: `Missing required column: "${col}"`,
        scope: "file",
      });
    }
  }
  if (errors.length > 0) {
    return { data: [], errors, warnings };
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

    // Validate. Each of these drops the row, so they are errors.
    if (!name) {
      errors.push({
        id: `row-${rowNum}-name`,
        text: `Row ${rowNum}: Missing name`,
        scope: "row",
      });
      continue;
    }
    if (!isValidDate(dateStr)) {
      errors.push({
        id: `row-${rowNum}-date`,
        text: `Row ${rowNum}: Invalid date "${dateStr}"`,
        scope: "row",
      });
      continue;
    }
    if (!isValidAmount(amountStr)) {
      errors.push({
        id: `row-${rowNum}-amount`,
        text: `Row ${rowNum}: Invalid amount "${amountStr}"`,
        scope: "row",
      });
      continue;
    }

    // Resolve category. An unrecognised one does not drop the row -- it still
    // imports, under a suggestion or the General fallback -- so the
    // substitution is reported as a warning, and named so the user can see
    // what it actually landed as.
    let category = rawCategory;
    let suggestedCat = false;
    const unknownCategory = Boolean(category) && !isTransactionCategory(category);

    if (unknownCategory) {
      category = "";
    }

    if (!category) {
      category = suggestCategory(name) || "General";
      suggestedCat = true;
    }

    if (unknownCategory) {
      warnings.push({
        id: `row-${rowNum}-category`,
        text: `Row ${rowNum}: Unknown category "${rawCategory}" — imported as "${category}"`,
        scope: "row",
      });
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

  return { data, errors, warnings };
}
