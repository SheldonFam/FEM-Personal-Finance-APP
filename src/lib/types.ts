/**
 * Shared type definitions
 *
 * Transaction, Budget and Pot each carry a required `id`. Every record of
 * these types reaches the app from the database, which assigns one, so the
 * identifier is a fact about the data rather than a hope. Keying a list by it
 * is therefore safe: `key={x.id}` cannot silently resolve to undefined and
 * leave React falling back to array position.
 *
 * A record that does not have an identifier yet -- one being created -- is not
 * one of these types. That shape is the corresponding `*Input`, defined
 * alongside the mutations as `Omit<Entity, "id">`.
 */

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  id: string;
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
  id: string;
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

export type SortOption =
  typeof import("./constants/constants").SORT_OPTIONS[number]["value"];

/** A real transaction category. Excludes the "all categories" filter sentinel. */
export type TransactionCategory =
  typeof import("./constants/constants").TRANSACTION_CATEGORIES[number];

/**
 * What the transactions category filter can be set to: any real category, or
 * the sentinel meaning "no filter".
 *
 * Derived from the same array the dropdown renders, so the two cannot drift.
 * Deliberately a wider type than TransactionCategory -- a slot typed as the
 * latter will not accept the sentinel, which is the point of keeping them
 * separate.
 */
export type CategoryFilter =
  typeof import("./constants/constants").CATEGORY_FILTER_OPTIONS[number];

/** The signed-in user, as the app models them. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
