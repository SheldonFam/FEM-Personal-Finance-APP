"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";

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

  return (
    <div className="flex h-screen bg-[var(--primary-light)]">
      <Suspense
        fallback={
          <aside
            className="hidden md:block w-[88px] bg-[#201F24] rounded-r-2xl"
            aria-label="Loading navigation"
          >
            <div className="animate-pulse p-4">
              <div className="h-8 bg-gray-700/50 rounded mb-6" />
              <div className="space-y-2">
                <div className="h-12 bg-gray-700/50 rounded" />
                <div className="h-12 bg-gray-700/50 rounded" />
                <div className="h-12 bg-gray-700/50 rounded" />
                <div className="h-12 bg-gray-700/50 rounded" />
              </div>
            </div>
          </aside>
        }
      >
        <Sidebar />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
