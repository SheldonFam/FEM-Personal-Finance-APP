"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";

interface AddToPotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pot: {
    name: string;
    currentAmount: number;
    targetAmount: number;
    theme: string;
  } | null;
  onSubmit: (amount: number) => void;
}

export function AddToPotModal({
  open,
  onOpenChange,
  pot,
  onSubmit,
}: AddToPotModalProps) {
  const [amount, setAmount] = React.useState<string>("");

  const currentPercentage = pot
    ? (pot.currentAmount / pot.targetAmount) * 100
    : 0;

  const newAmount = pot ? pot.currentAmount + (parseFloat(amount) || 0) : 0;
  const newPercentage = pot ? (newAmount / pot.targetAmount) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onSubmit(parseFloat(amount));
      setAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Add to '{pot?.name}'
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add money to your pot to keep it separate from your main balance. As
            soon as you add this money, it will be deducted from your current
            balance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-8">
          {/* New Amount Display */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Amount</span>
            <span className="text-[32px] font-bold">
              ${newAmount.toFixed(2)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <Progress
              value={Math.min(newPercentage, 100)}
              className="h-2"
              color={pot?.theme || "#277C78"}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">
                {newPercentage.toFixed(2)}%
              </span>
              <span className="text-muted-foreground">
                Target of ${pot?.targetAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground">
                Amount to Add
              </Label>
              <Input
                type="number"
                prefix="$"
                placeholder="e.g. 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-[45px]"
                min="0"
                step="0.01"
              />
            </div>

            <Button type="submit" className="w-full h-[53px] text-sm font-bold">
              Confirm Addition
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
