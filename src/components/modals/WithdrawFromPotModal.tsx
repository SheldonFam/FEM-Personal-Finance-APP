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

interface WithdrawFromPotModalProps {
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

export function WithdrawFromPotModal({
  open,
  onOpenChange,
  pot,
  onSubmit,
}: WithdrawFromPotModalProps) {
  const [amount, setAmount] = React.useState<string>("");

  const currentPercentage = pot
    ? (pot.currentAmount / pot.targetAmount) * 100
    : 0;

  const newAmount = pot
    ? Math.max(pot.currentAmount - (parseFloat(amount) || 0), 0)
    : 0;
  const newPercentage = pot ? (newAmount / pot.targetAmount) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (
      amount &&
      withdrawAmount > 0 &&
      pot &&
      withdrawAmount <= pot.currentAmount
    ) {
      onSubmit(withdrawAmount);
      setAmount("");
      onOpenChange(false);
    }
  };

  const maxWithdraw = pot?.currentAmount || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Withdraw from '{pot?.name}'
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Withdraw from your pot to put money back in your main balance. This
            will reduce the amount you have in this pot.
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
              color={pot?.theme || "#C94736"}
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
                Amount to Withdraw
              </Label>
              <Input
                type="number"
                prefix="$"
                placeholder={`Maximum: ${maxWithdraw.toFixed(2)}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-[45px]"
                min="0"
                max={maxWithdraw}
                step="0.01"
              />
              {parseFloat(amount) > maxWithdraw && (
                <p className="text-xs text-destructive">
                  Amount cannot exceed current pot balance
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-[53px] text-sm font-bold"
              disabled={
                !amount ||
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > maxWithdraw
              }
            >
              Confirm Withdrawal
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
