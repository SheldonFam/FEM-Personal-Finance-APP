"use client";

import * as React from "react";
import ThemeSelector from "@/components/Modals/shared/ThemeSelector";
import CurrencyInput from "@/components/Modals/shared/CurrencyInput";
import CategorySelect from "@/components/Modals/shared/CategorySelect";
import { BaseFormModal } from "@/components/Modals/shared/BaseFormModal";
import { useFormModal } from "@/hooks/useFormModal";
import { currencyValidationRules } from "@/lib/validations/formValidations";

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

  const { form, onFormSubmit, submitError } = useFormModal<
    BudgetFormData,
    { category: string; maxSpend: number; theme: string }
  >({
    mode,
    open,
    initialData: initialData
      ? {
          category: initialData.category,
          maxSpend: initialData.maxSpend.toString(),
          theme: initialData.theme,
        }
      : null,
    defaultValues: {
      category: "",
      maxSpend: "",
      theme: "",
    },
    onSubmit,
    onOpenChange,
    transformData: (data) => {
      const numValue = parseFloat(data.maxSpend);
      if (isNaN(numValue)) {
        throw new Error("Invalid number");
      }
      return {
        category: data.category,
        maxSpend: numValue,
        theme: data.theme,
      };
    },
    errorMessage: "Failed to save budget. Please try again.",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <BaseFormModal
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      description={config.description}
      onSubmit={handleSubmit(onFormSubmit)}
      isSubmitting={isSubmitting}
      buttonLabel={config.buttonLabel(isSubmitting)}
      submitError={submitError}
      formClassName="space-y-5"
    >
      <CategorySelect
        control={control}
        errors={errors}
        categories={BUDGET_CATEGORIES}
      />

      <CurrencyInput
        name="maxSpend"
        label="Maximum Spend"
        register={register}
        errors={errors}
        validation={currencyValidationRules}
      />

      <ThemeSelector control={control} errors={errors} />
    </BaseFormModal>
  );
}
