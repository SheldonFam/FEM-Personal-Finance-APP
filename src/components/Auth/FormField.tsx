import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "number";
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
  autoComplete?: string;
}

/**
 * FormField Component
 * Reusable form field with label, input, and error handling
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  placeholder,
  error,
  register,
  autoComplete,
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={register.name} className="block text-sm font-medium text-gray-700">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        error={error}
        aria-invalid={error ? "true" : "false"}
        autoComplete={autoComplete}
        {...register}
      />
    </div>
  );
};
