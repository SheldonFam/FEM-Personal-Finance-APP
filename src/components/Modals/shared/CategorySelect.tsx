"use client";

import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import FormSelect from "@/components/Modals/shared/FormSelect";
import type { TransactionCategory } from "@/lib/types";

interface CategorySelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  name?: Path<TFieldValues>;
  label?: string;
  /**
   * Real categories only. Typed to exclude the filter sentinel, which must
   * never reach a form that writes a category onto a record.
   */
  categories: readonly TransactionCategory[];
}

export default function CategorySelect<
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  errors,
  // A literal default cannot be proven to be a path of the caller's form
  // type, so it is asserted. Forms without a `category` field pass `name`.
  name = "category" as Path<TFieldValues>,
  label = "Budget Category",
  categories,
}: CategorySelectProps<TFieldValues>) {
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
