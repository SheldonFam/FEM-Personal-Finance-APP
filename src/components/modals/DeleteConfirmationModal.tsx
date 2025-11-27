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

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  itemName: string;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const defaultDescription = `Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be reversed, and all the data inside it will be removed forever.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Delete '{itemName}'?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description || defaultDescription}
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

