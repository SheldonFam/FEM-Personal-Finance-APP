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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { COLOR_THEMES } from "@/lib/constants/constants";

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

// Convert COLOR_THEMES to array format for UI
const THEME_OPTIONS = Object.entries(COLOR_THEMES).map(([name, color]) => ({
  name,
  color,
}));

export function PotFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  existingPots = [],
}: PotFormModalProps) {
  const config = MODAL_CONFIG[mode];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PotFormData>({
    defaultValues: {
      name: "",
      target: "",
      theme: "",
    },
    mode: "onBlur",
  });

  // Filter out already used themes (only for add mode)
  const usedThemes = mode === "add" ? existingPots.map((pot) => pot.theme) : [];
  const availableThemes =
    mode === "add"
      ? THEME_OPTIONS.filter((t) => !usedThemes.includes(t.name))
      : THEME_OPTIONS;

  const onFormSubmit = async (data: PotFormData) => {
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
    }
  };

  React.useEffect(() => {
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
              Pot Name
            </Label>
            <Input
              type="text"
              placeholder="e.g. Rainy Days"
              {...register("name", {
                required: "Pot name is required",
                minLength: {
                  value: 1,
                  message: "Pot name cannot be empty",
                },
              })}
              className="h-[45px]"
              error={errors.name?.message}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Target
            </Label>
            <Input
              type="number"
              prefix="$"
              placeholder="e.g. 2000"
              {...register("target", {
                required: "Target amount is required",
                validate: {
                  positive: (value) => {
                    const num = parseFloat(value);
                    return (
                      (!isNaN(num) && num > 0) ||
                      "Target must be greater than 0"
                    );
                  },
                  validNumber: (value) =>
                    !isNaN(parseFloat(value)) || "Must be a valid number",
                },
              })}
              className="h-[45px]"
              min="0"
              step="0.01"
              error={errors.target?.message}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Theme
            </Label>
            <Controller
              name="theme"
              control={control}
              rules={{ required: "Theme is required" }}
              render={({ field }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-[45px] text-sm">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.length > 0 ? (
                        availableThemes.map((themeOption) => (
                          <SelectItem
                            key={themeOption.name}
                            value={themeOption.name}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: themeOption.color }}
                              />
                              {themeOption.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No themes available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.theme && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.theme.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

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
