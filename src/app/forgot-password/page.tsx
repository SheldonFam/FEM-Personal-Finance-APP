"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { FormField } from "@/components/Auth/FormField";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AUTH_VALIDATION } from "@/lib/validations/authValidation";
import { authService } from "@/services/auth.service";
import {
  AUTH_BUTTON_CLASS,
  AUTH_LINK_CLASS,
} from "@/lib/constants/auth.constants";

interface ForgotPasswordFormData {
  email: string;
}

/**
 * ForgotPasswordPage Component
 * Handles password reset requests
 */
export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    try {
      await authService.requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email.";
      setError(message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-[#201f24] mb-4">
        Forgot Password
      </h2>
      <p className="text-gray-600 text-sm mb-8">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>
            Password reset link sent! Check your email for instructions.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          register={register("email", AUTH_VALIDATION.email)}
        />

        <Button
          type="submit"
          disabled={isSubmitting || success}
          className={AUTH_BUTTON_CLASS}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Remember your password?{" "}
          <Link href="/login" className={AUTH_LINK_CLASS}>
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
