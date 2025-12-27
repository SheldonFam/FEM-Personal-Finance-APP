"use client";

import { Control, FieldErrors } from "react-hook-form";
import FormSelect from "@/components/Modals/shared/FormSelect";

interface CategorySelectProps {
  control: Control<any>;
  errors: FieldErrors;
  name?: string;
  label?: string;
  categories: string[];
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
