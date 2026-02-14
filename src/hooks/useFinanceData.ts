import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Balance, Transaction, Budget, Pot } from "@/lib/types";
import localData from "@/data/data.json";

// Input types for mutations
export type TransactionInput = Omit<Transaction, "id">;
export type BudgetInput = Omit<Budget, "id">;
export type PotInput = Omit<Pot, "id">;

const isSupabaseConfigured = (): boolean =>
  !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );

/**
 * Factory for creating authenticated Supabase query functions.
 * Handles config check, auth check, and fallback to local data.
 */
function createSupabaseQueryFn<T>(options: {
  localFallback: () => T;
  queryFn: (
    supabase: ReturnType<typeof createClient>,
    userId: string,
  ) => Promise<T>;
}): () => Promise<T> {
  return async () => {
    if (!isSupabaseConfigured()) {
      return options.localFallback();
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return options.localFallback();
    }

    return await options.queryFn(supabase, user.id);
  };
}

// =============================================
// QUERIES
// =============================================

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: createSupabaseQueryFn<Balance>({
      localFallback: () => localData.balance as Balance,

      queryFn: async (supabase, userId) => {
        const { data, error } = await supabase
          .from("balance")
          .select("current, income, expenses")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        return data as Balance;
      },
    }),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: createSupabaseQueryFn<Transaction[]>({
      localFallback: () => localData.transactions as Transaction[],

      queryFn: async (supabase, userId) => {
        const { data, error } = await supabase
          .from("transactions")
          .select("id, avatar, name, category, date, amount, recurring")
          .eq("user_id", userId)
          .order("date", { ascending: false });

        if (error) throw error;
        return (data as Transaction[]) || [];
      },
    }),
  });
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: createSupabaseQueryFn<Budget[]>({
      localFallback: () => localData.budgets as Budget[],

      queryFn: async (supabase, userId) => {
        const { data, error } = await supabase
          .from("budgets")
          .select("id, category, maximum, theme")
          .eq("user_id", userId);

        if (error) throw error;
        return (data as Budget[]) || [];
      },
    }),
  });
}

export function usePots() {
  return useQuery({
    queryKey: ["pots"],
    queryFn: createSupabaseQueryFn<Pot[]>({
      localFallback: () => localData.pots as Pot[],

      queryFn: async (supabase, userId) => {
        const { data, error } = await supabase
          .from("pots")
          .select("id, name, target, total, theme")
          .eq("user_id", userId);

        if (error) throw error;
        return (data as Pot[]) || [];
      },
    }),
  });
}

export function useRecurringBills() {
  return useQuery({
    queryKey: ["recurring-bills"],
    queryFn: createSupabaseQueryFn<Transaction[]>({
      localFallback: () =>
        (localData.transactions as Transaction[]).filter((t) => t.recurring),

      queryFn: async (supabase, userId) => {
        const { data, error } = await supabase
          .from("transactions")
          .select("id, avatar, name, category, date, amount, recurring")
          .eq("user_id", userId)
          .eq("recurring", true)
          .order("date", { ascending: false });

        if (error) throw error;
        return (data as Transaction[]) || [];
      },
    }),
  });
}

/**
 * Aggregated hook for dashboard — combines all finance queries.
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
// MUTATION HELPERS
// =============================================

async function getAuthenticatedUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

// =============================================
// TRANSACTION MUTATIONS
// =============================================

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionInput) => {
      const { supabase, user } = await getAuthenticatedUser();

      const { data, error } = await supabase
        .from("transactions")
        .insert({ user_id: user.id, ...transaction })
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

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...transaction
    }: Partial<Transaction> & { id: string }) => {
      const supabase = createClient();

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

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
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

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budget: BudgetInput) => {
      const { supabase, user } = await getAuthenticatedUser();

      const { data, error } = await supabase
        .from("budgets")
        .insert({ user_id: user.id, ...budget })
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

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...budget
    }: Partial<Budget> & { id: string }) => {
      const supabase = createClient();

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

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
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

export function useCreatePot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pot: PotInput) => {
      const { supabase, user } = await getAuthenticatedUser();

      const { data, error } = await supabase
        .from("pots")
        .insert({ user_id: user.id, ...pot })
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

export function useUpdatePot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...pot }: Partial<Pot> & { id: string }) => {
      const supabase = createClient();

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

export function useDeletePot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("pots").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
    },
  });
}

export function useAddMoneyToPot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const supabase = createClient();

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

export function useWithdrawFromPot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const supabase = createClient();

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

export function useUpdateBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (balance: Partial<Balance>) => {
      const { supabase, user } = await getAuthenticatedUser();

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
