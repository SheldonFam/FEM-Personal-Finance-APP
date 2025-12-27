"use client";

interface FormErrorAlertProps {
  error: string | null;
}

export default function FormErrorAlert({ error }: FormErrorAlertProps) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
    >
      <p className="text-sm text-destructive font-medium">{error}</p>
    </div>
  );
}


