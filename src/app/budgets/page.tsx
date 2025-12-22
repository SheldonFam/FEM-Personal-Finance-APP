"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import budgetData from "@/../data.json";
import { Budget, Transaction } from "@/lib/types";
import {
  getThemeNameFromHex,
  getHexFromThemeName,
} from "@/lib/constants/constants";
import { BudgetFormModal } from "@/components/Modals/BudgetFormModal";
import { DeleteConfirmationModal } from "@/components/Modals/DeleteConfirmationModal";
import { BudgetCard } from "@/components/Budgets/BudgetCard";
import { SpendingSummary } from "@/components/Budgets/SpendingSummary";
import { Card } from "@/components/ui/Card";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(
    budgetData.budgets as Budget[]
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  const transactions = budgetData.transactions as Transaction[];

  // Calculate spending per budget
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
    const newBudget: Budget = {
      category: data.category,
      maximum: data.maxSpend,
      theme: getHexFromThemeName(data.theme) || data.theme, // Convert name to hex
    };
    setBudgets([...budgets, newBudget]);
  };

  const handleEditBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    if (!editingBudget) return;
    setBudgets(
      budgets.map((b) =>
        b.category === editingBudget.category
          ? {
              ...b,
              maximum: data.maxSpend,
              theme: getHexFromThemeName(data.theme) || data.theme,
            }
          : b
      )
    );
    setEditingBudget(null);
  };

  const handleDeleteBudget = () => {
    if (!deletingBudget) return;
    setBudgets(budgets.filter((b) => b.category !== deletingBudget.category));
    setDeletingBudget(null);
  };

  return (
    <div className="bg-[#F5F5F5] p-6 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add New Budget
        </Button>
      </div>

      {/* Main Content Layout */}
      {budgetsWithSpending.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8">
          {/* Left: Spending Summary */}
          <div className="h-fit">
            <SpendingSummary budgetsWithSpending={budgetsWithSpending} />
          </div>

          {/* Right: Budget Cards */}
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
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Image
              src="/assets/images/icon-nav-budgets.svg"
              alt="No budgets"
              width={64}
              height={64}
              className="mx-auto mb-4 opacity-20"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No budgets yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first budget to start tracking your spending across
              different categories.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Add New Budget
            </Button>
          </div>
        </Card>
      )}

      {/* Modals */}
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
              getThemeNameFromHex(editingBudget.theme) || editingBudget.theme, // Convert hex to name
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
    </div>
  );
}
