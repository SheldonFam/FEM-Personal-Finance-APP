"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import budgetData from "@/../data.json";
import { AddBudgetModal } from "@/components/modals/AddBudgetModal";
import { EditBudgetModal } from "@/components/modals/EditBudgetModal";
import { DeleteBudgetModal } from "@/components/modals/DeleteBudgetModal";
import { BudgetChartWithLegend } from "@/components/charts/BudgetDonutChart";
import { normalizeImagePath } from "@/lib/utils";

// Types
interface Budget {
  category: string;
  maximum: number;
  theme: string;
}

interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

// Theme color mapping
const THEME_COLORS: Record<string, string> = {
  "#277C78": "Green",
  "#F2CDAC": "Yellow",
  "#82C9D7": "Cyan",
  "#626070": "Navy",
  "#C94736": "Red",
  "#826CB0": "Purple",
  "#597C7C": "Turquoise",
  "#93674F": "Brown",
  "#934F6F": "Magenta",
  "#3F82B2": "Blue",
  "#97A0AC": "Navy Grey",
  "#7F9161": "Army Green",
  "#AF81BA": "Pink",
  "#CAB361": "Gold",
  "#BE6C49": "Orange",
};

const COLOR_THEMES: Record<string, string> = {
  Green: "#277C78",
  Yellow: "#F2CDAC",
  Cyan: "#82C9D7",
  Navy: "#626070",
  Red: "#C94736",
  Purple: "#826CB0",
  Turquoise: "#597C7C",
  Brown: "#93674F",
  Magenta: "#934F6F",
  Blue: "#3F82B2",
  "Navy Grey": "#97A0AC",
  "Army Green": "#7F9161",
  Pink: "#AF81BA",
  Gold: "#CAB361",
  Orange: "#BE6C49",
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Individual Budget Card Component
const BudgetCard = ({
  budget,
  spent,
  transactions,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  spent: number;
  transactions: Transaction[];
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const percentage = Math.min((spent / budget.maximum) * 100, 100);
  const remaining = Math.max(0, budget.maximum - spent);
  const isOverBudget = spent > budget.maximum;

  // Get latest 3 transactions for this category
  const latestTransactions = transactions
    .filter((t) => t.category === budget.category)
    .slice(0, 3);

  return (
    <Card className="p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: budget.theme }}
          />
          <h3 className="text-xl font-bold text-gray-900">{budget.category}</h3>
        </div>
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Image
              src="/assets/images/icon-ellipsis.svg"
              alt="Options"
              width={16}
              height={4}
            />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Budget
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Budget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spending Summary */}
      <div className="mb-5">
        <p className="text-sm text-gray-500 mb-3">
          Maximum of {formatCurrency(budget.maximum)}
        </p>

        {/* Progress Bar */}
        <div className="relative">
          <Progress
            value={percentage}
            className="h-8 rounded-lg"
            color={budget.theme}
          />
          {/* Overlay text on progress bar */}
          <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
            <div className="flex items-center justify-between w-full text-xs font-bold">
              <span className="text-white drop-shadow-sm">
                {formatCurrency(spent)} spent
              </span>
              {!isOverBudget && (
                <span className="text-gray-700">
                  {formatCurrency(remaining)} remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {isOverBudget && (
          <p className="text-sm text-red-600 mt-2 font-medium">
            Over budget by {formatCurrency(spent - budget.maximum)}!
          </p>
        )}
      </div>

      {/* Spending Breakdown */}
      <div className="pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-gray-900">Latest Spending</h4>
          {latestTransactions.length > 0 && (
            <button className="text-sm text-gray-600 hover:text-gray-900">
              See All
            </button>
          )}
        </div>

        {latestTransactions.length > 0 ? (
          <div className="space-y-3">
            {latestTransactions.map((transaction, index) => {
              const avatarPath = normalizeImagePath(transaction.avatar);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={avatarPath}
                        alt={transaction.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">
                    -{formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No transactions yet
          </p>
        )}
      </div>
    </Card>
  );
};

// Spending Summary Component
const SpendingSummary = ({
  budgetsWithSpending,
}: {
  budgetsWithSpending: Array<{
    budget: Budget;
    spent: number;
    transactions: Transaction[];
  }>;
}) => {
  const totalBudget = budgetsWithSpending.reduce(
    (sum, { budget }) => sum + budget.maximum,
    0
  );
  const totalSpent = budgetsWithSpending.reduce(
    (sum, { spent }) => sum + spent,
    0
  );

  // Transform data for the chart component
  const categories = budgetsWithSpending.map(({ budget, spent }) => ({
    name: budget.category,
    spent: spent,
    limit: budget.maximum,
    color: budget.theme,
  }));

  return (
    <Card className="p-5 md:p-8 h-fit sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Spending Summary</h2>
      <BudgetChartWithLegend
        categories={categories}
        totalSpent={totalSpent}
        totalLimit={totalBudget}
      />
    </Card>
  );
};

// Main Budgets Page Component
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
      theme: COLOR_THEMES[data.theme] || data.theme, // Convert name to hex
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
              theme: COLOR_THEMES[data.theme] || data.theme,
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Budgets
        </h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Add New Budget
        </Button>
      </div>

      {/* Main Content Layout */}
      {budgetsWithSpending.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6">
          {/* Left: Spending Summary */}
          <div>
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
      <AddBudgetModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddBudget}
      />

      {editingBudget && (
        <EditBudgetModal
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
          onSubmit={handleEditBudget}
          budget={{
            category: editingBudget.category,
            maxSpend: editingBudget.maximum,
            theme: THEME_COLORS[editingBudget.theme] || editingBudget.theme, // Convert hex to name
          }}
        />
      )}

      {deletingBudget && (
        <DeleteBudgetModal
          open={!!deletingBudget}
          onOpenChange={(open) => !open && setDeletingBudget(null)}
          onConfirm={handleDeleteBudget}
          budgetName={deletingBudget.category}
        />
      )}
    </div>
  );
}
