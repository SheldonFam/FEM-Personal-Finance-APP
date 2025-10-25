"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

interface DeleteBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetName: string;
  onConfirm: () => void;
}

export function DeleteBudgetModal({
  open,
  onOpenChange,
  budgetName,
  onConfirm,
}: DeleteBudgetModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Delete '{budgetName}'?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-8">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="w-full h-[53px] text-sm font-bold"
          >
            Yes, Confirm Deletion
          </Button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            No, Go Back
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
