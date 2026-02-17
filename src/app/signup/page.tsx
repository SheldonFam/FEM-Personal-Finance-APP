"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { FormField } from "@/components/Auth/FormField";
import { FormPasswordField } from "@/components/Auth/FormPasswordField";
import { FormConfirmPasswordField } from "@/components/Auth/FormConfirmPasswordField";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  AUTH_VALIDATION,
  PASSWORD_MIN_LENGTH,
  validatePasswordConfirmation,
} from "@/lib/validations/authValidation";
import { signUp } from "@/services/auth.service";
import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import {
  AUTH_BUTTON_CLASS,
  AUTH_LINK_CLASS,
} from "@/lib/constants/auth.constants";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * SignUpPage Component
 * Handles user registration and account creation
 */
export default function SignUpPage() {
  const router = useRouter();
  const { show: showPassword, toggle: togglePasswordVisibility } =
    usePasswordToggle();
  const { show: showConfirmPassword, toggle: toggleConfirmPasswordVisibility } =
    usePasswordToggle();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    try {
      const { name, email, password } = data;
      await signUp({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Sign up failed. Please try again.";
      setError(message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-finance-navy mb-8">Sign Up</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          register={register("name", AUTH_VALIDATION.name)}
          autoComplete="name"
        />

        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          register={register("email", AUTH_VALIDATION.email)}
          autoComplete="email"
        />

        <FormPasswordField
          label="Create Password"
          placeholder="Create a password"
          show={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          error={errors.password?.message}
          register={register("password", AUTH_VALIDATION.password)}
          helperText={`Passwords must be at least ${PASSWORD_MIN_LENGTH} characters`}
          autoComplete="new-password"
        />

        <FormConfirmPasswordField
          label="Confirm Password"
          placeholder="Confirm your password"
          show={showConfirmPassword}
          onToggleVisibility={toggleConfirmPasswordVisibility}
          error={errors.confirmPassword?.message}
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: validatePasswordConfirmation(password),
          })}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className={AUTH_BUTTON_CLASS}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <Link href="/login" className={AUTH_LINK_CLASS}>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
