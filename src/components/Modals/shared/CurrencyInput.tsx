"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface CurrencyInputProps {
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  validation: any;
  max?: number;
}

export default function CurrencyInput({
  name,
  label,
  placeholder = "e.g. 2000",
  register,
  errors,
  validation,
  max,
}: CurrencyInputProps) {
  return (
    <div>
      <Label className="text-xs font-bold text-muted-foreground">{label}</Label>
      <Input
        type="number"
        prefix="$"
        placeholder={placeholder}
        {...register(name, validation)}
        className="h-[45px]"
        min="0"
        max={max}
        step="0.01"
        error={errors[name]?.message as string}
      />
    </div>
  );
}
