/**
 * Shared type definitions
 */

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  id?: string;
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
  id?: string;
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  id?: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

export type SortOption =
  typeof import("./constants/constants").SORT_OPTIONS[number]["value"];
