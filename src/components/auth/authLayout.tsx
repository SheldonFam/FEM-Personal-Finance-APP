"use client";

import React from "react";
import AuthHeader from "@/components/auth/authHeader";
import { MarketingPanel } from "@/components/auth/marketingPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout Component
 * Wrapper component for authentication pages (login/signup)
 * Provides consistent layout with header and marketing panel
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header for tablet view only */}
      <AuthHeader />

      <div className="flex-1 flex">
        {/* Left Column - Marketing Section - Hidden on tablet and mobile */}
        <MarketingPanel />

        {/* Right Column - Form Content */}
        <div className="flex-1 lg:w-3/5 bg-[#f8f4f0] flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
