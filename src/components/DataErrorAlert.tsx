"use client";

import { Alert, AlertDescription } from "@/components/ui/Alert";

interface DataErrorAlertProps {
  message?: string;
}

export function DataErrorAlert({
  message = "Failed to load data. Please try refreshing the page.",
}: DataErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
