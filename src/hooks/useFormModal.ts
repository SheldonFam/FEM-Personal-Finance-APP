import { useState, useEffect, useRef } from "react";
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from "react-hook-form";

interface UseFormModalOptions<
  TFormData extends FieldValues,
  TSubmitData = TFormData
> {
  mode: "add" | "edit" | "action";
  open: boolean;
  initialData?: Partial<TFormData> | null;
  defaultValues: DefaultValues<TFormData>;
  onSubmit: (data: TSubmitData) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
  transformData?: (formData: TFormData) => TSubmitData;
  errorMessage?: string;
}

interface UseFormModalReturn<TFormData extends FieldValues> {
  form: UseFormReturn<TFormData>;
  onFormSubmit: (data: TFormData) => Promise<void>;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
}

export function useFormModal<
  TFormData extends FieldValues,
  TSubmitData = TFormData
>({
  mode,
  open,
  initialData,
  defaultValues,
  onSubmit,
  onOpenChange,
  transformData,
  errorMessage = "Failed to save. Please try again.",
}: UseFormModalOptions<TFormData, TSubmitData>): UseFormModalReturn<TFormData> {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Store defaultValues in ref to avoid dependency issues
  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;

  // Store initialData in ref to track when it actually changes
  const initialDataRef = useRef(initialData);
  const prevOpenRef = useRef(false);

  const form = useForm<TFormData>({
    defaultValues,
    mode: "onBlur",
  });

  const { reset } = form;

  const onFormSubmit = async (data: TFormData) => {
    setSubmitError(null);
    try {
      const transformedData = transformData
        ? transformData(data)
        : (data as unknown as TSubmitData);
      await Promise.resolve(onSubmit(transformedData));
      reset(defaultValuesRef.current);
      onOpenChange(false);
    } catch (error) {
      console.error(`Failed to ${mode}:`, error);
      setSubmitError(error instanceof Error ? error.message : errorMessage);
    }
  };

  // Handle form reset when modal opens/closes
  useEffect(() => {
    const prevOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open) {
      // Reset to defaults when modal closes
      reset(defaultValuesRef.current);
      setSubmitError(null);
      return;
    }

    // Only reset when opening (transitioning from closed to open)
    if (!prevOpen && open) {
      // When modal opens, populate with initialData if in edit mode
      if (initialDataRef.current && mode === "edit") {
        reset(initialDataRef.current as DefaultValues<TFormData>);
      } else {
        // Reset to defaults when opening in add/action mode
        reset(defaultValuesRef.current);
      }
    }
  }, [open, mode, reset]); // Removed defaultValues from deps

  return {
    form,
    onFormSubmit,
    submitError,
    setSubmitError,
  };
}
