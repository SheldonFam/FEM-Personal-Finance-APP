import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Balance, Transaction, Budget, Pot } from "@/lib/types";
import localData from "@/data/data.json";

// Input types for mutations
export type TransactionInput = Omit<Transaction, "id">;
export type BudgetInput = Omit<Budget, "id">;
export type PotInput = Omit<Pot, "id">;

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}

/**
 * Fetch balance data
 * Uses Supabase if configured, otherwise falls back to local data
 */
export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: async (): Promise<Balance> => {
      // If Supabase is not configured, use local data
      if (!isSupabaseConfigured()) {
        return localData.balance as Balance;
      }

      const supabase = createClient();

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in, use local data for demo
        return localData.balance as Balance;
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from("balance")
        .select("current, income, expenses")
        .single();

      if (error) {
        console.error("Balance fetch error:", error.message);
        // Return empty balance if no data exists yet
        return { current: 0, income: 0, expenses: 0 };
      }

      return data as Balance;
    },
  });
}

/**
 * Fetch all transactions
 */
export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      if (!isSupabaseConfigured()) {
        return localData.transactions as Transaction[];
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return localData.transactions as Transaction[];
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("id, avatar, name, category, date, amount, recurring")
        .order("date", { ascending: false });

      if (error) {
        console.error("Transactions fetch error:", error.message);
        return [];
      }

      return (data as Transaction[]) || [];
    },
  });
}

/**
 * Fetch all budgets
 */
export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async (): Promise<Budget[]> => {
      if (!isSupabaseConfigured()) {
        return localData.budgets as Budget[];
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return localData.budgets as Budget[];
      }

      const { data, error } = await supabase
        .from("budgets")
        .select("id, category, maximum, theme");

      if (error) {
        console.error("Budgets fetch error:", error.message);
        return [];
      }

      return (data as Budget[]) || [];
    },
  });
}

/**
 * Fetch all pots
 */
export function usePots() {
  return useQuery({
    queryKey: ["pots"],
    queryFn: async (): Promise<Pot[]> => {
      if (!isSupabaseConfigured()) {
        return localData.pots as Pot[];
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return localData.pots as Pot[];
      }

      const { data, error } = await supabase
        .from("pots")
        .select("id, name, target, total, theme");

      if (error) {
        console.error("Pots fetch error:", error.message);
        return [];
      }

      return (data as Pot[]) || [];
    },
  });
}

/**
 * Fetch recurring bills (transactions with recurring: true)
 */
export function useRecurringBills() {
  return useQuery({
    queryKey: ["recurring-bills"],
    queryFn: async (): Promise<Transaction[]> => {
      if (!isSupabaseConfigured()) {
        return (localData.transactions as Transaction[]).filter(
          (t) => t.recurring
        );
      }

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return (localData.transactions as Transaction[]).filter(
          (t) => t.recurring
        );
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("id, avatar, name, category, date, amount, recurring")
        .eq("recurring", true)
        .order("date", { ascending: false });

      if (error) {
        console.error("Recurring bills fetch error:", error.message);
        return [];
      }

      return (data as Transaction[]) || [];
    },
  });
}

/**
 * Fetch all finance data at once (for dashboard)
 */
export function useFinanceData() {
  const balance = useBalance();
  const transactions = useTransactions();
  const budgets = useBudgets();
  const pots = usePots();

  return {
    balance,
    transactions,
    budgets,
    pots,
    isLoading:
      balance.isLoading ||
      transactions.isLoading ||
      budgets.isLoading ||
      pots.isLoading,
    isError:
      balance.isError ||
      transactions.isError ||
      budgets.isError ||
      pots.isError,
  };
}

// =============================================
// TRANSACTION MUTATIONS
// =============================================

/**
 * Create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          ...transaction,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-bills"] });
    },
  });
}

/**
 * Update an existing transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...transaction
    }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(transaction)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-bills"] });
    },
  });
}

/**
 * Delete a transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-bills"] });
    },
  });
}

// =============================================
// BUDGET MUTATIONS
// =============================================

/**
 * Create a new budget
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (budget: BudgetInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          ...budget,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

/**
 * Update an existing budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...budget
    }: Partial<Budget> & { id: string }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update(budget)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

/**
 * Delete a budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

// =============================================
// POT MUTATIONS
// =============================================

/**
 * Create a new pot
 */
export function useCreatePot() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (pot: PotInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("pots")
        .insert({
          user_id: user.id,
          ...pot,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

/**
 * Update an existing pot
 */
export function useUpdatePot() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, ...pot }: Partial<Pot> & { id: string }) => {
      const { data, error } = await supabase
        .from("pots")
        .update(pot)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

/**
 * Delete a pot
 */
export function useDeletePot() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pots").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

/**
 * Add money to a pot
 */
export function useAddMoneyToPot() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      // First get current total
      const { data: pot, error: fetchError } = await supabase
        .from("pots")
        .select("total")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newTotal = (pot?.total || 0) + amount;

      const { data, error } = await supabase
        .from("pots")
        .update({ total: newTotal })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

/**
 * Withdraw money from a pot
 */
export function useWithdrawFromPot() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      // First get current total
      const { data: pot, error: fetchError } = await supabase
        .from("pots")
        .select("total")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newTotal = Math.max(0, (pot?.total || 0) - amount);

      const { data, error } = await supabase
        .from("pots")
        .update({ total: newTotal })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

// =============================================
// BALANCE MUTATIONS
// =============================================

/**
 * Update balance
 */
export function useUpdateBalance() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (balance: Partial<Balance>) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("balance")
        .update(balance)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}
