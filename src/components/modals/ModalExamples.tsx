"use client";

/**
 * Modal Usage Examples
 *
 * This file demonstrates how to use all the modal components in your application.
 * Copy these examples into your actual components where you need to use the modals.
 */

import * as React from "react";
import { Button } from "@/components/ui/Button";
import {
  AddBudgetModal,
  EditBudgetModal,
  DeleteBudgetModal,
  AddToPotModal,
  WithdrawFromPotModal,
} from "./index";

export function ModalExamples() {
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
    console.log("Adding budget:", data);
    // Add your logic here to save the budget
  };

  const handleEditBudget = (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => {
    console.log("Editing budget:", data);
    // Add your logic here to update the budget
  };

  const handleDeleteBudget = () => {
    console.log("Deleting budget:", exampleBudget.category);
    // Add your logic here to delete the budget
  };

  const handleAddToPot = (amount: number) => {
    console.log("Adding to pot:", amount);
    // Add your logic here to add money to the pot
  };

  const handleWithdrawFromPot = (amount: number) => {
    console.log("Withdrawing from pot:", amount);
    // Add your logic here to withdraw money from the pot
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-8">Modal Examples</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Budget Modals</h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowAddBudget(true)}>Add Budget</Button>
            <Button onClick={() => setShowEditBudget(true)}>Edit Budget</Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteBudget(true)}
            >
              Delete Budget
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Pot Modals</h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowAddToPot(true)}>Add to Pot</Button>
            <Button onClick={() => setShowWithdrawFromPot(true)}>
              Withdraw from Pot
            </Button>
          </div>
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

/**
 * USAGE EXAMPLES:
 *
 * 1. Add Budget Modal:
 * ------------------
 * import { AddBudgetModal } from "@/components/modals";
 *
 * const [open, setOpen] = useState(false);
 *
 * <AddBudgetModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => {
 *     // Handle budget creation
 *     console.log(data); // { category, maxSpend, theme }
 *   }}
 * />
 *
 *
 * 2. Edit Budget Modal:
 * --------------------
 * import { EditBudgetModal } from "@/components/modals";
 *
 * const [open, setOpen] = useState(false);
 * const budget = { category: "Entertainment", maxSpend: 50, theme: "Green" };
 *
 * <EditBudgetModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   budget={budget}
 *   onSubmit={(data) => {
 *     // Handle budget update
 *     console.log(data); // { category, maxSpend, theme }
 *   }}
 * />
 *
 *
 * 3. Delete Budget Modal:
 * ----------------------
 * import { DeleteBudgetModal } from "@/components/modals";
 *
 * const [open, setOpen] = useState(false);
 *
 * <DeleteBudgetModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   budgetName="Entertainment"
 *   onConfirm={() => {
 *     // Handle budget deletion
 *   }}
 * />
 *
 *
 * 4. Add to Pot Modal:
 * -------------------
 * import { AddToPotModal } from "@/components/modals";
 *
 * const [open, setOpen] = useState(false);
 * const pot = {
 *   name: "Savings",
 *   currentAmount: 159,
 *   targetAmount: 2000,
 *   theme: "#277C78"
 * };
 *
 * <AddToPotModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   pot={pot}
 *   onSubmit={(amount) => {
 *     // Handle adding to pot
 *     console.log(amount); // number
 *   }}
 * />
 *
 *
 * 5. Withdraw from Pot Modal:
 * --------------------------
 * import { WithdrawFromPotModal } from "@/components/modals";
 *
 * const [open, setOpen] = useState(false);
 * const pot = {
 *   name: "Savings",
 *   currentAmount: 159,
 *   targetAmount: 2000,
 *   theme: "#C94736"
 * };
 *
 * <WithdrawFromPotModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   pot={pot}
 *   onSubmit={(amount) => {
 *     // Handle withdrawal
 *     console.log(amount); // number
 *   }}
 * />
 */
