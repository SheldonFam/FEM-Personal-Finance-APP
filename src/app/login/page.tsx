"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
 * LoginForm Component
 * Handles user authentication and login functionality
 * Separated to allow Suspense boundary for useSearchParams
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show: showPassword, toggle: togglePasswordVisibility } =
    usePasswordToggle();
  const [error, setError] = useState<string | null>(null);

  // Get the callback URL from query params (set by middleware when redirecting from protected routes)
  // Validate that callbackUrl is a relative path to prevent open redirect attacks
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl && rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/dashboard";

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
      // Redirect to original destination or dashboard
      router.push(callbackUrl);
      router.refresh(); // Refresh to revalidate session in middleware
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
          autoComplete="email"
        />

        <FormPasswordField
          label="Password"
          placeholder="Enter your password"
          show={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          error={errors.password?.message}
          register={register("password", AUTH_VALIDATION.password)}
          autoComplete="current-password"
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

/**
 * LoginPage Component
 * Wraps LoginForm in Suspense boundary for useSearchParams compatibility
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <h2 className="text-2xl font-bold text-[#201f24] mb-8">Login</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </AuthLayout>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
