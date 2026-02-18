"use client";

import React from "react";
import Image from "next/image";

/**
 * MarketingPanel Component
 * Displays the marketing content on authentication pages
 * Hidden on mobile and tablet, visible on desktop
 */
export function MarketingPanel() {
  return (
    <div className="p-5 rounded-lg bg-finance-beige hidden lg:flex lg:w-2/5 xl:w-2/5">
      <div className="w-full h-full bg-finance-navy relative overflow-hidden rounded-lg">
        {/* Logo at top */}
        <div className="absolute top-6 left-6 lg:top-8 lg:left-8 xl:top-10 xl:left-10 z-10">
          <h1 className="text-white text-xl lg:text-2xl font-bold">finance</h1>
        </div>

        {/* Illustration - positioned absolutely to fill space */}
        <div className="flex items-center justify-center">
          <Image
            src="/assets/images/illustration-authentication.svg"
            alt="Finance illustration"
            width={560}
            height={720}
            className="w-full h-full"
            loading="lazy"
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
