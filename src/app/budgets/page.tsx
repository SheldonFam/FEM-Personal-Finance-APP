"use client";

import React, { useState, useMemo } from "react";
import { Budget } from "@/lib/types";
import {
  getThemeNameFromHex,
  getHexFromThemeName,
} from "@/lib/constants/constants";
import { BudgetFormModal } from "@/components/Modals/BudgetFormModal";
import { DeleteConfirmationModal } from "@/components/Modals/DeleteConfirmationModal";
import { BudgetCard } from "@/components/Budgets/BudgetCard";
import { SpendingSummary } from "@/components/Budgets/SpendingSummary";
import { Button } from "@/components/ui/Button";
import { PageLayout } from "@/components/PageLayout";
import { EmptyState } from "@/components/EmptyState";
import { DataErrorAlert } from "@/components/DataErrorAlert";
import {
  useBudgets,
  useTransactions,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/hooks/useFinanceData";

export default function BudgetsPage() {
  const {
    data: budgets = [],
    isLoading: isLoadingBudgets,
    isError: isBudgetsError,
  } = useBudgets();
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
  } = useTransactions();

  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  const isLoading = isLoadingBudgets || isLoadingTransactions;

  const budgetsWithSpending = useMemo(() => {
    return budgets.map((budget) => {
      const categoryTransactions = transactions.filter(
        (t) => t.category === budget.category && t.amount < 0
      );
      const spent = categoryTransactions.reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0
      );
      return {
        budget,
        spent,
        transactions: categoryTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      };
    });
  }, [budgets, transactions]);

  const handleAddBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    createBudget.mutate(
      {
        category: data.category,
        maximum: data.maxSpend,
        theme: getHexFromThemeName(data.theme) || data.theme,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
        },
      }
    );
  };

  const handleEditBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    if (!editingBudget || !editingBudget.id) return;
    updateBudget.mutate(
      {
        id: editingBudget.id,
        maximum: data.maxSpend,
        theme: getHexFromThemeName(data.theme) || data.theme,
      },
      {
        onSuccess: () => {
          setEditingBudget(null);
        },
      }
    );
  };

  const handleDeleteBudget = () => {
    if (!deletingBudget || !deletingBudget.id) return;
    deleteBudget.mutate(deletingBudget.id, {
      onSuccess: () => {
        setDeletingBudget(null);
      },
    });
  };

  return (
    <PageLayout
      title="Budgets"
      action={
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add New Budget
        </Button>
      }
    >
      {(isBudgetsError || isTransactionsError) && <DataErrorAlert />}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] xl:grid-cols-[400px_1fr] gap-6 lg:gap-8">
          <div className="h-[400px] animate-pulse bg-gray-200 rounded-lg" />
          <div className="space-y-6">
            <div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />
            <div className="h-[300px] animate-pulse bg-gray-200 rounded-lg" />
          </div>
        </div>
      ) : budgetsWithSpending.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] xl:grid-cols-[400px_1fr] gap-6 lg:gap-8">
          <div className="h-fit">
            <SpendingSummary budgetsWithSpending={budgetsWithSpending} />
          </div>
          <div className="space-y-6">
            {budgetsWithSpending.map(({ budget, spent, transactions }) => (
              <BudgetCard
                key={budget.category}
                budget={budget}
                spent={spent}
                transactions={transactions}
                onEdit={() => setEditingBudget(budget)}
                onDelete={() => setDeletingBudget(budget)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon="/assets/images/icon-nav-budgets.svg"
          title="No budgets yet"
          description="Create your first budget to start tracking your spending across different categories."
          actionLabel="+ Add New Budget"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}

      <BudgetFormModal
        mode="add"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddBudget}
      />

      {editingBudget && (
        <BudgetFormModal
          mode="edit"
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
          onSubmit={handleEditBudget}
          initialData={{
            category: editingBudget.category,
            maxSpend: editingBudget.maximum,
            theme:
              getThemeNameFromHex(editingBudget.theme) || editingBudget.theme,
          }}
        />
      )}

      {deletingBudget && (
        <DeleteConfirmationModal
          open={!!deletingBudget}
          onOpenChange={(open) => !open && setDeletingBudget(null)}
          onConfirm={handleDeleteBudget}
          title="Budget"
          itemName={deletingBudget.category}
        />
      )}
    </PageLayout>
  );
}
