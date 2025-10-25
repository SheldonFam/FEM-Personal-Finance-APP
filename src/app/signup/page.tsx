"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt:", { name, email, password });
    // Redirect to dashboard after successful signup
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header for tablet view only */}
      <AuthHeader />

      <div className="flex-1 flex">
        {/* Left Column - Marketing Section - Hidden on tablet and mobile */}
        <div className="p-5 rounded-lg bg-[#f8f4f0]">
          <div className="hidden lg:flex w-full h-full bg-[#201f24] flex-col justify-between relative overflow-hidden rounded-lg">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-lg"
              style={{
                backgroundImage:
                  "url('/assets/images/illustration-authentication.svg')",
                backgroundSize: "contain",
                backgroundPosition: "center",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full px-10">
              {/* Logo */}
              <div className="pt-10">
                <h1 className="text-white text-2xl font-bold">finance</h1>
              </div>

              {/* Text Content - Positioned at bottom */}
              <div className="pb-10 max-w-md">
                <h2 className="text-white text-3xl font-bold mb-6 leading-tight">
                  Keep track of your money and save for your future
                </h2>
                <p className="text-white text-base opacity-90 leading-relaxed">
                  Personal finance app puts you in control of your spending.
                  Track transactions, set budgets, and add to savings pots
                  easily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sign Up Form */}
        <div className="flex-1 lg:w-3/5 bg-[#f8f4f0] flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#201f24] mb-8">
                Sign Up
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#201f24] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Passwords must be at least 8 characters
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#201f24] hover:bg-[#2a2930] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Create Account
                </button>
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
