/**
 * Shared type definitions
 */

export interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface RecurringBill extends Transaction {
  dayOfMonth: number;
  isPaid: boolean;
  isDueSoon: boolean;
}

export interface Budget {
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  name: string;
  target: number;
  total: number;
  theme: string;
}

export type SortOption =
  typeof import("./constants/constants").SORT_OPTIONS[number]["value"];
