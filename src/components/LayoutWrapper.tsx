"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/sidebar";

const AUTH_ROUTES = ["/", "/login", "/signup", "/forgot-password"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[var(--primary-light)]">{children}</div>
    );
  }

  // FIX: Remove outer div, apply flex directly to the wrapper
  return (
    <div className="flex min-h-screen bg-[var(--primary-light)]">
      <Suspense
        fallback={
          <div className="w-[88px] lg:w-[300px] bg-gray-800 flex-shrink-0">
            <div className="animate-pulse p-4">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        <Sidebar />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
