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
}) => {
  return (
    <div className="space-y-1">
      <Label className="block text-sm font-medium text-gray-700">{label}</Label>
      <PasswordInput
        placeholder={placeholder}
        show={show}
        onToggleVisibility={onToggleVisibility}
        error={error}
        aria-invalid={error ? "true" : "false"}
        {...register}
      />
      {helperText && (
        <p className="text-sm text-gray-500 text-right">{helperText}</p>
      )}
    </div>
  );
};
