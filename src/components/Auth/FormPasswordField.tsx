import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { PasswordInput } from "@/components/Auth/PasswordInput";
import { Label } from "@/components/ui/Label";

interface FormPasswordFieldProps {
  label: string;
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
  show: boolean;
  onToggleVisibility: () => void;
  helperText?: string;
  autoComplete?: string;
}

/**
 * FormPasswordField Component
 * Reusable password field with label, password input, and error handling
 */
export const FormPasswordField: React.FC<FormPasswordFieldProps> = ({
  label,
  placeholder,
  error,
  register,
  show,
  onToggleVisibility,
  helperText,
  autoComplete,
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={register.name} className="block text-sm font-medium text-gray-700">{label}</Label>
      <PasswordInput
        placeholder={placeholder}
        show={show}
        onToggleVisibility={onToggleVisibility}
        error={error}
        aria-invalid={error ? "true" : "false"}
        autoComplete={autoComplete}
        {...register}
      />
      {helperText && (
        <p className="text-sm text-gray-500 text-right">{helperText}</p>
      )}
    </div>
  );
};
