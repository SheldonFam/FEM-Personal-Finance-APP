"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import FormErrorAlert from "@/components/Modals/shared/FormErrorAlert";
import { BaseModal } from "@/components/Modals/shared/BaseModal";

interface BaseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  buttonLabel: string;
  submitError: string | null;
  formClassName?: string;
}

export function BaseFormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  isSubmitting,
  buttonLabel,
  submitError,
  formClassName = "space-y-4",
}: BaseFormModalProps) {
  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <form onSubmit={onSubmit} className={formClassName}>
        {children}

        <FormErrorAlert error={submitError} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[53px] text-sm font-bold mt-1 cursor-pointer"
        >
          {buttonLabel}
        </Button>
      </form>
    </BaseModal>
  );
}
