"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import CurrencyInput from "@/components/Modals/shared/CurrencyInput";
import FormErrorAlert from "@/components/Modals/shared/FormErrorAlert";
import {
  currencyValidationRules,
  createMaxValidation,
} from "@/lib/validations/formValidations";

type PotMoneyMode = "add" | "withdraw";

interface PotMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PotMoneyMode;
  pot: {
    name: string;
    currentAmount: number;
    targetAmount: number;
    theme: string;
  } | null;
  onSubmit: (amount: number) => void;
}

interface PotMoneyFormData {
  amount: string;
}

const MODAL_CONFIG = {
  add: {
    title: (potName: string) => `Add to '${potName}'`,
    description:
      "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.",
    label: "Amount to Add",
    placeholder: "e.g. 100",
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Adding..." : "Confirm Addition",
    defaultColor: "#277C78",
  },
  withdraw: {
    title: (potName: string) => `Withdraw from '${potName}'`,
    description:
      "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.",
    label: "Amount to Withdraw",
    placeholder: (maxAmount: number) => `Maximum: ${maxAmount.toFixed(2)}`,
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Processing..." : "Confirm Withdrawal",
    defaultColor: "#C94736",
  },
} as const;

export default function PotMoneyModal({
  open,
  onOpenChange,
  mode,
  pot,
  onSubmit,
}: PotMoneyModalProps) {
  const config = MODAL_CONFIG[mode];
  const maxWithdraw = mode === "withdraw" ? pot?.currentAmount || 0 : Infinity;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PotMoneyFormData>({
    defaultValues: {
      amount: "",
    },
    mode: "onBlur",
  });

  const amount = watch("amount");
  const currentPercentage = pot
    ? (pot.currentAmount / pot.targetAmount) * 100
    : 0;

  const newAmount = pot
    ? mode === "add"
      ? pot.currentAmount + (parseFloat(amount) || 0)
      : Math.max(pot.currentAmount - (parseFloat(amount) || 0), 0)
    : 0;

  const newPercentage = pot ? (newAmount / pot.targetAmount) * 100 : 0;

  const onFormSubmit = async (data: PotMoneyFormData) => {
    setSubmitError(null);
    try {
      const numValue = parseFloat(data.amount);
      if (isNaN(numValue)) {
        throw new Error("Invalid number");
      }

      await onSubmit(numValue);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} money:`, error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to ${mode} money. Please try again.`
      );
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setSubmitError(null);
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-[32px] font-bold text-foreground">
            {config.title(pot?.name || "")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div>
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
              color={pot?.theme || config.defaultColor}
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
          <form onSubmit={handleSubmit(onFormSubmit)} className="mt-5">
            <CurrencyInput
              name="amount"
              label={config.label}
              placeholder={
                typeof config.placeholder === "function"
                  ? config.placeholder(maxWithdraw)
                  : config.placeholder
              }
              register={register}
              errors={errors}
              validation={
                mode === "withdraw"
                  ? createMaxValidation(maxWithdraw, "Amount")
                  : currencyValidationRules
              }
              max={mode === "withdraw" ? maxWithdraw : undefined}
            />

            <FormErrorAlert error={submitError} />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[53px] text-sm font-bold mt-5"
            >
              {config.buttonLabel(isSubmitting)}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
