"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
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

interface FormSelectProps {
  control: Control<any>;
  errors: FieldErrors;
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  requiredMessage?: string;
  className?: string;
}

export default function FormSelect({
  control,
  errors,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = true,
  requiredMessage,
  className = "space-y-1",
}: FormSelectProps) {
  const errorMessage = requiredMessage || `${label} is required`;

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
            {errors[name] && (
              <p role="alert" className="text-xs text-destructive font-medium">
                {errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
