"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
    // Redirect to dashboard after successful login
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Marketing Section */}
      <div className="flex-1 bg-gray-900 flex flex-col justify-center px-12 lg:px-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold">finance</h1>
        </div>

        {/* Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-80 h-80">
            {/* Character */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {/* Character body */}
                <div className="w-16 h-20 bg-white rounded-full relative">
                  {/* Head */}
                  <div className="w-12 h-12 bg-orange-200 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2">
                    {/* Cap */}
                    <div className="w-14 h-8 bg-yellow-100 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  {/* Arms */}
                  <div className="w-4 h-8 bg-white rounded-full absolute -left-2 top-2 transform rotate-12"></div>
                  <div className="w-4 h-8 bg-white rounded-full absolute -right-2 top-2 transform -rotate-12"></div>
                  {/* Legs */}
                  <div className="w-4 h-8 bg-teal-300 rounded-full absolute -left-1 bottom-0"></div>
                  <div className="w-4 h-8 bg-teal-300 rounded-full absolute -right-1 bottom-0"></div>
                </div>
              </div>
            </div>

            {/* Money bill */}
            <div className="absolute top-8 right-8">
              <div className="w-24 h-12 bg-teal-300 rounded-lg relative">
                <div className="w-16 h-8 bg-yellow-100 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            {/* Motion lines */}
            <div className="absolute top-16 left-8 w-2 h-1 bg-white opacity-60"></div>
            <div className="absolute top-20 left-12 w-3 h-1 bg-white opacity-60"></div>
            <div className="absolute top-24 left-16 w-2 h-1 bg-white opacity-60"></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-md">
          <h2 className="text-white text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Keep track of your money and save for your future
          </h2>
          <p className="text-white text-lg opacity-90 leading-relaxed">
            Personal finance app puts you in control of your spending. Track
            transactions, set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-8">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Need to create an account?{" "}
              <Link
                href="/signup"
                className="text-gray-900 underline hover:no-underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
