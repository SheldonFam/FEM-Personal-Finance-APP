"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import ThemeSelector from "@/components/Modals/shared/ThemeSelector";
import CurrencyInput from "@/components/Modals/shared/CurrencyInput";
import { BaseFormModal } from "@/components/Modals/shared/BaseFormModal";
import { useFormModal } from "@/hooks/useFormModal";
import {
  currencyValidationRules,
  requiredFieldRules,
} from "@/lib/validations/formValidations";
import { COLOR_THEMES } from "@/lib/constants/constants";
import { cn } from "@/lib/utils";

type PotFormMode = "add" | "edit";

interface PotFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PotFormMode;
  initialData?: {
    name: string;
    target: number;
    theme: string;
  } | null;
  onSubmit: (data: { name: string; target: number; theme: string }) => void;
  existingPots?: Array<{ name: string; theme: string }>;
}

interface PotFormData {
  name: string;
  target: string;
  theme: string;
}

const MODAL_CONFIG = {
  add: {
    title: "Add New Pot",
    description:
      "Create a pot to set savings targets. These can help keep you on track as you save for special purchases.",
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Adding..." : "Add Pot",
  },
  edit: {
    title: "Edit Pot",
    description:
      "If your saving targets change, feel free to update your pots.",
    buttonLabel: (isSubmitting: boolean) =>
      isSubmitting ? "Saving..." : "Save Changes",
  },
} as const;

export default function PotFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  existingPots = [],
}: PotFormModalProps) {
  const config = MODAL_CONFIG[mode];

  const { form, onFormSubmit, submitError } = useFormModal<
    PotFormData,
    { name: string; target: number; theme: string }
  >({
    mode,
    open,
    initialData: initialData
      ? {
          name: initialData.name,
          target: initialData.target.toString(),
          theme: initialData.theme,
        }
      : null,
    defaultValues: {
      name: "",
      target: "",
      theme: "",
    },
    onSubmit,
    onOpenChange,
    transformData: (data) => {
      const numValue = parseFloat(data.target);
      if (isNaN(numValue)) {
        throw new Error("Invalid number");
      }
      return {
        name: data.name,
        target: numValue,
        theme: data.theme,
      };
    },
    errorMessage: "Failed to save pot. Please try again.",
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const potName = watch("name");

  // Filter out already used themes (only for add mode)
  const usedThemes = mode === "add" ? existingPots.map((pot) => pot.theme) : [];
  const availableThemes =
    mode === "add"
      ? Object.keys(COLOR_THEMES).filter((t) => !usedThemes.includes(t))
      : undefined;

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
    >
      <div className="space-y-1">
        <Label className="text-xs font-bold text-muted-foreground">
          Pot Name
        </Label>
        <Input
          type="text"
          placeholder="e.g. Rainy Days"
          maxLength={30}
          {...register("name", requiredFieldRules("Pot name"))}
          className={cn(
            "h-[45px]",
            errors.name && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <div className="flex items-center justify-between">
          {errors.name?.message ? (
            <p className="text-xs text-destructive font-medium">
              {errors.name.message}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {30 - potName?.length} characters left
          </span>
        </div>
      </div>

      <CurrencyInput
        name="target"
        label="Target"
        register={register}
        errors={errors}
        validation={currencyValidationRules}
      />

      <ThemeSelector
        control={control}
        errors={errors}
        availableThemes={availableThemes}
      />
    </BaseFormModal>
  );
}
