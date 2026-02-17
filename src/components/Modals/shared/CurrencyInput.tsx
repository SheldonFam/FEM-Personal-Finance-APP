"use client";

import { UseFormRegister, FieldErrors, FieldValues, RegisterOptions, Path } from "react-hook-form";
import { Input } from "@/components/ui/Input";

interface CurrencyInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  validation?: RegisterOptions<TFieldValues>;
  max?: number;
}

export default function CurrencyInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "e.g. 2000",
  register,
  errors,
  validation,
  max,
}: CurrencyInputProps<TFieldValues>) {
  const errorMessage = errors[name]?.message;
  const errorString = typeof errorMessage === 'string'
    ? errorMessage
    : errorMessage?.toString();

  return (
    <div>
      <Input
        type="number"
        label={label}
        prefix="$"
        placeholder={placeholder}
        {...register(name, validation)}
        className="h-11"
        min="0"
        max={max}
        step="0.01"
        error={errorString}
      />
    </div>
  );
}
