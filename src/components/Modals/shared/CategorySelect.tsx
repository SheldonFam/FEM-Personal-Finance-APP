"use client";

import { Control, FieldErrors } from "react-hook-form";
import FormSelect from "@/components/Modals/shared/FormSelect";
import type { TransactionCategory } from "@/lib/types";

interface CategorySelectProps {
  control: Control<any>;
  errors: FieldErrors;
  name?: string;
  label?: string;
  /**
   * Real categories only. Typed to exclude the filter sentinel, which must
   * never reach a form that writes a category onto a record.
   */
  categories: readonly TransactionCategory[];
}

export default function CategorySelect({
  control,
  errors,
  name = "category",
  label = "Budget Category",
  categories,
}: CategorySelectProps) {
  const options = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <FormSelect
      control={control}
      errors={errors}
      name={name}
      label={label}
      placeholder="Select a category"
      options={options}
      requiredMessage="Category is required"
    />
  );
}
