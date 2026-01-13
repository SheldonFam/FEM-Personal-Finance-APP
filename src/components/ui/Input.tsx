import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, type, ...props }, ref) => {
    const inputId = props.id || props.name || `input-${React.useId()}`;
    const errorId = `${inputId}-error`;
    const labelId = `${inputId}-label`;

    return (
      <div className="space-y-1 w-full">
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className="block text-xs font-bold text-muted-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {prefix}
            </span>
          )}
          <input
            {...props}
            id={inputId}
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-border bg-background px-5 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              prefix && "pl-8",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : undefined}
            aria-labelledby={label ? labelId : undefined}
          />
        </div>
        {error && (
          <p
            id={errorId}
            className="text-xs text-destructive font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
