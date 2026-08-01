import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Balance, Transaction, Budget, Pot } from "@/lib/types";

// Input types for mutations
export type TransactionInput = Omit<Transaction, "id">;
export type BudgetInput = Omit<Budget, "id">;
export type PotInput = Omit<Pot, "id">;

/**
 * Establishes the signed-in user and hands back a client to work with.
 *
 * Every read and every write goes through here, so "this touches the database
 * as a known user" is settled in one place rather than asserted -- or
 * forgotten -- at each call site.
 */
export async function getAuthenticatedUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

/**
 * Wraps a table read so it runs as the signed-in user.
 *
 * A fixture fallback used to sit here, returning bundled demo records when
 * Supabase was unconfigured or nobody was signed in. Neither branch was
 * reachable: middleware redirects unauthenticated requests away from every
 * data route, and AuthProvider throws outright when Supabase is unconfigured,
 * so a query only ever runs for a signed-in user against a configured project.
 *
 * It was also worse than merely dead. The fixture records carry no identifier
 * and the fallback asserted them into the entity types regardless -- a cast
 * that says nothing today and would say something false the moment those
 * identifiers become required.
 *
 * An unauthenticated read now throws rather than resolving to something empty.
 * A finance page rendering zeroes because auth quietly failed is worse than
 * one showing an error.
 */
function createSupabaseQueryFn<T>(
  queryFn: (
    supabase: ReturnType<typeof createClient>,
    userId: string,
  ) => Promise<T>,
): () => Promise<T> {
  return async () => {
    const { supabase, user } = await getAuthenticatedUser();
    return await queryFn(supabase, user.id);
  };
}

// =============================================
// QUERIES
// =============================================

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: createSupabaseQueryFn<Balance>(async (supabase, userId) => {
      const { data, error } = await supabase
        .from("balance")
        .select("current, income, expenses")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data as Balance;
    }),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: createSupabaseQueryFn<Transaction[]>(async (supabase, userId) => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, avatar, name, category, date, amount, recurring")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return (data as Transaction[]) || [];
    }),
  });
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: createSupabaseQueryFn<Budget[]>(async (supabase, userId) => {
      const { data, error } = await supabase
        .from("budgets")
        .select("id, category, maximum, theme")
        .eq("user_id", userId);

      if (error) throw error;
      return (data as Budget[]) || [];
    }),
  });
}

export function usePots() {
  return useQuery({
    queryKey: ["pots"],
    queryFn: createSupabaseQueryFn<Pot[]>(async (supabase, userId) => {
      const { data, error } = await supabase
        .from("pots")
        .select("id, name, target, total, theme")
        .eq("user_id", userId);

      if (error) throw error;
      return (data as Pot[]) || [];
    }),
  });
}

export function useRecurringBills() {
  return useQuery({
    queryKey: ["recurring-bills"],
    queryFn: createSupabaseQueryFn<Transaction[]>(async (supabase, userId) => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, avatar, name, category, date, amount, recurring")
        .eq("user_id", userId)
        .eq("recurring", true)
        .order("date", { ascending: false });

      if (error) throw error;
      return (data as Transaction[]) || [];
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

/**
 * Builds the create, update and delete mutations for one table.
 *
 * The three were previously spelled out per entity: nine blocks that differed
 * only in a table name and a set of cache keys. They had also drifted -- create
 * established the user through getAuthenticatedUser, while update and delete
 * built a client directly and never established one at all, leaning entirely on
 * row level security to refuse the write. Producing all three from here makes
 * that divergence unrepresentable; a write cannot skip the check by omission.
 *
 * Only these three shapes belong here. A mutation that does something else --
 * the pot balance adjustment, say -- stays written out, rather than growing an
 * options flag that every other caller has to read past.
 */
function createEntityMutations<
  TEntity extends { id: string },
  TInput,
>(options: { table: string; invalidates: readonly string[] }) {
  const { table, invalidates } = options;

  function useInvalidateOnSuccess() {
    const queryClient = useQueryClient();

    return () => {
      for (const key of invalidates) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    };
  }

  function useCreate() {
    const onSuccess = useInvalidateOnSuccess();

    return useMutation({
      mutationFn: async (input: TInput) => {
        const { supabase, user } = await getAuthenticatedUser();

        const { data, error } = await supabase
          .from(table)
          .insert({ user_id: user.id, ...input })
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess,
    });
  }

  function useUpdate() {
    const onSuccess = useInvalidateOnSuccess();

    return useMutation({
      mutationFn: async ({
        id,
        ...changes
      }: Partial<TEntity> & { id: string }) => {
        const { supabase } = await getAuthenticatedUser();

        const { data, error } = await supabase
          .from(table)
          .update(changes)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess,
    });
  }

  function useDelete() {
    const onSuccess = useInvalidateOnSuccess();

    return useMutation({
      mutationFn: async (id: string) => {
        const { supabase } = await getAuthenticatedUser();

        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) throw error;
      },
      onSuccess,
    });
  }

  return { useCreate, useUpdate, useDelete };
}

// =============================================
// TRANSACTION MUTATIONS
// =============================================

/**
 * Writing a transaction can change which bills are recurring, so both caches
 * are invalidated. This pairing was already duplicated across all three
 * mutations; now it is stated once.
 */
export const {
  useCreate: useCreateTransaction,
  useUpdate: useUpdateTransaction,
  useDelete: useDeleteTransaction,
} = createEntityMutations<Transaction, TransactionInput>({
  table: "transactions",
  invalidates: ["transactions", "recurring-bills"],
});

// =============================================
// BUDGET MUTATIONS
// =============================================

export const {
  useCreate: useCreateBudget,
  useUpdate: useUpdateBudget,
  useDelete: useDeleteBudget,
} = createEntityMutations<Budget, BudgetInput>({
  table: "budgets",
  invalidates: ["budgets"],
});

// =============================================
// POT MUTATIONS
// =============================================

export const {
  useCreate: useCreatePot,
  useUpdate: useUpdatePot,
  useDelete: useDeletePot,
} = createEntityMutations<Pot, PotInput>({
  table: "pots",
  invalidates: ["pots"],
});

/**
 * Deposits into or withdraws from a pot.
 *
 * Delegates to the adjust_pot_total database function, which applies the
 * change in a single statement. Postgres holds a row lock for its duration,
 * so two overlapping adjustments serialise and both take effect -- where the
 * previous read-then-write would let the second silently overwrite the first.
 *
 * The zero clamp lives in that function too. Doing it here as well would put
 * the same invariant in two places, free to drift.
 */
function usePotBalanceMutation(adjustment: "deposit" | "withdraw") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const supabase = createClient();

      const delta = adjustment === "deposit" ? amount : -amount;

      const { data, error } = await supabase.rpc("adjust_pot_total", {
        pot_id: id,
        delta,
      });

      if (error) throw error;

      // The function returns no row when the pot does not exist, or when row
      // level security denies access to it. Neither is distinguishable from
      // the client, and both mean the adjustment did not happen.
      if (!data) {
        throw new Error("That pot could not be updated. Please try again.");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pots"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
    },
  });
}

export function useAddMoneyToPot() {
  return usePotBalanceMutation("deposit");
}

export function useWithdrawFromPot() {
  return usePotBalanceMutation("withdraw");
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
