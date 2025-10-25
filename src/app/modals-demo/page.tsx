"use client";

/**
 * Modal Components Demo Page
 *
 * Visit this page to test and preview all modal components.
 * Navigate to /modals-demo to see this page.
 */

import * as React from "react";
import { Button } from "@/components/ui/Button";
import {
  AddBudgetModal,
  EditBudgetModal,
  DeleteBudgetModal,
  AddToPotModal,
  WithdrawFromPotModal,
} from "@/components/modals";

export default function ModalsDemo() {
  // Modal states
  const [showAddBudget, setShowAddBudget] = React.useState(false);
  const [showEditBudget, setShowEditBudget] = React.useState(false);
  const [showDeleteBudget, setShowDeleteBudget] = React.useState(false);
  const [showAddToPot, setShowAddToPot] = React.useState(false);
  const [showWithdrawFromPot, setShowWithdrawFromPot] = React.useState(false);

  // Example data
  const exampleBudget = {
    category: "Entertainment",
    maxSpend: 50,
    theme: "Green",
  };

  const examplePot = {
    name: "Savings",
    currentAmount: 159,
    targetAmount: 2000,
    theme: "#277C78",
  };

  // Handler functions
  const handleAddBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    console.log("✅ Adding budget:", data);
    alert(
      `Budget added!\nCategory: ${data.category}\nMax Spend: $${data.maxSpend}\nTheme: ${data.theme}`
    );
  };

  const handleEditBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    console.log("✏️ Editing budget:", data);
    alert(
      `Budget updated!\nCategory: ${data.category}\nMax Spend: $${data.maxSpend}\nTheme: ${data.theme}`
    );
  };

  const handleDeleteBudget = () => {
    console.log("🗑️ Deleting budget:", exampleBudget.category);
    alert(`Budget "${exampleBudget.category}" deleted!`);
  };

  const handleAddToPot = (amount: number) => {
    console.log("➕ Adding to pot:", amount);
    alert(
      `Added $${amount} to ${examplePot.name}!\nNew balance: $${
        examplePot.currentAmount + amount
      }`
    );
  };

  const handleWithdrawFromPot = (amount: number) => {
    console.log("➖ Withdrawing from pot:", amount);
    alert(
      `Withdrew $${amount} from ${examplePot.name}!\nNew balance: $${
        examplePot.currentAmount - amount
      }`
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Modal Components Demo</h1>
          <p className="text-muted-foreground">
            Click the buttons below to preview all modal components. Open the
            browser console to see logged data.
          </p>
        </div>

        {/* Budget Modals Section */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold">Budget Modals</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Manage budgets with these three modals
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowAddBudget(true)}
              className="flex-1 min-w-[200px]"
            >
              ✅ Add Budget
            </Button>
            <Button
              onClick={() => setShowEditBudget(true)}
              className="flex-1 min-w-[200px]"
              variant="outline"
            >
              ✏️ Edit Budget
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteBudget(true)}
              className="flex-1 min-w-[200px]"
            >
              🗑️ Delete Budget
            </Button>
          </div>
          <div className="mt-4 p-4 bg-muted rounded text-sm">
            <strong>Example Budget:</strong> {exampleBudget.category} - $
            {exampleBudget.maxSpend} ({exampleBudget.theme})
          </div>
        </div>

        {/* Pot Modals Section */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold">Pot Modals</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add or withdraw money from savings pots with progress tracking
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowAddToPot(true)}
              className="flex-1 min-w-[200px]"
            >
              ➕ Add to Pot
            </Button>
            <Button
              onClick={() => setShowWithdrawFromPot(true)}
              className="flex-1 min-w-[200px]"
              variant="outline"
            >
              ➖ Withdraw from Pot
            </Button>
          </div>
          <div className="mt-4 p-4 bg-muted rounded text-sm">
            <strong>Example Pot:</strong> {examplePot.name} - $
            {examplePot.currentAmount} / ${examplePot.targetAmount} (
            {(
              (examplePot.currentAmount / examplePot.targetAmount) *
              100
            ).toFixed(1)}
            %)
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold">Features</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Fully accessible with keyboard navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Click outside or press ESC to close</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Form validation and error handling</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Smooth animations and transitions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Responsive design (mobile & desktop)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Progress tracking with custom colors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>TypeScript support with type safety</span>
            </li>
          </ul>
        </div>

        {/* Documentation Links */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold">Documentation</h2>
          <div className="space-y-2 text-sm">
            <p>
              📖 <strong>README.md</strong> - Complete documentation with API
              reference
            </p>
            <p>
              🚀 <strong>QUICK_START.md</strong> - Quick start guide with
              copy-paste examples
            </p>
            <p>
              💡 <strong>ModalExamples.tsx</strong> - More usage examples and
              patterns
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h2 className="text-2xl font-bold">Usage Example</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
            <code>{`import { AddBudgetModal } from "@/components/modals";
import { useState } from "react";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Add Budget
      </button>
      
      <AddBudgetModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </>
  );
}`}</code>
          </pre>
        </div>
      </div>

      {/* Modal Components */}
      <AddBudgetModal
        open={showAddBudget}
        onOpenChange={setShowAddBudget}
        onSubmit={handleAddBudget}
      />

      <EditBudgetModal
        open={showEditBudget}
        onOpenChange={setShowEditBudget}
        budget={exampleBudget}
        onSubmit={handleEditBudget}
      />

      <DeleteBudgetModal
        open={showDeleteBudget}
        onOpenChange={setShowDeleteBudget}
        budgetName={exampleBudget.category}
        onConfirm={handleDeleteBudget}
      />

      <AddToPotModal
        open={showAddToPot}
        onOpenChange={setShowAddToPot}
        pot={examplePot}
        onSubmit={handleAddToPot}
      />

      <WithdrawFromPotModal
        open={showWithdrawFromPot}
        onOpenChange={setShowWithdrawFromPot}
        pot={examplePot}
        onSubmit={handleWithdrawFromPot}
      />
    </div>
  );
}
