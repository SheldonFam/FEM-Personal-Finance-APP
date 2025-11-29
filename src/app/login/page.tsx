"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthHeader from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  show?: boolean;
  onToggleVisibility?: () => void;
  error?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ show, onToggleVisibility, className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          type={show ? "text" : "password"}
          ref={ref}
          placeholder={props.placeholder || "Enter your password"}
          className={`pr-10 ${className || ""}`}
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

function MarketingPanel() {
  return (
    <div className="p-5 rounded-lg bg-[#f8f4f0] hidden lg:flex lg:w-2/5 xl:w-2/5">
      <div className="w-full h-full bg-[#201f24] relative overflow-hidden rounded-lg">
        {/* Logo at top */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8 xl:top-10 xl:left-10 z-10">
          <h1 className="text-white text-xl lg:text-2xl font-bold">finance</h1>
        </div>

        {/* Illustration - positioned absolutely to fill space */}
        <div className="flex items-center justify-center">
          <img
            src="/assets/images/illustration-authentication.svg"
            alt="Finance illustration"
            className="w-full h-full"
          />
        </div>

        {/* Text content at bottom */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 xl:bottom-10 xl:left-10 xl:right-10 z-10 max-w-md">
          <h2 className="text-white mb-4 lg:mb-6 font-bold text-2xl lg:text-3xl">
            Keep track of your money and save for your future
          </h2>
          <p className="text-white text-sm lg:text-base">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>
    </div>
  );
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Handle login logic here
      console.log("Login attempt:", data);
      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      // You can add toast notification here
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header for tablet view only */}
      <AuthHeader />

      <div className="flex-1 flex">
        {/* Left Column - Marketing Section - Hidden on tablet and mobile */}
        <MarketingPanel />

        {/* Right Column - Login Form */}
        <div className="flex-1 lg:w-3/5 bg-[#f8f4f0] flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8">
              <h2 className="text-2xl font-bold text-[#201f24] mb-8">Login</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                    error={errors.email?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <PasswordInput
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Enter your password"
                    show={showPassword}
                    onToggleVisibility={() => setShowPassword((prev) => !prev)}
                    error={errors.password?.message}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#201f24] hover:bg-[#2a2930] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Need to create an account?{" "}
                  <Link
                    href="/signup"
                    className="text-[#201f24] underline hover:no-underline font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
