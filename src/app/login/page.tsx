"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { FormField } from "@/components/Auth/FormField";
import { FormPasswordField } from "@/components/Auth/FormPasswordField";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { AUTH_VALIDATION } from "@/lib/validations/authValidation";
import { login } from "@/services/auth.service";
import { usePasswordToggle } from "@/hooks/usePasswordToggle";
import {
  AUTH_BUTTON_CLASS,
  AUTH_LINK_CLASS,
} from "@/lib/constants/auth.constants";

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * LoginPage Component
 * Handles user authentication and login functionality
 */
export default function LoginPage() {
  const router = useRouter();
  const { show: showPassword, toggle: togglePasswordVisibility } =
    usePasswordToggle();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-[#201f24] mb-8">Login</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
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

        <FormPasswordField
          label="Password"
          placeholder="Enter your password"
          show={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          error={errors.password?.message}
          register={register("password", AUTH_VALIDATION.password)}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-[#201f24] underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={AUTH_BUTTON_CLASS}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Need to create an account?{" "}
          <Link href="/signup" className={AUTH_LINK_CLASS}>
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
