"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
  required = false,
  className = "",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const toggleVisibility = () => setShow((prev) => !prev);

  return (
    <div className="relative w-full">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`pr-10 ${className}`}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleVisibility}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </Button>
    </div>
  );
}

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard";
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail((e.target as HTMLInputElement).value)
                    }
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#201f24] hover:bg-[#2a2930] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Login
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
