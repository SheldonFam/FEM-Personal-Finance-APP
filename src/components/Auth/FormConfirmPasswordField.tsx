import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { PasswordInput } from "@/components/Auth/PasswordInput";
import { Label } from "@/components/ui/Label";

interface FormConfirmPasswordFieldProps {
  label: string;
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
  show: boolean;
  onToggleVisibility: () => void;
}

/**
 * FormConfirmPasswordField Component
 * Reusable password confirmation field with label and password input
 */
export const FormConfirmPasswordField: React.FC<
  FormConfirmPasswordFieldProps
> = ({ label, placeholder, error, register, show, onToggleVisibility }) => {
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
    </div>
  );
};
