"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import ThemeSelector from "@/components/Modals/shared/ThemeSelector";
import CurrencyInput from "@/components/Modals/shared/CurrencyInput";
import FormErrorAlert from "@/components/Modals/shared/FormErrorAlert";
import {
  currencyValidationRules,
  requiredFieldRules,
} from "@/lib/validations/formValidations";
import { COLOR_THEMES } from "@/lib/constants/constants";
import { useState, useEffect } from "react";
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PotFormData>({
    defaultValues: {
      name: "",
      target: "",
      theme: "",
    },
    mode: "onBlur",
  });

  const potName = watch("name");

  // Filter out already used themes (only for add mode)
  const usedThemes = mode === "add" ? existingPots.map((pot) => pot.theme) : [];
  const availableThemes =
    mode === "add"
      ? Object.keys(COLOR_THEMES).filter((t) => !usedThemes.includes(t))
      : undefined;

  const onFormSubmit = async (data: PotFormData) => {
    setSubmitError(null);
    try {
      const numValue = parseFloat(data.target);
      if (isNaN(numValue)) {
        throw new Error("Invalid number");
      }

      await onSubmit({
        name: data.name,
        target: numValue,
        theme: data.theme,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode} pot:`, error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save pot. Please try again."
      );
    }
  };

  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        name: initialData.name,
        target: initialData.target.toString(),
        theme: initialData.theme,
      });
    } else if (!open) {
      reset({
        name: "",
        target: "",
        theme: "",
      });
      setSubmitError(null);
    }
  }, [initialData, mode, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-[32px] font-bold text-foreground">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
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
                errors.name &&
                  "border-destructive focus-visible:ring-destructive"
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

          <FormErrorAlert error={submitError} />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[53px] text-sm font-bold mt-1"
          >
            {config.buttonLabel(isSubmitting)}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
