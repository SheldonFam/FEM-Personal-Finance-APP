"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import AuthHeader from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
    <div className="p-5 rounded-lg bg-[#f8f4f0] hidden lg:flex">
      <div className="w-full h-full bg-[#201f24] flex-col justify-between relative overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg"
          style={{
            backgroundImage:
              "url('/assets/images/illustration-authentication.svg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between h-full px-10">
          <div className="pt-10">
            <h1 className="text-white text-2xl font-bold">finance</h1>
          </div>
          <div className="pb-10 max-w-md">
            <h2 className="text-white text-3xl font-bold mb-6 leading-tight">
              Keep track of your money and save for your future
            </h2>
            <p className="text-white text-base opacity-90 leading-relaxed">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Handle sign up logic here
      console.log("Sign up attempt:", data);
      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Sign up failed:", error);
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

        {/* Right Column - Sign Up Form */}
        <div className="flex-1 lg:w-3/5 bg-[#f8f4f0] flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8">
              <h2 className="text-2xl font-bold text-[#201f24] mb-8">
                Sign Up
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                    error={errors.name?.message}
                  />
                </div>

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
                    Create Password
                  </Label>
                  <PasswordInput
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    placeholder="Create a password"
                    show={showPassword}
                    onToggleVisibility={() => setShowPassword((prev) => !prev)}
                    error={errors.password?.message}
                  />
                  <p className="text-sm text-gray-500">
                    Passwords must be at least 8 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#201f24] hover:bg-[#2a2930] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#201f24] underline hover:no-underline font-medium"
                  >
                    Login
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
