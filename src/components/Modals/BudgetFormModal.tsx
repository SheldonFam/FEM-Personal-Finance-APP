"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import ThemeSelector from "@/components/Modals/shared/ThemeSelector";
import CurrencyInput from "@/components/Modals/shared/CurrencyInput";
import FormErrorAlert from "@/components/Modals/shared/FormErrorAlert";
import { currencyValidationRules } from "@/lib/validations/formValidations";
import { useState, useEffect } from "react";

type BudgetFormMode = "add" | "edit";

interface BudgetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: BudgetFormMode;
  initialData?: {
    category: string;
    maxSpend: number;
    theme: string;
  } | null;
  onSubmit: (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => void;
}

interface BudgetFormData {
  category: string;
  maxSpend: string;
  theme: string;
}

const BUDGET_CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
];

const MODAL_CONFIG = {
  add: {
    title: "Add New Budget",
    description:
      "Choose a category to set a spending budget. These categories can help you monitor spending.",
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Adding..." : "Add Budget",
  },
  edit: {
    title: "Edit Budget",
    description:
      "As your budgets change, feel free to update your spending limits.",
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Saving..." : "Save Changes",
  },
} as const;

export function BudgetFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: BudgetFormModalProps) {
  const config = MODAL_CONFIG[mode];
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: {
      category: "",
      maxSpend: "",
      theme: "",
    },
    mode: "onBlur",
  });

  const onFormSubmit = async (data: BudgetFormData) => {
    setSubmitError(null);
    try {
      const numValue = parseFloat(data.maxSpend);
      if (isNaN(numValue)) {
        throw new Error("Invalid number");
      }

      await onSubmit({
        category: data.category,
        maxSpend: numValue,
        theme: data.theme,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} budget:`, error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save budget. Please try again."
      );
    }
  };

  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        category: initialData.category,
        maxSpend: initialData.maxSpend.toString(),
        theme: initialData.theme,
      });
    } else if (!open) {
      reset({
        category: "",
        maxSpend: "",
        theme: "",
      });
      setSubmitError(null);
    }
  }, [initialData, mode, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 mt-5">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Budget Category
            </Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-[45px] text-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p
                      role="alert"
                      className="text-xs text-destructive font-medium"
                    >
                      {errors.category.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <CurrencyInput
            name="maxSpend"
            label="Maximum Spend"
            register={register}
            errors={errors}
            validation={currencyValidationRules}
          />

          <ThemeSelector control={control} errors={errors} />

          <FormErrorAlert error={submitError} />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[53px] text-sm font-bold mt-8"
          >
            {config.buttonLabel(isSubmitting)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
