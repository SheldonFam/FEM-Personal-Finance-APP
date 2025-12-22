"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  show?: boolean;
  onToggleVisibility?: () => void;
  error?: string;
}

/**
 * PasswordInput Component
 * A reusable password input field with show/hide toggle functionality
 *
 * Note: We wrap the Input component in a custom relative container
 * to position the toggle button correctly without shifting when errors appear.
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ show, onToggleVisibility, className, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <Input
        type={show ? "text" : "password"}
        ref={ref}
        className={`pr-12 ${className || ""}`}
        error={error}
        {...props}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onToggleVisibility}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-2 top-[5px] h-10 w-10 hover:bg-transparent"
      >
        <Image
          src={
            show
              ? "/assets/images/icon-hide-password.svg"
              : "/assets/images/icon-show-password.svg"
          }
          alt=""
          width={16}
          height={show ? 12 : 10}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
