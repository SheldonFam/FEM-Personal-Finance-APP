import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAuthenticatedUser,
  type TransactionInput,
} from "@/hooks/useFinanceData";

/**
 * Inserts a whole CSV import in one statement.
 *
 * Not built from the entity mutation factory: this writes many rows at once and
 * invalidates a wider set of caches than a single transaction write does -- an
 * import shifts the balance and can introduce recurring bills. It shares the
 * authentication step with every other write, which was the part worth having
 * in common.
 */
export function useBulkCreateTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactions: TransactionInput[]) => {
      const { supabase, user } = await getAuthenticatedUser();

      const rows = transactions.map((t) => ({ user_id: user.id, ...t }));

      const { data, error } = await supabase
        .from("transactions")
        .insert(rows)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-bills"] });
    },
  });
}
