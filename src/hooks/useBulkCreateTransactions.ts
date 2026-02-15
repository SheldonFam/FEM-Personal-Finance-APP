import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { TransactionInput } from "@/hooks/useFinanceData";

export function useBulkCreateTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactions: TransactionInput[]) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

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
