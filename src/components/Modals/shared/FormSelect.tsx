"use client";

import {
  Controller,
  Control,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
  renderContent?: () => ReactNode;
  disabled?: boolean;
}

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  requiredMessage?: string;
  className?: string;
}

export default function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  errors,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = true,
  requiredMessage,
  className = "space-y-1",
}: FormSelectProps<TFieldValues>) {
  const errorMessage = requiredMessage || `${label} is required`;
  const fieldError = errors[name]?.message;
  const fieldErrorText =
    typeof fieldError === "string" ? fieldError : fieldError?.toString();

  return (
    <div className={className}>
      <Label className="text-xs font-bold text-muted-foreground">{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={required ? { required: errorMessage } : undefined}
        render={({ field }) => (
          <>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-11 text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.renderContent
                      ? option.renderContent()
                      : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrorText ? (
              <p role="alert" className="text-xs text-destructive font-medium">
                {fieldErrorText}
              </p>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
